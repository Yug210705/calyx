import React from 'react';
import { ALL_INTEGRATIONS } from './data';
import { Star, Download, ChevronRight } from 'lucide-react';

export const IntegrationsAvailable = () => {
  // Let's pretend some aren't connected yet, or just show all for marketplace demo
  const availableIntgs = ALL_INTEGRATIONS;

  return (
    <div className="intg-available-tab">
      <div className="intg-header-area" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 className="intg-table-title" style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>App Directory</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="intg-btn-outline" style={{ padding: '6px 12px' }}>Most Popular</button>
          <button className="intg-btn-outline" style={{ padding: '6px 12px' }}>Newly Added</button>
        </div>
      </div>

      <div className="intg-cards-grid">
        {availableIntgs.map(intg => (
          <div key={intg.id} className="intg-card">
            <div className="intg-card-header">
              <div className="intg-card-title-group">
                <div className="intg-app-icon" style={{ width: 48, height: 48, borderRadius: 12 }}>
                  <intg.icon size={28} color={intg.iconColor} />
                </div>
                <div>
                  <h3 className="intg-card-title" style={{ fontSize: 18 }}>{intg.name}</h3>
                  <span className={`intg-badge intg-badge-${intg.catColor}`} style={{ marginTop: 4 }}>
                    {intg.category}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="intg-card-desc" style={{ marginTop: 8 }}>{intg.desc}</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div className="intg-card-footer-item">
                <Star size={14} color="#f59e0b" fill="#f59e0b" />
                <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>4.8</span>
                <span className="intg-text-muted">(120)</span>
              </div>
              <div className="intg-card-footer-item">
                <Download size={14} className="intg-text-muted" />
                <span className="intg-text-muted" style={{ fontSize: 13 }}>10k+ installs</span>
              </div>
            </div>

            <div className="intg-card-footer">
              <a href="#" className="intg-activity-link" style={{ fontSize: 13 }}>Learn more <ChevronRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /></a>
              <button className="intg-btn-primary" style={{ padding: '8px 16px', borderRadius: 8 }}>
                Connect App
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
