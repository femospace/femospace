# Femo Space Feed System Schema (MongoDB)

## 1. Schema Definitions

### A. Posts Collection (`posts`)
*Primary feed content.*
```typescript
{
  _id: ObjectId,
  author: { // Denormalized for read performance
    id: ObjectId,
    type: { type: String, enum: ['user', 'page', 'group', 'channel'] },
    name: String,
    avatar: String,
    verified: Boolean
  },
  content: {
    type: { type: String, enum: ['text', 'image', 'gallery', 'video', 'poll'] },
    text: String, // Original
    translations: { en: String, es: String },
    media: [{ 
        url: String, 
        type: String, 
        aspectRatio: Number,
        blurHash: String 
    }],
    pollOptions: [{ id: String, text: String, votes: Number }]
  },
  entities: {
    hashtags: [String], // Lowercase, no #
    mentions: [ObjectId],
    locations: { type: 'Point', coordinates: [Number], name: String }
  },
  visibility: { type: String, enum: ['public', 'connections', 'private'] },
  metrics: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 }
  },
  aiMetadata: {
    classification: String,
    nsfwScore: Number,
    rankingScore: Number,
    embedding: [Number] // Vector for Search
  },
  status: { type: String, enum: ['active', 'deleted', 'archived'] },
  createdAt: Date,
  updatedAt: Date
}
```

### B. Reels Collection (`reels`)
*Short-form high-velocity video.*
```typescript
{
  _id: ObjectId,
  creatorId: ObjectId,
  video: {
    url: String, // HLS Master Playlist
    thumbnail: String,
    duration: Number
  },
  audio: {
    id: ObjectId, // Reference to ‘Audios’ collection
    isOriginal: Boolean,
    name: String
  },
  stats: {
    plays: Number,
    retentionAvg: Number // Average % watched
  },
  createdAt: Date
}
```

### C. Interactions Collection (`interactions`)
*Polymorphic interaction log.*
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  targetId: ObjectId, // Post/Reel ID
  targetType: { type: String, enum: ['post', 'reel', 'comment'] },
  type: { type: String, enum: ['like', 'love', 'haha', 'sad', 'angry'] },
  createdAt: Date
}
```

---

## 2. Indexing Strategy

| Collection | Index Keys | Type | Usage |
| :--- | :--- | :--- | :--- |
| `posts` | `author.id`: 1, `createdAt`: -1 | Compound | Fetch User Profile Feed |
| `posts` | `entities.hashtags`: 1, `createdAt`: -1 | Compound | Trending Topics |
| `posts` | `aiMetadata.embedding`: "vector" | KNN Vector | Related Content / Recommend |
| `posts` | `location`: "2dsphere" | Geo | Local Discovery |
| `interactions`| `userId`: 1, `targetId`: 1 | Unique | Prevent Double Likes |

---

## 3. Scaling & Sharding

-   **Posts/Reels Sharding**: Shard by `hashed(_id)`.
    -   *Reason*: Evenly distributes content across shards, preventing "Hot Shards" when a post goes viral.
    -   *Retrieval*: Feed construction queries multiple shards (Flash Fan-out) or reads from a `UserFeed` Pre-computed Cache (Redis).

-   **Interactions Sharding**: Shard by `targetId`.
    -   *Reason*: Keeps all likes for "Post A" on the same shard, making counting/aggregation faster.

---

## 4. Optimization Techniques

-   **Attribute Pattern**: Store common queries like `author.name` directly in Post to avoid `$lookup` (Join).
-   **Bucket Pattern (Comments)**: Store the first 10 comments inside the Post document for "Preview", referencing the rest in `comments` collection.
-   **Soft Deletes**: `status: 'deleted'` allows easy "Undo" and Audit logging without physical deletion expense.

