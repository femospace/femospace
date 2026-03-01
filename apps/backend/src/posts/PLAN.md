# Implementation Plan - Femo Space Post System

This document outlines the architecture and implementation steps for the core Post System of FEMO SPACE.

## 1. Data Modeling (MongoDB/Mongoose)

### 1.1 Post Schema (`posts`)
- `ownerId`: ObjectId (Ref: User, Page, Group, etc.)
- `ownerType`: Enum ['user', 'page', 'group', 'channel', 'business']
- `type`: Enum ['text', 'image', 'video', 'reel', 'poll', 'event', 'product', 'story', 'link', 'audio', 'document', 'ai']
- `content`: Text (string)
- `media`: Array of objects { url, type, thumbnail, duration, metadata }
- `visibility`: Enum ['public', 'followers', 'friends', 'members', 'subscribers', 'private', 'custom']
- `hashtags`: Array of strings
- `mentions`: Array of objects { id, type, name }
- `location`: { name, coordinates: [number, number], city, country }
- `poll`: { options: [{ text, votes }], expiresAt }
- `product`: { id, price, currency, buyUrl }
- `stats`: { views, reaches, likes, shares, saves, comments, engagementRate, revenue }
- `isMonetized`: Boolean
- `status`: Enum ['draft', 'scheduled', 'published', 'archived', 'deleted']
- `scheduledAt`: Date
- `aiMetadata`: { generatedBy, spamScore, sentiment, labels }
- `createdAt`, `updatedAt`

### 1.2 Interaction Schemas
- `reactions`: (Sub-document or separate collection) { postId, userId, type }
- `comments`: { postId, userId, parentId, content, media, interactions, isPinned, moderationStatus }
- `saves`: { postId, userId, collectionName }

## 2. Backend Implementation (NestJS)

### 2.1 Post Module
- `PostModule`: Registration of schemas and services.
- `PostService`: Core logic for creating, retrieving, and interacting with posts.
- `PostController`: REST API endpoints.

### 2.2 Feed System
- Personalized feed generation based on following, interests, and AI recommendations.
- Support for different feed types: 'foryou', 'following', 'trending', 'nearby'.

### 2.3 AI Integration
- `AIService` connection for:
    - Auto-caption generation.
    - Spam & Abuse detection.
    - Content translation.
    - Image/Video analysis for tagging.

### 2.4 Monetization & Promotion
- Boosting logic for promoted posts.
- Affiliate and product tagging integration.

## 3. Frontend Implementation (React)

### 3.1 Post Creation (The "Composer")
- Ultra-modern, responsive modal.
- Multi-media drag & drop with previews.
- AI assistance sidebar.
- Advanced settings for visibility and monetization.

### 3.2 Post Display
- High-performance infinite scroll feed.
- Dynamic layout based on post type (e.g., Grid for carousel, Full-width for reels).
- Interactive reactions and threaded comment section.

## 4. Security & Moderation
- RBAC/ABAC check for post actions.
- Rate limiting for creation and interactions.
- Automated shadow-banning for detected spam.

---
Next Steps:
1. Create `Post` and `Comment` schemas.
2. Implement `PostService` with basic CRUD and feed logic.
3. Build the Post Composer UI.
