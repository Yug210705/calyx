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
  ChevronUp,
  ArrowRight,
  ChevronsLeft
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import atlasLogo from '../../assets/atlaslogo.png';
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

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  const currentPath = location.pathname;

  return (
    <aside className={clsx('sidebar', { collapsed })}>
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          <img src={atlasLogo} alt="Atlas Logo" className="logo-img" />
          {!collapsed && <span className="logo-text">atlas</span>}
        </Link>
      </div>

      <nav className="sidebar-nav custom-scrollbar">
        <div className="nav-section">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className={clsx('nav-item', { active: currentPath === item.path })}
            >
              <item.icon size={18} className="nav-icon" />
              {!collapsed && <span className="nav-label">{item.name}</span>}
            </Link>
          ))}
        </div>

        {!collapsed && (
          <div className="sidebar-starred-section">
            <h4 className="starred-title">STARRED PROJECTS</h4>
            <div className="starred-list">
              <div className="starred-item">
                <div className="starred-dot" style={{ backgroundColor: '#3b82f6' }}></div>
                <span>Atlas Mobile App</span>
              </div>
              <div className="starred-item">
                <div className="starred-dot" style={{ backgroundColor: '#10b981' }}></div>
                <span>Website Redesign</span>
              </div>
              <div className="starred-item">
                <div className="starred-dot" style={{ backgroundColor: '#f59e0b' }}></div>
                <span>Internal Dashboard</span>
              </div>
              <div className="starred-item">
                <div className="starred-dot" style={{ backgroundColor: '#8b5cf6' }}></div>
                <span>Marketing Website</span>
              </div>
            </div>
            <Link to="/projects" className="view-all-projects">
              <ArrowRight size={14} /> View all projects
            </Link>
          </div>
        )}
      </nav>

      {!collapsed && (
        <div className="sidebar-footer">
          <div className="org-switcher">
            <div className="org-logo">A</div>
            <div className="org-info">
              <div className="org-name">Atlas Organization</div>
              <div className="org-plan">Enterprise Plan</div>
            </div>
            <ChevronUp size={16} className="org-chevron" />
          </div>

          <div className="plan-usage">
            <div className="plan-usage-header">
              <span>Plan usage</span>
              <span>78%</span>
            </div>
            <div className="plan-usage-bar">
              <div className="plan-usage-progress" style={{ width: '78%' }}></div>
            </div>
            <div className="plan-usage-text">156 GB / 200 GB used</div>
            <Link to="/settings" className="manage-subscription">
              Manage subscription <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      )}

      <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
        <ChevronsLeft size={16} />
        {!collapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
};
