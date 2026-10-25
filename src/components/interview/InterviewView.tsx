import React, { useState, useEffect } from 'react';
import {
  Mic,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  BookOpen,
  Award,
  ChevronRight,
  TrendingUp,
  Volume2,
  Play,
  Pause,
  ExternalLink,
} from 'lucide-react';
import { INTERVIEW_QUESTIONS_DATABASE } from '../../data/mockData';
import { useCareer } from '../../context/CareerContext';
import { useAuth } from '../../context/AuthContext';
import { evaluateInterviewAnswer } from '../../services/aiService';
import { InterviewFeedback, InterviewQuestion } from '../../types';

export const InterviewView: React.FC = () => {
  const { user } = useAuth();
  const { interviewSessions, saveInterviewSession, serverStatus } = useCareer();

  // Role and category filters
  const roles = [
    'AI & Machine Learning Engineer',
    'Full-Stack Software Development Engineer (SDE)',
    'Cloud & DevOps Engineer',
    'Software Engineer (General)',
  ];

  const categories = ['All', 'ML Theory', 'Technical', 'System Design', 'Behavioral'];

  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeQuestion, setActiveQuestion] = useState<InterviewQuestion>(
    INTERVIEW_QUESTIONS_DATABASE[0]
  );

  // Practice session state
  const [userAnswer, setUserAnswer] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<InterviewFeedback | null>(null);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [isLiveEvaluation, setIsLiveEvaluation] = useState(false);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Filter questions
  const filteredQuestions = INTERVIEW_QUESTIONS_DATABASE.filter((q) => {
    const matchRole = q.role === selectedRole || q.role === 'Software Engineer (General)';
    const matchCat = selectedCategory === 'All' || q.category === selectedCategory;
    return matchRole && matchCat;
  });

  const handleSelectQuestion = (q: InterviewQuestion) => {
    setActiveQuestion(q);
    setUserAnswer('');
    setTimeSpent(0);
    setTimerRunning(false);
    setCurrentFeedback(null);
    setShowSampleAnswer(false);
  };

  const handleStartTimer = () => {
    setTimerRunning(true);
  };

  const handlePauseTimer = () => {
    setTimerRunning(false);
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setTimerRunning(false);
    setIsSubmitting(true);

    try {
      const { feedback, isLiveAI } = await evaluateInterviewAnswer(
        activeQuestion.role,
        activeQuestion.question,
        userAnswer,
        activeQuestion.difficulty
      );

      setCurrentFeedback(feedback);
      setIsLiveEvaluation(isLiveAI);

      saveInterviewSession({
        id: 'session-' + Date.now(),
        timestamp: new Date().toISOString(),
        questionId: activeQuestion.id,
        questionText: activeQuestion.question,
        role: activeQuestion.role,
        category: activeQuestion.category,
        userAnswer: userAnswer.trim(),
        timeSpentSeconds: timeSpent,
        feedback: feedback,
        isLiveAI: isLiveAI,
      });
    } catch (err) {
      console.error('Failed to evaluate interview answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const wordCount = userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-700 mb-1">
            <Mic className="w-4 h-4" />
            <span>Interactive Placement Rehearsal</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Technical Interview Practice Arena</h2>
          <p className="text-xs text-slate-500">
            Rehearse real interview questions with objective evaluation based on STAR & technical metrics
          </p>
        </div>

        {/* Live / Demo Mode Badge */}
        <div className="flex items-center space-x-2 text-xs">
          <span
            className={`px-3 py-1.5 rounded-full font-semibold border flex items-center space-x-1.5 ${
              serverStatus?.aiConfigured
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {serverStatus?.aiConfigured
                ? 'Gemini 3.8 Evaluator Active'
                : 'Curated Benchmark Rubric'}
            </span>
          </span>
        </div>
      </div>

      {/* Role and Category Selectors */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-xs font-bold text-slate-700 shrink-0">Target Role:</label>
          <div className="flex flex-wrap gap-2">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedRole === r
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700 shrink-0">Category:</label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedCategory === c
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Questions List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Questions ({filteredQuestions.length})
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredQuestions.map((q) => {
                const isSelected = activeQuestion.id === q.id;
                return (
                  <div
                    key={q.id}
                    onClick={() => handleSelectQuestion(q)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold text-indigo-700 mb-1">
                      <span>{q.category}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                        {q.difficulty}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 line-clamp-2">
                      {q.question}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Active Practice Arena & Feedback */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Question Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-indigo-600">
                  {activeQuestion.role} • {activeQuestion.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                  {activeQuestion.difficulty} Level
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {activeQuestion.question}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{activeQuestion.context}</p>

              {/* Key Concept Pills */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 self-center uppercase">
                  Concepts:
                </span>
                {activeQuestion.keyConcepts.map((concept) => (
                  <span
                    key={concept}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            {/* Answer Input Workspace */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-slate-700">Your Technical Response:</span>
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs">{wordCount} words</span>
                  <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{formatTimer(timeSpent)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={timerRunning ? handlePauseTimer : handleStartTimer}
                    className="p-1 rounded hover:bg-slate-200 text-slate-600"
                    title={timerRunning ? 'Pause timer' : 'Start timer'}
                  >
                    {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <textarea
                rows={6}
                value={userAnswer}
                onChange={(e) => {
                  setUserAnswer(e.target.value);
                  if (!timerRunning && e.target.value.length === 1) {
                    setTimerRunning(true);
                  }
                }}
                placeholder="Structure your answer clearly: State the primary principle, discuss implementation or trade-offs, and provide a concrete project example (STAR technique for behavioral questions)..."
                className="w-full p-3.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden leading-relaxed bg-white"
              />

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{showSampleAnswer ? 'Hide Sample Answer' : 'View Benchmark Sample Answer'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={!userAnswer.trim() || isSubmitting}
                  className={`px-5 py-2 text-xs font-bold rounded-lg text-white transition-all shadow-xs flex items-center space-x-2 ${
                    !userAnswer.trim() || isSubmitting
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Evaluating Response...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Evaluate with AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Benchmark Sample Answer Box (Always clearly separated) */}
            {showSampleAnswer && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Benchmark High-Scoring Sample Answer (Learning Reference):</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                  {activeQuestion.sampleAnswer}
                </p>
              </div>
            )}
          </div>

          {/* Detailed Feedback Card */}
          {currentFeedback && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Performance Feedback</h4>
                    <p className="text-[11px] text-slate-500">
                      Evaluated for relevance, clarity, completeness & technical depth
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                    Overall Score
                  </span>
                  <span className="text-2xl font-black text-indigo-600">
                    {currentFeedback.scoreOverall}/100
                  </span>
                </div>
              </div>

              {/* 4 Score Bars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Relevance', value: currentFeedback.scores.relevance, color: 'bg-emerald-600' },
                  { label: 'Clarity', value: currentFeedback.scores.clarity, color: 'bg-blue-600' },
                  { label: 'Completeness', value: currentFeedback.scores.completeness, color: 'bg-indigo-600' },
                  { label: 'Technical Depth', value: currentFeedback.scores.technicalDepth, color: 'bg-violet-600' },
                ].map((scoreItem) => (
                  <div key={scoreItem.label} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex justify-between text-xs mb-1 font-medium text-slate-700">
                      <span>{scoreItem.label}</span>
                      <span className="font-bold">{scoreItem.value}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`${scoreItem.color} h-1.5 rounded-full`}
                        style={{ width: `${scoreItem.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2">
                  <h5 className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Key Strengths Observed:</span>
                  </h5>
                  <ul className="text-xs text-emerald-800 space-y-1 list-disc list-inside">
                    {currentFeedback.strengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100 space-y-2">
                  <h5 className="text-xs font-bold text-amber-900 flex items-center space-x-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Areas to Elevate:</span>
                  </h5>
                  <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
                    {currentFeedback.areasForImprovement.map((area, i) => (
                      <li key={i}>{area}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Follow-up question */}
              {currentFeedback.followUpQuestion && (
                <div className="p-3.5 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-between">
                  <div>
                    <span className="text-indigo-300 font-bold block mb-0.5">
                      Interviewer Follow-Up Question:
                    </span>
                    <span className="text-slate-200">{currentFeedback.followUpQuestion}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
