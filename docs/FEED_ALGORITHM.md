# Femo Space Home Feed Algorithm (FemoRank)

## 1. Core Philosophy
The Femo Space Feed is a **Hybrid Discovery Engine** that balances **Social Connection** (friends/family) with **Interest-Based Discovery** (TikTok/YouTube style). It maximizes engagement while strictly maintaining content quality and user well-being.

---

## 2. Feed Ranking Logic & Scoring Formula

Every candidate post $P$ is assigned a **FemoScore ($S$)** calculated in real-time for User $U$.

### The Formula
$$ S = (R \times W_r) + (E \times W_e) + (C \times W_c) + (I \times W_i) + (F \times W_f) - P_{neg} $$

Where:

### A. Relationship Score ($R$)
- **Close Friend/Family**: 1.0 (Mutual follow, high interaction)
- **Following (High Interaction)**: 0.8
- **Following (Low Interaction)**: 0.5
- **Group/Channel Member**: 0.6
- **Unconnected (Discovery)**: 0.2

### B. Engagement Probability ($E$)
Predicted probability of user interaction based on history:
- **Like**: 1 point
- **Comment**: 3 points
- **Share**: 5 points
- **Save**: 4 points
- **Click/Tap**: 0.5 points
- **Video Completion (>80%)**: 5 points

### C. Content Quality & Type ($C$)
- **Original High-Res Video/Reel**: 1.2x Boost
- **Live Stream**: 1.5x Boost (Urgency)
- **High-Res Image**: 1.0x
- **Text Only**: 0.8x
- **Link/External**: 0.5x

### D. User Interest Match ($I$)
Vector similarity score between User Interest Embedding and Content Embedding (0.0 to 1.0).

### E. Freshness ($F$)
Decay function based on time $t$ (hours):
$$ F = \frac{1}{(t + 2)^{1.5}} $$
*Viral content decays slower.*

### F. Negative Signals ($P_{neg}$)
- **Reported**: -100
- **Hidden**: -50
- **Low Watch Time (<3s)**: -5
- **Clickbait Detected**: -20

---

## 3. Feed Layout Rules & Sequence
The feed is dynamically assembled using a **Slot-Based Injection System**.

| Slot Position | Content Type Priority | Logic |
| :--- | :--- | :--- |
| **1** | Top Friend / Vital Update | High Affinity score |
| **2** | Viral / High Engagement | Global trend or High Interest |
| **3-4** | Mixed Following | Pages, Groups, Friends |
| **5** | **Reels Injection** | Horizontal scroll or standalone Reel |
| **6** | **Suggested Content** | Discovery (New Creator) |
| **7** | Organic Following | Standard ranking |
| **8** | **Sponsored Ad** | Context-aware allocation |
| **9+** | *Repeat Cycle* | Mix of Organic, Discovery, Ads |

**Constraints:**
- No more than 2 posts from same author in top 10.
- Deduplicate content seen in last 24h.
- Ads strictly labeled and spaced (min 6 organic posts between ads).

---

## 4. Cold Start Strategy
For users with no history ($t < 24h$):

1.  **Onboarding Interest Graph**: Use selected tags from Profile Setup.
2.  **Geo-Trending**: Boost content popular in user's Country/City.
3.  **Global Viral**: High-confidence universally liked content (nature, comedy).
4.  **Exploration Mode**: Rapidly alternate topics (Sports, Tech, Art) in first 20 posts to calibrate interest vector based on scroll-stop time.

---

## 5. Anti-Spam & AI Moderation Layer
Executed *before* ranking pipeline.

1.  **Pre-Filter (Real-time)**:
    - Text Hash Check (Deduplication)
    - Image Hash Check (NSFW/Violence detection via Vision AI)
    - Keyword Blocklist
2.  **Behavioral Analysis**:
    - Mass posting frequency cap.
    - Bot-like activity patterns (0.1s interactions).
3.  **Shadow Banning**:
    - Content identified as "Low Quality" or "Borderline" gets a Visibility Score of 0.1 (shown only to profile visitors, not feed).

---

## 6. Personalization & User Control
Users explicitly train the AI:

- **"Show More" / "Show Less"**: Updates Interest Vector weights immediately (+/- 10%).
- **Mute / Snooze**: Temporary removal from Candidate Set.
- **"Latest" Toggle**: Bypasses Ranking Formula, sorts strictly by $t$ (Time).
- **Privacy Mode**: Disables "Recommended" content, showing only Following.

---

## 7. Discovery & Fairness System
To prevent "The Rich Get Richer" feedback loop:

- **New Creator Boost**: Randomly inject high-quality posts from <1k followers accounts into "Suggested" slots for small test groups (batches of 1000 users). If $E$ (Engagement) > benchmark, expand reach.
- **Diversity Re-ranking**: Final pass ensures diversity in:
    - Creator Ethnicity/Gender (AI estimated)
    - Topic Variety
    - Content Format (Video vs Photo)

---

## 8. Real-Time Adaptation
The feed re-ranks on every "Refresh" or new session.
- **Session Context**: If user is watching only videos for 5 minutes, boost $W_c$ (Video) weight by 50%.
- **Network Awareness**: On 3G/Slow connection, deprioritize 4K Video/Live streams, favor Image/Text.

