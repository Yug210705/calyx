import React, { useState } from 'react';
import { 
  GripVertical, 
  CheckSquare, 
  Bug, 
  Zap, 
  Bookmark, 
  MoreHorizontal, 
  ChevronDown, 
  ChevronRight, 
  Plus,
  Filter, 
  Search, 
  ArrowUpDown, 
  Calendar,
  MoreVertical
} from 'lucide-react';
import './Backlog.css';

type IssueType = 'story' | 'bug' | 'task' | 'epic';

interface BacklogItem {
  id: string;
  type: IssueType;
  title: string;
  epic?: string;
  epicColor?: string;
  assignee?: string;
  points?: number | '-';
  priority?: 'highest' | 'high' | 'medium' | 'low';
}

const PRODUCT_IDEAS: BacklogItem[] = [
  { id: 'ATL-142', type: 'story', title: 'Implement drag and drop for backlog items', epic: 'UX Improvements', epicColor: '#4c9aff', assignee: 'https://i.pravatar.cc/150?u=1', points: 5, priority: 'high' },
  { id: 'ATL-145', type: 'story', title: 'Add dark mode toggle in preferences', epic: 'Settings', epicColor: '#36b37e', points: 3, priority: 'medium' },
  { id: 'ATL-148', type: 'epic', title: 'Revamp notification system', points: '-', priority: 'highest' },
  { id: 'ATL-152', type: 'story', title: 'Allow users to export reports to PDF', epic: 'Reporting', epicColor: '#ffab00', assignee: 'https://i.pravatar.cc/150?u=2', points: 8, priority: 'medium' }
];

const BUGS: BacklogItem[] = [
  { id: 'ATL-188', type: 'bug', title: 'Dropdown menus z-index issue on Safari', epic: 'Bug Bash Q3', epicColor: '#ff5630', assignee: 'https://i.pravatar.cc/150?u=3', points: 1, priority: 'high' },
  { id: 'ATL-190', type: 'bug', title: 'Login fails intermittently with 500 error', epic: 'Auth Revamp', epicColor: '#6554c0', points: 3, priority: 'highest' },
  { id: 'ATL-192', type: 'bug', title: 'Avatar overlapping in comment section', epic: 'UX Improvements', epicColor: '#4c9aff', assignee: 'https://i.pravatar.cc/150?u=1', points: 1, priority: 'low' }
];

const TECH_DEBT: BacklogItem[] = [
  { id: 'ATL-201', type: 'task', title: 'Migrate to React 18', epic: 'Architecture', epicColor: '#6554c0', assignee: 'https://i.pravatar.cc/150?u=4', points: 13, priority: 'medium' },
  { id: 'ATL-204', type: 'task', title: 'Refactor state management using Zustand', epic: 'Architecture', epicColor: '#6554c0', points: 8, priority: 'medium' },
  { id: 'ATL-209', type: 'task', title: 'Update deprecated API endpoints in legacy service', assignee: 'https://i.pravatar.cc/150?u=5', points: 5, priority: 'high' }
];

const UNSCHEDULED: BacklogItem[] = [
  { id: 'ATL-299', type: 'story', title: 'User customizable dashboards', assignee: 'https://i.pravatar.cc/150?u=6', points: '-', priority: 'low' },
  { id: 'ATL-301', type: 'story', title: 'Slack integration for notifications', epic: 'Integrations', epicColor: '#00b8d9', points: 5, priority: 'medium' },
  { id: 'ATL-310', type: 'task', title: 'Clean up unused CSS variables', assignee: 'https://i.pravatar.cc/150?u=1', points: 2, priority: 'low' }
];

const IssueIcon = ({ type }: { type: IssueType }) => {
  switch (type) {
    case 'story':
      return <Bookmark className="issue-icon story" size={16} />;
    case 'bug':
      return <Bug className="issue-icon bug" size={16} />;
    case 'task':
      return <CheckSquare className="issue-icon task" size={16} />;
    case 'epic':
      return <Zap className="issue-icon epic" size={16} />;
    default:
      return <Bookmark className="issue-icon" size={16} />;
  }
};

const PriorityIcon = ({ priority }: { priority?: string }) => {
  if (!priority) return null;
  const colors: Record<string, string> = {
    highest: '#ff5630',
    high: '#ff8b00',
    medium: '#ffab00',
    low: '#0065ff'
  };
  return (
    <div className="priority-icon" style={{ color: colors[priority] }} title={`Priority: ${priority}`}>
      <ArrowUpDown size={14} />
    </div>
  );
};

const BacklogSection = ({ title, items, count }: { title: string, items: BacklogItem[], count: number }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="backlog-section">
      <div className="backlog-section-header" onClick={() => setExpanded(!expanded)}>
        <div className="section-title-group">
          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <h3 className="section-title">{title}</h3>
          <span className="section-count">{count} issues</span>
        </div>
        <div className="section-actions" onClick={e => e.stopPropagation()}>
          <button className="btn-icon"><Plus size={16} /></button>
          <button className="btn-icon"><MoreHorizontal size={16} /></button>
        </div>
      </div>
      
      {expanded && (
        <div className="backlog-list">
          {items.map((item) => (
            <div key={item.id} className="backlog-item">
              <div className="item-left">
                <div className="drag-handle"><GripVertical size={16} /></div>
                <div className="item-type"><IssueIcon type={item.type} /></div>
                <div className="item-id">{item.id}</div>
                <div className="item-title">{item.title}</div>
              </div>
              <div className="item-right">
                {item.epic && (
                  <div className="item-epic" style={{ backgroundColor: `${item.epicColor}20`, color: item.epicColor }}>
                    {item.epic}
                  </div>
                )}
                <div className="item-priority">
                  <PriorityIcon priority={item.priority} />
                </div>
                <div className="item-assignee">
                  {item.assignee ? (
                    <img src={item.assignee} alt="Assignee" className="avatar-img" />
                  ) : (
                    <div className="avatar-placeholder">
                      <MoreVertical size={14} className="unassigned-icon"/>
                    </div>
                  )}
                </div>
                <div className="item-points">
                  <div className="points-badge">{item.points}</div>
                </div>
                <div className="item-actions-dropdown">
                  <button className="btn-secondary btn-small dropdown-trigger">
                    Move to Sprint <ChevronDown size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="create-issue-row">
            <Plus size={16} className="create-icon" />
            <span>Create issue</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const Backlog = () => {
  return (
    <div className="backlog-container">
      <div className="backlog-header">
        <div className="header-breadcrumbs">Projects / Atlas Workspace / Backlog</div>
        <div className="header-title-row">
          <h1>Backlog</h1>
          <div className="header-actions">
            <button className="btn-secondary"><Calendar size={16} /> Schedule</button>
            <button className="btn-primary">Create Sprint</button>
          </div>
        </div>
        <div className="header-filters">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search backlog..." />
          </div>
          <div className="filter-avatars">
            <img src="https://i.pravatar.cc/150?u=1" alt="Filter User 1" />
            <img src="https://i.pravatar.cc/150?u=2" alt="Filter User 2" />
            <img src="https://i.pravatar.cc/150?u=3" alt="Filter User 3" />
            <div className="avatar-more">+5</div>
          </div>
          <button className="btn-text">Only My Issues</button>
          <button className="btn-text">Recently Updated</button>
          <div className="filter-divider"></div>
          <button className="btn-secondary"><Filter size={16} /> Filters</button>
        </div>
      </div>

      <div className="backlog-content">
        <BacklogSection title="Product Ideas" items={PRODUCT_IDEAS} count={PRODUCT_IDEAS.length} />
        <BacklogSection title="Bugs" items={BUGS} count={BUGS.length} />
        <BacklogSection title="Technical Debt" items={TECH_DEBT} count={TECH_DEBT.length} />
        <BacklogSection title="Unscheduled" items={UNSCHEDULED} count={UNSCHEDULED.length} />
      </div>
    </div>
  );
};
