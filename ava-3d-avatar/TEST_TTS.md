# Testing Text-to-Speech (TTS)

## ✅ TTS is Already Implemented!

The text-to-speech functionality is **fully working** in your system. Here's how to test it:

## Test Method 1: Type a Message (Text → Speech)

1. **Start the backend**:
   ```bash
   cd apps/backend
   node server.js
   ```

2. **Start the frontend**:
   ```bash
   cd apps/frontend
   npm run dev
   ```

3. **Type a message** in the command console at the bottom
4. **Click SEND** or press Enter
5. **Watch the avatar speak** with audio!

### What Happens:
```
Your Text Input
    ↓
Backend /tts endpoint
    ↓
AI generates response (Groq)
    ↓
Text → Speech (ElevenLabs) ✅
    ↓
Lip sync generated (Rhubarb)
    ↓
Avatar speaks with audio! 🔊
```

## Test Method 2: Voice Input (Speech → Speech)

1. **Click the microphone button** 🎤
2. **Speak**: "Hello, who are you?"
3. **Click microphone again** to stop
4. **Watch the avatar respond** with speech!

### What Happens:
```
Your Voice Input
    ↓
Backend /sts endpoint
    ↓
Speech → Text (Whisper)
    ↓
AI generates response (Groq)
    ↓
Text → Speech (ElevenLabs) ✅
    ↓
Lip sync generated (Rhubarb)
    ↓
Avatar speaks with audio! 🔊
```

## Verify TTS is Working

### Backend Console Output
When TTS is working, you'll see:
```
🎯 Step 2: Generating speech and lip sync...
🎤 Converting text to speech: "Hello! I'm AVA..."
✅ Audio file created: /path/to/audios/message_0.mp3
✅ Message 0 converted to speech
✅ Text-to-speech pipeline completed!
```

### Frontend Console Output
```
✅ Text-to-speech completed in 3.45s
📨 Received 1 message(s) from AI
```

### Browser
- Avatar's mouth moves in sync with audio
- You hear the voice speaking
- Facial expressions match the emotion

## If You Don't Hear Audio

### Check 1: Browser Volume
- Ensure browser volume is not muted
- Check system volume settings

### Check 2: ElevenLabs API Key
```bash
# In apps/backend/.env
ELEVEN_LABS_API_KEY=sk_...  # Must be valid
```

### Check 3: ElevenLabs Quota
- Free tier: 10,000 characters/month
- Check usage: https://elevenlabs.io/app/usage
- If exceeded, avatar will still animate but no audio

### Check 4: Backend Logs
Look for these errors:
- `❌ Eleven Labs API limit reached` - Quota exceeded
- `❌ Eleven Labs API Error: Authentication failed` - Invalid API key
- `⚠️ Rate limited` - Too many requests

## Test with Different Messages

Try these to test TTS:

1. **Short message**: "Hello"
2. **Long message**: "Tell me a story about a robot"
3. **Emotional**: "I'm so happy today!"
4. **Question**: "What can you help me with?"

## Advanced Testing

### Test TTS Directly
```bash
cd apps/backend
node test-speech-to-speech.js
```

This will test:
- ElevenLabs API connection
- Audio file generation
- Lip sync generation
- Complete pipeline

### Check Generated Audio Files
```bash
cd apps/backend/audios
ls -la
```

You should see:
- `message_0.mp3` - Audio file
- `message_0.json` - Lip sync data

### Play Audio File Manually
```bash
# Windows
start audios/message_0.mp3

# Mac
open audios/message_0.mp3

# Linux
xdg-open audios/message_0.mp3
```

## TTS Configuration

### Change Voice
Edit `apps/backend/.env`:
```env
# Current voice (Adam - Deep male)
ELEVEN_LABS_VOICE_ID=pNInz6obpgDQGcFmaJgB

# Try other voices:
# Rachel (Female, calm)
ELEVEN_LABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# Domi (Female, strong)
ELEVEN_LABS_VOICE_ID=AZnzlk1XvdvUeBnXmlld
```

See `VOICE_OPTIONS.md` for more voices.

### Adjust Voice Settings
Edit `apps/backend/modules/elevenLabs.mjs`:
```javascript
voice_settings: {
  stability: 0.5,        // 0-1 (higher = more stable)
  similarity_boost: 0.5, // 0-1 (higher = more similar to original)
  style: 1,              // 0-1 (higher = more expressive)
  use_speaker_boost: true
}
```

## Troubleshooting

### Problem: No audio but avatar animates
**Cause**: TTS failed but system continues
**Solution**: Check backend logs for errors

### Problem: Audio is choppy
**Cause**: Network issues or slow connection
**Solution**: Check internet speed, try shorter messages

### Problem: Wrong voice
**Cause**: Wrong voice ID in .env
**Solution**: Verify `ELEVEN_LABS_VOICE_ID` is correct

### Problem: "Audio playback failed"
**Cause**: Browser autoplay policy
**Solution**: User must interact with page first (click anywhere)

## Summary

✅ **Text-to-Speech is WORKING**
- Both text input and voice input generate speech
- Avatar speaks with synchronized lip movements
- Audio is generated using ElevenLabs
- System handles errors gracefully

🎯 **To Test**:
1. Start backend and frontend
2. Type a message or speak
3. Listen to the avatar respond!

📚 **More Info**:
- `SPEECH_TO_SPEECH_GUIDE.md` - Complete architecture
- `QUICK_START_STS.md` - Step-by-step guide
- `STS_README.md` - Feature documentation
