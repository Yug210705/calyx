import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, Shield, User, Clock, CheckCircle2, ChevronDown } from 'lucide-react';
import './Members.css';

interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'Member' | 'Guest';
  teams: string[];
  status: 'Active' | 'Invited';
  lastActive: string;
}

const mockMembers: Member[] = [
  {
    id: 'usr_1',
    name: 'Eleanor Shellstrop',
    email: 'eleanor@atlas.inc',
    avatar: 'https://i.pravatar.cc/150?u=eleanor',
    role: 'Admin',
    teams: ['Engineering', 'Product'],
    status: 'Active',
    lastActive: 'Just now',
  },
  {
    id: 'usr_2',
    name: 'Chidi Anagonye',
    email: 'chidi@atlas.inc',
    avatar: 'https://i.pravatar.cc/150?u=chidi',
    role: 'Member',
    teams: ['Design'],
    status: 'Active',
    lastActive: '2 hours ago',
  },
  {
    id: 'usr_3',
    name: 'Tahani Al-Jamil',
    email: 'tahani@atlas.inc',
    avatar: 'https://i.pravatar.cc/150?u=tahani',
    role: 'Member',
    teams: ['Marketing', 'Sales'],
    status: 'Active',
    lastActive: '1 day ago',
  },
  {
    id: 'usr_4',
    name: 'Jason Mendoza',
    email: 'jason@atlas.inc',
    avatar: 'https://i.pravatar.cc/150?u=jason',
    role: 'Guest',
    teams: ['Contractors'],
    status: 'Invited',
    lastActive: 'Never',
  },
  {
    id: 'usr_5',
    name: 'Michael',
    email: 'michael@atlas.inc',
    avatar: 'https://i.pravatar.cc/150?u=michael',
    role: 'Admin',
    teams: ['Leadership'],
    status: 'Active',
    lastActive: '5 mins ago',
  },
  {
    id: 'usr_6',
    name: 'Janet',
    email: 'janet@atlas.inc',
    avatar: 'https://i.pravatar.cc/150?u=janet',
    role: 'Admin',
    teams: ['Engineering', 'Ops', 'Support'],
    status: 'Active',
    lastActive: 'Just now',
  }
];

export const Members = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = mockMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="members-container">
      <div className="members-header">
        <div className="members-header-title">
          <h1>Members</h1>
          <p>Manage your organization's users and their roles.</p>
        </div>
        <div className="members-header-actions">
          <div className="members-search-wrapper">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="members-search-input"
            />
          </div>
          <button className="invite-btn">
            <Plus size={16} />
            Invite Members
          </button>
        </div>
      </div>

      <div className="members-table-container">
        <table className="members-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Teams</th>
              <th>Status</th>
              <th>Last Active</th>
              <th className="actions-cell"></th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.id} className="member-row">
                <td>
                  <div className="user-cell">
                    <img src={member.avatar} alt={member.name} className="user-avatar" />
                    <div className="user-details">
                      <span className="user-name">{member.name}</span>
                      <span className="user-email">{member.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={`role-badge role-${member.role.toLowerCase()}`}>
                    {member.role === 'Admin' && <Shield size={14} />}
                    {member.role === 'Member' && <User size={14} />}
                    {member.role === 'Guest' && <Clock size={14} />}
                    {member.role}
                  </div>
                </td>
                <td>
                  <div className="teams-cell">
                    {member.teams.slice(0, 2).map(team => (
                      <span key={team} className="team-pill">{team}</span>
                    ))}
                    {member.teams.length > 2 && (
                      <span className="team-pill team-more">+{member.teams.length - 2}</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className={`status-indicator status-${member.status.toLowerCase()}`}>
                    {member.status === 'Active' ? <CheckCircle2 size={14} /> : <div className="dot"></div>}
                    {member.status}
                  </div>
                </td>
                <td>
                  <span className="last-active-text">{member.lastActive}</span>
                </td>
                <td className="actions-cell">
                  <button className="action-btn">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredMembers.length === 0 && (
          <div className="empty-state">
            <p>No members found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};
