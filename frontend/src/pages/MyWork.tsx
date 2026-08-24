import React from 'react';
import './MyWork.css';
import { 
  AlertCircle, 
  Calendar, 
  Clock, 
  CheckCircle, 
  CheckSquare, 
  Bug, 
  BookOpen,
  MoreHorizontal
} from 'lucide-react';

// Mock Data
const tasks = [
  { id: 'ATLAS-1042', title: 'Fix OAuth token refresh bug', status: 'In Progress', priority: 'High', type: 'Bug', dueDate: 'Yesterday', category: 'overdue' },
  { id: 'ATLAS-1011', title: 'Resolve race condition in worker pool', status: 'To Do', priority: 'Critical', type: 'Bug', dueDate: 'Aug 22', category: 'overdue' },
  { id: 'ATLAS-1045', title: 'Implement rate limiting middleware', status: 'To Do', priority: 'Critical', type: 'Task', dueDate: 'Today', category: 'due_today' },
  { id: 'ATLAS-1051', title: 'Review pull request #342 for API Gateway', status: 'In Review', priority: 'Medium', type: 'Task', dueDate: 'Today', category: 'due_today' },
  { id: 'ATLAS-998', title: 'Update Redis cache invalidation logic', status: 'Done', priority: 'Low', type: 'Task', updatedAt: '2 hours ago', category: 'recent' },
  { id: 'ATLAS-1030', title: 'Add unit tests for Billing service', status: 'In Progress', priority: 'Medium', type: 'Task', updatedAt: '5 hours ago', category: 'recent' },
  { id: 'ATLAS-1060', title: 'Design My Work dashboard UI', status: 'In Progress', priority: 'High', type: 'Story', dueDate: 'Aug 28', category: 'assigned' },
  { id: 'ATLAS-1065', title: 'Migrate legacy user data to new schema', status: 'To Do', priority: 'Medium', type: 'Story', dueDate: 'Sep 02', category: 'assigned' },
  { id: 'ATLAS-1072', title: 'Update dependencies for security patch', status: 'To Do', priority: 'High', type: 'Task', dueDate: 'Sep 05', category: 'assigned' }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Bug': return <Bug size={14} className="text-danger" />;
    case 'Story': return <BookOpen size={14} className="text-success" />;
    case 'Task':
    default: return <CheckSquare size={14} className="text-info" />;
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Done': return 'status-done';
    case 'In Progress': return 'status-inprogress';
    case 'In Review': return 'status-inreview';
    default: return 'status-todo';
  }
};

const getPriorityBadgeClass = (priority: string) => {
  switch (priority) {
    case 'Critical': return 'priority-critical';
    case 'High': return 'priority-high';
    case 'Medium': return 'priority-medium';
    default: return 'priority-low';
  }
};

export const MyWork = () => {
  const overdueTasks = tasks.filter(t => t.category === 'overdue');
  const dueTodayTasks = tasks.filter(t => t.category === 'due_today');
  const assignedTasks = tasks.filter(t => t.category === 'assigned');
  const recentTasks = tasks.filter(t => t.category === 'recent');

  const renderTaskList = (taskList: typeof tasks, emptyMessage: string) => (
    <div className="mywork-task-list">
      {taskList.length > 0 ? taskList.map(task => (
        <div key={task.id} className="mywork-task-item">
          <div className="task-type-icon">
            {getTypeIcon(task.type)}
          </div>
          <div className="task-content">
            <div className="task-title-row">
              <span className="task-id">{task.id}</span>
              <span className="task-title">{task.title}</span>
            </div>
            <div className="task-meta">
              <span className={`badge ${getStatusBadgeClass(task.status)}`}>{task.status}</span>
              <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>{task.priority}</span>
              {task.dueDate && <span className="task-date"><Calendar size={12} /> {task.dueDate}</span>}
              {task.updatedAt && <span className="task-date"><Clock size={12} /> {task.updatedAt}</span>}
            </div>
          </div>
          <button className="task-action-btn"><MoreHorizontal size={16} /></button>
        </div>
      )) : (
        <div className="empty-state">{emptyMessage}</div>
      )}
    </div>
  );

  return (
    <div className="mywork-container">
      <header className="mywork-header">
        <div>
          <h1>My Work</h1>
          <p className="subtitle">Here's what you need to focus on today, Yug.</p>
        </div>
      </header>
      
      <div className="mywork-grid">
        <div className="mywork-main-column">
          
          <div className="mywork-section">
            <div className="mywork-section-header text-danger">
              <AlertCircle size={18} />
              <span>Overdue</span>
              <span className="count-badge">{overdueTasks.length}</span>
            </div>
            {renderTaskList(overdueTasks, "No overdue tasks! Great job.")}
          </div>

          <div className="mywork-section">
            <div className="mywork-section-header text-warning">
              <Calendar size={18} />
              <span>Due Today</span>
              <span className="count-badge">{dueTodayTasks.length}</span>
            </div>
            {renderTaskList(dueTodayTasks, "Nothing due today.")}
          </div>

          <div className="mywork-section">
            <div className="mywork-section-header text-primary">
              <CheckSquare size={18} />
              <span>Assigned to Me</span>
              <span className="count-badge">{assignedTasks.length}</span>
            </div>
            {renderTaskList(assignedTasks, "No tasks assigned to you.")}
          </div>

        </div>
        
        <div className="mywork-side-column">
          <div className="mywork-section">
            <div className="mywork-section-header text-info">
              <Clock size={18} />
              <span>Recently Updated</span>
            </div>
            {renderTaskList(recentTasks, "No recent activity.")}
          </div>
        </div>
      </div>
    </div>
  );
};
