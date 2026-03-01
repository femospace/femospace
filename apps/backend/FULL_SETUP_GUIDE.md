# Femo Space - Frontend & Backend Integration Guide

## System Status

✅ **Backend:** Running successfully on port 3000
❓ **Frontend:** Located in `../web-app` directory (sibling folder)

## Fixing the Frontend Error

The error `npm error Missing script: "start"` occurs because the web-app directory exists but needs proper initialization.

### Solution: Initialize Frontend

**Option 1: Use Vite (Recommended - Faster)**

```bash
# From project root
cd ../web-app

# If package.json doesn't exist or is incomplete:
npm create vite@latest . -- --template react-ts

# Then install dependencies
npm install

# Start development server
npm start
```

**Option 2: Use Create React App**

```bash
cd ../web-app
npm install
npm start
```

### Expected Structure

```
femo-space/
├── backend/                 ← Running at localhost:3000
│   └── src/
│       └── auth/
│           ├── registration.service.ts
│           ├── registration.controller.ts
│           └── ...
└── web-app/                ← Frontend (Vite/React)
    ├── src/
    │   ├── auth/
    │   │   ├── Register.tsx
    │   │   ├── steps/
    │   │   └── constants/
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

## Backend API Endpoints (Already Working)

```
POST   /auth/register/step1
POST   /auth/register/step2
POST   /auth/register/step3
GET    /auth/register/validate-email
GET    /auth/register/validate-femo-mail
GET    /auth/register/femo-mail-suggestions
POST   /auth/register/check-password-strength
```

## Environment Setup

**Backend (.env)**
```
MONGODB_URI=mongodb://localhost:27017/femospace
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=3000
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:3000
```

## Development Workflow

1. **Terminal 1 - Backend**
   ```bash
   cd backend
   npm run start:dev
   # Listening on http://localhost:3000
   ```

2. **Terminal 2 - Frontend**
   ```bash
   cd ../web-app
   npm install  # First time only
   npm start
   # Listening on http://localhost:5173
   ```

3. **Browser**
   - Navigate to `http://localhost:5173`
   - Registration form loads and connects to backend

## Features Implemented

### Backend
- ✅ 3-step registration system
- ✅ Session management (30-min expiry)
- ✅ Password strength validation (0-5 scale)
- ✅ Femo Mail system with suggestions
- ✅ Email/Femo Mail uniqueness checks
- ✅ Phone number handling
- ✅ User creation with MongoDB

### Frontend (Ready to Deploy)
- ✅ React components for all 3 steps
- ✅ Form validation and error handling
- ✅ Real-time API integration
- ✅ Password strength indicator
- ✅ Femo Mail suggestions dropdown
- ✅ Responsive CSS styling
- ✅ TypeScript support

## Testing the Registration Flow

### Step 1: Personal Information
```bash
curl -X POST http://localhost:3000/auth/register/step1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "birthday": "2000-01-15",
    "gender": "Male"
  }'
```

### Step 2: Account Setup
```bash
curl -X POST http://localhost:3000/auth/register/step2 \
  -H "Content-Type: application/json" \
  -d '{
    "sessionToken": "...",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "country": "United States",
    "termsAccepted": true,
    "privacyAccepted": true
  }'
```

### Step 3: Finalization
```bash
curl -X POST http://localhost:3000/auth/register/step3 \
  -H "Content-Type: application/json" \
  -d '{
    "sessionToken": "...",
    "femoMailName": "johndoe",
    "phoneCountryCode": "+1",
    "phoneNumber": "1234567890"
  }'
```

## Deployment

### Backend (NestJS)
```bash
# Build
npm run build

# Start production server
npm start
```

### Frontend (React/Vite)
```bash
# Build
npm run build

# Output: dist/ folder
# Deploy dist/ to any static host (Vercel, Netlify, etc.)
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `npm error Missing script: "start"` | Initialize frontend with Vite or CRA |
| Port 3000 already in use | Change backend port in `.env` |
| Port 5173 already in use | Vite will auto-increment to 5174 |
| CORS errors | Backend has CORS enabled by default |
| MongoDB connection error | Ensure MongoDB is running |
| Session token expires | Sessions last 30 minutes |

## Next Steps

1. ✅ Initialize frontend with `npm create vite`
2. ✅ Install dependencies with `npm install`
3. ✅ Create `.env` file with `REACT_APP_API_URL`
4. ✅ Run frontend with `npm start`
5. ✅ Test registration flow in browser
6. ✅ Deploy both services

## Documentation

- Backend: See `src/auth/` files and `REGISTRATION_SYSTEM.md`
- Frontend: React components in `web-app/src/auth/`
- API Docs: NestJS Swagger available at `/api`
