import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Filter, ChevronLeft, ChevronRight,
  MoreHorizontal, Clock, CheckCircle2, Circle, AlertCircle,
  Calendar, Layers, Tag, User, Users, AlignLeft, BarChart3,
  Rocket, Server, Paintbrush, Shield
} from 'lucide-react';
import './Roadmap.css';

/* ── Types ── */
interface Epic {
  id: string;
  title: string;
  team: 'Frontend' | 'Backend' | 'Design' | 'Security';
  status: 'planning' | 'in-progress' | 'completed' | 'at-risk';
  startMonth: number; // 1 to 12
  endMonth: number;   // 1 to 12
  progress: number;
  assignees: string[];
  type: 'feature' | 'infrastructure' | 'redesign' | 'security';
}

const TEAMS = [
  { id: 'Frontend', name: 'Frontend App', icon: Rocket, color: '#6366f1' },
  { id: 'Backend', name: 'Backend & API', icon: Server, color: '#10b981' },
  { id: 'Design', name: 'Design System', icon: Paintbrush, color: '#ec4899' },
  { id: 'Security', name: 'Security & Auth', icon: Shield, color: '#f59e0b' }
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const INITIAL_EPICS: Epic[] = [
  // Frontend
  { id: 'EP-1', title: 'New Onboarding Flow', team: 'Frontend', status: 'completed', startMonth: 1, endMonth: 3, progress: 100, assignees: ['https://i.pravatar.cc/150?u=a', 'https://i.pravatar.cc/150?u=b'], type: 'feature' },
  { id: 'EP-2', title: 'Real-time Inbox Refactor', team: 'Frontend', status: 'in-progress', startMonth: 3, endMonth: 5, progress: 65, assignees: ['https://i.pravatar.cc/150?u=c'], type: 'feature' },
  { id: 'EP-3', title: 'Interactive Roadmap View', team: 'Frontend', status: 'in-progress', startMonth: 5, endMonth: 7, progress: 40, assignees: ['https://i.pravatar.cc/150?u=d', 'https://i.pravatar.cc/150?u=a'], type: 'feature' },
  { id: 'EP-4', title: 'Mobile App Beta Launch', team: 'Frontend', status: 'planning', startMonth: 8, endMonth: 11, progress: 0, assignees: ['https://i.pravatar.cc/150?u=e'], type: 'feature' },
  // Backend
  { id: 'EP-5', title: 'GraphQL API Migration', team: 'Backend', status: 'in-progress', startMonth: 2, endMonth: 6, progress: 75, assignees: ['https://i.pravatar.cc/150?u=f', 'https://i.pravatar.cc/150?u=g'], type: 'infrastructure' },
  { id: 'EP-6', title: 'Database Sharding', team: 'Backend', status: 'planning', startMonth: 7, endMonth: 9, progress: 10, assignees: ['https://i.pravatar.cc/150?u=h'], type: 'infrastructure' },
  { id: 'EP-7', title: 'Webhooks System v2', team: 'Backend', status: 'planning', startMonth: 9, endMonth: 12, progress: 0, assignees: ['https://i.pravatar.cc/150?u=i'], type: 'feature' },
  // Design
  { id: 'EP-8', title: 'Dark Mode Support', team: 'Design', status: 'completed', startMonth: 1, endMonth: 2, progress: 100, assignees: ['https://i.pravatar.cc/150?u=j'], type: 'redesign' },
  { id: 'EP-9', title: 'Component Library 3.0', team: 'Design', status: 'in-progress', startMonth: 3, endMonth: 8, progress: 50, assignees: ['https://i.pravatar.cc/150?u=k', 'https://i.pravatar.cc/150?u=j'], type: 'redesign' },
  { id: 'EP-10', title: 'Marketing Site Refresh', team: 'Design', status: 'planning', startMonth: 10, endMonth: 12, progress: 0, assignees: ['https://i.pravatar.cc/150?u=l'], type: 'redesign' },
  // Security
  { id: 'EP-11', title: 'OAuth2 Implementation', team: 'Security', status: 'completed', startMonth: 1, endMonth: 4, progress: 100, assignees: ['https://i.pravatar.cc/150?u=m'], type: 'security' },
  { id: 'EP-12', title: 'SOC2 Compliance Audit', team: 'Security', status: 'at-risk', startMonth: 4, endMonth: 7, progress: 45, assignees: ['https://i.pravatar.cc/150?u=n', 'https://i.pravatar.cc/150?u=o'], type: 'security' },
  { id: 'EP-13', title: 'SSO Integration (SAML)', team: 'Security', status: 'planning', startMonth: 8, endMonth: 11, progress: 5, assignees: ['https://i.pravatar.cc/150?u=p'], type: 'security' },
];

export const Roadmap = () => {
  const [epics, setEpics] = useState<Epic[]>(INITIAL_EPICS);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'Q1-Q2' | 'Q3-Q4' | 'Year'>('Year');
  const [hoveredEpic, setHoveredEpic] = useState<string | null>(null);

  // Real current month marker (1-12)
  const currentMonth = new Date().getMonth() + 1;

  const filteredEpics = epics.filter(e => {
    if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (view === 'Q1-Q2' && e.startMonth > 6) return false;
    if (view === 'Q3-Q4' && e.endMonth < 7) return false;
    return true;
  });

  const getStatusIcon = (status: Epic['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={14} className="rm-st-icon rm-st-completed" />;
      case 'in-progress': return <Clock size={14} className="rm-st-icon rm-st-progress" />;
      case 'at-risk': return <AlertCircle size={14} className="rm-st-icon rm-st-risk" />;
      default: return <Circle size={14} className="rm-st-icon rm-st-planning" />;
    }
  };

  const getGridCols = () => {
    if (view === 'Q1-Q2') return 6;
    if (view === 'Q3-Q4') return 6;
    return 12;
  };

  const getMonthOffset = () => {
    if (view === 'Q3-Q4') return 6;
    return 0;
  };

  const visibleMonths = MONTHS.slice(getMonthOffset(), getMonthOffset() + getGridCols());

  return (
    <div className="rm-page custom-scrollbar">
      {/* ── Header ── */}
      <div className="rm-header">
        <div className="rm-header-top">
          <div className="rm-title-group">
            <h1>Product Roadmap 2026</h1>
            <span className="rm-badge">Enterprise Edition</span>
          </div>
          <div className="rm-header-actions">
            <div className="rm-search-box">
              <Search size={16} />
              <input 
                placeholder="Search epics, teams..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="rm-btn-secondary"><Filter size={14} /> Filters</button>
            <button className="rm-btn-primary"><Plus size={14} /> New Epic</button>
          </div>
        </div>

        <div className="rm-header-bottom">
          <div className="rm-view-tabs">
            <button className={`rm-tab ${view === 'Year' ? 'active' : ''}`} onClick={() => setView('Year')}>2026 Full Year</button>
            <button className={`rm-tab ${view === 'Q1-Q2' ? 'active' : ''}`} onClick={() => setView('Q1-Q2')}>Q1 - Q2</button>
            <button className={`rm-tab ${view === 'Q3-Q4' ? 'active' : ''}`} onClick={() => setView('Q3-Q4')}>Q3 - Q4</button>
          </div>
          <div className="rm-legend">
            <div className="rm-legend-item"><span className="rm-legend-dot blue"></span> Planning</div>
            <div className="rm-legend-item"><span className="rm-legend-dot purple"></span> In Progress</div>
            <div className="rm-legend-item"><span className="rm-legend-dot green"></span> Completed</div>
            <div className="rm-legend-item"><span className="rm-legend-dot red"></span> At Risk</div>
          </div>
        </div>
      </div>

      {/* ── Roadmap Board ── */}
      <div className="rm-board-wrap">
        <div className="rm-board-scroll custom-scrollbar">
          <div className="rm-board" style={{ '--cols': getGridCols() } as React.CSSProperties}>
            
            {/* Timeline Header */}
            <div className="rm-timeline-header">
              <div className="rm-team-col-header">Teams & Initiatives</div>
              <div className="rm-months-grid">
                {visibleMonths.map((m, i) => {
                  const mIndex = i + getMonthOffset() + 1;
                  const isCurrent = mIndex === currentMonth;
                  return (
                    <div key={m} className={`rm-month-col ${isCurrent ? 'current' : ''}`}>
                      <span className="rm-month-name">{m}</span>
                      {isCurrent && <div className="rm-today-marker">Today</div>}
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
                  style={{ left: `calc(300px + ((100% - 300px) / ${getGridCols()}) * ${currentMonth - getMonthOffset() - 0.5})` }} 
                />
              )}

              {TEAMS.map(team => {
                const teamEpics = filteredEpics.filter(e => e.team === team.id);
                if (teamEpics.length === 0) return null;
                const TeamIcon = team.icon;

                return (
                  <div key={team.id} className="rm-team-row">
                    {/* Left Col: Team Info */}
                    <div className="rm-team-col">
                      <div className="rm-team-label">
                        <div className="rm-team-icon" style={{ backgroundColor: `${team.color}15`, color: team.color }}>
                          <TeamIcon size={18} />
                        </div>
                        <h3>{team.name}</h3>
                      </div>
                      <span className="rm-team-count">{teamEpics.length} epics</span>
                    </div>

                    {/* Right Col: Timeline Grid */}
                    <div className="rm-epics-grid">
                      {teamEpics.map(epic => {
                        // Calculate grid columns
                        let start = epic.startMonth - getMonthOffset();
                        let end = epic.endMonth - getMonthOffset();
                        
                        // Clip to visible area
                        if (start < 1) start = 1;
                        if (end > getGridCols()) end = getGridCols();
                        
                        // If completely out of view, don't render (should be handled by filter but just in case)
                        if (start > getGridCols() || end < 1) return null;

                        const duration = end - start + 1;

                        return (
                          <div 
                            key={epic.id}
                            className={`rm-epic-card status-${epic.status} type-${epic.type} ${hoveredEpic === epic.id ? 'hovered' : ''}`}
                            style={{ 
                              gridColumnStart: start, 
                              gridColumnEnd: end + 1,
                            }}
                            onMouseEnter={() => setHoveredEpic(epic.id)}
                            onMouseLeave={() => setHoveredEpic(null)}
                          >
                            <div className="rm-epic-inner">
                              <div className="rm-epic-top">
                                <div className="rm-epic-title">
                                  {getStatusIcon(epic.status)}
                                  <span className="rm-epic-name">{epic.title}</span>
                                </div>
                                <div className="rm-epic-avatars">
                                  {epic.assignees.map((avatar, i) => (
                                    <img key={i} src={avatar} alt="" style={{ zIndex: 10 - i }} />
                                  ))}
                                </div>
                              </div>
                              <div className="rm-epic-bottom">
                                <span className="rm-epic-id">{epic.id}</span>
                                <div className="rm-epic-progress-bg">
                                  <div className="rm-epic-progress-fill" style={{ width: `${epic.progress}%` }} />
                                </div>
                                <span className="rm-epic-pct">{epic.progress}%</span>
                              </div>
                            </div>
                            
                            {/* Detailed Hover Popover */}
                            {hoveredEpic === epic.id && (
                              <div className="rm-popover">
                                <h4>{epic.title}</h4>
                                <div className="rm-pop-meta">
                                  <span><Tag size={12} /> {epic.type}</span>
                                  <span><Calendar size={12} /> Month {epic.startMonth} - {epic.endMonth}</span>
                                </div>
                                <p className="rm-pop-desc">Strategic initiative to improve {team.name.toLowerCase()} capabilities across the enterprise platform.</p>
                                <div className="rm-pop-foot">
                                  <div className="rm-pop-status">Status: <strong>{epic.status.replace('-', ' ').toUpperCase()}</strong></div>
                                  <button className="rm-pop-btn">View Details</button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      
                      {/* Grid Lines Overlay */}
                      <div className="rm-grid-lines">
                        {Array.from({ length: getGridCols() }).map((_, i) => (
                          <div key={i} className="rm-grid-line" />
                        ))}
                      </div>
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
