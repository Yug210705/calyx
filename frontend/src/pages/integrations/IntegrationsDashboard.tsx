import React, { useState } from 'react';
import { 
  Plug, 
  LayoutGrid, 
  CheckCircle2, 
  Clock, 
  Settings, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  MessageSquare,
  Database,
  FileText,
  Workflow,
  Zap,
  FolderSync
} from 'lucide-react';
import './IntegrationsDashboard.css';

export const IntegrationsDashboard = () => {
  const [automations, setAutomations] = useState({
    taskCreated: true,
    newIssue: true,
    fileUploaded: true
  });

  const toggleAutomation = (key: keyof typeof automations) => {
    setAutomations(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const SimpleIcon = ({ name, color, size = 24, overrideUrl }: { name: string, color: string, size?: number, overrideUrl?: string }) => (
    <img 
      src={overrideUrl || `https://cdn.simpleicons.org/${name}/${color.replace('#', '')}`} 
      style={{ width: size, height: size, objectFit: 'contain' }} 
      alt={name} 
    />
  );

  const popIntegrations = [
    { id: 1, name: 'Slack', category: 'Communication', desc: 'Send updates, notifications and collaborate with your team.', status: 'Connected', icon: <SimpleIcon name="slack" color="#E01E5A" overrideUrl="https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" />, color: '#E01E5A' },
    { id: 2, name: 'Google Drive', category: 'File Storage', desc: 'Store, share and manage files from Atlas.', status: 'Connected', icon: <SimpleIcon name="googledrive" color="#0F9D58" />, color: '#1FA463' },
    { id: 3, name: 'GitHub', category: 'DevOps', desc: 'Sync commits, PRs and issues with your projects.', status: 'Connected', icon: <SimpleIcon name="github" color="#181717" />, color: '#181717' },
    { id: 4, name: 'Jira', category: 'Project Management', desc: 'Create issues, track progress and stay aligned.', status: 'Connected', icon: <SimpleIcon name="jira" color="#0052CC" />, color: '#0052CC' },
    { id: 5, name: 'Microsoft Teams', category: 'Communication', desc: 'Receive alerts and collaborate within Teams.', status: 'Disconnected', icon: <SimpleIcon name="microsoftteams" color="#6264A7" overrideUrl="https://cdn.worldvectorlogo.com/logos/microsoft-teams-1.svg" />, color: '#6264A7' },
    { id: 6, name: 'Zapier', category: 'Automation', desc: 'Automate workflows and connect thousands of apps.', status: 'Disconnected', icon: <SimpleIcon name="zapier" color="#FF4A00" />, color: '#FF4A00' },
    { id: 7, name: 'Notion', category: 'Documentation', desc: 'Sync docs, tasks and knowledge with Notion.', status: 'Disconnected', icon: <SimpleIcon name="notion" color="#000000" />, color: '#000000' },
    { id: 8, name: 'Dropbox', category: 'File Storage', desc: 'Access and manage files from Dropbox.', status: 'Disconnected', icon: <SimpleIcon name="dropbox" color="#0061FF" />, color: '#0061FF' },
  ];

  const tableIntegrations = popIntegrations.slice(0, 6);

  return (
    <div className="intg-dash-layout">
      
      {/* MAIN COLUMN */}
      <div className="intg-dash-main">
        
        {/* Stats Grid */}
        <div className="intg-stats-grid">
          <div className="intg-stat-card">
            <div className="intg-stat-icon purple"><Plug size={20} /></div>
            <div className="intg-stat-info">
              <span className="intg-stat-label">Connected Integrations</span>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span className="intg-stat-val">12</span>
                <span className="intg-stat-trend"><ArrowUp size={12} /> 20% vs last month</span>
              </div>
            </div>
          </div>
          <div className="intg-stat-card">
            <div className="intg-stat-icon blue"><LayoutGrid size={20} /></div>
            <div className="intg-stat-info">
              <span className="intg-stat-label">Available Integrations</span>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span className="intg-stat-val">42</span>
                <span className="intg-stat-trend" style={{color: '#3B82F6'}}>+ 5 new this month</span>
              </div>
            </div>
          </div>
          <div className="intg-stat-card">
            <div className="intg-stat-icon green"><CheckCircle2 size={20} /></div>
            <div className="intg-stat-info">
              <span className="intg-stat-label">Successful Executions</span>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span className="intg-stat-val">1,248</span>
                <span className="intg-stat-trend"><ArrowUp size={12} /> 15% vs last month</span>
              </div>
            </div>
          </div>
          <div className="intg-stat-card">
            <div className="intg-stat-icon orange"><Clock size={20} /></div>
            <div className="intg-stat-info">
              <span className="intg-stat-label">Automations Run</span>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span className="intg-stat-val">326</span>
                <span className="intg-stat-trend"><ArrowUp size={12} /> 18% vs last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Integrations */}
        <div>
          <div className="intg-section-header">
            <h3 className="intg-section-title">Popular Integrations</h3>
            <button className="intg-section-link">View all</button>
          </div>
          <div className="intg-popular-grid">
            {popIntegrations.map(app => (
              <div key={app.id} className="intg-pop-card">
                <div className="intg-pop-top">
                  <div className="intg-pop-logo" style={{background: app.color + '15', color: app.color}}>{app.icon}</div>
                  <div>
                    <h4 className="intg-pop-name">{app.name}</h4>
                    <p className="intg-pop-cat">{app.category}</p>
                  </div>
                </div>
                <p className="intg-pop-desc">{app.desc}</p>
                <div className="intg-pop-footer">
                  <div className={`intg-status-badge ${app.status.toLowerCase()}`}>
                    <div className="intg-status-dot"></div>
                    {app.status}
                  </div>
                  {app.status === 'Connected' ? (
                    <button className="intg-btn-icon"><Settings size={14} /></button>
                  ) : (
                    <button className="intg-btn-connect">Connect</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Integrations Table */}
        <div>
          <div className="intg-section-header" style={{marginBottom: '0'}}>
            <h3 className="intg-section-title">All Integrations</h3>
            <div className="intg-table-filters">
              <select className="intg-filter-select">
                <option>All Categories</option>
                <option>Communication</option>
                <option>File Storage</option>
              </select>
              <select className="intg-filter-select">
                <option>Sort by: Popular</option>
                <option>Sort by: Name</option>
                <option>Sort by: Status</option>
              </select>
            </div>
          </div>
          
          <div className="intg-table-wrapper">
            <table className="intg-table">
              <thead>
                <tr>
                  <th>Integration</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Last Activity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableIntegrations.map(app => (
                  <tr key={app.id}>
                    <td>
                      <div className="intg-td-app">
                        <div className="intg-pop-logo" style={{width: 24, height: 24, fontSize: 12, borderRadius: 4, background: app.color + '15', color: app.color}}>{app.icon}</div>
                        {app.name}
                      </div>
                    </td>
                    <td>
                      <span className={`intg-cat-tag ${app.category.toLowerCase().split(' ')[0]}`}>{app.category}</span>
                    </td>
                    <td className="intg-td-desc">{app.desc}</td>
                    <td>
                      <div className={`intg-status-badge ${app.status.toLowerCase()}`}>
                        <div className="intg-status-dot"></div>
                        {app.status}
                      </div>
                    </td>
                    <td className="intg-td-activity">{app.status === 'Connected' ? Math.floor(Math.random() * 5) + 1 + ' hours ago' : '—'}</td>
                    <td>
                      <div className="intg-td-actions">
                        {app.status === 'Connected' ? (
                          <>
                            <button className="intg-btn-icon"><Settings size={14} /></button>
                            <button className="intg-btn-icon" style={{border: 'none', background: 'transparent'}}><MoreVertical size={16} /></button>
                          </>
                        ) : (
                          <>
                            <button className="intg-btn-connect">Connect</button>
                            <button className="intg-btn-icon" style={{border: 'none', background: 'transparent'}}><MoreVertical size={16} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="intg-table-footer">
              <span className="intg-table-info">Showing 1 to 5 of 42 integrations</span>
              <div className="intg-pagination">
                <button className="intg-page-btn"><ChevronLeft size={14} /></button>
                <button className="intg-page-btn active">1</button>
                <button className="intg-page-btn">2</button>
                <button className="intg-page-btn">3</button>
                <button className="intg-page-btn dots">...</button>
                <button className="intg-page-btn">9</button>
                <button className="intg-page-btn"><ChevronRight size={14} /></button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SIDEBAR COLUMN */}
      <div className="intg-dash-sidebar">
        
        {/* Connected Accounts */}
        <div className="intg-side-card">
          <div className="intg-side-header">
            <h3 className="intg-side-title">Connected Accounts</h3>
            <button className="intg-section-link">View all</button>
          </div>
          <div className="intg-acc-list">
            <div className="intg-acc-item">
              <div className="intg-acc-left">
                <div className="intg-acc-logo" style={{color: '#E01E5A'}}>S</div>
                <div className="intg-acc-info">
                  <span className="intg-acc-name">Slack</span>
                  <span className="intg-acc-email">acme-workspace.slack.com</span>
                </div>
              </div>
              <div className={`intg-status-badge connected`}>
                <div className="intg-status-dot"></div> Connected
              </div>
            </div>
            <div className="intg-acc-item">
              <div className="intg-acc-left">
                <div className="intg-acc-logo" style={{color: '#1FA463'}}>G</div>
                <div className="intg-acc-info">
                  <span className="intg-acc-name">Google Drive</span>
                  <span className="intg-acc-email">acme@company.com</span>
                </div>
              </div>
              <div className={`intg-status-badge connected`}>
                <div className="intg-status-dot"></div> Connected
              </div>
            </div>
            <div className="intg-acc-item">
              <div className="intg-acc-left">
                <div className="intg-acc-logo" style={{color: '#181717'}}>GH</div>
                <div className="intg-acc-info">
                  <span className="intg-acc-name">GitHub</span>
                  <span className="intg-acc-email">acme-corp</span>
                </div>
              </div>
              <div className={`intg-status-badge connected`}>
                <div className="intg-status-dot"></div> Connected
              </div>
            </div>
            <div className="intg-acc-item">
              <div className="intg-acc-left">
                <div className="intg-acc-logo" style={{color: '#0052CC'}}>J</div>
                <div className="intg-acc-info">
                  <span className="intg-acc-name">Jira</span>
                  <span className="intg-acc-email">acme.atlassian.net</span>
                </div>
              </div>
              <div className={`intg-status-badge connected`}>
                <div className="intg-status-dot"></div> Connected
              </div>
            </div>
            <div className="intg-acc-item">
              <div className="intg-acc-left">
                <div className="intg-acc-logo" style={{color: '#336791'}}>P</div>
                <div className="intg-acc-info">
                  <span className="intg-acc-name">PostgreSQL</span>
                  <span className="intg-acc-email">Primary Database</span>
                </div>
              </div>
              <div className={`intg-status-badge connected`}>
                <div className="intg-status-dot"></div> Connected
              </div>
            </div>
          </div>
          <a href="#" className="intg-side-footer-link">Manage all connections →</a>
        </div>

        {/* Automation Workflows */}
        <div className="intg-side-card">
          <div className="intg-side-header">
            <h3 className="intg-side-title">Automation Workflows</h3>
            <button className="intg-section-link">View all</button>
          </div>
          <div className="intg-auto-list">
            <div className="intg-auto-item">
              <div className="intg-auto-left">
                <div className="intg-auto-rule"><Zap size={14} /> Task created → Slack notification</div>
                <span className="intg-auto-meta">Runs 48 times • Last run 2 mins ago</span>
              </div>
              <label className="intg-toggle">
                <input type="checkbox" checked={automations.taskCreated} onChange={() => toggleAutomation('taskCreated')} />
                <span className="intg-slider"></span>
              </label>
            </div>
            <div className="intg-auto-item">
              <div className="intg-auto-left">
                <div className="intg-auto-rule"><Zap size={14} /> New issue in Jira → Create task</div>
                <span className="intg-auto-meta">Runs 32 times • Last run 15 mins ago</span>
              </div>
              <label className="intg-toggle">
                <input type="checkbox" checked={automations.newIssue} onChange={() => toggleAutomation('newIssue')} />
                <span className="intg-slider"></span>
              </label>
            </div>
            <div className="intg-auto-item">
              <div className="intg-auto-left">
                <div className="intg-auto-rule"><Zap size={14} /> File uploaded → Save to Drive</div>
                <span className="intg-auto-meta">Runs 66 times • Last run 1 hour ago</span>
              </div>
              <label className="intg-toggle">
                <input type="checkbox" checked={automations.fileUploaded} onChange={() => toggleAutomation('fileUploaded')} />
                <span className="intg-slider"></span>
              </label>
            </div>
          </div>
          <a href="#" className="intg-side-footer-link">Create automation →</a>
        </div>

        {/* Recent Activity */}
        <div className="intg-side-card">
          <div className="intg-side-header">
            <h3 className="intg-side-title">Recent Activity</h3>
            <button className="intg-section-link">View all</button>
          </div>
          <div className="intg-activity-list">
            <div className="intg-act-item">
              <div className="intg-act-icon" style={{color: '#10B981'}}><CheckCircle2 size={16} /></div>
              <div className="intg-act-content">
                <span className="intg-act-text">Slack connected</span>
                <span className="intg-act-meta">by Yug Pratap • 2 mins ago</span>
              </div>
            </div>
            <div className="intg-act-item">
              <div className="intg-act-icon" style={{color: '#F97316'}}><FolderSync size={16} /></div>
              <div className="intg-act-content">
                <span className="intg-act-text">New automation created</span>
                <span className="intg-act-meta">by Priya Sharma • 15 mins ago</span>
              </div>
            </div>
            <div className="intg-act-item">
              <div className="intg-act-icon" style={{color: '#3B82F6'}}><Workflow size={16} /></div>
              <div className="intg-act-content">
                <span className="intg-act-text">Jira integration updated</span>
                <span className="intg-act-meta">by Rohit Singh • 1 hour ago</span>
              </div>
            </div>
            <div className="intg-act-item">
              <div className="intg-act-icon" style={{color: '#10B981'}}><CheckCircle2 size={16} /></div>
              <div className="intg-act-content">
                <span className="intg-act-text">Google Drive reconnected</span>
                <span className="intg-act-meta">by System • 2 hours ago</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
