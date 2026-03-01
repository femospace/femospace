# Femo Space Hybrid Chat & AI System Architecture

## 1. System Overview
The system utilizes a **Hybrid Architecture**:
- **WebSocket (Socket.IO)**: For real-time delivery (typing, presence, messages, signaling).
- **REST API**: For history, file uploads, and heavy analytics.
- **AI Layer**: Asynchronous processing pipeline for assistance and moderation.

---

## 2. Infrastructure & Scaling

### Gateway Layer
- **Socket.IO Adapters**: Using **Redis Streams** to broadcast events across multiple backend instances (`chat-service-1` ... `chat-service-N`).
- **Load Balancer**: Sticky Sessions (Session Affinity) required for WebSocket handshake.

### Data Storage Strategy
- **Hot Data (Redis)**: Presence (Online/Offline), Typing Status, Recent Messages (Last 50).
- **Warm Data (MongoDB)**: Chat History, Group Metadata, User Settings.
- **Cold Data (S3 + Parquet)**: Messages older than 1 year (Archived).

---

## 3. Communication Flows

### A. Human-to-Human (E2EE)
1.  **Key Exchange**: Signal Protocol (X3DH) keys exchanged via server.
2.  **Transport**:
    -   Sender encrypts payload -> Emits `message:send`.
    -   Server receives (Blind) -> Stores -> Emits `message:receive` to Recipient.
    -   Recipient decrypts payload.
3.  **Media**: Upload to S3 -> Get Presigned URL -> Send URL in encrypted payload.

### B. Group Chat & Calls (WebRTC)
-   **SFU (Selective Forwarding Unit)**: For Group Video Calls (3+ users) to reduce bandwidth.
    -   `mediasoup` or `Jitsi` integration.
-   **Signaling**: Socket.IO handles SDP Offer/Answer/ICE Candidates.

### C. AI Chat (Assistant)
1.  **Routing**: User DM with `@ai_bot`.
2.  **Processing**:
    -   Server detects `chatType: 'ai'`.
    -   Pushes context to **LLM Service Queue** (BullMQ).
    -   LLM Service (Python/FastAPI) processes prompt + Context.
    -   Stream response back via Socket event `ai:typing` -> `ai:response`.

---

## 4. AI Moderation Pipeline (Real-Time safety)

Executed *before* distribution for public groups, or *post-distribution* (async) for private chats (metadata only) to preserve E2EE (unless reported).

1.  **Text**: `SpamAssassin` + `BERT` Toxicity Model.
    -   Flag: "Kill yourself" -> Critical Alert -> Auto-hide -> Notify Admin.
2.  **Image**: `MobileNet` NSFW Classification.
    -   Flag: Nudity -> Auto-blur -> Tag "Sensitive Content".
3.  **Shadow Ban Logic**:
    -   If User Abuse Score > Threshold: Messages are "sent" successfully on Client, but Server **drops** them silently for recipients.

---

## 5. Data Models (Schema)

### `ChatRoom`
```typescript
{
  _id: ObjectId,
  type: 'direct' | 'group' | 'ai',
  participants: [{ userId: ObjectId, role: 'admin'|'member', keyBundle: String }],
  encryption: { enabled: Boolean, v: Number },
  settings: { muteUntil: Date },
  lastMessage: { content: String, senderId: ObjectId, ts: Date }
}
```

### `Message`
```typescript
{
  _id: ObjectId,
  chatId: ObjectId,
  senderId: ObjectId, // or 'system' or 'ai'
  content: {
    text: String, // Encrypted or Plain
    media: { type: 'image'|'audio', url: String, mime: String }
  },
  aiMetadata: {
    isGenerated: Boolean,
    promptTokens: Number
  },
  status: {
    deliveredTo: [ObjectId],
    readBy: [ObjectId]
  },
  createdAt: Date
}
```

---

## 6. Security Model

-   **Transport Security**: TLS 1.3 for all WS/HTTPS connections.
-   **E2EE**: Implementation of Signal Protocol for DMs.
-   **Perfect Forward Secrecy**: New session keys for every session.
-   **Access Control**: Signed JWT required for Socket Connection handshake.
-   **Rate Limiting**:
    -   Text: 10 msg/sec.
    -   Media: 5 msg/min.
    -   AI: 50 requests/day (Free tier).

---

## 7. AI Routing Logic (Pseudo-code)
```typescript
on('message:send', async (socket, data) => {
  if (data.target === 'AI_AGENT') {
     // 1. Instant Ack
     socket.emit('message:ack', { id: data.id });
     
     // 2. Mod Check
     const risk = await ModerationAI.check(data.text);
     if (risk.isUnsafe) return socket.emit('error', 'Violation');

     // 3. Queue for LLM
     JobQueue.add('ai_response', { prompt: data.text, history: getLast10(socket.user) });
  } else {
     // Human delivery
     SocketServer.to(data.roomId).emit('message:new', data);
  }
});
```

