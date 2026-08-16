import React from 'react';
import { Key, Copy, Eye, Plus, Terminal, ArrowRight, MoreHorizontal } from 'lucide-react';

export const IntegrationsCustom = () => {
  return (
    <div className="intg-custom-tab">
      <div className="intg-header-area" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 32px 0' }}>
        <div>
          <h2 className="intg-table-title" style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>Custom Integrations & API Keys</h2>
          <p className="intg-text-muted" style={{ margin: 0, fontSize: 14 }}>Build your own internal tools using the Atlas REST API.</p>
        </div>
        <button className="intg-btn-primary">
          <Plus size={16} /> Generate API Key
        </button>
      </div>

      <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 12, padding: 24, marginBottom: 32, display: 'flex', gap: 24, alignItems: 'center' }}>
        <div style={{ width: 48, height: 48, background: '#ede9fe', color: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Terminal size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: 16, color: '#111827', fontWeight: 600 }}>Developer Documentation</h3>
          <p style={{ margin: 0, fontSize: 13, color: '#4b5563' }}>Explore guides, reference material, and tutorials to integrate your tools with Atlas.</p>
        </div>
        <button className="intg-btn-outline" style={{ background: '#fff' }}>
          Read the Docs <ArrowRight size={14} style={{ marginLeft: 4 }} />
        </button>
      </div>

      <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, color: '#111827' }}>Active API Keys</h3>
      
      <div className="intg-table-wrapper">
        <table className="intg-table">
          <thead>
            <tr>
              <th style={{ width: '25%' }}>Key Name</th>
              <th style={{ width: '35%' }}>Token</th>
              <th style={{ width: '15%' }}>Permissions</th>
              <th style={{ width: '15%' }}>Created</th>
              <th style={{ width: '10%', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ background: '#f3f4f6', padding: 8, borderRadius: 8 }}><Key size={16} color="#4b5563" /></div>
                  <span style={{ fontWeight: 500, fontSize: 14, color: '#111827' }}>Production Sync</span>
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <code style={{ background: '#f9fafb', padding: '4px 8px', borderRadius: 6, fontSize: 12, border: '1px solid #e5e7eb', color: '#374151', fontFamily: 'monospace' }}>atls_prod_a8f9c2...e81</code>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><Copy size={14} /></button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><Eye size={14} /></button>
                </div>
              </td>
              <td><span className="intg-badge intg-badge-blue">Full Access</span></td>
              <td><span className="intg-text-muted">Oct 12, 2023</span></td>
              <td style={{ textAlign: 'right' }}>
                <button className="intg-icon-btn" style={{ marginLeft: 'auto' }}><MoreHorizontal size={14} /></button>
              </td>
            </tr>
            <tr>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ background: '#f3f4f6', padding: 8, borderRadius: 8 }}><Key size={16} color="#4b5563" /></div>
                  <span style={{ fontWeight: 500, fontSize: 14, color: '#111827' }}>Staging Testing</span>
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <code style={{ background: '#f9fafb', padding: '4px 8px', borderRadius: 6, fontSize: 12, border: '1px solid #e5e7eb', color: '#374151', fontFamily: 'monospace' }}>atls_test_b412x9...4ff</code>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><Copy size={14} /></button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><Eye size={14} /></button>
                </div>
              </td>
              <td><span className="intg-badge intg-badge-purple">Read Only</span></td>
              <td><span className="intg-text-muted">Jan 05, 2024</span></td>
              <td style={{ textAlign: 'right' }}>
                <button className="intg-icon-btn" style={{ marginLeft: 'auto' }}><MoreHorizontal size={14} /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};
