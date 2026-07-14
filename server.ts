import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini API client to prevent crashing on boot if key is missing
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      throw new Error('GEMINI_API_KEY is not configured. Please add your Gemini API key in the Secrets panel.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. College Match Endpoint
// Takes a student profile and quiz answers, uses Gemini to select/rank compatible schools
// and optionally suggest custom matching schools from outside the preloaded list.
app.post('/api/match', async (req, res) => {
  try {
    const { profile, preloadedColleges } = req.body;
    const ai = getAI();

    const systemInstruction = `You are an elite high school college counselor and university matching algorithm. 
Your goal is to analyze a student's academic profile (GPA, standardized test scores), financial preferences, campus size preference, geographical region preference, intended majors, and personal interests.
Rank the provided preloaded colleges based on how well they fit the student, and suggest exactly 2 or 3 ADDITIONAL real, famous US colleges that fit the student exceptionally well but are NOT in the preloaded list.

Provide a detailed match score (0 to 100) and a supportive, brief reason explaining why each school fits their vibe, major, or academic profile.
For additional suggested colleges, provide complete, accurate details according to the college schema. Make sure the average net price (averageCost) is an realistic integer.
Ensure all recommended options are realistic but aspirational for the student's profile.
GPA is on a 4.0 scale. SAT is on a 1600 scale. ACT is on a 36 scale.`;

    const prompt = `Student Profile:
- GPA: ${profile.gpa}
- SAT: ${profile.sat || 'Not taken'}
- ACT: ${profile.act || 'Not taken'}
- Annual Budget Level: ${profile.budget} (low: seeks high financial aid or cheaper public schools, medium, high, any)
- Preferred Regions: ${JSON.stringify(profile.locationPreference)}
- Preferred Campus Sizes: ${JSON.stringify(profile.campusSize)}
- Intended Major: ${profile.major}
- Key Extracurricular / Campus Interests: ${JSON.stringify(profile.interests)}

Preloaded Colleges to evaluate and rank:
${JSON.stringify(preloadedColleges.map((c: any) => ({ id: c.id, name: c.name, location: c.location, region: c.region, size: c.size, type: c.type, topMajors: c.topMajors, description: c.description })))}

Please evaluate the matching status. Output a JSON object matching the defined responseSchema containing the matching list (containing some of the preloaded colleges that fit, and exactly 2 or 3 additional colleges from outside the list with 'isCustom: true' and full custom data).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matches: {
              type: Type.ARRAY,
              description: 'List of college matches containing evaluated preloaded colleges and 2-3 newly suggested custom colleges.',
              items: {
                type: Type.OBJECT,
                required: ['collegeId', 'isCustom', 'matchScore', 'matchReason'],
                properties: {
                  collegeId: {
                    type: Type.STRING,
                    description: 'The ID of the preloaded college (e.g. \"stanford\") or a newly generated unique snake_case ID for a custom college (e.g. \"yale\").'
                  },
                  isCustom: {
                    type: Type.BOOLEAN,
                    description: 'True if this is an additional college suggested by the AI that was not in the preloaded list; false if it was in the preloaded list.'
                  },
                  customData: {
                    type: Type.OBJECT,
                    description: 'Mandatory if isCustom is true. Full details of the suggested university.',
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      location: { type: Type.STRING, description: 'City and State, e.g. New Haven, CT' },
                      region: { type: Type.STRING, description: 'Northeast, West Coast, South, or Midwest' },
                      type: { type: Type.STRING, description: 'Public or Private' },
                      acceptanceRate: { type: Type.NUMBER, description: 'Acceptance rate as decimal, e.g. 0.06' },
                      averageCost: { type: Type.INTEGER, description: 'Estimated annual net price, e.g. 21000' },
                      size: { type: Type.STRING, description: 'Small, Medium, or Large' },
                      rank: { type: Type.STRING, description: 'e.g. #5 National Universities' },
                      image: { type: Type.STRING, description: 'A realistic Unsplash image URL representing a college campus' },
                      topMajors: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      description: { type: Type.STRING },
                      admissionVibe: { type: Type.STRING }
                    }
                  },
                  matchScore: {
                    type: Type.INTEGER,
                    description: 'Vibe and major fit percentage from 0 to 100.'
                  },
                  matchReason: {
                    type: Type.STRING,
                    description: 'A friendly, highly personalized sentence explaining why this school fits their specific profile, GPA, budget, size, location, and major choice.'
                  }
                }
              }
            }
          }
        }
      }
    });

    const resultText = response.text || '{}';
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error('Error in /api/match:', error);
    res.status(500).json({ error: error.message || 'Failed to match colleges.' });
  }
});

// 2. Fit Analysis Endpoint
// Evaluates target/reach/safety categories, estimated probability, and fits across academics/social/finances
app.post('/api/fit-analysis', async (req, res) => {
  try {
    const { college, profile } = req.body;
    const ai = getAI();

    const systemInstruction = `You are a professional college counselor and admissions analyst.
Analyze the student's profile against the target college to determine:
1. Vibe/Academic Category: 'Reach' (highly selective or student's GPA/scores are near/below average), 'Target' (student's stats are fully matching/above average), or 'Safety' (student's stats are significantly above average or high acceptance rate).
2. Estimated Admission Probability: A realistic percentage chance (e.g., highly selective Ivies are rarely above 15% even for 4.0 students, whereas state colleges might be 60-80%).
3. Personal Fit Score (0 to 100) based on student major, budget, size, and location preferences.
4. Specific fits: Academic fit (how well majors/research match), Social fit (campus environment, size, culture vs interests), Financial fit (cost vs budget, aid eligibility).
5. Actionable application strategies and highly customized tips to stand out.`;

    const prompt = `College Details:
- Name: ${college.name}
- Location: ${college.location}
- Acceptance Rate: ${college.acceptanceRate * 100}%
- Typical Net Price: $${college.averageCost}/yr
- Size: ${college.size}
- Top Majors: ${JSON.stringify(college.topMajors)}
- Description: ${college.description}
- Admission Vibe: ${college.admissionVibe}

Student Profile:
- GPA: ${profile.gpa}
- SAT: ${profile.sat || 'Not taken'}
- ACT: ${profile.act || 'Not taken'}
- Budget Level: ${profile.budget}
- Preferred Majors: ${profile.major}
- Extracurriculars/Interests: ${JSON.stringify(profile.interests)}

Please analyze this college fit. Output a JSON object matching the defined responseSchema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['category', 'admissionProbability', 'fitScore', 'whyItFits', 'academicFit', 'socialFit', 'financialFit', 'applicationStrategy', 'tipsToStandOut'],
          properties: {
            category: {
              type: Type.STRING,
              description: 'Whether this school is a Reach, Target, or Safety for the student.'
            },
            admissionProbability: {
              type: Type.INTEGER,
              description: 'Realistic percentage chance (1 to 99) of being accepted based on stats and acceptance rate.'
            },
            fitScore: {
              type: Type.INTEGER,
              description: 'Personal alignment score from 0 to 100 based on preferred location, size, major, and budget.'
            },
            whyItFits: {
              type: Type.ARRAY,
              description: '3 bullet points summarizing why this is a great school for them.',
              items: { type: Type.STRING }
            },
            academicFit: {
              type: Type.STRING,
              description: 'Analysis of how their major, research options, and classes match academic interests.'
            },
            socialFit: {
              type: Type.STRING,
              description: 'Analysis of student life, size, extracurricular clubs, and surrounding city vibes vs their interests.'
            },
            financialFit: {
              type: Type.STRING,
              description: 'Analysis of affordability, net price, standard financial aid, or out-of-state considerations.'
            },
            applicationStrategy: {
              type: Type.STRING,
              description: 'Overall strategic advice: e.g., should they apply Early Decision, Early Action, or Regular Decision? Which essay topic to emphasize?'
            },
            tipsToStandOut: {
              type: Type.ARRAY,
              description: '3 highly specific, creative recommendations of what they can do during high school to stand out in the application.',
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const resultText = response.text || '{}';
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error('Error in /api/fit-analysis:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze college fit.' });
  }
});

// 3. Advisor Chat Endpoint
// General advisory helper answering college preparation questions
app.post('/api/advisor-chat', async (req, res) => {
  try {
    const { messages, profile, savedColleges } = req.body;
    const ai = getAI();

    const systemInstruction = `You are \"Admissions Coach Clara\", a warm, highly encouraging, and incredibly knowledgeable College Admissions Advisor.
Your job is to guide high school students through the complex process of finding their dream school, building college applications, writing college essays, selecting extracurriculars, and managing stressful deadlines.

Student Profile context:
- GPA: ${profile?.gpa || '3.5'}
- SAT: ${profile?.sat || 'Not provided'}
- ACT: ${profile?.act || 'Not provided'}
- Target Major: ${profile?.major || 'Undecided'}
- Interests: ${profile?.interests ? JSON.stringify(profile.interests) : 'Not provided'}
- Saved Schools: ${savedColleges && savedColleges.length > 0 ? JSON.stringify(savedColleges.map((c: any) => c.name)) : 'None saved yet'}

Guidelines:
- Maintain a highly supportive, knowledgeable, and mentor-like tone.
- Give concrete, realistic, and structural advice. Use bullet points and paragraphs for readability.
- When giving college recommendations, explain the "why".
- Do not repeat student information directly in a dry way; integrate it naturally (e.g. \"With your passion for ${profile?.major || 'your major'}, let's look at how...\").
- Offer strategic insights about essays, letters of recommendation, portfolios, or interviews if relevant.
- Keep responses relatively concise, warm, and highly structured (150-300 words).`;

    // Map chat history into the structure for content generation
    const chatContents = messages.map((m: any) => {
      return {
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      };
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: chatContents,
      config: {
        systemInstruction,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Error in /api/advisor-chat:', error);
    res.status(500).json({ error: error.message || 'Failed to generate advisory response.' });
  }
});

// Integrate Vite middleware or serve static production assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
