import React from 'react';
import '../Reports.css';
import { 
  Clock, 
  DollarSign, 
  Calendar,
  Coffee,
  ChevronDown, 
  Download
} from 'lucide-react';

export const ReportsTime = () => {
  const timeLogs = [
    { user: 'Alex Rivera', project: 'Website Redesign', task: 'Homepage mockups', duration: '4h 30m', date: 'Today, 2:30 PM', billable: true },
    { user: 'Emily Davis', project: 'Mobile App V2', task: 'API integration', duration: '6h 15m', date: 'Today, 11:00 AM', billable: true },
    { user: 'Marcus Johnson', project: 'Internal', task: 'Team meeting', duration: '1h 00m', date: 'Yesterday, 3:00 PM', billable: false },
    { user: 'Sarah Chen', project: 'Database Migration', task: 'Data sanitization', duration: '5h 45m', date: 'Yesterday, 10:30 AM', billable: true },
    { user: 'Michael Lee', project: 'Internal', task: 'Training', duration: '2h 00m', date: 'May 14, 2024', billable: false },
  ];

  return (
    <div className="rpt-content-layout" style={{ flexDirection: 'column' }}>
      
      {/* KPI ROW */}
      <div className="rpt-kpi-row">
        <div className="rpt-kpi-card">
          <div className="rpt-kpi-top">
            <div className="rpt-kpi-icon-box rpt-icon-blue">
              <Clock size={20} />
            </div>
            <span className="rpt-kpi-label">Total Hours</span>
          </div>
          <span className="rpt-kpi-value">1,482</span>
          <div className="rpt-kpi-trend">
            <span className="rpt-trend-arrow">↑ 12%</span>
            <span className="rpt-trend-vs">vs last month</span>
          </div>
        </div>
        
        <div className="rpt-kpi-card">
          <div className="rpt-kpi-top">
            <div className="rpt-kpi-icon-box rpt-icon-green">
              <DollarSign size={20} />
            </div>
            <span className="rpt-kpi-label">Billable Hours</span>
          </div>
          <span className="rpt-kpi-value">1,120</span>
          <div className="rpt-kpi-trend">
            <span className="rpt-trend-arrow">↑ 8%</span>
            <span className="rpt-trend-vs">75% of total</span>
          </div>
        </div>

        <div className="rpt-kpi-card">
          <div className="rpt-kpi-top">
            <div className="rpt-kpi-icon-box rpt-icon-orange">
              <Coffee size={20} />
            </div>
            <span className="rpt-kpi-label">Non-Billable</span>
          </div>
          <span className="rpt-kpi-value">362</span>
          <div className="rpt-kpi-trend rpt-trend-down">
            <span className="rpt-trend-arrow">↑ 15%</span>
            <span className="rpt-trend-vs">vs last month</span>
          </div>
        </div>

        <div className="rpt-kpi-card">
          <div className="rpt-kpi-top">
            <div className="rpt-kpi-icon-box rpt-icon-purple">
              <Calendar size={20} />
            </div>
            <span className="rpt-kpi-label">Avg Hours / Day</span>
          </div>
          <span className="rpt-kpi-value">6.8</span>
          <div className="rpt-kpi-trend">
            <span className="rpt-trend-arrow">--</span>
            <span className="rpt-trend-vs">per active user</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginTop: '24px' }}>
        {/* LINE CHART PLACEHOLDER */}
        <div className="rpt-card" style={{ flex: 2, padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 className="rpt-card-title">Time Tracked (Last 14 Days)</h2>
            <div className="rpt-dropdown" style={{ background: '#f8fafc' }}>
              <span>All Teams</span>
              <ChevronDown size={14} />
            </div>
          </div>
          
          <div style={{ height: '240px', position: 'relative', borderBottom: '1px solid #e2e8f0', borderLeft: '1px solid #e2e8f0' }}>
            {/* Simple mock line chart using SVG */}
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,80 L10,75 L20,85 L30,60 L40,65 L50,40 L60,50 L70,30 L80,35 L90,20 L100,10" fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <path d="M0,80 L10,75 L20,85 L30,60 L40,65 L50,40 L60,50 L70,30 L80,35 L90,20 L100,10 L100,100 L0,100 Z" fill="rgba(59, 130, 246, 0.1)" stroke="none" />
            </svg>
            <div style={{ position: 'absolute', bottom: '-24px', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '11px' }}>
              <span>May 1</span>
              <span>May 7</span>
              <span>May 14</span>
            </div>
          </div>
        </div>

        {/* TIME LOGS */}
        <div className="rpt-card" style={{ flex: 3 }}>
          <div className="rpt-card-header" style={{ padding: '24px 24px 16px 24px' }}>
            <h2 className="rpt-card-title">Recent Time Logs</h2>
            <button className="rpt-download-btn"><Download size={16} /></button>
          </div>
          
          <div className="rpt-table-container">
            <table className="rpt-table">
              <thead>
                <tr>
                  <th style={{ padding: '12px 24px', textAlign: 'left' }}>User</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left' }}>Project / Task</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left' }}>Duration</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {timeLogs.map((log, i) => (
                  <tr key={i} style={{ borderBottom: i < timeLogs.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 500, color: '#334155' }}>{log.user}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ color: '#334155', fontWeight: 500, fontSize: '13px' }}>{log.project}</div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>{log.task}</div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        backgroundColor: log.billable ? '#ecfdf5' : '#f1f5f9',
                        color: log.billable ? '#059669' : '#64748b',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: 600
                      }}>
                        {log.duration}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', color: '#64748b', fontSize: '13px' }}>{log.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
