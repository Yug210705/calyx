import React from 'react';
import { ALL_INTEGRATIONS } from './data';
import { Settings, MoreHorizontal, RefreshCw } from 'lucide-react';

export const IntegrationsConnected = () => {
  const connectedIntgs = ALL_INTEGRATIONS.filter(i => i.status === 'Connected' || i.status === 'Error');

  return (
    <div className="intg-connected-tab">
      <div className="intg-header-area">
        <h2 className="intg-table-title" style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: 600 }}>Active Connections</h2>
      </div>

      <div className="intg-cards-grid">
        {connectedIntgs.map(intg => (
          <div key={intg.id} className="intg-card">
            <div className="intg-card-header">
              <div className="intg-card-title-group">
                <div className="intg-app-icon" style={{ width: 40, height: 40, borderRadius: 10 }}>
                  <intg.icon size={24} color={intg.iconColor} />
                </div>
                <div>
                  <h3 className="intg-card-title">{intg.name}</h3>
                  <span className={`intg-status intg-status-${intg.status === 'Error' ? 'red' : 'green'}`} style={{ fontSize: 12 }}>
                    <div className={`intg-dot intg-dot-${intg.status === 'Error' ? 'red' : 'green'}`}></div>
                    {intg.status}
                  </span>
                </div>
              </div>
              <button className="intg-icon-btn"><MoreHorizontal size={14} /></button>
            </div>
            
            <p className="intg-card-desc">{intg.desc}</p>
            
            <div className="intg-card-stats">
              <div className="intg-card-stat">
                <span className="intg-card-stat-val">{intg.details.stats.s1}</span>
                <span className="intg-card-stat-label">{intg.details.stats.l1}</span>
              </div>
              <div className="intg-card-stat">
                <span className="intg-card-stat-val">{intg.details.stats.s3}</span>
                <span className="intg-card-stat-label">{intg.details.stats.l3}</span>
              </div>
            </div>

            <div className="intg-card-footer">
              <div className="intg-card-footer-item">
                <RefreshCw size={14} className="intg-text-muted" />
                <span className="intg-text-muted" style={{ fontSize: 12 }}>Synced {intg.lastSynced}</span>
              </div>
              <button className="intg-btn-outline" style={{ padding: '6px 12px' }}>
                <Settings size={14} /> Configure
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
