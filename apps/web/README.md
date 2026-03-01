# Femo Space - Web App

Premium welcome system and social platform frontend built with React, TypeScript, and modern web technologies.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Three.js** - 3D/WebGL Graphics
- **React Router** - Routing
- **i18next** - Internationalization

## 🌟 Features

- ✨ Premium futuristic design
- 🌍 Global language support (11+ languages)
- 🎨 Smooth animations and micro-interactions
- 🔐 Secure route protection
- 📱 Fully responsive
- 🌙 Dark mode support
- ⚡ Performance optimized

## 📁 Project Structure

```
web-app/
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts (Auth, etc.)
│   ├── pages/          # Page components
│   ├── i18n.ts         # Language configuration
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── public/             # Static assets
└── index.html          # HTML template
```

## 🔧 Configuration

- **Port**: 5173 (configurable in `vite.config.ts`)
- **Backend API**: `http://localhost:3000` (update in `AuthContext.tsx`)

## 📚 Documentation

See [WELCOME_SYSTEM.md](./WELCOME_SYSTEM.md) for detailed documentation about the welcome system architecture, language system, animations, and security.

## 🎯 Key Components

- **Welcome Page** - Entry point with animated background
- **Login/Register Modals** - Authentication forms
- **Protected Routes** - Secure access control
- **Language Selector** - Global language switching
- **Animated Background** - WebGL particle system

## 🔐 Authentication

The app uses JWT tokens stored in localStorage. Protected routes automatically redirect unauthenticated users to the welcome page.

## 🌐 Internationalization

Languages are auto-detected from browser settings. Users can manually switch languages using the footer language selector.

## 📝 License

© 2026 SS Corporate Inc


