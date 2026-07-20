import { apiRequest } from '@/services/apiClient';
import { ENDPOINTS } from '@/services/endpoints';

export const userService = {
  getUsers: () => apiRequest(ENDPOINTS.users.root),
  getUser: (userId) => apiRequest(ENDPOINTS.users.byId(userId)),
  createUser: (user) => apiRequest(ENDPOINTS.users.root, { method: 'POST', body: user }),
  deleteUser: (userId) => apiRequest(ENDPOINTS.users.byId(userId), { method: 'DELETE' }),
};
