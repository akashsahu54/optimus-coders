# 🎙️ Vapi Integration Guide for AVA

## Overview

Vapi is a voice AI platform that provides real-time conversational AI with built-in speech-to-text, LLM processing, and text-to-speech in a single WebSocket connection. This integration replaces the current multi-step pipeline with a streamlined real-time solution.

## Why Vapi?

### Current Architecture (Complex)
```
User Speech → Whisper STT → Groq LLM → Eleven Labs TTS → Rhubarb Lip-sync → Avatar
```

### With Vapi (Simplified)
```
User Speech ←→ Vapi (STT + LLM + TTS) → Avatar with Lip-sync
```

### Benefits
- **Real-time streaming** - Lower latency conversations
- **Built-in interruption handling** - Natural conversation flow
- **Unified API** - Single WebSocket connection
- **Voice activity detection** - Automatic turn-taking
- **Multiple provider support** - Use Groq, OpenAI, or other LLMs
- **Custom voices** - Eleven Labs integration included

## Setup Steps

### 1. Get Vapi API Key

1. Sign up at [vapi.ai](https://vapi.ai)
2. Get your API key from the dashboard
3. Create an assistant with your desired configuration

### 2. Install Dependencies

**Frontend:**
```bash
cd apps/frontend
npm install @vapi-ai/web
```

**Backend (Optional - for server-side control):**
```bash
cd apps/backend
npm install @vapi-ai/server-sdk
```

### 3. Configure Environment

Add to `apps/backend/.env`:
```env
# Vapi Configuration
VAPI_API_KEY=your_vapi_api_key_here
VAPI_ASSISTANT_ID=your_assistant_id_here
```

## Implementation Options

### Option 1: Client-Side Vapi (Recommended for Simplicity)

Use Vapi's Web SDK directly in the frontend. Best for:
- Quick integration
- Real-time voice conversations
- Minimal backend changes

### Option 2: Server-Side Vapi (Recommended for Control)

Use Vapi's Server SDK in the backend. Best for:
- Custom business logic
- Authentication/authorization
- Conversation logging
- Integration with existing systems

### Option 3: Hybrid Approach (Recommended for Production)

Combine both approaches:
- Frontend handles WebSocket connection
- Backend manages assistant configuration
- Backend processes conversation events

## Integration Architecture

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │
       │ WebSocket
       ▼
┌─────────────────┐
│   Vapi Cloud    │
│  - STT (Deepgram)
│  - LLM (Groq)   │
│  - TTS (11Labs) │
└──────┬──────────┘
       │
       │ Events/Webhooks
       ▼
┌─────────────────┐
│  Your Backend   │
│  - Lip-sync     │
│  - Analytics    │
│  - Custom Logic │
└─────────────────┘
```

## Quick Start Implementation

See the following files for implementation:
- `apps/frontend/src/hooks/useVapi.jsx` - Vapi hook
- `apps/backend/modules/vapi.mjs` - Backend integration
- `apps/backend/.env.example` - Configuration template

## Features to Implement

### Phase 1: Basic Integration
- [x] Vapi Web SDK setup
- [x] Real-time voice conversation
- [x] Basic lip-sync from Vapi transcripts
- [x] UI controls (start/stop call)

### Phase 2: Enhanced Features
- [ ] Custom function calling
- [ ] Emotion detection from transcripts
- [ ] Advanced lip-sync with phonemes
- [ ] Conversation history

### Phase 3: Production Ready
- [ ] Server-side assistant management
- [ ] Webhook integration
- [ ] Analytics dashboard
- [ ] Error handling & fallbacks

## Configuration Examples

### Vapi Assistant Configuration

```json
{
  "name": "AVA Customer Support",
  "model": {
    "provider": "groq",
    "model": "llama-3.3-70b-versatile",
    "messages": [
      {
        "role": "system",
        "content": "You are AVA, a helpful customer support assistant..."
      }
    ]
  },
  "voice": {
    "provider": "11labs",
    "voiceId": "21m00Tcm4TlvDq8ikWAM"
  },
  "transcriber": {
    "provider": "deepgram",
    "model": "nova-2"
  }
}
```

## Migration Path

### Step 1: Parallel Testing
- Keep existing TTS/STS endpoints
- Add new Vapi integration
- Test both side-by-side

### Step 2: Feature Parity
- Implement lip-sync with Vapi
- Add emotion detection
- Match current UX

### Step 3: Gradual Rollout
- Enable Vapi for new users
- Monitor performance
- Migrate existing users

### Step 4: Deprecation
- Remove old endpoints
- Clean up unused code
- Update documentation

## Cost Comparison

### Current Stack (Per 1000 requests)
- Groq: Free (for now)
- Eleven Labs: ~$0.30/1K chars
- Whisper: ~$0.006/minute
- **Total: ~$0.30 + compute costs**

### With Vapi
- Vapi: ~$0.05-0.10/minute (all-inclusive)
- **Total: ~$0.05-0.10/minute**

## Next Steps

1. Review the implementation files
2. Get your Vapi API key
3. Test the basic integration
4. Customize for your use case
5. Deploy and monitor

## Resources

- [Vapi Documentation](https://docs.vapi.ai)
- [Vapi Web SDK](https://github.com/VapiAI/web)
- [Vapi Server SDK](https://github.com/VapiAI/server-sdk-node)
- [Example Projects](https://github.com/VapiAI/examples)
