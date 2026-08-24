import React, { useState } from 'react';
import './Goals.css';
import { 
  Target, 
  ChevronRight, 
  ChevronDown, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  BarChart2,
  Users,
  Briefcase,
  Plus,
  Filter,
  Search,
  MoreHorizontal
} from 'lucide-react';

// Data types
type GoalStatus = 'On Track' | 'At Risk' | 'Achieved' | 'Behind';
type GoalLevel = 'Company' | 'Team' | 'Project' | 'Task';

interface Goal {
  id: string;
  title: string;
  description: string;
  level: GoalLevel;
  progress: number;
  status: GoalStatus;
  owner: {
    name: string;
    avatar: string;
  };
  dueDate: string;
  metric: string;
  children?: Goal[];
}

// Mock Data
const goalsData: Goal[] = [
  {
    id: 'G-1',
    title: 'Expand Enterprise Market Share',
    description: 'Increase market penetration in Fortune 500 segment by Q4.',
    level: 'Company',
    progress: 68,
    status: 'On Track',
    owner: { name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    dueDate: 'Dec 31, 2026',
    metric: '15% Increase in Enterprise Customers',
    children: [
      {
        id: 'G-1-1',
        title: 'Launch Enterprise Security Suite',
        description: 'Deploy advanced security features tailored for large orgs.',
        level: 'Team',
        progress: 85,
        status: 'Achieved',
        owner: { name: 'David Chen', avatar: 'https://i.pravatar.cc/150?u=david' },
        dueDate: 'Sep 30, 2026',
        metric: 'Release 5 security modules',
        children: [
          {
            id: 'G-1-1-1',
            title: 'SSO Integration Implementation',
            description: 'Implement SAML and OAuth2.0 enterprise integrations.',
            level: 'Project',
            progress: 100,
            status: 'Achieved',
            owner: { name: 'Alex Rodriguez', avatar: 'https://i.pravatar.cc/150?u=alex' },
            dueDate: 'Aug 15, 2026',
            metric: 'Support top 3 IdPs',
          }
        ]
      },
      {
        id: 'G-1-2',
        title: 'Scale Outbound Sales Motion',
        description: 'Build enterprise sales pipeline through targeted outreach.',
        level: 'Team',
        progress: 42,
        status: 'At Risk',
        owner: { name: 'Emily Carter', avatar: 'https://i.pravatar.cc/150?u=emily' },
        dueDate: 'Dec 15, 2026',
        metric: '$50M in qualified pipeline',
        children: [
          {
            id: 'G-1-2-1',
            title: 'Hire Enterprise AEs',
            description: 'Recruit and onboard 10 senior Account Executives.',
            level: 'Project',
            progress: 20,
            status: 'Behind',
            owner: { name: 'Michael Scott', avatar: 'https://i.pravatar.cc/150?u=michael' },
            dueDate: 'Oct 30, 2026',
            metric: '10 AEs fully ramped',
          }
        ]
      }
    ]
  },
  {
    id: 'G-2',
    title: 'Achieve Operational Excellence',
    description: 'Optimize internal processes and reduce infrastructure costs.',
    level: 'Company',
    progress: 75,
    status: 'On Track',
    owner: { name: 'Robert Vance', avatar: 'https://i.pravatar.cc/150?u=robert' },
    dueDate: 'Nov 30, 2026',
    metric: '20% Reduction in Cloud Spend',
  }
];

// Helper components
const StatusBadge = ({ status }: { status: GoalStatus }) => {
  const config = {
    'On Track': { icon: Clock, color: 'var(--success)', bg: 'rgba(39, 174, 96, 0.1)' },
    'Achieved': { icon: CheckCircle2, color: 'var(--info)', bg: 'rgba(41, 128, 185, 0.1)' },
    'At Risk': { icon: AlertCircle, color: 'var(--warning)', bg: 'rgba(243, 156, 18, 0.1)' },
    'Behind': { icon: AlertCircle, color: 'var(--danger)', bg: 'rgba(231, 76, 60, 0.1)' }
  };
  const { icon: Icon, color, bg } = config[status];
  
  return (
    <span className="status-badge" style={{ color, backgroundColor: bg }}>
      <Icon size={14} />
      {status}
    </span>
  );
};

const LevelIcon = ({ level }: { level: GoalLevel }) => {
  switch(level) {
    case 'Company': return <Target size={16} className="level-icon company" />;
    case 'Team': return <Users size={16} className="level-icon team" />;
    case 'Project': return <Briefcase size={16} className="level-icon project" />;
    case 'Task': return <BarChart2 size={16} className="level-icon task" />;
  }
};

const ProgressRing = ({ progress, size = 48, strokeWidth = 4 }: { progress: number, size?: number, strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  const getColor = (p: number) => {
    if (p === 100) return 'var(--info)';
    if (p < 30) return 'var(--danger)';
    if (p < 70) return 'var(--warning)';
    return 'var(--success)';
  };

  return (
    <div className="progress-ring-container" style={{ width: size, height: size }}>
      <svg className="progress-ring" width={size} height={size}>
        <circle
          className="progress-ring-bg"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="progress-ring-circle"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          stroke={getColor(progress)}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className="progress-ring-text" style={{ fontSize: size * 0.25 }}>
        {progress}%
      </span>
    </div>
  );
};

const GoalNode = ({ goal, depth = 0 }: { goal: Goal, depth?: number }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = goal.children && goal.children.length > 0;

  return (
    <div className="goal-node-container">
      <div 
        className={`goal-card level-${goal.level.toLowerCase()}`}
        style={{ marginLeft: `${depth * 32}px` }}
      >
        <div className="goal-card-main">
          <div className="goal-expand-toggle" onClick={() => setExpanded(!expanded)}>
            {hasChildren ? (
              expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />
            ) : (
              <span className="toggle-placeholder" />
            )}
          </div>
          
          <div className="goal-content">
            <div className="goal-header">
              <div className="goal-title-area">
                <LevelIcon level={goal.level} />
                <span className="goal-id">{goal.id}</span>
                <h3 className="goal-title">{goal.title}</h3>
              </div>
              <div className="goal-actions">
                <StatusBadge status={goal.status} />
                <button className="icon-button"><MoreHorizontal size={16} /></button>
              </div>
            </div>
            
            <p className="goal-description">{goal.description}</p>
            
            <div className="goal-meta">
              <div className="meta-item metric">
                <TrendingUp size={14} />
                <span>{goal.metric}</span>
              </div>
              <div className="meta-item owner">
                <img src={goal.owner.avatar} alt={goal.owner.name} className="owner-avatar" />
                <span>{goal.owner.name}</span>
              </div>
              <div className="meta-item due-date">
                <Clock size={14} />
                <span>{goal.dueDate}</span>
              </div>
            </div>
          </div>
          
          <div className="goal-progress-section">
            <ProgressRing progress={goal.progress} size={48} strokeWidth={4} />
          </div>
        </div>
      </div>
      
      {expanded && hasChildren && (
        <div className="goal-children">
          <div className="hierarchy-line" style={{ left: `${depth * 32 + 24}px` }} />
          {goal.children!.map(child => (
            <GoalNode key={child.id} goal={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Goals = () => {
  return (
    <div className="goals-container">
      <div className="goals-header-section">
        <div className="goals-header-content">
          <h1>Objectives & Key Results</h1>
          <p>Align company strategy with execution. Track OKRs from top-level objectives down to individual tasks.</p>
        </div>
        <div className="goals-header-actions">
          <div className="search-bar">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search goals..." />
          </div>
          <button className="secondary-button">
            <Filter size={16} />
            <span>Filter</span>
          </button>
          <button className="primary-button">
            <Plus size={16} />
            <span>New Goal</span>
          </button>
        </div>
      </div>

      <div className="goals-overview-cards">
        <div className="overview-card">
          <div className="overview-title">Company Goals On Track</div>
          <div className="overview-value">68%</div>
          <div className="overview-trend positive">+5% vs last quarter</div>
        </div>
        <div className="overview-card">
          <div className="overview-title">Total Objectives</div>
          <div className="overview-value">24</div>
          <div className="overview-trend neutral">Across 5 departments</div>
        </div>
        <div className="overview-card">
          <div className="overview-title">Goals at Risk</div>
          <div className="overview-value danger">3</div>
          <div className="overview-trend negative">Requires immediate attention</div>
        </div>
      </div>

      <div className="goals-hierarchy-view">
        <div className="view-header">
          <h2>Goal Hierarchy</h2>
          <div className="view-controls">
            <span className="legend-item"><Target size={14} className="level-icon company"/> Company</span>
            <span className="legend-item"><Users size={14} className="level-icon team"/> Team</span>
            <span className="legend-item"><Briefcase size={14} className="level-icon project"/> Project</span>
          </div>
        </div>
        
        <div className="goals-tree">
          {goalsData.map(goal => (
            <GoalNode key={goal.id} goal={goal} />
          ))}
        </div>
      </div>
    </div>
  );
};
