# API Protocol v1 — Business Planning & Forecasting Platform

**Base path:** `/api/v1`
**Auth scheme:** `Authorization: Bearer <token>`
**Content type:** `application/json` for all requests/responses, except template generation which returns a binary file.

---

## 1. Authentication & Session Model

- Registration and login are **OTP-based** (two-factor).
- JWT access tokens are issued **only after login OTP verification** — login itself returns a challenge, not a token.
- Admin endpoints (`/api/v1/users/*`) require an authenticated **admin** JWT.
- Template generation requires an authenticated **active** user JWT.
- Registration and login OTPs share **one verification endpoint** (`POST /api/v1/auth/otp/verify`); the response shape differs by `purpose`.

---

## 2. End-to-End Flows

### 2.1 User Registration
```
POST /api/v1/auth/users
  → OTP challenge created, registration OTP sent
POST /api/v1/auth/otp/verify   (purpose=REGISTRATION)
  → user created with status = PENDING_APPROVAL
[Admin reviews and approves/rejects]
```

### 2.2 Admin Approval
```
GET /api/v1/users/pending
  → list of PENDING_APPROVAL users
PUT /api/v1/users/{user_id}/status   (status=ACTIVE, + scope/permissions)
  → user becomes ACTIVE, can now log in
   — or —
PUT /api/v1/users/{user_id}/status   (status=REJECTED)
  → user becomes REJECTED
```

### 2.3 Login
```
POST /api/v1/auth/login
  → credentials validated, login OTP sent, challenge returned
POST /api/v1/auth/otp/verify   (purpose=LOGIN)
  → access_token issued
```

### 2.4 Template Generation
```
POST /api/v1/templates   (Bearer token, ACTIVE user)
  → binary .xlsx file returned
```

---

## 3. Endpoint Catalog

### Authentication

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/v1/auth/users` | No | Start registration, send registration OTP |
| POST | `/api/v1/auth/otp` | No | Send/resend OTP (registration or login) |
| POST | `/api/v1/auth/otp/verify` | No | Verify OTP — union response by `purpose` |
| POST | `/api/v1/auth/login` | No | Validate credentials, trigger login OTP challenge |
| GET | `/api/v1/auth/users/me` | Yes | Fetch current authenticated user |
| POST | `/api/v1/auth/logout` | Yes | Logout (placeholder — no token revocation yet) |

### Users / Admin
*All require an admin bearer token.*

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/users/pending` | List pending registrations |
| GET | `/api/v1/users` | List all users |
| POST | `/api/v1/users` | Create a user directly (bypasses OTP flow) |
| PUT | `/api/v1/users/{user_id}/status` | Approve (`ACTIVE`) or reject (`REJECTED`) a user |
| DELETE | `/api/v1/users/{user_id}` | Delete a user |

### Templates

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/v1/templates` | Yes (ACTIVE user) | Generate and download an Excel planning template |

---

## 4. Endpoint Details

### `POST /api/v1/auth/users`
**Request**
```json
{
  "first_name": "Amit",
  "last_name": "Sharma",
  "username": "amit.sharma",
  "email": "amit@example.com",
  "password": "Password123!",
  "segment": ["North"],
  "channel": ["Retail"],
  "brand": ["BrandA"]
}
```
**Response `201`**
```json
{
  "success": true,
  "message": "Registration OTP sent successfully.",
  "status": "PENDING_OTP"
}
```

---

### `POST /api/v1/auth/otp/verify`
**Request**
```json
{
  "email": "amit@example.com",
  "purpose": "REGISTRATION",
  "otp": "123456"
}
```

**Response `200` — when `purpose = REGISTRATION`**
```json
{
  "id": "8e2c6f54-7b9a-4b4d-8d1f-5d3f7e8f2b11",
  "first_name": "Amit",
  "last_name": "Sharma",
  "username": "amit.sharma",
  "email": "amit@example.com",
  "role": "USER",
  "status": "PENDING_APPROVAL",
  "created_at": "2026-07-20T10:15:30Z"
}
```

**Response `200` — when `purpose = LOGIN`**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 900
}
```

---

### `POST /api/v1/auth/otp`
**Request**
```json
{
  "email": "amit@example.com",
  "purpose": "LOGIN"
}
```
**Response `200`**
```json
{
  "success": true,
  "message": "OTP resent successfully.",
  "status": "PENDING_OTP"
}
```

---

### `POST /api/v1/auth/login`
**Request**
```json
{
  "identifier": "amit.sharma",
  "password": "Password123!"
}
```
**Response `200`**
```json
{
  "challenge_id": "b0f5f7fd2a3a4a4e9c1bb6f35b6d20f1",
  "purpose": "LOGIN",
  "email": "amit@example.com",
  "expires_at": "2026-07-20T10:20:30Z",
  "resend_available_at": "2026-07-20T10:15:30Z"
}
```

---

### `GET /api/v1/auth/users/me`
Header: `Authorization: Bearer <token>`
**Response `200`** → `UserResponse` schema (see §5)

---

### `POST /api/v1/auth/logout`
**Response `200`**
```json
{
  "success": true,
  "message": "Logout endpoint is reserved for future token revocation support.",
  "data": null
}
```

---

### `GET /api/v1/users/pending`
**Response `200`**
```json
{
  "users": [
    {
      "id": "8e2c6f54-7b9a-4b4d-8d1f-5d3f7e8f2b11",
      "first_name": "Amit",
      "last_name": "Sharma",
      "username": "amit.sharma",
      "email": "amit@example.com",
      "role": "USER",
      "status": "PENDING_APPROVAL",
      "segment": ["North"],
      "channel": ["Retail"],
      "brand": ["BrandA"],
      "permissions": [],
      "created_at": "2026-07-20T10:15:30Z",
      "updated_at": "2026-07-20T10:15:30Z"
    }
  ]
}
```

---

### `GET /api/v1/users`
**Response `200`**
```json
{ "users": [] }
```

---

### `POST /api/v1/users`
**Request**
```json
{
  "first_name": "Amit",
  "last_name": "Sharma",
  "username": "amit.sharma",
  "email": "amit@example.com",
  "password": "Password123!",
  "segment": ["North"],
  "channel": ["Retail"],
  "brand": ["BrandA"],
  "permissions": ["REPORT_VIEW"],
  "role": "USER",
  "status": "ACTIVE"
}
```
**Response `201`** → `UserResponse` schema

---

### `PUT /api/v1/users/{user_id}/status`
**Approve — request**
```json
{
  "status": "ACTIVE",
  "segment": ["North"],
  "channel": ["Retail"],
  "brand": ["BrandA"],
  "permissions": ["REPORT_VIEW"]
}
```
**Reject — request**
```json
{ "status": "REJECTED" }
```
**Response `200`** → `UserResponse` schema

---

### `DELETE /api/v1/users/{user_id}`
**Response `200`**
```json
{
  "success": true,
  "message": "User deleted successfully."
}
```

---

### `POST /api/v1/templates`
Header: `Authorization: Bearer <token>`
Optional headers: `X-Request-ID`, `X-Correlation-ID`

**Request**
```json
{
  "planning_cycle": "FY2027-2028",
  "planning_years": [2027, 2028],
  "template_version": "1.0.0",
  "workbook_version": "1.0.0"
}
```
**Response `200`**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Body: binary `.xlsx` file (not JSON)

---

## 5. JSON Schemas

### Auth Schemas

**`SignupRequest`**
```json
{
  "first_name": "string",
  "last_name": "string",
  "username": "string",
  "email": "email",
  "password": "string",
  "segment": ["string"],
  "channel": ["string"],
  "brand": ["string"]
}
```

**`SignupResponse`**
```json
{
  "id": "string",
  "first_name": "string",
  "last_name": "string",
  "username": "string",
  "email": "email",
  "role": "ADMIN | USER",
  "status": "PENDING_OTP | PENDING_APPROVAL | ACTIVE | REJECTED | INACTIVE",
  "created_at": "datetime"
}
```

**`LoginRequest`**
```json
{
  "identifier": "string",
  "password": "string"
}
```

**`LoginOtpChallengeResponse`**
```json
{
  "challenge_id": "string",
  "purpose": "LOGIN",
  "email": "email",
  "expires_at": "datetime",
  "resend_available_at": "datetime | null"
}
```

**`LoginResponse`**
```json
{
  "access_token": "string",
  "token_type": "bearer",
  "expires_in": 900
}
```

**`OTPPurpose`**
```json
"REGISTRATION | LOGIN"
```

**`OTPRequest`**
```json
{
  "email": "email",
  "purpose": "REGISTRATION | LOGIN",
  "otp": "123456"
}
```

**`OTPVerifyResponse`**
```json
{
  "success": true,
  "message": "string",
  "status": "PENDING_OTP | PENDING_APPROVAL | ACTIVE | REJECTED | INACTIVE | null"
}
```

**`OTPResendRequest`**
```json
{
  "email": "email",
  "purpose": "REGISTRATION | LOGIN"
}
```

**`UserResponse`**
```json
{
  "id": "string",
  "first_name": "string",
  "last_name": "string",
  "username": "string",
  "email": "email",
  "role": "ADMIN | USER",
  "status": "PENDING_OTP | PENDING_APPROVAL | ACTIVE | REJECTED | INACTIVE",
  "segment": ["string"],
  "channel": ["string"],
  "brand": ["string"],
  "permissions": ["string"],
  "created_at": "datetime | null",
  "updated_at": "datetime | null"
}
```

**`UserListResponse`**
```json
{
  "users": [
    {
      "id": "string",
      "first_name": "string",
      "last_name": "string",
      "username": "string",
      "email": "email",
      "role": "ADMIN | USER",
      "status": "PENDING_OTP | PENDING_APPROVAL | ACTIVE | REJECTED | INACTIVE",
      "segment": ["string"],
      "channel": ["string"],
      "brand": ["string"],
      "permissions": ["string"],
      "created_at": "datetime | null",
      "updated_at": "datetime | null"
    }
  ]
}
```

**`AdminApprovalRequest`**
```json
{
  "segment": ["string"],
  "channel": ["string"],
  "brand": ["string"],
  "permissions": ["string"]
}
```

**`AdminUserStatusUpdateRequest`**
```json
{
  "status": "ACTIVE | REJECTED",
  "segment": ["string"],
  "channel": ["string"],
  "brand": ["string"],
  "permissions": ["string"]
}
```

**`AdminCreateUserRequest`**
```json
{
  "first_name": "string",
  "last_name": "string",
  "username": "string",
  "email": "email",
  "password": "string",
  "segment": ["string"],
  "channel": ["string"],
  "brand": ["string"],
  "permissions": ["string"],
  "role": "ADMIN | USER",
  "status": "PENDING_OTP | PENDING_APPROVAL | ACTIVE | REJECTED | INACTIVE"
}
```

**`AdminDeleteUserResponse`**
```json
{
  "success": true,
  "message": "string"
}
```

**`APIMessageResponse`**
```json
{
  "success": true,
  "message": "string",
  "data": {}
}
```

### Template Schemas

**`GenerateTemplateRequest`**
```json
{
  "planning_cycle": "FY2027-2028",
  "planning_years": [2027, 2028],
  "template_version": "1.0.0",
  "workbook_version": "1.0.0"
}
```

**`GenerateTemplateErrorResponse`**
```json
{
  "detail": "string",
  "error_code": "string"
}
```

---

## 6. UI Screens This API Supports

1. Registration screen (signup form)
2. OTP entry screen — registration verification
3. Login screen (identifier + password)
4. OTP entry screen — login verification
5. User dashboard — reads from `/auth/users/me`
6. Admin approval dashboard — pending list + approve/reject actions
7. User management list — create, update status, delete
8. Template generation screen — for active users

---

## 7. Practical Integration Notes

- Registration OTP and login OTP share **one verification endpoint** — only `purpose` changes; branch the response handling accordingly (`REGISTRATION` → user object, `LOGIN` → token object).
- For browser file download on `POST /api/v1/templates`, request as `blob` (or platform equivalent) — response is binary, not JSON.
- On `401` — re-authenticate or refresh the token flow.
- On `403` during template generation — the current user is not `ACTIVE`.
- `GenerateTemplateErrorResponse` includes an `error_code` field in addition to `detail` — surface this in the UI for more specific error handling (e.g. distinguishing "invalid cycle" from "user not active").

---

## 8. Open Items to Confirm With Backend

- **OTP delivery channel** — this document says registration OTP is *emailed*; earlier dev-environment testing observed OTPs printed to the server terminal instead. Confirm which is accurate for each environment (local/dev/staging/prod) before building delivery-channel-dependent UI copy (e.g. "check your email" vs "check your SMS").
- **Admin authorization** — confirm whether `/api/v1/users/*` currently enforces real role-based checks or still uses a placeholder guard (earlier review found placeholder-only); this affects whether non-admin tokens should be expected to fail these calls.
- **`role` field** — appears in `UserResponse`/`SignupResponse` but not in the public `SignupRequest` — confirm self-signup always defaults to `role: USER`, with `ADMIN` only assignable via `AdminCreateUserRequest`.
