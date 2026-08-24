import React, { useState } from 'react';
import {
  MoreHorizontal,
  Plus,
  Filter,
  Users,
  Calendar,
  AlertCircle,
  TrendingDown,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  Search,
  LayoutGrid,
  List
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './Sprints.css';

const burndownData = [
  { day: 'Day 1', ideal: 100, actual: 100 },
  { day: 'Day 2', ideal: 90, actual: 95 },
  { day: 'Day 3', ideal: 80, actual: 85 },
  { day: 'Day 4', ideal: 70, actual: 75 },
  { day: 'Day 5', ideal: 60, actual: 55 },
  { day: 'Day 6', ideal: 50, actual: 48 },
  { day: 'Day 7', ideal: 40, actual: 40 },
  { day: 'Day 8', ideal: 30, actual: 35 },
  { day: 'Day 9', ideal: 20, actual: null },
  { day: 'Day 10', ideal: 10, actual: null },
  { day: 'Day 11', ideal: 0, actual: null },
];

const teamCapacity = [
  { id: 1, name: 'Alice Chen', avatar: 'https://i.pravatar.cc/150?u=alice', assigned: 15, capacity: 20, status: 'on-track' },
  { id: 2, name: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?u=bob', assigned: 22, capacity: 20, status: 'overloaded' },
  { id: 3, name: 'Charlie Davis', avatar: 'https://i.pravatar.cc/150?u=charlie', assigned: 10, capacity: 15, status: 'available' },
  { id: 4, name: 'Diana Ross', avatar: 'https://i.pravatar.cc/150?u=diana', assigned: 18, capacity: 20, status: 'on-track' },
];

const initialTasks = [
  { id: 'TASK-101', title: 'Implement OAuth 2.0 authentication flow', type: 'story', priority: 'high', status: 'in-progress', assignee: 'https://i.pravatar.cc/150?u=alice', points: 5, blocked: false },
  { id: 'TASK-102', title: 'Design system updates for dark mode', type: 'task', priority: 'medium', status: 'review', assignee: 'https://i.pravatar.cc/150?u=diana', points: 3, blocked: false },
  { id: 'TASK-103', title: 'Fix memory leak in data table component', type: 'bug', priority: 'urgent', status: 'in-progress', assignee: 'https://i.pravatar.cc/150?u=bob', points: 8, blocked: true, blockReason: 'Waiting on backend API changes' },
  { id: 'TASK-104', title: 'Update dependencies to React 18', type: 'task', priority: 'low', status: 'todo', assignee: null, points: 2, blocked: false },
  { id: 'TASK-105', title: 'User onboarding tour integration', type: 'story', priority: 'medium', status: 'done', assignee: 'https://i.pravatar.cc/150?u=charlie', points: 5, blocked: false },
  { id: 'TASK-106', title: 'Refactor state management in dashboard', type: 'task', priority: 'medium', status: 'todo', assignee: 'https://i.pravatar.cc/150?u=alice', points: 5, blocked: false },
];

const columns = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'In Review' },
  { id: 'done', title: 'Done' }
];

export const Sprints = () => {
  const [view, setView] = useState<'board' | 'list'>('board');
  const [tasks] = useState(initialTasks);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'var(--danger)';
      case 'high': return 'var(--warning)';
      case 'medium': return 'var(--info)';
      default: return 'var(--text-muted)';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug': return <AlertCircle size={14} color="var(--danger)" />;
      case 'story': return <CheckCircle2 size={14} color="var(--success)" />;
      default: return <CheckCircle2 size={14} color="var(--info)" />;
    }
  };

  return (
    <div className="sprints-container">
      <header className="sprints-header">
        <div className="header-left">
          <div className="sprint-title-group">
            <span className="sprint-badge">Active Sprint</span>
            <h1>Sprint 24: Q3 Growth Initatives</h1>
          </div>
          <div className="sprint-meta">
            <div className="meta-item">
              <Calendar size={16} />
              <span>Oct 12 - Oct 25, 2023</span>
            </div>
            <div className="meta-item">
              <Clock size={16} />
              <span>4 days remaining</span>
            </div>
            <div className="meta-item">
              <Flame size={16} className="velocity-icon" />
              <span>Velocity: 64 pts</span>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button className="btn-secondary">Complete Sprint</button>
          <button className="btn-primary">
            <Plus size={16} />
            <span>Create Issue</span>
          </button>
        </div>
      </header>

      <div className="sprint-dashboard">
        <div className="dashboard-card burndown-card">
          <div className="card-header">
            <h3>Sprint Burndown</h3>
            <button className="icon-btn"><MoreHorizontal size={16} /></button>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={burndownData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '14px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="ideal" name="Ideal Tasks Remaining" stroke="var(--text-muted)" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="actual" name="Actual Tasks Remaining" stroke="var(--primary-color)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary-color)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-card capacity-card">
          <div className="card-header">
            <h3>Team Capacity</h3>
            <div className="capacity-meta">
              <span>65/75 pts</span>
            </div>
          </div>
          <div className="capacity-list">
            {teamCapacity.map(member => (
              <div key={member.id} className="capacity-item">
                <div className="member-info">
                  <img src={member.avatar} alt={member.name} className="avatar" />
                  <span className="member-name">{member.name}</span>
                </div>
                <div className="capacity-bar-container">
                  <div className="capacity-labels">
                    <span className={`status-text ${member.status}`}>{member.assigned} pts assigned</span>
                    <span className="max-text">{member.capacity} pts max</span>
                  </div>
                  <div className="progress-bg">
                    <div 
                      className={`progress-fill ${member.status}`} 
                      style={{ width: `${Math.min((member.assigned / member.capacity) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sprint-board-section">
        <div className="board-controls">
          <div className="search-box">
            <Search size={16} />
            <input type="text" placeholder="Search issues..." />
          </div>
          <div className="filters">
            <div className="avatar-group">
              <img src="https://i.pravatar.cc/150?u=alice" alt="Alice" />
              <img src="https://i.pravatar.cc/150?u=bob" alt="Bob" />
              <img src="https://i.pravatar.cc/150?u=charlie" alt="Charlie" />
              <div className="avatar-more">+2</div>
            </div>
            <button className="btn-icon-text">
              <Filter size={16} />
              <span>Filters</span>
            </button>
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${view === 'board' ? 'active' : ''}`}
                onClick={() => setView('board')}
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                className={`toggle-btn ${view === 'list' ? 'active' : ''}`}
                onClick={() => setView('list')}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {view === 'board' ? (
          <div className="kanban-board">
            {columns.map(column => (
              <div key={column.id} className="kanban-column">
                <div className="column-header">
                  <h3>{column.title}</h3>
                  <span className="task-count">
                    {tasks.filter(t => t.status === column.id).length}
                  </span>
                </div>
                <div className="column-content">
                  {tasks.filter(t => t.status === column.id).map(task => (
                    <div key={task.id} className={`task-card ${task.blocked ? 'blocked' : ''}`}>
                      {task.blocked && (
                        <div className="blocked-banner">
                          <AlertCircle size={12} />
                          <span>Blocked: {task.blockReason}</span>
                        </div>
                      )}
                      <div className="task-content">
                        <p className="task-title">{task.title}</p>
                        <div className="task-footer">
                          <div className="task-meta">
                            {getTypeIcon(task.type)}
                            <span className="task-id">{task.id}</span>
                            <div 
                              className="priority-indicator" 
                              style={{ backgroundColor: getPriorityColor(task.priority) }} 
                            />
                          </div>
                          <div className="task-assignee">
                            <span className="points-badge">{task.points}</span>
                            {task.assignee ? (
                              <img src={task.assignee} alt="Assignee" className="avatar-small" />
                            ) : (
                              <div className="avatar-small unassigned">
                                <Users size={12} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="list-view">
             <div className="list-header">
                <div className="cell-type">Type</div>
                <div className="cell-id">Key</div>
                <div className="cell-title">Summary</div>
                <div className="cell-status">Status</div>
                <div className="cell-assignee">Assignee</div>
                <div className="cell-points">Points</div>
             </div>
             {tasks.map(task => (
                <div key={task.id} className={`list-row ${task.blocked ? 'blocked-row' : ''}`}>
                   <div className="cell-type">{getTypeIcon(task.type)}</div>
                   <div className="cell-id">{task.id}</div>
                   <div className="cell-title">
                      {task.title}
                      {task.blocked && <span className="blocked-tag">Blocked</span>}
                   </div>
                   <div className="cell-status">
                      <span className={`status-badge ${task.status}`}>
                         {columns.find(c => c.id === task.status)?.title}
                      </span>
                   </div>
                   <div className="cell-assignee">
                      {task.assignee ? <img src={task.assignee} alt="Assignee" className="avatar-small" /> : 'Unassigned'}
                   </div>
                   <div className="cell-points">{task.points}</div>
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};
