# 🌍 i18n SYSTEM - DEVELOPER API REFERENCE
## Quick Reference for Femo Space Internationalization

---

## 📦 FRONTEND API

### **Language Functions**

```typescript
// Import from data/languages.ts
import {
  LANGUAGES,              // All language objects
  getPopularLanguages,    // Get popular languages
  getAllLanguages,        // Get all languages
  getLanguageByCode,      // Find language by code
  isRTL,                  // Check if language is RTL
  searchLanguages,        // Search languages by query
  LANGUAGE_CODES,         // Array of all language codes
  POPULAR_LANGUAGE_CODES, // Array of popular language codes
} from '@/data/languages';

// Examples
const allLangs = getAllLanguages();
// Returns: Language[] (100+ languages)

const popularLangs = getPopularLanguages();
// Returns: Language[] (30 popular languages)

const arabic = getLanguageByCode('ar');
// Returns: { code: 'ar', name: 'العربية', englishName: 'Arabic', rtl: true, popular: true }

const isArabicRTL = isRTL('ar');
// Returns: true

const results = searchLanguages('中文');
// Returns: Language[] matching query
```

### **Country Functions**

```typescript
// Import from data/countries.ts
import {
  COUNTRIES,              // All country objects
  getCountryByCode,       // Find country by code
  searchCountries,        // Search countries
  getCountriesByContinent,// Get countries by continent
  getAllCountries,        // Get all countries
  detectUserCountry,      // Auto-detect user's country
  COUNTRY_CODES,          // Array of all country codes
} from '@/data/countries';

// Examples
const usa = getCountryByCode('US');
// Returns: { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', continent: 'North America' }

const asianCountries = getCountriesByContinent('Asia');
// Returns: Country[] (50 Asian countries)

const results = searchCountries('india');
// Returns: Country[] matching query

const userCountry = await detectUserCountry();
// Returns: 'US' (ISO code) or null
```

### **React Components**

#### **LanguageSelector**

```tsx
import { LanguageSelector, LanguageTrigger } from '@/components/LanguageSelector';

// Trigger Button
<LanguageTrigger 
  onClick={() => setShowModal(true)}
  className="custom-class"
/>

// Modal
<LanguageSelector 
  onClose={() => setShowModal(false)}
  mode="modal" // or "popover"
/>
```

**Props:**
- `onClose?: () => void` - Callback when modal closes
- `mode?: 'modal' | 'popover'` - Display mode (default: 'modal')

**Features:**
- ✅ Instant language switching (no reload)
- ✅ Search functionality
- ✅ Popular languages section
- ✅ RTL support
- ✅ Dark mode
- ✅ Keyboard navigation
- ✅ Auto-focus search input

#### **CountrySelector**

```tsx
import { CountrySelector } from '@/components/CountrySelector';

<CountrySelector
  value={country}
  onChange={setCountry}
  error={errors.country}
  required={true}
  placeholder="Select your country"
/>
```

**Props:**
- `value: string` - Selected country code (ISO-3166)
- `onChange: (code: string) => void` - Change handler
- `error?: string` - Error message to display
- `required?: boolean` - Mark as required field
- `placeholder?: string` - Placeholder text

**Features:**
- ✅ Auto-detection with badge
- ✅ Search functionality
- ✅ Keyboard navigation (Arrow keys, Enter, Escape)
- ✅ Flag display
- ✅ Error state styling
- ✅ Mobile responsive

### **i18n Hooks**

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();

  // Translate text
  const title = t('welcome.title');
  // Returns: "Welcome to Femo Space" (in current language)

  // Get current language
  const currentLang = i18n.language;
  // Returns: 'en', 'es', 'ar', etc.

  // Change language
  await i18n.changeLanguage('es');
  // Switches to Spanish instantly

  // Check if language is loaded
  const isLoaded = i18n.isInitialized;
  // Returns: boolean

  return <h1>{t('welcome.title')}</h1>;
}
```

### **RTL Support**

```typescript
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { isRTL } from '@/data/languages';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Apply RTL direction
    const rtl = isRTL(i18n.language);
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return <div>...</div>;
}
```

---

## 🔧 BACKEND API

### **i18n Middleware**

```typescript
// Automatically applied to all routes
// Sets req.language based on:
// 1. User profile (if authenticated)
// 2. Accept-Language header
// 3. Default: 'en'

// Access in controllers/services
@Get()
async getData(@Request() req) {
  const userLanguage = req.language; // 'en', 'es', etc.
  // Use for localized responses
}
```

### **i18n Service**

```typescript
import { I18nService } from '@/common/services/i18n.service';

@Injectable()
export class MyService {
  constructor(private i18n: I18nService) {}

  async doSomething(req: Request) {
    // Translate message
    const message = this.i18n.translate(
      'auth.login.success',
      req.language
    );
    // Returns: "Login successful" (in user's language)

    // Translate with variables
    const greeting = this.i18n.translateWithVars(
      'welcome.greeting',
      req.language,
      { name: 'John' }
    );
    // Returns: "Welcome, John!" (in user's language)

    // Add custom translation
    this.i18n.addTranslation('custom.message', {
      en: 'Hello World',
      es: 'Hola Mundo',
      fr: 'Bonjour le monde',
    });

    // Get supported languages
    const languages = this.i18n.getSupportedLanguages();
    // Returns: ['en', 'es', 'fr', 'de', ...]
  }
}
```

### **Translation Keys**

#### **Authentication**
```typescript
'auth.login.success'       // "Login successful"
'auth.login.failed'        // "Invalid email or password"
'auth.register.success'    // "Registration successful"
'auth.email.exists'        // "Email already exists"
'auth.password.weak'       // "Password is too weak"
'auth.unauthorized'        // "Unauthorized access"
```

#### **Validation**
```typescript
'validation.required'      // "This field is required"
'validation.email.invalid' // "Invalid email format"
```

#### **General**
```typescript
'general.success'          // "Operation successful"
'general.error'            // "An error occurred"
'general.notFound'         // "Resource not found"
```

### **User Language Preference**

#### **Update Language**

```typescript
// Endpoint: PATCH /users/preferences/language
// Body: { "languageCode": "es" }

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
```

#### **Get User Language**

```typescript
// Access from user object
const userLanguage = user.preferences.languageCode;
// Returns: 'en', 'es', 'ar', etc.
```

### **Database Schema**

```typescript
// User Preferences Schema
@Schema({ _id: false })
export class Preferences {
  @Prop({ default: 'en' })
  languageCode: string; // ISO-639 code

  @Prop({ default: 'light', enum: ['light', 'dark', 'auto'] })
  theme: string;

  @Prop({ default: true })
  emailNotifications: boolean;

  @Prop({ default: true })
  pushNotifications: boolean;
}

// User Profile Schema
@Schema({ _id: false })
export class Profile {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  country: string; // ISO-3166 code (e.g., 'US', 'IN')

  // ... other fields
}
```

---

## 🎯 COMMON USE CASES

### **1. Add Language Selector to Page**

```tsx
import { useState } from 'react';
import { LanguageSelector, LanguageTrigger } from '@/components/LanguageSelector';

function WelcomePage() {
  const [showLangModal, setShowLangModal] = useState(false);

  return (
    <div>
      <header>
        <LanguageTrigger onClick={() => setShowLangModal(true)} />
      </header>

      {showLangModal && (
        <LanguageSelector onClose={() => setShowLangModal(false)} />
      )}
    </div>
  );
}
```

### **2. Add Country Selector to Form**

```tsx
import { useState } from 'react';
import { CountrySelector } from '@/components/CountrySelector';

function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    country: '',
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.country) {
      setErrors({ country: 'Please select your country' });
      return;
    }

    // Submit form
    await registerUser(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      
      <CountrySelector
        value={formData.country}
        onChange={(code) => setFormData({ ...formData, country: code })}
        error={errors.country}
        required
      />

      <button type="submit">Register</button>
    </form>
  );
}
```

### **3. Translate Content**

```tsx
import { useTranslation } from 'react-i18next';

function LoginPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('welcome.tagline')}</p>
      
      <form>
        <input placeholder={t('auth.email')} />
        <input placeholder={t('auth.password')} />
        <button>{t('auth.login')}</button>
      </form>

      <a href="/forgot-password">
        {t('auth.forgotPassword')}
      </a>
    </div>
  );
}
```

### **4. Handle RTL Languages**

```tsx
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { isRTL } from '@/data/languages';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const rtl = isRTL(i18n.language);
    
    // Set document direction
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;

    // Add RTL class for custom styling
    if (rtl) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [i18n.language]);

  return <div>...</div>;
}
```

### **5. Backend Localized Error**

```typescript
import { I18nService } from '@/common/services/i18n.service';

@Injectable()
export class AuthService {
  constructor(private i18n: I18nService) {}

  async login(email: string, password: string, req: Request) {
    const user = await this.findUser(email);
    
    if (!user) {
      throw new UnauthorizedException(
        this.i18n.translate('auth.login.failed', req.language)
      );
    }

    const isValid = await this.verifyPassword(password, user.passwordHash);
    
    if (!isValid) {
      throw new UnauthorizedException(
        this.i18n.translate('auth.login.failed', req.language)
      );
    }

    return {
      message: this.i18n.translate('auth.login.success', req.language),
      user,
    };
  }
}
```

### **6. Save Language Preference**

```typescript
// Frontend
import { useTranslation } from 'react-i18next';
import axios from 'axios';

function LanguageSettings() {
  const { i18n } = useTranslation();

  const handleLanguageChange = async (languageCode: string) => {
    // Change language in UI
    await i18n.changeLanguage(languageCode);

    // Save to backend (if logged in)
    try {
      await axios.patch('/api/users/preferences/language', {
        languageCode,
      });
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  return <div>...</div>;
}
```

---

## 📋 LANGUAGE CODES REFERENCE

### **Popular Languages**

| Code | Native Name | English Name |
|------|-------------|--------------|
| `en` | English | English |
| `es` | Español | Spanish |
| `zh-CN` | 中文（简体） | Chinese (Simplified) |
| `zh-TW` | 中文（繁體） | Chinese (Traditional) |
| `hi` | हिन्दी | Hindi |
| `ar` | العربية | Arabic (RTL) |
| `bn` | বাংলা | Bengali |
| `pt` | Português | Portuguese |
| `ru` | Русский | Russian |
| `ja` | 日本語 | Japanese |
| `de` | Deutsch | German |
| `fr` | Français | French |
| `ko` | 한국어 | Korean |
| `tr` | Türkçe | Turkish |
| `it` | Italiano | Italian |

### **RTL Languages**

| Code | Native Name | English Name |
|------|-------------|--------------|
| `ar` | العربية | Arabic |
| `he` | עברית | Hebrew |
| `ur` | اردو | Urdu |
| `fa` | فارسی | Persian |
| `ps` | پښتو | Pashto |
| `sd` | سنڌي | Sindhi |
| `dv` | ދިވެހި | Dhivehi |
| `yi` | ייִדיש | Yiddish |
| `ckb` | کوردیی ناوەندی | Kurdish (Sorani) |
| `ug` | ئۇيغۇرچە | Uyghur |

---

## 🎨 CSS CLASSES

### **Language Selector**

```css
.language-selector-backdrop  /* Modal backdrop */
.language-selector           /* Main modal container */
.language-selector-header    /* Header section */
.language-selector-search    /* Search bar section */
.language-selector-content   /* Scrollable content */
.language-section            /* Language section */
.language-grid               /* Popular languages grid */
.language-list               /* All languages list */
.language-item               /* Individual language button */
.language-item.active        /* Selected language */
.language-trigger            /* Trigger button */
```

### **Country Selector**

```css
.country-selector-wrapper    /* Wrapper container */
.country-selector-button     /* Main selector button */
.country-selector-error      /* Error message */
.country-dropdown            /* Dropdown container */
.country-search              /* Search input section */
.country-list                /* Scrollable country list */
.country-item                /* Individual country button */
.country-item.selected       /* Selected country */
.country-item.highlighted    /* Keyboard highlighted */
```

---

## 🔍 DEBUGGING

### **Check Current Language**

```typescript
// Frontend
console.log('Current language:', i18n.language);
console.log('Is RTL:', isRTL(i18n.language));
console.log('Stored in localStorage:', localStorage.getItem('i18nextLng'));

// Backend
console.log('Request language:', req.language);
console.log('User preference:', req.user?.preferences?.languageCode);
```

### **Test Language Switching**

```typescript
// Switch to different languages
await i18n.changeLanguage('es'); // Spanish
await i18n.changeLanguage('ar'); // Arabic (RTL)
await i18n.changeLanguage('zh-CN'); // Chinese
await i18n.changeLanguage('en'); // Back to English
```

### **Verify Translations**

```typescript
// Check if translation exists
const exists = i18n.exists('welcome.title');
console.log('Translation exists:', exists);

// Get translation with fallback
const text = t('welcome.title', { defaultValue: 'Welcome' });
console.log('Translated text:', text);
```

---

## 📞 SUPPORT

For issues or questions:
1. Check the [Implementation Guide](./I18N_IMPLEMENTATION_GUIDE.md)
2. Review this API reference
3. Contact: dev@sscorporate.com

---

**Last Updated:** January 12, 2026  
**Version:** 1.0.0
