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
  ExternalLink,
  CalendarDays,
  UsersRound,
  FolderOpen,
  ListTodo,
  KanbanSquare,
  GanttChart,
  LayoutGrid,
  Clock,
  TrendingUp,
  PieChart,
  FileBarChart,
  Layers,
  Timer,
  Puzzle,
  Zap,
  Database,
  Globe,
  UserCog,
  Shield,
  Bell,
  Palette,
  Key
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

// Contextual sidebar content per page
const contextualSections: Record<string, { sections: { title: string; items: { name: string; icon: React.ElementType; color?: string; subtitle?: string; active?: boolean }[]; viewAllLink?: string }[] }> = {
  '/': {
    sections: [
      {
        title: 'STARRED PROJECTS',
        items: [
          { name: 'Atlas Mobile App', icon: Star, color: '#6366F1' },
          { name: 'Website Redesign', icon: Star, color: '#06B6D4' },
          { name: 'Internal Dashboard', icon: Star, color: '#F59E0B' },
        ]
      }
    ]
  },
  '/projects': {
    sections: [
      {
        title: 'PROJECT VIEWS',
        items: [
          { name: 'All Projects', icon: LayoutGrid, active: true },
          { name: 'Board View', icon: KanbanSquare },
          { name: 'Timeline', icon: GanttChart },
        ]
      },
      {
        title: 'RECENT PROJECTS',
        items: [
          { name: 'Atlas Mobile App', icon: Star, color: '#6366F1' },
          { name: 'Website Redesign', icon: Star, color: '#06B6D4' },
          { name: 'AI Dashboard', icon: Star, color: '#10B981' },
        ],
        viewAllLink: '/projects'
      }
    ]
  },
  '/tasks': {
    sections: [
      {
        title: 'TASK VIEWS',
        items: [
          { name: 'My Tasks', icon: ListTodo, active: true },
          { name: 'Board View', icon: KanbanSquare },
          { name: 'Timeline', icon: GanttChart },
        ]
      },
      {
        title: 'DUE SOON',
        items: [
          { name: 'API Integration', icon: Clock, color: '#EF4444', subtitle: 'Due today' },
          { name: 'Landing Page Design', icon: Clock, color: '#F59E0B', subtitle: 'Due tomorrow' },
          { name: 'Schema Design', icon: Clock, color: '#10B981', subtitle: 'May 25' },
        ],
        viewAllLink: '/tasks'
      }
    ]
  },
  '/calendar': {
    sections: [
      {
        title: 'CALENDAR VIEWS',
        items: [
          { name: 'My Calendar', icon: CalendarDays, color: '#6366F1', active: true },
          { name: 'Team Calendar', icon: UsersRound, color: '#64748B' },
          { name: 'Project Calendar', icon: FolderOpen, color: '#10B981' },
        ]
      },
      {
        title: 'UPCOMING',
        items: [
          { name: 'Sprint Planning', icon: Clock, color: '#6366F1', subtitle: 'May 20, 10:00 AM' },
          { name: 'Design Review', icon: Clock, color: '#10B981', subtitle: 'May 22, 02:00 PM' },
          { name: 'Release v1.0', icon: Clock, color: '#F59E0B', subtitle: 'May 30, 09:00 AM' },
        ],
        viewAllLink: '/calendar'
      }
    ]
  },
  '/teams': {
    sections: [
      {
        title: 'TEAM VIEWS',
        items: [
          { name: 'All Teams', icon: Users, active: true },
          { name: 'Workload', icon: BarChart2 },
          { name: 'Roles & Access', icon: Shield },
        ]
      },
      {
        title: 'YOUR TEAMS',
        items: [
          { name: 'Engineering', icon: Star, color: '#3B82F6' },
          { name: 'Product', icon: Star, color: '#10B981' },
          { name: 'Design', icon: Star, color: '#F59E0B' },
        ]
      }
    ]
  },
  '/activity': {
    sections: [
      {
        title: 'ACTIVITY FILTERS',
        items: [
          { name: 'All Activity', icon: Activity, active: true },
          { name: 'Mentions', icon: Bell },
          { name: 'Updates', icon: TrendingUp },
        ]
      }
    ]
  },
  '/reports': {
    sections: [
      {
        title: 'REPORT TYPES',
        items: [
          { name: 'Overview', icon: PieChart, active: true },
          { name: 'Projects', icon: FolderKanban },
          { name: 'Tasks', icon: FileBarChart },
          { name: 'Teams', icon: Users },
        ]
      }
    ]
  },
  '/integrations': {
    sections: [
      {
        title: 'CATEGORIES',
        items: [
          { name: 'All Integrations', icon: Layers, active: true },
          { name: 'Automation', icon: Zap },
          { name: 'Database', icon: Database },
          { name: 'Communication', icon: Globe },
        ]
      }
    ]
  },
  '/settings': {
    sections: [
      {
        title: 'SETTINGS',
        items: [
          { name: 'Profile', icon: UserCog, active: true },
          { name: 'Notifications', icon: Bell },
          { name: 'Appearance', icon: Palette },
          { name: 'Security', icon: Key },
        ]
      }
    ]
  },
};

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
  const contextual = contextualSections[location.pathname];

  return (
    <aside className={clsx('sidebar', collapsed && 'sidebar--collapsed')}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo-container">
          <img src={atlasLogo} alt="Atlas Logo" style={{ height: '32px', width: 'auto' }} />
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

        {/* Contextual Sections */}
        {!collapsed && contextual && contextual.sections.map((section, sIdx) => (
          <div className="sidebar-section" key={sIdx}>
            <h3 className="section-title">{section.title}</h3>
            <ul className="context-list">
              {section.items.map((item) => (
                <li key={item.name} className={clsx('context-item', item.active && 'context-item--active')}>
                  {item.color ? (
                    <span className="project-dot" style={{ backgroundColor: item.color }} />
                  ) : (
                    <item.icon size={15} className="context-icon" />
                  )}
                  <div className="context-text">
                    <span className="context-name">{item.name}</span>
                    {item.subtitle && <span className="context-subtitle">{item.subtitle}</span>}
                  </div>
                </li>
              ))}
            </ul>
            {section.viewAllLink && (
              <Link to={section.viewAllLink} className="context-view-all">View all</Link>
            )}
          </div>
        ))}
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
