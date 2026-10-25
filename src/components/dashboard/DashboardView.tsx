import React from 'react';
import {
  Compass,
  MapPin,
  FileText,
  Mic,
  Briefcase,
  Bot,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Target,
  Award,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCareer } from '../../context/CareerContext';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const {
    latestAssessment,
    roadmapTasks,
    toggleTask,
    jobs,
    interviewSessions,
    resume,
    serverStatus,
  } = useCareer();

  // Metrics calculations
  const totalTasks = roadmapTasks.length;
  const completedTasks = roadmapTasks.filter((t) => t.isCompleted).length;
  const roadmapPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const savedJobs = jobs.filter((j) => j.isSaved);
  const appliedJobs = jobs.filter((j) => j.applicationStatus === 'Applied' || j.applicationStatus === 'Interviewing');

  // Resume completeness score
  const calculateResumeCompleteness = () => {
    let score = 0;
    if (resume.personalInfo.fullName && resume.personalInfo.email && resume.personalInfo.phone) score += 20;
    if (resume.personalInfo.summary) score += 15;
    if (resume.education.length > 0) score += 20;
    if (resume.skills.length > 0) score += 15;
    if (resume.projects.length > 0) score += 20;
    if (resume.certifications.length > 0 || resume.achievements.length > 0) score += 10;
    return score;
  };
  const resumeScore = calculateResumeCompleteness();

  const topRole = latestAssessment?.topRecommendations?.[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-400/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>VITS CSM • Academic Year 2026–2027</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.fullName ? `Welcome back, ${user.fullName}!` : 'Welcome to Career Twin AI'}
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            {user ? (
              <>
                Your personalized AI career twin is tracking your readiness for the 2026–2027 campus hiring
                cycle. Target Path:{' '}
                <strong className="text-indigo-300 font-semibold">
                  {topRole?.title || user.targetRole || 'AI & Machine Learning Engineer'}
                </strong>
              </>
            ) : (
              'Empowering VITS CSM engineering students with personalized career recommendations, learning roadmaps, resume building, and placement preparation.'
            )}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('assessment')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Review Assessment</span>
            </button>
            <button
              onClick={() => onNavigate('roadmap')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center space-x-1.5 transition-colors"
            >
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Continue Roadmap ({roadmapPercent}%)</span>
            </button>
            <button
              onClick={() => onNavigate('chat')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center space-x-1.5 transition-colors"
            >
              <Bot className="w-4 h-4 text-violet-400" />
              <span>Ask Career Twin</span>
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Career Readiness */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Career Match</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">
              {topRole ? `${topRole.matchScore}%` : '92%'}
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> High
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            {topRole?.title || 'AI & Machine Learning Engineer'}
          </p>
        </div>

        {/* KPI 2: Roadmap Progress */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Roadmap Progress</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{roadmapPercent}%</span>
            <span className="text-xs text-slate-400 font-medium">
              {completedTasks}/{totalTasks} tasks
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${roadmapPercent}%` }}
            />
          </div>
        </div>

        {/* KPI 3: Resume Completeness */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Resume Status</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{resumeScore}%</span>
            <span className="text-xs text-emerald-600 font-semibold">PDF Ready</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${resumeScore}%` }}
            />
          </div>
        </div>

        {/* KPI 4: Interview & Applications */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Interview Practice</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <Mic className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{interviewSessions.length}</span>
            <span className="text-xs text-slate-400 font-medium">Mocks completed</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            {appliedJobs.length} active campus applications
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Career Recommendations & Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Recommended Career Paths */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Compass className="w-5 h-5 text-indigo-600" />
                  <span>Recommended Career Paths</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Calculated from your skills, coursework, and problem-solving assessment
                </p>
              </div>
              <button
                onClick={() => onNavigate('assessment')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center"
              >
                <span>Retake Quiz</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestAssessment?.topRecommendations?.slice(0, 4).map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{rec.title}</h4>
                      <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-700 shrink-0">
                        {rec.matchScore}%
                      </span>
                    </div>
                    <p className="text-[11px] text-indigo-600 font-medium mt-0.5">{rec.domain}</p>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {rec.rationale}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/80">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {rec.requiredSkills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-white text-slate-700 border border-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Package:</span>
                      <span className="font-semibold text-slate-800">{rec.startingSalaryRange}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Next Learning Milestones */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Next Learning Tasks</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Follow the structured roadmap to unlock full interview readiness
                </p>
              </div>
              <button
                onClick={() => onNavigate('roadmap')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center"
              >
                <span>Full Roadmap</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {roadmapTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border transition-all flex items-start space-x-3 ${
                    task.isCompleted
                      ? 'bg-slate-50/70 border-slate-200 opacity-75'
                      : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                      task.isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {task.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-xs font-bold leading-tight ${
                          task.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {task.estimatedHours} hrs
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {task.description}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className="text-[10px] text-blue-600 font-medium">{task.stage}</span>
                      {task.resourceUrl && (
                        <a
                          href={task.resourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-slate-400 hover:text-indigo-600 flex items-center"
                        >
                          <ExternalLink className="w-3 h-3 mr-0.5" />
                          <span>Resource</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Quick Tools & Interview Stats */}
        <div className="space-y-6">
          {/* Quick Actions Hub */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Quick Career Tools
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('resume')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Resume Builder</p>
                    <p className="text-[11px] text-slate-500">Edit and export PDF</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('interview')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Mock Interview</p>
                    <p className="text-[11px] text-slate-500">Practice questions with STAR feedback</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('jobs')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-left transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-slate-200 text-slate-700">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Campus Drives</p>
                    <p className="text-[11px] text-slate-500">{savedJobs.length} bookmarked opportunities</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('chat')}
                className="w-full p-3 rounded-xl bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200 flex items-center justify-between text-left transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-indigo-950">AI Career Mentor</p>
                    <p className="text-[11px] text-indigo-700">Ask questions anytime</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Recent Mock Interview History */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <Mic className="w-4 h-4 text-amber-700" />
                <span>Recent Mock Practice</span>
              </h3>
              <button
                onClick={() => onNavigate('interview')}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Practice
              </button>
            </div>

            {interviewSessions.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No interview sessions recorded yet. Start practicing your first mock question!
              </div>
            ) : (
              <div className="space-y-3">
                {interviewSessions.slice(0, 2).map((session) => (
                  <div key={session.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-semibold text-slate-700">{session.role}</span>
                      <span className="font-bold text-emerald-600">
                        Score: {session.feedback.scoreOverall}/100
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-900 line-clamp-1">
                      {session.questionText}
                    </p>
                    <div className="mt-2 flex items-center space-x-3 text-[10px] text-slate-500">
                      <span>Relevance: {session.feedback.scores.relevance}%</span>
                      <span>Clarity: {session.feedback.scores.clarity}%</span>
                      <span>Depth: {session.feedback.scores.technicalDepth}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* VITS Campus Notice Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white text-xs">
            <div className="flex items-center space-x-2 text-indigo-300 font-semibold mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Campus Placement Cell Alert</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              TCS NQT and Cognizant GenC registration verification is in progress for 2026–2027 batch.
              Ensure your B.Tech CSM resume is exported and verified in the builder.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
