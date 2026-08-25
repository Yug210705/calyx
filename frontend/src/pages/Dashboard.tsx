import React, { useState, useRef, useEffect } from 'react';
import { 
  Folder, 
  CheckCircle2, 
  Calendar as CalendarIcon,
  ChevronDown,
  Plus,
  ArrowUpRight,
  Layout,
  Globe,
  Settings,
  Megaphone,
  Shield,
  Activity,
  User,
  Users,
  Clock,
  ArrowRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import './Dashboard.css';

/* ═══════ STATIC DATA ═══════ */

const areaData = [
  { name: 'May 12', created: 8, completed: 5 },
  { name: 'May 13', created: 30, completed: 12 },
  { name: 'May 14', created: 35, completed: 14 },
  { name: 'May 15', created: 42, completed: 20 },
  { name: 'May 16', created: 55, completed: 28 },
  { name: 'May 17', created: 45, completed: 24 },
  { name: 'May 18', created: 52, completed: 22 },
];

const pieData = [
  { name: 'To Do',        value: 48, pct: 37, color: '#3b82f6' },
  { name: 'In Progress',  value: 32, pct: 25, color: '#8b5cf6' },
  { name: 'Review',       value: 16, pct: 13, color: '#f59e0b' },
  { name: 'Done',         value: 32, pct: 25, color: '#10b981' },
];

const spark1 = [{v:10},{v:14},{v:13},{v:16},{v:15},{v:18},{v:17},{v:20},{v:19},{v:22}];
const spark2 = [{v:18},{v:20},{v:22},{v:19},{v:24},{v:22},{v:26},{v:25},{v:28},{v:30}];
const spark3 = [{v:8},{v:12},{v:11},{v:15},{v:13},{v:18},{v:16},{v:20},{v:22},{v:25}];
const spark4 = [{v:4},{v:6},{v:7},{v:8},{v:10},{v:9},{v:12},{v:11},{v:14},{v:16}];

/* ═══════ COMPONENT ═══════ */

import { analyticsService, projectService, activityService } from '../services/api';
import { useAuth } from '../services/AuthContext';

export const Dashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const [metrics, setMetrics] = useState({
    total_projects: 0,
    total_tasks: 0,
    completed_tasks: 0,
    team_members: 0
  });
  
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dashData, projData, actData] = await Promise.all([
          analyticsService.getDashboard(),
          projectService.getProjects(),
          activityService.getActivities()
        ]);
        if (dashData?.metrics) setMetrics(dashData.metrics);
        if (projData) setProjects(projData.slice(0, 5));
        if (actData) setActivities(actData.slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="dashboard-container custom-scrollbar">
      <div className="dashboard-content">

        {/* ── HEADER ── */}
        <div className="dashboard-header">
          <div className="dashboard-header-left">
            <h1 className="welcome-title">Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
            <p className="welcome-subtitle">Here's what's happening in your workspace today.</p>
          </div>
          <div className="dashboard-header-right">
            <div className="date-picker-wrapper" ref={dropdownRef}>
              <button className="date-picker-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <CalendarIcon size={15} />
                <span>This Week</span>
                <ChevronDown size={14} className="chevron" />
              </button>
            </div>
            <button className="btn-primary" style={{height:36,padding:'0 16px',fontSize:13,borderRadius:8}}>
              <Plus size={16} /> New
              <ChevronDown size={14} style={{marginLeft:4}} />
            </button>
          </div>
        </div>

        {/* ── ROW 1 — KPI CARDS ── */}
        <div className="kpi-grid">
          <KpiCard label="Total Projects" value={metrics.total_projects.toString()} trend="0%" color="#3b82f6" bgTint="#eff6ff" icon={<Folder size={20} />} data={spark1} />
          <KpiCard label="Total Tasks" value={metrics.total_tasks.toString()} trend="0%" color="#10b981" bgTint="#f0fdf4" icon={<CheckCircle2 size={20} />} data={spark2} />
          <KpiCard label="Completed Tasks" value={metrics.completed_tasks.toString()} trend="0%" color="#f59e0b" bgTint="#fffbeb" icon={<CheckCircle2 size={20} />} data={spark3} />
          <KpiCard label="Team Members" value={metrics.team_members.toString()} trend="0%" color="#6366f1" bgTint="#eef2ff" icon={<Users size={20} />} data={spark4} />
        </div>

        {/* ── ROW 2 — MIDDLE GRID ── */}
        <div className="middle-grid">

          {/* Tasks Overview — Donut */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Tasks Overview</h3>
              <a href="#" className="dash-card-link">View all tasks →</a>
            </div>
            <div className="donut-layout">
              <div className="donut-chart-wrapper">
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie data={pieData} innerRadius={55} outerRadius={78} paddingAngle={2} dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                      {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-center-text">
                  <span className="donut-center-val">128</span>
                  <span className="donut-center-label">Total</span>
                </div>
              </div>
              <div className="donut-legend">
                {pieData.map(d => (
                  <div className="donut-legend-item" key={d.name}>
                    <div className="donut-legend-left">
                      <span className="donut-legend-dot" style={{background:d.color}} />
                      <span className="donut-legend-name">{d.name}</span>
                    </div>
                    <span className="donut-legend-val">{d.value} <span className="donut-legend-pct">({d.pct}%)</span></span>
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
              {projects.length === 0 ? (
                <div style={{padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px'}}>No projects found. Create one to get started!</div>
              ) : projects.map((p: any) => (
                <div className="proj-prog-item" key={p.id}>
                  <div className="proj-prog-info">
                    <div className="proj-prog-icon" style={{color: '#3b82f6', background: '#eff6ff'}}><Layout size={14}/></div>
                    <span className="proj-prog-name">{p.title}</span>
                  </div>
                  <div className="proj-prog-bar-wrapper"><div className="proj-prog-bar" style={{width: `${p.progress || 0}%`, background: '#3b82f6'}} /></div>
                  <span className="proj-prog-val">{p.progress || 0}%</span>
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
              {activities.length === 0 ? (
                <div style={{padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px'}}>No recent activity.</div>
              ) : activities.map((a: any, i) => (
                <div className="activity-item" key={i}>
                  <div className="activity-text">
                    <p>{a.description}</p>
                  </div>
                  <div className="activity-meta"><span className="activity-time">Just now</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ROW 3 — BOTTOM GRID ── */}
        <div className="bottom-grid">

          {/* Workspace Analytics */}
          <div className="dash-card analytics-card">
            <div className="analytics-header">
              <h3 className="dash-card-title">Workspace Analytics</h3>
              <div className="analytics-range-tabs">
                {['Hour','Day','Week','Month','Year'].map(tab => (
                  <button 
                    key={tab} 
                    className={`range-tab ${tab === 'Week' ? 'active' : ''}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="analytics-kpis">
              <div className="akpi">
                <div className="akpi-icon" style={{color:'#6366f1',background:'#eef2ff'}}><Activity size={16}/></div>
                <div className="akpi-info">
                  <span className="akpi-label">Total Projects</span>
                  <div className="akpi-val-row"><span className="akpi-val">24</span><span className="akpi-trend trend-up">↑ 12%</span></div>
                </div>
              </div>
              <div className="akpi">
                <div className="akpi-icon" style={{color:'#10b981',background:'#f0fdf4'}}><CheckCircle2 size={16}/></div>
                <div className="akpi-info">
                  <span className="akpi-label">Active Tasks</span>
                  <div className="akpi-val-row"><span className="akpi-val">128</span><span className="akpi-trend trend-up">↑ 8%</span></div>
                </div>
              </div>
              <div className="akpi">
                <div className="akpi-icon" style={{color:'#8b5cf6',background:'#f3e8ff'}}><Clock size={16}/></div>
                <div className="akpi-info">
                  <span className="akpi-label">Hours Tracked</span>
                  <div className="akpi-val-row"><span className="akpi-val">1,284h</span><span className="akpi-trend trend-up">↑ 15%</span></div>
                </div>
              </div>
              <div className="akpi">
                <div className="akpi-icon" style={{color:'#f59e0b',background:'#fffbeb'}}><User size={16}/></div>
                <div className="akpi-info">
                  <span className="akpi-label">Team Capacity</span>
                  <div className="akpi-val-row"><span className="akpi-val">78%</span><span className="akpi-trend trend-up">↑ 6%</span></div>
                </div>
              </div>
            </div>

            <div className="analytics-chart-legend">
              <span className="legend-item"><span className="dot" style={{background:'#3b82f6'}} /> Tasks Created</span>
              <span className="legend-item"><span className="dot" style={{background:'#10b981'}} /> Tasks Completed</span>
            </div>

            <div className="analytics-chart-wrapper">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={areaData} margin={{top:5,right:20,left:0,bottom:5}}>
                  <defs>
                    <linearGradient id="gCreated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#f0f1f5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#9ca3af',fontSize:11}} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill:'#9ca3af',fontSize:11}} width={35} />
                  <Tooltip 
                    contentStyle={{borderRadius:10,border:'1px solid #e5e7eb',boxShadow:'0 4px 16px rgba(0,0,0,0.1)',padding:'10px 14px',fontSize:13}}
                    labelStyle={{fontWeight:600,marginBottom:4}}
                    itemStyle={{padding:'2px 0'}}
                  />
                  <Area type="monotone" dataKey="created" name="Tasks Created" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#gCreated)" dot={false} activeDot={{r:4,strokeWidth:2,fill:'#fff'}} />
                  <Area type="monotone" dataKey="completed" name="Tasks Completed" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#gCompleted)" dot={false} activeDot={{r:4,strokeWidth:2,fill:'#fff'}} />
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
              {([
                {month:'MAY',day:'20',title:'Project Review',     sub:'Atlas Mobile App',  time:'10:00 AM – 11:00 AM', n:5, color:'#3b82f6'},
                {month:'MAY',day:'22',title:'Sprint Planning',    sub:'Website Redesign',  time:'02:00 PM – 03:30 PM', n:8, color:'#10b981'},
                {month:'MAY',day:'24',title:'Design System Sync', sub:'Internal Dashboard',time:'11:00 AM – 12:00 PM', n:6, color:'#f59e0b'},
              ]).map((ev,i) => (
                <div className="event-item" key={i}>
                  <div className="event-date">
                    <span className="event-month" style={{color:ev.color}}>{ev.month}</span>
                    <span className="event-day" style={{color:ev.color}}>{ev.day}</span>
                  </div>
                  <div className="event-info">
                    <h4 className="event-title">{ev.title}</h4>
                    <p className="event-sub">{ev.sub}</p>
                    <p className="event-time">{ev.time}</p>
                  </div>
                  <div className="event-attendees"><Users size={14} color="#9ca3af" /><span>{ev.n}</span></div>
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

/* ═══════ SUB-COMPONENTS ═══════ */

function KpiCard({ label, value, trend, color, bgTint, icon, data }: {
  label: string; value: string; trend: string; color: string; bgTint: string;
  icon: React.ReactNode; data: {v:number}[];
}) {
  return (
    <div className="kpi-card">
      <div className="kpi-card-header">
        <div className="kpi-info">
          <span className="kpi-label">{label}</span>
          <span className="kpi-value">{value}</span>
          <span className="kpi-trend trend-up"><ArrowUpRight size={14}/> {trend} <span>vs last week</span></span>
        </div>
        <div className="kpi-icon-wrapper" style={{color, background: bgTint}}>{icon}</div>
      </div>
      <div className="kpi-chart">
        <ResponsiveContainer width="100%" height={50}>
          <AreaChart data={data} margin={{top:5,right:0,left:0,bottom:0}}>
            <defs>
              <linearGradient id={`spark-${label.replace(/\s/g,'')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.15}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#spark-${label.replace(/\s/g,'')})`} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CheckSquareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
