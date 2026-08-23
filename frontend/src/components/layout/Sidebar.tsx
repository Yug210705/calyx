import React, { useState, createContext, useContext } from 'react';
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
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  Star,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import './Sidebar.css';

// Sidebar context for collapse state
const SidebarContext = createContext<{
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}>({ collapsed: false, setCollapsed: () => {} });

export const useSidebar = () => useContext(SidebarContext);

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
  { name: 'Atlas Mobile App', color: '#6366F1' },
  { name: 'Website Redesign', color: '#06B6D4' },
  { name: 'Internal Dashboard', color: '#F59E0B' },
];

export const SidebarProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = () => {
  const location = useLocation();
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <aside className={clsx('sidebar', collapsed && 'sidebar--collapsed')}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo-container">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 22H12V2Z" fill="#8B5CF6"/>
            <path d="M12 2V22H22L12 2Z" fill="#3B82F6"/>
          </svg>
          {!collapsed && <span className="logo-text">atlas</span>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>
      
      {/* Navigation */}
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
                title={collapsed ? item.name : undefined}
              >
                <Icon className="nav-icon" size={18} />
                {!collapsed && <span className="nav-label">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Starred Projects */}
        {!collapsed && (
          <div className="sidebar-section">
            <h3 className="section-title">
              <Star size={12} />
              Starred Projects
            </h3>
            <ul className="starred-list">
              {starredProjects.map((project) => (
                <li key={project.name} className="starred-item">
                  <span 
                    className="project-dot" 
                    style={{ backgroundColor: project.color }} 
                  />
                  <span className="starred-name">{project.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        {!collapsed ? (
          <>
            <a href="https://docs.atlas.app" target="_blank" rel="noreferrer" className="sidebar-help-link">
              <HelpCircle size={14} />
              <span>Help & Documentation</span>
              <ExternalLink size={12} />
            </a>
            <div className="sidebar-org">
              <div className="org-icon">A</div>
              <div className="org-info">
                <div className="org-name">Atlas Organization</div>
                <div className="org-plan">Enterprise Plan</div>
              </div>
              <ChevronDown size={14} className="org-chevron" />
            </div>
          </>
        ) : (
          <div className="sidebar-org sidebar-org--collapsed" title="Atlas Organization">
            <div className="org-icon">A</div>
          </div>
        )}
      </div>
    </aside>
  );
};
