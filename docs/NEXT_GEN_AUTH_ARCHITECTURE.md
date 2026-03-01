# Next-Generation Authentication System Architecture
## Project: Femo Space

### 1. Executive Summary
This document outlines the architecture for the "Next-Generation Authentication System" for Femo Space. It functionality exceeds standard implementations found in major platforms like Facebook or TikTok by prioritizing an "Animation-First" user experience backed by "Defense-in-Depth" security principles. The system adheres to strict Global Enterprise standards, suitable for protecting 100M+ users and financial transactions.

### 2. Core Architecture Stack

**Frontend (Client)**:
- **Framework**: React 19 + Vite (TypeScript).
- **Styling**: TailwindCSS (Utility-first) + Custom CSS Variables for Theming.
- **Animation**: Framer Motion (Complex orchestrations, layout animations).
- **State Management**: React Context + Reducers (or Zustand) for complex auth flows.
- **Networking**: Axios with Interceptors (Auto-refresh token handling).

**Backend (Server)**:
- **Framework**: NestJS (Modular, TypeScript).
- **Database**: MongoDB (Mongoose Schema with Validation).
- **Authentication**: Passport.js (Strategies: JWT, Local).
- **Encryption**: Argon2id (Superior resistance to GPU/ASIC cracking vs Bcrypt).
- **Session Management**: Redis (Optional) or MongoDB-backed Refresh Tokens.
- **Real-time**: Socket.io (for live OTP delivery and security alerts).

---

### 3. Detailed Authentication Flows

#### 3.1. Registration Flow (The "Welcome" Experience)
*Philosophy: "Frictionless but Secure Login"*

**Phase 1: Entry & Animation**
- User lands on `Welcome.tsx`.
- "Get Started" triggers the `AuthWizard` modal (AnimatePresence entry).

**Phase 2: Step 1 - Identity (The "Human" Layer)**
- **UI**: Clean, centered card.
- **Fields**:
  - `FirstName` & `LastName` (Floating labels).
  - `Birthday`: Custom Calendar Picker (Scrollable year/month wheels). *Validation: Age > 13*.
  - `Gender`: Visual Selector (Cards with icons, not just a dropdown).
- **Action**: "Next" button (Disabled until valid).
- **Transition**: Slide Left + Fade Out (Step 1) -> Slide In (Step 2).

**Phase 3: Step 2 - Credentials & Legal (The "Secure" Layer)**
- **Fields**:
  - `Email`: Async validation (Debounced check against DB for duplicates).
  - `Country`: Searchable Dropdown with Flags (dataset: `world-countries`).
  - `Password`: 
    - *Visuals*: Reveal Eye Icon.
    - *Strength Meter*: Real-time bar (Red -> Orange -> Green). Checks: Length > 8, Upper, Lower, Number, Symbol.
  - `ConfirmPassword`: Realtime match check.
  - `Terms` & `Privacy`: Custom animated checkboxes.
- **Action**: "Register" button (Triggers loader).
- **Backend Action**: Create "Pending" User -> Hash Password (Argon2) -> Generate 6-digit OTP -> Send Email.

**Phase 4: Step 3 - Verification (The "Trust" Layer)**
- **UI**: 6 Split Input Boxes (OTP Input).
- **Behavior**: Auto-advance focus, Paste-support.
- **Timer**: 10:00 countdown. "Resend" link appears after 60s.
- **Action**: Auto-submit on 6th digit or manual "Verify".
- **Backend Action**: Validate OTP -> Mark Email Verified -> Issue Access/Refresh Tokens.

#### 3.2. Login Flow
- **Fields**: Email + Password.
- **Security Check**:
  - If Email Verified -> Proceed.
  - If Unverified -> Redirect to OTP screen.
  - If Suspicious (New Device/IP) -> Trigger "Device Verification" (Email/SMS OTP).

#### 3.3. Token Management (The "Invisible" Layer)
- **Access Token**: Short-lived (15 mins), JWT signed. Stored in memory (closure variable) or non-accessible storage.
- **Refresh Token**: Long-lived (7 days), Randomly generated (Opaque). Stored in **HttpOnly, Secure, SameSite=Strict Cookie**.
- **Rotation**: Every time a Refresh Token is used, a NEW one is issued. The old one is invalidated. This detects token theft (Reuse Detection).

---

### 4. UI/UX Behavior & Requirements (Per Screen)

#### A. Global Features
- **Language Selector**: Facebook-style modal. Auto-detects browser locale. instantly switches `i18n` text.
- **Theme**: Dark Mode default (Premium, Deep Space Blue/Black). Glassmorphism elements.

#### B. Component Hierarchy (`web-app/src`)

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthWizard.tsx        # Main Orchestrator
│   │   ├── Steps/
│   │   │   ├── IdentityStep.tsx  # Step 1
│   │   │   ├── CredentialsStep.tsx # Step 2
│   │   │   └── VerificationStep.tsx # Step 3 (OTP)
│   │   ├── Shared/
│   │   │   ├── PasswordStrength.tsx
│   │   │   ├── OTPInput.tsx
│   │   │   ├── CountrySelector.tsx
│   │   │   └── CalendarPicker.tsx
│   │   └── Guard/
│   │       ├── ProtectedRoute.tsx
│   │       └── GuestRoute.tsx    # For Login/Register pages
```

---

### 5. Backend Module Structure (NestJS)

#### Directory: `backend/src`

**1. Auth Module (`/auth`)**
- `auth.controller.ts`: Endpoints (`/register`, `/login`, `/refresh`, `/logout`, `/verify-email`).
- `auth.service.ts`: Core logic (hashing, token generation).
- `strategies/`: Path for Passport strategies (`jwt.strategy.ts`, `local.strategy.ts`).
- `guards/`: Custom guards (`jwt-auth.guard.ts`, `roles.guard.ts`).

**2. User Module (`/users`)**
- `user.schema.ts`: Mongoose schema.
  - Fields: `email` (indexed), `passwordHash`, `isEmailVerified`, `roles`, `profile` (embedded), `security` (login attempts, lockouts).
- `user.service.ts`: DB operations.

**3. Communication Module (`/communication`)**
- `mail.service.ts`: Wrapper for AWS SES or Nodemailer.
- `sms.service.ts`: Wrapper for Twilio/SNS.

**4. Security (Global)**
- `rate-limiter.middleware.ts`: Redis-backed throttler.
- `helmet`: HTTP Header security.

---

### 6. Security Decisions & Justifications

1.  **Why Argon2 instead of Bcrypt?**
    *   **Reason**: Argon2 is the winner of the Password Hashing Competition. It is memory-hard, making it significantly more resistant to GPU/ASIC brute-force attacks than Bcrypt.

2.  **Why Refresh Token Rotation?**
    *   **Reason**: If a Refresh Token is stolen, the attacker can use it indefinitely until expiry. With Rotation, the legitimate user usage invalidates the stolen token, alerting the system to a breach (Token Reuse Detection), allowing us to revoke the entire chain.

3.  **Why HttpOnly Cookies?**
    *   **Reason**: Storing tokens in `localStorage` subjects them to XSS attacks. If a malicious script runs on your page, it can read localStorage. It *cannot* read HttpOnly cookies.

4.  **No "User Enumeration"**
    *   **Reason**: Login errors will be generic ("Invalid credentials") to prevent attackers from checking if an email exists. However, *Registration* requires checking duplicates - we will rate-limit this endpoint heavily.

5.  **Multi-Factor Architecture**
    *   **Reason**: The user requires Phone Verification for critical actions. We will build a unified "VerificationService" that serves both Registration (Email) and Sensitive Actions (Phone).

---
