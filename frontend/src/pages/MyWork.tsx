import React, { useState } from 'react';
import { 
  AlertCircle, Calendar, Clock, User, 
  ChevronDown, ChevronRight, CheckSquare, 
  Bug, Bookmark, Zap, ArrowUp, ArrowDown, Minus,
  MoreHorizontal
} from 'lucide-react';
import './MyWork.css';

/* ── Types & Data ── */
interface Task {
  id: string;
  key: string;
  title: string;
  type: 'task' | 'bug' | 'story' | 'epic';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'todo' | 'inProgress' | 'review' | 'done';
  project: string;
  dateStr: string;
  category: 'overdue' | 'today' | 'assigned' | 'recent';
}

const mockTasks: Task[] = [
  { id: '1', key: 'ATL-1042', title: 'Fix OAuth token refresh bug in mobile client', type: 'bug', priority: 'urgent', status: 'inProgress', project: 'Atlas Mobile App', dateStr: 'Yesterday', category: 'overdue' },
  { id: '2', key: 'ATL-1011', title: 'Resolve race condition in worker pool', type: 'bug', priority: 'high', status: 'todo', project: 'Backend Infrastructure', dateStr: 'Aug 22', category: 'overdue' },
  { id: '3', key: 'ATL-1045', title: 'Implement rate limiting middleware for API Gateway', type: 'task', priority: 'high', status: 'todo', project: 'API Gateway', dateStr: 'Today', category: 'today' },
  { id: '4', key: 'ATL-1051', title: 'Review pull request #342 for User Service', type: 'task', priority: 'medium', status: 'review', project: 'User Management', dateStr: 'Today', category: 'today' },
  { id: '5', key: 'ATL-1060', title: 'Design My Work dashboard UI components', type: 'story', priority: 'high', status: 'inProgress', project: 'Frontend App', dateStr: 'Aug 28', category: 'assigned' },
  { id: '6', key: 'ATL-1065', title: 'Migrate legacy user data to new schema', type: 'story', priority: 'medium', status: 'todo', project: 'Data Migration', dateStr: 'Sep 02', category: 'assigned' },
  { id: '7', key: 'ATL-1072', title: 'Update dependencies for security patch', type: 'task', priority: 'medium', status: 'todo', project: 'Security Audit', dateStr: 'Sep 05', category: 'assigned' },
  { id: '8', key: 'ATL-998',  title: 'Update Redis cache invalidation logic', type: 'task', priority: 'low', status: 'done', project: 'Core Services', dateStr: '2 hours ago', category: 'recent' },
  { id: '9', key: 'ATL-1030', title: 'Add unit tests for Billing service', type: 'task', priority: 'medium', status: 'inProgress', project: 'Billing Module', dateStr: '5 hours ago', category: 'recent' },
];

/* ── Helper Components (copied from Tasks style) ── */
const TypeIcon = ({ type, size = 14 }: { type: Task['type']; size?: number }) => {
  switch (type) {
    case 'bug': return <Bug size={size} className="mw-type-icon bug" />;
    case 'story': return <Bookmark size={size} className="mw-type-icon story" />;
    case 'epic': return <Zap size={size} className="mw-type-icon epic" />;
    default: return <CheckSquare size={size} className="mw-type-icon task" />;
  }
};

const PriorityIcon = ({ priority, size = 14 }: { priority: Task['priority']; size?: number }) => {
  switch (priority) {
    case 'urgent': return <ArrowUp size={size} className="mw-priority-icon urgent" />;
    case 'high': return <ArrowUp size={size} className="mw-priority-icon high" />;
    case 'low': return <ArrowDown size={size} className="mw-priority-icon low" />;
    default: return <Minus size={size} className="mw-priority-icon medium" />;
  }
};

const getStatusBadge = (status: Task['status']) => {
  switch (status) {
    case 'todo': return <span className="mw-status-badge mw-todo">TO DO</span>;
    case 'inProgress': return <span className="mw-status-badge mw-inprogress">IN PROGRESS</span>;
    case 'review': return <span className="mw-status-badge mw-review">IN REVIEW</span>;
    case 'done': return <span className="mw-status-badge mw-done">DONE</span>;
  }
};

/* ── Section Component ── */
const TaskSection = ({ 
  title, 
  icon: Icon, 
  tasks, 
  colorClass, 
  defaultExpanded = true 
}: { 
  title: string; 
  icon: any; 
  tasks: Task[]; 
  colorClass: string;
  defaultExpanded?: boolean;
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="mw-section">
      <div className={`mw-section-header ${colorClass}`} onClick={() => setExpanded(!expanded)}>
        <button className="mw-expander">
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        <Icon size={16} className="mw-section-icon" />
        <h3 className="mw-section-title">{title}</h3>
        <span className="mw-section-count">{tasks.length}</span>
      </div>
      
      {expanded && (
        <div className="mw-section-body">
          {tasks.length === 0 ? (
            <div className="mw-empty">No tasks in this section.</div>
          ) : (
            <div className="mw-list-container">
              <div className="mw-list-header">
                <div className="mw-col-key">Key</div>
                <div className="mw-col-title">Summary</div>
                <div className="mw-col-project">Project</div>
                <div className="mw-col-priority">P</div>
                <div className="mw-col-status">Status</div>
                <div className="mw-col-date">Date</div>
              </div>
              {tasks.map(task => (
                <div key={task.id} className="mw-list-row">
                  <div className="mw-col-key">
                    <TypeIcon type={task.type} size={14} />
                    <span className="mw-key-text">{task.key}</span>
                  </div>
                  <div className="mw-col-title">
                    <span className="mw-title-text">{task.title}</span>
                  </div>
                  <div className="mw-col-project">
                    <span className="mw-project-text">{task.project}</span>
                  </div>
                  <div className="mw-col-priority">
                    <PriorityIcon priority={task.priority} size={16} />
                  </div>
                  <div className="mw-col-status">
                    {getStatusBadge(task.status)}
                  </div>
                  <div className="mw-col-date">
                    <span className={`mw-date-text ${colorClass === 'text-danger' ? 'danger-date' : ''}`}>
                      {task.dateStr}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const MyWork = () => {
  return (
    <div className="mywork-page custom-scrollbar">
      <div className="mywork-header">
        <div className="mywork-header-left">
          <h1 className="mywork-title">My Work</h1>
          <p className="mywork-subtitle">Your personal workspace for today's priorities.</p>
        </div>
      </div>
      
      <div className="mywork-content">
        <TaskSection 
          title="Overdue" 
          icon={AlertCircle} 
          tasks={mockTasks.filter(t => t.category === 'overdue')} 
          colorClass="text-danger" 
        />
        <TaskSection 
          title="Due Today" 
          icon={Calendar} 
          tasks={mockTasks.filter(t => t.category === 'today')} 
          colorClass="text-warning" 
        />
        <TaskSection 
          title="Assigned to me" 
          icon={User} 
          tasks={mockTasks.filter(t => t.category === 'assigned')} 
          colorClass="text-primary" 
        />
        <TaskSection 
          title="Recently Updated" 
          icon={Clock} 
          tasks={mockTasks.filter(t => t.category === 'recent')} 
          colorClass="text-info" 
          defaultExpanded={false}
        />
      </div>
    </div>
  );
};
