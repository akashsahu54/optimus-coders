# System Verification Checklist

## ✅ Code Verification Results

### Frontend Components
- ✅ `useSpeech.jsx` - No errors
- ✅ `useVoiceActivityDetection.jsx` - No errors
- ✅ `App.jsx` - No errors
- ✅ `Avatar.jsx` - No errors
- ✅ `CommandConsole.jsx` - No errors
- ✅ `STSStatusIndicator.jsx` - Created

### Backend Components
- ✅ `server.js` - No syntax errors
- ✅ `/sts` endpoint - Implemented
- ✅ `/tts` endpoint - Implemented
- ✅ `whisper.mjs` - Exists
- ✅ `openAI.mjs` - Exists
- ✅ `elevenLabs.mjs` - Exists
- ✅ `lip-sync.mjs` - Exists

## 🔍 Feature Verification

### 1. Speech-to-Speech (Basic)
- ✅ Voice recording (MediaRecorder)
- ✅ Audio conversion (WebM → MP3)
- ✅ Speech-to-Text (Whisper)
- ✅ AI processing (Groq)
- ✅ Text-to-Speech (ElevenLabs)
- ✅ Lip sync generation (Rhubarb)
- ✅ Avatar playback

### 2. Conversation Mode (Advanced)
- ✅ Voice Activity Detection (VAD)
- ✅ Auto-start recording
- ✅ Auto-stop recording
- ✅ Interrupt handling
- ✅ Continuous conversation
- ✅ Toggle button

### 3. User Interface
- ✅ Command console
- ✅ Conversation mode toggle
- ✅ Status indicators
- ✅ Voice visualizer
- ✅ HUD panels
- ✅ Loading states

## 🧪 Testing Checklist

### Pre-Testing Setup

#### 1. Check API Keys
```bash
cd ava-3d-avatar/apps/backend
cat .env
```

Verify you have:
- [ ] `OPENAI_API_KEY=sk-proj-...`
- [ ] `GROQ_API_KEY=gsk_...`
- [ ] `ELEVEN_LABS_API_KEY=sk_...`
- [ ] `ELEVEN_LABS_VOICE_ID=...`
- [ ] `ELEVEN_LABS_MODEL_ID=...`

#### 2. Check Dependencies
```bash
# Backend
cd ava-3d-avatar/apps/backend
npm list

# Frontend
cd ava-3d-avatar/apps/frontend
npm list
```

#### 3. Check Executables
```bash
cd ava-3d-avatar/apps/backend
ls ffmpeg.exe
ls rhubarb.exe
```

Both should exist.

### Test 1: Backend Server Starts

```bash
cd ava-3d-avatar/apps/backend
node server.js
```

**Expected Output:**
```
🚀 AVA Backend Server Started!
📡 Server running on: http://localhost:3000
✅ Groq AI (LLaMA 3.3 70B) - Ready
🎤 Eleven Labs TTS - Ready
💬 Ready to assist customers!
```

**Status:** [ ] Pass / [ ] Fail

---

### Test 2: Frontend Starts

```bash
cd ava-3d-avatar/apps/frontend
npm run dev
```

**Expected Output:**
```
VITE v... ready in ... ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Status:** [ ] Pass / [ ] Fail

---

### Test 3: Text Input (TTS Only)

1. Open browser to frontend URL
2. Type "Hello" in command console
3. Press Enter or click SEND

**Expected:**
- Backend logs show "TEXT-TO-SPEECH REQUEST"
- Avatar speaks "Hello" response
- Mouth moves with audio
- No errors in console

**Status:** [ ] Pass / [ ] Fail

---

### Test 4: Voice Input (Manual Mode)

1. Click microphone button (should turn red)
2. Speak: "Who are you?"
3. Click microphone button again

**Expected:**
- Button turns red while recording
- Backend logs show "SPEECH-TO-SPEECH REQUEST"
- Shows transcription in backend
- Avatar speaks response
- Mouth moves with audio

**Status:** [ ] Pass / [ ] Fail

---

### Test 5: Conversation Mode (Auto)

1. Click conversation mode button (should turn green)
2. Just start talking: "Hello"
3. Stop talking (wait 1.5 seconds)

**Expected:**
- System auto-detects voice
- Auto-starts recording
- Auto-stops after silence
- Processes and responds
- No button click needed

**Status:** [ ] Pass / [ ] Fail

---

### Test 6: Interrupt Avatar

1. Enable conversation mode
2. Say: "Tell me a long story"
3. While avatar is speaking, start talking again

**Expected:**
- Avatar stops speaking immediately
- System starts recording new message
- Processes new message
- Avatar responds to new message

**Status:** [ ] Pass / [ ] Fail

---

### Test 7: Continuous Conversation

1. Enable conversation mode
2. Have a 3-turn conversation without clicking

**Expected:**
- Turn 1: You speak → Avatar responds
- Turn 2: You speak → Avatar responds
- Turn 3: You speak → Avatar responds
- No button clicks between turns

**Status:** [ ] Pass / [ ] Fail

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend won't start

**Symptoms:**
- Error messages on startup
- Port already in use

**Solutions:**
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process if needed
taskkill /PID <PID> /F

# Or use different port in server.js
```

---

### Issue 2: Frontend won't start

**Symptoms:**
- Vite errors
- Module not found

**Solutions:**
```bash
# Reinstall dependencies
cd ava-3d-avatar/apps/frontend
rm -rf node_modules
npm install
```

---

### Issue 3: No audio output

**Symptoms:**
- Avatar animates but no sound
- Backend logs show "Audio file created"

**Check:**
1. Browser volume not muted
2. System volume up
3. ElevenLabs quota not exceeded
4. Check browser console for audio errors

**Solutions:**
```bash
# Check ElevenLabs usage
# Visit: https://elevenlabs.io/app/usage

# Test audio file manually
cd ava-3d-avatar/apps/backend/audios
# Play message_0.mp3
```

---

### Issue 4: Microphone not working

**Symptoms:**
- Button doesn't turn red
- No recording starts

**Solutions:**
1. Check browser permissions (Settings → Privacy → Microphone)
2. Refresh page and allow permissions
3. Try different browser (Chrome/Edge recommended)
4. Check if microphone is connected

---

### Issue 5: VAD not detecting voice

**Symptoms:**
- Conversation mode enabled but not recording
- No auto-detection

**Solutions:**
1. Speak louder
2. Check microphone sensitivity
3. Reduce background noise
4. Lower threshold in `useVoiceActivityDetection.jsx`:
```javascript
volumeThreshold: -60  // More sensitive
```

---

### Issue 6: API errors

**Symptoms:**
- "Invalid API Key"
- "Quota Exceeded"
- "Rate Limited"

**Solutions:**
```bash
# Verify API keys
cd ava-3d-avatar/apps/backend
cat .env

# Check usage dashboards:
# OpenAI: https://platform.openai.com/usage
# Groq: https://console.groq.com/usage
# ElevenLabs: https://elevenlabs.io/app/usage
```

---

## 📊 Performance Benchmarks

### Expected Response Times

| Operation | Expected Time | Acceptable Range |
|-----------|---------------|------------------|
| Voice detection | Instant | <100ms |
| Recording start | Instant | <100ms |
| Silence detection | 1.5s | 1-2s |
| Speech-to-Text | 1-2s | 1-3s |
| AI processing | 1-2s | 1-3s |
| Text-to-Speech | 1-3s | 1-5s |
| Lip sync | <1s | <2s |
| **Total pipeline** | **3-7s** | **3-10s** |

### Performance Test

1. Enable conversation mode
2. Say: "Hello"
3. Measure time from when you stop talking to when avatar starts speaking

**Your Result:** _____ seconds

**Status:** 
- [ ] Excellent (<5s)
- [ ] Good (5-7s)
- [ ] Acceptable (7-10s)
- [ ] Slow (>10s) - Check network/API issues

---

## 🎯 Final Verification

### All Systems Check

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Text input works (TTS)
- [ ] Voice input works (manual mode)
- [ ] Conversation mode works (auto)
- [ ] Interrupt handling works
- [ ] Continuous conversation works
- [ ] Audio plays correctly
- [ ] Lip sync works
- [ ] Animations work
- [ ] No console errors

### API Verification

- [ ] OpenAI API key is valid
- [ ] Groq API key is valid
- [ ] ElevenLabs API key is valid
- [ ] All APIs have sufficient quota
- [ ] No rate limiting issues

### Feature Completeness

- [ ] Speech-to-Speech working
- [ ] Text-to-Speech working
- [ ] Voice Activity Detection working
- [ ] Auto-recording working
- [ ] Interrupt handling working
- [ ] Conversation mode toggle working

---

## 📝 Test Results Summary

**Date:** _______________

**Tester:** _______________

**Overall Status:** 
- [ ] All tests passed ✅
- [ ] Some tests failed ⚠️
- [ ] Major issues ❌

**Notes:**
```
[Write any observations, issues, or comments here]
```

---

## 🚀 Next Steps

### If All Tests Pass:
1. ✅ System is ready to use!
2. Read `CONVERSATION_MODE_GUIDE.md` for usage tips
3. Check `API_SETUP_GUIDE.md` for optimization
4. Monitor API usage regularly

### If Tests Fail:
1. Review error messages in console
2. Check troubleshooting section above
3. Verify API keys and quotas
4. Run `test-speech-to-speech.js` for diagnostics
5. Check documentation for specific issues

---

## 📚 Documentation Index

- `API_SETUP_GUIDE.md` - API configuration
- `CONVERSATION_MODE_GUIDE.md` - How to use conversation mode
- `SPEECH_TO_SPEECH_GUIDE.md` - Technical architecture
- `QUICK_START_STS.md` - Quick start guide
- `TEST_TTS.md` - Testing text-to-speech
- `VERIFY_SPEECH_TO_SPEECH.md` - Verification guide
- `API_ARCHITECTURE.md` - API architecture diagram

---

**System Status:** Ready for testing! 🎉

Run through this checklist to verify everything works correctly.
