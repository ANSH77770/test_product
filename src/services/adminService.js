import { apiRequest } from '@/services/apiClient';
import { ENDPOINTS } from '@/services/endpoints';

const accessBody = (access = {}) => ({
  segment: access.segment || access.segments || [],
  channel: access.channel || access.channels || [],
  brand: access.brand || access.brands || [],
  permissions: access.permissions || [],
});

export const adminService = {
  getPendingUsers: () => apiRequest(ENDPOINTS.adminUsers.pending),

  getUsers: () => apiRequest(ENDPOINTS.adminUsers.root),

  approveUser(userId, access) {
    return apiRequest(ENDPOINTS.adminUsers.status(userId), {
      method: 'PUT',
      body: { status: 'ACTIVE', ...accessBody(access) },
    });
  },

  rejectUser(userId) {
    return apiRequest(ENDPOINTS.adminUsers.status(userId), {
      method: 'PUT',
      body: { status: 'REJECTED' },
    });
  },

  createUser(user) {
    return apiRequest(ENDPOINTS.adminUsers.root, {
      method: 'POST',
      body: {
        ...user,
        ...accessBody(user),
        role: user.role || 'USER',
        status: user.status || 'ACTIVE',
      },
    });
  },

  deleteUser: (userId) => apiRequest(ENDPOINTS.adminUsers.byId(userId), { method: 'DELETE' }),
};
