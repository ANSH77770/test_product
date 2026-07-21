import { apiRequest } from '@/services/apiClient';
import { ENDPOINTS } from '@/services/endpoints';

const accessBody = (access = {}) => ({
  segment: access.segment || access.segments || [],
  channel: access.channel || access.channels || [],
  brand: access.brand || access.brands || [],
  permissions: access.permissions || [],
});

export const adminService = {
  async getPendingUsers() {
    const response = await apiRequest(ENDPOINTS.adminUsers.root);
    const users = Array.isArray(response) ? response : response?.users || [];
    return { users: users.filter((user) => user.status === 'PENDING_APPROVAL') };
  },

  async getUsers() {
    const response = await apiRequest(ENDPOINTS.adminUsers.root);
    return Array.isArray(response) ? response : response?.users || [];
  },

  approveUser(userId, access) {
    return apiRequest(ENDPOINTS.adminUsers.byId(userId), {
      method: 'PUT',
      body: { status: 'ACTIVE', ...accessBody(access) },
    });
  },

  rejectUser(userId) {
    return apiRequest(ENDPOINTS.adminUsers.byId(userId), {
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
      },
    });
  },

  deleteUser: (userId) => apiRequest(ENDPOINTS.adminUsers.byId(userId), { method: 'DELETE' }),
};
