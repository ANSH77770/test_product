const env = import.meta.env;
const value = (key, fallback) => env[key]?.trim() || fallback;
const numberValue = (key, fallback) => Number(value(key, String(fallback))) || fallback;
export const AUTH_CONFIG = {
  companyName: value('VITE_COMPANY_NAME', 'Your Company'),
  companyInitial: value('VITE_COMPANY_INITIAL', 'Y'),
  productSubtitle: value('VITE_PRODUCT_SUBTITLE', 'Planning Platform'),
  pageTitle: value('VITE_PAGE_TITLE', 'Planning Platform'),
  planningPhase: value('VITE_PLANNING_PHASE', 'Annual Planning'),
  brandHeadline: value('VITE_BRAND_HEADLINE', 'Planning built for your team.'),
  loginTitle: value('VITE_LOGIN_TITLE', 'Sign in'),
  loginSubtitle: value('VITE_LOGIN_SUBTITLE', 'Sign in to continue.'),
  footerText: value('VITE_FOOTER_TEXT', ''),
  defaultUsername: value('VITE_DEFAULT_USERNAME', ''),
  sessionTimeoutMinutes: numberValue('VITE_SESSION_TIMEOUT_MINUTES', 30),
  passwordPolicy: {
    minimumLength: numberValue('VITE_PASSWORD_MIN_LENGTH', 12),
    expiryDays: numberValue('VITE_PASSWORD_EXPIRY_DAYS', 90),
    historyCount: numberValue('VITE_PASSWORD_HISTORY_COUNT', 5),
  },
  theme: {
    navy: value('VITE_COLOR_NAVY', '#0a2540'),
    navyLight: value('VITE_COLOR_NAVY_LIGHT', '#114b75'),
    blue: value('VITE_COLOR_BLUE', '#0070c0'),
    sky: value('VITE_COLOR_SKY', '#1b90d6'),
    error: value('VITE_COLOR_ERROR', '#c0392b'),
  },
};

export const BRAND_FEATURES = [
  {
    title: value('VITE_FEATURE_1_TITLE', 'Secure'),
    detail: value('VITE_FEATURE_1_DETAIL', 'role-based access for your teams.'),
  },
  {
    title: value('VITE_FEATURE_2_TITLE', 'Integrated'),
    detail: value('VITE_FEATURE_2_DETAIL', 'connected workflows and data.'),
  },
  {
    title: value('VITE_FEATURE_3_TITLE', 'Insightful'),
    detail: value('VITE_FEATURE_3_DETAIL', 'clear dashboards and reporting.'),
  },
];

export const BRAND_CSS_VARIABLES = {
  '--navy': AUTH_CONFIG.theme.navy,
  '--navy-light': AUTH_CONFIG.theme.navyLight,
  '--blue': AUTH_CONFIG.theme.blue,
  '--sky': AUTH_CONFIG.theme.sky,
  '--error': AUTH_CONFIG.theme.error,
};
