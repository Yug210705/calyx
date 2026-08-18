import { supabase } from './supabase';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const getHeaders = async () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  return headers;
};

const isDemoMode = () => localStorage.getItem('demo_mode') === 'true';

const getMockDataForEndpoint = (endpoint: string) => {
  if (endpoint.includes('/projects')) {
    return [
      { id: 1, title: 'Atlas Mobile App', description: 'React Native redesign', status: 'In Progress', progress: 65, due_date: '2024-11-15T00:00:00Z', team_id: 1, team: [{id: 1, avatar: 'https://i.pravatar.cc/150?u=1'}, {id: 2, avatar: 'https://i.pravatar.cc/150?u=2'}] },
      { id: 2, title: 'Website Redesign', description: 'Marketing site refresh', status: 'Completed', progress: 100, due_date: '2024-09-01T00:00:00Z', team_id: 3, team: [{id: 3, avatar: 'https://i.pravatar.cc/150?u=3'}] },
      { id: 3, title: 'AI Dashboard', description: 'Integrating LLM analytics', status: 'Planning', progress: 10, due_date: '2024-12-01T00:00:00Z', team_id: 1, team: [{id: 4, avatar: 'https://i.pravatar.cc/150?u=4'}, {id: 5, avatar: 'https://i.pravatar.cc/150?u=5'}, {id: 6, avatar: 'https://i.pravatar.cc/150?u=6'}, {id: 7, avatar: 'https://i.pravatar.cc/150?u=7'}] },
      { id: 4, title: 'Database Migration', description: 'Moving to PostgreSQL 16', status: 'On Hold', progress: 40, due_date: '2024-10-15T00:00:00Z', team_id: 1, team: [{id: 8, avatar: 'https://i.pravatar.cc/150?u=8'}] },
      { id: 5, title: 'User Authentication', description: 'OAuth 2.0 implementation', status: 'In Progress', progress: 80, due_date: '2024-10-05T00:00:00Z', team_id: 5, team: [{id: 1, avatar: 'https://i.pravatar.cc/150?u=1'}, {id: 3, avatar: 'https://i.pravatar.cc/150?u=3'}] },
      { id: 6, title: 'API Gateway', description: 'Rate limiting and caching', status: 'Planning', progress: 0, due_date: '2024-12-31T00:00:00Z', team_id: 1, team: [] },
    ];
  }
  if (endpoint.includes('/teams')) {
    return [
      { id: 1, name: 'Engineering', description: 'Core product development', members_count: 14, status: 'Active', acronym: 'ENG', css_class: 'acronym-eng', lead: { name: 'Arjun Mehta', avatar: 'https://i.pravatar.cc/150?u=arjun' }, members: [{id: 1, name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=1'}, {id: 2, name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=2'}, {id: 3, name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=3'}], created_at: '2024-01-10T00:00:00Z' },
      { id: 2, name: 'Product', description: 'Product management and design', members_count: 6, status: 'Active', acronym: 'PRD', css_class: 'acronym-prd', lead: { name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/150?u=priya' }, members: [{id: 4, name: 'Dave', avatar: 'https://i.pravatar.cc/150?u=4'}, {id: 5, name: 'Eve', avatar: 'https://i.pravatar.cc/150?u=5'}], created_at: '2024-02-15T00:00:00Z' },
      { id: 3, name: 'Marketing', description: 'Growth and outreach', members_count: 4, status: 'Active', acronym: 'MKT', css_class: 'acronym-mkt', lead: { name: 'Sneha Iyer', avatar: 'https://i.pravatar.cc/150?u=sneha' }, members: [{id: 6, name: 'Frank', avatar: 'https://i.pravatar.cc/150?u=6'}], created_at: '2024-03-20T00:00:00Z' },
      { id: 4, name: 'Design', description: 'UI/UX and branding', members_count: 8, status: 'Active', acronym: 'DSN', css_class: 'acronym-dsn', lead: { name: 'Rohit Singh', avatar: 'https://i.pravatar.cc/150?u=rohit' }, members: [{id: 7, name: 'Grace', avatar: 'https://i.pravatar.cc/150?u=7'}, {id: 8, name: 'Heidi', avatar: 'https://i.pravatar.cc/150?u=8'}], created_at: '2024-04-05T00:00:00Z' },
      { id: 5, name: 'Security', description: 'Infosec and compliance', members_count: 3, status: 'Active', acronym: 'SEC', css_class: 'acronym-sec', lead: { name: 'Vikram Joshi', avatar: 'https://i.pravatar.cc/150?u=vikram' }, members: [{id: 9, name: 'Ivan', avatar: 'https://i.pravatar.cc/150?u=9'}], created_at: '2024-05-10T00:00:00Z' },
      { id: 6, name: 'Legal', description: 'Contracts and policies', members_count: 2, status: 'Active', acronym: 'LGL', css_class: 'acronym-lgl', lead: { name: 'Ananya Rao', avatar: 'https://i.pravatar.cc/150?u=ananya' }, members: [], created_at: '2024-06-01T00:00:00Z' },
    ];
  }
  if (endpoint.includes('/users')) {
    return [
      { id: 1, name: 'Arjun Mehta', email: 'arjun@acme.com', avatar: 'https://i.pravatar.cc/150?u=arjun', status: 'Active' },
      { id: 2, name: 'Priya Sharma', email: 'priya@acme.com', avatar: 'https://i.pravatar.cc/150?u=priya', status: 'Active' },
      { id: 3, name: 'Rohit Singh', email: 'rohit@acme.com', avatar: 'https://i.pravatar.cc/150?u=rohit', status: 'Offline' },
      { id: 4, name: 'Sneha Iyer', email: 'sneha@acme.com', avatar: 'https://i.pravatar.cc/150?u=sneha', status: 'Active' },
      { id: 5, name: 'Vikram Joshi', email: 'vikram@acme.com', avatar: 'https://i.pravatar.cc/150?u=vikram', status: 'Busy' },
      { id: 6, name: 'Ananya Rao', email: 'ananya@acme.com', avatar: 'https://i.pravatar.cc/150?u=ananya', status: 'Active' },
    ];
  }
  if (endpoint.includes('/invites')) {
    return [
      { id: 1, email: 'newhire@acme.com', status: 'Pending', invited_by: 'Admin', created_at: '2024-08-10T00:00:00Z' }
    ];
  }
  if (endpoint.includes('/roles')) {
    return [
      { id: 1, name: 'Administrator', permissions: ['all'] },
      { id: 2, name: 'Member', permissions: ['read', 'write'] },
      { id: 3, name: 'Viewer', permissions: ['read'] }
    ];
  }
  if (endpoint.includes('/tasks')) {
    return [
      { id: 1, title: 'Database Schema', status: 'Completed', priority: 'High', due_date: '2024-08-01' },
      { id: 2, title: 'API Integration', status: 'In Progress', priority: 'Medium', due_date: '2024-08-20' },
      { id: 3, title: 'UI Design', status: 'Pending', priority: 'Low', due_date: '2024-08-25' }
    ];
  }
  if (endpoint.includes('/activities')) {
    const today = new Date().toISOString();
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    return [
      { id: 1, action_type: 'project_create', timestamp: today, description: 'Created a new project', details: JSON.stringify({ user_name: 'Arjun Mehta', target_text: 'Atlas Mobile App', badge_text: 'Engineering', time_str: '10:30 AM' }) },
      { id: 2, action_type: 'task_complete', timestamp: today, description: 'Completed a milestone task', details: JSON.stringify({ user_name: 'Priya Sharma', target_text: 'Update User Schema', badge_text: 'Database', time_str: '11:45 AM' }) },
      { id: 3, action_type: 'file_upload', timestamp: yesterday, description: 'Uploaded new design assets', details: JSON.stringify({ user_name: 'Rohit Singh', target_text: 'ui_mockups.fig, assets.zip', badge_text: 'Design', time_str: '02:15 PM' }) },
      { id: 4, action_type: 'member_add', timestamp: yesterday, description: 'Added a new team member', details: JSON.stringify({ user_name: 'Sneha Iyer', target_text: 'Vikram Joshi', badge_text: 'Marketing', time_str: '04:00 PM' }) },
      { id: 5, action_type: 'comment', timestamp: yesterday, description: 'Commented on a task', details: JSON.stringify({ user_name: 'Ananya Rao', target_text: 'Review legal terms', badge_text: 'Legal', time_str: '05:30 PM' }) }
    ];
  }
  return [];
};

export const api = {
  async get(endpoint: string) {
    if (isDemoMode()) return getMockDataForEndpoint(endpoint);
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
      if (!response.ok) throw new Error(`API GET Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.warn(`Falling back to mock data for ${endpoint}`);
      return getMockDataForEndpoint(endpoint);
    }
  },
  async post(endpoint: string, data: any) {
    if (isDemoMode()) return { success: true };
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API POST Error: ${response.statusText}`);
    return response.json();
  },
  async put(endpoint: string, data: any) {
    if (isDemoMode()) return { success: true };
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API PUT Error: ${response.statusText}`);
    return response.json();
  },
  async delete(endpoint: string) {
    if (isDemoMode()) return { success: true };
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error(`API DELETE Error: ${response.statusText}`);
    return response.json();
  },
};

export const projectService = {
  getProjects: () => api.get('/projects/'),
  getProject: (id: number) => api.get(`/projects/${id}`),
  createProject: (data: any) => api.post('/projects/', data),
  updateProject: (id: number, data: any) => api.put(`/projects/${id}`, data),
};

export const taskService = {
  getTasks: (projectId?: number) => {
    const url = projectId ? `/tasks/?project_id=${projectId}` : '/tasks/';
    return api.get(url);
  },
  createTask: (data: any) => api.post('/tasks/', data),
  updateTask: (id: number, data: any) => api.put(`/tasks/${id}`, data),
};

export const activityService = {
  getActivities: () => api.get('/activities/'),
  createActivity: (data: any) => api.post('/activities/', data),
};

export const teamService = {
  getTeams: () => api.get('/teams/'),
  getTeam: (id: number) => api.get(`/teams/${id}`),
  createTeam: (data: any) => api.post('/teams/', data),
  updateTeam: (id: number, data: any) => api.put(`/teams/${id}`, data),
  deleteTeam: (id: number) => api.delete(`/teams/${id}`),
  addMember: (teamId: number, userId: number) => api.post(`/teams/${teamId}/members`, { user_id: userId }),
  removeMember: (teamId: number, userId: number) => api.delete(`/teams/${teamId}/members/${userId}`),
};

export const inviteService = {
  getInvites: () => api.get('/invites/'),
  createInvite: (data: any) => api.post('/invites/', data),
  revokeInvite: (id: number) => api.put(`/invites/${id}/revoke`, {}),
};

export const roleService = {
  getRoles: () => api.get('/roles/'),
  createRole: (data: any) => api.post('/roles/', data),
  updateRole: (id: number, data: any) => api.put(`/roles/${id}`, data),
  deleteRole: (id: number) => api.delete(`/roles/${id}`),
};

export const userService = {
  getUsers: () => api.get('/users/'),
};
