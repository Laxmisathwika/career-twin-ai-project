import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { useAuth } from './AuthContext';

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
  clearAllCareerData: () => void;
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

const PREFIX = 'career_twin_user_data_';

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
  personalitySummary:
    'Analytical builder driven by model optimization, deep learning architecture, and robust web APIs. Demonstrates high readiness for 2026–2027 campus hiring.',
  recommendedElectives: [
    'Deep Learning & NLP (CSM Core)',
    'Cloud Architecture & Microservices',
    'High-Performance Distributed Databases',
  ],
};

const EMPTY_RESUME: ResumeData = {
  id: 'resume-empty',
  userId: '',
  updatedAt: new Date().toISOString(),
  template: 'classic',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
  },
  education: [],
  skills: [],
  experience: [],
  projects: [],
  certifications: [],
  achievements: [],
};

const createUserStarterResume = (u: any): ResumeData => ({
  id: 'resume-' + u.id,
  userId: u.id,
  updatedAt: new Date().toISOString(),
  template: 'classic',
  personalInfo: {
    fullName: u.fullName || '',
    email: u.email || '',
    phone: '',
    location: 'Hyderabad, Telangana, India',
    linkedin: u.linkedinUrl || '',
    github: u.githubUrl || '',
    portfolio: u.portfolioUrl || '',
    summary: `Proactive ${u.semester || '3rd-year'} B.Tech student in ${u.department || 'CSM'} at ${u.college || 'Vignan Institute of Technology and Science'} with a ${u.cgpa || 8.5} CGPA. Aspiring ${u.targetRole || 'Software Development Engineer'}.`,
  },
  education: [
    {
      id: 'edu-' + u.id,
      institution: u.college || 'Vignan Institute of Technology and Science, Deshmukhi',
      degree: `B.Tech in ${u.department || 'CSM'}`,
      fieldOfStudy: 'Computer Science & Machine Learning',
      startDate: 'Aug 2023',
      endDate: 'May 2027 (Expected)',
      gradeOrCgpa: `${u.cgpa || 8.5} / 10.0 CGPA`,
      highlights: 'Department coursework: Data Structures, Machine Learning, Deep Learning, Cloud Computing, Database Systems.',
    },
  ],
  skills: [
    {
      category: 'Core Competencies',
      items: u.skills && u.skills.length > 0 ? u.skills : ['Python', 'Data Structures & Algorithms', 'SQL'],
    },
    {
      category: 'Interests & Focus Areas',
      items: u.interests && u.interests.length > 0 ? u.interests : ['Artificial Intelligence', 'Software Engineering'],
    },
  ],
  experience: [],
  projects: [],
  certifications: [],
  achievements: [],
});

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user ? user.id : 'guest';

  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);

  const refreshServerStatus = async () => {
    const status = await checkServerStatus();
    setServerStatus(status);
  };

  useEffect(() => {
    refreshServerStatus();
  }, []);

  // Helper storage accessors scoped strictly per user
  const getUserKey = useCallback((suffix: string) => `${PREFIX}${userId}_${suffix}`, [userId]);

  // Assessment State
  const [latestAssessment, setLatestAssessment] = useState<AssessmentResult | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>([]);

  // Roadmap State
  const [roadmapTasks, setRoadmapTasks] = useState<RoadmapTask[]>([]);

  // Jobs State
  const [jobs, setJobs] = useState<JobListing[]>([]);

  // Interview Sessions State
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>([]);

  // Resume State - default to clean empty resume when unauthenticated
  const [resume, setResume] = useState<ResumeData>(EMPTY_RESUME);

  // Synchronous clearance of all user-specific active memory and state
  const clearAllCareerData = useCallback(() => {
    setLatestAssessment(null);
    setAssessmentHistory([]);
    setRoadmapTasks([]);
    setJobs([]);
    setInterviewSessions([]);
    setResume(EMPTY_RESUME);
  }, []);

  // Sync state whenever the authenticated user changes or logs out
  useEffect(() => {
    if (!user) {
      // Clear all user-specific in-memory state immediately on logout
      clearAllCareerData();
      return;
    }

    // Load user-scoped Assessment
    const storedAssessment = localStorage.getItem(getUserKey('assessment'));
    const storedHistory = localStorage.getItem(getUserKey('history'));

    if (storedAssessment) {
      try {
        setLatestAssessment(JSON.parse(storedAssessment));
      } catch {
        setLatestAssessment(null);
      }
    } else if (user.id === 'vits-csm-2026-001') {
      setLatestAssessment(DEFAULT_ASSESSMENT);
    } else {
      setLatestAssessment(null);
    }

    if (storedHistory) {
      try {
        setAssessmentHistory(JSON.parse(storedHistory));
      } catch {
        setAssessmentHistory([]);
      }
    } else if (user.id === 'vits-csm-2026-001') {
      setAssessmentHistory([DEFAULT_ASSESSMENT]);
    } else {
      setAssessmentHistory([]);
    }

    // Load user-scoped Roadmap
    const storedRoadmap = localStorage.getItem(getUserKey('roadmap'));
    if (storedRoadmap) {
      try {
        setRoadmapTasks(JSON.parse(storedRoadmap));
      } catch {
        setRoadmapTasks(INITIAL_ROADMAP_TASKS);
      }
    } else {
      setRoadmapTasks(INITIAL_ROADMAP_TASKS);
    }

    // Load user-scoped Jobs
    const storedJobs = localStorage.getItem(getUserKey('jobs'));
    if (storedJobs) {
      try {
        setJobs(JSON.parse(storedJobs));
      } catch {
        setJobs(VERIFIED_JOB_LISTINGS);
      }
    } else {
      setJobs(VERIFIED_JOB_LISTINGS);
    }

    // Load user-scoped Interviews
    const storedInterviews = localStorage.getItem(getUserKey('interviews'));
    if (storedInterviews) {
      try {
        setInterviewSessions(JSON.parse(storedInterviews));
      } catch {
        setInterviewSessions([]);
      }
    } else {
      setInterviewSessions([]);
    }

    // Load user-scoped Resume
    const storedResume = localStorage.getItem(getUserKey('resume'));
    if (storedResume) {
      try {
        setResume(JSON.parse(storedResume));
      } catch {
        setResume(user.id === 'vits-csm-2026-001' ? DEFAULT_RESUME : createUserStarterResume(user));
      }
    } else if (user.id === 'vits-csm-2026-001') {
      setResume(DEFAULT_RESUME);
    } else {
      setResume(createUserStarterResume(user));
    }
  }, [user, getUserKey, clearAllCareerData]);

  // Assessment Savers
  const saveAssessment = (result: AssessmentResult) => {
    setLatestAssessment(result);
    setAssessmentHistory((prev) => {
      const updated = [result, ...prev];
      if (user) {
        localStorage.setItem(getUserKey('history'), JSON.stringify(updated));
      }
      return updated;
    });
    if (user) {
      localStorage.setItem(getUserKey('assessment'), JSON.stringify(result));
    }
  };

  // Roadmap actions
  const toggleTask = (taskId: string) => {
    setRoadmapTasks((prev) => {
      const updated = prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
      if (user) localStorage.setItem(getUserKey('roadmap'), JSON.stringify(updated));
      return updated;
    });
  };

  const addTask = (taskData: Omit<RoadmapTask, 'id'>) => {
    const newTask: RoadmapTask = {
      ...taskData,
      id: 'task-custom-' + Date.now(),
      isCustom: true,
    };
    setRoadmapTasks((prev) => {
      const updated = [newTask, ...prev];
      if (user) localStorage.setItem(getUserKey('roadmap'), JSON.stringify(updated));
      return updated;
    });
  };

  const deleteTask = (taskId: string) => {
    setRoadmapTasks((prev) => {
      const updated = prev.filter((t) => t.id !== taskId);
      if (user) localStorage.setItem(getUserKey('roadmap'), JSON.stringify(updated));
      return updated;
    });
  };

  const resetRoadmap = () => {
    setRoadmapTasks(INITIAL_ROADMAP_TASKS);
    if (user) localStorage.setItem(getUserKey('roadmap'), JSON.stringify(INITIAL_ROADMAP_TASKS));
  };

  // Jobs actions
  const toggleSaveJob = (jobId: string) => {
    setJobs((prev) => {
      const updated = prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              isSaved: !job.isSaved,
              applicationStatus: !job.isSaved ? job.applicationStatus || 'Saved' : job.applicationStatus,
            }
          : job
      );
      if (user) localStorage.setItem(getUserKey('jobs'), JSON.stringify(updated));
      return updated;
    });
  };

  const updateJobStatus = (
    jobId: string,
    status: JobListing['applicationStatus'],
    notes?: string
  ) => {
    setJobs((prev) => {
      const updated = prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              applicationStatus: status,
              isSaved: true,
              notes: notes !== undefined ? notes : job.notes,
            }
          : job
      );
      if (user) localStorage.setItem(getUserKey('jobs'), JSON.stringify(updated));
      return updated;
    });
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
    setJobs((prev) => {
      const updated = [newJob, ...prev];
      if (user) localStorage.setItem(getUserKey('jobs'), JSON.stringify(updated));
      return updated;
    });
  };

  // Interview actions
  const saveInterviewSession = (session: InterviewSession) => {
    setInterviewSessions((prev) => {
      const updated = [session, ...prev];
      if (user) localStorage.setItem(getUserKey('interviews'), JSON.stringify(updated));
      return updated;
    });
  };

  // Resume actions
  const updateResume = (newResume: ResumeData) => {
    setResume(newResume);
    if (user) localStorage.setItem(getUserKey('resume'), JSON.stringify(newResume));
  };

  const resetResume = () => {
    const base = user
      ? {
          ...DEFAULT_RESUME,
          userId: user.id,
          personalInfo: {
            ...DEFAULT_RESUME.personalInfo,
            fullName: user.fullName,
            email: user.email,
          },
        }
      : DEFAULT_RESUME;
    setResume(base);
    if (user) localStorage.setItem(getUserKey('resume'), JSON.stringify(base));
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
        clearAllCareerData,
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
