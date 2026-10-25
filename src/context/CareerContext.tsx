import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AssessmentResult,
  RoadmapTask,
  JobListing,
  InterviewSession,
  ResumeData,
  CareerRecommendation,
} from '../types';
import {
  INITIAL_ROADMAP_TASKS,
  VERIFIED_JOB_LISTINGS,
  DEFAULT_RESUME,
  CAREER_RECOMMENDATIONS_DATABASE,
} from '../data/mockData';
import { checkServerStatus, ServerStatus } from '../services/aiService';

interface CareerContextType {
  latestAssessment: AssessmentResult | null;
  assessmentHistory: AssessmentResult[];
  saveAssessment: (result: AssessmentResult) => void;
  roadmapTasks: RoadmapTask[];
  toggleTask: (taskId: string) => void;
  addTask: (task: Omit<RoadmapTask, 'id'>) => void;
  deleteTask: (taskId: string) => void;
  resetRoadmap: () => void;
  jobs: JobListing[];
  toggleSaveJob: (jobId: string) => void;
  updateJobStatus: (jobId: string, status: JobListing['applicationStatus'], notes?: string) => void;
  addCustomJob: (job: Partial<JobListing>) => void;
  interviewSessions: InterviewSession[];
  saveInterviewSession: (session: InterviewSession) => void;
  resume: ResumeData;
  updateResume: (newResume: ResumeData) => void;
  resetResume: () => void;
  serverStatus: ServerStatus | null;
  refreshServerStatus: () => Promise<void>;
  activeRecommendation: CareerRecommendation;
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ASSESSMENT: 'career_twin_assessment_v1',
  HISTORY: 'career_twin_history_v1',
  ROADMAP: 'career_twin_roadmap_v1',
  JOBS: 'career_twin_jobs_v1',
  INTERVIEWS: 'career_twin_interviews_v1',
  RESUME: 'career_twin_resume_v1',
};

const DEFAULT_ASSESSMENT: AssessmentResult = {
  id: 'assess-default-init',
  date: 'Oct 24, 2026',
  overallScore: 92,
  dimensions: {
    aiMl: 94,
    fullstack: 88,
    dataScience: 86,
    cloudDevops: 82,
    cybersecurity: 70,
    productDesign: 76,
  },
  topRecommendations: [
    CAREER_RECOMMENDATIONS_DATABASE['ai-ml-engineer'],
    CAREER_RECOMMENDATIONS_DATABASE['fullstack-developer'],
    CAREER_RECOMMENDATIONS_DATABASE['data-scientist'],
    CAREER_RECOMMENDATIONS_DATABASE['cloud-devops-engineer'],
  ],
  personalitySummary: 'Analytical builder driven by model optimization, deep learning architecture, and robust web APIs. Demonstrates high readiness for 2026–2027 campus hiring.',
  recommendedElectives: [
    'Deep Learning & NLP (CSM Core)',
    'Cloud Architecture & Microservices',
    'High-Performance Distributed Databases',
  ],
};

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);

  const refreshServerStatus = async () => {
    const status = await checkServerStatus();
    setServerStatus(status);
  };

  useEffect(() => {
    refreshServerStatus();
  }, []);

  // Assessment State
  const [latestAssessment, setLatestAssessment] = useState<AssessmentResult | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ASSESSMENT);
      return stored ? JSON.parse(stored) : DEFAULT_ASSESSMENT;
    } catch {
      return DEFAULT_ASSESSMENT;
    }
  });

  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return stored ? JSON.parse(stored) : [DEFAULT_ASSESSMENT];
    } catch {
      return [DEFAULT_ASSESSMENT];
    }
  });

  const saveAssessment = (result: AssessmentResult) => {
    setLatestAssessment(result);
    setAssessmentHistory((prev) => [result, ...prev]);
    localStorage.setItem(STORAGE_KEYS.ASSESSMENT, JSON.stringify(result));
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([result, ...assessmentHistory]));
  };

  // Roadmap State
  const [roadmapTasks, setRoadmapTasks] = useState<RoadmapTask[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ROADMAP);
      return stored ? JSON.parse(stored) : INITIAL_ROADMAP_TASKS;
    } catch {
      return INITIAL_ROADMAP_TASKS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(roadmapTasks));
  }, [roadmapTasks]);

  const toggleTask = (taskId: string) => {
    setRoadmapTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const addTask = (taskData: Omit<RoadmapTask, 'id'>) => {
    const newTask: RoadmapTask = {
      ...taskData,
      id: 'task-custom-' + Date.now(),
      isCustom: true,
    };
    setRoadmapTasks((prev) => [newTask, ...prev]);
  };

  const deleteTask = (taskId: string) => {
    setRoadmapTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const resetRoadmap = () => {
    setRoadmapTasks(INITIAL_ROADMAP_TASKS);
    localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(INITIAL_ROADMAP_TASKS));
  };

  // Jobs State
  const [jobs, setJobs] = useState<JobListing[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.JOBS);
      return stored ? JSON.parse(stored) : VERIFIED_JOB_LISTINGS;
    } catch {
      return VERIFIED_JOB_LISTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }, [jobs]);

  const toggleSaveJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              isSaved: !job.isSaved,
              applicationStatus: !job.isSaved ? (job.applicationStatus || 'Saved') : job.applicationStatus,
            }
          : job
      )
    );
  };

  const updateJobStatus = (
    jobId: string,
    status: JobListing['applicationStatus'],
    notes?: string
  ) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              applicationStatus: status,
              isSaved: true,
              notes: notes !== undefined ? notes : job.notes,
            }
          : job
      )
    );
  };

  const addCustomJob = (jobData: Partial<JobListing>) => {
    const newJob: JobListing = {
      id: 'job-custom-' + Date.now(),
      title: jobData.title || 'Software Engineer',
      company: jobData.company || 'Tech Company',
      logoText: (jobData.company || 'TC').slice(0, 3).toUpperCase(),
      location: jobData.location || 'Hyderabad, India',
      type: jobData.type || 'Full-time',
      workplace: jobData.workplace || 'Hybrid',
      domain: jobData.domain || 'Engineering',
      stipendOrSalary: jobData.stipendOrSalary || 'Competitive',
      deadline: jobData.deadline || 'Open until filled',
      requirements: jobData.requirements || ['Problem Solving', 'Communication'],
      description: jobData.description || 'Custom tracked job application.',
      applyUrl: jobData.applyUrl || 'https://vignanits.ac.in',
      isSaved: true,
      applicationStatus: jobData.applicationStatus || 'Applied',
      notes: jobData.notes || '',
    };
    setJobs((prev) => [newJob, ...prev]);
  };

  // Interview Sessions State
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INTERVIEWS);
      return stored
        ? JSON.parse(stored)
        : [
            {
              id: 'session-demo-01',
              timestamp: '2026-10-22T14:30:00Z',
              questionId: 'q-ai-01',
              questionText: 'Explain the bias-variance tradeoff and how regularization techniques affect both.',
              role: 'AI & Machine Learning Engineer',
              category: 'ML Theory',
              userAnswer:
                'The bias variance tradeoff is about finding the sweet spot between an underfitted model and an overfitted model. High bias means the model is too simple and misses trends. High variance means it captures random noise in the training set. L2 regularization adds weight decay to smooth parameters, whereas L1 creates sparsity by pushing coefficients strictly to zero.',
              timeSpentSeconds: 115,
              feedback: {
                scoreOverall: 88,
                scores: {
                  relevance: 92,
                  clarity: 90,
                  completeness: 85,
                  technicalDepth: 85,
                },
                strengths: [
                  'Clearly contrasted underfitting versus overfitting.',
                  'Accurately defined L1 feature sparsity vs L2 weight shrinkage.',
                ],
                areasForImprovement: [
                  'Mention mathematical formulation of the loss function (lambda term).',
                  'Give an example with high-dimensional feature selection.',
                ],
                sampleAnswer:
                  'Bias is the error from simplifying assumptions; variance is error from sensitivity to training data fluctuations. Regularization penalizes loss: L1 (Lasso) drives weights to zero, L2 (Ridge) penalizes squared magnitude.',
              },
              isLiveAI: false,
            },
          ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(interviewSessions));
  }, [interviewSessions]);

  const saveInterviewSession = (session: InterviewSession) => {
    setInterviewSessions((prev) => [session, ...prev]);
  };

  // Resume State
  const [resume, setResume] = useState<ResumeData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RESUME);
      return stored ? JSON.parse(stored) : DEFAULT_RESUME;
    } catch {
      return DEFAULT_RESUME;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESUME, JSON.stringify(resume));
  }, [resume]);

  const updateResume = (newResume: ResumeData) => {
    setResume(newResume);
  };

  const resetResume = () => {
    setResume(DEFAULT_RESUME);
    localStorage.setItem(STORAGE_KEYS.RESUME, JSON.stringify(DEFAULT_RESUME));
  };

  const activeRecommendation =
    latestAssessment?.topRecommendations?.[0] || CAREER_RECOMMENDATIONS_DATABASE['ai-ml-engineer'];

  return (
    <CareerContext.Provider
      value={{
        latestAssessment,
        assessmentHistory,
        saveAssessment,
        roadmapTasks,
        toggleTask,
        addTask,
        deleteTask,
        resetRoadmap,
        jobs,
        toggleSaveJob,
        updateJobStatus,
        addCustomJob,
        interviewSessions,
        saveInterviewSession,
        resume,
        updateResume,
        resetResume,
        serverStatus,
        refreshServerStatus,
        activeRecommendation,
      }}
    >
      {children}
    </CareerContext.Provider>
  );
};

export const useCareer = () => {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return context;
};
