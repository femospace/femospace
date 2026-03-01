# FEMO SPACE 3-STEP REGISTRATION SYSTEM

## Overview
Complete registration system for Femo Space with enterprise-grade security, real-time validation, and animated UI.

## Architecture

### Backend (NestJS)

#### DTOs (Data Transfer Objects)
Located in: `backend/src/auth/dto/`

- **CreateStep1Dto**: Personal information
  - firstName, lastName, birthday, gender

- **CreateStep2Dto**: Account information
  - email, password, confirmPassword, country, termsAccepted, privacyAccepted

- **CreateStep3Dto**: Femo ID, Mail, Phone
  - femoMailName, phoneCountryCode (optional), phoneNumber (optional)

#### Services
Located in: `backend/src/auth/registration.service.ts`

**RegistrationService** methods:
- `processStep1(dto)` - Validates age, generates session token, stores temp data
- `processStep2(sessionToken, dto)` - Validates email/password, checks duplicate email
- `processStep3(sessionToken, dto)` - Generates Femo ID, creates user record, finalizes
- `getFemoMailSuggestions(username)` - Returns 5 alternative usernames
- `validateFemoMailAvailability(femoMailName)` - Checks if Femo Mail is available
- `validateEmailAvailability(email)` - Checks if email is registered
- `getPasswordStrength(password)` - Returns strength score (0-5) and feedback

#### Controllers
Located in: `backend/src/auth/registration.controller.ts`

**Endpoints:**
```
POST /auth/register/step1 - Submit personal info
POST /auth/register/step2 - Submit account info (requires sessionToken)
POST /auth/register/step3 - Finalize registration (requires sessionToken)

GET /auth/register/femo-mail-suggestions?username=john - Get suggestions
GET /auth/register/validate-femo-mail?femoMailName=john - Validate Femo Mail
GET /auth/register/validate-email?email=user@example.com - Validate email
POST /auth/register/check-password-strength - Check password strength
```

#### Utilities

**PasswordValidator** (`backend/src/common/utils/password-validator.ts`)
- Enforces: Min 8 chars, uppercase, lowercase, number, special char
- Calculates strength (0-5 scale)
- Validates password match

**FemoIdGenerator** (`backend/src/common/utils/femo-id-generator.ts`)
- Auto-generates from 1000000 + userCount
- Validates format
- Extracts position from ID

**FemoMailUtils** (`backend/src/common/utils/femo-mail.utils.ts`)
- Formats username → username@femo.com
- Extracts username from email
- Generates 5 smart suggestions
- Validates format

#### Database Schema
Located in: `backend/src/users/schemas/user.schema.ts`

**User Collection:**
```typescript
{
  femoId: number (unique, indexed)
  email: string (unique, indexed)
  passwordHash: string (argon2)
  username: string
  femoMail: string (unique, indexed)
  
  profile: {
    firstName: string
    lastName: string
    birthday: Date
    gender: enum
    country: string
    avatarUrl: string (optional)
  }
  
  phone: {
    countryCode: string
    number: string
    verified: boolean
  }
  
  preferences: { languageCode, theme, emailNotifications, pushNotifications }
  security: { loginAttempts, lockoutUntil, mfaEnabled, trustScore, etc }
  
  termsAccepted: boolean
  privacyAccepted: boolean
  isEmailVerified: boolean
  isPhoneVerified: boolean
  
  createdAt: Date
  updatedAt: Date
}
```

---

## Frontend (React + TypeScript)

### File Structure
```
src/auth/
├── context/
│   └── RegistrationContext.tsx      # State management
├── api/
│   └── registrationAPI.ts            # API calls
├── constants/
│   └── countries.ts                  # 195 countries list
├── utils/
│   └── passwordValidator.ts          # Client-side validation
├── steps/
│   ├── RegisterStep1.tsx             # Personal info
│   ├── RegisterStep2.tsx             # Account info
│   └── RegisterStep3.tsx             # Femo ID, Mail, Phone
└── pages/
    └── Register.tsx                  # Router & provider
```

### Context (State Management)
**RegistrationContext.tsx** - Manages:
- Current step (1-3)
- Session token
- Form data for all steps
- Femo ID and Femo Mail (after completion)
- Reset function

### API Service
**registrationAPI.ts** - Handles all HTTP requests:
- Type-safe responses
- Centralized error handling
- Base URL configuration

### Step Components

#### Step 1: Personal Information
- Form fields: First Name, Last Name, Birthday, Gender
- Validations:
  - Required fields check
  - Age verification (18+)
  - Birthday format
- UI: Animated transitions, real-time validation
- Navigation: Next button → Step 2, Login link

#### Step 2: Account Information
- Form fields:
  - Email (with duplicate validation)
  - Password (with strength meter)
  - Confirm Password (with match check)
  - Country (dropdown, 195 countries)
  - Terms & Privacy checkboxes
- Features:
  - Email availability check (real-time on blur)
  - Password strength meter (0-5 scale)
  - Show/hide password icons
  - Missing requirements feedback
  - Terms/Privacy policy links
- Validations:
  - Email format
  - Email uniqueness
  - Password rules
  - Password match
  - Both checkboxes required

#### Step 3: Femo ID, Mail & Phone
- Femo ID:
  - Auto-generated
  - Read-only field
  - Copyable to clipboard
  - Shows as permanent
- Femo Mail:
  - Text input (username only)
  - Shows @femo.com appended
  - Real-time availability check
  - Shows 5 smart suggestions below
  - Click suggestion to auto-fill
- Phone (Optional):
  - Country code selector (+1, +44, +91, etc)
  - Phone number input
  - Marked as optional
- Summary: Shows account info preview
- Register button: Finalizes account creation

### UI Features

**Animations:**
- Page transitions with Framer Motion
- Button hover/tap effects
- Password strength bar animation
- Smooth field focus transitions

**Responsive Design:**
- Mobile-first approach
- Tailwind CSS utility classes
- Max-width container (max-w-md)
- Overflow scroll on small screens

**Accessibility:**
- Semantic HTML labels
- Error messages linked to fields
- Clear visual feedback (colors, icons)
- Keyboard navigation support

**Visual Feedback:**
- Real-time validation indicators
- Loading states on buttons
- Success/error messages (green/red)
- Password strength colors (red→green)
- Checkmark icons for available fields
- Copy button with feedback

---

## Security Features

1. **Password Security:**
   - Minimum 8 characters
   - Must contain: uppercase, lowercase, number, special character
   - Strength meter shows real-time feedback
   - Passwords hashed with argon2 (backend)
   - Confirm password must match

2. **Duplicate Prevention:**
   - Email uniqueness enforced (DB unique index)
   - Femo Mail uniqueness enforced (DB unique index)
   - Femo ID uniqueness enforced (DB unique index)
   - Real-time availability checks

3. **Session Management:**
   - Session tokens expire in 30 minutes
   - Tokens required for Step 2 and 3
   - Session data stored in memory (could use Redis for scale)

4. **Input Validation:**
   - Client-side validation (quick feedback)
   - Server-side validation (security)
   - Email format validation
   - Username character restrictions
   - Age verification (18+)

5. **Rate Limiting:**
   - Should be configured at API gateway level
   - Prevents brute force attacks

6. **Data Protection:**
   - Passwords never sent in plain text
   - HTTPS required in production
   - User data properly sanitized

---

## Usage

### Backend Setup
1. Run migrations for user schema
2. Configure MongoDB connection
3. Start NestJS server: `npm run start`
4. API available at: http://localhost:3000/api

### Frontend Setup
1. Install dependencies: `npm install`
2. Configure API URL in `registrationAPI.ts`
3. Import Register component
4. Add route: `<Route path="/register/*" element={<Register />} />`
5. Start dev server: `npm run dev`

### Frontend Route Integration
```typescript
// In your main router (e.g., App.tsx)
import Register from './auth/pages/Register';

<Routes>
  <Route path="/register/*" element={<Register />} />
  // Other routes...
</Routes>
```

---

## Error Handling

### Backend Error Responses
```typescript
{
  statusCode: 400 | 409 | 500,
  message: "Descriptive error message",
  error: "BadRequest" | "Conflict" | "InternalServerError"
}
```

### Frontend Error Display
- Inline field-level errors (below input)
- Form-level errors (red alert box)
- API error messages from backend
- Network error handling

---

## Validation Rules

### Step 1 (Personal Info)
- ✅ First Name: Required, non-empty string
- ✅ Last Name: Required, non-empty string
- ✅ Birthday: Required, valid date, 18+ years old
- ✅ Gender: Required, one of: Male, Female, Non-binary, Other, Prefer not to say

### Step 2 (Account Info)
- ✅ Email: Required, valid format, unique
- ✅ Password: Min 8 chars, [A-Z][a-z][0-9][!@#$%^&*...]
- ✅ Confirm: Must match password exactly
- ✅ Country: Required, valid ISO code
- ✅ Terms: Must be checked
- ✅ Privacy: Must be checked

### Step 3 (Femo)
- ✅ Femo Mail Name: [a-zA-Z0-9_.-]+, max 50 chars, unique
- ✅ Phone: Optional (if provided, validate country code + digits)

---

## Password Strength Levels

| Score | Level | Requirements Met | Color |
|-------|-------|------------------|-------|
| 0 | Very Weak | < 2 criteria | 🔴 Red |
| 1 | Weak | 2 criteria | 🟠 Orange |
| 2 | Fair | 3 criteria | 🟡 Yellow |
| 3 | Good | 4 criteria | 🟢 Lime |
| 4 | Strong | 5 criteria | 🟢 Green |
| 5 | Very Strong | All criteria | 🟢 Dark Green |

---

## Testing Checklist

### Step 1
- [ ] Can't submit with empty fields
- [ ] Can't submit if under 18 years old
- [ ] Can proceed with valid data
- [ ] Session token generated
- [ ] Can go back to Step 1

### Step 2
- [ ] Email validation works (format + uniqueness)
- [ ] Password strength meter updates
- [ ] Password show/hide toggle works
- [ ] Confirm password validation works
- [ ] Terms & Privacy checkboxes required
- [ ] Country dropdown works
- [ ] All validations trigger correctly

### Step 3
- [ ] Femo ID displayed as read-only
- [ ] Can copy Femo ID to clipboard
- [ ] Femo Mail suggestions load
- [ ] Can click suggestion to auto-fill
- [ ] Femo Mail availability check works
- [ ] Phone is optional
- [ ] Registration completes and redirects to login

### Overall
- [ ] Can complete full 3-step flow
- [ ] Session persistence works
- [ ] Error handling displays correctly
- [ ] All animations smooth
- [ ] Mobile responsive
- [ ] Accessibility (keyboard nav, labels)

---

## Future Enhancements

1. **Email Verification**: Send verification link, confirm before account active
2. **Phone Verification**: OTP verification for phone numbers
3. **2FA/MFA**: TOTP setup during registration
4. **Social Login**: Google, GitHub, Facebook integration
5. **Profile Picture**: Upload during registration
6. **Username Availability**: Check username uniqueness
7. **Password History**: Prevent reusing old passwords
8. **Welcome Email**: Send confirmation email with Femo details
9. **Analytics**: Track registration drop-off points
10. **A/B Testing**: Test different UI/copy variations
11. **Referral System**: Allow new users to be referred
12. **Progressive Profiling**: Ask more questions based on answers
13. **CAPTCHA**: Add bot protection
14. **Rate Limiting**: Per-IP and per-email limits

---

## API Response Examples

### Step 1 Success
```json
{
  "sessionToken": "reg_1704067200000_abc123def"
}
```

### Step 2 Success
```json
{
  "sessionToken": "reg_1704067200000_abc123def"
}
```

### Step 3 Success
```json
{
  "success": true,
  "userId": "507f1f77bcf86cd799439011",
  "femoId": 1000042,
  "femoMail": "john_doe@femo.com",
  "message": "Registration completed successfully"
}
```

### Error Response
```json
{
  "statusCode": 409,
  "message": "Email already registered",
  "error": "Conflict"
}
```

---

## Notes

- Femo ID: Auto-incremented from 1000000, never changes, always displayed
- Femo Mail: Immutable after creation, shown in all user interfaces
- Session: In-memory storage (consider Redis for production)
- Password Hashing: argon2 (more secure than bcrypt)
- All timestamps in ISO-8601 format
- All validations happen on both client AND server
- All API endpoints rate-limited in production
