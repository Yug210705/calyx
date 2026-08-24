import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, ScatterChart, Scatter, ZAxis, ComposedChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { 
  TrendingUp, Activity, Users, Clock, AlertTriangle, 
  CheckCircle2, Target, Calendar, BarChart2, Filter, Download
} from 'lucide-react';
import './Analytics.css';

const velocityData = [
  { sprint: 'Sprint 42', planned: 45, completed: 42 },
  { sprint: 'Sprint 43', planned: 50, completed: 48 },
  { sprint: 'Sprint 44', planned: 48, completed: 52 },
  { sprint: 'Sprint 45', planned: 55, completed: 50 },
  { sprint: 'Sprint 46', planned: 52, completed: 52 },
  { sprint: 'Sprint 47', planned: 60, completed: 58 },
];

const cycleTimeData = [
  { date: 'Oct 01', cycleTime: 3.2, leadTime: 5.4 },
  { date: 'Oct 08', cycleTime: 3.5, leadTime: 6.1 },
  { date: 'Oct 15', cycleTime: 2.8, leadTime: 4.8 },
  { date: 'Oct 22', cycleTime: 3.1, leadTime: 5.2 },
  { date: 'Oct 29', cycleTime: 2.5, leadTime: 4.5 },
  { date: 'Nov 05', cycleTime: 2.2, leadTime: 4.0 },
];

const workloadData = [
  { name: 'Engineering', active: 145, blocked: 12, completed: 320 },
  { name: 'Design', active: 45, blocked: 3, completed: 120 },
  { name: 'Product', active: 65, blocked: 5, completed: 180 },
  { name: 'QA', active: 85, blocked: 8, completed: 210 },
];

const healthData = [
  { name: 'On Track', value: 65, color: 'var(--success)' },
  { name: 'At Risk', value: 25, color: 'var(--warning)' },
  { name: 'Off Track', value: 10, color: 'var(--danger)' },
];

const projectMetrics = [
  { title: 'Average Cycle Time', value: '2.8 Days', trend: '-12%', isPositive: true, icon: Clock },
  { title: 'Team Velocity', value: '52 pts/sprint', trend: '+8%', isPositive: true, icon: TrendingUp },
  { title: 'Deployment Frequency', value: '4.2 / day', trend: '+15%', isPositive: true, icon: Activity },
  { title: 'Defect Rate', value: '2.4%', trend: '+0.5%', isPositive: false, icon: AlertTriangle },
];

export const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="analytics-container">
      <header className="analytics-header">
        <div>
          <h1>Advanced Analytics</h1>
          <p className="subtitle">Enterprise performance metrics and insights</p>
        </div>
        <div className="header-actions">
          <div className="time-range-selector">
            <button className={timeRange === '7d' ? 'active' : ''} onClick={() => setTimeRange('7d')}>7D</button>
            <button className={timeRange === '30d' ? 'active' : ''} onClick={() => setTimeRange('30d')}>30D</button>
            <button className={timeRange === '90d' ? 'active' : ''} onClick={() => setTimeRange('90d')}>90D</button>
          </div>
          <button className="btn-secondary"><Filter size={16} /> Filters</button>
          <button className="btn-primary"><Download size={16} /> Export Report</button>
        </div>
      </header>

      <section className="metrics-grid">
        {projectMetrics.map((metric, idx) => (
          <div className="metric-card" key={idx}>
            <div className="metric-header">
              <span className="metric-title">{metric.title}</span>
              <div className="metric-icon"><metric.icon size={20} /></div>
            </div>
            <div className="metric-value">{metric.value}</div>
            <div className={`metric-trend ${metric.isPositive ? 'positive' : 'negative'}`}>
              {metric.isPositive ? <TrendingUp size={14} /> : <TrendingUp size={14} style={{transform: 'scaleY(-1)'}}/>}
              <span>{metric.trend} vs last period</span>
            </div>
          </div>
        ))}
      </section>

      <div className="charts-grid">
        <div className="chart-card col-span-2">
          <div className="chart-header">
            <h3>Cycle Time vs Lead Time</h3>
            <p>Average time taken from to-do to done over time</p>
          </div>
          <div className="chart-content" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cycleTimeData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCycle" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend />
                <Area type="monotone" dataKey="cycleTime" name="Cycle Time (Days)" fill="url(#colorCycle)" stroke="var(--primary-color)" strokeWidth={2} />
                <Line type="monotone" dataKey="leadTime" name="Lead Time (Days)" stroke="var(--info)" strokeWidth={2} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Project Health</h3>
            <p>Overall status of active initiatives</p>
          </div>
          <div className="chart-content" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Team Velocity</h3>
            <p>Planned vs Completed Story Points</p>
          </div>
          <div className="chart-content" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={velocityData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="sprint" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <YAxis stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <Tooltip 
                  cursor={{fill: 'var(--border-color)', opacity: 0.2}}
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                />
                <Legend />
                <Bar dataKey="planned" name="Planned" fill="var(--text-muted)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card col-span-2">
          <div className="chart-header">
            <h3>Workload Distribution</h3>
            <p>Task status by department</p>
          </div>
          <div className="chart-content" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} width={80} />
                <Tooltip 
                  cursor={{fill: 'var(--border-color)', opacity: 0.2}}
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                />
                <Legend />
                <Bar dataKey="completed" name="Completed" stackId="a" fill="var(--success)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="active" name="Active" stackId="a" fill="var(--info)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="blocked" name="Blocked" stackId="a" fill="var(--danger)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
