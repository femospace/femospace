# 🎨 i18n UI/UX DESIGN SPECIFICATION
## Visual Design Guide for Language & Country Selectors

**Project:** Femo Space  
**Company:** SS Corporate Inc  
**Design System:** Facebook-Level UX  
**Date:** January 12, 2026

---

## 🌐 LANGUAGE SELECTOR DESIGN

### **Component Type**
Modal Dialog (Facebook-style)

### **Visual Hierarchy**

```
┌─────────────────────────────────────────┐
│  🌐 Choose a Language              ✕   │ ← Header
├─────────────────────────────────────────┤
│  🔍 Search languages...            ✕   │ ← Search Bar
├─────────────────────────────────────────┤
│  🇬🇧 Switch to English                 │ ← Quick Action (if not English)
├─────────────────────────────────────────┤
│  POPULAR LANGUAGES                      │ ← Section Title
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │English│ │Español│ │中文  │ │العربية│  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │ ← Grid Layout
│  │हिन्दी │ │বাংলা  │ │Русский│ │日本語│  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
├─────────────────────────────────────────┤
│  ALL LANGUAGES                          │ ← Section Title
│  ┌─────────────────────────────────┐   │
│  │ Afrikaans        Afrikaans    │   │
│  │ Shqip            Albanian     │   │
│  │ አማርኛ             Amharic      │   │ ← Scrollable List
│  │ العربية ✓        Arabic       │   │   (Native + English)
│  │ Հայերեն          Armenian     │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  Language changes apply instantly       │ ← Footer
└─────────────────────────────────────────┘
```

### **Dimensions**

- **Width:** 600px (max), 90% on mobile
- **Height:** 85vh (max)
- **Border Radius:** 16px
- **Padding:** 20-24px
- **Gap:** 12-16px

### **Colors**

#### **Light Mode**
```css
Background:       #ffffff
Border:           rgba(0, 0, 0, 0.1)
Text Primary:     #1a1a1a
Text Secondary:   #666666
Accent:           #0066ff
Hover:            rgba(0, 102, 255, 0.08)
Active:           rgba(0, 102, 255, 0.12)
```

#### **Dark Mode**
```css
Background:       #1a1a1a
Border:           rgba(255, 255, 255, 0.1)
Text Primary:     #ffffff
Text Secondary:   #999999
Accent:           #4d9fff
Hover:            rgba(0, 102, 255, 0.15)
Active:           rgba(0, 102, 255, 0.2)
```

### **Typography**

```css
Header Title:     20px, 600 weight
Section Title:    13px, 600 weight, uppercase
Language Name:    15px, 500 weight
English Name:     13px, 400 weight
Search Input:     15px, 400 weight
Footer Text:      13px, 400 weight
```

### **Animations**

```css
Modal Entry:      300ms cubic-bezier(0.4, 0, 0.2, 1)
                  Scale: 0.9 → 1.0
                  Opacity: 0 → 1

Backdrop:         300ms ease
                  Opacity: 0 → 1

Language Hover:   200ms ease
                  Background transition

Button Press:     150ms ease
                  Transform: scale(0.98)
```

### **States**

#### **Language Item States**
1. **Default:** Transparent background
2. **Hover:** Light blue background (8% opacity)
3. **Active/Selected:** Blue background (12% opacity) + checkmark
4. **Focus:** Blue outline (2px)

#### **Search Input States**
1. **Default:** Light gray background
2. **Focus:** White background + blue border
3. **Filled:** Show clear button (✕)

### **Accessibility**

- **ARIA Labels:** All interactive elements
- **Keyboard Navigation:** Tab, Enter, Escape
- **Focus Indicators:** Visible outline
- **Screen Reader:** Proper role attributes
- **Contrast Ratio:** WCAG AAA (7:1)

---

## 🗺️ COUNTRY SELECTOR DESIGN

### **Component Type**
Searchable Dropdown

### **Visual Hierarchy**

```
┌─────────────────────────────────────────┐
│  🇺🇸 United States [Detected]      ▼   │ ← Selector Button
└─────────────────────────────────────────┘
         ↓ (when open)
┌─────────────────────────────────────────┐
│  🔍 Search countries...            ✕   │ ← Search Input
├─────────────────────────────────────────┤
│  🇺🇸 United States [Detected]      ✓   │ ← Auto-detected (first)
│  🇦🇫 Afghanistan                        │
│  🇦🇱 Albania                            │
│  🇩🇿 Algeria                            │ ← Scrollable List
│  🇦🇸 American Samoa                     │
│  🇦🇩 Andorra                            │
│  ...                                    │
└─────────────────────────────────────────┘
```

### **Dimensions**

- **Width:** 100% (parent container)
- **Height:** 56px (button), 400px max (dropdown)
- **Border Radius:** 12px (button), 12px (dropdown)
- **Padding:** 14-16px
- **Gap:** 12px

### **Colors**

#### **Light Mode**
```css
Button Background:    #ffffff
Button Border:        rgba(0, 0, 0, 0.1)
Button Hover:         rgba(0, 0, 0, 0.02)
Button Focus:         #0066ff border
Button Error:         #ff3b30 border
Dropdown Background:  #ffffff
Dropdown Shadow:      0 8px 24px rgba(0, 0, 0, 0.15)
```

#### **Dark Mode**
```css
Button Background:    rgba(255, 255, 255, 0.05)
Button Border:        rgba(255, 255, 255, 0.1)
Button Hover:         rgba(255, 255, 255, 0.08)
Dropdown Background:  #1a1a1a
Dropdown Shadow:      0 8px 24px rgba(0, 0, 0, 0.5)
```

### **Typography**

```css
Country Name:     15px, 500 weight
Flag Emoji:       24px (button), 20px (list)
Detected Badge:   11px, 600 weight, uppercase
Placeholder:      15px, 400 weight
```

### **Animations**

```css
Dropdown Entry:   200ms ease
                  Opacity: 0 → 1
                  Transform: translateY(-8px) → translateY(0)

Arrow Rotation:   200ms ease
                  Rotate: 0deg → 180deg

Item Hover:       150ms ease
                  Background transition
```

### **States**

#### **Selector Button States**
1. **Default:** Light gray border
2. **Hover:** Darker border + light background
3. **Focus:** Blue border + shadow
4. **Open:** Blue border
5. **Error:** Red border

#### **Country Item States**
1. **Default:** Transparent background
2. **Hover:** Light blue background
3. **Highlighted (keyboard):** Light blue background
4. **Selected:** Blue background + checkmark

### **Badges**

```css
Detected Badge:
  Background:     rgba(0, 102, 255, 0.1)
  Color:          #0066ff
  Padding:        2px 8px
  Border Radius:  10px
  Font Size:      11px
  Font Weight:    600
  Text Transform: uppercase
  Letter Spacing: 0.5px
```

### **Accessibility**

- **ARIA:** `role="listbox"`, `aria-expanded`, `aria-selected`
- **Keyboard:** Arrow Up/Down, Enter, Escape
- **Focus Management:** Auto-focus search on open
- **Screen Reader:** Announce selected country
- **Mobile:** Touch-friendly (48px min height)

---

## 🎯 INTERACTION PATTERNS

### **Language Selector**

#### **Opening**
1. User clicks language trigger button
2. Backdrop fades in (300ms)
3. Modal scales up and fades in (300ms)
4. Search input auto-focuses

#### **Searching**
1. User types in search input
2. Results filter instantly (no debounce)
3. Show result count in section title
4. Highlight matching text (optional)

#### **Selecting Language**
1. User clicks language item
2. Language changes instantly (no reload)
3. RTL languages flip UI direction
4. Modal fades out (300ms)
5. Backdrop fades out (300ms)
6. Save to localStorage + backend

#### **Quick Switch to English**
1. Always visible if current language ≠ English
2. Prominent blue button
3. One-click switch
4. Same closing animation

### **Country Selector**

#### **Opening**
1. User clicks selector button
2. Dropdown slides down (200ms)
3. Search input auto-focuses
4. Detected country shown first

#### **Searching**
1. User types in search
2. Results filter instantly
3. Keyboard navigation resets to first result

#### **Selecting Country**
1. User clicks country item (or presses Enter)
2. Dropdown closes (200ms)
3. Selected country shows in button
4. Form validation updates

#### **Keyboard Navigation**
1. Arrow Down: Highlight next country
2. Arrow Up: Highlight previous country
3. Enter: Select highlighted country
4. Escape: Close dropdown
5. Type: Focus search input

---

## 📱 RESPONSIVE DESIGN

### **Mobile (< 640px)**

#### **Language Selector**
```css
Width:            95vw
Max Height:       90vh
Border Radius:    12px
Grid Columns:     2 (instead of 4)
Padding:          16px (instead of 24px)
Font Size:        14px (instead of 15px)
```

#### **Country Selector**
```css
Dropdown Height:  60vh (instead of 400px)
Touch Target:     48px min height
Font Size:        14px
Padding:          12px (instead of 14px)
```

### **Tablet (640px - 1024px)**
- Same as desktop
- Slightly reduced padding

### **Desktop (> 1024px)**
- Full specifications as defined above
- Hover states enabled
- Keyboard shortcuts visible

---

## 🌙 DARK MODE

### **Automatic Detection**
```css
@media (prefers-color-scheme: dark) {
  /* Apply dark mode styles */
}
```

### **Color Adjustments**
- Reduce contrast for comfort
- Softer shadows
- Lighter borders
- Adjusted accent colors

### **Consistency**
- All components support dark mode
- Smooth transition between modes
- Respect system preferences

---

## ♿ ACCESSIBILITY FEATURES

### **Keyboard Navigation**
- ✅ Tab through all interactive elements
- ✅ Enter to activate
- ✅ Escape to close
- ✅ Arrow keys for navigation
- ✅ Home/End for first/last item

### **Screen Reader Support**
- ✅ Proper ARIA labels
- ✅ Role attributes
- ✅ Live regions for updates
- ✅ Descriptive button text

### **Visual Accessibility**
- ✅ High contrast ratios (WCAG AAA)
- ✅ Focus indicators
- ✅ Large touch targets (48px min)
- ✅ Clear error messages

### **Motion Accessibility**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🎨 DESIGN TOKENS

### **Spacing Scale**
```css
--space-xs:  4px
--space-sm:  8px
--space-md:  12px
--space-lg:  16px
--space-xl:  24px
--space-2xl: 32px
```

### **Border Radius**
```css
--radius-sm:  8px
--radius-md:  12px
--radius-lg:  16px
--radius-xl:  24px
--radius-full: 9999px
```

### **Shadows**
```css
--shadow-sm:  0 2px 8px rgba(0, 0, 0, 0.1)
--shadow-md:  0 4px 16px rgba(0, 0, 0, 0.12)
--shadow-lg:  0 8px 24px rgba(0, 0, 0, 0.15)
--shadow-xl:  0 20px 60px rgba(0, 0, 0, 0.3)
```

### **Transitions**
```css
--transition-fast:   150ms ease
--transition-base:   200ms ease
--transition-slow:   300ms ease
--transition-smooth: 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

---

## 📐 LAYOUT GRID

### **Language Selector Grid**
```css
Popular Languages:
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr))
  gap: 8px

All Languages:
  display: flex
  flex-direction: column
  gap: 2px
```

### **Spacing Consistency**
- Header padding: 20px 24px
- Section padding: 0 24px
- Item padding: 14px 24px
- Gap between sections: 24px

---

## 🔤 FONT SYSTEM

### **Font Family**
```css
Primary:   -apple-system, BlinkMacSystemFont, 'Segoe UI', 
           Roboto, Oxygen, Ubuntu, Cantarell, sans-serif

Monospace: 'SF Mono', Monaco, 'Cascadia Code', 
           'Courier New', monospace
```

### **Font Weights**
```css
Regular:   400
Medium:    500
Semibold:  600
Bold:      700
```

### **Line Heights**
```css
Tight:     1.2
Normal:    1.5
Relaxed:   1.75
```

---

## 🎭 MICRO-INTERACTIONS

### **Button Press**
```css
transform: scale(0.98)
transition: 150ms ease
```

### **Hover Lift**
```css
transform: translateY(-1px)
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
transition: 200ms ease
```

### **Ripple Effect** (Optional)
```css
position: relative
overflow: hidden

&::after {
  content: ''
  position: absolute
  border-radius: 50%
  background: rgba(255, 255, 255, 0.5)
  transform: scale(0)
  animation: ripple 600ms ease-out
}
```

---

## 📊 PERFORMANCE

### **Optimization**
- ✅ Lazy load language data
- ✅ Virtualize long lists (if > 100 items)
- ✅ Debounce search (optional)
- ✅ CSS containment for modals
- ✅ GPU-accelerated animations

### **Metrics**
- Modal open: < 300ms
- Search filter: < 50ms
- Language switch: < 100ms
- Dropdown open: < 200ms

---

## 🧪 TESTING CHECKLIST

### **Visual Testing**
- [ ] Light mode appearance
- [ ] Dark mode appearance
- [ ] RTL language layout
- [ ] Mobile responsive
- [ ] Tablet responsive
- [ ] Desktop responsive

### **Interaction Testing**
- [ ] Click to open
- [ ] Search functionality
- [ ] Language selection
- [ ] Country selection
- [ ] Keyboard navigation
- [ ] Touch gestures (mobile)

### **Accessibility Testing**
- [ ] Screen reader compatibility
- [ ] Keyboard-only navigation
- [ ] Focus indicators visible
- [ ] Color contrast ratios
- [ ] Touch target sizes

---

**Design System Version:** 1.0.0  
**Last Updated:** January 12, 2026  
**Maintained by:** SS Corporate Inc Design Team
