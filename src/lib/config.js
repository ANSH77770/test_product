/**
 * Centralized Multi-Company / White-Label Configuration
 * All brand identity tokens are loaded from environment variables (.env file).
 * Any SaaS product adopting this authentication module can modify .env to completely brand the UI.
 */

export const BRAND_CONFIG = {
  // Company Name (e.g. ApexAuth, Acme Corp, Linear, Stripe)
  companyName: import.meta.env.VITE_COMPANY_NAME || 'ApexAuth',

  // Company Badge / Tier (e.g. ENTERPRISE, PRO, SSO, BETA)
  companyBadge: import.meta.env.VITE_COMPANY_BADGE || 'ENTERPRISE',

  // Custom Logo URL (if empty, defaults to the built-in modern Shield icon)
  logoUrl: import.meta.env.VITE_COMPANY_LOGO_URL || '',

  // Browser Favicon URL (.ico, .png, or .svg)
  faviconUrl: import.meta.env.VITE_FAVICON_URL || '/favicon.svg',

  // Browser Tab Title
  appTitle: import.meta.env.VITE_APP_TITLE || 'ApexAuth Enterprise SSO',

  // Footer Copyright & Architecture Notice
  footerCopyright:
    import.meta.env.VITE_FOOTER_COPYRIGHT ||
    `Protected by ${import.meta.env.VITE_COMPANY_NAME || 'ApexAuth'} Zero-Trust Architecture. All rights reserved.`,

  // Default UI Theme ('light' or 'dark')
  defaultTheme: import.meta.env.VITE_DEFAULT_THEME || 'light',
};

export default BRAND_CONFIG;
