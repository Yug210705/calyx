import { useState } from 'react';
import { 
  Search, 
  HelpCircle,
  User,
  Sliders,
  Globe,
  Clock,
  Lock,
  Palette,
  Layout,
  LayoutTemplate,
  List,
  Calendar,
  Building,
  Users,
  Settings as SettingsIcon,
  Download,
  Key,
  Webhook,
  FileText,
  Trash2,
  Camera,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import './Settings.css';

export const Settings = () => {
  const [activeTopTab, setActiveTopTab] = useState('General');
  const [activeSideTab, setActiveSideTab] = useState('Profile');

  // Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'Yug Pratap',
    email: 'yug.pratap@acme.com',
    jobTitle: 'Administrator',
    department: 'Product',
    phone: '+91 98765 43210'
  });

  // Preferences State
  const [preferences, setPreferences] = useState({
    defaultDashboard: 'Overview',
    defaultProjectView: 'Board',
    itemsPerPage: '25',
    weekStartsOn: 'Monday',
    timeFormat: '12-hour (AM/PM)'
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePreferenceChange = (key: string, value: string) => {
    setPreferences({ ...preferences, [key]: value });
  };

  const topTabs = ['General', 'Workspace', 'Members & Teams', 'Billing', 'Security', 'Notifications', 'API & Webhooks', 'Advanced'];
  const sideTabs = [
    { name: 'Profile', icon: User },
    { name: 'Preferences', icon: Sliders },
    { name: 'Language & Region', icon: Globe },
    { name: 'Time & Date', icon: Clock },
    { name: 'Privacy', icon: Lock },
    { name: 'Appearance', icon: Palette }
  ];

  return (
    <div className="set-page-wrapper">
      
      {/* Global Page Header */}
      <div className="global-page-header">
        <div className="global-page-header-left">
          <h1 className="set-page-title">Settings</h1>
          <p className="set-page-subtitle">Manage your workspace, preferences, and account settings.</p>
        </div>
        <div className="global-page-header-right">
          <div className="set-search-box">
            <Search className="set-search-icon" size={16} />
            <input type="text" placeholder="Search settings..." />
          </div>
          <button className="set-btn-outline">
            <HelpCircle size={14} /> Need help?
          </button>
        </div>
      </div>

      {/* Top Tabs */}
      <div className="set-top-tabs">
        {topTabs.map(tab => (
          <button 
            key={tab} 
            className={`set-top-tab ${activeTopTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTopTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Layout Split */}
      <div className="set-main-layout">
        
        {/* Left Side Nav */}
        <div className="set-side-nav">
          {sideTabs.map(tab => (
            <button 
              key={tab.name}
              className={`set-side-tab ${activeSideTab === tab.name ? 'active' : ''}`}
              onClick={() => setActiveSideTab(tab.name)}
            >
              <tab.icon size={16} /> {tab.name}
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="set-content-area">
          
          {activeTopTab === 'General' && activeSideTab === 'Appearance' ? (
            <div className="set-card" style={{ gridColumn: '1 / -1' }}>
              <div className="set-card-header">
                <div>
                  <h2 className="set-card-title">Appearance Settings</h2>
                  <p className="set-card-subtitle">Customize the look and feel of your Atlas workspace.</p>
                </div>
              </div>
              <div style={{ padding: '24px 0' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>THEME SELECTION</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                  {[
                    { id: 'light', name: 'Light (Default)', colors: ['#ffffff', '#6366f1'] },
                    { id: 'dark', name: 'Dark Mode', colors: ['#1f2937', '#9ca3af'] },
                    { id: 'corporate', name: 'Corporate Blue', colors: ['#f8fafc', '#0284c7'] },
                    { id: 'ocean', name: 'Ocean Teal', colors: ['#f0fdfa', '#0d9488'] },
                    { id: 'sunset', name: 'Sunset Orange', colors: ['#fff7ed', '#f97316'] },
                    { id: 'rose', name: 'Rose Pink', colors: ['#fff1f2', '#e11d48'] },
                    { id: 'emerald', name: 'Emerald Green', colors: ['#ecfdf5', '#059669'] },
                    { id: 'midnight', name: 'Midnight Deep', colors: ['#0f172a', '#818cf8'] },
                    { id: 'dracula', name: 'Dracula', colors: ['#282a36', '#ff79c6'] },
                    { id: 'monochrome', name: 'Monochrome', colors: ['#ffffff', '#171717'] },
                    { id: 'solarized', name: 'Solarized Light', colors: ['#fdf6e3', '#268bd2'] }
                  ].map(theme => (
                    <button 
                      key={theme.id}
                      onClick={() => {
                        localStorage.setItem('atlas_theme', theme.id);
                        if (theme.id === 'light') {
                          document.documentElement.removeAttribute('data-theme');
                        } else {
                          document.documentElement.setAttribute('data-theme', theme.id);
                        }
                      }}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                        padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px',
                        background: 'var(--card-bg)', cursor: 'pointer', transition: 'all 0.2s',
                        textAlign: 'left'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                      onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    >
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: theme.colors[0], border: '1px solid #e5e7eb' }}></div>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: theme.colors[1] }}></div>
                      </div>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '14px' }}>{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (activeTopTab !== 'General' || activeSideTab !== 'Profile') ? (
            <div className="set-card" style={{ gridColumn: '1 / -1' }}>
              <div className="set-card-header">
                <div>
                  <h2 className="set-card-title">{activeTopTab} &gt; {activeSideTab} Settings</h2>
                  <p className="set-card-subtitle">These settings are currently being built.</p>
                </div>
              </div>
              <div style={{ padding: '40px 0', textAlign: 'center', color: '#6b7280' }}>
                <SettingsIcon size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
                <p>This section is under construction.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Row 1 */}
              {/* Profile Information */}
              <div className="set-card">
                <div className="set-card-header">
                  <div>
                    <h2 className="set-card-title">Profile Information</h2>
                    <p className="set-card-subtitle">Update your personal information and profile details.</p>
                  </div>
                  <button 
                    className={`set-btn-outline ${isEditingProfile ? 'text-primary' : ''}`}
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                  >
                    {isEditingProfile ? 'Save Profile' : 'Edit Profile'}
                  </button>
                </div>
                <div className="set-profile-grid">
                  <div className="set-avatar-wrapper">
                    <img src="https://i.pravatar.cc/150?u=yugpratap" alt="Yug Pratap" className="set-avatar" />
                    <button className="set-avatar-badge"><Camera size={12} /></button>
                  </div>
                  <div className="set-profile-details">
                    <div className="set-detail-row">
                      <span className="set-detail-label">Full Name</span>
                      {isEditingProfile ? (
                        <input className="set-edit-input" name="fullName" value={profileData.fullName} onChange={handleProfileChange} />
                      ) : (
                        <span className="set-detail-value">{profileData.fullName}</span>
                      )}
                    </div>
                    <div className="set-detail-row">
                      <span className="set-detail-label">Email Address</span>
                      {isEditingProfile ? (
                        <input className="set-edit-input" name="email" value={profileData.email} onChange={handleProfileChange} />
                      ) : (
                        <span className="set-detail-value">{profileData.email}</span>
                      )}
                    </div>
                    <div className="set-detail-row">
                      <span className="set-detail-label">Job Title</span>
                      {isEditingProfile ? (
                        <input className="set-edit-input" name="jobTitle" value={profileData.jobTitle} onChange={handleProfileChange} />
                      ) : (
                        <span className="set-detail-value">{profileData.jobTitle}</span>
                      )}
                    </div>
                    <div className="set-detail-row">
                      <span className="set-detail-label">Department</span>
                      {isEditingProfile ? (
                        <input className="set-edit-input" name="department" value={profileData.department} onChange={handleProfileChange} />
                      ) : (
                        <span className="set-detail-value">{profileData.department}</span>
                      )}
                    </div>
                    <div className="set-detail-row">
                      <span className="set-detail-label">Phone</span>
                      {isEditingProfile ? (
                        <input className="set-edit-input" name="phone" value={profileData.phone} onChange={handleProfileChange} />
                      ) : (
                        <span className="set-detail-value">{profileData.phone}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Summary */}
              <div className="set-card">
                <h2 className="set-card-title mb-16">Account Summary</h2>
                <div className="set-summary-grid">
                  <div className="set-detail-row">
                    <span className="set-detail-label">Plan</span>
                    <span className="set-detail-value">Enterprise</span>
                  </div>
                  <div className="set-detail-row">
                    <span className="set-detail-label">Member Role</span>
                    <span className="set-detail-value">Administrator</span>
                  </div>
                  <div className="set-detail-row">
                    <span className="set-detail-label">Workspace</span>
                    <span className="set-detail-value">Acme Corporation</span>
                  </div>
                  <div className="set-detail-row">
                    <span className="set-detail-label">Member Since</span>
                    <span className="set-detail-value">Jan 12, 2024</span>
                  </div>
                </div>
                <button className="set-btn-outline w-full mt-16 text-primary">View Account Details</button>
              </div>

              {/* Row 2 */}
              {/* Preferences */}
              <div className="set-card">
                <div className="set-card-header">
                  <div>
                    <h2 className="set-card-title">Preferences</h2>
                    <p className="set-card-subtitle">Customize your experience and default preferences.</p>
                  </div>
                  <button className="set-btn-outline">Manage Preferences</button>
                </div>
                <div className="set-list">
                  <div className="set-list-item">
                    <div className="set-li-left">
                      <Layout className="set-li-icon" size={16} />
                      <div>
                        <div className="set-li-title">Default Dashboard</div>
                        <div className="set-li-desc">Choose what you see when you log in.</div>
                      </div>
                    </div>
                    <div className="set-li-right">
                      <select 
                        className="set-native-select" 
                        value={preferences.defaultDashboard}
                        onChange={e => handlePreferenceChange('defaultDashboard', e.target.value)}
                      >
                        <option>Overview</option>
                        <option>Projects</option>
                        <option>Tasks</option>
                        <option>Reports</option>
                      </select>
                    </div>
                  </div>
                  <div className="set-list-item">
                    <div className="set-li-left">
                      <LayoutTemplate className="set-li-icon" size={16} />
                      <div>
                        <div className="set-li-title">Default Project View</div>
                        <div className="set-li-desc">Choose the default view for projects.</div>
                      </div>
                    </div>
                    <div className="set-li-right">
                      <select 
                        className="set-native-select" 
                        value={preferences.defaultProjectView}
                        onChange={e => handlePreferenceChange('defaultProjectView', e.target.value)}
                      >
                        <option>Board</option>
                        <option>List</option>
                        <option>Timeline</option>
                        <option>Calendar</option>
                      </select>
                    </div>
                  </div>
                  <div className="set-list-item">
                    <div className="set-li-left">
                      <List className="set-li-icon" size={16} />
                      <div>
                        <div className="set-li-title">Items Per Page</div>
                        <div className="set-li-desc">Set the number of items to display per page.</div>
                      </div>
                    </div>
                    <div className="set-li-right">
                      <select 
                        className="set-native-select" 
                        value={preferences.itemsPerPage}
                        onChange={e => handlePreferenceChange('itemsPerPage', e.target.value)}
                      >
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                      </select>
                    </div>
                  </div>
                  <div className="set-list-item">
                    <div className="set-li-left">
                      <Calendar className="set-li-icon" size={16} />
                      <div>
                        <div className="set-li-title">Week Starts On</div>
                        <div className="set-li-desc">Choose the first day of the week.</div>
                      </div>
                    </div>
                    <div className="set-li-right">
                      <select 
                        className="set-native-select" 
                        value={preferences.weekStartsOn}
                        onChange={e => handlePreferenceChange('weekStartsOn', e.target.value)}
                      >
                        <option>Monday</option>
                        <option>Sunday</option>
                        <option>Saturday</option>
                      </select>
                    </div>
                  </div>
                  <div className="set-list-item">
                    <div className="set-li-left">
                      <Clock className="set-li-icon" size={16} />
                      <div>
                        <div className="set-li-title">Time Format</div>
                        <div className="set-li-desc">Choose your preferred time format.</div>
                      </div>
                    </div>
                    <div className="set-li-right">
                      <select 
                        className="set-native-select" 
                        value={preferences.timeFormat}
                        onChange={e => handlePreferenceChange('timeFormat', e.target.value)}
                      >
                        <option>12-hour (AM/PM)</option>
                        <option>24-hour</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Status */}
              <div className="set-card">
                <h2 className="set-card-title mb-16">Security Status</h2>
                <div className="set-list">
                  <div className="set-list-item no-padding-top">
                    <div className="set-li-left">
                      <ShieldCheck className="set-li-icon color-green bg-green-light" size={18} />
                      <div>
                        <div className="set-li-title color-green">Good</div>
                        <div className="set-li-desc">Your account is secure</div>
                      </div>
                    </div>
                  </div>
                  <div className="set-list-item">
                    <div className="set-li-left">
                      <CheckCircle2 className="set-li-icon color-green" size={16} />
                      <div>
                        <div className="set-li-title">Password</div>
                        <div className="set-li-desc">Last changed 24 days ago</div>
                      </div>
                    </div>
                    <a href="#" className="set-link">Change</a>
                  </div>
                  <div className="set-list-item">
                    <div className="set-li-left">
                      <CheckCircle2 className="set-li-icon color-green" size={16} />
                      <div>
                        <div className="set-li-title">Two-Factor Authentication</div>
                        <div className="set-li-desc">Enabled</div>
                      </div>
                    </div>
                    <a href="#" className="set-link">Manage</a>
                  </div>
                  <div className="set-list-item">
                    <div className="set-li-left">
                      <CheckCircle2 className="set-li-icon color-green" size={16} />
                      <div>
                        <div className="set-li-title">Active Sessions</div>
                        <div className="set-li-desc">2 active sessions</div>
                      </div>
                    </div>
                    <a href="#" className="set-link">View</a>
                  </div>
                  <div className="set-list-item border-none pb-0">
                    <div className="set-li-left">
                      <CheckCircle2 className="set-li-icon color-green" size={16} />
                      <div>
                        <div className="set-li-title">Login Activity</div>
                        <div className="set-li-desc">No suspicious activity</div>
                      </div>
                    </div>
                    <a href="#" className="set-link">View</a>
                  </div>
                </div>
              </div>

              {/* Row 3 */}
              {/* Workspace Settings */}
              <div className="set-card">
                <div className="set-card-header">
                  <div>
                    <h2 className="set-card-title">Workspace Settings</h2>
                    <p className="set-card-subtitle">Manage settings that apply to your entire workspace.</p>
                  </div>
                  <button className="set-btn-outline">Go to Workspace Settings</button>
                </div>
                <div className="set-list">
                  <div className="set-list-item clickable">
                    <div className="set-li-left">
                      <Building className="set-li-icon" size={16} />
                      <div>
                        <div className="set-li-title">Workspace Profile</div>
                        <div className="set-li-desc">Update workspace name, logo and details</div>
                      </div>
                    </div>
                    <ChevronRight className="set-chevron" size={16} />
                  </div>
                  <div className="set-list-item clickable">
                    <div className="set-li-left">
                      <Users className="set-li-icon" size={16} />
                      <div>
                        <div className="set-li-title">Workspace Permissions</div>
                        <div className="set-li-desc">Manage who can create projects, invite members, etc.</div>
                      </div>
                    </div>
                    <ChevronRight className="set-chevron" size={16} />
                  </div>
                  <div className="set-list-item clickable">
                    <div className="set-li-left">
                      <SettingsIcon className="set-li-icon" size={16} />
                      <div>
                        <div className="set-li-title">Project Settings</div>
                        <div className="set-li-desc">Configure default project settings and templates</div>
                      </div>
                    </div>
                    <ChevronRight className="set-chevron" size={16} />
                  </div>
                  <div className="set-list-item clickable border-none">
                    <div className="set-li-left">
                      <Download className="set-li-icon" size={16} />
                      <div>
                        <div className="set-li-title">Data Export</div>
                        <div className="set-li-desc">Export your workspace data and reports</div>
                      </div>
                    </div>
                    <ChevronRight className="set-chevron" size={16} />
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="set-card">
                <h2 className="set-card-title mb-16">Quick Links</h2>
                <div className="set-list">
                  <div className="set-list-item clickable compact">
                    <div className="set-li-left">
                      <Key className="set-li-icon" size={16} />
                      <div className="set-li-title">Manage API Keys</div>
                    </div>
                    <ChevronRight className="set-chevron" size={16} />
                  </div>
                  <div className="set-list-item clickable compact">
                    <div className="set-li-left">
                      <Webhook className="set-li-icon" size={16} />
                      <div className="set-li-title">Webhooks</div>
                    </div>
                    <ChevronRight className="set-chevron" size={16} />
                  </div>
                  <div className="set-list-item clickable compact">
                    <div className="set-li-left">
                      <FileText className="set-li-icon" size={16} />
                      <div className="set-li-title">Audit Logs</div>
                    </div>
                    <ChevronRight className="set-chevron" size={16} />
                  </div>
                  <div className="set-list-item clickable compact border-none pb-0">
                    <div className="set-li-left color-red">
                      <Trash2 className="set-li-icon color-red" size={16} />
                      <div className="set-li-title color-red">Delete Account</div>
                    </div>
                    <ChevronRight className="set-chevron" size={16} />
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
