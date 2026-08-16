import React from 'react';
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
  Layout
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
        {trendUp ? '↑' : '↓'} {trend} this week
      </div>
    </div>
  </div>
);

const tasks = [
  { id: 1, title: 'Implement authentication using JWT', project: 'Atlas Mobile App', projectIcon: <Layout size={14} color="#5B3EFF"/>, date: 'May 20', priority: 'High', badge: 'badge-high' },
  { id: 2, title: 'Design landing page', project: 'Website Redesign', projectIcon: <Globe size={14} color="#3B82F6"/>, date: 'May 21', priority: 'Medium', badge: 'badge-medium' },
  { id: 3, title: 'Database schema design', project: 'AI Dashboard', projectIcon: <Settings size={14} color="#22C55E"/>, date: 'May 22', priority: 'High', badge: 'badge-high' },
  { id: 4, title: 'API integration', project: 'Atlas Mobile App', projectIcon: <Layout size={14} color="#5B3EFF"/>, date: 'May 23', priority: 'Medium', badge: 'badge-medium' },
  { id: 5, title: 'Write unit tests', project: 'Admin Panel', projectIcon: <Folder size={14} color="#6B7280"/>, date: 'May 24', priority: 'Low', badge: 'badge-low' },
];

const team = [
  { id: 1, name: 'Yug Pratap', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=yug', progress: 80 },
  { id: 2, name: 'Riya Sharma', role: 'Project Manager', avatar: 'https://i.pravatar.cc/150?u=riya', progress: 60 },
  { id: 3, name: 'Arjun Singh', role: 'Developer', avatar: 'https://i.pravatar.cc/150?u=arjun', progress: 75 },
  { id: 4, name: 'Neha Verma', role: 'Designer', avatar: 'https://i.pravatar.cc/150?u=neha', progress: 40 },
  { id: 5, name: 'Pooja Yadav', role: 'QA Engineer', avatar: 'https://i.pravatar.cc/150?u=pooja', progress: 50 },
];

export const Dashboard = () => {
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
              <button className="date-picker-btn">
                <CalendarIcon size={16} className="date-icon" />
                <span>May 12 – May 18, 2024</span>
                <ChevronDown size={14} className="chevron" />
              </button>
            </div>
          </div>

          {/* Stats Grid inside Welcome Section */}
          <div className="stats-grid">
            <StatCard 
              icon={Folder} label="Projects" value="24" 
              trend="12%" trendUp={true} color="#5B3EFF" bgColor="#F5F3FF"
            />
            <StatCard 
              icon={CheckCircle2} label="Tasks" value="128" 
              trend="8%" trendUp={true} color="#22C55E" bgColor="#DCFCE7"
            />
            <StatCard 
              icon={Clock} label="Completed" value="72" 
              trend="18%" trendUp={true} color="#F59E0B" bgColor="#FEF3C7"
            />
            <StatCard 
              icon={Users} label="Team Members" value="18" 
              trend="4%" trendUp={true} color="#3B82F6" bgColor="#DBEAFE"
            />
          </div>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid">
          
          <div className="card task-overview">
            <h3 className="card-title">Tasks Overview</h3>
            <div className="chart-container">
              <div className="donut-chart">
                <div className="donut-label">
                  <span className="donut-value">128</span>
                  <span className="donut-text">Total</span>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item"><span className="dot" style={{background: '#5B3EFF'}}></span> <span className="legend-label">To Do</span> <span className="val">48 (37%)</span></div>
                <div className="legend-item"><span className="dot" style={{background: '#3B82F6'}}></span> <span className="legend-label">In Progress</span> <span className="val">32 (25%)</span></div>
                <div className="legend-item"><span className="dot" style={{background: '#F59E0B'}}></span> <span className="legend-label">Review</span> <span className="val">16 (13%)</span></div>
                <div className="legend-item"><span className="dot" style={{background: '#22C55E'}}></span> <span className="legend-label">Done</span> <span className="val">32 (25%)</span></div>
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
                  <div className="progress-icon" style={{color: '#5B3EFF', background: '#F5F3FF'}}><Layout size={16}/></div>
                  <span className="truncate">Atlas Mobile App</span>
                </div>
                <div className="progress-bar-container"><div className="progress-bar" style={{width: '75%', background: '#5B3EFF'}}></div></div>
                <div className="progress-percent">75%</div>
              </div>
              <div className="progress-item">
                <div className="progress-info">
                  <div className="progress-icon" style={{color: '#3B82F6', background: '#DBEAFE'}}><Globe size={16}/></div>
                  <span className="truncate">Website Redesign</span>
                </div>
                <div className="progress-bar-container"><div className="progress-bar" style={{width: '45%', background: '#3B82F6'}}></div></div>
                <div className="progress-percent">45%</div>
              </div>
              <div className="progress-item">
                <div className="progress-info">
                  <div className="progress-icon" style={{color: '#22C55E', background: '#DCFCE7'}}><Settings size={16}/></div>
                  <span className="truncate">AI Dashboard</span>
                </div>
                <div className="progress-bar-container"><div className="progress-bar" style={{width: '90%', background: '#5B3EFF'}}></div></div>
                <div className="progress-percent">90%</div>
              </div>
              <div className="progress-item">
                <div className="progress-info">
                  <div className="progress-icon" style={{color: '#F59E0B', background: '#FEF3C7'}}><Megaphone size={16}/></div>
                  <span className="truncate">Marketing Website</span>
                </div>
                <div className="progress-bar-container"><div className="progress-bar" style={{width: '20%', background: '#5B3EFF'}}></div></div>
                <div className="progress-percent">20%</div>
              </div>
              <div className="progress-item">
                <div className="progress-info">
                  <div className="progress-icon" style={{color: '#6B7280', background: '#F3F4F6'}}><Folder size={16}/></div>
                  <span className="truncate">Admin Panel</span>
                </div>
                <div className="progress-bar-container"><div className="progress-bar" style={{width: '10%', background: '#5B3EFF'}}></div></div>
                <div className="progress-percent">10%</div>
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
              {team.map(member => (
                <div key={member.id} className="workload-item">
                  <img src={member.avatar} alt={member.name} className="workload-avatar" />
                  <div className="workload-info">
                    <div className="workload-name">{member.name}</div>
                    <div className="workload-role">{member.role}</div>
                  </div>
                  <div className="workload-bar-container">
                    <div className="workload-bar" style={{width: `${member.progress}%`}}></div>
                  </div>
                  <div className="workload-percent">{member.progress}%</div>
                </div>
              ))}
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};
