import { apiRequest, tokenStorage } from '@/services/apiClient';

const API = '/api/v1/auth';

export const authService = {
  health: () => apiRequest('/health', { auth: false }),

  async requestOtp({ username, password, rememberMe = false }) {
    const response = await apiRequest(`${API}/login`, {
      method: 'POST', auth: false, body: { identifier: username, password },
    });
    return {
      challengeId: response.challenge_id,
      destination: response.email,
      purpose: response.purpose,
      expiresAt: response.expires_at,
      resendAvailableAt: response.resend_available_at,
      rememberMe,
    };
  },

  async verifyOtp({ email, code, rememberMe = false }) {
    const response = await apiRequest(`${API}/verify-login-otp`, {
      method: 'POST', auth: false, body: { email, purpose: 'LOGIN', otp: code },
    });
    tokenStorage.set(response.access_token, rememberMe);
    return { ...response, authenticated: Boolean(response.access_token) };
  },

  resendOtp(email) {
    return apiRequest(`${API}/resend-login-otp`, {
      method: 'POST', auth: false, body: { email, purpose: 'LOGIN' },
    });
  },

  async registerUser(registration) {
    const nameParts = registration.name.trim().split(/\s+/);
    const firstName = nameParts.shift();
    const lastName = nameParts.join(' ') || firstName;
    const response = await apiRequest(`${API}/signup`, {
      method: 'POST',
      auth: false,
      body: {
        first_name: firstName,
        last_name: lastName,
        username: registration.username || registration.email.split('@')[0],
        email: registration.email,
        password: registration.password,
        segment: registration.segments,
        channel: registration.channels,
        brand: registration.brands,
      },
    });
    return { ...response, email: registration.email };
  },

  verifyRegistrationOtp(email, otp) {
    return apiRequest(`${API}/verify-registration-otp`, {
      method: 'POST', auth: false, body: { email, purpose: 'REGISTRATION', otp },
    });
  },

  resendRegistrationOtp(email) {
    return apiRequest(`${API}/resend-registration-otp`, {
      method: 'POST', auth: false, body: { email, purpose: 'REGISTRATION' },
    });
  },

  // These screens remain in demo mode because the supplied API reference does
  // not define password-reset or password-change endpoints.
  async requestPasswordReset(email) {
    return { sent: true, destination: email, demo: true };
  },

  async changePassword() {
    return { changed: true, demo: true };
  },

  getCurrentUser: () => apiRequest(`${API}/me`),

  async logout() {
    try {
      return await apiRequest(`${API}/logout`, { method: 'POST' });
    } finally {
      tokenStorage.clear();
    }
  },
};
