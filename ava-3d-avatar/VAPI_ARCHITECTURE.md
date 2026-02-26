# 🏗️ Vapi Integration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     USER'S BROWSER                          │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                    React App                          │ │
│  │                                                       │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │   Avatar    │  │ VapiControls │  │   Console   │ │ │
│  │  │ (3D Model)  │  │   (UI)       │  │   (Chat)    │ │ │
│  │  └──────┬──────┘  └──────┬───────┘  └──────┬──────┘ │ │
│  │         │                │                  │        │ │
│  │         └────────────────┼──────────────────┘        │ │
│  │                          │                           │ │
│  │                   ┌──────▼──────┐                    │ │
│  │                   │  useVapi    │                    │ │
│  │                   │   Hook      │                    │ │
│  │                   └──────┬──────┘                    │ │
│  │                          │                           │ │
│  └──────────────────────────┼───────────────────────────┘ │
│                             │                             │
│                    ┌────────▼────────┐                    │
│                    │  Vapi Web SDK   │                    │
│                    │  (@vapi-ai/web) │                    │
│                    └────────┬────────┘                    │
└─────────────────────────────┼───────────────────────────────┘
                              │
                              │ WebSocket
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                      VAPI CLOUD                             │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Deepgram   │  │     Groq     │  │ Eleven Labs  │    │
│  │    (STT)     │─▶│    (LLM)     │─▶│    (TTS)     │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Voice Activity Detection (VAD)               │  │
│  │         Interruption Handling                        │  │
│  │         Turn-taking Logic                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              │ Webhooks (Optional)
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                   YOUR BACKEND (Optional)                   │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   vapi.mjs   │  │  Webhooks    │  │   Custom     │    │
│  │   (Module)   │  │  (Events)    │  │  Functions   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Database, Analytics, Business Logic          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Voice Conversation Flow

```
1. USER SPEAKS
   │
   ├─▶ Browser captures audio (MediaRecorder)
   │
   ├─▶ Vapi Web SDK streams to Vapi Cloud
   │
   └─▶ VoiceVisualizer shows activity

2. VAPI CLOUD PROCESSES
   │
   ├─▶ Deepgram: Audio → Text (STT)
   │   └─▶ Transcript sent to browser
   │
   ├─▶ Groq: Text → AI Response (LLM)
   │   └─▶ Response text generated
   │
   └─▶ Eleven Labs: Text → Audio (TTS)
       └─▶ Audio streamed to browser

3. AVATAR RESPONDS
   │
   ├─▶ useVapi hook receives message
   │
   ├─▶ Avatar component updates
   │   ├─▶ Lip-sync from transcript
   │   ├─▶ Facial expression from emotion
   │   └─▶ Animation from context
   │
   └─▶ Audio plays in browser
```

### Component Hierarchy

```
<App>
  │
  ├─▶ <VapiProvider>                    ← Wraps entire app
  │     │
  │     ├─▶ Context: {
  │     │     isCallActive,
  │     │     isSpeaking,
  │     │     transcript,
  │     │     currentMessage,
  │     │     error
  │     │   }
  │     │
  │     └─▶ Vapi SDK Instance
  │
  ├─▶ <CyberpunkLayout>
  │     │
  │     ├─▶ <TopHUD />
  │     │     └─▶ Shows call status
  │     │
  │     ├─▶ <HUDPanel position="left" />
  │     │     └─▶ Shows system stats
  │     │
  │     ├─▶ <HUDPanel position="right" />
  │     │     └─▶ Shows user stats
  │     │
  │     ├─▶ <AIReactor>
  │     │     └─▶ <Canvas>
  │     │           └─▶ <Scenario>
  │     │                 └─▶ <Avatar />
  │     │                       ├─▶ Reads: currentMessage
  │     │                       ├─▶ Updates: animations
  │     │                       └─▶ Syncs: lip movements
  │     │
  │     ├─▶ <VoiceVisualizer />
  │     │     └─▶ Shows: isSpeaking
  │     │
  │     ├─▶ <VapiControls />           ← NEW!
  │     │     ├─▶ Start/Stop Call
  │     │     ├─▶ Show Status
  │     │     ├─▶ Display Transcript
  │     │     └─▶ Handle Errors
  │     │
  │     └─▶ <CommandConsole />
  │           └─▶ Text-based fallback
  │
  └─▶ </VapiProvider>
```

## State Management

### useVapi Hook State

```javascript
{
  // Vapi SDK instance
  vapi: VapiInstance,
  
  // Call state
  isCallActive: boolean,      // Is call in progress?
  isSpeaking: boolean,        // Is user speaking?
  
  // Content
  transcript: string,         // Current user speech
  messages: Message[],        // Message queue
  currentMessage: Message,    // Currently playing
  
  // Error handling
  error: string | null,       // Any errors
  
  // Methods
  startCall: (assistantId?) => Promise<void>,
  stopCall: () => void,
  toggleCall: (assistantId?) => Promise<void>,
  onMessagePlayed: () => void
}
```

### Message Object Structure

```javascript
{
  text: string,              // AI response text
  audio: string | null,      // Audio URL (Vapi handles)
  lipsync: Object | null,    // Lip-sync data
  facialExpression: string,  // Emotion (smile, sad, etc.)
  animation: string          // Animation name
}
```

## Event Flow

### Call Lifecycle

```
START CALL
   │
   ├─▶ Event: "call-start"
   │     └─▶ setIsCallActive(true)
   │
   ├─▶ User speaks
   │     │
   │     ├─▶ Event: "speech-start"
   │     │     └─▶ setIsSpeaking(true)
   │     │
   │     ├─▶ Event: "message" (transcript)
   │     │     └─▶ setTranscript(text)
   │     │
   │     └─▶ Event: "speech-end"
   │           └─▶ setIsSpeaking(false)
   │
   ├─▶ AI responds
   │     │
   │     ├─▶ Event: "message" (assistant)
   │     │     └─▶ Add to message queue
   │     │
   │     └─▶ Audio streams
   │           └─▶ Avatar speaks
   │
   └─▶ END CALL
         │
         └─▶ Event: "call-end"
               └─▶ setIsCallActive(false)
```

### Error Handling

```
ERROR OCCURS
   │
   ├─▶ Event: "error"
   │     └─▶ setError(message)
   │
   ├─▶ Display in UI
   │     └─▶ <VapiControls /> shows error
   │
   └─▶ User can retry
         └─▶ Click "Start Call" again
```

## Integration Patterns

### Pattern 1: Client-Side Only (Current)

```
Browser
  └─▶ Vapi Web SDK
        └─▶ Vapi Cloud
              └─▶ STT + LLM + TTS
```

**Pros:**
- Simple setup
- Fast to implement
- No backend needed

**Cons:**
- Limited control
- No server-side logic
- Public API key exposed

### Pattern 2: Server-Side Control (Optional)

```
Browser
  └─▶ Your Backend
        └─▶ Vapi Server SDK
              └─▶ Vapi Cloud
                    └─▶ STT + LLM + TTS
```

**Pros:**
- Full control
- Custom business logic
- Secure API keys

**Cons:**
- More complex
- Backend required
- Additional latency

### Pattern 3: Hybrid (Recommended)

```
Browser
  ├─▶ Vapi Web SDK (WebSocket)
  │     └─▶ Vapi Cloud
  │
  └─▶ Your Backend (Webhooks)
        └─▶ Custom functions
        └─▶ Analytics
        └─▶ Database
```

**Pros:**
- Best of both worlds
- Real-time + control
- Scalable

**Cons:**
- Most complex
- Requires both implementations

## File Structure

```
ava-3d-avatar/
├── apps/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── hooks/
│   │   │   │   ├── useVapi.jsx          ← Vapi integration
│   │   │   │   ├── useSpeech.jsx        ← Current system
│   │   │   │   └── useVoiceActivityDetection.jsx
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── VapiControls.jsx     ← Call controls
│   │   │   │   ├── VapiAvatar.jsx       ← Avatar + Vapi
│   │   │   │   ├── Avatar.jsx           ← Current avatar
│   │   │   │   ├── ChatInterface.jsx
│   │   │   │   └── ...
│   │   │   │
│   │   │   └── App.jsx                  ← Main app
│   │   │
│   │   ├── .env                         ← Vapi config
│   │   └── package.json                 ← Dependencies
│   │
│   └── backend/
│       ├── modules/
│       │   ├── vapi.mjs                 ← Vapi backend
│       │   ├── openAI.mjs               ← Current LLM
│       │   ├── elevenLabs.mjs           ← Current TTS
│       │   └── ...
│       │
│       ├── routes/
│       │   └── vapi.mjs                 ← Vapi routes
│       │
│       ├── .env                         ← Backend config
│       └── server.js                    ← Express server
│
└── Documentation/
    ├── ACTION_REQUIRED.md
    ├── START_HERE.md
    ├── VAPI_README.md
    ├── VAPI_ARCHITECTURE.md             ← You are here
    └── ...
```

## Network Communication

### WebSocket Messages

```javascript
// Client → Vapi
{
  type: "audio",
  data: ArrayBuffer  // Audio chunks
}

// Vapi → Client
{
  type: "transcript",
  transcript: "Hello, how can I help?"
}

{
  type: "message",
  role: "assistant",
  content: "I'd be happy to assist you!"
}

{
  type: "function-call",
  functionCall: {
    name: "check_order",
    parameters: { orderId: "12345" }
  }
}
```

### HTTP Requests (Optional)

```javascript
// Create assistant
POST /api/vapi/assistant
{
  name: "AVA",
  model: { ... },
  voice: { ... }
}

// Generate token
POST /api/vapi/token
{
  assistantId: "asst_123",
  metadata: { userId: "user_456" }
}

// Webhook
POST /api/vapi/webhook
{
  type: "call-ended",
  call: { ... }
}
```

## Security Architecture

```
┌─────────────────────────────────────────┐
│           Browser (Public)              │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  VITE_VAPI_PUBLIC_KEY (pk_...)   │  │
│  │  ✓ Safe to expose                │  │
│  │  ✓ Limited permissions            │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────┬───────────────────────┘
                  │
                  │ WebSocket (Secure)
                  │
┌─────────────────▼───────────────────────┐
│          Vapi Cloud (Secure)            │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Rate limiting                    │  │
│  │  Authentication                   │  │
│  │  Encryption                       │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────┬───────────────────────┘
                  │
                  │ Webhooks (Optional)
                  │
┌─────────────────▼───────────────────────┐
│      Your Backend (Private)             │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  VAPI_API_KEY (sk_...)           │  │
│  │  ✗ Never expose                   │  │
│  │  ✓ Full permissions               │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

## Scalability

### Horizontal Scaling

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Browser  │  │ Browser  │  │ Browser  │
│  User 1  │  │  User 2  │  │  User N  │
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │
     └─────────────┼─────────────┘
                   │
            ┌──────▼──────┐
            │  Vapi Cloud │
            │  (Auto-scale)│
            └──────┬──────┘
                   │
     ┌─────────────┼─────────────┐
     │             │             │
┌────▼─────┐  ┌───▼──────┐  ┌───▼──────┐
│ Backend  │  │ Backend  │  │ Backend  │
│ Server 1 │  │ Server 2 │  │ Server N │
└──────────┘  └──────────┘  └──────────┘
```

### Load Balancing

```
Multiple users → Vapi handles distribution
No backend bottleneck
WebSocket connections managed by Vapi
```

## Monitoring & Analytics

```
┌─────────────────────────────────────────┐
│         Vapi Dashboard                  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Call Logs                        │  │
│  │  Usage Metrics                    │  │
│  │  Cost Tracking                    │  │
│  │  Performance Stats                │  │
│  │  Error Rates                      │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
           │
           │ API / Webhooks
           │
┌──────────▼──────────────────────────────┐
│      Your Analytics System              │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Custom Metrics                   │  │
│  │  Business Intelligence            │  │
│  │  User Behavior                    │  │
│  │  A/B Testing                      │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

## Summary

This architecture provides:
- ✅ Real-time voice communication
- ✅ Low latency (500ms-1s)
- ✅ Scalable infrastructure
- ✅ Easy integration
- ✅ Production-ready
- ✅ Secure by default

**Next:** Follow `ACTION_REQUIRED.md` to complete setup!
