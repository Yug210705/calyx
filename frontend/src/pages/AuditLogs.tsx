import React, { useState } from 'react';
import { 
  Download, 
  Search, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight,
  Shield
} from 'lucide-react';
import './AuditLogs.css';

interface AuditEvent {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    email: string;
    avatar: string;
  };
  action: string;
  target: string;
  ipAddress: string;
  status: 'Success' | 'Failure';
}

const mockAuditLogs: AuditEvent[] = [
  {
    id: 'evt_8921a',
    timestamp: '2026-08-25 01:15:22 UTC',
    actor: { name: 'Sarah Chen', email: 'schen@atlas.io', avatar: 'https://i.pravatar.cc/150?u=schen' },
    action: 'Exported Project Data',
    target: 'prj_backend_migration_q3',
    ipAddress: '192.168.1.42',
    status: 'Success',
  },
  {
    id: 'evt_8921b',
    timestamp: '2026-08-25 00:42:10 UTC',
    actor: { name: 'Michael Rodriguez', email: 'mrodriguez@atlas.io', avatar: 'https://i.pravatar.cc/150?u=mrodriguez' },
    action: 'Changed Role',
    target: 'usr_david_kim -> Admin',
    ipAddress: '10.0.4.11',
    status: 'Success',
  },
  {
    id: 'evt_8921c',
    timestamp: '2026-08-24 23:14:05 UTC',
    actor: { name: 'System', email: 'system@atlas.io', avatar: 'https://i.pravatar.cc/150?u=system' },
    action: 'API Key Rotated',
    target: 'key_prod_billing_svc',
    ipAddress: 'Internal',
    status: 'Success',
  },
  {
    id: 'evt_8921d',
    timestamp: '2026-08-24 22:55:18 UTC',
    actor: { name: 'David Kim', email: 'dkim@atlas.io', avatar: 'https://i.pravatar.cc/150?u=dkim' },
    action: 'Failed Login Attempt',
    target: 'auth_service',
    ipAddress: '203.0.113.84',
    status: 'Failure',
  },
  {
    id: 'evt_8921e',
    timestamp: '2026-08-24 21:30:00 UTC',
    actor: { name: 'Elena Rostova', email: 'erostova@atlas.io', avatar: 'https://i.pravatar.cc/150?u=erostova' },
    action: 'Deleted Workspace',
    target: 'ws_legacy_marketing_2024',
    ipAddress: '198.51.100.12',
    status: 'Success',
  },
  {
    id: 'evt_8921f',
    timestamp: '2026-08-24 19:12:44 UTC',
    actor: { name: 'James Wilson', email: 'jwilson@atlas.io', avatar: 'https://i.pravatar.cc/150?u=jwilson' },
    action: 'Modified Security Settings',
    target: 'org_sso_config',
    ipAddress: '10.2.1.8',
    status: 'Success',
  },
  {
    id: 'evt_8921g',
    timestamp: '2026-08-24 18:05:31 UTC',
    actor: { name: 'Sarah Chen', email: 'schen@atlas.io', avatar: 'https://i.pravatar.cc/150?u=schen' },
    action: 'Accessed Billing Portal',
    target: 'billing_dashboard',
    ipAddress: '192.168.1.42',
    status: 'Success',
  },
  {
    id: 'evt_8921h',
    timestamp: '2026-08-24 16:22:15 UTC',
    actor: { name: 'Unknown User', email: 'N/A', avatar: 'https://i.pravatar.cc/150?u=unknown' },
    action: 'Invalid Token Access',
    target: 'api_v2_users',
    ipAddress: '45.33.22.11',
    status: 'Failure',
  }
];

export const AuditLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('All');
  const [dateRangeFilter, setDateRangeFilter] = useState('Last 24 Hours');

  // Basic client-side filtering
  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.actor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.target.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesType = true;
    if (eventTypeFilter !== 'All') {
       if (eventTypeFilter === 'Security') {
         matchesType = ['Changed Role', 'API Key Rotated', 'Failed Login Attempt', 'Modified Security Settings', 'Invalid Token Access'].includes(log.action);
       } else if (eventTypeFilter === 'Data') {
         matchesType = ['Exported Project Data', 'Deleted Workspace'].includes(log.action);
       } else if (eventTypeFilter === 'Access') {
         matchesType = ['Accessed Billing Portal'].includes(log.action);
       }
    }

    return matchesSearch && matchesType;
  });

  return (
    <div className="audit-logs-container">
      <div className="audit-header">
        <div>
          <h1 className="audit-header-title">
            <Shield className="audit-header-icon" size={28} />
            Security & Audit Logs
          </h1>
          <p className="audit-header-subtitle">
            Comprehensive compliance view of organizational activities and security events.
          </p>
        </div>
        <div className="audit-actions">
          <button className="btn-export">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label>Search Events</label>
          <div className="filter-input-wrapper">
            <Search className="filter-icon" size={16} />
            <input 
              type="text" 
              className="filter-input" 
              placeholder="Search user, action, target..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="filter-group">
          <label>Event Type</label>
          <div className="filter-input-wrapper">
            <Filter className="filter-icon" size={16} />
            <select 
              className="filter-select"
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
            >
              <option value="All">All Events</option>
              <option value="Security">Security & Access</option>
              <option value="Data">Data Operations</option>
              <option value="Access">System Access</option>
            </select>
          </div>
        </div>

        <div className="filter-group">
          <label>Date Range</label>
          <div className="filter-input-wrapper">
            <Calendar className="filter-icon" size={16} />
            <select 
              className="filter-select"
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value)}
            >
              <option value="Last 24 Hours">Last 24 Hours</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Custom Range">Custom Range...</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="audit-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Target / Resource</th>
              <th>IP Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id}>
                <td className="td-timestamp">{log.timestamp}</td>
                <td className="td-actor">
                  <img src={log.actor.avatar} alt={log.actor.name} className="actor-avatar" />
                  <div className="actor-info">
                    <span className="actor-name">{log.actor.name}</span>
                    <span className="actor-email">{log.actor.email}</span>
                  </div>
                </td>
                <td className="td-action">{log.action}</td>
                <td className="td-target">{log.target}</td>
                <td className="td-ip">{log.ipAddress}</td>
                <td>
                  <span className={`status-badge ${log.status === 'Success' ? 'status-success' : 'status-failure'}`}>
                    {log.status === 'Success' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="pagination">
          <div className="pagination-info">
            Showing 1 to {filteredLogs.length} of {filteredLogs.length} events
          </div>
          <div className="pagination-controls">
            <button className="btn-page" disabled><ChevronLeft size={16} /></button>
            <button className="btn-page" disabled><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};
