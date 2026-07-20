const encodeId = (value) => encodeURIComponent(value);

export const ENDPOINTS = Object.freeze({
  health: '/health',
  auth: Object.freeze({
    signup: '/api/v1/auth/users',
    login: '/api/v1/auth/login',
    verifyOtp: '/api/v1/auth/otp/verify',
    resendOtp: '/api/v1/auth/resend-otp',
    refreshToken: '/api/v1/auth/refresh-token',
    forgotPassword: '/api/v1/auth/forgot-password',
    resetPassword: '/api/v1/auth/reset-password',
    changePassword: '/api/v1/auth/change-password',
    currentUser: '/api/v1/auth/users/me',
    logout: '/api/v1/auth/logout',
  }),
  adminUsers: Object.freeze({
    root: '/api/v1/users',
    pending: '/api/v1/users/pending',
    status: (userId) => `/api/v1/users/${encodeId(userId)}/status`,
    byId: (userId) => `/api/v1/users/${encodeId(userId)}`,
  }),
  users: Object.freeze({
    root: '/api/users',
    byId: (userId) => `/api/users/${encodeId(userId)}`,
    bulkTemplate: '/api/users/bulk/template',
    bulkUpload: '/api/users/bulk/upload',
    bulkStatus: (jobId) => `/api/users/bulk/status/${encodeId(jobId)}`,
    bulkErrors: (jobId) => `/api/users/bulk/errors/${encodeId(jobId)}`,
  }),
  references: Object.freeze({
    segments: '/api/segments',
    channels: '/api/channels',
    brands: '/api/brands',
    roles: '/api/roles',
  }),
  templates: '/api/v1/templates',
});
