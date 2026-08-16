import React from 'react';
import '../Reports.css';
import { 
  Users, 
  Activity, 
  AlertOctagon, 
  CheckCircle2, 
  ChevronDown, 
  Search,
  Filter
} from 'lucide-react';

export const ReportsWorkload = () => {
  const members = [
    { name: 'Alex Rivera', role: 'UI Designer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', tasks: 12, hours: 32.5, capacity: 81, status: 'Optimal' },
    { name: 'Sarah Chen', role: 'UX Researcher', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', tasks: 18, hours: 45.0, capacity: 112, status: 'Over Capacity' },
    { name: 'Marcus Johnson', role: 'Product Designer', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d', tasks: 8, hours: 22.0, capacity: 55, status: 'Under Capacity' },
    { name: 'Emily Davis', role: 'Design Lead', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d', tasks: 15, hours: 38.5, capacity: 96, status: 'Optimal' },
    { name: 'Michael Lee', role: 'Frontend Engineer', avatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d', tasks: 22, hours: 48.0, capacity: 120, status: 'Over Capacity' },
    { name: 'Jessica Taylor', role: 'Backend Engineer', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702e', tasks: 10, hours: 28.0, capacity: 70, status: 'Optimal' },
    { name: 'David Smith', role: 'Data Analyst', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702f', tasks: 5, hours: 15.0, capacity: 37, status: 'Under Capacity' },
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
            <span className="rpt-kpi-label">Tracked Members</span>
          </div>
          <span className="rpt-kpi-value">45</span>
          <div className="rpt-kpi-trend">
            <span className="rpt-trend-arrow">↑ 2</span>
            <span className="rpt-trend-vs">this week</span>
          </div>
        </div>
        
        <div className="rpt-kpi-card">
          <div className="rpt-kpi-top">
            <div className="rpt-kpi-icon-box rpt-icon-green">
              <CheckCircle2 size={20} />
            </div>
            <span className="rpt-kpi-label">Optimal Capacity</span>
          </div>
          <span className="rpt-kpi-value">28</span>
          <div className="rpt-kpi-trend">
            <span className="rpt-trend-arrow">62%</span>
            <span className="rpt-trend-vs">of total team</span>
          </div>
        </div>

        <div className="rpt-kpi-card">
          <div className="rpt-kpi-top">
            <div className="rpt-kpi-icon-box rpt-icon-red">
              <AlertOctagon size={20} />
            </div>
            <span className="rpt-kpi-label">Overallocated</span>
          </div>
          <span className="rpt-kpi-value">8</span>
          <div className="rpt-kpi-trend rpt-trend-down">
            <span className="rpt-trend-arrow">↑ 3</span>
            <span className="rpt-trend-vs">needs attention</span>
          </div>
        </div>

        <div className="rpt-kpi-card">
          <div className="rpt-kpi-top">
            <div className="rpt-kpi-icon-box rpt-icon-orange">
              <Activity size={20} />
            </div>
            <span className="rpt-kpi-label">Underallocated</span>
          </div>
          <span className="rpt-kpi-value">9</span>
          <div className="rpt-kpi-trend">
            <span className="rpt-trend-arrow">↓ 2</span>
            <span className="rpt-trend-vs">vs last week</span>
          </div>
        </div>
      </div>

      {/* MAIN TABLE AREA */}
      <div className="rpt-card rpt-table-card" style={{ marginTop: '24px' }}>
        <div className="rpt-card-header" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
          <h2 className="rpt-card-title">Individual Workload</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="rpt-dropdown">
              <Search size={14} className="rpt-text-muted" />
              <span>Search members...</span>
            </div>
            <div className="rpt-dropdown">
              <span>All Teams</span>
              <ChevronDown size={14} className="rpt-text-muted" />
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
                <th style={{ width: '25%', textAlign: 'left', padding: '16px' }}>Team Member</th>
                <th style={{ width: '15%', textAlign: 'left', padding: '16px' }}>Active Tasks</th>
                <th style={{ width: '15%', textAlign: 'left', padding: '16px' }}>Logged (Week)</th>
                <th style={{ width: '25%', textAlign: 'left', padding: '16px' }}>Capacity Allocation</th>
                <th style={{ width: '20%', textAlign: 'left', padding: '16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '16px' }}>
                    <div className="rpt-member-info">
                      <img src={member.avatar} alt={member.name} className="rpt-avatar" style={{ width: '32px', height: '32px' }} />
                      <div>
                        <div className="rpt-member-name" style={{ fontSize: '14px' }}>{member.name}</div>
                        <div className="rpt-member-role">{member.role}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontWeight: 500, color: '#334155' }}>
                    {member.tasks}
                  </td>
                  <td style={{ padding: '16px', color: '#64748b' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{member.hours}h</span> / 40h
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="rpt-progress-bar-bg" style={{ flex: 1, backgroundColor: '#f1f5f9', height: '8px' }}>
                        <div className={`rpt-progress-bar-fill ${
                          member.capacity > 100 ? 'rpt-bg-red' : 
                          member.capacity > 60 ? 'rpt-bg-blue' : 'rpt-bg-green'
                        }`} style={{ width: `${Math.min(member.capacity, 100)}%` }}></div>
                      </div>
                      <span style={{ fontSize: '12px', color: '#64748b', minWidth: '36px' }}>{member.capacity}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                     <span className={`rpt-badge ${
                        member.status === 'Optimal' ? 'rpt-badge-optimal' :
                        member.status === 'Over Capacity' ? 'rpt-badge-over' : 'rpt-badge-under'
                      }`}>
                        {member.status}
                      </span>
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
