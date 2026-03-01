# Femo Space Frontend

Frontend application for the Femo Space social media platform built with React and TypeScript.

## Directory Structure

```
frontend/
├── src/
│   ├── auth/
│   │   ├── Register.tsx              # Main 3-step registration component
│   │   ├── Register.module.css        # Registration styling
│   │   ├── steps/
│   │   │   ├── Step1.tsx             # Personal information form
│   │   │   ├── Step2.tsx             # Account setup form
│   │   │   └── Step3.tsx             # Finalization form
│   │   └── constants/
│   │       └── countries.ts          # Country list for phone codes
│   └── ...
├── package.json
├── tsconfig.json
└── README.md
```

## Features

### 3-Step Registration Flow

#### Step 1: Personal Information
- First Name & Last Name
- Birthday (18+ validation)
- Gender selection
- **Output:** Session token

#### Step 2: Account Setup
- Email with duplicate checking
- Password with strength validation (0-5 score)
- Password confirmation
- Country/Region selection
- Terms & Conditions acceptance
- Privacy Policy acceptance
- **Validation:** Real-time email and password feedback

#### Step 3: Finalization
- Femo Mail username with 5 suggestions
- Phone number (optional) with country code
- **Output:** User account creation

## API Integration

The frontend connects to the backend at `http://localhost:3000` (configurable via `REACT_APP_API_URL`).

### Registration Endpoints

```
POST /auth/register/step1
  Body: { firstName, lastName, birthday, gender }
  Response: { sessionToken }

POST /auth/register/step2
  Body: { sessionToken, email, password, confirmPassword, country, termsAccepted, privacyAccepted }
  Response: { sessionToken }

POST /auth/register/step3
  Body: { sessionToken, femoMailName, phoneCountryCode?, phoneNumber? }
  Response: { user, token }

GET /auth/register/validate-email?email=...
  Response: { available: boolean }

GET /auth/register/validate-femo-mail?femoMailName=...
  Response: { available: boolean }

GET /auth/register/femo-mail-suggestions?username=...
  Response: { suggestions: Array<{ suggestion: string, available: boolean }> }

POST /auth/register/check-password-strength
  Body: { password }
  Response: { score: 0-5, feedback: string, isValid: boolean }
```

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
npm start
```

The application will open at `http://localhost:3000` in development mode.

## Build

```bash
npm run build
```

## Environment Variables

Create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ENVIRONMENT=development
```

## Technology Stack

- **React** 18.2.0 - UI framework
- **TypeScript** 5.0 - Type safety
- **CSS Modules** - Scoped styling
- **Fetch API** - HTTP client

## Styling

Uses CSS Modules with responsive design:
- Mobile-first approach
- Gradient backgrounds
- Smooth transitions and animations
- Accessible form controls

## Password Validation Rules

Backend enforces:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*()_+-=[]{};':"\\|,.<>/?)

Password strength scoring (0-5):
- 0-2: Weak (red)
- 2-3: Fair (orange)
- 3-4: Good (yellow)
- 4-5: Strong (green)

## Femo Mail

Custom email system for Femo Space users:
- Format: `username@femo.com`
- Must be unique across platform
- Can contain: letters, numbers, underscore, dot, hyphen
- Length: 3-50 characters
- Auto-suggests alternatives if preferred name is taken

## Integration Notes

1. Backend must be running on port 3000 for development
2. MongoDB must be configured and running
3. Session tokens expire after 30 minutes
4. Phone verification is optional but recommended

## Future Enhancements

- [ ] Email verification flow
- [ ] Phone verification flow
- [ ] Profile completion after registration
- [ ] Social login (Google, Facebook)
- [ ] Two-factor authentication setup
- [ ] Profile picture upload
- [ ] Bio and interests selection
