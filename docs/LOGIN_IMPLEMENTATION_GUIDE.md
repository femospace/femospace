# Femo Space Login System - Implementation Guide

## 🚀 Quick Start

### Backend Setup (NestJS)

#### 1. New Files Created
```
backend/src/auth/
├── dto/
│   ├── login.dto.ts (existing)
│   └── login-identifier.dto.ts ✅ NEW
├── utils/
│   ├── identifier.utils.ts ✅ NEW
│   └── password.utils.ts ✅ NEW
├── auth.service.ts (extended)
└── auth.controller.ts (extended)
```

#### 2. Key Methods Added

**auth.service.ts** - New method:
```typescript
async loginWithIdentifier(
  loginDto: LoginIdentifierDto,
  context: { ipAddress: string; userAgent: string; deviceId: string }
)
```

**users.service.ts** - New method:
```typescript
async findByIdentifier(
  filter: { femoId: number } | { femoMail: string }
): Promise<UserDocument | null>
```

**auth.controller.ts** - New endpoint:
```typescript
@Post('login/identifier')
async loginWithIdentifier(
  @Body() dto: LoginIdentifierDto,
  @Req() req: any,
  @Res({ passthrough: true }) res: Response
)
```

---

### Frontend Setup (React)

#### 1. New Files Created
```
web-app/src/auth/
├── pages/
│   ├── Register.tsx (existing)
│   └── Login.tsx ✅ NEW (complete component)
├── api/
│   └── auth.service.ts ✅ NEW (API integration)
├── utils/
│   ├── identifier.utils.ts ✅ NEW
│   └── validation.utils.ts ✅ NEW
└── ... (other files)
```

#### 2. Login Page Features
- ✅ Single identifier input (Femo ID or Femo Mail)
- ✅ Real-time validation with type detection
- ✅ Password input with show/hide toggle
- ✅ Inline error messages
- ✅ Loading state with spinner
- ✅ Animated button
- ✅ Error handling & recovery
- ✅ Links to register & forgot password

---

## 📋 Database Schema

No migration needed - fields already exist:

```typescript
User {
  femoId: number (unique, indexed) ✅
  femoMail: string (unique, indexed) ✅
  email: string (unique, indexed)
  passwordHash: string
  isEmailVerified: boolean
  
  security: {
    loginAttempts: number
    lockoutUntil: Date | null
    lastLoginAt: Date
    lastLoginIp: string
    // ... other fields
  }
}
```

---

## 🔌 API Endpoints

### New Endpoint
- **POST** `/auth/login/identifier`
  - Accepts: `{ identifier, password }`
  - Auto-detects: Femo ID (numeric) or Femo Mail (email)
  - Returns: Tokens + User info OR MFA challenge

### Existing Endpoints (Unchanged)
- **POST** `/auth/register`
- **POST** `/auth/login` (email-based)
- **POST** `/auth/login/mfa`
- **POST** `/auth/refresh`
- **POST** `/auth/logout`

---

## 🧪 Testing the Implementation

### 1. Test with cURL

**Valid Femo ID:**
```bash
curl -X POST http://localhost:3000/auth/login/identifier \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "1000021",
    "password": "User@1234"
  }'
```

**Valid Femo Mail:**
```bash
curl -X POST http://localhost:3000/auth/login/identifier \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "user@femo.com",
    "password": "User@1234"
  }'
```

**Invalid Identifier (should error):**
```bash
curl -X POST http://localhost:3000/auth/login/identifier \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "invalid!@#",
    "password": "User@1234"
  }'
```

### 2. Test in React App

Navigate to `/auth/login`:
1. **Try Femo ID** - Enter numeric ID (e.g., 1000021)
   - Should show green checkmark: "✓ Femo ID detected"
2. **Try Femo Mail** - Enter email (e.g., user@femo.com)
   - Should show green checkmark: "✓ Femo Mail detected"
3. **Try invalid** - Enter "abc!@#"
   - Should show red error: "⚠ Please enter a valid..."
4. **Enter password** - Type any valid password
5. **Submit** - Should login or show error

### 3. Test Edge Cases

**Email not verified:**
- Create user without verifying email
- Try to login
- Should see: "Email not verified..."

**Brute force (5 failures):**
- Wrong password 5 times
- Should lock account for 15 minutes
- Try again after timeout (should work)

**Risk blocked:**
- Suspicious pattern detected
- Should see: "Access blocked due to security risk"

---

## 🛠️ Integration Checklist

- [ ] Backend files created and imports added
- [ ] `LoginIdentifierDto` added to `auth.dto`
- [ ] Identifier utilities added to backend
- [ ] `findByIdentifier()` method added to `UsersService`
- [ ] `loginWithIdentifier()` method added to `AuthService`
- [ ] `/auth/login/identifier` endpoint added to controller
- [ ] Frontend Login page component created
- [ ] Identifier utilities added to frontend
- [ ] Validation utilities added to frontend
- [ ] Auth API service created
- [ ] Routes configured (if needed)
- [ ] Tested with sample data
- [ ] Tested edge cases

---

## 📂 File Structure Summary

### Backend Changes
```
✅ backend/src/auth/dto/login-identifier.dto.ts (NEW)
✅ backend/src/auth/utils/identifier.utils.ts (NEW)
✅ backend/src/auth/utils/password.utils.ts (NEW)
✏️ backend/src/auth/auth.service.ts (EXTENDED)
✏️ backend/src/auth/auth.controller.ts (EXTENDED)
✏️ backend/src/users/users.service.ts (EXTENDED)
```

### Frontend Changes
```
✅ web-app/src/auth/pages/Login.tsx (NEW)
✅ web-app/src/auth/api/auth.service.ts (NEW)
✅ web-app/src/auth/utils/identifier.utils.ts (NEW)
✅ web-app/src/auth/utils/validation.utils.ts (NEW)
```

### Documentation
```
✅ docs/LOGIN_API_DOCUMENTATION.md (NEW)
✅ docs/LOGIN_IMPLEMENTATION_GUIDE.md (THIS FILE)
```

---

## 🔐 Security Features Implemented

### ✅ Identifier Validation
- Auto-detects Femo ID vs Femo Mail
- Regex validation: `^\d+$` for ID, email regex for mail
- Client-side + server-side validation

### ✅ Email Verification
- Blocks login if `isEmailVerified === false`
- Shows user-friendly message
- Logs attempt for audit

### ✅ Brute Force Protection
- Max 5 failed attempts
- 15-minute lockout
- Resets on successful login
- Tracked in `security.loginAttempts`

### ✅ Password Security
- bcrypt/argon2 hashing
- Strong requirements (8+ chars, mixed case, digits, special)
- Never stored in plaintext
- Verified on every login

### ✅ Session Management
- Access token: 15 min expiry
- Refresh token: 7 days expiry
- Device tracking (ID, IP, user agent)
- Stored in httpOnly cookies

### ✅ Audit Logging
- All login attempts logged
- Success/failure tracked
- Risk assessment recorded
- User context preserved

### ✅ Rate Limiting
- Backend security service
- IP + Device tracking
- Risk-based blocking
- Configurable thresholds

---

## 🧩 Utility Functions Reference

### Backend Utilities

**identifier.utils.ts:**
```typescript
detectIdentifierType(identifier) → IdentifierType
isValidFemoMail(email) → boolean
isValidFemoId(femoId) → boolean
sanitizeIdentifier(identifier) → string
getIdentifierQueryFilter(identifier) → MongoDB filter | null
validateIdentifier(identifier) → { valid, error?, type? }
```

**password.utils.ts:**
```typescript
validatePassword(password) → PasswordStrengthResult
getPasswordStrengthLabel(score) → string
isPasswordValid(password) → boolean
```

### Frontend Utilities

**identifier.utils.ts:**
```typescript
detectIdentifierType(identifier) → IdentifierType
isValidFemoMail(email) → boolean
isValidFemoId(femoId) → boolean
sanitizeIdentifier(identifier) → string
getIdentifierTypeLabel(type) → string
```

**validation.utils.ts:**
```typescript
validatePassword(password) → PasswordStrengthResult
getPasswordStrengthLabel(score) → string
getPasswordStrengthColor(score) → string
isValidPassword(password) → boolean
isValidEmail(email) → boolean
validateRequired(value, fieldName) → ValidationResult
```

---

## 🌐 API Service Methods

```typescript
authService.loginWithIdentifier(request) → LoginResponse
authService.login(email, password) → LoginResponse
authService.logout() → void
authService.verifyMfa(userId, token) → LoginResponse
authService.requestPasswordReset(email) → void
authService.refreshTokens() → { access_token }
```

---

## 🔄 Error Handling Flow

```
User Input
    ↓
Frontend Validation
    ├─ Empty? → Show "Required" error
    ├─ Invalid format? → Show "Invalid format" error
    └─ Valid? → Continue
         ↓
API Request
    ├─ Network error? → Show "Connection error"
    ├─ Invalid credentials? → Show "Invalid ID/Mail or password"
    ├─ Email not verified? → Show "Verify email first"
    ├─ Account locked? → Show "Account locked, try later"
    ├─ Risk blocked? → Show "Access blocked"
    └─ Success? → Login & redirect
```

---

## 📊 Request/Response Flow

```
┌─ Frontend Login Page
│  └─ User enters: identifier + password
│     └─ Validates on client-side
│        └─ Shows real-time feedback
│           └─ Submits to API
│
├─ Backend Auth Controller
│  └─ POST /auth/login/identifier
│     └─ Validates LoginIdentifierDto
│        └─ Passes to AuthService
│
├─ Backend Auth Service
│  └─ loginWithIdentifier()
│     ├─ Validates identifier format
│     ├─ Detects type (Femo ID vs Mail)
│     ├─ Finds user by identifier
│     ├─ Checks email verification
│     ├─ Checks brute force lockout
│     ├─ Verifies password
│     ├─ Assesses security risk
│     ├─ Resets failed attempts
│     ├─ Generates tokens
│     ├─ Creates session
│     └─ Logs audit event
│
└─ Response to Frontend
   ├─ MFA required? → Show MFA screen
   ├─ Success? → Store tokens & redirect
   └─ Error? → Show error message
```

---

## 🚨 Troubleshooting

### Backend won't compile
**Error:** `Cannot find identifier.utils`
**Solution:** Ensure paths are correct. Run `npm install` to refresh.

### Frontend showing TypeScript errors
**Error:** `Type 'IdentifierType' not found`
**Solution:** Check import paths. Should be `@/auth/utils/identifier.utils`

### Login always fails
**Steps to debug:**
1. Check database has test user with `femoId` and `femoMail`
2. Verify `isEmailVerified` is `true`
3. Check password hash matches (test with correct password)
4. Look at backend logs for specific error

### Tokens not being stored
**Steps:**
1. Check browser console for errors
2. Verify localStorage is accessible
3. Check network tab for response headers
4. Ensure `withCredentials: true` in API calls

---

## 🎯 What's Next?

### Phase 2 (Optional)
- [ ] Social login (Google, GitHub)
- [ ] Biometric login
- [ ] One-time password (OTP) via email/SMS
- [ ] Device management UI
- [ ] Login history/activity log

### Phase 3 (Advanced)
- [ ] Machine learning fraud detection
- [ ] Geographic anomaly detection
- [ ] Cross-device login sync
- [ ] Zero-trust architecture
- [ ] WebAuthn support

---

## 📞 Support

For issues or questions:
1. Check the [API Documentation](./LOGIN_API_DOCUMENTATION.md)
2. Review error messages in backend logs
3. Test with cURL commands
4. Check browser DevTools Network tab
5. Verify database state

---

**Version:** 1.0.0  
**Last Updated:** January 25, 2026  
**Status:** ✅ Ready for Production
