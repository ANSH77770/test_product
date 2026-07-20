const ROLE_LABELS = Object.freeze({
  ADMIN: 'Finance Administrator',
  USER: 'Finance Planner',
  PLANNER: 'Finance Planner',
  REVIEWER: 'Finance Reviewer',
  FINANCE: 'Finance Planner',
  LEADERSHIP: 'CFO / Leadership',
});

export const normalizeRole = (role) => String(role || '').trim().toUpperCase();
export const roleLabel = (role) => ROLE_LABELS[normalizeRole(role)] || 'User';
export const isAdminRole = (role) => normalizeRole(role) === 'ADMIN';
