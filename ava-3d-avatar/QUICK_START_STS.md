# Quick Start: Speech-to-Speech Testing

## Prerequisites

1. **API Keys** - Make sure you have valid API keys in `apps/backend/.env`:
   - `OPENAI_API_KEY` - For Whisper speech-to-text
   - `GROQ_API_KEY` - For AI responses (free!)
   - `ELEVEN_LABS_API_KEY` - For text-to-speech

2. **Dependencies Installed**:
   ```bash
   cd apps/backend
   npm install
   
   cd ../frontend
   npm install
   ```

## Step 1: Test Backend Configuration

Run the test script to verify everything is configured correctly:

```bash
cd apps/backend
node test-speech-to-speech.js
```

Expected output:
```
🧪 Starting Speech-to-Speech Test Suite

Test 1: Checking Environment Variables...
  ✅ OPENAI_API_KEY: Set
  ✅ GROQ_API_KEY: Set
  ✅ ELEVEN_LABS_API_KEY: Set
  ...

Test 7: Testing Complete STS Pipeline...
  ✅ Pipeline completed successfully!
```

## Step 2: Start Backend Server

```bash
cd apps/backend
node server.js
```

You should see:
```
🚀 AVA Backend Server Started!
📡 Server running on: http://localhost:3000
✅ Groq AI (LLaMA 3.3 70B) - Ready
🎤 Eleven Labs TTS - Ready
💬 Ready to assist customers!
```

## Step 3: Start Frontend

In a new terminal:

```bash
cd apps/frontend
npm run dev
```

Open your browser to the URL shown (usually `http://localhost:5173`)

## Step 4: Test Speech-to-Speech

### Method 1: Voice Input (Full STS)

1. **Allow microphone access** when prompted by the browser
2. **Click the microphone button** (🎤) in the command console at the bottom
3. **Speak your message** clearly (e.g., "Hello, who are you?")
4. **Click the microphone button again** to stop recording
5. **Watch the magic happen**:
   - Your speech is converted to text
   - AI processes your message
   - Response is converted to speech
   - Avatar speaks with lip sync!

### Method 2: Text Input (TTS only)

1. **Type a message** in the command console
2. **Click SEND** or press Enter
3. **Watch the avatar respond** with speech

## Monitoring the Process

### Backend Console Output

When you speak, you'll see:
```
============================================================
🎤 SPEECH-TO-SPEECH REQUEST RECEIVED
============================================================
📊 Audio data size: 45678 characters (base64)
📊 Audio buffer size: 34258 bytes
🎯 Step 1: Converting speech to text (Whisper)...
✅ Transcription: "Hello, who are you?"
🎯 Step 2: Processing with AI (Groq)...
✅ AI generated 1 message(s)
🎯 Step 3: Generating speech and lip sync...
✅ Message 0 converted to speech
✅ Speech-to-speech pipeline completed!
============================================================
```

### Frontend Console Output

Open browser DevTools (F12) to see:
```
🎙️ Starting voice recording...
⏹️ Stopping voice recording...
🎤 Sending audio to backend for speech-to-speech processing...
✅ Speech-to-speech completed in 3.45s
📨 Received 1 message(s) from AI
```

## Troubleshooting

### Issue: Microphone button doesn't work
**Solution**: 
- Check browser console for errors
- Ensure microphone permissions are granted
- Try refreshing the page

### Issue: No audio output from avatar
**Possible causes**:
1. **ElevenLabs quota exceeded** - Check your usage at elevenlabs.io
2. **Invalid API key** - Verify in `.env` file
3. **Network issues** - Check backend console for errors

**What happens**: Avatar will still respond with text and animations, just no audio

### Issue: Backend shows "Rate limited"
**Solution**: 
- Wait a few seconds and try again
- Consider upgrading your ElevenLabs plan
- The system will retry automatically

### Issue: "Backend returned 500"
**Check**:
1. Backend server is running
2. All API keys are valid
3. FFmpeg and Rhubarb executables are present
4. Check backend console for detailed error messages

## Testing Tips

### Good Test Phrases

1. **Simple greeting**: "Hello, how are you?"
2. **Identity question**: "Who are you?"
3. **Help request**: "Can you help me?"
4. **Emotional**: "I'm having a great day!"

### What to Watch For

✅ **Successful STS**:
- Microphone button turns red while recording
- Voice visualizer shows activity
- Backend processes in 2-5 seconds
- Avatar speaks with synchronized lip movements
- Facial expressions match the emotion
- Animations match the response type

❌ **Issues to Report**:
- Recording doesn't start
- Long processing times (>10 seconds)
- No audio output
- Lip sync not matching audio
- Avatar not animating

## Performance Expectations

- **Voice Recording**: Instant
- **Speech-to-Text**: 1-2 seconds
- **AI Processing**: 1-2 seconds
- **Text-to-Speech**: 1-3 seconds
- **Total Pipeline**: 3-7 seconds

## Next Steps

Once speech-to-speech is working:

1. **Customize the voice** - Change `ELEVEN_LABS_VOICE_ID` in `.env`
2. **Adjust AI personality** - Edit the prompt in `modules/openAI.mjs`
3. **Add more animations** - Extend the animation mappings
4. **Improve error handling** - Add retry logic and fallbacks

## API Usage Monitoring

### Free Tier Limits

- **Groq**: Very generous, unlikely to hit limits
- **OpenAI Whisper**: Depends on your plan
- **ElevenLabs**: 10,000 characters/month free

### Checking Usage

- **ElevenLabs**: https://elevenlabs.io/app/usage
- **OpenAI**: https://platform.openai.com/usage
- **Groq**: https://console.groq.com/usage

## Support

If you encounter issues:

1. Check the `SPEECH_TO_SPEECH_GUIDE.md` for detailed architecture
2. Run `test-speech-to-speech.js` to diagnose problems
3. Check backend and frontend console logs
4. Verify all API keys are valid and have sufficient quota

Happy testing! 🎉
