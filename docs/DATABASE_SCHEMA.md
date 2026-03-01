# Femo Space Database Architecture (MongoDB)

## 1. Core Design Principles
This architecture is designed for **Horizontal Scalability**, **High Availability**, and **AI-Readiness**.

- **Sharding**: User-centric sharding for data locality.
- **Data Model**: Hybrid approach (Embedding for limits, Referencing for unbound growth).
- **read/Write Separation**: Primary for Writes, Secondaries for Analytics/Reads.
- **AI Pipelines**: Change Streams enabled on `Posts`, `Reels`, `Messages` for real-time moderation and vectorization.

---

## 2. Collection Definitions & Schemas

### A. Identity & Access

#### `users` (Shard Key: `_id` ranged)
*Core identity. High security.*
```typescript
{
  _id: ObjectId,
  auth: {
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    passwordHash: String,
    salt: String,
    2faSecret: String
  },
  profileId: { type: ObjectId, ref: 'Profile' },
  status: { type: String, enum: ['active', 'suspended', 'deleted'], default: 'active' },
  roles: [{ type: String, enum: ['user', 'creator', 'business', 'admin'] }],
  security: {
    loginAttempts: Number,
    lockUntil: Date,
    lastLoginDevice: String,
    lastLoginIP: String
  },
  settings: {
    language: String,
    country: String,
    theme: String
  },
  timestamps: { createdAt: Date, updatedAt: Date }
}
```

#### `profiles` (Shard Key: `userId`)
*Public facing data. High read volume.*
```typescript
{
  _id: ObjectId,
  userId: { type: ObjectId, unique: true }, // 1-to-1
  username: { type: String, unique: true },
  displayName: String,
  assets: {
    avatar: String,
    cover: String
  },
  bio: String,
  stats: {
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    posts: { type: Number, default: 0 }
  },
  badges: [{ type: String, enum: ['verified', 'vip', 'og'] }],
  aiTags: [String] // For discovery
}
```

#### `sessions` (TTL Collection)
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  tokenHash: String,
  device: { type: String, model: String, os: String },
  ip: String,
  location: { type: 'Point', coordinates: [Number] },
  expiresAt: { type: Date, expires: 0 } // Auto-delete
}
```

---

### B. Content Engine

#### `posts` (Shard Key: `authorId` hashed)
*Main feed content.*
```typescript
{
  _id: ObjectId,
  author: {
    id: ObjectId,
    type: { type: String, enum: ['user', 'page', 'group'] }
  },
  content: {
    type: { type: String, enum: ['text', 'image', 'video', 'link'] },
    text: String,
    media: [{ url: String, type: String, metadata: Object }]
  },
  metrics: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
  },
  visibility: { type: String, enum: ['public', 'friends', 'private'] },
  isPromoted: { type: Boolean, default: false },
  aiAnalysis: { sentiment: Number, tags: [String], safetyScore: Number },
  createdAt: Date
}
```

#### `reels` (Shard Key: `_id` ranged)
*High velocity short-form video.*
```typescript
{
  _id: ObjectId,
  creatorId: ObjectId,
  video: {
    url: String,
    durationSec: Number,
    resolution: String
  },
  meta: {
    caption: String,
    hashtags: [String],
    musicId: ObjectId
  },
  stats: {
    plays: Number,
    completePlays: Number,
    engagementScore: Number // Computed
  },
  monetization: { enabled: Boolean, revenue: Number },
  createdAt: Date
}
```

---

### C. Social Graph

#### `follows`
```typescript
{
  _id: ObjectId,
  followerId: ObjectId,
  targetId: ObjectId,
  targetType: { type: String, enum: ['user', 'page'] },
  createdAt: Date
}
// Compound Index: { followerId: 1, targetId: 1 } (Unique)
// Compound Index: { targetId: 1, followerId: 1 } (Reverse lookup)
```

---

### D. Communication (Real-time)

#### `chats`
```typescript
{
  _id: ObjectId,
  type: { type: String, enum: ['direct', 'group'] },
  participants: [{ 
    userId: ObjectId, 
    role: String, 
    lastReadAt: Date 
  }],
  lastMessage: {
    content: String,
    senderId: ObjectId,
    sentAt: Date
  },
  metadata: { name: String, icon: String }
}
```

#### `messages` (Shard Key: `chatId`)
```typescript
{
  _id: ObjectId,
  chatId: ObjectId,
  senderId: ObjectId,
  type: { type: String, enum: ['text', 'image', 'video', 'call_log'] },
  content: String, // Or Encrypted String
  attachments: [Object],
  readBy: [ObjectId],
  createdAt: Date
}
```

---

### E. Business & Commerce

#### `businesses`
```typescript
{
  _id: ObjectId,
  ownerId: ObjectId,
  name: String,
  verification: {
    status: String,
    documents: [String]
  },
  walletId: ObjectId,
  settings: Object
}
```

#### `products`
```typescript
{
  _id: ObjectId,
  businessId: ObjectId,
  details: {
    name: String,
    sku: String,
    description: String,
    price: { amount: Number, currency: String }
  },
  inventory: {
    stock: Number,
    reserved: Number
  },
  variants: [Object]
}
```

#### `orders`
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  businessId: ObjectId,
  items: [{ productId: ObjectId, qty: Number, priceAtBuy: Number }],
  total: { amount: Number, currency: String },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered'] },
  paymentId: ObjectId,
  createdAt: Date
}
```

---

## 3. Indexing Strategy

| Collection | Index Keys | Type | Purpose |
| :--- | :--- | :--- | :--- |
| `users` | `auth.email` | Unique | Login lookup |
| `users` | `auth.phone` | Unique | Login lookup |
| `posts` | `author.id` + `createdAt` | Compound | Profile feed fetching |
| `posts` | `aiAnalysis.tags` | Multikey | Discovery/Search |
| `reels` | `stats.engagementScore` | Descending | Viral Algorithm |
| `messages`| `chatId` + `createdAt` | Compound | Chat history pagination |
| `notifications` | `userId` + `isRead` | Compound | Unread count badges |
| `sessions` | `expiresAt` | TTL | Automatic cleanup |

---

## 4. Sharding Strategy

1.  **User-Centric Collections (`users`, `profiles`, `notifications`)**:
    -   **Shard Key**: `_id` (Ranged) or Hashed UserID.
    -   **Reason**: Traffic is distributed.
2.  **High-Volume Content (`posts`, `reels`, `messages`)**:
    -   **Shard Key**: `chatId` (Messages) -> Keeps chat history on one shard.
    -   **Shard Key**: `hashed(authorId)` (Posts) -> Distributes write load of viral celebrity posts.
3.  **Analytics (`audit_logs`)**:
    -   **Shard Key**: `{ timestamp: 1 }` (Time-series optimization).

---

## 5. Security & Relationships

-   **Referencing Strategy**: Use References (`ObjectId`) for `feeds`, `followers`, `messages` to avoid 16MB Doc Limit.
-   **Embedding Strategy**: Use Embedding for `post.media`, `user.settings`, `cart.items` (Atomic updates, small size).
-   **Encryption**: `messages.content` and `users.auth.2faSecret` encrypted at Application Layer (AES-256).
-   **RBAC**: Middleware checks `users.roles` before accessing `Business` or `Admin` collections.

---

## 6. Optimization Notes

-   **Read/Write Splitting**: Route `GET /feed` to Secondary Replicas. Route `POST /content` to Primary.
-   **Caching**: Redis Layer required for `User Sessions` and `Hot Feeds` to reduce Mongo load.
-   **Archiving**: Move `messages` older than 1 year to Cold Storage (S3/Parquet).

