import { apiRequest, tokenStorage } from '@/services/apiClient';
import { ENDPOINTS } from '@/services/endpoints';

const resendOtp = (email, purpose) => apiRequest(ENDPOINTS.auth.resendOtp, {
  method: 'POST', auth: false, body: { email, purpose },
});

const verifyOtpRequest = (email, purpose, otp) => apiRequest(ENDPOINTS.auth.verifyOtp, {
  method: 'POST', auth: false, body: { email, purpose, otp },
});

const registrationPayload = (registration) => ({
  first_name: registration.firstName,
  last_name: registration.lastName,
  username: registration.username,
  email: registration.email,
  password: registration.password,
  role: registration.role,
  segment: registration.segments,
  channel: registration.channels,
  brand: registration.brands,
});

export const authService = {
  health: () => apiRequest(ENDPOINTS.health, { auth: false }),

  async requestOtp({ username, password }) {
    const response = await apiRequest(ENDPOINTS.auth.login, {
      method: 'POST',
      auth: false,
      body: {
        identifier: username.trim(),
        email: username.trim(),
        password,
      },
    });
    return {
      challengeId: response.challenge_id,
      destination: response.email,
      purpose: response.purpose,
      expiresAt: response.expires_at,
      resendAvailableAt: response.resend_available_at,
    };
  },

  async verifyOtp({ email, code }) {
    const response = await verifyOtpRequest(email, 'LOGIN', code);
    tokenStorage.setTokens(response);
    return { ...response, authenticated: Boolean(response.access_token) };
  },

  resendOtp: (email) => resendOtp(email, 'LOGIN'),

  async registerUser(registration) {
    const response = await apiRequest(ENDPOINTS.auth.signup, {
      method: 'POST', auth: false, body: registrationPayload(registration),
    });
    return { ...response, email: registration.email };
  },

  verifyRegistrationOtp: (email, otp) => verifyOtpRequest(email, 'REGISTRATION', otp),
  resendRegistrationOtp: (email) => resendOtp(email, 'REGISTRATION'),

  requestPasswordReset(email) {
    return apiRequest(ENDPOINTS.auth.forgotPassword, {
      method: 'POST', auth: false, body: { email },
    });
  },

  resetPassword({ email, otp, newPassword }) {
    return apiRequest(ENDPOINTS.auth.resetPassword, {
      method: 'POST', auth: false, body: { email, otp, new_password: newPassword },
    });
  },

  changePassword({ current, next }) {
    return apiRequest(ENDPOINTS.auth.changePassword, {
      method: 'POST', body: { current_password: current, new_password: next },
    });
  },

  getCurrentUser: () => apiRequest(ENDPOINTS.auth.currentUser),

  async logout() {
    try {
      return await apiRequest(ENDPOINTS.auth.logout, { method: 'POST', skipRefresh: true });
    } finally {
      tokenStorage.clear();
    }
  },
};
