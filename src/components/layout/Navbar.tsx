import React from 'react';
import {
  Sparkles,
  Bot,
  User,
  GraduationCap,
  LogOut,
  Menu,
  X,
  Bell,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCareer } from '../../context/CareerContext';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  currentView,
  setCurrentView,
  onOpenAuth,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { serverStatus } = useCareer();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section: mobile hamburger & brand */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 lg:hidden"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center space-x-3 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-indigo-900 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/10 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                    Career Twin <span className="text-indigo-600">AI</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    CSM 2026–27
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden md:block">
                  Vignan Institute of Tech & Science, Deshmukhi
                </p>
              </div>
            </button>
          </div>

          {/* Right section: AI status badge & user dropdown */}
          <div className="flex items-center space-x-3">
            {/* Live AI / Demo Mode Indicator */}
            <div
              className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                serverStatus?.aiConfigured
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title={
                serverStatus?.aiConfigured
                  ? 'Connected to Google Gemini 3.8 Flash server-side API'
                  : 'Operating with curated local career engine (No Gemini key configured)'
              }
            >
              {serverStatus?.aiConfigured ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <Bot className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AI Connected</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Curated Mode</span>
                </>
              )}
            </div>

            {/* Quick Action: Ask AI */}
            <button
              onClick={() => setCurrentView('chat')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                currentView === 'chat'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Career Bot</span>
            </button>

            {/* User Profile or Sign In / Register */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <button
                  onClick={() => setCurrentView('profile')}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-indigo-500/20">
                    {user.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden xl:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                      {user.fullName}
                    </p>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {user.rollNumber} • {user.department}
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    setCurrentView('login');
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 hover:text-rose-800 border border-rose-200 transition-all shadow-2xs cursor-pointer"
                  title="Sign out of student account"
                  aria-label="Sign out of account"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentView('login')}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => setCurrentView('register')}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
