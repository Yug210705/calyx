import React, { useState, useRef, useEffect } from 'react';
import { 
  Folder, 
  CheckCircle2, 
  Calendar as CalendarIcon,
  ChevronDown,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Layout,
  Globe,
  Settings,
  Megaphone,
  Shield,
  Activity,
  User,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import './Dashboard.css';

// ---------------------------------------------------------
// DATA
// ---------------------------------------------------------

const areaData = [
  { name: 'May 12', created: 20, completed: 10 },
  { name: 'May 13', created: 35, completed: 18 },
  { name: 'May 14', created: 38, completed: 19 },
  { name: 'May 15', created: 45, completed: 25 },
  { name: 'May 16', created: 52, completed: 28 },
  { name: 'May 17', created: 40, completed: 20 },
  { name: 'May 18', created: 50, completed: 25 },
];

const pieData = [
  { name: 'To Do', value: 48, color: '#3b82f6' },
  { name: 'In Progress', value: 32, color: '#8b5cf6' },
  { name: 'Review', value: 16, color: '#f59e0b' },
  { name: 'Done', value: 32, color: '#10b981' },
];

const sparklineData1 = [ {v:10}, {v:12}, {v:15}, {v:13}, {v:18}, {v:14}, {v:20} ];
const sparklineData2 = [ {v:20}, {v:22}, {v:25}, {v:21}, {v:28}, {v:24}, {v:30} ];
const sparklineData3 = [ {v:10}, {v:15}, {v:12}, {v:18}, {v:14}, {v:22}, {v:25} ];
const sparklineData4 = [ {v:5}, {v:8}, {v:7}, {v:10}, {v:12}, {v:15}, {v:14} ];

// ---------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------

export const Dashboard = () => {
  const [range, setRange] = useState('This Week');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className="dashboard-container custom-scrollbar">
      <div className="dashboard-content">
        
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="dashboard-header-left">
            <h1 className="welcome-title">Welcome back, Yug! 👋</h1>
            <p className="welcome-subtitle">Here's what's happening in your workspace today.</p>
          </div>
          <div className="dashboard-header-right">
            <div className="date-picker-wrapper" ref={dropdownRef}>
              <button 
                className="date-picker-btn" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <CalendarIcon size={16} />
                <span>May 12 – May 18, 2024</span>
                <ChevronDown size={14} className="chevron" />
              </button>
            </div>
            <button className="btn-primary" style={{ height: '36px', padding: '0 16px', fontSize: '13px' }}>
              <Plus size={16} /> New
              <ChevronDown size={14} style={{ marginLeft: 4 }} />
            </button>
          </div>
        </div>

        {/* ROW 1: KPI Cards */}
        <div className="kpi-grid">
          {/* Card 1 */}
          <div className="kpi-card">
            <div className="kpi-card-header">
              <div className="kpi-info">
                <span className="kpi-label">Total Projects</span>
                <span className="kpi-value">24</span>
                <span className="kpi-trend trend-up"><ArrowUpRight size={14}/> 12% <span>vs last week</span></span>
              </div>
              <div className="kpi-icon-wrapper" style={{color: '#3b82f6', background: '#eff6ff'}}><Folder size={20}/></div>
            </div>
            <div className="kpi-chart">
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={sparklineData1}>
                  <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2.5} dot={true} r={3} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 2 */}
          <div className="kpi-card">
            <div className="kpi-card-header">
              <div className="kpi-info">
                <span className="kpi-label">Total Tasks</span>
                <span className="kpi-value">128</span>
                <span className="kpi-trend trend-up"><ArrowUpRight size={14}/> 8% <span>vs last week</span></span>
              </div>
              <div className="kpi-icon-wrapper" style={{color: '#10b981', background: '#f0fdf4'}}><CheckSquareIcon /></div>
            </div>
            <div className="kpi-chart">
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={sparklineData2}>
                  <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2.5} dot={true} r={3} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 3 */}
          <div className="kpi-card">
            <div className="kpi-card-header">
              <div className="kpi-info">
                <span className="kpi-label">Completed Tasks</span>
                <span className="kpi-value">72</span>
                <span className="kpi-trend trend-up"><ArrowUpRight size={14}/> 18% <span>vs last week</span></span>
              </div>
              <div className="kpi-icon-wrapper" style={{color: '#f59e0b', background: '#fffbeb'}}><CheckCircle2 size={20}/></div>
            </div>
            <div className="kpi-chart">
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={sparklineData3}>
                  <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2.5} dot={true} r={3} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 4 */}
          <div className="kpi-card">
            <div className="kpi-card-header">
              <div className="kpi-info">
                <span className="kpi-label">Team Members</span>
                <span className="kpi-value">18</span>
                <span className="kpi-trend trend-up"><ArrowUpRight size={14}/> 4% <span>vs last week</span></span>
              </div>
              <div className="kpi-icon-wrapper" style={{color: '#3b82f6', background: '#eff6ff'}}><Users size={20}/></div>
            </div>
            <div className="kpi-chart">
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={sparklineData4}>
                  <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2.5} dot={true} r={3} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="middle-grid">
          {/* Tasks Overview */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Tasks Overview</h3>
              <a href="#" className="dash-card-link">View all tasks →</a>
            </div>
            <div className="donut-layout">
              <div className="donut-chart-wrapper">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={pieData} innerRadius={55} outerRadius={75} paddingAngle={0} dataKey="value" stroke="none" isAnimationActive={false}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-center-text">
                  <span className="donut-center-val">128</span>
                  <span className="donut-center-label">Total</span>
                </div>
              </div>
              <div className="donut-legend">
                {pieData.map(item => (
                  <div className="donut-legend-item" key={item.name}>
                    <div className="donut-legend-left">
                      <span className="donut-legend-dot" style={{background: item.color}}></span>
                      <span className="donut-legend-name">{item.name}</span>
                    </div>
                    <span className="donut-legend-val">{item.value} <span className="donut-legend-pct">({Math.round((item.value/128)*100)}%)</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Projects Progress */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Projects Progress</h3>
              <a href="#" className="dash-card-link">View all projects →</a>
            </div>
            <div className="projects-progress-list">
              {[
                { name: 'Atlas Mobile App', icon: Layout, color: '#3b82f6', bg: '#eff6ff', progress: 75 },
                { name: 'Website Redesign', icon: Globe, color: '#3b82f6', bg: '#eff6ff', progress: 45 },
                { name: 'AI Dashboard', icon: Settings, color: '#10b981', bg: '#f0fdf4', progress: 90 },
                { name: 'Marketing Website', icon: Megaphone, color: '#f59e0b', bg: '#fffbeb', progress: 20 },
                { name: 'Admin Panel', icon: Shield, color: '#6b7280', bg: '#f3f4f6', progress: 10 }
              ].map(proj => (
                <div className="proj-prog-item" key={proj.name}>
                  <div className="proj-prog-info">
                    <div className="proj-prog-icon" style={{color: proj.color, background: proj.bg}}><proj.icon size={14}/></div>
                    <span className="proj-prog-name">{proj.name}</span>
                  </div>
                  <div className="proj-prog-bar-wrapper">
                    <div className="proj-prog-bar" style={{width: `${proj.progress}%`, background: proj.color}}></div>
                  </div>
                  <span className="proj-prog-val">{proj.progress}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Activity Feed</h3>
              <a href="#" className="dash-card-link">View all →</a>
            </div>
            <div className="activity-list">
              {[
                { name: 'You', action: 'updated the task', target: 'API Integration', time: '2m ago', dot: '#3b82f6', img: 'https://i.pravatar.cc/150?u=yug' },
                { name: 'Riya Sharma', action: 'commented on', target: 'Landing Page Design', time: '15m ago', dot: '#3b82f6', img: 'https://i.pravatar.cc/150?u=riya' },
                { name: 'Arjun Singh', action: 'completed', target: 'Database Schema Design', time: '1h ago', dot: '#10b981', img: 'https://i.pravatar.cc/150?u=arjun' },
                { name: 'Neha Verma', action: 'created a new task', target: 'User Research', time: '2h ago', dot: '#3b82f6', img: 'https://i.pravatar.cc/150?u=neha' }
              ].map((act, i) => (
                <div className="activity-item" key={i}>
                  <img src={act.img} className="activity-avatar" alt="Avatar" />
                  <div className="activity-text">
                    <p><strong>{act.name}</strong> {act.action}</p>
                    <p className="activity-target">{act.target}</p>
                  </div>
                  <div className="activity-meta">
                    <span className="activity-time">{act.time}</span>
                    <span className="activity-dot" style={{background: act.dot}}></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 3 */}
        <div className="bottom-grid">
          
          {/* Workspace Analytics */}
          <div className="dash-card analytics-card">
            <div className="dash-card-header" style={{ marginBottom: '24px' }}>
              <h3 className="dash-card-title">Workspace Analytics</h3>
              <button className="date-picker-btn" style={{ padding: '4px 10px', height: '28px', fontSize: '12px' }}>
                This Week <ChevronDown size={14} style={{marginLeft:4}}/>
              </button>
            </div>
            
            <div className="analytics-kpis">
              <div className="akpi">
                <div className="akpi-icon" style={{color: '#3b82f6', background: '#eff6ff'}}><Activity size={18}/></div>
                <div className="akpi-info">
                  <span className="akpi-label">Total Projects</span>
                  <div className="akpi-val-row">
                    <span className="akpi-val">24</span>
                    <span className="akpi-trend trend-up">↑ 12%</span>
                  </div>
                </div>
              </div>
              <div className="akpi">
                <div className="akpi-icon" style={{color: '#10b981', background: '#f0fdf4'}}><CheckCircle2 size={18}/></div>
                <div className="akpi-info">
                  <span className="akpi-label">Active Tasks</span>
                  <div className="akpi-val-row">
                    <span className="akpi-val">128</span>
                    <span className="akpi-trend trend-up">↑ 8%</span>
                  </div>
                </div>
              </div>
              <div className="akpi">
                <div className="akpi-icon" style={{color: '#8b5cf6', background: '#f3e8ff'}}><Clock size={18}/></div>
                <div className="akpi-info">
                  <span className="akpi-label">Hours Tracked</span>
                  <div className="akpi-val-row">
                    <span className="akpi-val">1,284h</span>
                    <span className="akpi-trend trend-up">↑ 15%</span>
                  </div>
                </div>
              </div>
              <div className="akpi">
                <div className="akpi-icon" style={{color: '#3b82f6', background: '#eff6ff'}}><User size={18}/></div>
                <div className="akpi-info">
                  <span className="akpi-label">Team Capacity</span>
                  <div className="akpi-val-row">
                    <span className="akpi-val">78%</span>
                    <span className="akpi-trend trend-up">↑ 6%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="analytics-chart-legend">
              <span className="legend-item"><span className="dot" style={{background: '#3b82f6'}}></span> Tasks Created</span>
              <span className="legend-item"><span className="dot" style={{background: '#10b981'}}></span> Tasks Completed</span>
            </div>

            <div className="analytics-chart-wrapper">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={areaData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11}} />
                  <CartesianGrid vertical={false} stroke="#f3f4f6" />
                  <Tooltip />
                  <Area type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCreated)" />
                  <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCompleted)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Upcoming Events</h3>
              <a href="#" className="dash-card-link">View calendar →</a>
            </div>
            <div className="events-list">
              {[
                { month: 'MAY', day: '20', title: 'Project Review', sub: 'Atlas Mobile App', time: '10:00 AM - 11:00 AM', attendees: 5, color: '#3b82f6', bg: '#eff6ff' },
                { month: 'MAY', day: '22', title: 'Sprint Planning', sub: 'Website Redesign', time: '02:00 PM - 03:30 PM', attendees: 8, color: '#10b981', bg: '#f0fdf4' },
                { month: 'MAY', day: '24', title: 'Design System Sync', sub: 'Internal Dashboard', time: '11:00 AM - 12:00 PM', attendees: 6, color: '#f59e0b', bg: '#fffbeb' }
              ].map((ev, i) => (
                <div className="event-item" key={i}>
                  <div className="event-date">
                    <span className="event-month" style={{color: ev.color}}>{ev.month}</span>
                    <span className="event-day" style={{color: ev.color}}>{ev.day}</span>
                  </div>
                  <div className="event-info">
                    <h4 className="event-title">{ev.title}</h4>
                    <p className="event-sub">{ev.sub}</p>
                    <p className="event-time">{ev.time}</p>
                  </div>
                  <div className="event-attendees">
                    <Users size={14} color="#9ca3af" />
                    <span>{ev.attendees}</span>
                  </div>
                </div>
              ))}
            </div>
            <a href="#" className="view-all-events">View all events <ArrowRight size={14} /></a>
          </div>

        </div>
      </div>
    </div>
  );
};

// Helper for CheckSquare icon
function CheckSquareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
  );
}
