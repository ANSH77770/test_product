import { apiRequest } from '@/services/apiClient';

const API = '/api/v1/admin';

export const adminService = {
  getPendingUsers: () => apiRequest(`${API}/pending-users`),
  getUsers: () => apiRequest(`${API}/users`),
  approveUser(userId, access) {
    return apiRequest(`${API}/approve/${encodeURIComponent(userId)}`, {
      method: 'PUT',
      body: {
        segment: access.segment || access.segments || [],
        channel: access.channel || access.channels || [],
        brand: access.brand || access.brands || [],
        permissions: access.permissions || [],
      },
    });
  },
  rejectUser: (userId) => apiRequest(`${API}/reject/${encodeURIComponent(userId)}`, { method: 'PUT' }),
  createUser: (user) => apiRequest(`${API}/create-user`, { method: 'POST', body: user }),
  deleteUser: (userId) => apiRequest(`${API}/delete-user/${encodeURIComponent(userId)}`, { method: 'DELETE' }),
};
