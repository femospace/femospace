# Femo Space Advertising System Architecture (FemoAds)

## 1. Ad Delivery Algorithm (Real-Time Pipeline)
The system must select the best ad for a user in < 50ms.

**Pipeline Steps:**
1.  **Retrieval (Targeting Match)**: Fetch 500 candidate ads where `Ad.Targeting` matches `User.Profile` (Location, Interest, Age).
2.  ** filtering**: Remove ads recently shown (Frequency Capping), blocked categories, or low budget.
3.  **Prediction (AI Layer)**:
    -   Predict **CTR (Click-Through Rate)**.
    -   Predict **CVR (Conversion Rate)**.
4.  **Ranking (eCPM Calculation)**:
    -   Formula: `eCPM = Bid_Price * pCTR * Quality_Score * 1000`
5.  **Auction (VCG / Generalized Second Price)**: Winner pays the price of the 2nd highest bidder + $0.01.

---

## 2. Real-Time Bidding (RTB) Model

### Bidding Strategies
-   **Manual CPC**: Advertiser sets Max CPC.
-   **Auto-Bid (AI)**: System adjusts bid to maximize Conversions within Budget.
    -   *Logic*: If `User.ConversionPropensity > High`, Bid = `Max_Bid * 1.5`.

### Pacing Algorithm (Smooth Delivery)
To prevent spending daily budget in 1 hour:
-   **PID Controller**: Monitors fluid burn rate.
    -   `Target_Burn_Rate = Daily_Budget / Remaining_Hours`.
    -   If `Current_Rate > Target`, reduce participation in Auctons by `Throttle_Factor`.

---

## 3. Targeting & Audience Engine

### Audience Types
1.  **Core Audiences**: Location (Geo-fence), Demographics, Interests (Vector matching).
2.  **Custom Audiences**: Uploaded Email Lists (hashed), Website Visitors (Femo Pixel).
3.  **Lookalike Audiences (AI)**: Users with similar embedding vectors to Custom Audience.
    -   `Vector_Sim(User_A, Seed_User) > 0.85`.

---

## 4. Ad Formats & Placements

| Format | Placement | Specs | Constraints |
| :--- | :--- | :--- | :--- |
| **Feed Ad** | In-Feed (Slot 6, 12) | Image/Video (4:5) | Native look, distinct "Sponsored" label |
| **Reel Ad** | Content Interstitial | Vertical Video (9:16) | Full screen, skippable after 5s |
| **Story Ad** | Between Stories | Vertical (9:16) | 15s max |
| **Search Ad** | Search Results Top | Text + Thumbnail | Query Relevance > 0.9 |

---

## 5. AI Optimization Logic

### Creative Efficiency
-   **Dynamic Creative Optimization (DCO)**: AI permutes Headlines, Images, and CTAs to find best combo for specific user demographic.
-   **Fatigue Detection**: If `Impressions > 3` AND `CTR < 0.1%`, stop showing ad to that user.

### Click Fraud Detection (The "Iron Dome")
-   **Pattern**: Rapid clicks from same IP subnet.
-   **Timing**: Clicks < 500ms after render (Bot behavior).
-   **Action**: Void charge, flag IP, shadow-ban bot.

---

## 6. API Design (Ad Manager)

### Campaign Management
-   `POST /ads/campaigns`: Create objective (Traffic, Sales).
-   `POST /ads/adsets`: Define Budget, Schedule, Targeting.
-   `POST /ads/creatives`: Upload Assets.

### Reporting
-   `GET /ads/analytics`:
    -   Metrics: Impressions, CPM, CPC, ROAS (Return on Ad Spend).
    -   Breakdown: By Device, Region, Age.

### Pixel API (Event Tracking)
-   `POST /ads/pixel/event`: ` { event: 'Purchase', value: 50.00, currency: 'USD' } `

---

## 7. Compliance
-   **Ad Library**: Public archive of all active ads (Transparency).
-   **Sensitive Categories**: Strict rules for Politics, Housing, Credit (No discriminatory targeting).

