const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const getAuthToken = () => localStorage.getItem('atlas_token');
export const setAuthToken = (token: string) => localStorage.setItem('atlas_token', token);
export const removeAuthToken = () => localStorage.removeItem('atlas_token');
export const isDemoMode = () => localStorage.getItem('demo_mode') === 'true';

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// If in demo mode, returning empty lists prevents crashes until they create real data
const getMockDataForEndpoint = (endpoint: string) => {
  return [];
};

export const api = {
  async get(endpoint: string) {
    if (isDemoMode()) return getMockDataForEndpoint(endpoint);
    const headers = getHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
    if (!response.ok) throw new Error(`API GET Error: ${response.statusText}`);
    return await response.json();
  },
  async post(endpoint: string, data: any) {
    if (isDemoMode()) return { success: true };
    const headers = getHeaders();
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
    const headers = getHeaders();
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
    const headers = getHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error(`API DELETE Error: ${response.statusText}`);
    return response.json();
  },
};

export const authService = {
  login: async (data: any) => {
    const params = new URLSearchParams();
    params.append('username', data.email);
    params.append('password', data.password);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
    if (!response.ok) throw new Error(`API POST Error: ${response.statusText}`);
    return response.json();
  },
  signup: (data: any) => api.post('/auth/signup', data),
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
  getMe: () => api.get('/users/me'),
};
export const analyticsService = { getDashboard: () => api.get('/analytics/dashboard') };

