# Femo Space Login System API Documentation

## Overview
Enterprise-grade authentication system for Femo Space. Supports login via:
- **Femo ID** (numeric, e.g., `1000021`)
- **Femo Mail** (email format, e.g., `ushan@femo.com`)

---

## Endpoints

### 1. Login with Femo ID or Femo Mail
**POST** `/auth/login/identifier`

#### Request
```json
{
  "identifier": "1000021",
  "password": "User@1234"
}
```

Or:
```json
{
  "identifier": "ushan@femo.com",
  "password": "User@1234"
}
```

#### Response (Success - No MFA)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "femoId": 1000021,
    "femoMail": "ushan@femo.com",
    "email": "ushan.fernando@example.com",
    "username": "@ushan0001",
    "firstName": "Ushan",
    "lastName": "Fernando",
    "avatarUrl": "https://...",
    "mfaEnabled": false,
    "isEmailVerified": true,
    "isPhoneVerified": false
  }
}
```

#### Response (MFA Required)
```json
{
  "mfaRequired": true,
  "userId": "507f1f77bcf86cd799439011"
}
```

#### Response (Error)
```json
{
  "statusCode": 400,
  "message": "Please enter a valid Femo ID (numbers only) or Femo Mail (email format)",
  "error": "Bad Request"
}
```

#### Error Cases
| Error | Status | Description |
|-------|--------|-------------|
| `Please enter a valid Femo ID or Femo Mail` | 400 | Invalid identifier format |
| `Invalid identifier or password` | 403 | User not found or wrong password |
| `Email not verified. Please verify your email before logging in.` | 403 | Email verification required |
| `Account temporarily locked due to multiple failed login attempts` | 403 | Brute-force protection active (15 min lockout after 5 failures) |
| `Access blocked due to security risk` | 403 | Risk assessment failed |

---

### 2. Legacy Login with Email
**POST** `/auth/login`

#### Request
```json
{
  "email": "ushan@femo.com",
  "password": "User@1234"
}
```

#### Response
Same as identifier login (success format)

---

### 3. Verify MFA
**POST** `/auth/login/mfa`

#### Request
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "token": "123456"
}
```

#### Response
Same as login (success format)

---

### 4. Refresh Token
**POST** `/auth/refresh`

#### Headers
```
Cookie: refresh_token=...
```

#### Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 5. Logout
**POST** `/auth/logout`

#### Headers
```
Authorization: Bearer <access_token>
```

#### Response
```json
{
  "message": "Logged out"
}
```

---

## Identifier Auto-Detection Logic

### Frontend (React)
```typescript
import { detectIdentifierType, IdentifierType } from '@/auth/utils/identifier.utils';

const type = detectIdentifierType(userInput);
// Returns: IdentifierType.FEMO_ID | IdentifierType.FEMO_MAIL | IdentifierType.INVALID

if (type === IdentifierType.FEMO_ID) {
  // Input is numeric: 1000021
}

if (type === IdentifierType.FEMO_MAIL) {
  // Input is email: ushan@femo.com
}
```

### Backend (NestJS)
```typescript
import { getIdentifierQueryFilter, validateIdentifier } from './utils/identifier.utils';

const queryFilter = getIdentifierQueryFilter(identifier);
// Returns: { femoId: 1000021 } | { femoMail: 'ushan@femo.com' } | null

const user = await this.usersService.findByIdentifier(queryFilter);
```

---

## Validation Rules

### Identifier
- **Femo ID**: Must be numeric only (e.g., `1000021`)
- **Femo Mail**: Must be valid email format (e.g., `ushan@femo.com`)
- **Required**: Cannot be empty

### Password
- **Length**: 8-128 characters
- **Uppercase**: At least 1 (A-Z)
- **Lowercase**: At least 1 (a-z)
- **Digit**: At least 1 (0-9)
- **Special**: At least 1 (!@#$%^&*)
- **Required**: Cannot be empty

---

## Security Features

### Brute-Force Protection
- **Max Attempts**: 5 failed login attempts
- **Lockout Duration**: 15 minutes
- **Reset**: Resets on successful login
- **Tracked**: Failed attempts incremented in `user.security.loginAttempts`

### Email Verification
- **Blocking**: Users cannot login if `isEmailVerified === false`
- **Error Message**: `Email not verified. Please verify your email before logging in.`

### Rate Limiting (Backend)
- Implemented via `SecurityService`
- Tracks IP address, user agent, device ID
- Triggers `risk.action === 'BLOCK'` if suspicious

### Session Management
- **Access Token**: 15 minutes expiry
- **Refresh Token**: 7 days expiry
- **Device Tracking**: Stores device ID, IP, user agent
- **Auto-Refresh**: Frontend automatically refreshes token on 401

### Password Security
- **Hashing**: bcrypt with argon2 (configurable)
- **Verification**: `argon2.verify()`
- **Storage**: Only hash stored, never plaintext

---

## Database Schema (MongoDB)

### User Document
```typescript
{
  _id: ObjectId,
  femoId: Number (unique, indexed),
  femoMail: String (unique, indexed),
  email: String (unique, indexed),
  username: String (unique),
  passwordHash: String,
  isEmailVerified: Boolean,
  isPhoneVerified: Boolean,
  
  security: {
    loginAttempts: Number (default: 0),
    lockoutUntil: Date | null,
    lastLoginAt: Date,
    lastLoginIp: String,
    mfaEnabled: Boolean,
    mfaSecret: String,
    refreshTokenHash: String,
    trustScore: Number (0-100),
    isSuspicious: Boolean,
    knownIPs: [String],
    knownDevices: [String]
  },
  
  profile: {
    firstName: String,
    lastName: String,
    avatarUrl: String,
    birthday: Date,
    gender: String,
    country: String
  }
}
```

### Query Examples

**Find by Femo ID:**
```javascript
db.users.findOne({ femoId: 1000021 })
```

**Find by Femo Mail:**
```javascript
db.users.findOne({ femoMail: 'ushan@femo.com' })
```

**Check Email Verified:**
```javascript
db.users.findOne({ 
  femoId: 1000021, 
  isEmailVerified: true 
})
```

**Increment Failed Attempts:**
```javascript
db.users.updateOne(
  { _id: ObjectId("...") },
  { 
    $inc: { 'security.loginAttempts': 1 },
    $set: { 'security.lockoutUntil': new Date(Date.now() + 15*60*1000) }
  }
)
```

**Reset on Success:**
```javascript
db.users.updateOne(
  { _id: ObjectId("...") },
  { 
    $set: {
      'security.loginAttempts': 0,
      'security.lockoutUntil': null,
      'security.lastLoginAt': new Date(),
      'security.lastLoginIp': '192.168.1.1'
    }
  }
)
```

---

## Frontend Integration

### Using Login Component
```tsx
import Login from '@/auth/pages/Login';

function App() {
  return <Login />;
}
```

### Using Auth Service
```tsx
import authService from '@/auth/api/auth.service';

// Login
const response = await authService.loginWithIdentifier({
  identifier: '1000021',
  password: 'User@1234'
});

// Store tokens
localStorage.setItem('access_token', response.access_token);
localStorage.setItem('user', JSON.stringify(response.user));

// Logout
await authService.logout();
```

---

## Testing

### cURL Examples

**Test Femo ID Login:**
```bash
curl -X POST http://localhost:3000/auth/login/identifier \
  -H "Content-Type: application/json" \
  -H "x-device-id: web-default" \
  -d '{
    "identifier": "1000021",
    "password": "User@1234"
  }'
```

**Test Femo Mail Login:**
```bash
curl -X POST http://localhost:3000/auth/login/identifier \
  -H "Content-Type: application/json" \
  -H "x-device-id: web-default" \
  -d '{
    "identifier": "ushan@femo.com",
    "password": "User@1234"
  }'
```

**Test Invalid Identifier:**
```bash
curl -X POST http://localhost:3000/auth/login/identifier \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "invalid-format!",
    "password": "User@1234"
  }'
```

---

## Backward Compatibility

✅ **Existing `/auth/login` endpoint remains unchanged**
- Email-based login still works
- All existing clients unaffected
- New `/auth/login/identifier` is additive, not breaking

✅ **Database schema extended, not modified**
- `femoId` and `femoMail` fields already exist in schema
- No migration needed
- All fields optional

✅ **Service methods extended**
- `loginWithIdentifier()` is new
- Existing `login()` method unchanged
- Can coexist and be used independently

---

## Troubleshooting

### "Invalid identifier or password"
- Verify identifier format (numeric or email)
- Check password matches
- Confirm user exists in database

### "Email not verified"
- User must complete email verification first
- Check `isEmailVerified` in database
- Send verification email if needed

### "Account temporarily locked"
- User has exceeded 5 failed attempts
- Wait 15 minutes or reset `security.lockoutUntil` in database
- Once reset, can login again

### "Access blocked due to security risk"
- Risk assessment failed
- Check `security.trustScore` and `security.isSuspicious`
- Contact support or verify identity

---

## Best Practices

1. **Always validate on frontend and backend**
   - Use provided utility functions
   - Don't trust client-side validation alone

2. **Never log passwords**
   - Log only identifier, status, and metadata
   - Audit logs stored securely

3. **Use HTTPS in production**
   - Tokens transmitted over encrypted connection
   - Cookies marked as `secure` and `httpOnly`

4. **Implement rate limiting**
   - Backend already does brute-force protection
   - Consider global API rate limiting

5. **Monitor failed attempts**
   - Track unusual login patterns
   - Alert on suspicious activity

6. **Keep tokens secure**
   - Store in httpOnly cookies (done)
   - Never expose in logs or URLs
   - Rotate regularly

---

## Future Enhancements

- [ ] Social login integration
- [ ] Biometric authentication
- [ ] Cross-device login
- [ ] Advanced risk scoring
- [ ] Machine learning-based fraud detection
