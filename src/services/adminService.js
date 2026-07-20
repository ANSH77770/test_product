import { apiRequest } from '@/services/apiClient';

const API = '/api/v1/users';

const accessBody = (access = {}) => ({
  segment: access.segment || access.segments || [],
  channel: access.channel || access.channels || [],
  brand: access.brand || access.brands || [],
  permissions: access.permissions || [],
});

export const adminService = {
  getPendingUsers: () => apiRequest(`${API}/pending`),

  getUsers: () => apiRequest(API),

  approveUser(userId, access) {
    return apiRequest(`${API}/${encodeURIComponent(userId)}/status`, {
      method: 'PUT',
      body: { status: 'ACTIVE', ...accessBody(access) },
    });
  },

  rejectUser(userId) {
    return apiRequest(`${API}/${encodeURIComponent(userId)}/status`, {
      method: 'PUT',
      body: { status: 'REJECTED' },
    });
  },

  createUser(user) {
    return apiRequest(API, {
      method: 'POST',
      body: {
        ...user,
        ...accessBody(user),
        role: user.role || 'USER',
        status: user.status || 'ACTIVE',
      },
    });
  },

  deleteUser: (userId) => apiRequest(`${API}/${encodeURIComponent(userId)}`, { method: 'DELETE' }),
};
