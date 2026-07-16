/**
 * Constants for the enterprise authentication module.
 */

export const OTP_TIMER_DURATION = 30; // Seconds
export const OTP_LENGTH = 6;

export const DEFAULT_COUNTRY = {
  code: 'IN',
  dialCode: '+91',
  name: 'India',
  flag: '🇮🇳',
  format: 'XXXXX XXXXX',
  maxLength: 10,
};

export const COUNTRIES = [
  DEFAULT_COUNTRY,
  {
    code: 'US',
    dialCode: '+1',
    name: 'United States',
    flag: '🇺🇸',
    format: '(XXX) XXX-XXXX',
    maxLength: 10,
  },
  {
    code: 'GB',
    dialCode: '+44',
    name: 'United Kingdom',
    flag: '🇬🇧',
    format: 'XXXX XXXXXX',
    maxLength: 10,
  },
  {
    code: 'SG',
    dialCode: '+65',
    name: 'Singapore',
    flag: '🇸🇬',
    format: 'XXXX XXXX',
    maxLength: 8,
  },
  {
    code: 'AE',
    dialCode: '+971',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    format: 'XX XXX XXXX',
    maxLength: 9,
  },
  {
    code: 'AU',
    dialCode: '+61',
    name: 'Australia',
    flag: '🇦🇺',
    format: 'XXX XXX XXX',
    maxLength: 9,
  },
  {
    code: 'DE',
    dialCode: '+49',
    name: 'Germany',
    flag: '🇩🇪',
    format: 'XXXX XXXXXXX',
    maxLength: 11,
  },
  {
    code: 'JP',
    dialCode: '+81',
    name: 'Japan',
    flag: '🇯🇵',
    format: 'XX-XXXX-XXXX',
    maxLength: 10,
  },
  {
    code: 'CA',
    dialCode: '+1',
    name: 'Canada',
    flag: '🇨🇦',
    format: '(XXX) XXX-XXXX',
    maxLength: 10,
  },
];

export const BRAND_FEATURES = [
  {
    id: 'secure-auth',
    title: 'Secure Authentication',
    description: 'Enterprise-grade encryption and zero-trust verification ensuring your data remains protected at every layer.',
    iconName: 'ShieldCheck',
    badge: 'SOC 2 Compliant',
  },
  {
    id: 'fast-access',
    title: 'Fast Access',
    description: 'Sub-100ms global edge authentication with instant token exchange and frictionless session management.',
    iconName: 'Zap',
    badge: '99.99% Uptime',
  },
  {
    id: 'enterprise-security',
    title: 'Enterprise Security',
    description: 'Advanced anomaly detection, biometric hardware keys, and automated threat mitigation engineered for scale.',
    iconName: 'Lock',
    badge: 'End-to-End',
  },
];

export const FOOTER_LINKS = [
  { label: 'Terms', href: '#terms' },
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Need Help', href: '#help' },
];
