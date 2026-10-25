import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CareerProvider, useCareer } from './context/CareerContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { AssessmentView } from './components/assessment/AssessmentView';
import { CareerChatView } from './components/chat/CareerChatView';
import { ResumeBuilderView } from './components/resume/ResumeBuilderView';
import { InterviewView } from './components/interview/InterviewView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { JobsView } from './components/jobs/JobsView';
import { ProfileView } from './components/profile/ProfileView';

const PROTECTED_VIEWS = [
  'dashboard',
  'assessment',
  'chat',
  'resume',
  'interview',
  'roadmap',
  'jobs',
  'profile',
];

const MainAppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication Guard: Disallow access to protected modules when unauthenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && PROTECTED_VIEWS.includes(currentView)) {
      setCurrentView('login');
    }
  }, [isAuthenticated, currentView, isLoading]);

  // Secure browser Back button navigation and bfcache page restores
  useEffect(() => {
    const handleNavigationSecurity = () => {
      if (!isAuthenticated && PROTECTED_VIEWS.includes(currentView)) {
        setCurrentView('login');
      }
    };
    window.addEventListener('popstate', handleNavigationSecurity);
    window.addEventListener('pageshow', handleNavigationSecurity);
    return () => {
      window.removeEventListener('popstate', handleNavigationSecurity);
      window.removeEventListener('pageshow', handleNavigationSecurity);
    };
  }, [isAuthenticated, currentView]);

  const handleNavigate = (view: string) => {
    if (!isAuthenticated && PROTECTED_VIEWS.includes(view)) {
      setCurrentView('login');
      return;
    }
    setCurrentView(view);
  };

  // 1. Landing Page View
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentView={currentView}
          setCurrentView={handleNavigate}
          onOpenAuth={() => setCurrentView('login')}
        />
        <main className="flex-1">
          <LandingPage
            onStart={(targetView) => handleNavigate(targetView || 'dashboard')}
            onOpenAuth={() => setCurrentView('login')}
          />
        </main>
        <Footer />
      </div>
    );
  }

  // 2. Separate Login Page View
  if (currentView === 'login') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentView={currentView}
          setCurrentView={handleNavigate}
          onOpenAuth={() => setCurrentView('login')}
        />
        <main className="flex-1 flex items-center justify-center p-4">
          <LoginPage onNavigate={handleNavigate} />
        </main>
        <Footer />
      </div>
    );
  }

  // 3. Separate Register Page View
  if (currentView === 'register') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentView={currentView}
          setCurrentView={handleNavigate}
          onOpenAuth={() => setCurrentView('login')}
        />
        <main className="flex-1 flex items-center justify-center p-4">
          <RegisterPage onNavigate={handleNavigate} />
        </main>
        <Footer />
      </div>
    );
  }

  // 4. Fallback Guard for Unauthenticated state attempting to view protected views
  if (!isAuthenticated && PROTECTED_VIEWS.includes(currentView)) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentView="login"
          setCurrentView={handleNavigate}
          onOpenAuth={() => setCurrentView('login')}
        />
        <main className="flex-1 flex items-center justify-center p-4">
          <LoginPage onNavigate={handleNavigate} />
        </main>
        <Footer />
      </div>
    );
  }

  // 5. Protected Student Portal View (Dashboard, Assessment, Chat, Resume, Interview, Roadmap, Jobs, Profile)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentView={currentView}
        setCurrentView={handleNavigate}
        onOpenAuth={() => setCurrentView('login')}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          setCurrentView={handleNavigate}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && <DashboardView onNavigate={handleNavigate} />}
            {currentView === 'assessment' && <AssessmentView />}
            {currentView === 'chat' && <CareerChatView />}
            {currentView === 'resume' && <ResumeBuilderView />}
            {currentView === 'interview' && <InterviewView />}
            {currentView === 'roadmap' && <RoadmapView />}
            {currentView === 'jobs' && <JobsView />}
            {currentView === 'profile' && <ProfileView />}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CareerProvider>
        <MainAppContent />
      </CareerProvider>
    </AuthProvider>
  );
}
