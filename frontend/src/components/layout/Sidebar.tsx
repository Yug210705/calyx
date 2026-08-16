import React from 'react';
import { 
  Home, 
  FolderKanban, 
  CheckSquare, 
  Calendar, 
  Users, 
  Activity, 
  BarChart2, 
  Blocks, 
  Settings,
  ChevronDown
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import './Sidebar.css';

const navItems = [
  { name: 'Overview', icon: Home, path: '/' },
  { name: 'Projects', icon: FolderKanban, path: '/projects' },
  { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
  { name: 'Calendar', icon: Calendar, path: '/calendar' },
  { name: 'Teams', icon: Users, path: '/teams' },
  { name: 'Activity', icon: Activity, path: '/activity' },
  { name: 'Reports', icon: BarChart2, path: '/reports' },
  { name: 'Integrations', icon: Blocks, path: '/integrations' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

const starredProjects = [
  { name: 'Atlas Mobile App', color: '#5B3EFF' },
  { name: 'Website Redesign', color: '#06B6D4' },
  { name: 'Internal Dashboard', color: '#F59E0B' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 22H12V2Z" fill="#8B5CF6"/>
            <path d="M12 2V22H22L12 2Z" fill="#3B82F6"/>
          </svg>
          <span className="logo-text">atlas</span>
        </div>
      </div>
      
      <div className="sidebar-scrollable">
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={clsx('nav-item', isActive && 'active')}
              >
                <Icon className="nav-icon" size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-section">
          <h3 className="section-title">STARRED PROJECTS</h3>
          <ul className="starred-list">
            {starredProjects.map((project) => (
              <li key={project.name} className="starred-item">
                <span 
                  className="dot" 
                  style={{ backgroundColor: project.color }} 
                />
                <span className="starred-name">{project.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-profile-left">
            <div className="org-icon">A</div>
            <div className="user-info">
              <div className="user-name">Atlas Organization</div>
              <div className="user-role">Enterprise Plan</div>
            </div>
          </div>
          <ChevronDown size={16} className="user-chevron" />
        </div>
      </div>
    </aside>
  );
};
