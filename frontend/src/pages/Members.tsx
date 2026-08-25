import React, { useState } from 'react';
import {
  Search, Plus, MoreHorizontal, X, UserPlus,
  Shield, User, Eye, Trash2, Edit3, Mail,
  Check, ChevronDown, Filter, MapPin, Calendar, Phone, Briefcase, Clock, Send
} from 'lucide-react';
import './Members.css';

/* ── Types ── */
interface Member {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'Member' | 'Guest';
  teams: string[];
  status: 'Active' | 'Invited';
  lastActive: string;
  department: string;
  location: string;
  phone: string;
  joinedDate: string;
}

const INITIAL: Member[] = [
  { id: 1, name: 'Eleanor Shellstrop', email: 'eleanor@atlas.inc', avatar: 'https://i.pravatar.cc/150?u=eleanor', role: 'Admin', teams: ['Engineering', 'Product'], status: 'Active', lastActive: 'Just now', department: 'Engineering', location: 'San Francisco, CA', phone: '+1 (555) 123-4567', joinedDate: 'Jan 15, 2024' },
  { id: 2, name: 'Chidi Anagonye', email: 'chidi@atlas.inc', avatar: 'https://i.pravatar.cc/150?u=chidi', role: 'Member', teams: ['Design'], status: 'Active', lastActive: '2 hours ago', department: 'Design', location: 'New York, NY', phone: '+1 (555) 987-6543', joinedDate: 'Mar 02, 2024' },
  { id: 3, name: 'Tahani Al-Jamil', email: 'tahani@atlas.inc', avatar: 'https://i.pravatar.cc/150?u=tahani', role: 'Member', teams: ['Marketing', 'Sales'], status: 'Active', lastActive: '1 day ago', department: 'Marketing', location: 'London, UK', phone: '+44 20 7123 4567', joinedDate: 'Jun 10, 2024' },
  { id: 4, name: 'Jason Mendoza', email: 'jason@atlas.inc', avatar: 'https://i.pravatar.cc/150?u=jason', role: 'Guest', teams: ['Contractors'], status: 'Invited', lastActive: 'Never', department: 'External', location: 'Jacksonville, FL', phone: '+1 (555) 321-7654', joinedDate: 'Pending' },
  { id: 5, name: 'Michael', email: 'michael@atlas.inc', avatar: 'https://i.pravatar.cc/150?u=michael', role: 'Admin', teams: ['Leadership'], status: 'Active', lastActive: '5 mins ago', department: 'Leadership', location: 'Seattle, WA', phone: '+1 (555) 555-5555', joinedDate: 'Jan 01, 2024' },
  { id: 6, name: 'Janet', email: 'janet@atlas.inc', avatar: 'https://i.pravatar.cc/150?u=janet', role: 'Admin', teams: ['Engineering', 'Ops'], status: 'Active', lastActive: 'Just now', department: 'Operations', location: 'Remote', phone: '+1 (555) 000-0000', joinedDate: 'Jan 01, 2024' },
  { id: 7, name: 'Simone Garnett', email: 'simone@atlas.inc', avatar: 'https://i.pravatar.cc/150?u=simone', role: 'Member', teams: ['Design', 'Frontend'], status: 'Active', lastActive: '3 hours ago', department: 'Design', location: 'Austin, TX', phone: '+1 (555) 111-2222', joinedDate: 'Aug 14, 2024' },
  { id: 8, name: 'Derek Hofstetler', email: 'derek@atlas.inc', avatar: 'https://i.pravatar.cc/150?u=derek', role: 'Guest', teams: ['QA'], status: 'Invited', lastActive: 'Never', department: 'Quality Assurance', location: 'Chicago, IL', phone: '+1 (555) 333-4444', joinedDate: 'Pending' },
];

/* ── Helpers ── */
const RoleBadge = ({ role }: { role: Member['role'] }) => {
  const cls = role === 'Admin' ? 'mb-role-admin' : role === 'Guest' ? 'mb-role-guest' : 'mb-role-member';
  const Icon = role === 'Admin' ? Shield : role === 'Guest' ? Eye : User;
  return <span className={`mb-role-badge ${cls}`}><Icon size={12} /> {role}</span>;
};

/* ── Toast ── */
interface Toast { id: number; text: string; }
const ToastBar = ({ toasts }: { toasts: Toast[] }) => (
  <div className="mb-toast-wrap">{toasts.map(t => <div key={t.id} className="mb-toast"><Check size={14} />{t.text}</div>)}</div>
);

/* ── Main ── */
export const Members = () => {
  const [members, setMembers] = useState<Member[]>(INITIAL);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showInvite, setShowInvite] = useState(false);
  const [menuId, setMenuId] = useState<number | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Member' as Member['role'], team: '' });

  const toast = (text: string) => {
    const id = Date.now();
    setToasts(p => [...p, { id, text }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  };

  const filtered = members.filter(m => {
    if (roleFilter !== 'all' && m.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.teams.some(t => t.toLowerCase().includes(q));
    }
    return true;
  });

  const handleInvite = () => {
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) return;
    const newMember: Member = {
      id: Date.now(), name: inviteForm.name, email: inviteForm.email,
      avatar: `https://i.pravatar.cc/150?u=${inviteForm.email}`,
      role: inviteForm.role, teams: inviteForm.team ? [inviteForm.team] : [],
      status: 'Invited', lastActive: 'Never',
      department: 'TBD', location: 'Remote', phone: '-', joinedDate: 'Pending'
    };
    setMembers(p => [newMember, ...p]);
    setShowInvite(false);
    setInviteForm({ name: '', email: '', role: 'Member', team: '' });
    toast(`Invitation sent to ${inviteForm.email}`);
  };

  const changeRole = (id: number, role: Member['role']) => {
    setMembers(p => p.map(m => m.id === id ? { ...m, role } : m));
    if (selectedMember?.id === id) setSelectedMember(p => p ? { ...p, role } : null);
    setMenuId(null);
    toast(`Role updated to ${role}`);
  };

  const removeMember = (id: number) => {
    const m = members.find(x => x.id === id);
    setMembers(p => p.filter(x => x.id !== id));
    if (selectedMember?.id === id) setSelectedMember(null);
    setMenuId(null);
    toast(`${m?.name} has been removed`);
  };

  const resendInvite = (id: number) => {
    const m = members.find(x => x.id === id);
    setMenuId(null);
    toast(`Invitation resent to ${m?.email}`);
  };

  const activateMember = (id: number) => {
    setMembers(p => p.map(m => m.id === id ? { ...m, status: 'Active', lastActive: 'Just now' } : m));
    if (selectedMember?.id === id) setSelectedMember(p => p ? { ...p, status: 'Active', lastActive: 'Just now' } : null);
    setMenuId(null);
    toast('Member activated');
  };

  const stats = {
    total: members.length,
    admins: members.filter(m => m.role === 'Admin').length,
    active: members.filter(m => m.status === 'Active').length,
    invited: members.filter(m => m.status === 'Invited').length,
  };

  return (
    <div className="mb-container">
      <div className={`mb-page custom-scrollbar ${selectedMember ? 'drawer-open' : ''}`} onClick={() => setMenuId(null)}>
        <ToastBar toasts={toasts} />

        {/* Header */}
        <div className="mb-header">
          <div className="mb-header-left">
            <h1 className="mb-title">Members</h1>
            <p className="mb-subtitle">Manage your organization's users and their roles.</p>
          </div>
          <div className="mb-header-right">
            <div className="mb-search">
              <Search size={15} />
              <input placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button className="mb-search-x" onClick={() => setSearch('')}><X size={13} /></button>}
            </div>
            <button className="mb-invite-btn" onClick={() => setShowInvite(true)}>
              <Plus size={15} /> Invite Members
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-stats">
          <div className="mb-stat"><span className="mb-stat-val">{stats.total}</span><span className="mb-stat-lbl">Total</span></div>
          <div className="mb-stat"><span className="mb-stat-val">{stats.admins}</span><span className="mb-stat-lbl">Admins</span></div>
          <div className="mb-stat"><span className="mb-stat-val">{stats.active}</span><span className="mb-stat-lbl">Active</span></div>
          <div className="mb-stat"><span className="mb-stat-val">{stats.invited}</span><span className="mb-stat-lbl">Invited</span></div>
        </div>

        {/* Filter */}
        <div className="mb-filter-bar">
          <div className="mb-filter-tabs">
            {['all', 'Admin', 'Member', 'Guest'].map(r => (
              <button key={r} className={`mb-ftab ${roleFilter === r ? 'active' : ''}`} onClick={() => setRoleFilter(r)}>
                {r === 'all' ? 'All Roles' : r}
              </button>
            ))}
          </div>
          <span className="mb-result-count">{filtered.length} {filtered.length === 1 ? 'member' : 'members'}</span>
        </div>

        {/* Table */}
        <div className="mb-table-wrap">
          <table className="mb-table">
            <thead>
              <tr>
                <th className="mb-th-user">USER</th>
                <th className="mb-th-role">ROLE</th>
                <th className="mb-th-teams">TEAMS</th>
                <th className="mb-th-status">STATUS</th>
                <th className="mb-th-last">LAST ACTIVE</th>
                <th className="mb-th-actions"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className={`mb-row ${selectedMember?.id === m.id ? 'selected' : ''}`} onClick={() => setSelectedMember(m)}>
                  <td className="mb-td-user">
                    <img src={m.avatar} alt="" className="mb-avatar" />
                    <div className="mb-user-info">
                      <span className="mb-user-name">{m.name}</span>
                      <span className="mb-user-email">{m.email}</span>
                    </div>
                  </td>
                  <td className="mb-td-role"><RoleBadge role={m.role} /></td>
                  <td className="mb-td-teams">
                    <div className="mb-team-pills">
                      {m.teams.slice(0, 2).map(t => <span key={t} className="mb-team-pill">{t}</span>)}
                      {m.teams.length > 2 && <span className="mb-team-more">+{m.teams.length - 2}</span>}
                    </div>
                  </td>
                  <td className="mb-td-status">
                    <span className={`mb-status ${m.status === 'Active' ? 'active' : 'invited'}`}>
                      <span className="mb-status-dot" /> {m.status}
                    </span>
                  </td>
                  <td className="mb-td-last">{m.lastActive}</td>
                  <td className="mb-td-actions">
                    <div className="mb-menu-wrap" onClick={e => e.stopPropagation()}>
                      <button className="mb-menu-btn" onClick={() => setMenuId(menuId === m.id ? null : m.id)}>
                        <MoreHorizontal size={16} />
                      </button>
                      {menuId === m.id && (
                        <div className="mb-dropdown">
                          <button onClick={() => changeRole(m.id, 'Admin')}><Shield size={14} /> Make Admin</button>
                          <button onClick={() => changeRole(m.id, 'Member')}><User size={14} /> Make Member</button>
                          <button onClick={() => changeRole(m.id, 'Guest')}><Eye size={14} /> Make Guest</button>
                          <div className="mb-drop-sep" />
                          {m.status === 'Invited' && <button onClick={() => resendInvite(m.id)}><Mail size={14} /> Resend Invite</button>}
                          {m.status === 'Invited' && <button onClick={() => activateMember(m.id)}><Check size={14} /> Activate</button>}
                          <button className="mb-drop-danger" onClick={() => removeMember(m.id)}><Trash2 size={14} /> Remove</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="mb-empty">No members match your search.</div>}
        </div>
      </div>

      {/* ── Details Drawer ── */}
      {selectedMember && (
        <div className="mb-drawer">
          <div className="mb-drawer-header">
            <h3>Employee Profile</h3>
            <button className="mb-drawer-close" onClick={() => setSelectedMember(null)}><X size={18} /></button>
          </div>
          <div className="mb-drawer-body custom-scrollbar">
            <div className="mb-drawer-profile">
              <img src={selectedMember.avatar} alt="" className="mb-drawer-avatar" />
              <h2 className="mb-drawer-name">{selectedMember.name}</h2>
              <p className="mb-drawer-email">{selectedMember.email}</p>
              <div className="mb-drawer-badges">
                <RoleBadge role={selectedMember.role} />
                <span className={`mb-status ${selectedMember.status === 'Active' ? 'active' : 'invited'}`}>
                  <span className="mb-status-dot" /> {selectedMember.status}
                </span>
              </div>
            </div>

            <div className="mb-drawer-section">
              <h4>Contact Information</h4>
              <div className="mb-drawer-info">
                <Mail size={16} /> <span>{selectedMember.email}</span>
              </div>
              <div className="mb-drawer-info">
                <Phone size={16} /> <span>{selectedMember.phone}</span>
              </div>
              <div className="mb-drawer-info">
                <MapPin size={16} /> <span>{selectedMember.location}</span>
              </div>
            </div>

            <div className="mb-drawer-section">
              <h4>Organization</h4>
              <div className="mb-drawer-info">
                <Briefcase size={16} /> <span>{selectedMember.department}</span>
              </div>
              <div className="mb-drawer-info">
                <Calendar size={16} /> <span>Joined {selectedMember.joinedDate}</span>
              </div>
              <div className="mb-drawer-info">
                <Clock size={16} /> <span>Last active: {selectedMember.lastActive}</span>
              </div>
            </div>

            <div className="mb-drawer-section">
              <h4>Teams</h4>
              <div className="mb-team-pills" style={{ marginTop: '8px' }}>
                {selectedMember.teams.length > 0 ? (
                  selectedMember.teams.map(t => <span key={t} className="mb-team-pill">{t}</span>)
                ) : (
                  <span className="mb-drawer-muted">No teams assigned</span>
                )}
              </div>
            </div>

            <div className="mb-drawer-actions">
              <button className="mb-drawer-btn" onClick={() => toast('Message sent')}><Mail size={16} /> Message</button>
              <button className="mb-drawer-btn" onClick={() => toast('Profile edited')}><Edit3 size={16} /> Edit Profile</button>
              {selectedMember.status === 'Invited' && <button className="mb-drawer-btn" onClick={() => resendInvite(selectedMember.id)}><Mail size={16} /> Resend Invite</button>}
              <button className="mb-drawer-btn danger" onClick={() => removeMember(selectedMember.id)}><Trash2 size={16} /> Remove Member</button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <div className="mb-overlay" onClick={() => setShowInvite(false)}>
          <div className="mb-modal" onClick={e => e.stopPropagation()}>
            <div className="mb-modal-header">
              <h2><UserPlus size={20} /> Invite Members</h2>
              <button className="mb-modal-close" onClick={() => setShowInvite(false)}><X size={20} /></button>
            </div>
            <div className="mb-modal-body">
              <div className="mb-modal-row">
                <div className="mb-field"><label>Full Name <span className="req">*</span></label><input placeholder="e.g. Sarah Jenkins" value={inviteForm.name} onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })} autoFocus /></div>
                <div className="mb-field"><label>Email <span className="req">*</span></label><input placeholder="e.g. sarah@company.com" value={inviteForm.email} onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })} /></div>
              </div>
              <div className="mb-modal-row">
                <div className="mb-field">
                  <label>Role</label>
                  <select value={inviteForm.role} onChange={e => setInviteForm({ ...inviteForm, role: e.target.value as Member['role'] })}>
                    <option value="Admin">Admin</option><option value="Member">Member</option><option value="Guest">Guest</option>
                  </select>
                </div>
                <div className="mb-field"><label>Team</label><input placeholder="e.g. Engineering" value={inviteForm.team} onChange={e => setInviteForm({ ...inviteForm, team: e.target.value })} /></div>
              </div>
            </div>
            <div className="mb-modal-footer">
              <button className="mb-modal-cancel" onClick={() => setShowInvite(false)}>Cancel</button>
              <button className="mb-modal-send" disabled={!inviteForm.name.trim() || !inviteForm.email.trim()} onClick={handleInvite}>
                <Send size={14} /> Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
