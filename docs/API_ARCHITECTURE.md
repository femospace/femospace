# Femo Space Backend API Architecture (NestJS)

## 1. System Overview
The backend is a **Monolithic Modular Architecture** built with NestJS. It enables horizontal scaling via stateless services and uses Redis for hot data/caching.

**Tech Stack:**
- **Framework**: NestJS (Node.js)
- **Database**: MongoDB (Mongoose) + Redis (Cache/Queue)
- **Real-time**: Socket.IO
- **Documentation**: Swagger (OpenAPI 3.0)

---

## 2. Global Module Structure (`src/`)

```bash
src/
├── app.module.ts
├── main.ts
├── common/             # Global Guards, Interceptors, Filters
│   ├── decorators/     # @CurrentUser(), @Public()
│   ├── filters/        # HttpExceptionFilter
│   ├── guards/         # JwtAuthGuard, RolesGuard
│   └── pipes/          # ValidationPipe
├── modules/
│   ├── auth/           # Authentication & Session
│   ├── users/          # User management
│   ├── profiles/       # Public Profiles
│   ├── feed/           # Feed Algorithm & Posts
│   ├── media/          # File Uploads & Processing
│   ├── chat/           # Real-time Messaging
│   ├── creator/        # Creator Tools & Analytics
│   ├── business/       # Commerce & Ads
│   └── ai/             # AI Integration
└── config/             # Environment Config
```

---

## 3. Core Modules & Endpoints

### A. Feed Module (`/feed`, `/posts`)
*Handles content creation, retrieval, and interaction.*

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/feed` | Get personalized feed (cursor-based pagination) | User |
| `POST` | `/posts` | Create new post | User |
| `GET` | `/posts/:id` | Get single post details | Public |
| `PATCH` | `/posts/:id` | Update post content | Owner |
| `POST` | `/posts/:id/like` | Toggle like status | User |

**DTO Example: `CreatePostDto`**
```typescript
{
  type: 'text' | 'image' | 'video';
  content: string;
  mediaUrls?: string[];
  visibility: 'public' | 'friends' | 'private';
  tags?: string[];
}
```

### B. Business Module (`/business`)
*Handles shops, products, and orders.*

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/business` | Register new business | User |
| `POST` | `/business/:id/products` | Add product to inventory | Owner |
| `GET` | `/business/:id/analytics` | Get sales report | Owner |

### C. AI Module (`/ai`)
*Internal service for intelligence.*

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/ai/moderation` | Check text/image for violations | System |
| `POST` | `/ai/feed-rank` | Re-rank candidate posts for user | System |

---

## 4. Security Strategy

### Authentication
- **Access Token**: JWT (Expires 15m). Signed with extensive payload (`sub`, `roles`, `kycLevel`).
- **Refresh Token**: Opaque token in `httpOnly` Cookie (Expires 7d). Stored in Redis with device fingerprint.

### Rate Limiting
- **Global**: 100 req/min per IP.
- **Auth**: 5 req/min (Login/Register).
- **Upload**: 10 req/min.

---

## 5. Caching Strategy (Redis)

- **Feed Cache**: `feed:{userId}` -> List of Post IDs (Updated on new follow/post).
- **Session**: `session:{sessionId}` -> User metadata.
- **Counters**: `post:{id}:likes` -> Atomic increment, sync to Mongo every 1 m.

---

## 6. Response Format (Standardized)

All API responses follow the **JSend** specification variant:

```json
{
  "status": "success",
  "data": {
    "post": { "id": "123", "text": "Hello" }
  },
  "meta": {
    "page": 1,
    "total": 50
  }
}
```
**Error Response:**
```json
{
  "status": "error",
  "code": "AUTH_INVALID_TOKEN",
  "message": "The token has expired.",
  "timestamp": "2026-01-01T12:00:00Z"
}
```

