import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Tasks } from './pages/Tasks';
import { Calendar } from './pages/Calendar';
import { Teams } from './pages/Teams';
import { Activity } from './pages/Activity';
import { Reports } from './pages/Reports';
import { Integrations } from './pages/Integrations';
import { Settings } from './pages/Settings';
import { TopBar } from './components/layout/TopBar';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <TopBar />
          <div className="page-scroller" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* Placeholder routes for other pages */}
              <Route path="/projects" element={<Projects />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
