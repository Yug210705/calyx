import React from 'react';
import { 
  Plus, MoreHorizontal, 
  Bug, Bookmark, Zap, CheckSquare, 
  ArrowUp, ArrowDown, Minus, MessageSquare, Paperclip
} from 'lucide-react';
import './MyWork.css';

/* ── Types & Data ── */
interface Task {
  id: string;
  key: string;
  title: string;
  type: 'task' | 'bug' | 'story' | 'epic';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  project: string;
  category: 'overdue' | 'today' | 'assigned' | 'recent';
  storyPoints?: number;
  comments?: number;
  assignee?: string;
}

const mockTasks: Task[] = [
  { id: '1', key: 'ATL-1042', title: 'Fix OAuth token refresh bug', type: 'bug', priority: 'urgent', project: 'Mobile App', category: 'overdue', storyPoints: 5, comments: 3, assignee: 'https://i.pravatar.cc/150?u=yug' },
  { id: '2', key: 'ATL-1011', title: 'Resolve race condition in worker pool', type: 'bug', priority: 'high', project: 'Backend', category: 'overdue', comments: 1, assignee: 'https://i.pravatar.cc/150?u=yug' },
  
  { id: '3', key: 'ATL-1045', title: 'Implement rate limiting middleware', type: 'task', priority: 'high', project: 'API Gateway', category: 'today', storyPoints: 3, assignee: 'https://i.pravatar.cc/150?u=yug' },
  { id: '4', key: 'ATL-1051', title: 'Review pull request #342', type: 'task', priority: 'medium', project: 'User Management', category: 'today', comments: 2, assignee: 'https://i.pravatar.cc/150?u=yug' },
  
  { id: '5', key: 'ATL-1060', title: 'Design My Work dashboard UI', type: 'story', priority: 'high', project: 'Frontend App', category: 'assigned', storyPoints: 8, comments: 5, assignee: 'https://i.pravatar.cc/150?u=yug' },
  { id: '6', key: 'ATL-1065', title: 'Migrate legacy user data', type: 'story', priority: 'medium', project: 'Data Migration', category: 'assigned', storyPoints: 13, assignee: 'https://i.pravatar.cc/150?u=yug' },
  
  { id: '7', key: 'ATL-998',  title: 'Update Redis cache logic', type: 'task', priority: 'low', project: 'Core Services', category: 'recent', storyPoints: 2, comments: 1, assignee: 'https://i.pravatar.cc/150?u=yug' },
  { id: '8', key: 'ATL-1030', title: 'Add unit tests for Billing', type: 'task', priority: 'medium', project: 'Billing', category: 'recent', storyPoints: 5, assignee: 'https://i.pravatar.cc/150?u=yug' },
];

/* ── Columns config ── */
const COLUMNS = [
  { id: 'overdue', title: 'OVERDUE', color: '#de350b' },
  { id: 'today', title: 'DUE TODAY', color: '#ff991f' },
  { id: 'assigned', title: 'ASSIGNED', color: '#0052cc' },
  { id: 'recent', title: 'RECENT', color: '#10b981' }
];

/* ── Helpers ── */
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

export const MyWork = () => {
  return (
    <div className="mywork-page custom-scrollbar">
      
      <div className="mywork-welcome">
        <h1 className="mywork-title">My Work</h1>
        <p className="mywork-subtitle">Here's what you need to focus on today, Yug.</p>
      </div>
      
      <div className="mw-board-container custom-scrollbar">
        {COLUMNS.map(column => {
          const columnTasks = mockTasks.filter(t => t.category === column.id);
          
          return (
            <div key={column.id} className="mw-board-column">
              <div className="mw-board-column-header">
                <div className="mw-board-column-left">
                  <span className="mw-column-bar" style={{ backgroundColor: column.color }}></span>
                  <span className="mw-column-title">{column.title}</span>
                  <span className="mw-column-count">{columnTasks.length}</span>
                </div>
                <div className="mw-column-actions">
                  <button><Plus size={14} /></button>
                  <button><MoreHorizontal size={14} /></button>
                </div>
              </div>

              <div className="mw-board-column-body custom-scrollbar">
                {columnTasks.map(task => (
                  <div key={task.id} className="mw-jira-card">
                    <h4 className="mw-jira-card-title">{task.title}</h4>
                    
                    <div className="mw-jira-card-labels">
                      <span className="mw-jira-label">{task.project}</span>
                    </div>
                    
                    <div className="mw-jira-card-bottom">
                      <div className="mw-jira-card-meta">
                        <TypeIcon type={task.type} />
                        <span className="mw-jira-key">{task.key}</span>
                        <PriorityIcon priority={task.priority} />
                        {task.storyPoints && <span className="mw-jira-sp">{task.storyPoints}</span>}
                      </div>
                      
                      <div className="mw-jira-card-right-meta">
                        {task.comments && (
                          <span className="mw-jira-meta-item">
                            <MessageSquare size={12} /> {task.comments}
                          </span>
                        )}
                        {task.assignee && (
                          <img src={task.assignee} alt="Assignee" className="mw-jira-avatar" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
