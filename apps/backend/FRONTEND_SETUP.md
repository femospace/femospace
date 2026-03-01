# Frontend Setup for Femo Space

The frontend is located in the `web-app` directory (sibling to this backend folder).

## Quick Start

From the web-app directory:

```bash
npm install
npm start
```

The frontend will start on port 5173 by default (or port 3000 if available).

## Environment Configuration

Create a `.env` file in the web-app root directory:

```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ENVIRONMENT=development
```

## Installation Issues

If you see "Missing script: start", follow these steps:

1. **Navigate to web-app directory**
   ```bash
   cd ../web-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

## Project Structure

```
web-app/
├── public/
│   └── index.html
├── src/
│   ├── auth/
│   │   ├── Register.tsx           # Main 3-step component
│   │   ├── Register.module.css    # Styling
│   │   ├── steps/
│   │   │   ├── Step1.tsx          # Personal info form
│   │   │   ├── Step2.tsx          # Account setup form
│   │   │   └── Step3.tsx          # Finalization form
│   │   └── constants/
│   │       └── countries.ts       # Country codes list
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── package.json
├── tsconfig.json
└── README.md
```

## Available Scripts

- `npm start` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)

## Backend Integration

Make sure the backend is running before starting the frontend:

```bash
# In backend directory
npm run start:dev
```

The frontend connects to: `http://localhost:3000/auth/register/...`

## Deployment

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory, ready to be served by any static host.
