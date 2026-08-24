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
  ChevronsLeft,
  Briefcase,
  Map,
  Inbox,
  MessageCircle,
  Target,
  Milestone,
  Layers,
  FileText,
  BookOpen,
  File,
  PieChart,
  UserCog,
  ScrollText,
  Zap
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import atlasLogo from '../../assets/atlaslogo.png';
import './Sidebar.css';

const SidebarContext = createContext<{
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}>({ collapsed: false, setCollapsed: () => {} });

export const useSidebar = () => useContext(SidebarContext);

const navSections = [
  {
    items: [
      { name: 'Overview', icon: Home, path: '/' },
    ]
  },
  {
    title: 'WORK',
    items: [
      { name: 'Projects', icon: FolderKanban, path: '/projects' },
      { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
      { name: 'My Work', icon: Briefcase, path: '/my-work' },
      { name: 'Calendar', icon: Calendar, path: '/calendar' },
      { name: 'Roadmap', icon: Map, path: '/roadmap' },
    ]
  },
  {
    title: 'COLLABORATION',
    items: [
      { name: 'Teams', icon: Users, path: '/teams' },
      { name: 'Inbox', icon: Inbox, path: '/inbox', badge: 14 },
      { name: 'Activity', icon: Activity, path: '/activity' },
    ]
  },
  {
    title: 'PLANNING',
    items: [
      { name: 'Backlog', icon: Layers, path: '/backlog' },
      { name: 'Sprints', icon: Zap, path: '/sprints' },
      { name: 'Goals', icon: Target, path: '/goals' },
    ]
  },
  {
    title: 'KNOWLEDGE',
    items: [
      { name: 'Documents', icon: FileText, path: '/documents' },
      { name: 'Files', icon: File, path: '/files' },
    ]
  },
  {
    title: 'INSIGHTS',
    items: [
      { name: 'Reports', icon: BarChart2, path: '/reports' },
      { name: 'Analytics', icon: PieChart, path: '/analytics' },
    ]
  },
  {
    title: 'PLATFORM',
    items: [
      { name: 'Integrations', icon: Blocks, path: '/integrations' },
    ]
  },
  {
    title: 'ADMIN',
    items: [
      { name: 'Members', icon: UserCog, path: '/members' },
      { name: 'Audit Logs', icon: ScrollText, path: '/audit-logs' },
      { name: 'Settings', icon: Settings, path: '/settings' },
    ]
  },
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
        {navSections.map((section, si) => (
          <div className="nav-section" key={si}>
            {section.title && !collapsed && (
              <div className="nav-section-title">{section.title}</div>
            )}
            {section.items.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className={clsx('nav-item', { active: currentPath === item.path })}
              >
                <item.icon size={17} className="nav-icon" />
                {!collapsed && (
                  <>
                    <span className="nav-label">{item.name}</span>
                    {'badge' in item && item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </>
                )}
              </Link>
            ))}
          </div>
        ))}
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
