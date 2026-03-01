# ⚡ i18n QUICK START GUIDE
## Get Up and Running in 5 Minutes

**Project:** Femo Space  
**Last Updated:** January 12, 2026

---

## 🚀 STEP 1: VERIFY FILES (30 seconds)

Check that these files exist:

### **Frontend**
```
✅ web-app/src/data/languages.ts
✅ web-app/src/data/countries.ts
✅ web-app/src/components/LanguageSelector.tsx
✅ web-app/src/components/LanguageSelector.css
✅ web-app/src/components/CountrySelector.tsx
✅ web-app/src/components/CountrySelector.css
```

### **Backend**
```
✅ backend/src/common/middleware/i18n.middleware.ts
✅ backend/src/common/services/i18n.service.ts
✅ backend/src/users/schemas/user.schema.ts (updated)
```

### **Documentation**
```
✅ docs/I18N_EXECUTIVE_SUMMARY.md
✅ docs/I18N_IMPLEMENTATION_GUIDE.md
✅ docs/I18N_API_REFERENCE.md
✅ docs/I18N_DESIGN_SPEC.md
```

---

## 🎯 STEP 2: ADD TO WELCOME PAGE (2 minutes)

Open `web-app/src/pages/Welcome.tsx` and add:

```tsx
import { useState } from 'react';
import { LanguageSelector, LanguageTrigger } from '../components/LanguageSelector';

function WelcomePage() {
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  return (
    <div className="welcome-page">
      {/* Your existing content */}
      
      {/* Add language trigger in footer */}
      <footer>
        <LanguageTrigger onClick={() => setShowLanguageModal(true)} />
      </footer>

      {/* Language selector modal */}
      {showLanguageModal && (
        <LanguageSelector 
          onClose={() => setShowLanguageModal(false)} 
        />
      )}
    </div>
  );
}

export default WelcomePage;
```

---

## 📝 STEP 3: ADD TO REGISTER PAGE (2 minutes)

Open `web-app/src/pages/auth/Register.tsx` and add:

```tsx
import { useState } from 'react';
import { CountrySelector } from '../../components/CountrySelector';

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    country: '', // Add this
  });
  
  const [errors, setErrors] = useState({});

  return (
    <form onSubmit={handleSubmit}>
      {/* Your existing fields */}
      
      {/* Add country selector */}
      <div className="form-field">
        <label>Country *</label>
        <CountrySelector
          value={formData.country}
          onChange={(code) => setFormData({ ...formData, country: code })}
          error={errors.country}
          required
          placeholder="Select your country"
        />
      </div>

      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterPage;
```

---

## 🔧 STEP 4: BACKEND SETUP (1 minute)

### **4.1: Register i18n Middleware**

Open `backend/src/app.module.ts`:

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { I18nMiddleware } from './common/middleware/i18n.middleware';
import { I18nService } from './common/services/i18n.service';

@Module({
  // ... your existing imports
  providers: [
    // ... your existing providers
    I18nService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(I18nMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}
```

### **4.2: Add Language Update Endpoint**

Open `backend/src/users/users.controller.ts`:

```typescript
import { Patch, Body, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  // ... your existing methods

  @Patch('preferences/language')
  @UseGuards(JwtAuthGuard)
  async updateLanguage(
    @Request() req,
    @Body('languageCode') languageCode: string,
  ) {
    return this.usersService.updateLanguagePreference(
      req.user.id,
      languageCode,
    );
  }
}
```

Open `backend/src/users/users.service.ts`:

```typescript
async updateLanguagePreference(userId: string, languageCode: string) {
  return this.userModel.findByIdAndUpdate(
    userId,
    { 'preferences.languageCode': languageCode },
    { new: true },
  );
}
```

---

## ✅ STEP 5: TEST IT! (30 seconds)

### **Frontend Test**

1. Start dev server: `npm run dev` (if not running)
2. Open http://localhost:5173 (or your port)
3. Click the language trigger button (🌐)
4. Search for a language (e.g., "Español")
5. Click to select → Should switch instantly!
6. Try an RTL language (e.g., "العربية") → UI should flip!

### **Backend Test**

1. Start backend: `npm run start:dev` (if not running)
2. Test language detection:
   ```bash
   curl http://localhost:3000/api/some-endpoint \
     -H "Accept-Language: es-ES"
   ```
3. Check response has `Content-Language: es` header

---

## 🎨 OPTIONAL: CUSTOMIZE STYLING

### **Change Colors**

Edit `web-app/src/components/LanguageSelector.css`:

```css
/* Change accent color */
.language-item.active {
  background: rgba(255, 0, 0, 0.12); /* Red instead of blue */
  color: #ff0000;
}

.quick-switch-button {
  border-color: #ff0000;
  color: #ff0000;
}
```

### **Change Modal Size**

```css
.language-selector {
  max-width: 800px; /* Default: 600px */
  max-height: 90vh; /* Default: 85vh */
}
```

---

## 🌍 BONUS: ADD RTL SUPPORT

Add to `web-app/src/App.tsx`:

```tsx
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { isRTL } from './data/languages';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Apply RTL direction when language changes
    const rtl = isRTL(i18n.language);
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    // Your app content
  );
}

export default App;
```

---

## 📊 VERIFY EVERYTHING WORKS

### **Checklist**

- [ ] Language selector opens when clicking trigger
- [ ] Search filters languages instantly
- [ ] Clicking a language switches UI instantly
- [ ] Language persists after page refresh
- [ ] Country selector shows in registration form
- [ ] Country auto-detection works (shows badge)
- [ ] RTL languages flip UI direction
- [ ] Dark mode works (if system is in dark mode)
- [ ] Mobile responsive (test on phone)
- [ ] Backend returns localized errors

---

## 🐛 TROUBLESHOOTING

### **Language selector not showing?**

```tsx
// Make sure you imported the CSS
import '../components/LanguageSelector.css';

// Check if modal state is working
console.log('Show modal:', showLanguageModal);
```

### **Language not changing?**

```tsx
// Check i18n initialization
import { useTranslation } from 'react-i18next';

const { i18n } = useTranslation();
console.log('Current language:', i18n.language);
console.log('Is initialized:', i18n.isInitialized);
```

### **Country not detected?**

```typescript
// Check IP geolocation API
const country = await detectUserCountry();
console.log('Detected country:', country);

// If blocked, user can still select manually
```

### **RTL not working?**

```tsx
// Check if direction is applied
console.log('Document direction:', document.documentElement.dir);

// Manually set for testing
document.documentElement.dir = 'rtl';
```

---

## 📚 NEXT STEPS

1. **Read Full Documentation:**
   - [Executive Summary](./I18N_EXECUTIVE_SUMMARY.md)
   - [Implementation Guide](./I18N_IMPLEMENTATION_GUIDE.md)
   - [API Reference](./I18N_API_REFERENCE.md)
   - [Design Spec](./I18N_DESIGN_SPEC.md)

2. **Add More Pages:**
   - Login page
   - Settings page
   - Profile page
   - OTP verification

3. **Create Translation Files:**
   - Create `web-app/src/locales/en/translation.json`
   - Create `web-app/src/locales/es/translation.json`
   - Add more languages as needed

4. **Test with Real Users:**
   - Get feedback from different countries
   - Test RTL languages thoroughly
   - Verify mobile experience

5. **Deploy to Production:**
   - Follow deployment checklist in Implementation Guide
   - Set up analytics tracking
   - Monitor language distribution

---

## 🎉 YOU'RE DONE!

Your app now supports:
- ✅ 100+ languages
- ✅ 250+ countries
- ✅ Instant switching
- ✅ RTL support
- ✅ Auto-detection
- ✅ Facebook-level UX

**Time to go global! 🌍🚀**

---

## 💬 NEED HELP?

- **Documentation:** Check the 4 comprehensive guides in `/docs`
- **Code Examples:** See API Reference for copy-paste examples
- **Design Questions:** Review Design Spec for UI guidelines
- **Support:** Contact dev@sscorporate.com

---

**Built with ❤️ for global users**  
**SS Corporate Inc - Femo Space**  
**January 12, 2026**
