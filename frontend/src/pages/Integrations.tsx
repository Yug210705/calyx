import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Code, 
  Plus, 
  Plug,
  CheckCircle2,
  AlertTriangle,
  Download,
  ChevronDown,
  LayoutGrid
} from 'lucide-react';
import './Integrations.css';
import { IntegrationsOverview } from './integrations/IntegrationsOverview';
import { IntegrationsConnected } from './integrations/IntegrationsConnected';
import { IntegrationsAvailable } from './integrations/IntegrationsAvailable';
import { IntegrationsCustom } from './integrations/IntegrationsCustom';
import { IntegrationsWebhooks } from './integrations/IntegrationsWebhooks';
import { IntegrationsDashboard } from './integrations/IntegrationsDashboard';

export const Integrations = () => {
  const [activeTab, setActiveTab] = useState('All Integrations');
  const [selectedCat, setSelectedCat] = useState('All Categories');
  const [showCat, setShowCat] = useState(false);
  const tabs = ['All Integrations', 'Connected', 'Available', 'Custom Integrations', 'Webhooks'];
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'All Integrations':
        return <IntegrationsOverview />;
      case 'Connected':
        return <IntegrationsConnected />;
      case 'Available':
        return <IntegrationsAvailable />;
      case 'Custom Integrations':
        return <IntegrationsCustom />;
      case 'Webhooks':
        return <IntegrationsWebhooks />;
      default:
        return <IntegrationsOverview />;
    }
  };

  return (
    <div className="intg-container">
      
      {/* Header */}
      <div className="global-page-header">
        <div className="global-page-header-left">
          <h1>Integrations</h1>
          <p>Connect Atlas with the tools your team uses every day.</p>
        </div>
        <div className="global-page-header-right">
          {/* Action buttons only */}
          <button className="intg-btn-outline" onClick={() => alert('API Documentation is currently being updated. Please check back later!')}>
            <Code size={14} /> View API Docs
          </button>
          <button className="intg-btn-primary">
            <Plus size={16} /> Add Integration
          </button>
        </div>
      </div>

      {/* Tabs & Search/Category Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #E5E7EB', paddingBottom: '16px' }}>
        <div className="intg-tabs" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
          {tabs.map(t => (
            <button 
              key={t}
              className={`intg-tab ${activeTab === t ? 'intg-tab-active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="intg-search-box" style={{ width: '240px', background: '#FFFFFF' }}>
            <Search size={14} />
            <input type="text" placeholder="Search integrations..." />
          </div>
          <div style={{ position: 'relative' }}>
            <button className="intg-btn-outline" onClick={() => setShowCat(!showCat)}>
              <LayoutGrid size={14} /> 
              {selectedCat} 
              <ChevronDown size={14} />
            </button>
            {showCat && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, width: '220px', overflow: 'hidden' }}>
                {['All Categories', 'Communication Dashboard'].map(c => (
                  <div 
                    key={c}
                    onClick={() => { setSelectedCat(c); setShowCat(false); }}
                    style={{ padding: '10px 16px', fontSize: '13px', cursor: 'pointer', background: c === selectedCat ? '#F3F4F6' : 'white', fontWeight: c === selectedCat ? 600 : 400 }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedCat === 'Communication Dashboard' ? (
        <IntegrationsDashboard />
      ) : (
        <>
          {/* KPIs */}
      <div className="intg-kpi-row">
        <div className="intg-kpi-card">
          <div className="intg-kpi-icon-box intg-kpi-purple">
            <Plug size={24} />
          </div>
          <div className="intg-kpi-content">
            <span className="intg-kpi-title">Connected Integrations</span>
            <span className="intg-kpi-value">12</span>
            <span className="intg-kpi-trend"><span className="intg-trend-up">↑ 2</span> this month</span>
          </div>
        </div>

        <div className="intg-kpi-card">
          <div className="intg-kpi-icon-box intg-kpi-green">
            <CheckCircle2 size={24} />
          </div>
          <div className="intg-kpi-content">
            <span className="intg-kpi-title">Active Connections</span>
            <span className="intg-kpi-value">24</span>
            <span className="intg-kpi-trend"><span className="intg-trend-up">↑ 8</span> this month</span>
          </div>
        </div>

        <div className="intg-kpi-card">
          <div className="intg-kpi-icon-box intg-kpi-orange">
            <AlertTriangle size={24} />
          </div>
          <div className="intg-kpi-content">
            <span className="intg-kpi-title">Connection Issues</span>
            <span className="intg-kpi-value">2</span>
            <span className="intg-kpi-trend"><a className="intg-trend-link">View issues</a></span>
          </div>
        </div>

        <div className="intg-kpi-card">
          <div className="intg-kpi-icon-box intg-kpi-blue">
            <Download size={24} />
          </div>
          <div className="intg-kpi-content">
            <span className="intg-kpi-title">Total API Calls (30d)</span>
            <span className="intg-kpi-value">128,540</span>
            <span className="intg-kpi-trend"><span className="intg-trend-up">↑ 15%</span> vs last 30 days</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="intg-main-content">
        {renderTabContent()}
      </div>
      </>
      )}
    </div>
  );
};
