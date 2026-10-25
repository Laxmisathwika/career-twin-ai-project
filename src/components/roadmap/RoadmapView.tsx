import React, { useState } from 'react';
import {
  MapPin,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  Clock,
  BookOpen,
  Filter,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { useAuth } from '../../context/AuthContext';
import { RoadmapTask } from '../../types';

export const RoadmapView: React.FC = () => {
  const { user } = useAuth();
  const { roadmapTasks, toggleTask, addTask, deleteTask, resetRoadmap, activeRecommendation } =
    useCareer();

  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStage, setNewStage] = useState<RoadmapTask['stage']>('Stage 1: Foundations');
  const [newHours, setNewHours] = useState('15');
  const [newSkills, setNewSkills] = useState('');
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceUrl, setNewResourceUrl] = useState('');

  const stages: RoadmapTask['stage'][] = [
    'Stage 1: Foundations',
    'Stage 2: Core & Frameworks',
    'Stage 3: Advanced Systems',
    'Stage 4: Industry Readiness',
  ];

  // Filtering
  const filteredTasks = roadmapTasks.filter((t) => {
    const matchStage = selectedStage === 'All' || t.stage === selectedStage;
    const matchStatus =
      filterStatus === 'All'
        ? true
        : filterStatus === 'Completed'
        ? t.isCompleted
        : !t.isCompleted;
    return matchStage && matchStatus;
  });

  const totalTasks = roadmapTasks.length;
  const completedTasks = roadmapTasks.filter((t) => t.isCompleted).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalHours = roadmapTasks.reduce((acc, t) => acc + t.estimatedHours, 0);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      careerId: activeRecommendation.id,
      stage: newStage,
      title: newTitle.trim(),
      description: newDescription.trim() || 'Custom student learning task.',
      estimatedHours: parseInt(newHours, 10) || 10,
      skillsLearned: newSkills
        ? newSkills.split(',').map((s) => s.trim()).filter(Boolean)
        : ['Technical Competency'],
      isCompleted: false,
      resourceTitle: newResourceTitle.trim() || undefined,
      resourceUrl: newResourceUrl.trim() || undefined,
    });

    setNewTitle('');
    setNewDescription('');
    setNewSkills('');
    setNewResourceTitle('');
    setNewResourceUrl('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-600 mb-1">
            <MapPin className="w-4 h-4" />
            <span>Structured Placement Syllabus</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {activeRecommendation.title} Learning Roadmap
          </h2>
          <p className="text-xs text-slate-500">
            Curated 4-stage technical pathway for VITS CSM (2026–2027) placement readiness
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Task</span>
          </button>
          <button
            onClick={resetRoadmap}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title="Reset to default roadmap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Overall Milestone Progress</h3>
            <p className="text-xs text-slate-500">
              {completedTasks} of {totalTasks} topics mastered • ~{totalHours} total learning hours
            </p>
          </div>
          <span className="text-2xl font-black text-blue-600">{progressPercent}%</span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Stage Pills */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {stages.map((stg) => {
            const stageTasks = roadmapTasks.filter((t) => t.stage === stg);
            const stageCompleted = stageTasks.filter((t) => t.isCompleted).length;
            const stagePct =
              stageTasks.length > 0
                ? Math.round((stageCompleted / stageTasks.length) * 100)
                : 0;

            return (
              <div
                key={stg}
                onClick={() => setSelectedStage(selectedStage === stg ? 'All' : stg)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedStage === stg
                    ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white'
                }`}
              >
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">
                  {stg.split(':')[0]}
                </div>
                <div className="text-xs font-bold text-slate-900 truncate mt-0.5">
                  {stg.split(':')[1]?.trim()}
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">
                    {stageCompleted}/{stageTasks.length}
                  </span>
                  <span className="font-bold text-blue-600">{stagePct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-600">Stage Filter:</span>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="All">All Stages</option>
            {stages.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="font-semibold text-slate-600">Status:</span>
          {(['All', 'Pending', 'Completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
            No tasks found matching current filters.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all flex items-start space-x-3.5 bg-white ${
                task.isCompleted
                  ? 'border-slate-200 bg-slate-50/50'
                  : 'border-slate-200 hover:border-blue-300 shadow-2xs'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleTask(task.id)}
                className={`mt-1 w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                  task.isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'border-2 border-slate-300 hover:border-slate-500'
                }`}
              >
                {task.isCompleted && <CheckCircle2 className="w-4 h-4" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div className="flex items-center space-x-2">
                    <h4
                      className={`text-sm font-bold ${
                        task.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </h4>
                    {task.isCustom && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-700">
                        Custom
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-400 shrink-0">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{task.estimatedHours} hrs</span>
                    </span>
                    <span className="text-blue-600 font-semibold">{task.stage.split(':')[0]}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{task.description}</p>

                {/* Skills learned badges */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {task.skillsLearned.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}

                  {task.resourceUrl && (
                    <a
                      href={task.resourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 ml-auto"
                    >
                      <span>{task.resourceTitle || 'Free Learning Course'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {task.isCustom && (
                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="text-slate-300 hover:text-rose-600 p-1 rounded-md"
                  title="Delete custom task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Custom Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-5 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Add Custom Learning Task</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Master LangChain Embeddings with ChromaDB"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Stage</label>
                <select
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {stages.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    value={newHours}
                    onChange={(e) => setNewHours(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Skills</label>
                  <input
                    type="text"
                    value={newSkills}
                    onChange={(e) => setNewSkills(e.target.value)}
                    placeholder="Python, Vector DB"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="What concepts will you build or learn?"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Resource Name
                  </label>
                  <input
                    type="text"
                    value={newResourceTitle}
                    onChange={(e) => setNewResourceTitle(e.target.value)}
                    placeholder="e.g. DeepLearning.AI Course"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Resource URL
                  </label>
                  <input
                    type="url"
                    value={newResourceUrl}
                    onChange={(e) => setNewResourceUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs mt-3"
              >
                Add to My Roadmap
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
