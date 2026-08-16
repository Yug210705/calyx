import React from 'react';
import { Plus, Webhook, Activity, MoreHorizontal, CheckCircle2, XCircle } from 'lucide-react';

export const IntegrationsWebhooks = () => {
  return (
    <div className="intg-webhooks-tab">
      <div className="intg-header-area" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 32px 0' }}>
        <div>
          <h2 className="intg-table-title" style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>Webhooks</h2>
          <p className="intg-text-muted" style={{ margin: 0, fontSize: 14 }}>Push real-time updates from Atlas to your external services.</p>
        </div>
        <button className="intg-btn-primary">
          <Plus size={16} /> Add Endpoint
        </button>
      </div>

      <div className="intg-table-wrapper">
        <table className="intg-table">
          <thead>
            <tr>
              <th style={{ width: '25%' }}>Endpoint URL</th>
              <th style={{ width: '20%' }}>Events</th>
              <th style={{ width: '15%' }}>Status</th>
              <th style={{ width: '15%' }}>Success Rate</th>
              <th style={{ width: '15%' }}>Last Delivery</th>
              <th style={{ width: '10%', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ background: '#f3f4f6', padding: 8, borderRadius: 8 }}><Webhook size={16} color="#4b5563" /></div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14, color: '#111827', marginBottom: 4 }}>Slack Notifier</div>
                    <code style={{ fontSize: 11, color: '#6b7280' }}>https://api.slack.com/.../a1b2</code>
                  </div>
                </div>
              </td>
              <td>
                <span className="intg-badge intg-badge-purple">issue.created</span>
                <span className="intg-text-muted" style={{ fontSize: 11, marginLeft: 8 }}>+2 more</span>
              </td>
              <td>
                <span className="intg-status intg-status-green"><div className="intg-dot intg-dot-green"></div>Active</span>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={14} color="#10b981" />
                  <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>99.9%</span>
                </div>
              </td>
              <td><span className="intg-text-muted">Just now</span></td>
              <td style={{ textAlign: 'right' }}>
                <div className="intg-actions-cell" style={{ justifyContent: 'flex-end' }}>
                  <button className="intg-icon-btn"><Activity size={14} /></button>
                  <button className="intg-icon-btn"><MoreHorizontal size={14} /></button>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ background: '#f3f4f6', padding: 8, borderRadius: 8 }}><Webhook size={16} color="#4b5563" /></div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14, color: '#111827', marginBottom: 4 }}>Data Warehouse Sync</div>
                    <code style={{ fontSize: 11, color: '#6b7280' }}>https://ingest.snowflake...</code>
                  </div>
                </div>
              </td>
              <td>
                <span className="intg-badge intg-badge-blue">data.export_ready</span>
              </td>
              <td>
                <span className="intg-status intg-status-red"><div className="intg-dot intg-dot-red"></div>Failing</span>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <XCircle size={14} color="#ef4444" />
                  <span style={{ fontSize: 13, color: '#ef4444', fontWeight: 500 }}>64.2%</span>
                </div>
              </td>
              <td><span className="intg-text-muted">2 hrs ago</span></td>
              <td style={{ textAlign: 'right' }}>
                <div className="intg-actions-cell" style={{ justifyContent: 'flex-end' }}>
                  <button className="intg-icon-btn"><Activity size={14} /></button>
                  <button className="intg-icon-btn"><MoreHorizontal size={14} /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
