import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CareerProvider, useCareer } from './context/CareerContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { AssessmentView } from './components/assessment/AssessmentView';
import { CareerChatView } from './components/chat/CareerChatView';
import { ResumeBuilderView } from './components/resume/ResumeBuilderView';
import { InterviewView } from './components/interview/InterviewView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { JobsView } from './components/jobs/JobsView';
import { ProfileView } from './components/profile/ProfileView';

const MainAppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // If on landing page, display the public landing layout
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentView={currentView}
          setCurrentView={setCurrentView}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
        <main className="flex-1">
          <LandingPage
            onStart={(targetView) => setCurrentView(targetView || 'dashboard')}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        </main>
        <Footer />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  // Dashboard & Module View Layout
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && (
              <DashboardView onNavigate={(view) => setCurrentView(view)} />
            )}
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
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
