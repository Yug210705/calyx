import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Plus, Users, CheckCircle2, Shield, Settings,
  MoreHorizontal, X, Mail, Edit2, Key, Link as LinkIcon, Trash2,
  ChevronLeft, ChevronRight, ChevronDown, UserPlus, UserMinus
} from 'lucide-react';
import { teamService, userService, projectService, inviteService, roleService } from '../services/api';
import './Teams.css';

export const Teams = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('teams');
  const [panelTab, setPanelTab] = useState('details');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isNewTeamOpen, setIsNewTeamOpen] = useState(false);
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false);
  const [isInvitesOpen, setIsInvitesOpen] = useState(false);
  const [isRolesOpen, setIsRolesOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  // Form States
  const [teamForm, setTeamForm] = useState({ name: '', acronym: '', description: '', css_class: 'acronym-eng', lead_id: '' });
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'member', team_id: '' });
  const [roleForm, setRoleForm] = useState({ name: '', description: '', permissions: '[]' });
  const [memberToAdd, setMemberToAdd] = useState('');

  // RBAC States
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [editingRolePermissions, setEditingRolePermissions] = useState<string[]>([]);
  
  const PERMISSION_MODULES = [
    { name: 'Teams', key: 'teams' },
    { name: 'Projects', key: 'projects' },
    { name: 'Calendar', key: 'calendar' },
    { name: 'Directory', key: 'directory' }
  ];
  const ACTIONS = ['view', 'create', 'edit', 'delete'];
  
  const [isSavingRole, setIsSavingRole] = useState(false);
  const [saveRoleText, setSaveRoleText] = useState('Save Changes');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [tData, uData, pData, iData, rData] = await Promise.all([
        teamService.getTeams(),
        userService.getUsers(),
        projectService.getProjects(),
        inviteService.getInvites(),
        roleService.getRoles()
      ]);
      setTeams(tData);
      setAllUsers(uData);
      setProjects(pData);
      setInvites(iData);
      setRoles(rData);
      if (tData.length > 0 && !selectedTeam) {
        setSelectedTeam(tData[0]);
      } else if (selectedTeam) {
        // refresh selected team
        const refreshed = tData.find((t: any) => t.id === selectedTeam.id);
        setSelectedTeam(refreshed || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const totalMembers = teams.reduce((acc, t) => acc + (t.members_count || 0), 0);
  const pendingInvites = invites.filter(i => i.status === 'Pending').length;

  // --- Handlers ---
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { ...teamForm, status: 'Active' };
    if (payload.lead_id === '') payload.lead_id = null;
    await teamService.createTeam(payload);
    setIsNewTeamOpen(false);
    setTeamForm({ name: '', acronym: '', description: '', css_class: 'acronym-eng', lead_id: '' });
    loadData();
  };

  const handleEditTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;
    const payload: any = { ...teamForm };
    if (payload.lead_id === '') payload.lead_id = null;
    await teamService.updateTeam(selectedTeam.id, payload);
    setIsEditTeamOpen(false);
    loadData();
  };

  const handleArchiveTeam = async (id: number) => {
    await teamService.updateTeam(id, { status: 'Inactive' });
    loadData();
  };

  const handleAddMember = async () => {
    if (!selectedTeam || !memberToAdd) return;
    await teamService.addMember(selectedTeam.id, parseInt(memberToAdd));
    setMemberToAdd('');
    loadData();
  };

  const handleRemoveMember = async (userId: number) => {
    if (!selectedTeam) return;
    await teamService.removeMember(selectedTeam.id, userId);
    loadData();
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { ...inviteForm };
    if (payload.team_id === '') payload.team_id = null;
    await inviteService.createInvite(payload);
    setInviteForm({ email: '', role: 'member', team_id: '' });
    loadData();
  };

  const handleRevokeInvite = async (id: number) => {
    await inviteService.revokeInvite(id);
    loadData();
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    await roleService.createRole(roleForm);
    setRoleForm({ name: '', description: '', permissions: '[]' });
    loadData();
  };

  const handleCreateNewRole = async () => {
    const newRole = await roleService.createRole({ name: 'Untitled Role', description: '', permissions: '[]' });
    const updatedRoles = [...roles, newRole];
    setRoles(updatedRoles);
    setSelectedRole(newRole);
    setEditingRolePermissions([]);
    loadData();
  };

  const handleSaveRole = async () => {
    if (!selectedRole) return;
    setIsSavingRole(true);
    setSaveRoleText('Saving...');
    try {
      const updated = await roleService.updateRole(selectedRole.id, {
        name: selectedRole.name,
        description: selectedRole.description,
        permissions: JSON.stringify(editingRolePermissions)
      });
      setSelectedRole(updated);
      await loadData();
      setSaveRoleText('Saved!');
      setTimeout(() => setSaveRoleText('Save Changes'), 2000);
    } catch (e) {
      console.error(e);
      setSaveRoleText('Error!');
      setTimeout(() => setSaveRoleText('Save Changes'), 2000);
    } finally {
      setIsSavingRole(false);
    }
  };

  const togglePermission = (moduleKey: string, action: string) => {
    const permString = `${moduleKey}.${action}`;
    if (editingRolePermissions.includes(permString)) {
      setEditingRolePermissions(editingRolePermissions.filter(p => p !== permString));
    } else {
      setEditingRolePermissions([...editingRolePermissions, permString]);
    }
  };

  const handleDeleteRole = async (id: number) => {
    await roleService.deleteRole(id);
    loadData();
  };

  const openEditModal = () => {
    if (selectedTeam) {
      setTeamForm({
        name: selectedTeam.name,
        acronym: selectedTeam.acronym,
        description: selectedTeam.description || '',
        css_class: selectedTeam.css_class,
        lead_id: selectedTeam.lead_id || ''
      });
      setIsEditTeamOpen(true);
    }
  };

  // --- Org Chart Component ---
  const OrgChart = () => (
    <div className="org-chart-wrapper" style={{ padding: '40px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '24px', overflowX: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ padding: '12px 24px', backgroundColor: '#1e293b', color: 'white', borderRadius: '8px', fontWeight: 600 }}>Organization Root</div>
        <div style={{ width: '2px', height: '30px', backgroundColor: '#cbd5e1' }}></div>
        <div style={{ width: '80%', height: '2px', backgroundColor: '#cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
          {teams.filter(t => t.status === 'Active').map((t, i) => <div key={i} style={{ width: '2px', height: '20px', backgroundColor: '#cbd5e1', transform: 'translateY(2px)' }}></div>)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', paddingTop: '20px' }}>
          {teams.filter(t => t.status === 'Active').map(team => (
            <div key={team.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '200px' }}>
              <div style={{ padding: '12px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', width: '100%', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div className={`team-acronym ${team.css_class || 'acronym-eng'}`} style={{ margin: '0 auto 8px' }}>{team.acronym}</div>
                <div style={{ fontWeight: 600 }}>{team.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{team.lead ? `Lead: ${team.lead.name}` : 'No Lead'}</div>
              </div>
              {team.members && team.members.length > 0 && (
                <>
                  <div style={{ width: '2px', height: '20px', backgroundColor: '#cbd5e1' }}></div>
                  <div style={{ padding: '8px', backgroundColor: '#f1f5f9', borderRadius: '6px', width: '90%', border: '1px solid #e2e8f0' }}>
                    {team.members.map((m: any) => (
                      <div key={m.id} style={{ fontSize: '12px', padding: '4px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
                        {m.name}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="teams-page">
      <div className="global-page-header">
        <div className="global-page-header-left">
          <h1 className="teams-title">Teams</h1>
          <p className="teams-subtitle">Organize your people into teams and manage permissions at scale.</p>
        </div>
        <div className="global-page-header-right">
          <div className="search-input-wrapper">
            <Search size={14} className="search-icon" />
            <input type="text" placeholder="Search teams, members..." />
          </div>
          <button className="btn-filter">
            <Filter size={14} /> Filter <ChevronDown size={14} style={{color: '#94a3b8', marginLeft: '4px'}} />
          </button>
          <button className="btn-new-team" onClick={() => setIsNewTeamOpen(true)}>
            <Plus size={16} /> New Team
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-icon purple"><Users size={20} /></div>
          <div className="kpi-content">
            <span className="kpi-label">Total Teams</span>
            <span className="kpi-value">{teams.length}</span>
            <span className="kpi-trend positive">Live data</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon blue"><Users size={20} /></div>
          <div className="kpi-content">
            <span className="kpi-label">Total Members</span>
            <span className="kpi-value">{totalMembers}</span>
            <span className="kpi-trend positive">Live data</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon orange"><Shield size={20} /></div>
          <div className="kpi-content">
            <span className="kpi-label">Pending Invites</span>
            <span className="kpi-value">{pendingInvites}</span>
            <span className="kpi-trend link" onClick={() => setIsInvitesOpen(true)}>View invites</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon purple" style={{backgroundColor: '#f8fafc', border: '1px solid #e2e8f0'}}><Settings size={20} color="#8b5cf6" /></div>
          <div className="kpi-content">
            <span className="kpi-label">Custom Roles</span>
            <span className="kpi-value">{roles.length}</span>
            <span className="kpi-trend link" onClick={() => setIsRolesOpen(true)}>Manage roles</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="teams-tabs">
        <div className={`team-tab ${activeTab === 'teams' ? 'active' : ''}`} onClick={() => setActiveTab('teams')}>Teams</div>
        <div className={`team-tab ${activeTab === 'org' ? 'active' : ''}`} onClick={() => setActiveTab('org')}>Org Structure</div>
      </div>

      {activeTab === 'teams' ? (
        <div className="teams-main-layout">
          {/* Teams Table */}
          <div className="teams-table-container">
            <div className="teams-table-header">
              <div>Team</div>
              <div>Description</div>
              <div>Members</div>
              <div>Projects</div>
              <div>Lead</div>
              <div>Status</div>
              <div style={{textAlign: 'right'}}>Actions</div>
            </div>
            
            <div className="teams-table-body">
              {isLoading ? <div style={{padding: 20}}>Loading...</div> : teams.map((team) => (
                <div 
                  key={team.id} 
                  className={`teams-table-row ${selectedTeam?.id === team.id ? 'selected' : ''}`}
                  onClick={() => { setSelectedTeam(team); setPanelTab('details'); }}
                >
                  <div className="team-badge-cell">
                    <div className={`team-acronym ${team.css_class || 'acronym-eng'}`}>{team.acronym}</div>
                    <span>{team.name}</span>
                  </div>
                  <div className="desc-cell">{team.description}</div>
                  <div className="avatars-cell">
                    <div className="avatar-more">{team.members_count || 0}</div>
                  </div>
                  <div>{projects.filter(p => p.team_id === team.id).length}</div>
                  <div className="lead-cell">
                    {team.lead ? (
                      <>
                        <img src={team.lead.avatar || 'https://i.pravatar.cc/150?u=anon'} alt={team.lead.name} className="lead-avatar" />
                        <span>{team.lead.name}</span>
                      </>
                    ) : (
                      <span style={{color: '#94a3b8'}}>Unassigned</span>
                    )}
                  </div>
                  <div>
                    <span className={`status-badge ${team.status?.toLowerCase()}`}>{team.status}</span>
                  </div>
                  <div className="action-cell" style={{position: 'relative'}}>
                    <div 
                      onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === team.id ? null : team.id); }} 
                      style={{cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}
                    >
                      <MoreHorizontal size={16} />
                    </div>
                    {openDropdownId === team.id && (
                      <div style={{position: 'absolute', right: '0', top: '28px', backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderRadius: '6px', border: '1px solid #e2e8f0', zIndex: 10, width: '140px', textAlign: 'left', padding: '4px 0'}}>
                         <div style={{padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: '#1e293b'}} onClick={(e) => { e.stopPropagation(); setOpenDropdownId(null); setSelectedTeam(team); }}>View Details</div>
                         <div style={{padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: '#ef4444'}} onClick={(e) => { e.stopPropagation(); handleArchiveTeam(team.id); setOpenDropdownId(null); }}>Archive Team</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {teams.length === 0 && !isLoading && <div style={{padding: 20, color: '#94a3b8'}}>No teams found. Create one!</div>}
            </div>
          </div>

          {/* Side Panel */}
          {selectedTeam && (
            <div className="team-side-panel">
              <div className="panel-header">
                <div className="panel-close" onClick={() => setSelectedTeam(null)}><X size={16} /></div>
                <div className={`team-acronym ${selectedTeam.css_class || 'acronym-eng'}`} style={{marginBottom: '12px'}}>{selectedTeam.acronym}</div>
                <h2 className="panel-team-title">{selectedTeam.name}</h2>
                <div className="panel-meta">
                  <div className="meta-status">
                    <div className="meta-dot" style={{backgroundColor: selectedTeam.status === 'Inactive' ? '#94a3b8' : '#16a34a'}}></div> {selectedTeam.status}
                  </div>
                  <div>Created on {new Date(selectedTeam.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div className="panel-tabs">
                <div className={`panel-tab ${panelTab === 'details' ? 'active' : ''}`} onClick={() => setPanelTab('details')}>Details</div>
                <div className={`panel-tab ${panelTab === 'members' ? 'active' : ''}`} onClick={() => setPanelTab('members')}>Members ({selectedTeam.members_count || 0})</div>
              </div>
              
              <div className="panel-content">
                {panelTab === 'details' ? (
                  <>
                    <div className="panel-section">
                      <div className="panel-section-title">Description</div>
                      <div className="panel-desc">{selectedTeam.description || 'No description provided.'}</div>
                    </div>
                    
                    <div className="panel-section">
                      <div className="panel-section-title">Team Lead</div>
                      {selectedTeam.lead ? (
                        <div className="panel-lead">
                          <div className="panel-lead-info">
                            <img src={selectedTeam.lead.avatar || 'https://i.pravatar.cc/150?u=anon'} alt={selectedTeam.lead.name} className="panel-lead-avatar" />
                            <div>
                              <div className="panel-lead-name">{selectedTeam.lead.name}</div>
                              <div className="panel-lead-email">{selectedTeam.lead.email}</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="panel-desc" style={{color: '#94a3b8'}}>No lead assigned.</div>
                      )}
                    </div>
                    
                    <div className="panel-section">
                      <div className="panel-projects-header">
                        <div className="panel-section-title" style={{margin: 0}}>Projects</div>
                      </div>
                      {projects.filter(p => p.team_id === selectedTeam.id).length === 0 ? (
                        <div className="panel-desc" style={{color: '#94a3b8'}}>No projects assigned to this team.</div>
                      ) : (
                        projects.filter(p => p.team_id === selectedTeam.id).map(p => (
                          <div key={p.id} className="project-progress-item" style={{marginBottom: '12px'}}>
                            <div className="project-progress-top">
                              <span>{p.title}</span>
                              <span>{p.progress}%</span>
                            </div>
                            <div className="project-progress-bar-bg">
                              <div className="project-progress-bar-fill" style={{width: `${p.progress}%`}}></div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="panel-section">
                      <div className="panel-section-title">Team Settings</div>
                      <div className="settings-list">
                        <div className="setting-item" onClick={openEditModal} style={{cursor: 'pointer'}}>
                          <div className="setting-item-left"><Edit2 size={14} /> Edit Team</div>
                          <ChevronRight size={14} style={{color: '#94a3b8'}} />
                        </div>
                        <div className="setting-item" onClick={() => setIsRolesOpen(true)} style={{cursor: 'pointer'}}>
                          <div className="setting-item-left"><Key size={14} /> Manage Roles & Permissions</div>
                          <ChevronRight size={14} style={{color: '#94a3b8'}} />
                        </div>
                      </div>
                      <div className="btn-archive" onClick={() => handleArchiveTeam(selectedTeam.id)}>
                        <Trash2 size={14} /> Archive Team
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="panel-section">
                    <div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
                      <select 
                        value={memberToAdd} 
                        onChange={e => setMemberToAdd(e.target.value)}
                        style={{flex: 1, padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px'}}
                      >
                        <option value="">Select user to add...</option>
                        {allUsers.filter(u => !selectedTeam.members?.find((m: any) => m.id === u.id)).map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                        ))}
                      </select>
                      <button onClick={handleAddMember} style={{padding: '8px 16px', background: '#6366f1', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer'}}><UserPlus size={16} /></button>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                      {selectedTeam.members?.map((m: any) => (
                        <div key={m.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                            <img src={m.avatar || 'https://i.pravatar.cc/150'} style={{width: 32, height: 32, borderRadius: '50%'}} />
                            <div>
                              <div style={{fontWeight: 600, fontSize: '13px'}}>{m.name}</div>
                              <div style={{color: '#64748b', fontSize: '12px'}}>{m.email}</div>
                            </div>
                          </div>
                          <button onClick={() => handleRemoveMember(m.id)} style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer'}}><UserMinus size={16} /></button>
                        </div>
                      ))}
                      {(!selectedTeam.members || selectedTeam.members.length === 0) && (
                        <div style={{textAlign: 'center', color: '#94a3b8', padding: '20px 0'}}>No members in this team.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <OrgChart />
      )}

      {/* --- Modals --- */}
      
      {/* Edit Team Modal */}
      {isEditTeamOpen && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100}}>
          <div style={{backgroundColor: 'white', padding: '24px', borderRadius: '8px', width: '400px', display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h2 style={{margin: 0, fontSize: '18px'}}>Edit Team</h2>
              <X size={18} style={{cursor: 'pointer'}} onClick={() => setIsEditTeamOpen(false)} />
            </div>
            <form onSubmit={handleEditTeam} style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <div>
                <label style={{display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px'}}>Team Name</label>
                <input required type="text" value={teamForm.name} onChange={e => setTeamForm({...teamForm, name: e.target.value})} style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px'}} />
              </div>
              <div>
                <label style={{display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px'}}>Acronym</label>
                <input required type="text" maxLength={4} value={teamForm.acronym} onChange={e => setTeamForm({...teamForm, acronym: e.target.value.toUpperCase()})} style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px'}} />
              </div>
              <div>
                <label style={{display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px'}}>Team Lead</label>
                <select value={teamForm.lead_id} onChange={e => setTeamForm({...teamForm, lead_id: e.target.value})} style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px'}}>
                  <option value="">None</option>
                  {allUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px'}}>Description</label>
                <textarea required value={teamForm.description} onChange={e => setTeamForm({...teamForm, description: e.target.value})} style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '80px'}} />
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px'}}>
                <button type="button" onClick={() => setIsEditTeamOpen(false)} style={{padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white', cursor: 'pointer'}}>Cancel</button>
                <button type="submit" style={{padding: '8px 16px', border: 'none', borderRadius: '6px', background: '#6366f1', color: 'white', cursor: 'pointer', fontWeight: 600}}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invites Manager Modal */}
      {isInvitesOpen && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100}}>
          <div style={{backgroundColor: 'white', padding: '24px', borderRadius: '8px', width: '500px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '80vh', overflowY: 'auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h2 style={{margin: 0, fontSize: '18px'}}>Pending Invites</h2>
              <X size={18} style={{cursor: 'pointer'}} onClick={() => setIsInvitesOpen(false)} />
            </div>
            
            <form onSubmit={handleSendInvite} style={{display: 'flex', gap: '8px', alignItems: 'flex-end', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px'}}>
              <div style={{flex: 1}}>
                <label style={{display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px'}}>Email Address</label>
                <input required type="email" value={inviteForm.email} onChange={e => setInviteForm({...inviteForm, email: e.target.value})} style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px'}} />
              </div>
              <div style={{width: '120px'}}>
                <label style={{display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px'}}>Team (Opt)</label>
                <select value={inviteForm.team_id} onChange={e => setInviteForm({...inviteForm, team_id: e.target.value})} style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px'}}>
                  <option value="">None</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.acronym}</option>)}
                </select>
              </div>
              <button type="submit" style={{padding: '8px 16px', border: 'none', borderRadius: '6px', background: '#6366f1', color: 'white', cursor: 'pointer', fontWeight: 600, height: '35px'}}>Send</button>
            </form>

            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              {invites.length === 0 ? (
                <div style={{textAlign: 'center', color: '#94a3b8', padding: '20px 0'}}>No pending invites.</div>
              ) : (
                invites.map(inv => (
                  <div key={inv.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', opacity: inv.status === 'Revoked' ? 0.5 : 1}}>
                    <div>
                      <div style={{fontWeight: 600, fontSize: '13px'}}>{inv.email}</div>
                      <div style={{color: '#64748b', fontSize: '12px'}}>Status: {inv.status}</div>
                    </div>
                    {inv.status === 'Pending' && (
                      <button onClick={() => handleRevokeInvite(inv.id)} style={{background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'}}>Revoke</button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Roles Manager Modal */}
      {isRolesOpen && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100}}>
          <div className="rbac-modal" style={{backgroundColor: 'white', borderRadius: '12px', width: '900px', height: '600px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'}}>
            
            {/* Modal Header */}
            <div style={{padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc'}}>
              <div>
                <h2 style={{margin: 0, fontSize: '18px', color: '#0f172a'}}>Role-Based Access Control</h2>
                <p style={{margin: 0, fontSize: '13px', color: '#64748b', marginTop: '4px'}}>Manage custom roles and granular module permissions.</p>
              </div>
              <div onClick={() => setIsRolesOpen(false)} style={{cursor: 'pointer', padding: '8px', backgroundColor: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><X size={16} /></div>
            </div>
            
            {/* Modal Body */}
            <div style={{display: 'flex', flex: 1, overflow: 'hidden'}}>
              
              {/* Left Sidebar (Roles List) */}
              <div style={{width: '280px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', backgroundColor: '#fcfcfd'}}>
                <div style={{padding: '16px', borderBottom: '1px solid #e2e8f0'}}>
                  <button onClick={handleCreateNewRole} style={{width: '100%', padding: '10px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'}}>
                    <Plus size={16} /> Create New Role
                  </button>
                </div>
                <div style={{flex: 1, overflowY: 'auto', padding: '12px'}}>
                  {roles.map(role => (
                    <div 
                      key={role.id} 
                      onClick={() => { setSelectedRole(role); setEditingRolePermissions(JSON.parse(role.permissions || '[]')); }}
                      style={{padding: '12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '8px', border: '1px solid', borderColor: selectedRole?.id === role.id ? '#6366f1' : 'transparent', backgroundColor: selectedRole?.id === role.id ? '#eef2ff' : 'transparent'}}
                      className={selectedRole?.id !== role.id ? 'role-item-hover' : ''}
                    >
                      <div style={{fontWeight: 600, fontSize: '14px', color: selectedRole?.id === role.id ? '#4338ca' : '#334155'}}>{role.name}</div>
                      <div style={{fontSize: '12px', color: '#64748b', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{role.description || 'No description'}</div>
                    </div>
                  ))}
                  {roles.length === 0 && <div style={{textAlign: 'center', color: '#94a3b8', padding: '20px 0', fontSize: '13px'}}>No roles created yet.</div>}
                </div>
              </div>
              
              {/* Right Panel (Permissions Editor) */}
              <div style={{flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'white'}}>
                {selectedRole ? (
                  <>
                    <div style={{padding: '24px', borderBottom: '1px solid #e2e8f0'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                        <div style={{flex: 1, marginRight: '24px'}}>
                          <input 
                            type="text" 
                            value={selectedRole.name} 
                            onChange={e => setSelectedRole({...selectedRole, name: e.target.value})} 
                            style={{fontSize: '20px', fontWeight: 600, border: 'none', borderBottom: '2px solid transparent', padding: '4px 0', width: '100%', marginBottom: '8px', outline: 'none', backgroundColor: 'transparent'}}
                            className="role-name-input"
                            placeholder="Role Name"
                          />
                          <input 
                            type="text" 
                            value={selectedRole.description || ''} 
                            onChange={e => setSelectedRole({...selectedRole, description: e.target.value})} 
                            style={{fontSize: '13px', color: '#64748b', border: 'none', padding: '4px 0', width: '100%', outline: 'none', backgroundColor: 'transparent'}}
                            className="role-name-input"
                            placeholder="Add a description for this role..."
                          />
                        </div>
                        <button onClick={() => { handleDeleteRole(selectedRole.id); setSelectedRole(null); }} style={{background: 'none', border: '1px solid #e2e8f0', color: '#ef4444', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600}}>
                          <Trash2 size={14} /> Delete Role
                        </button>
                      </div>
                    </div>
                    
                    <div style={{flex: 1, overflowY: 'auto', padding: '24px'}}>
                      <h3 style={{margin: '0 0 16px 0', fontSize: '15px', color: '#334155'}}>Module Permissions</h3>
                      
                      <div className="permissions-matrix">
                        {PERMISSION_MODULES.map(module => (
                          <div key={module.key} style={{marginBottom: '24px', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden'}}>
                            <div style={{padding: '12px 16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 600, color: '#334155', fontSize: '14px'}}>{module.name}</div>
                            <div style={{padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px'}}>
                              {ACTIONS.map(action => {
                                const isChecked = editingRolePermissions.includes(`${module.key}.${action}`);
                                return (
                                  <div key={action} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #f1f5f9', borderRadius: '6px'}}>
                                    <span style={{textTransform: 'capitalize', fontSize: '14px', color: '#475569'}}>{action} {module.name}</span>
                                    <label className="toggle-switch">
                                      <input type="checkbox" checked={isChecked} onChange={() => togglePermission(module.key, action)} />
                                      <span className="slider round"></span>
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div style={{padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#f8fafc'}}>
                      <button 
                        onClick={handleSaveRole} 
                        disabled={isSavingRole}
                        style={{padding: '10px 20px', backgroundColor: saveRoleText === 'Saved!' ? '#059669' : saveRoleText === 'Error!' ? '#ef4444' : '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: isSavingRole ? 'default' : 'pointer', transition: 'background-color 0.2s', width: '140px'}}
                      >
                        {saveRoleText}
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8'}}>
                    <Shield size={48} style={{marginBottom: '16px', opacity: 0.5}} />
                    <h3 style={{margin: 0, color: '#64748b'}}>No Role Selected</h3>
                    <p style={{fontSize: '13px', marginTop: '8px'}}>Select a role from the sidebar or create a new one to edit permissions.</p>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </div>
      )}

      {/* New Team Modal */}
      {isNewTeamOpen && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100}}>
          <div style={{backgroundColor: 'white', padding: '24px', borderRadius: '8px', width: '400px', display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h2 style={{margin: 0, fontSize: '18px'}}>Create New Team</h2>
              <X size={18} style={{cursor: 'pointer'}} onClick={() => setIsNewTeamOpen(false)} />
            </div>
            <form onSubmit={handleCreateTeam} style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <div>
                <label style={{display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px'}}>Team Name</label>
                <input required type="text" value={teamForm.name} onChange={e => setTeamForm({...teamForm, name: e.target.value})} style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px'}} />
              </div>
              <div>
                <label style={{display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px'}}>Acronym (3-4 chars)</label>
                <input required type="text" maxLength={4} value={teamForm.acronym} onChange={e => setTeamForm({...teamForm, acronym: e.target.value.toUpperCase()})} style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px'}} />
              </div>
              <div>
                <label style={{display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px'}}>Description</label>
                <textarea required value={teamForm.description} onChange={e => setTeamForm({...teamForm, description: e.target.value})} style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '80px'}} />
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px'}}>
                <button type="button" onClick={() => setIsNewTeamOpen(false)} style={{padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white', cursor: 'pointer'}}>Cancel</button>
                <button type="submit" style={{padding: '8px 16px', border: 'none', borderRadius: '6px', background: '#6366f1', color: 'white', cursor: 'pointer', fontWeight: 600}}>Create Team</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
