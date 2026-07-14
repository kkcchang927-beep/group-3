export interface StudentProfile {
  gpa: number;
  sat?: number;
  act?: number;
  budget: 'low' | 'medium' | 'high' | 'any';
  locationPreference: string[]; // e.g., ["Northeast", "West Coast", "South", "Midwest"]
  campusSize: string[]; // e.g., ["Small", "Medium", "Large"]
  major: string;
  interests: string[]; // e.g., ["Research", "Arts", "Sports", "Entrepreneurship", "Social Activism"]
}

export interface College {
  id: string;
  name: string;
  location: string;
  region: string;
  type: 'Public' | 'Private';
  acceptanceRate: number; // e.g., 0.05 for 5%
  averageCost: number; // annual net price
  size: 'Small' | 'Medium' | 'Large';
  rank: string;
  image: string;
  topMajors: string[];
  description: string;
  admissionVibe: string;
}

export interface FitAnalysis {
  category: 'Reach' | 'Target' | 'Safety';
  admissionProbability: number; // e.g., 12 for 12%
  fitScore: number; // 0-100
  whyItFits: string[];
  academicFit: string;
  socialFit: string;
  financialFit: string;
  applicationStrategy: string;
  tipsToStandOut: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'advisor';
  text: string;
  timestamp: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: {
    value: string;
    label: string;
    description: string;
  }[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface SavedCollege {
  collegeId: string;
  category: 'Reach' | 'Target' | 'Safety';
  checklist: ChecklistItem[];
}
