# How to Use Speech-to-Speech

## 🎯 What is Speech-to-Speech?

Speech-to-Speech means:
- **You SPEAK** into your microphone
- **Avatar SPEAKS** back to you

It's a voice conversation with the AI avatar!

## 🚀 Quick Start (3 Steps)

### Step 1: Start the System

**Terminal 1 - Backend:**
```bash
cd ava-3d-avatar/apps/backend
node server.js
```

Wait for:
```
🚀 AVA Backend Server Started!
📡 Server running on: http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd ava-3d-avatar/apps/frontend
npm run dev
```

Open browser to the URL shown.

### Step 2: Allow Microphone

When browser asks for microphone permission:
- Click **"Allow"** ✅

### Step 3: Have a Voice Conversation!

1. **Click** the microphone button 🎤 (bottom left)
2. **Speak**: "Hello, who are you?"
3. **Click** microphone button again
4. **Listen**: Avatar speaks back! 🔊

## 📱 User Interface Guide

### Command Console (Bottom of Screen)

```
┌─────────────────────────────────────────────────────┐
│  [🎤]  [> ENTER_COMMAND...          ]  [SEND]      │
└─────────────────────────────────────────────────────┘
   ↑
   This is the microphone button!
```

### Button States

**Idle (Blue/Cyan):**
```
[🎤] ← Click to start recording
```

**Recording (Red, Pulsing):**
```
[🎤] ← Click to stop recording
     (Button is RED and pulsing)
```

**Processing (Disabled):**
```
[🎤] ← Grayed out while processing
```

## 🎤 How to Record Your Voice

### Method 1: Click to Start, Click to Stop

1. **Click** 🎤 button once → Recording starts
2. **Speak** your message
3. **Click** 🎤 button again → Recording stops and sends

### Method 2: Hold and Release (Future Feature)

Not implemented yet, but you can add it!

## 🗣️ What to Say

### Good Examples

✅ **Short and clear:**
- "Hello"
- "Who are you?"
- "Help me"
- "What's your name?"

✅ **Questions:**
- "What can you do?"
- "How are you?"
- "Tell me about yourself"

✅ **Commands:**
- "Tell me a joke"
- "Give me advice"
- "Explain something"

### Tips for Best Results

1. **Speak clearly** - Don't mumble
2. **Not too fast** - Normal speaking pace
3. **Not too quiet** - Speak at normal volume
4. **Reduce background noise** - Find a quiet place
5. **Wait for response** - Don't interrupt the avatar

## 👀 Visual Feedback

### While Recording

**You'll see:**
- 🎤 Button turns RED
- Voice visualizer animates (bars moving)
- Status shows "VOICE INPUT ACTIVE"

### While Processing

**You'll see:**
- Status indicator shows "PROCESSING"
- Loading animation
- "NEURAL PROCESSING..." message

### While Avatar Speaks

**You'll see:**
- Avatar's mouth moves (lip sync)
- Facial expressions change
- Body animations
- Status shows "SPEAKING"

**You'll hear:**
- Avatar's voice speaking the response 🔊

## 🔊 Audio Output

### What You'll Hear

The avatar will speak with:
- **Clear voice** (ElevenLabs TTS)
- **Natural intonation**
- **Appropriate emotion**
- **Synchronized with lip movements**

### Volume Control

- Use your system volume
- Use browser volume
- Avatar speaks at normal volume

## ⏱️ Timing

### Expected Response Times

1. **Recording**: As long as you speak (typically 2-5 seconds)
2. **Processing**: 3-7 seconds
   - Speech-to-Text: 1-2s
   - AI thinking: 1-2s
   - Text-to-Speech: 1-3s
3. **Speaking**: As long as the response (typically 3-10 seconds)

### Total Time

From when you stop recording to when avatar starts speaking:
- **Typical**: 3-7 seconds
- **Fast**: 2-4 seconds
- **Slow**: 8-12 seconds (if network is slow)

## 🎬 Example Conversation

### Example 1: Simple Greeting

**You:** 🎤 "Hello"
**Wait:** 4 seconds
**Avatar:** 🔊 "Hi there! How can I help you today?"

### Example 2: Question

**You:** 🎤 "Who are you?"
**Wait:** 5 seconds
**Avatar:** 🔊 "I'm AVA, your AI virtual assistant. I'm here to help you with any questions you might have!"

### Example 3: Request

**You:** 🎤 "Tell me a joke"
**Wait:** 6 seconds
**Avatar:** 🔊 "Why did the robot go to therapy? Because it had too many bugs! *laughs*"

## 🐛 Common Issues

### Issue 1: Microphone Button Doesn't Work

**Symptoms:**
- Button doesn't turn red
- No recording starts

**Solutions:**
1. Check browser permissions (Settings → Privacy → Microphone)
2. Refresh the page
3. Try a different browser (Chrome/Edge recommended)
4. Check if microphone is connected

### Issue 2: No Response from Avatar

**Symptoms:**
- Recording works
- Processing happens
- But no speech output

**Solutions:**
1. Check backend console for errors
2. Verify ElevenLabs API key in `.env`
3. Check quota at https://elevenlabs.io/app/usage
4. Avatar will still animate without audio if TTS fails

### Issue 3: Poor Transcription

**Symptoms:**
- Avatar responds to wrong words
- Misunderstands what you said

**Solutions:**
1. Speak more clearly
2. Reduce background noise
3. Speak at normal pace
4. Check microphone quality
5. Move closer to microphone

### Issue 4: Slow Response

**Symptoms:**
- Takes >10 seconds to respond

**Solutions:**
1. Check internet connection
2. Verify backend is running
3. Check API quotas
4. Try shorter messages

## 📊 Monitoring Your Conversation

### Backend Console

Watch for these messages:
```
🎤 SPEECH-TO-SPEECH REQUEST RECEIVED
✅ Transcription: "Hello, who are you?"
✅ AI generated 1 message(s)
✅ Message 0 converted to speech
✅ Speech-to-speech pipeline completed!
```

### Frontend Console (F12)

Watch for these messages:
```
🎙️ Starting voice recording...
⏹️ Stopping voice recording...
🎤 Sending audio to backend...
✅ Speech-to-speech completed in 4.23s
```

## 🎯 Best Practices

### For Best Experience

1. **Test your microphone first** - Record something to verify it works
2. **Find a quiet place** - Reduce background noise
3. **Speak naturally** - Don't shout or whisper
4. **Wait for avatar to finish** - Don't interrupt
5. **Keep messages short** - Easier to process

### For Development/Testing

1. **Check backend logs** - See what's being transcribed
2. **Monitor API usage** - Don't exceed quotas
3. **Test with different phrases** - Verify accuracy
4. **Check audio files** - Look in `audios/` folder

## 🔧 Advanced Configuration

### Change Voice Speed

Edit `apps/backend/modules/elevenLabs.mjs`:
```javascript
voice_settings: {
  stability: 0.5,        // Higher = more stable
  similarity_boost: 0.5, // Higher = more similar
  style: 1,              // Higher = more expressive
}
```

### Change Voice

Edit `apps/backend/.env`:
```env
ELEVEN_LABS_VOICE_ID=pNInz6obpgDQGcFmaJgB  # Change this
```

### Adjust AI Personality

Edit `apps/backend/modules/openAI.mjs`:
```javascript
const template = `
  You are AVA, a helpful assistant...
  [Customize personality here]
`;
```

## 📚 Additional Resources

- `VERIFY_SPEECH_TO_SPEECH.md` - Verification guide
- `SPEECH_TO_SPEECH_GUIDE.md` - Technical details
- `QUICK_START_STS.md` - Quick start guide
- `test-speech-to-speech.js` - Test script

## 🎉 Summary

**Speech-to-Speech is ready to use!**

1. Start backend and frontend
2. Click microphone button 🎤
3. Speak your message
4. Click microphone again
5. Listen to avatar respond 🔊

**It's that simple!**

---

**Need Help?** Check the troubleshooting section or run `node test-speech-to-speech.js`
