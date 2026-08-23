import React, { useState } from 'react';
import { 
  CheckCircle2,
  Settings,
  MoreHorizontal,
  X,
  ExternalLink,
} from 'lucide-react';
import { ALL_INTEGRATIONS } from './data';

export const IntegrationsOverview = () => {
  const [selectedId, setSelectedId] = useState<string>('slack');
  const selectedIntg = ALL_INTEGRATIONS.find(i => i.id === selectedId) || ALL_INTEGRATIONS[0];

  return (
    <div className="intg-main-split">
      {/* Left: Table Area */}
      <div className="intg-table-area">
        <h2 className="intg-table-title" style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>All Integrations</h2>
        <div className="intg-table-wrapper">
          <table className="intg-table">
            <thead>
              <tr>
                <th style={{ width: '26%' }}>Integration</th>
                <th style={{ width: '18%' }}>Category</th>
                <th style={{ width: '16%' }}>Status</th>
                <th style={{ width: '13%' }}>Last Synced</th>
                <th style={{ width: '9%' }}>Usage</th>
                <th style={{ width: '18%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ALL_INTEGRATIONS.map(intg => (
                <tr 
                  key={intg.id} 
                  className={selectedId === intg.id ? 'intg-row-active' : ''}
                  onClick={() => setSelectedId(intg.id)}
                >
                  <td>
                    <div className="intg-cell-integration">
                      <div className="intg-app-icon">
                        <intg.icon size={28} color={intg.iconColor} />
                      </div>
                      <div className="intg-app-details">
                        <span className="intg-app-name">{intg.name}</span>
                        <span className="intg-app-desc" title={intg.desc}>{intg.desc}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`intg-badge intg-badge-${intg.catColor}`}>
                      {intg.category}
                    </span>
                  </td>
                  <td>
                    <div className={`intg-status intg-status-${
                      intg.status === 'Connected' ? 'green' : 
                      intg.status === 'Error' ? 'red' : 'grey'
                    }`}>
                      <div className={`intg-dot intg-dot-${
                        intg.status === 'Connected' ? 'green' : 
                        intg.status === 'Error' ? 'red' : 'grey'
                      }`}></div>
                      {intg.status === 'Error' ? (
                        <div className="intg-status-text-block">
                          Error
                          <span className="intg-status-sub">Reauthenticate</span>
                        </div>
                      ) : (
                        <span>{intg.statusText}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="intg-text-muted">{intg.lastSynced}</span>
                  </td>
                  <td>
                    <span className="intg-usage-val">{intg.calls}</span>
                    <span className="intg-usage-label">calls</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="intg-actions-cell" style={{ justifyContent: 'flex-end' }}>
                      {intg.status === 'Disabled' ? (
                        <button className="intg-connect-btn">Connect</button>
                      ) : (
                        <button className="intg-icon-btn"><Settings size={14} /></button>
                      )}
                      <button className="intg-icon-btn"><MoreHorizontal size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="intg-pagination">
          <span className="intg-pag-text">Showing 1 to 8 of 18 integrations</span>
          <div className="intg-pag-controls">
            <button className="intg-pag-btn">&lt;</button>
            <button className="intg-pag-btn active">1</button>
            <button className="intg-pag-btn">2</button>
            <button className="intg-pag-btn">3</button>
            <button className="intg-pag-btn">&gt;</button>
          </div>
        </div>
      </div>

      {/* Right: Sidebar Area */}
      <div className="intg-sidebar">
        <div className="intg-sb-header">
          <div className="intg-sb-title-area">
            <selectedIntg.icon size={24} color={selectedIntg.iconColor} />
            <h2 className="intg-sb-title">{selectedIntg.name}</h2>
            {selectedIntg.status === 'Connected' && (
               <span className="intg-badge intg-badge-green" style={{ fontSize: '10px', padding: '2px 6px' }}>Connected</span>
            )}
          </div>
          <div className="intg-sb-actions">
            <button><MoreHorizontal size={16} /></button>
            <button><X size={16} /></button>
          </div>
        </div>

        <div className="intg-sb-tabs">
          <button className="intg-sb-tab active">Overview</button>
          <button className="intg-sb-tab">Configuration</button>
          <button className="intg-sb-tab">Activity</button>
          <button className="intg-sb-tab">Logs</button>
        </div>

        <div className="intg-sb-content">
          <p className="intg-sb-desc">{selectedIntg.desc}</p>
          
          <div className="intg-props-grid">
            <span className="intg-prop-label">Connected On</span>
            <span className="intg-prop-val">{selectedIntg.details.connectedOn}</span>
            
            <span className="intg-prop-label">Connected By</span>
            <span className="intg-prop-val">
              {selectedIntg.details.connectedBy !== '-' && (
                 <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="avatar" className="intg-prop-avatar" />
              )}
              {selectedIntg.details.connectedBy}
            </span>

            <span className="intg-prop-label">Workspace</span>
            <a href="#" className="intg-prop-link">
              {selectedIntg.details.workspace} {selectedIntg.details.workspace !== '-' && <ExternalLink size={12} color="#9ca3af" />}
            </a>

            <span className="intg-prop-label">Default Channel</span>
            <a href="#" className="intg-prop-link">
              {selectedIntg.details.channel} {selectedIntg.details.channel !== '-' && <ExternalLink size={12} color="#9ca3af" />}
            </a>
          </div>

          <h4 className="intg-sb-section-title">Usage (Last 30 Days)</h4>
          <div className="intg-usage-grid">
            <div className="intg-usage-box">
              <span className="intg-ubox-val">{selectedIntg.details.stats.s1}</span>
              <span className="intg-ubox-label">{selectedIntg.details.stats.l1}</span>
            </div>
            <div className="intg-usage-box">
              <span className="intg-ubox-val">{selectedIntg.details.stats.s2}</span>
              <span className="intg-ubox-label">{selectedIntg.details.stats.l2}</span>
            </div>
            <div className="intg-usage-box">
              <span className="intg-ubox-val">{selectedIntg.details.stats.s3}</span>
              <span className="intg-ubox-label">{selectedIntg.details.stats.l3}</span>
            </div>
          </div>

          <div className="intg-activity-header">
            <h4 className="intg-sb-section-title" style={{ margin: 0 }}>Recent Activity</h4>
            <a href="#" className="intg-activity-link">View all</a>
          </div>

          <div className="intg-activity-list">
            <div className="intg-activity-item">
              <div className="intg-activity-left">
                <CheckCircle2 size={14} className="intg-activity-icon" />
                <span className="intg-activity-text">Message sent to #atlas-notifications</span>
              </div>
              <span className="intg-activity-time">2 min ago</span>
            </div>
            <div className="intg-activity-item">
              <div className="intg-activity-left">
                <CheckCircle2 size={14} className="intg-activity-icon" />
                <span className="intg-activity-text">Reminder sent to #product-team</span>
              </div>
              <span className="intg-activity-time">15 min ago</span>
            </div>
            <div className="intg-activity-item">
              <div className="intg-activity-left">
                <CheckCircle2 size={14} className="intg-activity-icon" />
                <span className="intg-activity-text">Daily digest sent</span>
              </div>
              <span className="intg-activity-time">1 hour ago</span>
            </div>
          </div>

          <div className="intg-sb-footer">
            <button className="intg-btn-danger-outline">Disconnect</button>
            <button className="intg-btn-danger-solid">Reauthenticate</button>
          </div>

        </div>
      </div>
    </div>
  );
};
