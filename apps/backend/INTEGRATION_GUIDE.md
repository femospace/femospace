# FEMO SPACE — INTEGRATION GUIDE
## 3-Step Registration System Setup

---

## ✅ WHAT WAS CREATED

### Backend Files Created

1. **DTOs (Data Transfer Objects)**
   - `src/auth/dto/create-step1.dto.ts` — Personal information schema
   - `src/auth/dto/create-step2.dto.ts` — Account setup schema
   - `src/auth/dto/create-step3.dto.ts` — Finalization schema

2. **Services**
   - `src/auth/registration.service.ts` — Core registration logic (500+ lines)

3. **Controllers**
   - `src/auth/registration.controller.ts` — API endpoints (200+ lines)

4. **Utilities**
   - `src/common/utils/password-validator.ts` — Password strength & validation
   - `src/common/utils/femo-id-generator.ts` — Auto-ID generation
   - `src/common/utils/femo-mail.utils.ts` — Femo Mail handling & suggestions

5. **Module Updates**
   - `src/auth/auth.module.ts` — Updated with new services & controllers

6. **Database Schema**
   - `src/users/schemas/user.schema.ts` — Updated with femoId, femoMail, phone fields

### Frontend Files Created

1. **Main Component**
   - `src/auth/Register.tsx` — 3-step registration wrapper

2. **Step Components**
   - `src/auth/steps/Step1.tsx` — Personal information form
   - `src/auth/steps/Step2.tsx` — Account setup form
   - `src/auth/steps/Step3.tsx` — Finalization & Femo Mail

3. **Styling**
   - `src/auth/Register.module.css` — Complete styling (700+ lines)

4. **Constants**
   - `src/auth/constants/countries.ts` — All 250+ countries

### Documentation
   - `REGISTRATION_SYSTEM.md` — Complete system documentation

---

## 🔧 INTEGRATION STEPS

### Step 1: Database Indexes

Add these indexes to MongoDB for performance:

```javascript
// In MongoDB shell or MongoDB Atlas
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "femoMail": 1 }, { unique: true });
db.users.createIndex({ "femoId": 1 }, { unique: true });
```

### Step 2: Update Environment Variables

Add to your `.env` file:

```env
# Femo Registration System
FEMO_REGISTRATION_SESSION_EXPIRY=1800000  # 30 minutes in milliseconds
FEMO_BASE_ID=1000000
```

### Step 3: Verify Module Imports

Check `src/auth/auth.module.ts` has these imports:

```typescript
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
```

### Step 4: Update API Base URL (Frontend)

In `src/auth/steps/Step2.tsx` and `Step3.tsx`, update API calls:

```typescript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Usage
const response = await fetch(`${API_URL}/auth/register/step1`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

### Step 5: Add Route to React Router

In your main app routing:

```typescript
import Register from './auth/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 🚀 RUNNING THE SYSTEM

### Backend

```bash
# Start NestJS development server
npm run start:dev

# Verify endpoints are working
curl http://localhost:3000/api/auth/register/step1
```

### Frontend

```bash
# Install dependencies (if needed)
npm install

# Start React development server
npm start

# Navigate to
# http://localhost:3000/register
```

---

## 🧪 QUICK TEST

### Test Registration Flow (Using curl)

**Step 1: Submit Personal Info**
```bash
curl -X POST http://localhost:3000/api/auth/register/step1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "birthday": "1995-05-15",
    "gender": "Male"
  }'

# Response:
# {
#   "sessionToken": "reg_1673881234567_abc9defgh"
# }
```

Copy the `sessionToken` for next step.

**Step 2: Submit Account Info**
```bash
curl -X POST http://localhost:3000/api/auth/register/step2 \
  -H "Content-Type: application/json" \
  -d '{
    "sessionToken": "YOUR_SESSION_TOKEN_HERE",
    "data": {
      "email": "john.doe@example.com",
      "password": "MySecurePass123!",
      "confirmPassword": "MySecurePass123!",
      "country": "US",
      "termsAccepted": true,
      "privacyAccepted": true
    }
  }'

# Response:
# {
#   "sessionToken": "reg_1673881234567_abc9defgh"
# }
```

**Step 3: Complete Registration**
```bash
curl -X POST http://localhost:3000/api/auth/register/step3 \
  -H "Content-Type: application/json" \
  -d '{
    "sessionToken": "YOUR_SESSION_TOKEN_HERE",
    "data": {
      "femoMailName": "johndoe",
      "phoneCountryCode": "+1",
      "phoneNumber": "5551234567"
    }
  }'

# Response:
# {
#   "success": true,
#   "userId": "507f1f77bcf86cd799439011",
#   "femoId": 1000000,
#   "femoMail": "johndoe@femo.com",
#   "message": "Registration completed successfully"
# }
```

---

## 🔍 VERIFICATION ENDPOINTS

Test individual features:

**Check Email Availability:**
```bash
curl "http://localhost:3000/api/auth/register/validate-email?email=john@example.com"
```

**Get Femo Mail Suggestions:**
```bash
curl "http://localhost:3000/api/auth/register/femo-mail-suggestions?username=john"
```

**Check Femo Mail Availability:**
```bash
curl "http://localhost:3000/api/auth/register/validate-femo-mail?femoMailName=john"
```

**Check Password Strength:**
```bash
curl -X POST http://localhost:3000/api/auth/register/check-password-strength \
  -H "Content-Type: application/json" \
  -d '{"password": "MyPass123!"}'
```

---

## 🛠️ CUSTOMIZATION GUIDE

### Change Femo ID Starting Number

Edit `src/common/utils/femo-id-generator.ts`:

```typescript
export class FemoIdGenerator {
  static generate(userCount: number): number {
    const BASE_ID = 1000000;  // ← Change this value
    return BASE_ID + userCount;
  }
}
```

### Change Femo Mail Domain

Edit `src/common/utils/femo-mail.utils.ts`:

```typescript
export class FemoMailUtils {
  static readonly FEMO_DOMAIN = 'femo.com';  // ← Change this
}
```

### Change Session Expiry Time

Edit `src/auth/registration.service.ts`:

```typescript
export class RegistrationService {
  private SESSION_EXPIRY_MS = 30 * 60 * 1000;  // ← Change (in milliseconds)
}
```

### Add Email Verification

In `registration.service.ts`, update `processStep3`:

```typescript
// Send verification email
await this.emailService.sendVerificationEmail(user.email, user._id);

// Then user gets verified after clicking link
```

### Add SMS Verification

In `registration.service.ts`, update `processStep3`:

```typescript
// Send OTP to phone
if (dto.phoneNumber && dto.phoneCountryCode) {
  await this.smsService.sendOTP(dto.phoneCountryCode + dto.phoneNumber);
}
```

---

## ⚠️ IMPORTANT NOTES

### Session Storage

Currently using in-memory storage. For production with multiple instances:

```typescript
// Install Redis adapter
npm install @nestjs/redis ioredis

// Update registration.service.ts to use Redis
constructor(
  private redisService: RedisService,
  ...
) {
  // Store sessions in Redis instead of Map
}
```

### Password Hashing

Current implementation uses Argon2. Ensure it's installed:

```bash
npm install argon2
```

If not installed in your project, install it:
```bash
npm install argon2
```

### Rate Limiting

Add Throttle Guards for production:

```bash
npm install @nestjs/throttler

// Then in registration.controller.ts
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Post('step1')
async registerStep1(...) { }
```

---

## 🐛 COMMON ISSUES & FIXES

### Issue: "Cannot find module 'password-validator'"
**Fix:** Ensure all utility files are created in `src/common/utils/`

### Issue: "Connection refused" on MongoDB
**Fix:** Check MongoDB is running:
```bash
mongod --dbpath /data/db
```

### Issue: "Session token is invalid"
**Fix:** Session expires after 30 minutes. The order must be: Step1 → Step2 → Step3 within 30 min

### Issue: "Email already registered"
**Fix:** This is intentional to prevent duplicates. Use different email.

### Issue: Password strength meter not showing
**Fix:** Check `Step2.tsx` has password strength endpoint working

---

## 📦 DEPENDENCIES CHECKLIST

### Backend Dependencies

```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/mongoose": "^10.0.0",
  "@nestjs/jwt": "^10.0.0",
  "mongoose": "^7.0.0",
  "argon2": "^0.30.0",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.0"
}
```

Install if missing:
```bash
npm install argon2 class-validator class-transformer
```

### Frontend Dependencies

```json
{
  "react": "^18.0.0",
  "react-router-dom": "^6.0.0"
}
```

---

## 📱 RESPONSIVE DESIGN

The system is fully responsive:
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (320px - 767px)

Test on mobile:
```bash
# Open DevTools (F12) and toggle device toolbar
# Or visit on actual phone: http://YOUR_IP:3000/register
```

---

## 🔐 SECURITY CHECKLIST

Before going to production:

- [ ] Enable HTTPS/SSL
- [ ] Set secure cookies (`secure: true` in auth.controller.ts)
- [ ] Enable CORS properly
- [ ] Add rate limiting (ThrottlerGuard)
- [ ] Validate all inputs (already done with DTOs)
- [ ] Use environment variables (no hardcoded secrets)
- [ ] Enable MongoDB authentication
- [ ] Add request logging
- [ ] Set up error monitoring (Sentry)
- [ ] Enable helmet.js for security headers

---

## 📊 PERFORMANCE TIPS

1. **Database Indexes:** Already added (see Step 1)
2. **Lazy Loading:** Load country list only when needed
3. **Memoization:** Use React.memo for Step components
4. **API Caching:** Cache country list client-side
5. **Debouncing:** Debounce email/femoMail validation checks

---

## 🎯 NEXT STEPS

1. ✅ Review all created files
2. ✅ Test the flow end-to-end
3. ✅ Customize as needed
4. ✅ Add email verification
5. ✅ Add SMS verification
6. ✅ Deploy to production

---

## 📞 SUPPORT

**Created:** January 25, 2026  
**Version:** 1.0.0  
**Contact:** devteam@femo.com

For questions or issues, refer to `REGISTRATION_SYSTEM.md`
