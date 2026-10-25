import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Calendar,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { ASSESSMENT_QUESTIONS } from '../../data/mockData';
import { useCareer } from '../../context/CareerContext';
import { useAuth } from '../../context/AuthContext';
import { analyzeCareerAssessment } from '../../services/aiService';
import { AssessmentResult, CareerRecommendation } from '../../types';

export const AssessmentView: React.FC = () => {
  const { user } = useAuth();
  const { latestAssessment, assessmentHistory, saveAssessment, serverStatus } = useCareer();

  // Mode: 'quiz' | 'result' | 'history'
  const [mode, setMode] = useState<'quiz' | 'result' | 'history'>(
    latestAssessment ? 'result' : 'quiz'
  );
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiveAIUsed, setIsLiveAIUsed] = useState(false);
  const [viewingHistoryItem, setViewingHistoryItem] = useState<AssessmentResult | null>(null);

  const currentQ = ASSESSMENT_QUESTIONS[currentQuestionIdx];
  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const progressPercent = Math.round(((currentQuestionIdx + 1) / totalQuestions) * 100);

  const handleSelectOption = (optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIdx,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < totalQuestions - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      handleSubmitAssessment();
    }
  };

  const handleBack = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1);
    }
  };

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);
    try {
      const { result, isLiveAI } = await analyzeCareerAssessment(selectedAnswers, user);
      saveAssessment(result);
      setIsLiveAIUsed(isLiveAI);
      setMode('result');
    } catch (err) {
      console.error('Error submitting assessment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setCurrentQuestionIdx(0);
    setMode('quiz');
  };

  const activeResult = viewingHistoryItem || latestAssessment;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Mode Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-indigo-600 mb-1">
            <Compass className="w-4 h-4" />
            <span>Career Readiness Intelligence</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">AI Career Assessment</h2>
          <p className="text-xs text-slate-500">
            Multi-dimensional evaluation for CSM students (2026–2027)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {assessmentHistory.length > 0 && (
            <button
              onClick={() => {
                setViewingHistoryItem(null);
                setMode(mode === 'history' ? 'result' : 'history');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                mode === 'history'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              Past Results ({assessmentHistory.length})
            </button>
          )}

          {mode !== 'quiz' ? (
            <button
              onClick={handleRetake}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Assessment</span>
            </button>
          ) : (
            <button
              onClick={() => setMode('result')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              View Latest
            </button>
          )}
        </div>
      </div>

      {/* QUIZ MODE */}
      {mode === 'quiz' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-2">
              <span>
                Question {currentQuestionIdx + 1} of {totalQuestions}
              </span>
              <span className="text-indigo-600">{progressPercent}% Completed</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-1.5 pt-2">
            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
              {currentQ.category}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h3>
            <p className="text-xs text-slate-500">{currentQ.description}</p>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQ.id] === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start space-x-3.5 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-semibold leading-tight ${
                        isSelected ? 'text-indigo-950 font-bold' : 'text-slate-800'
                      }`}
                    >
                      {option.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{option.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Navigation */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentQuestionIdx === 0 || isSubmitting}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 flex items-center space-x-1.5 transition-colors ${
                currentQuestionIdx === 0
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-2 transition-all shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Answers...</span>
                </>
              ) : currentQuestionIdx === totalQuestions - 1 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Career Profile</span>
                </>
              ) : (
                <>
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* RESULTS MODE */}
      {mode === 'result' && activeResult && (
        <div className="space-y-6">
          {/* AI Banner indicator */}
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
              serverStatus?.aiConfigured
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-indigo-50/70 border-indigo-200 text-indigo-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                Assessment completed on{' '}
                <strong className="font-semibold">{activeResult.date}</strong>. Dimension alignment
                calculated for VITS CSM placement benchmarks.
              </span>
            </div>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
              Confidence: High
            </span>
          </div>

          {/* Personality & Overview Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Student Aptitude & Problem-Solving Profile
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeResult.personalitySummary}
            </p>

            {/* Dimension Breakdown Bar Chart */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                Transparent Dimension Scores
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: 'AI & Machine Learning', value: activeResult.dimensions.aiMl, color: 'bg-indigo-600' },
                  { label: 'Full-Stack Software Dev', value: activeResult.dimensions.fullstack, color: 'bg-blue-600' },
                  { label: 'Data Science & Analytics', value: activeResult.dimensions.dataScience, color: 'bg-emerald-600' },
                  { label: 'Cloud Systems & DevOps', value: activeResult.dimensions.cloudDevops, color: 'bg-amber-600' },
                  { label: 'Cybersecurity & Networks', value: activeResult.dimensions.cybersecurity, color: 'bg-rose-600' },
                  { label: 'Product & System Design', value: activeResult.dimensions.productDesign, color: 'bg-violet-600' },
                ].map((dim) => (
                  <div key={dim.label} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-medium text-slate-700 truncate">{dim.label}</span>
                      <span className="font-bold text-slate-900">{dim.value}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`${dim.color} h-1.5 rounded-full transition-all duration-500`}
                        style={{ width: `${dim.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Career Roles Detail */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Personalized Career Recommendations
            </h3>

            {activeResult.topRecommendations.map((rec: CareerRecommendation, index: number) => (
              <div
                key={rec.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:border-indigo-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-900 text-white">
                        #{index + 1} Fit
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900">{rec.title}</h4>
                    </div>
                    <p className="text-xs text-indigo-600 font-medium mt-0.5">{rec.domain}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Match Score
                      </span>
                      <span className="text-xl font-black text-indigo-600">
                        {rec.matchScore}%
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{rec.rationale}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Required Skills */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <h5 className="text-xs font-bold text-slate-800 mb-2 flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Required Technical Skills</span>
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {rec.requiredSkills.map((skill: string) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-white text-slate-700 border border-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Typical Responsibilities */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <h5 className="text-xs font-bold text-slate-800 mb-2 flex items-center space-x-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>Typical Day-to-Day Responsibilities</span>
                    </h5>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                      {rec.typicalResponsibilities.map((resp: string, i: number) => (
                        <li key={i} className="line-clamp-1">
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Compensation & Immediate Next Steps */}
                <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Starting Salary / CTC: </span>
                    <strong className="text-slate-900 font-bold">{rec.startingSalaryRange}</strong>
                  </div>
                  <div className="flex-1 md:text-right">
                    <span className="text-slate-500">Immediate 30-Day Step: </span>
                    <span className="text-indigo-950 font-semibold">
                      {rec.immediateNextSteps[0]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recommended University Electives */}
          {activeResult.recommendedElectives && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Recommended VITS CSM Department Electives
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeResult.recommendedElectives.map((elec: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    {elec}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* HISTORY MODE */}
      {mode === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Past Assessment Submissions</h3>
          <p className="text-xs text-slate-500">
            Review how your career alignment has evolved across semesters.
          </p>

          <div className="divide-y divide-slate-200">
            {assessmentHistory.map((item, idx) => (
              <div key={item.id} className="py-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-900">{item.date}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                      Overall Score: {item.overallScore}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Top Fit: <strong>{item.topRecommendations[0]?.title}</strong> (
                    {item.topRecommendations[0]?.matchScore}%)
                  </p>
                </div>

                <button
                  onClick={() => {
                    setViewingHistoryItem(item);
                    setMode('result');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
