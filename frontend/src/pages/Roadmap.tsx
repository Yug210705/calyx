import { projectService } from '../services/api';
import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Filter, LayoutGrid, Calendar, Target,
  CheckCircle2, Circle, AlertCircle, Clock,
  ChevronDown, MoreHorizontal, Layers, Rocket, Shield, Server, Paintbrush,
  Zap, Flag
} from 'lucide-react';
import './Roadmap.css';

/* â”€â”€ Types â”€â”€ */
interface Epic {
  id: string;
  title: string;
  team: 'Frontend' | 'Backend' | 'Design' | 'Security';
  status: 'planning' | 'in-progress' | 'completed' | 'at-risk';
  startMonth: number;
  endMonth: number;
  progress: number;
  assignees: string[];
  type: 'feature' | 'infrastructure' | 'redesign' | 'security';
  priority: 'high' | 'medium' | 'low';
}

const TEAMS = [
  { id: 'Frontend', name: 'Frontend App', icon: Rocket, color: '#6366f1' },
  { id: 'Backend', name: 'Backend & API', icon: Server, color: '#10b981' },
  { id: 'Design', name: 'Design System', icon: Paintbrush, color: '#ec4899' },
  { id: 'Security', name: 'Security & Auth', icon: Shield, color: '#f59e0b' }
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const INITIAL_EPICS: Epic[] = [
  { id: 'EP-1', title: 'New Onboarding Flow', team: 'Frontend', status: 'completed', startMonth: 1, endMonth: 3, progress: 100, assignees: ['https://i.pravatar.cc/150?u=a', 'https://i.pravatar.cc/150?u=b'], type: 'feature', priority: 'high' },
  { id: 'EP-2', title: 'Real-time Inbox Refactor', team: 'Frontend', status: 'in-progress', startMonth: 3, endMonth: 5, progress: 65, assignees: ['https://i.pravatar.cc/150?u=c'], type: 'feature', priority: 'high' },
  { id: 'EP-3', title: 'Interactive Roadmap View', team: 'Frontend', status: 'in-progress', startMonth: 5, endMonth: 7, progress: 40, assignees: ['https://i.pravatar.cc/150?u=d', 'https://i.pravatar.cc/150?u=a'], type: 'feature', priority: 'medium' },
  { id: 'EP-4', title: 'Mobile App Beta Launch', team: 'Frontend', status: 'planning', startMonth: 8, endMonth: 11, progress: 0, assignees: ['https://i.pravatar.cc/150?u=e'], type: 'feature', priority: 'high' },
  { id: 'EP-5', title: 'GraphQL API Migration', team: 'Backend', status: 'in-progress', startMonth: 2, endMonth: 6, progress: 75, assignees: ['https://i.pravatar.cc/150?u=f', 'https://i.pravatar.cc/150?u=g'], type: 'infrastructure', priority: 'high' },
  { id: 'EP-6', title: 'Database Sharding', team: 'Backend', status: 'planning', startMonth: 7, endMonth: 9, progress: 10, assignees: ['https://i.pravatar.cc/150?u=h'], type: 'infrastructure', priority: 'medium' },
  { id: 'EP-7', title: 'Webhooks System v2', team: 'Backend', status: 'planning', startMonth: 9, endMonth: 12, progress: 0, assignees: ['https://i.pravatar.cc/150?u=i'], type: 'feature', priority: 'low' },
  { id: 'EP-8', title: 'Dark Mode Support', team: 'Design', status: 'completed', startMonth: 1, endMonth: 2, progress: 100, assignees: ['https://i.pravatar.cc/150?u=j'], type: 'redesign', priority: 'medium' },
  { id: 'EP-9', title: 'Component Library 3.0', team: 'Design', status: 'in-progress', startMonth: 3, endMonth: 8, progress: 50, assignees: ['https://i.pravatar.cc/150?u=k', 'https://i.pravatar.cc/150?u=j'], type: 'redesign', priority: 'high' },
  { id: 'EP-10', title: 'Marketing Site Refresh', team: 'Design', status: 'planning', startMonth: 10, endMonth: 12, progress: 0, assignees: ['https://i.pravatar.cc/150?u=l'], type: 'redesign', priority: 'medium' },
  { id: 'EP-11', title: 'OAuth2 Implementation', team: 'Security', status: 'completed', startMonth: 1, endMonth: 4, progress: 100, assignees: ['https://i.pravatar.cc/150?u=m'], type: 'security', priority: 'high' },
  { id: 'EP-12', title: 'SOC2 Compliance Audit', team: 'Security', status: 'at-risk', startMonth: 4, endMonth: 7, progress: 45, assignees: ['https://i.pravatar.cc/150?u=n', 'https://i.pravatar.cc/150?u=o'], type: 'security', priority: 'high' },
  { id: 'EP-13', title: 'SSO Integration (SAML)', team: 'Security', status: 'planning', startMonth: 8, endMonth: 11, progress: 5, assignees: ['https://i.pravatar.cc/150?u=p'], type: 'security', priority: 'high' },
];


export const Roadmap = () => {
  const [epics, setEpics] = useState<Epic[]>([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'Q1-Q2' | 'Q3-Q4' | 'Year'>('Year');
  const [hoveredEpic, setHoveredEpic] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await projectService.getProjects();
        const currentMonth = new Date().getMonth() + 1;
        const mapped: Epic[] = (Array.isArray(data) ? data : []).map((p: any) => {
           const idStr = p.id.toString();
           // pseudo-random generation based on id for visualization purposes
           const teamIdx = p.id % TEAMS.length;
           const sm = ((p.id * 3) % 8) + 1;
           const em = Math.min(sm + ((p.id * 2) % 4) + 1, 12);
           
           let status: Epic['status'] = 'planning';
           if (p.status === 'In Progress') status = 'in-progress';
           if (p.status === 'Completed' || p.status === 'Done') status = 'completed';

           return {
             id: `EP-${p.id}`,
             title: p.title,
             team: TEAMS[teamIdx].id as any,
             status,
             startMonth: sm,
             endMonth: em,
             progress: p.progress || 0,
             assignees: [`https://i.pravatar.cc/150?u=${p.id}`],
             type: 'feature',
             priority: 'medium'
           };
        });
        setEpics(mapped);
      } catch(e) {
        console.error(e);
      } finally {
        setTimeout(() => setLoaded(true), 100);
      }
    };
    loadProjects();
  }, []);

  const currentMonth = new Date().getMonth() + 1;

  const filteredEpics = epics.filter(e => {
    if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (view === 'Q1-Q2' && e.startMonth > 6) return false;
    if (view === 'Q3-Q4' && e.endMonth < 7) return false;
    return true;
  });

  const getStatusIcon = (status: Epic['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={13} className="rm-st-icon rm-st-completed" />;
      case 'in-progress': return <Clock size={13} className="rm-st-icon rm-st-progress" />;
      case 'at-risk': return <AlertCircle size={13} className="rm-st-icon rm-st-risk" />;
      default: return <Circle size={13} className="rm-st-icon rm-st-planning" />;
    }
  };

  const getGridCols = () => (view === 'Year' ? 12 : 6);
  const getMonthOffset = () => (view === 'Q3-Q4' ? 6 : 0);
  const visibleMonths = MONTHS.slice(getMonthOffset(), getMonthOffset() + getGridCols());

  return (
    <div className={`rm-page custom-scrollbar ${loaded ? 'loaded' : ''}`}>
      {/* Ambient background glow */}
      <div className="rm-ambient-glow glow-1"></div>
      <div className="rm-ambient-glow glow-2"></div>

      {/* â”€â”€ Header â”€â”€ */}
      <div className="rm-header">
        <div className="rm-header-main">
          <div className="rm-title-section">
            <h1 className="rm-title">Product Roadmap</h1>
            <div className="rm-badge-glass">
              <Zap size={12} className="rm-badge-icon" /> 2026 Vision
            </div>
          </div>
          
          <div className="rm-header-actions">
            <div className="rm-search-glass">
              <Search size={15} />
              <input 
                placeholder="Search initiatives..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="rm-btn-glass"><Filter size={15} /> Filter</button>
            <button className="rm-btn-primary">
              <Plus size={16} /> Create Epic
            </button>
          </div>
        </div>

        <div className="rm-header-sub">
          <div className="rm-view-toggle">
            <button className={`rm-view-btn ${view === 'Year' ? 'active' : ''}`} onClick={() => setView('Year')}>Annual</button>
            <button className={`rm-view-btn ${view === 'Q1-Q2' ? 'active' : ''}`} onClick={() => setView('Q1-Q2')}>Q1 - Q2</button>
            <button className={`rm-view-btn ${view === 'Q3-Q4' ? 'active' : ''}`} onClick={() => setView('Q3-Q4')}>Q3 - Q4</button>
          </div>
          
          <div className="rm-legend">
            <div className="rm-lg-item"><span className="rm-lg-dot planning"></span> Planning</div>
            <div className="rm-lg-item"><span className="rm-lg-dot progress"></span> In Progress</div>
            <div className="rm-lg-item"><span className="rm-lg-dot completed"></span> Completed</div>
            <div className="rm-lg-item"><span className="rm-lg-dot risk"></span> At Risk</div>
          </div>
        </div>
      </div>

      {/* â”€â”€ Roadmap Board â”€â”€ */}
      <div className="rm-board-container">
        <div className="rm-board-scroll custom-scrollbar">
          <div className="rm-board" style={{ '--cols': getGridCols() } as React.CSSProperties}>
            
            {/* Timeline Header */}
            <div className="rm-timeline-header">
              <div className="rm-team-col-header">
                <Layers size={14} /> Initiatives
              </div>
              <div className="rm-months-grid">
                {visibleMonths.map((m, i) => {
                  const mIndex = i + getMonthOffset() + 1;
                  const isCurrent = mIndex === currentMonth;
                  return (
                    <div key={m} className={`rm-month-col ${isCurrent ? 'current' : ''}`}>
                      <span className="rm-month-name">{m}</span>
                      {isCurrent && <div className="rm-today-badge">Current</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Teams & Epics */}
            <div className="rm-timeline-body">
              {/* Today Vertical Line */}
              {currentMonth > getMonthOffset() && currentMonth <= getMonthOffset() + getGridCols() && (
                <div 
                  className="rm-today-line" 
                  style={{ left: `calc(280px + ((100% - 280px) / ${getGridCols()}) * ${currentMonth - getMonthOffset() - 0.5})` }} 
                >
                  <div className="rm-today-glow"></div>
                </div>
              )}

              {TEAMS.map(team => {
                const teamEpics = filteredEpics.filter(e => e.team === team.id);
                if (teamEpics.length === 0) return null;
                const TeamIcon = team.icon;

                return (
                  <div key={team.id} className="rm-team-row">
                    {/* Left Col: Team Info */}
                    <div className="rm-team-col">
                      <div className="rm-team-info">
                        <div className="rm-team-icon-wrap" style={{ '--tc': team.color } as React.CSSProperties}>
                          <TeamIcon size={16} />
                        </div>
                        <h3>{team.name}</h3>
                      </div>
                      <span className="rm-team-count">{teamEpics.length} epics</span>
                    </div>

                    {/* Right Col: Timeline Grid */}
                    <div className="rm-epics-grid">
                      {/* Grid Lines Overlay */}
                      <div className="rm-grid-lines">
                        {Array.from({ length: getGridCols() }).map((_, i) => (
                          <div key={i} className="rm-grid-line" />
                        ))}
                      </div>

                      {teamEpics.map((epic, index) => {
                        let start = epic.startMonth - getMonthOffset();
                        let end = epic.endMonth - getMonthOffset();
                        
                        if (start < 1) start = 1;
                        if (end > getGridCols()) end = getGridCols();
                        if (start > getGridCols() || end < 1) return null;

                        return (
                          <div 
                            key={epic.id}
                            className={`rm-epic-card status-${epic.status} type-${epic.type} ${hoveredEpic === epic.id ? 'hovered' : ''}`}
                            style={{ 
                              gridColumnStart: start, 
                              gridColumnEnd: end + 1,
                              animationDelay: `${index * 0.05}s`
                            }}
                            onMouseEnter={() => setHoveredEpic(epic.id)}
                            onMouseLeave={() => setHoveredEpic(null)}
                          >
                            <div className="rm-epic-content">
                              <div className="rm-epic-head">
                                <div className="rm-epic-title-wrap">
                                  {getStatusIcon(epic.status)}
                                  <span className="rm-epic-title">{epic.title}</span>
                                </div>
                                <div className="rm-epic-avatars">
                                  {epic.assignees.map((avatar, i) => (
                                    <img key={i} src={avatar} alt="" style={{ zIndex: 10 - i }} />
                                  ))}
                                </div>
                              </div>
                              
                              <div className="rm-epic-foot">
                                <span className="rm-epic-tag">{epic.id}</span>
                                <div className="rm-epic-progress-track">
                                  <div 
                                    className="rm-epic-progress-bar" 
                                    style={{ width: loaded ? `${epic.progress}%` : '0%' }} 
                                  />
                                </div>
                                <span className="rm-epic-pct">{epic.progress}%</span>
                              </div>
                            </div>
                            
                            {/* Detailed Hover Popover */}
                            {hoveredEpic === epic.id && (
                              <div className="rm-popover-glass">
                                <div className="rm-pop-header">
                                  <h4>{epic.title}</h4>
                                  <span className={`rm-pri-badge pri-${epic.priority}`}>
                                    <Flag size={10} /> {epic.priority}
                                  </span>
                                </div>
                                
                                <div className="rm-pop-meta">
                                  <span className="rm-pop-tag"><Target size={12} /> {epic.type}</span>
                                  <span className="rm-pop-tag"><Calendar size={12} /> M{epic.startMonth} - M{epic.endMonth}</span>
                                </div>
                                
                                <div className="rm-pop-progress-section">
                                  <div className="rm-pop-prog-labels">
                                    <span>Progress</span>
                                    <span>{epic.progress}%</span>
                                  </div>
                                  <div className="rm-pop-prog-track">
                                    <div className="rm-pop-prog-fill" style={{ width: `${epic.progress}%` }}></div>
                                  </div>
                                </div>

                                <div className="rm-pop-footer">
                                  <div className="rm-pop-status">
                                    Status: <span className={`st-${epic.status}`}>{epic.status.replace('-', ' ').toUpperCase()}</span>
                                  </div>
                                  <button className="rm-pop-action">View Epic</button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

