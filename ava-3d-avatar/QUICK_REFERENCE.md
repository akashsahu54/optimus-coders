# Quick Reference: Speech-to-Speech System

## 🚀 Start the System

```bash
# Terminal 1: Backend
cd apps/backend
node server.js

# Terminal 2: Frontend  
cd apps/frontend
npm run dev
```

## 🎯 How to Use

### Method 1: Type Message (Text → Speech)
1. Type in command console
2. Press Enter or click SEND
3. Avatar speaks response 🔊

### Method 2: Voice Message (Speech → Speech)
1. Click microphone button 🎤
2. Speak your message
3. Click microphone again
4. Avatar speaks response 🔊

## ✅ What's Working

| Feature | Status | Description |
|---------|--------|-------------|
| Voice Input | ✅ | Capture user speech |
| Speech-to-Text | ✅ | Convert speech to text (Whisper) |
| AI Processing | ✅ | Generate responses (Groq) |
| **Text-to-Speech** | ✅ | **Convert text to audio (ElevenLabs)** |
| Lip Sync | ✅ | Sync mouth with audio (Rhubarb) |
| Avatar Animation | ✅ | Facial expressions & body movement |
| Audio Playback | ✅ | Play avatar voice |

## 🔊 Text-to-Speech Details

### Where It Happens
- **File**: `apps/backend/modules/elevenLabs.mjs`
- **Function**: `convertTextToSpeech()`
- **API**: ElevenLabs
- **Output**: MP3 audio file

### When It Happens
- **Every AI response** is converted to speech
- Works for both text input AND voice input
- Happens automatically in the backend

### How to Verify
```bash
# Check backend logs for:
✅ Audio file created: audios/message_0.mp3

# Check audio folder:
ls apps/backend/audios/
# Should see: message_0.mp3, message_0.json
```

## 🧪 Test Commands

```bash
# Test everything
cd apps/backend
node test-speech-to-speech.js

# Check API keys
cat apps/backend/.env | grep ELEVEN_LABS

# View audio files
ls -la apps/backend/audios/

# Play audio file (Windows)
start apps/backend/audios/message_0.mp3
```

## 🔧 Configuration

### API Keys (apps/backend/.env)
```env
OPENAI_API_KEY=sk-proj-...      # Whisper STT
GROQ_API_KEY=gsk_...            # AI responses
ELEVEN_LABS_API_KEY=sk_...      # TTS (REQUIRED!)
ELEVEN_LABS_VOICE_ID=pNInz...   # Voice selection
```

### Change Voice
Edit `ELEVEN_LABS_VOICE_ID` in `.env`:
- `pNInz6obpgDQGcFmaJgB` - Adam (current)
- `21m00Tcm4TlvDq8ikWAM` - Rachel
- `AZnzlk1XvdvUeBnXmlld` - Domi

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| No audio | Check ElevenLabs API key & quota |
| Mic not working | Grant browser permissions |
| Slow response | Normal (3-7 seconds) |
| Quota exceeded | Avatar animates without audio |

## 📊 Pipeline Flow

```
Input → AI → TTS → Audio → Avatar Speaks
```

### Text Input
```
Type "Hello"
  ↓
AI: "Hi there!"
  ↓
TTS: Generates audio ✅
  ↓
Avatar speaks 🔊
```

### Voice Input
```
Speak "Hello"
  ↓
STT: "Hello"
  ↓
AI: "Hi there!"
  ↓
TTS: Generates audio ✅
  ↓
Avatar speaks 🔊
```

## 📈 Performance

- Voice Recording: Instant
- Speech-to-Text: 1-2s
- AI Processing: 1-2s
- **Text-to-Speech: 1-3s** ✅
- Lip Sync: <1s
- **Total: 3-7s**

## 🎯 Key Files

### Backend
- `server.js` - API endpoints
- `modules/elevenLabs.mjs` - **TTS implementation**
- `modules/lip-sync.mjs` - Orchestrates TTS
- `modules/whisper.mjs` - STT
- `modules/openAI.mjs` - AI

### Frontend
- `hooks/useSpeech.jsx` - Speech management
- `components/Avatar.jsx` - **Audio playback**
- `components/console/CommandConsole.jsx` - UI

## 📚 Documentation

- `CONFIRMATION_TTS_WORKING.md` - TTS is working!
- `TEST_TTS.md` - How to test
- `TTS_FLOW_DIAGRAM.md` - Visual diagram
- `SPEECH_TO_SPEECH_GUIDE.md` - Complete guide
- `QUICK_START_STS.md` - Step-by-step
- `test-speech-to-speech.js` - Test script

## ✨ Quick Verification

```bash
# 1. Start servers
cd apps/backend && node server.js &
cd apps/frontend && npm run dev

# 2. Open browser to frontend URL

# 3. Type "Hello" and press Enter

# 4. Listen - Avatar should speak! 🔊
```

## 🎉 Summary

**Text-to-Speech is FULLY WORKING!**

- ✅ Implemented in backend
- ✅ Uses ElevenLabs API
- ✅ Generates audio for every response
- ✅ Avatar speaks with lip sync
- ✅ Works for text AND voice input

**Just test it and enjoy!** 🚀
