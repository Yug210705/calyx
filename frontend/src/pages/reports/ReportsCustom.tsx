import React from 'react';
import '../Reports.css';
import { 
  FilePlus, 
  Settings, 
  BarChart2,
  Calendar,
  ChevronDown, 
  Save,
  Play,
  FileText,
  Folder
} from 'lucide-react';

export const ReportsCustom = () => {
  const savedReports = [
    { name: 'Monthly Executive Summary', type: 'Dashboard', date: 'May 10, 2024' },
    { name: 'Q2 Resource Allocation', type: 'Spreadsheet', date: 'May 02, 2024' },
    { name: 'Engineering Velocity Tracking', type: 'Charts', date: 'Apr 28, 2024' },
    { name: 'Client Project Time Logs', type: 'Detailed List', date: 'Apr 15, 2024' },
  ];

  return (
    <div className="rpt-content-layout" style={{ gap: '24px' }}>
      
      {/* BUILDER AREA */}
      <div className="rpt-card" style={{ flex: 3 }}>
        <div className="rpt-card-header" style={{ padding: '24px 24px 16px 24px', borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <h2 className="rpt-card-title">Custom Report Builder</h2>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>Configure metrics and dimensions to generate a new report.</p>
          </div>
          <button className="rpt-download-btn" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', background: '#3b82f6', color: '#fff' }}>
            <Play size={16} /> Generate Report
          </button>
        </div>
        
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Report Name</label>
            <input type="text" placeholder="e.g. Weekly Marketing Performance" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', color: '#334155', outline: 'none' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Data Source</label>
              <div className="rpt-dropdown" style={{ width: '100%', justifyContent: 'space-between', padding: '10px 12px', background: '#fff', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Folder size={16} className="rpt-text-muted" /> All Projects</div>
                <ChevronDown size={16} className="rpt-text-muted" />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Date Range</label>
              <div className="rpt-dropdown" style={{ width: '100%', justifyContent: 'space-between', padding: '10px 12px', background: '#fff', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} className="rpt-text-muted" /> Last 30 Days</div>
                <ChevronDown size={16} className="rpt-text-muted" />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '12px' }}>Select Metrics</label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {['Task Count', 'Hours Tracked', 'Completion Rate', 'Overdue Tasks', 'Budget Spent', 'Team Velocity'].map((metric, i) => (
                <div key={i} style={{ 
                  padding: '8px 16px', 
                  border: i < 3 ? '1px solid #3b82f6' : '1px solid #e2e8f0', 
                  background: i < 3 ? '#eff6ff' : '#fff',
                  color: i < 3 ? '#1d4ed8' : '#64748b',
                  borderRadius: '20px', 
                  fontSize: '13px', 
                  cursor: 'pointer',
                  fontWeight: i < 3 ? 500 : 400
                }}>
                  {metric}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '12px' }}>Group By (Dimensions)</label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {['Assignee', 'Project', 'Priority', 'Status', 'Date (Day)', 'Date (Week)'].map((dim, i) => (
                <div key={i} style={{ 
                  padding: '8px 16px', 
                  border: i === 0 ? '1px solid #3b82f6' : '1px solid #e2e8f0', 
                  background: i === 0 ? '#eff6ff' : '#fff',
                  color: i === 0 ? '#1d4ed8' : '#64748b',
                  borderRadius: '20px', 
                  fontSize: '13px', 
                  cursor: 'pointer',
                  fontWeight: i === 0 ? 500 : 400
                }}>
                  {dim}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '24px' }}>
            <button className="rpt-download-btn" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Save size={16} /> Save as Template
            </button>
          </div>
        </div>
      </div>

      {/* SAVED REPORTS SIDEBAR */}
      <div className="rpt-sidebar" style={{ flex: 1.5 }}>
        <div className="rpt-card" style={{ height: '100%' }}>
          <div className="rpt-card-header" style={{ padding: '24px' }}>
            <h2 className="rpt-card-title">Saved Reports</h2>
          </div>
          <div style={{ padding: '0 24px 24px 24px' }}>
            {savedReports.map((report, i) => (
              <div key={i} style={{ 
                padding: '16px', 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px', 
                marginBottom: '16px',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                backgroundColor: '#fff'
              }} className="rpt-saved-report-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div className={`rpt-recent-icon-box ${i % 2 === 0 ? 'rpt-bg-light-blue' : 'rpt-bg-light-purple'}`}>
                    <BarChart2 size={18} className={i % 2 === 0 ? 'rpt-text-blue' : 'rpt-text-purple'} />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#334155' }}>{report.name}</h3>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{report.type} • Last generated {report.date}</div>
                  </div>
                </div>
              </div>
            ))}

            <button style={{ 
              width: '100%', 
              padding: '12px', 
              background: '#f8fafc', 
              border: '1px dashed #cbd5e1', 
              borderRadius: '8px', 
              color: '#64748b',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontWeight: 500
            }}>
              <FilePlus size={16} /> Import Template
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
