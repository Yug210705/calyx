import React, { useState, useRef, useEffect } from 'react';
import { 
  Folder, 
  CheckCircle2, 
  Clock, 
  Users, 
  Search, 
  Bell, 
  Calendar as CalendarIcon,
  Moon,
  ChevronDown,
  Plus,
  Globe,
  Settings,
  Megaphone,
  Layout,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const StatCard = ({ icon: Icon, label, value, trend, trendUp, color, bgColor }) => (
  <div className="stat-card">
    <div className="stat-icon-wrapper" style={{ backgroundColor: bgColor, color }}>
      <Icon size={24} strokeWidth={2.5} />
    </div>
    <div className="stat-content">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className={`stat-trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
        {trendUp ? '↑' : '↓'} {trend}
      </div>
    </div>
  </div>
);

// Base data configurations for different time ranges
const DATE_RANGES = {
  'This Week': {
    label: 'May 12 – May 18, 2024',
    stats: { projects: 24, tasks: 128, completed: 72, members: 18 },
    trends: { projects: '12%', tasks: '8%', completed: '18%', members: '4%' },
    overview: { total: 128, todo: 48, inProgress: 32, review: 16, done: 32, p1: 37, p2: 25, p3: 13, p4: 25 },
    progress: [75, 45, 90, 20, 10],
    workload: [80, 60, 75, 40, 50]
  },
  'Last 30 Days': {
    label: 'Apr 18 – May 18, 2024',
    stats: { projects: 45, tasks: 312, completed: 218, members: 21 },
    trends: { projects: '24%', tasks: '15%', completed: '32%', members: '12%' },
    overview: { total: 312, todo: 120, inProgress: 80, review: 42, done: 70, p1: 38, p2: 26, p3: 14, p4: 22 },
    progress: [85, 60, 95, 40, 30],
    workload: [90, 75, 85, 55, 65]
  },
  'This Quarter': {
    label: 'Q2 2024 (Apr - Jun)',
    stats: { projects: 92, tasks: 840, completed: 650, members: 24 },
    trends: { projects: '42%', tasks: '28%', completed: '45%', members: '15%' },
    overview: { total: 840, todo: 250, inProgress: 150, review: 90, done: 350, p1: 30, p2: 18, p3: 11, p4: 41 },
    progress: [100, 80, 100, 60, 45],
    workload: [95, 85, 90, 70, 80]
  },
  'This Year': {
    label: '2024 (Jan - Dec)',
    stats: { projects: 156, tasks: 2150, completed: 1890, members: 28 },
    trends: { projects: '65%', tasks: '40%', completed: '60%', members: '25%' },
    overview: { total: 2150, todo: 500, inProgress: 350, review: 200, done: 1100, p1: 23, p2: 16, p3: 9, p4: 52 },
    progress: [100, 100, 100, 90, 85],
    workload: [85, 80, 85, 75, 80]
  }
};

const tasks = [
  { id: 1, title: 'Implement authentication using JWT', project: 'Atlas Mobile App', projectIcon: <Layout size={14} color="#5B3EFF"/>, date: 'May 20', priority: 'High', badge: 'badge-high' },
  { id: 2, title: 'Design landing page', project: 'Website Redesign', projectIcon: <Globe size={14} color="#3B82F6"/>, date: 'May 21', priority: 'Medium', badge: 'badge-medium' },
  { id: 3, title: 'Database schema design', project: 'AI Dashboard', projectIcon: <Settings size={14} color="#22C55E"/>, date: 'May 22', priority: 'High', badge: 'badge-high' },
  { id: 4, title: 'API integration', project: 'Atlas Mobile App', projectIcon: <Layout size={14} color="#5B3EFF"/>, date: 'May 23', priority: 'Medium', badge: 'badge-medium' },
  { id: 5, title: 'Write unit tests', project: 'Admin Panel', projectIcon: <Folder size={14} color="#6B7280"/>, date: 'May 24', priority: 'Low', badge: 'badge-low' },
];

const teamData = [
  { id: 1, name: 'Yug Pratap', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=yug' },
  { id: 2, name: 'Riya Sharma', role: 'Project Manager', avatar: 'https://i.pravatar.cc/150?u=riya' },
  { id: 3, name: 'Arjun Singh', role: 'Developer', avatar: 'https://i.pravatar.cc/150?u=arjun' },
  { id: 4, name: 'Neha Verma', role: 'Designer', avatar: 'https://i.pravatar.cc/150?u=neha' },
  { id: 5, name: 'Pooja Yadav', role: 'QA Engineer', avatar: 'https://i.pravatar.cc/150?u=pooja' },
];

export const Dashboard = () => {
  const [range, setRange] = useState('This Week');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const currentData = DATE_RANGES[range];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dashboard-container">

      {/* Main Content */}
      <div className="dashboard-content">
        
        {/* Welcome Section (Purple Tinted Box) */}
        <div className="welcome-section">
          <div className="global-page-header">
            <div className="global-page-header-left">
              <h2 className="welcome-title">Welcome back, Yug! 👋</h2>
              <p className="welcome-subtitle">Here's what's happening with your workspace today.</p>
            </div>
            <div className="global-page-header-right">
              <div className="date-picker-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
                <button 
                  className="date-picker-btn" 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{ border: isDropdownOpen ? '1px solid var(--primary-color)' : '1px solid var(--border-color)', background: 'var(--card-bg)' }}
                >
                  <CalendarIcon size={16} className="date-icon" />
                  <span>{currentData.label}</span>
                  <ChevronDown size={14} className="chevron" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                </button>
                
                {isDropdownOpen && (
                  <div className="dropdown-menu" style={{ 
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0, 
                    width: '240px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
                    borderRadius: '8px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 100,
                    padding: '8px 0'
                  }}>
                    {Object.keys(DATE_RANGES).map(r => (
                      <button 
                        key={r}
                        onClick={() => { setRange(r); setIsDropdownOpen(false); }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          width: '100%', padding: '10px 16px', background: 'transparent',
                          border: 'none', color: 'var(--text-primary)', fontSize: '13px',
                          textAlign: 'left', cursor: 'pointer', transition: '0.15s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-color)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontWeight: range === r ? 600 : 500, color: range === r ? 'var(--primary-color)' : 'var(--text-primary)' }}>{r}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{DATE_RANGES[r].label}</span>
                        </div>
                        {range === r && <Check size={14} color="var(--primary-color)" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid inside Welcome Section */}
          <div className="stats-grid">
            <StatCard 
              icon={Folder} label="Projects" value={currentData.stats.projects} 
              trend={currentData.trends.projects} trendUp={true} color="#5B3EFF" bgColor="color-mix(in srgb, #5B3EFF 15%, transparent)"
            />
            <StatCard 
              icon={CheckCircle2} label="Tasks" value={currentData.stats.tasks} 
              trend={currentData.trends.tasks} trendUp={true} color="#22C55E" bgColor="color-mix(in srgb, #22C55E 15%, transparent)"
            />
            <StatCard 
              icon={Clock} label="Completed" value={currentData.stats.completed} 
              trend={currentData.trends.completed} trendUp={true} color="#F59E0B" bgColor="color-mix(in srgb, #F59E0B 15%, transparent)"
            />
            <StatCard 
              icon={Users} label="Team Members" value={currentData.stats.members} 
              trend={currentData.trends.members} trendUp={true} color="#3B82F6" bgColor="color-mix(in srgb, #3B82F6 15%, transparent)"
            />
          </div>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid">
          
          <div className="card task-overview">
            <h3 className="card-title">Tasks Overview</h3>
            <div className="chart-container">
              <div className="donut-chart" style={{
                background: `conic-gradient(
                  #5B3EFF 0% ${currentData.overview.p1}%,
                  #3B82F6 ${currentData.overview.p1}% ${currentData.overview.p1 + currentData.overview.p2}%,
                  #F59E0B ${currentData.overview.p1 + currentData.overview.p2}% ${currentData.overview.p1 + currentData.overview.p2 + currentData.overview.p3}%,
                  #22C55E ${currentData.overview.p1 + currentData.overview.p2 + currentData.overview.p3}% 100%
                )`
              }}>
                <div className="donut-label">
                  <span className="donut-value">{currentData.overview.total}</span>
                  <span className="donut-text">Total</span>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item"><span className="dot" style={{background: '#5B3EFF'}}></span> <span className="legend-label">To Do</span> <span className="val">{currentData.overview.todo} ({currentData.overview.p1}%)</span></div>
                <div className="legend-item"><span className="dot" style={{background: '#3B82F6'}}></span> <span className="legend-label">In Progress</span> <span className="val">{currentData.overview.inProgress} ({currentData.overview.p2}%)</span></div>
                <div className="legend-item"><span className="dot" style={{background: '#F59E0B'}}></span> <span className="legend-label">Review</span> <span className="val">{currentData.overview.review} ({currentData.overview.p3}%)</span></div>
                <div className="legend-item"><span className="dot" style={{background: '#22C55E'}}></span> <span className="legend-label">Done</span> <span className="val">{currentData.overview.done} ({currentData.overview.p4}%)</span></div>
              </div>
            </div>
          </div>

          <div className="card project-progress">
            <div className="card-header-flex">
              <h3 className="card-title">Projects Progress</h3>
              <Link to="/projects" className="link">View All →</Link>
            </div>
            <div className="progress-list">
              <div className="progress-item">
                <div className="progress-info">
                  <div className="progress-icon" style={{color: '#5B3EFF', background: 'color-mix(in srgb, #5B3EFF 15%, transparent)'}}><Layout size={16}/></div>
                  <span className="truncate">Atlas Mobile App</span>
                </div>
                <div className="progress-bar-container"><div className="progress-bar" style={{width: `${currentData.progress[0]}%`, background: '#5B3EFF', transition: 'width 0.5s ease'}}></div></div>
                <div className="progress-percent">{currentData.progress[0]}%</div>
              </div>
              <div className="progress-item">
                <div className="progress-info">
                  <div className="progress-icon" style={{color: '#3B82F6', background: 'color-mix(in srgb, #3B82F6 15%, transparent)'}}><Globe size={16}/></div>
                  <span className="truncate">Website Redesign</span>
                </div>
                <div className="progress-bar-container"><div className="progress-bar" style={{width: `${currentData.progress[1]}%`, background: '#3B82F6', transition: 'width 0.5s ease'}}></div></div>
                <div className="progress-percent">{currentData.progress[1]}%</div>
              </div>
              <div className="progress-item">
                <div className="progress-info">
                  <div className="progress-icon" style={{color: '#22C55E', background: 'color-mix(in srgb, #22C55E 15%, transparent)'}}><Settings size={16}/></div>
                  <span className="truncate">AI Dashboard</span>
                </div>
                <div className="progress-bar-container"><div className="progress-bar" style={{width: `${currentData.progress[2]}%`, background: '#5B3EFF', transition: 'width 0.5s ease'}}></div></div>
                <div className="progress-percent">{currentData.progress[2]}%</div>
              </div>
              <div className="progress-item">
                <div className="progress-info">
                  <div className="progress-icon" style={{color: '#F59E0B', background: 'color-mix(in srgb, #F59E0B 15%, transparent)'}}><Megaphone size={16}/></div>
                  <span className="truncate">Marketing Website</span>
                </div>
                <div className="progress-bar-container"><div className="progress-bar" style={{width: `${currentData.progress[3]}%`, background: '#5B3EFF', transition: 'width 0.5s ease'}}></div></div>
                <div className="progress-percent">{currentData.progress[3]}%</div>
              </div>
              <div className="progress-item">
                <div className="progress-info">
                  <div className="progress-icon" style={{color: '#6B7280', background: 'color-mix(in srgb, #6B7280 15%, transparent)'}}><Folder size={16}/></div>
                  <span className="truncate">Admin Panel</span>
                </div>
                <div className="progress-bar-container"><div className="progress-bar" style={{width: `${currentData.progress[4]}%`, background: '#5B3EFF', transition: 'width 0.5s ease'}}></div></div>
                <div className="progress-percent">{currentData.progress[4]}%</div>
              </div>
            </div>
          </div>

          <div className="card activity-feed">
            <div className="card-header-flex">
              <h3 className="card-title">Activity Feed</h3>
              <Link to="/activity" className="link">View All →</Link>
            </div>
            <div className="feed-list">
              <div className="feed-item">
                <img src="https://i.pravatar.cc/150?u=yug" alt="User" />
                <div className="feed-content-wrapper">
                  <div className="feed-text">You updated the task <b>API Integration</b></div>
                  <div className="feed-subtext">Atlas Mobile App</div>
                </div>
                <div className="feed-time">2m ago</div>
              </div>
              <div className="feed-item">
                <img src="https://i.pravatar.cc/150?u=riya" alt="User" />
                <div className="feed-content-wrapper">
                  <div className="feed-text">Riya Sharma commented on <b>Landing Page Design</b></div>
                  <div className="feed-subtext">Website Redesign</div>
                </div>
                <div className="feed-time">15m ago</div>
              </div>
              <div className="feed-item">
                <img src="https://i.pravatar.cc/150?u=arjun" alt="User" />
                <div className="feed-content-wrapper">
                  <div className="feed-text">Arjun Singh completed <b>Database Schema Design</b></div>
                  <div className="feed-subtext">AI Dashboard</div>
                </div>
                <div className="feed-time">1h ago</div>
              </div>
              <div className="feed-item">
                <img src="https://i.pravatar.cc/150?u=neha" alt="User" />
                <div className="feed-content-wrapper">
                  <div className="feed-text">Neha Verma created a new task <b>User Authentication</b></div>
                </div>
                <div className="feed-time">2h ago</div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Grid */}
        <div className="bottom-grid">
          
          <div className="card upcoming-tasks">
            <div className="card-header-flex">
              <h3 className="card-title">Upcoming Tasks</h3>
              <Link to="/calendar" className="link">View Calendar →</Link>
            </div>
            <div className="task-list">
              {/* Table Header */}
              <div className="task-row task-header-row">
                <div className="task-header-col"></div>
                <div className="task-header-col">Task</div>
                <div className="task-header-col">Project</div>
                <div className="task-header-col">Due Date</div>
                <div className="task-header-col text-right">Priority</div>
              </div>
              {/* Table Body */}
              {tasks.map(task => (
                <div key={task.id} className="task-row">
                  <div className="task-checkbox-col">
                    <div className="custom-checkbox"></div>
                  </div>
                  <div className="task-title-col">
                    <span className="task-title">{task.title}</span>
                  </div>
                  <div className="task-project-col">
                    <div className="project-icon-small">{task.projectIcon}</div>
                    <span className="task-project">{task.project}</span>
                  </div>
                  <div className="task-date-col">{task.date}</div>
                  <div className="task-priority-col">
                    <div className={`badge-status ${task.badge}`}>{task.priority}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card team-workload">
            <div className="card-header-flex">
              <h3 className="card-title">Team Workload</h3>
              <Link to="/teams" className="link">View Team →</Link>
            </div>
            <div className="workload-list">
              {teamData.map((member, i) => (
                <div key={member.id} className="workload-item">
                  <img src={member.avatar} alt={member.name} className="workload-avatar" />
                  <div className="workload-info">
                    <div className="workload-name">{member.name}</div>
                    <div className="workload-role">{member.role}</div>
                  </div>
                  <div className="workload-bar-container">
                    <div className="workload-bar" style={{width: `${currentData.workload[i]}%`, transition: 'width 0.5s ease'}}></div>
                  </div>
                  <div className="workload-percent">{currentData.workload[i]}%</div>
                </div>
              ))}
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};
