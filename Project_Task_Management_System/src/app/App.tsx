import { useEffect, useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { LandingPage } from './components/landing-page';
import { AuthPage } from './components/auth-page';
import { DashboardLayout } from './components/dashboard-layout';
import { AdminDashboard } from './components/admin-dashboard';
import { ManagerDashboard } from './components/manager-dashboard';
import { MemberDashboard } from './components/member-dashboard';
import { ProjectsView } from './components/projects-view';
import { AnalyticsView } from './components/analytics-view';
import { TeamView } from './components/team-view';
import { SettingsView } from './components/settings-view';
import { useAuthStore, useAppStore, initializeMockData } from '../store';

// Main App Component
export default function App() {
  const { isAuthenticated, user } = useAuthStore();
  const { theme } = useAppStore();
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'signup' | 'dashboard'>('landing');
  const [currentView, setCurrentView] = useState('dashboard');
  const [hasHydrated, setHasHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Initialize theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Initialize mock data when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      initializeMockData(user.id);
    }
  }, [isAuthenticated, user]);

  // Handle authentication state
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentPage('dashboard');
    } else {
      // Check hash for login/signup
      const hash = window.location.hash.slice(1);
      if (hash === 'login' || hash === 'signup') {
        setCurrentPage(hash);
      } else {
        setCurrentPage('landing');
      }
    }
  }, [isAuthenticated]);

  // Handle hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (!isAuthenticated && (hash === 'login' || hash === 'signup')) {
        setCurrentPage(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

  const handleNavigate = (page: 'login' | 'signup') => {
    window.location.hash = page;
    setCurrentPage(page);
  };

  const handleAuthSuccess = () => {
    window.location.hash = '';
    setCurrentPage('dashboard');
  };

  const handleBackToLanding = () => {
    window.location.hash = '';
    setCurrentPage('landing');
  };

  // Wait for hydration
  if (!hasHydrated) return null;

  // Render appropriate page
  if (currentPage === 'landing') {
    return (
      <>
        <LandingPage onNavigate={handleNavigate} />
        <Toaster position="bottom-right" />
      </>
    );
  }

  if (currentPage === 'login') {
    return (
      <>
        <AuthPage mode="login" onBack={handleBackToLanding} onSuccess={handleAuthSuccess} />
        <Toaster position="bottom-right" />
      </>
    );
  }

  if (currentPage === 'signup') {
    return (
      <>
        <AuthPage mode="signup" onBack={handleBackToLanding} onSuccess={handleAuthSuccess} />
        <Toaster position="bottom-right" />
      </>
    );
  }

  // Dashboard views
  return (
    <>
      <DashboardLayout currentView={currentView} onViewChange={setCurrentView}>
        {currentView === 'dashboard' && (
          <>
            {user?.role === 'admin' && <AdminDashboard />}
            {user?.role === 'manager' && <ManagerDashboard />}
            {user?.role === 'member' && <MemberDashboard />}
          </>
        )}
        {currentView === 'projects' && <ProjectsView />}
        {currentView === 'analytics' && <AnalyticsView />}
        {currentView === 'team' && <TeamView />}
        {currentView === 'settings' && <SettingsView />}
      </DashboardLayout>
      <Toaster position="bottom-right" />
    </>
  );
}
