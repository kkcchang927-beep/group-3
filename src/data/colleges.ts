import { College, QuizQuestion } from '../types';

export const COLLEGES: College[] = [
  {
    id: 'stanford',
    name: 'Stanford University',
    location: 'Stanford, CA',
    region: 'West Coast',
    type: 'Private',
    acceptanceRate: 0.04,
    averageCost: 22000,
    size: 'Large',
    rank: '#3 National Universities',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
    topMajors: ['Computer Science', 'Human Biology', 'Economics', 'Engineering'],
    description: 'Located in the heart of Silicon Valley, Stanford is known for its entrepreneurial spirit, academic excellence, and beautiful mission-style campus. It fosters a vibe of creative innovation coupled with intense academic curiosity.',
    admissionVibe: 'Extremely selective. Looks for unique intellectual vitality, outstanding extracurricular achievements, and personal impact.'
  },
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology (MIT)',
    location: 'Cambridge, MA',
    region: 'Northeast',
    type: 'Private',
    acceptanceRate: 0.045,
    averageCost: 20000,
    size: 'Medium',
    rank: '#2 National Universities',
    image: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=1200',
    topMajors: ['Computer Science', 'Mechanical Engineering', 'Mathematics', 'Physics'],
    description: 'MIT is a world-renowned center for scientific and technological research. Its culture is famously collaborative, hands-on, and quirky, encapsulated by its motto \"Mens et Manus\" (Mind and Hand) and its famous student "hacks".',
    admissionVibe: 'Extremely selective. Values a collaborative spirit, passion for hands-on problem-solving, and a high level of proficiency in STEM fields.'
  },
  {
    id: 'harvard',
    name: 'Harvard University',
    location: 'Cambridge, MA',
    region: 'Northeast',
    type: 'Private',
    acceptanceRate: 0.034,
    averageCost: 19500,
    size: 'Medium',
    rank: '#1 National Universities',
    image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&q=80&w=1200',
    topMajors: ['Economics', 'Government', 'Computer Science', 'History'],
    description: 'As the oldest institution of higher learning in the US, Harvard offers unparalleled prestige, an enormous endowment, and historic Ivy League tradition. Its residential house system encourages a close-knit intellectual community.',
    admissionVibe: 'Extremely selective. Looks for deep leadership potential, stellar academic rigor, and students who will make a global impact.'
  },
  {
    id: 'uc-berkeley',
    name: 'University of California, Berkeley',
    location: 'Berkeley, CA',
    region: 'West Coast',
    type: 'Public',
    acceptanceRate: 0.11,
    averageCost: 18000,
    size: 'Large',
    rank: '#15 National Universities',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200',
    topMajors: ['Computer Science', 'Cell Biology', 'Economics', 'Political Science'],
    description: 'UC Berkeley is the flagship public university of California, famous for its history of social activism, dozens of Nobel Laureates, and premier academic departments. The campus atmosphere is vibrant, intellectually intense, and diverse.',
    admissionVibe: 'Highly competitive. Values public service, resilience, diverse perspectives, and high academic performance relative to high school context.'
  },
  {
    id: 'ut-austin',
    name: 'University of Texas at Austin',
    location: 'Austin, TX',
    region: 'South',
    type: 'Public',
    acceptanceRate: 0.29,
    averageCost: 17500,
    size: 'Large',
    rank: '#32 National Universities',
    image: 'https://images.unsplash.com/photo-153264953769b-7b1400def795?auto=format&fit=crop&q=80&w=1200',
    topMajors: ['Business Administration', 'Engineering', 'Computer Science', 'Biology'],
    description: 'Texas Longhorn culture runs deep in this massive, energetic research institution located in Austin, a top tech and music hub. UT Austin offers elite business and engineering programs coupled with legendary school spirit.',
    admissionVibe: 'Very competitive, especially for out-of-state students. Demands strong academic transcripts, leadership, and essay alignment with chosen majors.'
  },
  {
    id: 'nyu',
    name: 'New York University',
    location: 'New York, NY',
    region: 'Northeast',
    type: 'Private',
    acceptanceRate: 0.08,
    averageCost: 38000,
    size: 'Large',
    rank: '#35 National Universities',
    image: 'https://images.unsplash.com/photo-1607237138185-eedd996c5c0c?auto=format&fit=crop&q=80&w=1200',
    topMajors: ['Visual & Performing Arts', 'Business/Finance', 'Social Sciences', 'Nursing'],
    description: 'With no traditional closed campus, NYU is deeply integrated into New York City, particularly Greenwich Village. Students are independent, creative, and highly ambitious, taking full advantage of urban internship opportunities.',
    admissionVibe: 'Highly selective. Looks for self-directed, urban-vibe students with a creative edge, global perspective, and strong professional drive.'
  },
  {
    id: 'uw-seattle',
    name: 'University of Washington',
    location: 'Seattle, WA',
    region: 'West Coast',
    type: 'Public',
    acceptanceRate: 0.48,
    averageCost: 16000,
    size: 'Large',
    rank: '#40 National Universities',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1200',
    topMajors: ['Computer Science', 'Biomedical Sciences', 'Business', 'Communication'],
    description: 'Set against the beautiful backdrop of Mt. Rainier and famous for its cherry blossoms, UW Seattle is a public powerhouse in research, computer science, and medicine, highly plugged into Seattle\'s thriving tech industry.',
    admissionVibe: 'Competitive (CS and Engineering are extremely selective direct-to-major). Focuses heavily on academic preparation, personal story, and community engagement.'
  },
  {
    id: 'williams',
    name: 'Williams College',
    location: 'Williamstown, MA',
    region: 'Northeast',
    type: 'Private',
    acceptanceRate: 0.085,
    averageCost: 21000,
    size: 'Small',
    rank: '#1 National Liberal Arts',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200',
    topMajors: ['Mathematics', 'Economics', 'English', 'Biology'],
    description: 'Williams is a highly prestigious, small liberal arts college tucked in the scenic Berkshires. It uses an Oxford-style tutorial system where students study in pairs with a professor, creating an incredibly tight academic bond.',
    admissionVibe: 'Highly selective. Looks for deep intellectual passion, love for discussions, and students who will contribute to a tight-knit residential community.'
  },
  {
    id: 'gatech',
    name: 'Georgia Institute of Technology',
    location: 'Atlanta, GA',
    region: 'South',
    type: 'Public',
    acceptanceRate: 0.17,
    averageCost: 15500,
    size: 'Large',
    rank: '#33 National Universities',
    image: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=1200',
    topMajors: ['Computer Science', 'Mechanical Engineering', 'Industrial Engineering', 'Aerospace Engineering'],
    description: 'Georgia Tech is a premier public research university focused heavily on technology and engineering. Located in midtown Atlanta, it offers elite, highly-ranked programs with excellent cooperative education (co-op) opportunities.',
    admissionVibe: 'Highly competitive. Demands strong math/science background, innovative thinking, and commitment to technological progress.'
  },
  {
    id: 'u-michigan',
    name: 'University of Michigan',
    location: 'Ann Arbor, MI',
    region: 'Midwest',
    type: 'Public',
    acceptanceRate: 0.18,
    averageCost: 18500,
    size: 'Large',
    rank: '#21 National Universities',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200',
    topMajors: ['Business Administration', 'Computer Science', 'Psychology', 'Mechanical Engineering'],
    description: 'U-Mich is a legendary public institution that perfectly balances elite academic programs, massive research funding, and phenomenal athletic culture (the \"Big House\"). Ann Arbor is the quintessential college town.',
    admissionVibe: 'Highly selective. Values outstanding academic transcripts, solid leadership in school/community, and strong \"Why Michigan\" essays.'
  },
  {
    id: 'pomona',
    name: 'Pomona College',
    location: 'Claremont, CA',
    region: 'West Coast',
    type: 'Private',
    acceptanceRate: 0.07,
    averageCost: 19000,
    size: 'Small',
    rank: '#3 National Liberal Arts',
    image: 'https://images.unsplash.com/photo-1622397333309-30564018d53c?auto=format&fit=crop&q=80&w=1200',
    topMajors: ['Computer Science', 'Economics', 'Mathematics', 'Molecular Biology'],
    description: 'The founding member of the Claremont Colleges consortium, Pomona offers the resources of a larger university system combined with the intimacy of a top-tier small liberal arts college, all under the sunny skies of Southern California.',
    admissionVibe: 'Highly selective. Values cross-disciplinary interests, collaboration, empathy, and unique talents.'
  },
  {
    id: 'northwestern',
    name: 'Northwestern University',
    location: 'Evanston, IL',
    region: 'Midwest',
    type: 'Private',
    acceptanceRate: 0.07,
    averageCost: 24000,
    size: 'Medium',
    rank: '#9 National Universities',
    image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=1200',
    topMajors: ['Journalism', 'Economics', 'Communication', 'Mechanical Engineering'],
    description: 'Located right on the shore of Lake Michigan just north of Chicago, Northwestern is unique in combining Big Ten athletics with Ivy League-level academics. It is home to the world-famous Medill School of Journalism.',
    admissionVibe: 'Highly selective. Looks for analytical skills, creative achievements, and robust school/civic leadership.'
  },
  {
    id: 'vanderbilt',
    name: 'Vanderbilt University',
    location: 'Nashville, TN',
    region: 'South',
    type: 'Private',
    acceptanceRate: 0.06,
    averageCost: 22500,
    size: 'Medium',
    rank: '#18 National Universities',
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=1200',
    topMajors: ['Economics', 'Computer Science', 'Human & Organizational Development', 'Neuroscience'],
    description: 'Vanderbilt offers a park-like campus inside Nashville, the music capital of the South. Known for its strong academic spirit, it is also famous for having some of the happiest students in the country and a vibrant social scene.',
    admissionVibe: 'Highly selective. Looks for high-achieving students with a balance of intense academic preparation, collaborative vibes, and warm social engagement.'
  },
  {
    id: 'purdue',
    name: 'Purdue University',
    location: 'West Lafayette, IN',
    region: 'Midwest',
    type: 'Public',
    acceptanceRate: 0.53,
    averageCost: 12500,
    size: 'Large',
    rank: '#43 National Universities',
    image: 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&q=80&w=1200',
    topMajors: ['Aerospace Engineering', 'Mechanical Engineering', 'Computer Science', 'Agricultural Sciences'],
    description: 'Nicknamed the \"Cradle of Astronauts\" (alma mater of Neil Armstrong), Purdue is a massive public university known worldwide for its premier aerospace, engineering, and technology programs, offered at a remarkably low tuition-frozen cost.',
    admissionVibe: 'Competitive. Focuses on academic transcripts, deep math readiness for STEM, and technical curiosity.'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'campus_size',
    text: 'What kind of community size makes you feel most inspired?',
    options: [
      {
        value: 'Small',
        label: 'Tight-knit & Intimate (under 3,000 students)',
        description: 'You want to know your professors by first name and walk across campus greeting familiar faces.'
      },
      {
        value: 'Medium',
        label: 'Balanced & Cozy (3,000 - 15,000 students)',
        description: 'The sweet spot. Large enough to have diverse groups, small enough to maintain close community ties.'
      },
      {
        value: 'Large',
        label: 'Energetic & Bustling (15,000+ students)',
        description: 'You want a buzzing city-within-a-city feel, massive resources, big sports, and infinite pathways.'
      }
    ]
  },
  {
    id: 'college_type',
    text: 'How do you see yourself paying for and experiencing college?',
    options: [
      {
        value: 'Public',
        label: 'Public Research Flagships',
        description: 'Vast research opportunities, local/state pride, lower instate costs, and strong athletic school spirit.'
      },
      {
        value: 'Private',
        label: 'Private Academies / Liberal Arts',
        description: 'Generous financial aid packages, smaller classes, global endowments, and highly personalized advising.'
      },
      {
        value: 'any',
        label: 'No Preference / Open to Both',
        description: 'Show me any school that matches my majors and vibes perfectly, regardless of funding structure.'
      }
    ]
  },
  {
    id: 'vibe',
    text: 'Choose the visual and lifestyle setting that appeals most to you:',
    options: [
      {
        value: 'Northeast',
        label: 'Historic Ivory Coast & Four Seasons (Northeast)',
        description: 'Classic red-brick buildings, ivy-covered walls, rich historic heritage, and crisp autumn foliage.'
      },
      {
        value: 'West Coast',
        label: 'Sunny, Modern Tech & Outdoor Freedom (West)',
        description: 'Innovative startup energy, sun, coastal breezes, and immediate access to mountains or beaches.'
      },
      {
        value: 'South',
        label: 'Warm Southern Hospitality & Strong School Spirit',
        description: 'Deep school traditions, massive game days, sun-drenched campuses, and supportive community vibes.'
      },
      {
        value: 'Midwest',
        label: 'Classic College Towns & Industrial Heart (Midwest)',
        description: 'Quintessential friendly college-centric towns, lake-side campuses, and deep-set academic flagships.'
      }
    ]
  },
  {
    id: 'primary_goal',
    text: 'What is your primary goal for your undergraduate experience?',
    options: [
      {
        value: 'Entrepreneurship',
        label: 'Startup Vibe & Entrepreneurship',
        description: 'You want to build projects, launch companies, and network with investors and tech founders.'
      },
      {
        value: 'Research',
        label: 'Scientific Discovery & Pure Research',
        description: 'You want to work in labs alongside top-tier scientists, co-author papers, and prepare for a Ph.D.'
      },
      {
        value: 'Arts',
        label: 'Creative Expression & Visual Arts',
        description: 'You want to design, perform, write, and explore humanity in a vibrant artistic environment.'
      },
      {
        value: 'Social Activism',
        label: 'Social Justice & Civic Leadership',
        description: 'You want to stand up for causes, lead policy initiatives, and make an active impact on public systems.'
      }
    ]
  }
];
