import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Sidebar, SidebarProvider } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Tasks } from './pages/Tasks';
import { Calendar } from './pages/Calendar';
import { Teams } from './pages/Teams';
import { Activity } from './pages/Activity';
import { Reports } from './pages/Reports';
import { Integrations } from './pages/Integrations';
import { Settings } from './pages/Settings';
import { MyWork } from './pages/MyWork';
import { Roadmap } from './pages/Roadmap';
import { Inbox } from './pages/Inbox';
import { Backlog } from './pages/Backlog';
import { Sprints } from './pages/Sprints';
import { Goals } from './pages/Goals';
import { Documents } from './pages/Documents';
import { Files } from './pages/Files';
import { Analytics } from './pages/Analytics';
import { Members } from './pages/Members';
import { AuditLogs } from './pages/AuditLogs';
import { AuthPage } from './pages/AuthPage';
import { VerifyEmail } from './pages/VerifyEmail';
import { TopBar } from './components/layout/TopBar';
import { AuthProvider, useAuth } from './services/AuthContext';
import './index.css';

const ProtectedLayout = () => {
  const { session, isDemoMode, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Atlas...</div>;
  }

  if (!session && !isDemoMode) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <TopBar />
          <div className="page-scroller" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

function App() {
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('atlas_theme') || 'light';
    if (savedTheme !== 'light') {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/my-work" element={<MyWork />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/backlog" element={<Backlog />} />
            <Route path="/sprints" element={<Sprints />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/files" element={<Files />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/members" element={<Members />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
