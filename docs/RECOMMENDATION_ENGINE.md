# Femo Space AI Recommendation Engine (FemoRec)

## 1. System Philosophy
FemoRec is a **Multi-Stage Deep Learning System** designed to optimize for long-term user satisfaction (Retention + Watch Time) rather than just short-term clicks. It aggressively identifies patterns to break echo chambers and democratize creator reach.

---

## 2. Recommendation Architecture Pipeline

The system processes requests in 4 stages (< 200ms latency):

### Stage A: Candidate Generation (Retrieval)
*Input: All Videos (millions)* -> *Output: ~500 Candidates*
1.  **Collaborative Filtering**: "Users who liked what you liked also watched..." (Matrix Factorization).
2.  **Semantic Search**: Vector similarity (using FAISS/Milvus) between User Interest Embedding and Video Content Embedding.
3.  **Graph Walk**: Friends of Friends + Followed Creators recent uploads.
4.  **Exploration Bucket**: Random 5% selection from "New Creators" (Cold Start).

### Stage B: Scoring (Ranking)
*Input: 500 Candidates* -> *Output: Top 50 Scored*
Each video receives a score based on the **Femo Value Formula**:

$$ Score = (V_{engagement} \times W_e) + (V_{quality} \times W_q) + (V_{trend} \times W_t) - P_{negative} $$

#### 1. Engagement Value ($V_{engagement}$)
Predicted probability (0.0 - 1.0) output by multiple DNN heads:
- $P(Like) \times 1.0$
- $P(Comment) \times 3.0$
- $P(Share) \times 6.0$ (High intent)
- $P(Completion) \times 5.0$ (Critical signal)
- $P(Replay) \times 4.0$

#### 2. Content Quality ($V_{quality}$)
- **Resolution**: 4K/1080p (+10%)
- **Audio Clarity**: Trend music detected (+15%)
- **Originality**: Non-duplicate hash (+20%)

#### 3. Trend Factor ($V_{trend}$)
- **Velocity**: Likes/minute > Threshold.
- **Geo-Match**: Content trending in User's City/Country.

#### 4. Penalties ($P_{negative}$)
- **Clickbait**: (Keywords/OCR detection) -50
- **Reported**: -100
- **Already Seen**: -infinity

### Stage C: Re-Ranking (Policy Layer)
*Input: Top 50* -> *Output: Final Feed*
1.  **Diversity Filter**: Ensure no more than 2 videos from same creator/category in a row.
2.  **Fairness Injection**: Force insertion of 1 "Under-discovered Creator" in slots 5-10.
3.  **Ad Injection**: Place highly scored Ad in slot 6 or 12 based on auction.

---

## 3. Cold-Start Strategy (The "Bandit" Approach)

### New Content (Zero Views)
1.  **Analysis**: AI scans frames (Vision) + Audio (Speech-to-Text) + Metadata to assign initial "Category Vector".
2.  **Seed Audience**: Push to 100 "Hyper-Active Explorers" (Users who watch new content).
3.  **Signal Check**:
    - If Engagement > Benchmark: Move to "Trending" queue (Push to 1000 users).
    - If Engagement < Benchmark: Stop impression boost, rely on Followers.
4.  **Audio Trends**: If video uses "Rising Audio", give automatic 500 view boost.

### New Users
1.  **Onboarding**: Explicit interest selection (e.g., "Gaming", "Cooking").
2.  **Geo-Bias**: Show top trending content in their country.
3.  **Rapid Calibration**:
    - First 10 videos are diverse archetypes.
    - If User skips "Dance" instantly -> Downrank category -50%.
    - If User watches "Coding" -> Uprank category +200%.

---

## 4. Viral Trend & Creator Fairness Logic

### Trend Detection (Early Warning)
- **Velocity Tracking**: Calculate $\frac{\Delta Views}{\Delta Time}$. If derivative spikes > 300% in 15 mins -> Flag as **RISING**.
- **Vector Clustering**: If multiple videos with same AudioID or Hashtag get rising velocity -> Flag **TOPIC_TREND**.
- **Action**: Boost visibility of *all* high-quality videos in this cluster by 20%.

### Creator Fairness (Democratization)
- **Problem**: "Rich get richer" (Top 1% get 99% views).
- **Solution**:
    - **New Creator Bonus**: Every new creator gets a "Golden Ticket" (Guaranteed 500 impressions) on first 3 uploads.
    - **Cohort Normalization**: Rank creators against peers with similar follower counts, not against Global Stars.

---

## 5. API Design

### `POST /ai/recommendations`
**Request:**
```json
{
  "userId": "user_123",
  "sessionId": "sess_abc",
  "context": {
    "network": "5g",
    "device": "mobile",
    "timeOfDay": "evening"
  },
  "lastViewed": ["vid_001", "vid_002"], // To avoid duplicates
  "limit": 10
}
```

**Response:**
```json
{
  "batchId": "batch_xyz",
  "items": [
    {
      "id": "vid_999",
      "type": "reel",
      "source": "recommendation",
      "score": 8.45,
      "debugReasons": ["High Completion Predicted", "Trend: Summer Vibes"]
    },
    {
      "id": "vid_555",
      "type": "ad",
      "source": "sponsored"
    }
  ]
}
```

### `POST /ai/feedback` (Real-time Learning)
**Request:**
```json
{
  "userId": "user_123",
  "videoId": "vid_999",
  "events": [
    { "type": "impression", "timestamp": 1234567890 },
    { "type": "play", "durationSec": 15 },
    { "type": "like" }
  ]
}
```

