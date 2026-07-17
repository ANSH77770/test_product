# Authentication UI requirements

## Runtime

- Node.js 20.19+ or Node.js 22.12+
- npm 10+
- Modern browser with JavaScript enabled

## Frontend dependencies

- React 18
- React DOM 18
- React Router DOM 6
- Vite 6

The exact dependency ranges are maintained in `package.json` and the resolved versions are locked in `package-lock.json`.

## Mandatory installation

Run this once after cloning and whenever dependency files change:

```bash
nvm use
npm run setup
```

`npm run setup` executes `npm ci`, which installs the exact dependency versions from `package-lock.json`. Do not manually install packages from a separate requirements list.

## Functional requirements

- Responsive company-branded sign-in screen
- Username/email, password, role and remember-me controls
- Client-side required-field validation
- Password visibility toggle
- Login submission followed by navigation to OTP verification
- Six-digit OTP entry, paste support, resend and change-email actions
- UI components independent from authentication service and routing logic
- Company identity and theme configurable without component changes
- Forgot-password and change-password flows
- Minimum 12-character passwords containing uppercase, lowercase, number and special character
- Passwords must not contain the user's name or email ID
- Password expiry after 90 days, enforced by the backend
- Last 5 passwords cannot be reused, enforced by the backend
- Idle sessions expire after 30 minutes by default
- Registration requires name, email, password, segment, channel and brand
- Segment, channel and brand use predefined searchable multi-select master data
- Users can be assigned multiple Segments, Channels and Brands
- Record visibility is restricted to the intersection of the user's assigned access
- Users select requested access during onboarding and administrators can modify it later
- Administrators can create, rename, activate and deactivate master-data values

## Rebranding

1. Copy `.env.example` to `.env`.
2. Change the `VITE_COMPANY_*`, text, feature, role and color variables.
3. Restart the Vite development server after changing environment variables.

Do not place passwords, private API keys or server secrets in `VITE_*` variables. Vite exposes these variables to browser code.
