import React from 'react';
import {
  Sparkles,
  Compass,
  FileText,
  Mic,
  MapPin,
  Briefcase,
  Bot,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCareer } from '../../context/CareerContext';

interface LandingPageProps {
  onStart: (view?: string) => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onOpenAuth }) => {
  const { user, isAuthenticated } = useAuth();
  const { serverStatus } = useCareer();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Banner: Academic Context */}
      <div className="bg-slate-900 text-slate-300 px-4 py-2 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-white">
              Vignan Institute of Technology and Science, Deshmukhi
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="text-slate-400">Department of CSM (Batch 2026–2027)</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="inline-flex items-center text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              Placement Season Ready
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Tag */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Next-Gen Engineering Career Guidance Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Discover Your Career <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-900 bg-clip-text text-transparent">
                With Your Career Twin AI
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Built specifically for engineering students at{' '}
              <strong className="text-slate-800 font-semibold">Vignan ITS (CSM)</strong>.
              Map your strengths, master industry roadmaps, build ATS-optimized resumes, practice AI
              interviews, and land top campus placements.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onStart('assessment')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md shadow-slate-900/10 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
              >
                <Compass className="w-4 h-4 text-indigo-400" />
                <span>Start AI Career Assessment</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => onStart('dashboard')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm border border-slate-300 shadow-xs flex items-center justify-center space-x-2 transition-all"
              >
                <span>Launch Student Dashboard</span>
              </button>
            </div>

            {/* Micro stats */}
            <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-black text-slate-900">100%</p>
                <p className="text-xs text-slate-500 mt-0.5">CSM Curriculum Aligned</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">4 Stages</p>
                <p className="text-xs text-slate-500 mt-0.5">Foundations to Production</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">STAR</p>
                <p className="text-xs text-slate-500 mt-0.5">Interview Evaluation Model</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">PDF Ready</p>
                <p className="text-xs text-slate-500 mt-0.5">ATS Resume Formats</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Modules Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Comprehensive Career Ecosystem
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Everything You Need for Campus Hiring
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Integrated toolset designed to take a CSM student from 3rd-year coursework to a
              competitive tech offer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Assessment */}
            <div
              onClick={() => onStart('assessment')}
              className="group p-6 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  AI Career Assessment
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Transparent multi-dimensional evaluation of skills, problem-solving style, and
                  technical interests that recommends top roles like AI/ML Engineer, SDE, and Cloud
                  Architect.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-xs font-semibold text-indigo-600">
                <span>Take 8-question assessment</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 2: Learning Roadmap */}
            <div
              onClick={() => onStart('roadmap')}
              className="group p-6 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Personalized Learning Roadmap
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Organized into 4 stages: Foundations, Core & Frameworks, Advanced Systems, and
                  Industry Readiness. Includes free verified study resources and custom task
                  tracking.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-xs font-semibold text-blue-600">
                <span>View curated roadmaps</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 3: Resume Builder */}
            <div
              onClick={() => onStart('resume')}
              className="group p-6 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Resume Builder & AI Improver
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Multiple professional templates, live preview, action-verb bullet point optimizer,
                  and a working one-click PDF export tailored for ATS screeners.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-xs font-semibold text-emerald-600">
                <span>Build your resume</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 4: Interview Practice */}
            <div
              onClick={() => onStart('interview')}
              className="group p-6 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mic className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  Interview Practice Arena
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Rehearse technical questions, ML theory, system design, and behavioral STAR
                  questions with immediate grading across Relevance, Clarity, and Technical Depth.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-xs font-semibold text-amber-700">
                <span>Practice mock questions</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 5: Career Chatbot */}
            <div
              onClick={() => onStart('chat')}
              className="group p-6 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                  AI Career Chatbot
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Ask career questions, get project feedback, brainstorm tech stacks, and prepare
                  for college campus placement drives via server-side Gemini 3.8 Flash.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-xs font-semibold text-violet-600">
                <span>Chat with Career Twin</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 6: Jobs & Internships */}
            <div
              onClick={() => onStart('jobs')}
              className="group p-6 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                  Jobs & Internships Explorer
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Curated listings for 2026–2027 graduates (TCS Digital, Microsoft, Cognizant,
                  Razorpay) with direct verified application links and an application pipeline tracker.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center text-xs font-semibold text-slate-700">
                <span>Browse verified roles</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Step-by-Step Pathway
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How Career Twin AI Guides You
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative">
              <span className="text-3xl font-black text-indigo-100 absolute top-4 right-4">01</span>
              <h4 className="text-sm font-bold text-slate-900 mt-2">1. Profile & Assess</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Complete the 8-question career questionnaire to analyze your analytical, algorithmic,
                and system design inclinations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative">
              <span className="text-3xl font-black text-indigo-100 absolute top-4 right-4">02</span>
              <h4 className="text-sm font-bold text-slate-900 mt-2">2. Master Roadmap</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Follow staged tasks with free high-quality resources (MIT OCW, Coursera, Kaggle,
                freeCodeCamp) and check off skills.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative">
              <span className="text-3xl font-black text-indigo-100 absolute top-4 right-4">03</span>
              <h4 className="text-sm font-bold text-slate-900 mt-2">3. Resume & Interview</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Generate an ATS-ready PDF resume, improve bullets with AI, and practice answering
                technical interview questions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 relative">
              <span className="text-3xl font-black text-indigo-100 absolute top-4 right-4">04</span>
              <h4 className="text-sm font-bold text-slate-900 mt-2">4. Apply & Track</h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Explore campus drives and tech opportunities, track application stages, and get ready
                for final rounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* College Institutional Badge Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-3">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Vignan Institute of Technology and Science
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Deshmukhi, Pochampally Mandal, Yadadri Bhuvanagiri District, Telangana
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 font-medium">
            <span className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
              Department of CSM
            </span>
            <span className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
              Academic Year: 2026–2027
            </span>
            <span className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
              Affiliated to JNTUH & Approved by AICTE
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
