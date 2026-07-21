# Reusable branded authentication UI

React 18 sign-in and OTP verification screens with company branding controlled from one `.env` file.

## Required first-time setup

After cloning the repository, run:

```bash
nvm use
npm run setup
```

This installs the exact dependency versions recorded in `package-lock.json`. Run it again whenever `package.json` or `package-lock.json` changes.

## Start locally

After setup completes, run:

```bash
npm run dev
```

To reuse the layout for another company, edit `.env` and restart the server. Component code does not need to change.

## API connection

Set `VITE_API_BASE_URL` in `.env` to the API host, without the `/api/v1` suffix:

```bash
VITE_API_BASE_URL="http://localhost:8000"
```

Authentication screens use the live signup, registration OTP, login OTP, token refresh, password reset, authenticated OTP password change, current-user and logout endpoints. Reusable clients for operational user management, bulk upload/download, reference data, and Excel template generation are available under `src/services`.

See `REQUIREMENTS.md` for runtime, functional, and rebranding requirements.
