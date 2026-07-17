const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

// Replace these methods with HTTP calls when the backend is ready.
export const authService = {
  async requestOtp(credentials) {
    await wait(650);
    return {
      challengeId: crypto.randomUUID?.() ?? String(Date.now()),
      destination: credentials.username,
    };
  },

  async verifyOtp({ code }) {
    await wait(650);
    return { authenticated: /^\d{6}$/.test(code) };
  },

  async resendOtp() {
    await wait(500);
    return { sent: true };
  },

  async requestPasswordReset(email) {
    await wait(650);
    return { sent: true, destination: email };
  },

  async changePassword() {
    await wait(650);
    // The backend must enforce expiry and reject the last configured password hashes.
    return { changed: true };
  },

  async registerUser(registration) {
    await wait(750);
    return { submitted: true, email: registration.email };
  },
};
