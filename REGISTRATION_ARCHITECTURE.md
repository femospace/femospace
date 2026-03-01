# FEMO SPACE REGISTRATION SYSTEM - ARCHITECTURE DIAGRAM

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FEMO SPACE ECOSYSTEM                            │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      BROWSER / CLIENT                            │   │
│  │                                                                  │   │
│  │  ┌──────────────────────────────────────────────────────────┐   │   │
│  │  │               React Web App (web-app)                    │   │   │
│  │  │                                                          │   │   │
│  │  │  ┌────────────────────────────────────────────────────┐  │   │   │
│  │  │  │          /register Route & Router                  │  │   │   │
│  │  │  │  ┌──────────────────────────────────────────────┐  │  │   │   │
│  │  │  │  │  RegistrationContext (State Manager)         │  │  │   │   │
│  │  │  │  │  - currentStep (1-3)                         │  │  │   │   │
│  │  │  │  │  - sessionToken                              │  │  │   │   │
│  │  │  │  │  - step1Data, step2Data, step3Data          │  │  │   │   │
│  │  │  │  │  - femoId, femoMail                          │  │  │   │   │
│  │  │  │  └──────────────────────────────────────────────┘  │  │   │   │
│  │  │  │                                                     │  │   │   │
│  │  │  │  Step 1: Personal Info  → Step 2: Account Info    │  │   │   │
│  │  │  │  ┌──────────────────┐   ┌──────────────────────┐  │  │   │   │
│  │  │  │  │ FirstName        │   │ Email (validate)     │  │  │   │   │
│  │  │  │  │ LastName         │   │ Password (strength)  │  │  │   │   │
│  │  │  │  │ Birthday (18+)   │   │ Confirm Password     │  │  │   │   │
│  │  │  │  │ Gender (enum)    │   │ Country (dropdown)   │  │  │   │   │
│  │  │  │  └──────────────────┘   │ Terms & Privacy ✓    │  │  │   │   │
│  │  │  │                          └──────────────────────┘  │  │   │   │
│  │  │  │                                                     │  │   │   │
│  │  │  │  Step 3: Femo ID, Mail & Phone                    │  │   │   │
│  │  │  │  ┌────────────────────────────────────────────┐   │  │   │   │
│  │  │  │  │ Femo ID: [1000042] (read-only, copy btn)   │   │  │   │   │
│  │  │  │  │ Femo Mail: [username] @femo.com            │   │  │   │   │
│  │  │  │  │ - Real-time availability check             │   │  │   │   │
│  │  │  │  │ - 5 suggestions (clickable)                │   │  │   │   │
│  │  │  │  │ Phone: [+1] [1234567890] (optional)        │   │  │   │   │
│  │  │  │  └────────────────────────────────────────────┘   │  │   │   │
│  │  │  └────────────────────────────────────────────────────┘  │  │   │   │
│  │  │                                                          │  │   │   │
│  │  │  ┌────────────────────────────────────────────────────┐  │  │   │   │
│  │  │  │        registrationAPI (HTTP Client)               │  │  │   │   │
│  │  │  │                                                    │  │  │   │   │
│  │  │  │  - step1(data)                                    │  │  │   │   │
│  │  │  │  - step2(sessionToken, data)                      │  │  │   │   │
│  │  │  │  - step3(sessionToken, data)                      │  │  │   │   │
│  │  │  │  - validateEmail(email)                           │  │  │   │   │
│  │  │  │  - validateFemoMail(username)                     │  │  │   │   │
│  │  │  │  - getFemoMailSuggestions(username)               │  │  │   │   │
│  │  │  │  - checkPasswordStrength(password)                │  │  │   │   │
│  │  │  │                                                    │  │  │   │   │
│  │  │  │  Base URL: http://localhost:3000/api              │  │  │   │   │
│  │  │  └────────────────────────────────────────────────────┘  │  │   │   │
│  │  │                                                          │  │   │   │
│  │  │  ┌────────────────────────────────────────────────────┐  │  │   │   │
│  │  │  │         Utilities & Constants                      │  │  │   │   │
│  │  │  │                                                    │  │  │   │   │
│  │  │  │  - PasswordValidator (strength, validation)        │  │  │   │   │
│  │  │  │  - COUNTRIES (195 countries array)                 │  │  │   │   │
│  │  │  │  - Framer Motion (animations)                      │  │  │   │   │
│  │  │  │  - Tailwind CSS (styling)                          │  │  │   │   │
│  │  │  └────────────────────────────────────────────────────┘  │  │   │   │
│  │  └──────────────────────────────────────────────────────────┘  │  │   │   │
│  │                                                                 │  │   │   │
│  └─────────────────────────────────────────────────────────────────┘  │   │
│                                                                       │   │
│                           HTTP / REST API                            │   │
│  ◄─────────────────────────────────────────────────────────────────►    │   │
│                                                                       │   │
│  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │                      BACKEND / SERVER                           │   │   │
│  │                                                                  │   │   │
│  │  ┌──────────────────────────────────────────────────────────┐   │   │   │
│  │  │            NestJS Application (backend)                  │   │   │   │
│  │  │                                                          │   │   │   │
│  │  │  ┌────────────────────────────────────────────────────┐  │   │   │   │
│  │  │  │     RegistrationController (Routes)                │  │   │   │   │
│  │  │  │                                                    │  │   │   │   │
│  │  │  │  POST /auth/register/step1                        │  │   │   │   │
│  │  │  │  POST /auth/register/step2                        │  │   │   │   │
│  │  │  │  POST /auth/register/step3                        │  │   │   │   │
│  │  │  │  GET  /auth/register/validate-email               │  │   │   │   │
│  │  │  │  GET  /auth/register/validate-femo-mail           │  │   │   │   │
│  │  │  │  GET  /auth/register/femo-mail-suggestions        │  │   │   │   │
│  │  │  │  POST /auth/register/check-password-strength      │  │   │   │   │
│  │  │  └────────────────────────────────────────────────────┘  │   │   │   │
│  │  │                                                          │   │   │   │
│  │  │  ┌────────────────────────────────────────────────────┐  │   │   │   │
│  │  │  │     RegistrationService (Business Logic)           │  │   │   │   │
│  │  │  │                                                    │  │   │   │   │
│  │  │  │  STEP 1:                                           │  │   │   │   │
│  │  │  │  - Validate required fields                        │  │   │   │   │
│  │  │  │  - Verify age (18+)                               │  │   │   │   │
│  │  │  │  - Generate sessionToken                           │  │   │   │   │
│  │  │  │  - Store in registrationSessions (Map)            │  │   │   │   │
│  │  │  │  - Return sessionToken                             │  │   │   │   │
│  │  │  │                                                    │  │   │   │   │
│  │  │  │  STEP 2:                                           │  │   │   │   │
│  │  │  │  - Validate sessionToken                           │  │   │   │   │
│  │  │  │  - Check email format & uniqueness                │  │   │   │   │
│  │  │  │  - Validate passwords match                        │  │   │   │   │
│  │  │  │  - Check password strength                         │  │   │   │   │
│  │  │  │  - Verify terms & privacy accepted                │  │   │   │   │
│  │  │  │  - Update session with step2Data                  │  │   │   │   │
│  │  │  │                                                    │  │   │   │   │
│  │  │  │  STEP 3:                                           │  │   │   │   │
│  │  │  │  - Validate sessionToken                           │  │   │   │   │
│  │  │  │  - Generate femoId (1000000 + userCount)           │  │   │   │   │
│  │  │  │  - Validate femoMailName format                    │  │   │   │   │
│  │  │  │  - Check femoMail uniqueness                       │  │   │   │   │
│  │  │  │  - Hash password with argon2                       │  │   │   │   │
│  │  │  │  - Create User document                            │  │   │   │   │
│  │  │  │  - Save to MongoDB                                 │  │   │   │   │
│  │  │  │  - Return success + femoId + femoMail              │  │   │   │   │
│  │  │  │                                                    │  │   │   │   │
│  │  │  │  UTILITIES:                                        │  │   │   │   │
│  │  │  │  - validateFemoMailAvailability()                 │  │   │   │   │
│  │  │  │  - validateEmailAvailability()                    │  │   │   │   │
│  │  │  │  - getFemoMailSuggestions()                       │  │   │   │   │
│  │  │  │  - getPasswordStrength()                          │  │   │   │   │
│  │  │  └────────────────────────────────────────────────────┘  │   │   │   │
│  │  │                                                          │   │   │   │
│  │  │  ┌────────────────────────────────────────────────────┐  │   │   │   │
│  │  │  │    DTOs (Data Transfer Objects)                    │  │   │   │   │
│  │  │  │                                                    │  │   │   │   │
│  │  │  │  CreateStep1Dto:                                   │  │   │   │   │
│  │  │  │  - @IsNotEmpty() firstName: string                │  │   │   │   │
│  │  │  │  - @IsNotEmpty() lastName: string                 │  │   │   │   │
│  │  │  │  - @IsDateString() birthday: string               │  │   │   │   │
│  │  │  │  - @IsEnum() gender: string                       │  │   │   │   │
│  │  │  │                                                    │  │   │   │   │
│  │  │  │  CreateStep2Dto:                                   │  │   │   │   │
│  │  │  │  - @IsEmail() email: string                       │  │   │   │   │
│  │  │  │  - @Matches(regex) password: string              │  │   │   │   │
│  │  │  │  - confirmPassword: string                        │  │   │   │   │
│  │  │  │  - country: string                                │  │   │   │   │
│  │  │  │  - termsAccepted: boolean                         │  │   │   │   │
│  │  │  │  - privacyAccepted: boolean                       │  │   │   │   │
│  │  │  │                                                    │  │   │   │   │
│  │  │  │  CreateStep3Dto:                                   │  │   │   │   │
│  │  │  │  - @IsNotEmpty() femoMailName: string             │  │   │   │   │
│  │  │  │  - @IsOptional() phoneCountryCode: string         │  │   │   │   │
│  │  │  │  - @IsOptional() phoneNumber: string              │  │   │   │   │
│  │  │  └────────────────────────────────────────────────────┘  │   │   │   │
│  │  │                                                          │   │   │   │
│  │  │  ┌────────────────────────────────────────────────────┐  │   │   │   │
│  │  │  │      Utilities / Helper Functions                  │   │   │   │
│  │  │  │                                                    │   │   │   │
│  │  │  │  PasswordValidator:                                │   │   │   │
│  │  │  │  - isValid(password): boolean                     │   │   │   │
│  │  │  │  - calculateStrength(password)                    │   │   │   │
│  │  │  │  - passwordsMatch(p1, p2): boolean               │   │   │   │
│  │  │  │  - getMissingRequirements(password)              │   │   │   │
│  │  │  │                                                    │   │   │   │
│  │  │  │  FemoIdGenerator:                                  │   │   │   │
│  │  │  │  - generate(userCount): number                    │   │   │   │
│  │  │  │  - isValid(id): boolean                           │   │   │   │
│  │  │  │  - extractPosition(femoId): number                │   │   │   │
│  │  │  │                                                    │   │   │   │
│  │  │  │  FemoMailUtils:                                    │   │   │   │
│  │  │  │  - formatEmail(username): string                  │   │   │   │
│  │  │  │  - generateSuggestions(username): string[]        │   │   │   │
│  │  │  │  - isValidFormat(email): boolean                  │   │   │   │
│  │  │  └────────────────────────────────────────────────────┘  │   │   │   │
│  │  │                                                          │   │   │   │
│  │  │  ┌────────────────────────────────────────────────────┐  │   │   │   │
│  │  │  │       AuthModule Configuration                    │   │   │   │
│  │  │  │                                                    │   │   │   │
│  │  │  │  Imports:                                          │   │   │   │
│  │  │  │  - UsersModule                                     │   │   │   │
│  │  │  │  - SecurityModule                                  │   │   │   │
│  │  │  │  - AuditModule                                     │   │   │   │
│  │  │  │  - MongooseModule (User schema)                    │   │   │   │
│  │  │  │  - JwtModule                                       │   │   │   │
│  │  │  │  - PassportModule                                  │   │   │   │
│  │  │  │                                                    │   │   │   │
│  │  │  │  Providers:                                        │   │   │   │
│  │  │  │  - RegistrationService                            │   │   │   │
│  │  │  │  - AuthService                                     │   │   │   │
│  │  │  │  - JwtStrategy                                     │   │   │   │
│  │  │  │                                                    │   │   │   │
│  │  │  │  Controllers:                                      │   │   │   │
│  │  │  │  - RegistrationController                         │   │   │   │
│  │  │  │  - AuthController                                  │   │   │   │
│  │  │  └────────────────────────────────────────────────────┘  │   │   │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │   │   │
│  │                                                                 │   │   │   │
│  │                           MongoDB Interface                    │   │   │   │
│  │  ◄──────────────────────────────────────────────────────────►  │   │   │   │
│  │                                                                 │   │   │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │   │   │
│  │  │            MongoDB Database (mongo)                      │  │   │   │   │
│  │  │                                                          │  │   │   │   │
│  │  │  Collection: users                                      │  │   │   │   │
│  │  │  ┌──────────────────────────────────────────────────┐   │  │   │   │   │
│  │  │  │ {                                                │   │  │   │   │   │
│  │  │  │   _id: ObjectId,                               │   │  │   │   │   │
│  │  │  │   femoId: number (unique, indexed),            │   │  │   │   │   │
│  │  │  │   email: string (unique, indexed),             │   │  │   │   │   │
│  │  │  │   passwordHash: string (argon2),               │   │  │   │   │   │
│  │  │  │   username: string,                            │   │  │   │   │   │
│  │  │  │   femoMail: string (unique, indexed),          │   │  │   │   │   │
│  │  │  │                                                │   │  │   │   │   │
│  │  │  │   profile: {                                   │   │  │   │   │   │
│  │  │  │     firstName, lastName, birthday, gender,     │   │  │   │   │   │
│  │  │  │     country, avatarUrl                        │   │  │   │   │   │
│  │  │  │   },                                           │   │  │   │   │   │
│  │  │  │   phone: { countryCode, number, verified },    │   │  │   │   │   │
│  │  │  │   preferences: { ... },                        │   │  │   │   │   │
│  │  │  │   security: { ... },                           │   │  │   │   │   │
│  │  │  │                                                │   │  │   │   │   │
│  │  │  │   termsAccepted: boolean,                      │   │  │   │   │   │
│  │  │  │   privacyAccepted: boolean,                    │   │  │   │   │   │
│  │  │  │   isEmailVerified: boolean,                    │   │  │   │   │   │
│  │  │  │   isPhoneVerified: boolean,                    │   │  │   │   │   │
│  │  │  │                                                │   │  │   │   │   │
│  │  │  │   createdAt: Date,                             │   │  │   │   │   │
│  │  │  │   updatedAt: Date                              │   │  │   │   │   │
│  │  │  │ }                                              │   │  │   │   │   │
│  │  │  └──────────────────────────────────────────────────┘   │  │   │   │   │
│  │  │                                                          │  │   │   │   │
│  │  └──────────────────────────────────────────────────────────┘  │  │   │   │
│  └─────────────────────────────────────────────────────────────────┘  │   │
│                                                                       │   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Registration Flow

```
USER INPUT (Browser)
    ↓
[Step 1] PersonalInfo Component
    ↓
registrationAPI.step1(data)
    ↓ HTTP POST
[Backend] RegistrationController.registerStep1()
    ↓
[Service] RegistrationService.processStep1()
    ├─ Validate age (18+)
    ├─ Generate sessionToken
    └─ Store in registrationSessions Map
    ↓
Return: { sessionToken }
    ↓ HTTP Response
[Frontend] Update Context (sessionToken, step1Data)
    ↓
Navigate to /register/step2
    ↓
[Step 2] AccountInfo Component
    ↓
registrationAPI.step2(sessionToken, data)
    ↓ HTTP POST
[Backend] RegistrationController.registerStep2()
    ↓
[Service] RegistrationService.processStep2()
    ├─ Validate sessionToken
    ├─ Check email format & uniqueness
    ├─ Validate password strength
    ├─ Verify passwords match
    └─ Verify terms/privacy accepted
    ↓
Update session with step2Data
    ↓
Return: { sessionToken }
    ↓ HTTP Response
[Frontend] Update Context (step2Data)
    ↓
Navigate to /register/step3
    ↓
[Step 3] FemoIDMail Component
    ↓
registrationAPI.step3(sessionToken, data)
    ↓ HTTP POST
[Backend] RegistrationController.registerStep3()
    ↓
[Service] RegistrationService.processStep3()
    ├─ Validate sessionToken
    ├─ Generate femoId (1000000 + userCount)
    ├─ Validate femoMail format & uniqueness
    ├─ Hash password with argon2
    └─ Create User document
    ↓
[Database] MongoDB users.insertOne()
    ↓
Return: { success, userId, femoId, femoMail }
    ↓ HTTP Response
[Frontend] Update Context (femoId, femoMail)
    ↓
Navigate to /login (success)
```

---

## Real-time Validation Flow

```
[Frontend] Input field loses focus (onBlur)
    ↓
registrationAPI.validateEmail(email) OR
registrationAPI.validateFemoMail(femoMailName)
    ↓ HTTP GET
[Backend] RegistrationController.validateEmail/Mail()
    ↓
[Service] RegistrationService.validateEmailAvailability()
    ├─ Check format
    └─ Query MongoDB for existing user
    ↓
Query: db.users.findOne({ email: "user@example.com" })
    ↓
Return: { available: true/false, message }
    ↓ HTTP Response
[Frontend] Update state
    ├─ Show checkmark if available
    ├─ Show error if taken
    └─ Enable/disable submit button
```

---

## Session Management

```
Session Timeline:
├─ Step 1: sessionToken created
│          └─ Valid for 30 minutes
│          └─ Stored in registrationSessions Map
│
├─ Step 2: sessionToken validated & reused
│          └─ Expires at: now + 30 minutes
│
└─ Step 3: sessionToken validated & deleted
           └─ User created in MongoDB
           └─ Session cleaned up

Map<sessionToken, RegistrationSession>:
{
  "reg_1704067200000_abc123def": {
    sessionToken: "reg_1704067200000_abc123def",
    step1Data: { firstName, lastName, birthday, gender },
    step2Data: { email, password, country, ... },
    step3Data: { femoMailName, ... },
    createdAt: Date,
    expiresAt: Date (now + 30min)
  }
}
```

---

## Password Strength Calculation

```
Password: "SecurePass123!"

Check 1: Length >= 8? YES (+1 point = 1/5)
Check 2: Length >= 12? YES (+1 point = 2/5)
Check 3: Has uppercase [A-Z]? YES (+1 point = 3/5)
Check 4: Has lowercase [a-z]? YES (+1 point = 4/5)
Check 5: Has number [0-9]? YES (+1 point = 5/5)
Check 6: Has special [!@#$...]? YES (score capped at 5)

Result: score = 5 (Very Strong)
Color: 🟢 Dark Green
Feedback: "Very Strong - Excellent password"
isValid: true (all requirements met)
```

---

## Error Handling Flow

```
[Frontend] Form submission
    ↓
Validate client-side
    ↓
If errors: Show inline error messages
    ↓
If valid: Send to backend
    ↓
registrationAPI.step1/2/3()
    ↓
CASE 1: Success (200)
    ├─ Parse response
    ├─ Update context
    └─ Navigate next or redirect login
    ↓
CASE 2: Error (400/409/500)
    ├─ Get error message from backend
    ├─ Display error alert
    └─ Keep user on form (no navigation)
    ↓
CASE 3: Network Error
    ├─ Show "Network error" message
    ├─ Provide retry option
    └─ Keep session token (can retry)
```

---

## Database Indexes

```
Collection: users

Indexes:
├─ femoId: unique, ascending
│  └─ Fast lookups by Femo ID
│
├─ email: unique, ascending
│  └─ Fast lookups by email
│  └─ Prevents duplicate registration
│
├─ femoMail: unique, ascending
│  └─ Fast lookups by Femo Mail
│  └─ Prevents duplicate Femo Mail
│
└─ createdAt: ascending
   └─ Fast sorting by registration date
```

---

This architecture ensures:
- ✅ Scalability (service-based)
- ✅ Security (validation, hashing, session tokens)
- ✅ Real-time feedback (validation endpoints)
- ✅ Good UX (animations, clear error messages)
- ✅ Maintainability (separation of concerns)
- ✅ Type safety (TypeScript throughout)
