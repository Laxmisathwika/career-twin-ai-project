export interface StudentUser {
  id: string;
  email: string;
  fullName: string;
  rollNumber: string;
  college: string;
  department: string;
  academicYear: string;
  semester: string;
  cgpa: number;
  bio?: string;
  avatarUrl?: string;
  targetRole?: string;
  skills: string[];
  interests: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  createdAt: string;
}

export interface CareerAssessmentQuestion {
  id: number;
  category: 'interests' | 'skills' | 'workStyle' | 'subject' | 'goals';
  question: string;
  description: string;
  options: {
    label: string;
    description: string;
    dimensionScores: {
      aiMl: number;
      fullstack: number;
      cloudDevops: number;
      dataScience: number;
      cybersecurity: number;
      productDesign: number;
    };
  }[];
}

export interface AssessmentResult {
  id: string;
  date: string;
  overallScore: number;
  dimensions: {
    aiMl: number;
    fullstack: number;
    cloudDevops: number;
    dataScience: number;
    cybersecurity: number;
    productDesign: number;
  };
  topRecommendations: CareerRecommendation[];
  personalitySummary: string;
  recommendedElectives: string[];
}

export interface CareerRecommendation {
  id: string;
  title: string;
  matchScore: number;
  rationale: string;
  requiredSkills: string[];
  typicalResponsibilities: string[];
  startingSalaryRange: string;
  immediateNextSteps: string[];
  domain: string;
}

export interface RoadmapTask {
  id: string;
  careerId: string;
  stage: 'Stage 1: Foundations' | 'Stage 2: Core & Frameworks' | 'Stage 3: Advanced Systems' | 'Stage 4: Industry Readiness';
  title: string;
  description: string;
  estimatedHours: number;
  skillsLearned: string[];
  isCompleted: boolean;
  resourceTitle?: string;
  resourceUrl?: string;
  isCustom?: boolean;
}

export interface InterviewQuestion {
  id: string;
  role: string;
  category: 'Technical' | 'ML Theory' | 'System Design' | 'Behavioral' | 'Campus Placement';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  context: string;
  keyConcepts: string[];
  sampleAnswer: string;
}

export interface InterviewFeedback {
  scoreOverall: number;
  scores: {
    relevance: number;
    clarity: number;
    completeness: number;
    technicalDepth: number;
  };
  strengths: string[];
  areasForImprovement: string[];
  sampleAnswer: string;
  followUpQuestion?: string;
}

export interface InterviewSession {
  id: string;
  timestamp: string;
  questionId: string;
  questionText: string;
  role: string;
  category: string;
  userAnswer: string;
  timeSpentSeconds: number;
  feedback: InterviewFeedback;
  isLiveAI: boolean;
}

export interface ResumeData {
  id: string;
  userId: string;
  updatedAt: string;
  template: 'classic' | 'modern' | 'minimal';
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
    summary: string;
  };
  education: {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    gradeOrCgpa: string;
    highlights: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  experience: {
    id: string;
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }[];
  projects: {
    id: string;
    title: string;
    technologies: string[];
    link: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    date: string;
    credentialUrl: string;
  }[];
  achievements: string[];
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  logoText: string;
  location: string;
  type: 'Full-time' | 'Internship';
  workplace: 'Remote' | 'On-site' | 'Hybrid';
  domain: string;
  stipendOrSalary: string;
  deadline: string;
  requirements: string[];
  description: string;
  applyUrl: string;
  isCampusDrive?: boolean;
  isSaved?: boolean;
  applicationStatus?: 'Saved' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isLiveAI?: boolean;
}
