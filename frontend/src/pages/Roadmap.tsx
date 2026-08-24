import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  ChevronRight, 
  Filter, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Settings,
  Share2,
  ListTodo,
  Flag,
  CircleDashed,
  CheckCircle2,
  CircleDot
} from 'lucide-react';
import './Roadmap.css';

// Types
type Status = 'Todo' | 'In Progress' | 'Done';

interface RoadmapItem {
  id: string;
  title: string;
  status: Status;
  progress: number;
  owner: { name: string; avatar: string };
  color: string;
  start: string;
  end: string;
  expanded?: boolean;
  children?: RoadmapItem[];
}

// Mock Data
const MOCK_ROADMAP_DATA: RoadmapItem[] = [
  {
    id: 'AUTH-1',
    title: 'Enterprise Authentication',
    status: 'In Progress',
    progress: 65,
    owner: { name: 'Alice Smith', avatar: 'https://i.pravatar.cc/150?u=alice' },
    color: 'var(--primary-color)',
    start: '2026-07-05',
    end: '2026-08-15',
    expanded: true,
    children: [
      {
        id: 'AUTH-2',
        title: 'SSO Integration (Okta/Azure)',
        status: 'Done',
        progress: 100,
        owner: { name: 'David Lee', avatar: 'https://i.pravatar.cc/150?u=david' },
        color: 'var(--primary-color)',
        start: '2026-07-05',
        end: '2026-07-20',
      },
      {
        id: 'AUTH-3',
        title: 'MFA Implementation',
        status: 'In Progress',
        progress: 30,
        owner: { name: 'Alice Smith', avatar: 'https://i.pravatar.cc/150?u=alice' },
        color: 'var(--primary-color)',
        start: '2026-07-22',
        end: '2026-08-15',
      }
    ]
  },
  {
    id: 'MOB-1',
    title: 'Mobile App V2',
    status: 'Todo',
    progress: 10,
    owner: { name: 'Bob Jones', avatar: 'https://i.pravatar.cc/150?u=bob' },
    color: 'var(--warning)',
    start: '2026-08-01',
    end: '2026-09-28',
    expanded: false,
    children: [
      {
        id: 'MOB-2',
        title: 'UI/UX Redesign',
        status: 'In Progress',
        progress: 50,
        owner: { name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?u=emma' },
        color: 'var(--warning)',
        start: '2026-08-01',
        end: '2026-08-20',
      },
      {
        id: 'MOB-3',
        title: 'React Native Migration',
        status: 'Todo',
        progress: 0,
        owner: { name: 'Bob Jones', avatar: 'https://i.pravatar.cc/150?u=bob' },
        color: 'var(--warning)',
        start: '2026-08-21',
        end: '2026-09-28',
      }
    ]
  },
  {
    id: 'DATA-1',
    title: 'Advanced Analytics Dashboard',
    status: 'Todo',
    progress: 0,
    owner: { name: 'Charlie Davis', avatar: 'https://i.pravatar.cc/150?u=charlie' },
    color: 'var(--success)',
    start: '2026-07-15',
    end: '2026-09-10',
  },
  {
    id: 'INFRA-1',
    title: 'Database Sharding & Migration',
    status: 'In Progress',
    progress: 45,
    owner: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    color: 'var(--danger)',
    start: '2026-07-01',
    end: '2026-08-30',
  }
];

// Timeline Calculations for Q3 2026
const Q3_START = new Date('2026-07-01').getTime();
const Q3_END = new Date('2026-09-30').getTime();
const TOTAL_DURATION = Q3_END - Q3_START;

const getLeftPercent = (dateString: string) => {
  const date = new Date(dateString).getTime();
  const percent = ((date - Q3_START) / TOTAL_DURATION) * 100;
  return Math.max(0, Math.min(100, percent));
};

const getWidthPercent = (startString: string, endString: string) => {
  const start = new Date(startString).getTime();
  const end = new Date(endString).getTime();
  const width = ((end - start) / TOTAL_DURATION) * 100;
  return Math.max(0, Math.min(100 - getLeftPercent(startString), width));
};

const StatusIcon = ({ status }: { status: Status }) => {
  switch (status) {
    case 'Todo': return <CircleDashed size={14} className="status-icon todo" />;
    case 'In Progress': return <CircleDot size={14} className="status-icon in-progress" />;
    case 'Done': return <CheckCircle2 size={14} className="status-icon done" />;
  }
};

export const Roadmap = () => {
  const [data, setData] = useState<RoadmapItem[]>(MOCK_ROADMAP_DATA);

  const toggleExpand = (id: string) => {
    setData(prev => {
      const newData = [...prev];
      const itemIndex = newData.findIndex(item => item.id === id);
      if (itemIndex > -1) {
        newData[itemIndex] = { ...newData[itemIndex], expanded: !newData[itemIndex].expanded };
      }
      return newData;
    });
  };

  const renderRow = (item: RoadmapItem, isChild = false) => {
    const left = getLeftPercent(item.start);
    const width = getWidthPercent(item.start, item.end);

    return (
      <React.Fragment key={item.id}>
        <div className={`roadmap-row ${isChild ? 'is-child' : ''}`}>
          <div className="roadmap-row-info">
            <div className="row-title-col">
              {!isChild && item.children && (
                <button 
                  className="expand-btn" 
                  onClick={() => toggleExpand(item.id)}
                >
                  {item.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              )}
              {!isChild && !item.children && <span className="spacer-16" />}
              {isChild && <span className="spacer-32" />}
              
              <div className="item-title-wrapper">
                {isChild ? <ListTodo size={14} className="type-icon child" /> : <Flag size={14} className="type-icon epic" style={{color: item.color}} />}
                <span className="item-id">{item.id}</span>
                <span className="item-title">{item.title}</span>
              </div>
            </div>
            <div className="row-status-col">
              <div className="status-badge">
                <StatusIcon status={item.status} />
                <span>{item.status}</span>
              </div>
            </div>
            <div className="row-owner-col">
              <img src={item.owner.avatar} alt={item.owner.name} className="owner-avatar" title={item.owner.name} />
            </div>
          </div>
          
          <div className="roadmap-row-timeline">
            <div 
              className={`timeline-bar ${isChild ? 'child-bar' : 'epic-bar'}`}
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: isChild ? item.color : 'transparent',
                borderColor: item.color
              }}
            >
              {!isChild && (
                <div 
                  className="epic-bar-progress" 
                  style={{ width: `${item.progress}%`, backgroundColor: item.color }} 
                />
              )}
              {isChild && item.progress > 0 && (
                <div 
                  className="child-bar-progress" 
                  style={{ width: `${item.progress}%` }} 
                />
              )}
              <span className="bar-label">{item.progress}%</span>
            </div>
          </div>
        </div>
        
        {item.expanded && item.children && item.children.map(child => renderRow(child, true))}
      </React.Fragment>
    );
  };

  return (
    <div className="roadmap-container">
      <header className="roadmap-header">
        <div className="header-left">
          <h1>Roadmap</h1>
          <div className="view-tabs">
            <button className="tab active">Timeline</button>
            <button className="tab">Board</button>
            <button className="tab">List</button>
          </div>
        </div>
        
        <div className="header-right">
          <div className="search-bar">
            <Search size={16} />
            <input type="text" placeholder="Search epics..." />
          </div>
          <button className="icon-btn" title="Filter">
            <Filter size={18} />
          </button>
          <button className="icon-btn" title="Settings">
            <Settings size={18} />
          </button>
          <button className="icon-btn" title="Share">
            <Share2 size={18} />
          </button>
          <button className="btn-primary">
            <Plus size={16} />
            <span>Create Epic</span>
          </button>
        </div>
      </header>

      <div className="roadmap-controls">
        <div className="date-controls">
          <button className="control-btn">
            <Calendar size={16} />
            <span>Q3 2026 (Jul - Sep)</span>
            <ChevronDown size={16} />
          </button>
          <button className="control-btn">Quarterly</button>
        </div>
        
        <div className="zoom-controls">
          <button className="icon-btn"><ZoomOut size={16} /></button>
          <span>Zoom</span>
          <button className="icon-btn"><ZoomIn size={16} /></button>
        </div>
      </div>

      <div className="roadmap-board">
        <div className="roadmap-grid">
          {/* Header Row */}
          <div className="grid-header">
            <div className="info-header">
              <div className="col-title">Title</div>
              <div className="col-status">Status</div>
              <div className="col-owner">Owner</div>
            </div>
            <div className="timeline-header">
              <div className="month-group">
                <div className="month-label">July 2026</div>
                <div className="weeks">
                  <span>W27</span><span>W28</span><span>W29</span><span>W30</span><span>W31</span>
                </div>
              </div>
              <div className="month-group">
                <div className="month-label">August 2026</div>
                <div className="weeks">
                  <span>W31</span><span>W32</span><span>W33</span><span>W34</span><span>W35</span>
                </div>
              </div>
              <div className="month-group">
                <div className="month-label">September 2026</div>
                <div className="weeks">
                  <span>W36</span><span>W37</span><span>W38</span><span>W39</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="grid-body">
            {/* Background grid lines */}
            <div className="timeline-bg-lines">
               <div className="info-spacer"></div>
               <div className="timeline-lines">
                 {/* Mock vertical lines for weeks */}
                 {[...Array(14)].map((_, i) => (
                   <div key={i} className="vertical-line" style={{ left: `${(i / 14) * 100}%` }}></div>
                 ))}
               </div>
            </div>

            {/* Rows */}
            <div className="rows-container">
              {data.map(item => renderRow(item))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
