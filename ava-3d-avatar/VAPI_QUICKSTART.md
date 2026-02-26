# 🚀 Vapi Quick Start Guide

Get your AVA avatar talking with Vapi in 5 minutes!

## Step 1: Get Vapi API Key (2 minutes)

1. Go to [vapi.ai](https://vapi.ai) and sign up
2. Navigate to Dashboard → API Keys
3. Copy your API key

## Step 2: Install Dependencies (1 minute)

```bash
# Frontend
cd apps/frontend
npm install @vapi-ai/web

# Backend (optional, for server-side features)
cd ../backend
npm install @vapi-ai/server-sdk
```

## Step 3: Configure Environment (1 minute)

Add to `apps/frontend/.env`:
```env
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key_here
VITE_ELEVEN_LABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

Add to `apps/backend/.env`:
```env
VAPI_API_KEY=your_vapi_api_key_here
```

## Step 4: Update Your App (1 minute)

### Option A: Simple Integration (Recommended for Testing)

Update `apps/frontend/src/App.jsx`:

```jsx
import { VapiProvider } from "./hooks/useVapi";
import { VapiControls } from "./components/VapiControls";

function App() {
  return (
    <VapiProvider>
      <div className="app">
        {/* Your existing components */}
        <Avatar />
        <ChatInterface />
        
        {/* Add Vapi controls */}
        <VapiControls />
      </div>
    </VapiProvider>
  );
}
```

### Option B: Replace Existing Speech System

Update `apps/frontend/src/App.jsx`:

```jsx
// Replace SpeechProvider with VapiProvider
import { VapiProvider } from "./hooks/useVapi";

function App() {
  return (
    <VapiProvider>
      {/* Your app content */}
    </VapiProvider>
  );
}
```

Update `apps/frontend/src/components/Avatar.jsx`:

```jsx
// Replace useSpeech with useVapi
import { useVapi } from "../hooks/useVapi";

export function Avatar() {
  const { currentMessage, onMessagePlayed } = useVapi();
  
  // Rest of your Avatar component
}
```

## Step 5: Test It! (30 seconds)

```bash
# Start backend (if using server-side features)
cd apps/backend
npm run dev

# Start frontend
cd apps/frontend
npm run dev
```

Open `http://localhost:5173` and click "Start Call"!

## What You Get

✅ Real-time voice conversations
✅ Automatic speech-to-text
✅ AI responses via Groq (or your chosen LLM)
✅ Natural text-to-speech via Eleven Labs
✅ Voice activity detection
✅ Interruption handling

## Next Steps

### Customize Your Assistant

Edit `apps/frontend/src/hooks/useVapi.jsx` to customize:

```javascript
await vapi.start({
  model: {
    provider: "groq",
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are AVA, a [YOUR CUSTOM PERSONALITY HERE]"
      }
    ]
  },
  voice: {
    provider: "11labs",
    voiceId: "YOUR_VOICE_ID"
  }
});
```

### Add Custom Functions

```javascript
functions: [
  {
    name: "check_order_status",
    description: "Check the status of a customer order",
    parameters: {
      type: "object",
      properties: {
        orderId: { type: "string" }
      }
    }
  }
]
```

### Enable Server-Side Features

Update `apps/backend/server.js`:

```javascript
import vapiRoutes from "./routes/vapi.mjs";

app.use("/api/vapi", vapiRoutes);
```

## Troubleshooting

### "Vapi not initialized"
- Check that your API key is in `.env`
- Restart your dev server after adding env variables

### "Call failed to start"
- Verify your API key is correct
- Check browser console for detailed errors
- Ensure microphone permissions are granted

### No audio output
- Check browser audio permissions
- Verify Eleven Labs voice ID is valid
- Test with a different voice ID

## Cost Estimate

Vapi pricing (as of 2024):
- ~$0.05-0.10 per minute of conversation
- Includes STT, LLM, and TTS
- First $10 free credit

Much simpler than managing multiple API keys and services!

## Support

- [Vapi Documentation](https://docs.vapi.ai)
- [Vapi Discord](https://discord.gg/vapi)
- [GitHub Issues](https://github.com/VapiAI/web/issues)
