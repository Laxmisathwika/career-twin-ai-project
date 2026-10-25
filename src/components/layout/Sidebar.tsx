import React from 'react';
import {
  LayoutDashboard,
  Compass,
  MessageSquareCode,
  FileText,
  Mic,
  MapPin,
  Briefcase,
  UserCheck,
  ChevronRight,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  isOpen,
  setIsOpen,
}) => {
  const { roadmapTasks, jobs, interviewSessions } = useCareer();
  const { user } = useAuth();

  const completedTasksCount = roadmapTasks.filter((t) => t.isCompleted).length;
  const totalTasksCount = roadmapTasks.length;
  const roadmapPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
  const savedJobsCount = jobs.filter((j) => j.isSaved).length;

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Student Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'assessment',
      label: 'AI Career Assessment',
      icon: Compass,
      badge: 'Interactive',
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'chat',
      label: 'Career Guidance Chat',
      icon: MessageSquareCode,
      badge: 'Gemini',
      badgeColor: 'bg-violet-100 text-violet-700',
    },
    {
      id: 'resume',
      label: 'Resume Builder',
      icon: FileText,
      badge: 'PDF Export',
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'interview',
      label: 'Interview Practice',
      icon: Mic,
      badge: interviewSessions.length > 0 ? `${interviewSessions.length} done` : 'Mock Prep',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'roadmap',
      label: 'Learning Roadmap',
      icon: MapPin,
      badge: `${roadmapPercent}%`,
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'jobs',
      label: 'Jobs & Internships',
      icon: Briefcase,
      badge: savedJobsCount > 0 ? `${savedJobsCount} saved` : 'Campus 26',
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'profile',
      label: 'Student Profile',
      icon: UserCheck,
      badge: null,
    },
  ];

  const handleSelect = (id: string) => {
    setCurrentView(id);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top College Badge */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-xs font-bold text-white tracking-wide uppercase truncate">
                Vignan ITS • Deshmukhi
              </h2>
              <p className="text-[11px] text-slate-400 truncate">
                Dept of CSM • Batch 2026–27
              </p>
            </div>
          </div>
        </div>

        {/* Student Mini Profile Card */}
        {user && (
          <div className="px-4 py-3 mx-3 mt-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white text-xs shadow-xs">
                {user.fullName.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
                <p className="text-[10px] text-slate-400 truncate">
                  CGPA: {user.cgpa} • {user.semester}
                </p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Roadmap Progress</span>
              <span className="font-semibold text-indigo-400">{roadmapPercent}%</span>
            </div>
            <div className="w-full bg-slate-700/60 rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${roadmapPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-md shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom CTA / Academic Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-900/40 text-[11px] text-slate-300">
            <div className="flex items-center space-x-1.5 text-indigo-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Career Twin Engine</span>
            </div>
            <p className="text-slate-400 text-[10px] leading-relaxed">
              Designed for B.Tech CSM students preparing for placement season 2026–2027.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
