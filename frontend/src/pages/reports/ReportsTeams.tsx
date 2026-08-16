import React from 'react';
import '../Reports.css';
import { 
  Users, 
  UserPlus,
  Briefcase,
  Activity,
  ChevronDown, 
  MoreHorizontal
} from 'lucide-react';

export const ReportsTeams = () => {
  const teams = [
    { name: 'Product Design', members: 12, focus: 'User Experience', progress: 85, status: 'Optimal' },
    { name: 'Engineering - Frontend', members: 18, focus: 'Web App V2', progress: 62, status: 'Over Capacity' },
    { name: 'Engineering - Backend', members: 14, focus: 'API V3 Migration', progress: 91, status: 'Optimal' },
    { name: 'Marketing', members: 8, focus: 'Q3 Campaign', progress: 45, status: 'Under Capacity' },
    { name: 'Data Science', members: 6, focus: 'Recommendation Engine', progress: 30, status: 'Optimal' },
    { name: 'Customer Success', members: 15, focus: 'Enterprise Onboarding', progress: 78, status: 'Optimal' },
  ];

  return (
    <div className="rpt-content-layout" style={{ flexDirection: 'column' }}>
      
      {/* KPI ROW */}
      <div className="rpt-kpi-row">
        <div className="rpt-kpi-card">
          <div className="rpt-kpi-top">
            <div className="rpt-kpi-icon-box rpt-icon-purple">
              <Users size={20} />
            </div>
            <span className="rpt-kpi-label">Active Teams</span>
          </div>
          <span className="rpt-kpi-value">12</span>
          <div className="rpt-kpi-trend">
            <span className="rpt-trend-arrow">↑ 1</span>
            <span className="rpt-trend-vs">vs last quarter</span>
          </div>
        </div>
        
        <div className="rpt-kpi-card">
          <div className="rpt-kpi-top">
            <div className="rpt-kpi-icon-box rpt-icon-blue">
              <UserPlus size={20} />
            </div>
            <span className="rpt-kpi-label">Total Members</span>
          </div>
          <span className="rpt-kpi-value">148</span>
          <div className="rpt-kpi-trend">
            <span className="rpt-trend-arrow">↑ 12%</span>
            <span className="rpt-trend-vs">vs last year</span>
          </div>
        </div>

        <div className="rpt-kpi-card">
          <div className="rpt-kpi-top">
            <div className="rpt-kpi-icon-box rpt-icon-orange">
              <Activity size={20} />
            </div>
            <span className="rpt-kpi-label">Avg. Velocity</span>
          </div>
          <span className="rpt-kpi-value">84 pts</span>
          <div className="rpt-kpi-trend rpt-trend-down">
            <span className="rpt-trend-arrow">↓ 2%</span>
            <span className="rpt-trend-vs">vs last sprint</span>
          </div>
        </div>

        <div className="rpt-kpi-card">
          <div className="rpt-kpi-top">
            <div className="rpt-kpi-icon-box rpt-icon-green">
              <Briefcase size={20} />
            </div>
            <span className="rpt-kpi-label">Utilization</span>
          </div>
          <span className="rpt-kpi-value">88%</span>
          <div className="rpt-kpi-trend">
            <span className="rpt-trend-arrow">↑ 4%</span>
            <span className="rpt-trend-vs">optimal range</span>
          </div>
        </div>
      </div>

      {/* TEAMS GRID */}
      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 className="rpt-card-title">Team Overview</h2>
        <div className="rpt-dropdown" style={{ background: '#fff' }}>
          <span>Sort by: Performance</span>
          <ChevronDown size={14} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {teams.map((team, i) => (
          <div key={i} className="rpt-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#1e293b' }}>{team.name}</h3>
                <span style={{ fontSize: '13px', color: '#64748b' }}>{team.members} members</span>
              </div>
              <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <MoreHorizontal size={18} />
              </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Focus</div>
              <div style={{ fontSize: '14px', color: '#334155', fontWeight: 500 }}>{team.focus}</div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Sprint Progress</span>
                <span style={{ fontWeight: 600, color: '#334155' }}>{team.progress}%</span>
              </div>
              <div className="rpt-progress-bar-bg">
                <div className="rpt-progress-bar-fill rpt-bg-purple" style={{ width: `${team.progress}%` }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <div style={{ display: 'flex' }}>
                {/* Simulated Avatar Stack */}
                <img src={`https://i.pravatar.cc/150?u=${i}1`} className="rpt-avatar" style={{ border: '2px solid #fff', marginLeft: 0 }} />
                <img src={`https://i.pravatar.cc/150?u=${i}2`} className="rpt-avatar" style={{ border: '2px solid #fff', marginLeft: '-8px' }} />
                <img src={`https://i.pravatar.cc/150?u=${i}3`} className="rpt-avatar" style={{ border: '2px solid #fff', marginLeft: '-8px' }} />
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9', border: '2px solid #fff', marginLeft: '-8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                  +{team.members - 3}
                </div>
              </div>
              <span className={`rpt-badge ${
                team.status === 'Optimal' ? 'rpt-badge-optimal' :
                team.status === 'Over Capacity' ? 'rpt-badge-over' : 'rpt-badge-under'
              }`}>
                {team.status}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
