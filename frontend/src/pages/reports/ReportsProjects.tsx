import React from 'react';
import '../Reports.css';
import { 
  Folder, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ChevronDown, 
  Search,
  Filter
} from 'lucide-react';

export const ReportsProjects = () => {
  const projects = [
    { name: 'Website Redesign', owner: 'Alex Rivera', ownerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', status: 'On Track', progress: 85, due: 'May 30, 2024' },
    { name: 'Mobile App V2', owner: 'Emily Davis', ownerAvatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d', status: 'At Risk', progress: 45, due: 'Jun 15, 2024' },
    { name: 'Q3 Marketing Campaign', owner: 'Marcus Johnson', ownerAvatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d', status: 'Completed', progress: 100, due: 'May 10, 2024' },
    { name: 'Database Migration', owner: 'Sarah Chen', ownerAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', status: 'On Track', progress: 20, due: 'Jul 01, 2024' },
    { name: 'New Feature Rollout', owner: 'Michael Lee', ownerAvatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d', status: 'Behind', progress: 60, due: 'May 25, 2024' },
  ];

  return (
    <div className="rpt-content-layout" style={{ flexDirection: 'column' }}>
      
      {/* KPI ROW */}
      <div className="rpt-kpi-row">
        <div className="rpt-kpi-card">
          <div className="rpt-kpi-top">
            <div className="rpt-kpi-icon-box rpt-icon-purple">
              <Folder size={20} />
            </div>
            <span className="rpt-kpi-label">Total Projects</span>
          </div>
          <span className="rpt-kpi-value">24</span>
          <div className="rpt-kpi-trend">
            <span className="rpt-trend-arrow">↑ 4</span>
            <span className="rpt-trend-vs">this month</span>
          </div>
        </div>
        
        <div className="rpt-kpi-card">
          <div className="rpt-kpi-top">
            <div className="rpt-kpi-icon-box rpt-icon-green">
              <CheckCircle2 size={20} />
            </div>
            <span className="rpt-kpi-label">On Track</span>
          </div>
          <span className="rpt-kpi-value">16</span>
          <div className="rpt-kpi-trend">
            <span className="rpt-trend-arrow">67%</span>
            <span className="rpt-trend-vs">of total projects</span>
          </div>
        </div>

        <div className="rpt-kpi-card">
          <div className="rpt-kpi-top">
            <div className="rpt-kpi-icon-box rpt-icon-orange">
              <AlertTriangle size={20} />
            </div>
            <span className="rpt-kpi-label">At Risk / Behind</span>
          </div>
          <span className="rpt-kpi-value">5</span>
          <div className="rpt-kpi-trend rpt-trend-down">
            <span className="rpt-trend-arrow">↑ 2</span>
            <span className="rpt-trend-vs">since last week</span>
          </div>
        </div>

        <div className="rpt-kpi-card">
          <div className="rpt-kpi-top">
            <div className="rpt-kpi-icon-box rpt-icon-blue">
              <Clock size={20} />
            </div>
            <span className="rpt-kpi-label">Completed</span>
          </div>
          <span className="rpt-kpi-value">3</span>
          <div className="rpt-kpi-trend">
            <span className="rpt-trend-arrow">↓ 1</span>
            <span className="rpt-trend-vs">vs last month</span>
          </div>
        </div>
      </div>

      {/* MAIN TABLE AREA */}
      <div className="rpt-card rpt-table-card" style={{ marginTop: '24px' }}>
        <div className="rpt-card-header" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
          <h2 className="rpt-card-title">Project Status</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="rpt-dropdown">
              <Search size={14} className="rpt-text-muted" />
              <span>Search...</span>
            </div>
            <div className="rpt-dropdown">
              <Filter size={14} className="rpt-text-muted" />
              <span>Filter</span>
            </div>
          </div>
        </div>
        
        <div className="rpt-table-container">
          <table className="rpt-table">
            <thead>
              <tr>
                <th style={{ width: '30%', textAlign: 'left', padding: '16px' }}>Project Name</th>
                <th style={{ width: '25%', textAlign: 'left', padding: '16px' }}>Owner</th>
                <th style={{ width: '15%', textAlign: 'left', padding: '16px' }}>Status</th>
                <th style={{ width: '15%', textAlign: 'left', padding: '16px' }}>Progress</th>
                <th style={{ width: '15%', textAlign: 'left', padding: '16px' }}>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '16px', fontWeight: 500, color: '#334155' }}>
                    {project.name}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div className="rpt-member-info">
                      <img src={project.ownerAvatar} alt={project.owner} className="rpt-avatar" style={{ width: '28px', height: '28px' }} />
                      <div className="rpt-member-name">{project.owner}</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className={`rpt-badge ${
                      project.status === 'On Track' ? 'rpt-badge-optimal' :
                      project.status === 'Completed' ? 'rpt-badge-optimal' :
                      project.status === 'At Risk' ? 'rpt-badge-over' : 'rpt-badge-under'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="rpt-progress-bar-bg" style={{ flex: 1 }}>
                        <div className={`rpt-progress-bar-fill ${
                          project.progress === 100 ? 'rpt-bg-green' : 'rpt-bg-blue'
                        }`} style={{ width: `${project.progress}%` }}></div>
                      </div>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{project.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>
                    {project.due}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
