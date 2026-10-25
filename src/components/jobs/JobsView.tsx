import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  MapPin,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  Send,
  Eye,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { JobListing } from '../../types';

export const JobsView: React.FC = () => {
  const { jobs, toggleSaveJob, updateJobStatus, addCustomJob } = useCareer();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | 'Full-time' | 'Internship'>('All');
  const [selectedWorkplace, setSelectedWorkplace] = useState<'All' | 'Remote' | 'On-site' | 'Hybrid'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Saved' | 'Applied' | 'Interviewing'>('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customCompany, setCustomCompany] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customType, setCustomType] = useState<JobListing['type']>('Full-time');
  const [customStatus, setCustomStatus] = useState<JobListing['applicationStatus']>('Applied');
  const [customNotes, setCustomNotes] = useState('');

  // Filter logic
  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.domain.toLowerCase().includes(q) ||
      job.requirements.some((r) => r.toLowerCase().includes(q));

    const matchType = selectedType === 'All' || job.type === selectedType;
    const matchWorkplace = selectedWorkplace === 'All' || job.workplace === selectedWorkplace;
    const matchStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Saved'
        ? job.isSaved
        : job.applicationStatus === statusFilter;

    return matchSearch && matchType && matchWorkplace && matchStatus;
  });

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCompany.trim() || !customTitle.trim()) return;

    addCustomJob({
      company: customCompany.trim(),
      title: customTitle.trim(),
      applyUrl: customUrl.trim() || 'https://vignanits.ac.in',
      type: customType,
      applicationStatus: customStatus,
      notes: customNotes.trim(),
    });

    setCustomCompany('');
    setCustomTitle('');
    setCustomUrl('');
    setCustomNotes('');
    setIsAddModalOpen(false);
  };

  const statusOptions: JobListing['applicationStatus'][] = [
    'Saved',
    'Applied',
    'Interviewing',
    'Offer',
    'Rejected',
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-700 mb-1">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>Curated Campus & Tech Hiring Pipeline</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Jobs & Internships Explorer</h2>
          <p className="text-xs text-slate-500">
            Verified opportunities tailored for B.Tech CSM students (Batch 2026–2027)
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 flex items-center space-x-1.5 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 text-indigo-400" />
          <span>Track Off-Campus Job</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company, title, or skills (e.g. PyTorch, React, Microsoft, TCS)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* Opportunity Type */}
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-500">Type:</span>
            {(['All', 'Full-time', 'Internship'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedType === t
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Workplace Mode */}
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-500">Mode:</span>
            {(['All', 'Hybrid', 'Remote', 'On-site'] as const).map((w) => (
              <button
                key={w}
                onClick={() => setSelectedWorkplace(w)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedWorkplace === w
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {w}
              </button>
            ))}
          </div>

          {/* Application Pipeline Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-500">Pipeline:</span>
            {(['All', 'Saved', 'Applied', 'Interviewing'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            No job opportunities found matching your criteria. Try adjusting filters or track a
            custom role.
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isSaved = Boolean(job.isSaved);
            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-indigo-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start space-x-3.5">
                    {/* Company Logo Badge */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                      {job.logoText}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {job.title}
                        </h3>
                        {job.isCampusDrive && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            Campus Drive
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="font-semibold text-slate-800">{job.company}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-0.5 text-slate-400" />
                          {job.location}
                        </span>
                        <span>•</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                          {job.workplace}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-indigo-700">
                          {job.stipendOrSalary}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleSaveJob(job.id)}
                      className={`p-2 rounded-lg border transition-colors ${
                        isSaved
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
                      }`}
                      title={isSaved ? 'Bookmarked' : 'Bookmark this opportunity'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>

                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
                    >
                      <span>Apply Official</span>
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-300" />
                    </a>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{job.description}</p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.requirements.map((req, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {req}
                    </span>
                  ))}
                </div>

                {/* Application Pipeline Status Bar */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-500 text-[11px]">My Status:</span>
                    <select
                      value={job.applicationStatus || 'Saved'}
                      onChange={(e) =>
                        updateJobStatus(job.id, e.target.value as any)
                      }
                      className="px-2 py-1 text-xs border border-slate-300 rounded-lg bg-slate-50 font-semibold text-slate-800"
                    >
                      {statusOptions.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    Deadline: <span className="font-semibold text-slate-600">{job.deadline}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Custom Off-Campus Job Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Track Off-Campus Application</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustom} className="p-6 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company *</label>
                <input
                  type="text"
                  required
                  value={customCompany}
                  onChange={(e) => setCustomCompany(e.target.value)}
                  placeholder="e.g. Swiggy, Uber, Oracle"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Associate Software Engineer"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={customStatus}
                    onChange={(e) => setCustomStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Portal Link / Careers URL
                </label>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. Referred by senior; completed HackerRank round on Monday."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors shadow-xs mt-3"
              >
                Save to Application Tracker
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
