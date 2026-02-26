# ⚡ Quick Start - Fast Voice-to-Voice

## 🎯 Goal
Aapke voice-to-voice agent ko **5-7 seconds se 1-2 seconds** mein response dena!

## 🚀 3-Step Setup (5 minutes)

### Step 1: Backend (2 min)
```bash
cd ava-3d-avatar/apps/backend
npm install fluent-ffmpeg
node server.js
```

### Step 2: Test (1 min)
```bash
# New terminal
cd ava-3d-avatar/apps/backend
node test-fast-voice.js
```

Expected output:
```
✅ Fast endpoint: ~1500ms
✅ Cache working: ~10ms
```

### Step 3: Frontend (2 min)

Choose easiest option:

#### Option A: Demo Component (Copy-Paste)
```jsx
// In App.jsx
import { FastVoiceDemo } from "./components/FastVoiceDemo";

function App() {
  return <FastVoiceDemo />;
}
```

#### Option B: One-Line Change
```jsx
// In useSpeech.jsx, find this line:
const response = await fetch(`${BACKEND_URL}/sts`, ...);

// Replace with:
const response = await fetch(`${BACKEND_URL}/fast-v2v`, ...);
```

## ✅ Done!

Your voice agent is now **3-4x faster**! 🎉

## 📊 What You Get

- ⚡ **1-2 second responses** (vs 5-7 seconds)
- 💾 **Instant cached responses** (~10ms)
- 📈 **Real-time performance metrics**
- 🎯 **Better user experience**

## 🎮 How to Use

1. Click "Start Recording" button
2. Speak your message
3. Click "Stop Recording"
4. Get response in 1-2 seconds!

OR

1. Enable "Conversation Mode"
2. Just speak (auto-detects voice)
3. Get instant responses!

## 🐛 Issues?

### Backend not starting?
```bash
# Check .env file has:
ELEVEN_LABS_API_KEY=your_key
GROQ_API_KEY=your_key
OPENAI_API_KEY=your_key
```

### Module errors?
```bash
cd ava-3d-avatar/apps/backend
npm install
```

### Still slow?
- Check internet connection
- Verify API keys are valid
- Check API quotas

## 📚 More Info

- **Full Guide:** `FAST_VOICE_README.md`
- **Setup Details:** `FAST_VOICE_SETUP.md`
- **Checklist:** `IMPLEMENTATION_CHECKLIST.md`

## 🎉 That's It!

Enjoy your lightning-fast voice agent! ⚡

Questions? Check the documentation files above.

---

**Time to implement: 5 minutes**  
**Performance gain: 3-4x faster**  
**User happiness: 📈📈📈**
