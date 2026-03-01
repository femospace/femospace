# Femo Space Creator Monetization System

## 1. Monetization Models & Revenue Logic

### A. Ad Revenue Share (Programmatic)
*Applied to: Videos, Reels, Article Pages.*
-   **Model**: RPM (Revenue Per Mille) based on Viewer Geo & Niche.
-   **Formula**: `(Ad Impressions / 1000) * Geo_CPM * Share_Ratio (55%)`
-   **Conditions**:
    -   Video must be > 1 min for Mid-rolls.
    -   Reels: Ads displayed in-between scroll sessions (Allocated based on viewing session time).

### B. Direct Fan Support
*Applied to: Live Streams (Super Chat), Comments (Stickers).*
-   **Currency**: "Femo Stars" (Virtual Currency).
    -   User buys 100 Stars for $1.00.
    -   Creator receives $0.007 per Star (70%).
    -   Platform keeps 30% (App Store fees + Commission).

### C. Subscriptions (Recurring)
*Applied to: Exclusive Channels/Groups.*
-   **Tiers**: $4.99, $9.99, $24.99 / month.
-   **Split**: 90% to Creator, 10% Platform Fee (Promotional rate).
-   **Billing**: Integrated Stripe Connect / RevenueCat.

---

## 2. Revenue Flow Architecture

**Event Pipeline:**
1.  `ViewEvent` / `TransactionEvent` emitted by Client.
2.  **Validation Layer**: AI Fraud Check (See Section 4).
3.  **Aggregation**: Kafka Stream aggregates events into 15-min buckets.
4.  **Calculation Service**:
    -   Applies CPM rates.
    -   Splits revenue.
    -   Deduducts Taxes (VAT/GST/WHT based on User & Creator Country).
5.  **Ledger Update**: Credits `CreatorWallet.pendingBalance`.

**Payout Pipeline:**
1.  **Escrow**: Earnings held for 21 days (NET-21) to cover chargebacks/refunds.
2.  **Threshold Check**: If `availableBalance > $50` AND `TaxInfo == Valid`.
3.  **Disbursement**: Batch job (Daily) triggers Payout via PayPal/Bank Transfer.

---

## 3. Data Models (Schema)

### `CreatorWallet`
```typescript
{
  _id: ObjectId,
  creatorId: ObjectId,
  currency: 'USD',
  balances: {
    available: Decimal128,
    pending: Decimal128, // In Escrow
    withheld: Decimal128 // Taxes
  },
  taxInfo: { w8ben_signed: Boolean, vat_id: String },
  payoutMethods: [{ type: 'bank'|'paypal', details: Encrypted, isPrimary: Boolean }]
}
```

### `EarningRecord`
```typescript
{
  _id: ObjectId,
  walletId: ObjectId,
  sourceType: 'ad_video' | 'sub' | 'gift',
  contentId: ObjectId, // Which video/reel generated this
  grossAmount: Decimal128,
  netAmount: Decimal128,
  fees: Decimal128,
  date: Date,
  status: 'estimated' | 'finalized'
}
```

---

## 4. Creator Payout API

### `GET /monetization/overview`
Returns specialized dashboard data.
```json
{
  "totalEarnings": 4500.50,
  "rpm": 3.45,
  "topContent": [{ "id": "vid_1", "revenue": 120.00 }],
  "nextPayout": { "date": "2026-02-01", "amount": 1200.00 }
}
```

### `POST /monetization/withdraw`
Triggers manual withdrawal if eligible.

### `GET /monetization/tax-documents`
Returns specific generated PDF forms (1099-K, etc.).

---

## 5. Anti-Fraud & Security System (AI Sentinel)

**Threat Models:**
1.  **Click Farms**: Large scale bot networks watching ads.
2.  **Self-Gifting laundering**: Using stolen credit cards to buy Stars for own account.
3.  **Invalid Traffic**: Repeated reloading of same video.

**Defense Logic:**
-   **Velocity Limit**: Max 5 ad impressions credited per IP per hour for a single creator.
-   **Device Fingerprinting**: If > 10 accounts share same Device ID -> Flag as Farm.
-   **Time-on-Page**: If `watchTime < 0.2 * videoDuration`, Ad Impression is Voided.
-   **AI Audit**: Anomaly detection model monitors RPM spikes. If RPM jumps 500% in 1 hour -> Auto-freeze wallet & alert Risk Team.

---

## 6. Global Tax & Compliance
-   **US Creators**: Issuance of IRS Form 1099.
-   **Non-US**: Withholding Tax (up to 30%) unless Tax Treaty claimed (W-8BEN).
-   **VAT/GST**: Reverse charge mechanism for B2B transactions.

