# FEMO SPACE - Global Digital Social + Identity Platform

## Overview
FEMO SPACE is an advanced, multi-platform social ecosystem designed for the modern identity. This monorepo contains the entire suite of applications including web, mobile, desktop, and administrative systems.

## Monorepo Architecture
Our project uses a modern monorepo structure to ensure consistency across all platforms and shared logic.

### Applications (`/apps`)
- **Web App (`/apps/web`)**: The primary browser-based platform built with Vite, React, and Tailwind CSS.
- **Backend API (`/apps/backend`)**: Our core intelligence and data gateway powered by NestJS and Node.js.
- **Admin Panel (`/apps/admin-panel`)**: A high-fidelity command center for platform moderation and analytics.
- **Mobile Apps (`/apps/mobile-android`, `/apps/mobile-ios`)**: Native-integrated mobile experiences.
- **Desktop App (`/apps/desktop`)**: Cross-platform PC application (Electron based).
- **Frontend Legacy (`/apps/frontend`)**: Original React framework implementation.

### Packages (`/packages`)
- Shared UI components, utilities, and types (In Development).

### Documentation (`/docs`)
- Technical guides, architecture reports, and deployment strategies.

## Getting Started
To get the entire platform running locally, follow the specific guides within each application folder.

## Vision
FEMO SPACE aims to redefine how users interact with their digital identities through premium aesthetics, real-time communication, and secure social tools.
