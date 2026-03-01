# QUICK START: FEMO SPACE REGISTRATION SYSTEM

## ⚡ 5-Minute Setup

### Backend (NestJS)

```bash
# 1. Terminal - Navigate to backend
cd backend

# 2. Install/update dependencies (if needed)
npm install

# 3. Ensure MongoDB is running
# (Local: mongod, Docker: docker run -d -p 27017:27017 mongo)

# 4. Start the server
npm run start

# Expected output: "[NestFactory] Nest application successfully started"
# API available at: http://localhost:3000/api
```

### Frontend (React + Vite)

```bash
# 1. Terminal - Navigate to web-app
cd web-app

# 2. Install dependencies (if needed)
npm install

# 3. Start dev server
npm start  # or: npm run dev

# Expected output: "VITE v5.4.21 ready in 1xxx ms"
# App available at: http://localhost:5173
```

### Test the Registration System

```
1. Open: http://localhost:5173/register
2. Follow the 3-step flow:
   - Step 1: Enter personal info
   - Step 2: Enter account info (email, password, country)
   - Step 3: Choose Femo Mail from suggestions
3. Click "Register"
4. Should redirect to login page
```

---

## 🧪 Testing Credentials

### Valid Registration Flow

**Step 1 - Sample Data:**
```
First Name: John
Last Name: Doe
Birthday: 1995-01-15 (must be 18+)
Gender: Male
```

**Step 2 - Sample Data:**
```
Email: john.doe@example.com (must be unique)
Password: SecurePass123! (uppercase + lowercase + number + special)
Confirm: SecurePass123!
Country: United States
Terms: ✓ Checked
Privacy: ✓ Checked
```

**Step 3 - Sample Data:**
```
Femo Mail: johndoe (or pick from suggestions)
Phone: +1 (optional, can skip)
```

### Expected Behavior

✅ Step 1:
- Can't proceed without all fields
- Can't proceed if under 18
- Next button enabled when form valid

✅ Step 2:
- Email shows "Available" with ✓ after blur
- Password strength bar updates as you type
- Both passwords must match
- Both checkboxes must be checked
- Next button only enabled when everything valid

✅ Step 3:
- Femo ID shows (read-only, copyable)
- Femo Mail suggestions appear in dropdown
- Can click suggestion to auto-fill
- Register button submits and redirects

---

## 🔍 Verifying Backend Endpoints

Use curl or Postman:

```bash
# Test Step 1
curl -X POST http://localhost:3000/api/auth/register/step1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "birthday": "1995-01-15",
    "gender": "Male"
  }'

# Expected Response:
# { "sessionToken": "reg_1704067200000_abc123def" }

# Test Email Validation
curl http://localhost:3000/api/auth/register/validate-email?email=test@example.com

# Expected Response:
# { "available": true, "message": "Email is available" }

# Test Femo Mail Suggestions
curl http://localhost:3000/api/auth/register/femo-mail-suggestions?username=john

# Expected Response:
# { "suggestions": ["john@femo.com", "john_123@femo.com", ...] }

# Test Password Strength
curl -X POST http://localhost:3000/api/auth/register/check-password-strength \
  -H "Content-Type: application/json" \
  -d '{ "password": "SecurePass123!" }'

# Expected Response:
# { "score": 5, "feedback": "Very Strong", "isValid": true }
```

---

## 📋 Common Issues & Fixes

### Issue: API connection refused
**Fix:**
```bash
# Check backend is running
netstat -an | grep 3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# If not running:
cd backend && npm run start
```

### Issue: MongoDB connection error
**Fix:**
```bash
# Check MongoDB is running
mongosh  # Should connect

# If not installed:
# Mac: brew install mongodb-community
# Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
# Docker: docker run -d -p 27017:27017 mongo
```

### Issue: CORS errors
**Fix:**
```bash
# NestJS already has CORS enabled in auth.module.ts
# If issues, restart backend:
npm run start
```

### Issue: Port already in use
**Fix:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :3000   # Windows (find PID, then taskkill /PID xxxx)

# Or use different port:
# Change in backend main.ts: app.listen(3001)
```

### Issue: Frontend can't find API
**Fix:**
```
Open: web-app/src/auth/api/registrationAPI.ts
Change: const API_BASE_URL = 'http://localhost:3000/api';
Match your backend URL
Restart frontend: npm run dev
```

---

## 🎯 Key Files to Know

### Backend Logic
- `backend/src/auth/registration.service.ts` - Core business logic
- `backend/src/auth/dto/*.ts` - Input validation rules
- `backend/src/common/utils/password-validator.ts` - Password rules
- `backend/src/common/utils/femo-id-generator.ts` - ID generation
- `backend/src/common/utils/femo-mail.utils.ts` - Femo Mail logic

### Frontend Components
- `web-app/src/auth/steps/RegisterStep1.tsx` - Personal info page
- `web-app/src/auth/steps/RegisterStep2.tsx` - Account info page
- `web-app/src/auth/steps/RegisterStep3.tsx` - Femo ID/Mail page
- `web-app/src/auth/context/RegistrationContext.tsx` - State management
- `web-app/src/auth/api/registrationAPI.ts` - API client

### Database
- `backend/src/users/schemas/user.schema.ts` - MongoDB schema

---

## 🚀 Next Steps

1. ✅ Test the 3-step registration flow
2. ✅ Verify all validations work
3. ✅ Try edge cases (under 18, duplicate email, weak password)
4. ✅ Test on mobile (responsive design)
5. ✅ Review the comprehensive guide: `REGISTRATION_SYSTEM_COMPLETE.md`
6. ✅ Customize UI colors/styling in Tailwind
7. ✅ Add email verification endpoint
8. ✅ Deploy to production (update API_BASE_URL)

---

## 📚 Documentation

- **Full Implementation Guide**: `backend/REGISTRATION_SYSTEM_COMPLETE.md`
- **Quick Overview**: `FEMO_REGISTRATION_COMPLETE.md`
- **This Quick Start**: You're reading it! ✨

---

## 🎓 Code Examples

### Adding Custom Validation
```typescript
// In backend/src/auth/dto/create-step1.dto.ts
@IsPhoneNumber() // Add phone validation
phoneNumber: string;
```

### Customizing UI Colors
```typescript
// In web-app/src/auth/steps/RegisterStep1.tsx
// Change: bg-indigo-600 to bg-blue-600
// Change: focus:ring-indigo-600 to focus:ring-blue-600
```

### Adding a New Field
```typescript
// 1. Add to DTO: backend/src/auth/dto/create-step1.dto.ts
@IsString()
middleName: string;

// 2. Add to schema: backend/src/users/schemas/user.schema.ts
@Prop()
middleName: string;

// 3. Add to UI: web-app/src/auth/steps/RegisterStep1.tsx
<input name="middleName" ... />

// 4. Update context: web-app/src/auth/context/RegistrationContext.tsx
middleName: string;
```

---

## ✅ Success Checklist

- [ ] Backend running on http://localhost:3000
- [ ] Frontend running on http://localhost:5173
- [ ] MongoDB connected
- [ ] Can load /register page
- [ ] Step 1: Submit personal info
- [ ] Step 2: Submit account info
- [ ] Step 3: Choose Femo Mail & register
- [ ] Redirects to login on success
- [ ] All validations working
- [ ] UI animations smooth
- [ ] Mobile responsive

---

**Ready to go! 🚀**

Need help? Check the comprehensive documentation files or review the code comments in each file.
