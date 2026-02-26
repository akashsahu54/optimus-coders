# Speech-to-Speech (STS) Feature - Complete Implementation

## 🎯 Overview

The AVA 3D Avatar now has a fully functional Speech-to-Speech system that allows users to have natural voice conversations with the AI avatar. The system converts your speech to text, processes it through AI, generates a spoken response, and animates the avatar with synchronized lip movements.

## ✨ What's Been Implemented

### 1. Complete STS Pipeline
- ✅ Voice recording with MediaRecorder API
- ✅ Audio conversion (WebM → MP3)
- ✅ Speech-to-Text using OpenAI Whisper
- ✅ AI response generation using Groq LLaMA 3.3 70B
- ✅ Text-to-Speech using ElevenLabs
- ✅ Lip sync generation using Rhubarb
- ✅ Avatar animation with synchronized mouth movements

### 2. Enhanced User Interface
- ✅ Microphone button in command console
- ✅ Real-time recording indicator
- ✅ Voice visualizer during recording
- ✅ STS status indicator showing pipeline stages
- ✅ Loading states and error handling
- ✅ Responsive design for mobile and desktop

### 3. Improved Error Handling
- ✅ Graceful degradation when TTS quota is exceeded
- ✅ Automatic retry logic for rate limiting
- ✅ User-friendly error messages
- ✅ Fallback to text-only mode if audio fails
- ✅ Comprehensive logging for debugging

### 4. Developer Tools
- ✅ Test script for verifying configuration
- ✅ Detailed console logging
- ✅ Documentation and guides
- ✅ Quick start instructions

## 🚀 How to Use

### For Users

1. **Start the Application**
   - Backend: `cd apps/backend && node server.js`
   - Frontend: `cd apps/frontend && npm run dev`

2. **Grant Microphone Permission**
   - Browser will ask for microphone access
   - Click "Allow" to enable voice input

3. **Have a Conversation**
   - Click the 🎤 microphone button
   - Speak your message clearly
   - Click 🎤 again to stop recording
   - Watch the avatar respond!

### For Developers

1. **Test Configuration**
   ```bash
   cd apps/backend
   node test-speech-to-speech.js
   ```

2. **Monitor Pipeline**
   - Backend console shows detailed processing steps
   - Frontend console shows timing and status
   - Browser DevTools for debugging

3. **Customize Behavior**
   - Edit `modules/openAI.mjs` for AI personality
   - Change voice in `.env` file
   - Adjust animations in Avatar component

## 📊 Pipeline Stages

### Stage 1: Voice Recording (Frontend)
```
User clicks mic → MediaRecorder starts → Audio captured → User stops → WebM blob created
```

### Stage 2: Audio Processing (Backend)
```
Receive base64 audio → Convert to Buffer → Save as WebM → Convert to MP3 (FFmpeg)
```

### Stage 3: Speech Recognition (Backend)
```
MP3 file → OpenAI Whisper API → Transcribed text
```

### Stage 4: AI Processing (Backend)
```
User text → Groq LLaMA 3.3 70B → Structured response (text + emotion + animation)
```

### Stage 5: Speech Generation (Backend)
```
Response text → ElevenLabs TTS → MP3 audio file
```

### Stage 6: Lip Sync (Backend)
```
MP3 audio → Rhubarb → Phoneme timing data (JSON)
```

### Stage 7: Playback (Frontend)
```
Receive audio + lipsync → Play audio → Animate avatar mouth → Show expressions
```

## 🔧 Configuration

### Required API Keys

```env
# Speech-to-Text
OPENAI_API_KEY=sk-proj-...

# AI Processing (FREE!)
GROQ_API_KEY=gsk_...

# Text-to-Speech
ELEVEN_LABS_API_KEY=sk_...
ELEVEN_LABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
ELEVEN_LABS_MODEL_ID=eleven_multilingual_v2
```

### Voice Options

Change the voice by updating `ELEVEN_LABS_VOICE_ID`:

- `pNInz6obpgDQGcFmaJgB` - Adam (Deep, confident male)
- `VR6AewLTigWG4xSOukaG` - Arnold (Strong, authoritative)
- `ErXwobaYiN019PkySvjV` - Antoni (Well-rounded, pleasant)
- `yoZ06aMxZJJ28mfd3POQ` - Sam (Dynamic, raspy)
- `TxGEqnHWrfWFTfGW9XjX` - Josh (Young, energetic)

See `VOICE_OPTIONS.md` for more voices.

## 📈 Performance Metrics

### Typical Response Times
- Voice Recording: Instant (user-controlled)
- Speech-to-Text: 1-2 seconds
- AI Processing: 1-2 seconds
- Text-to-Speech: 1-3 seconds
- Lip Sync Generation: <1 second
- **Total Pipeline: 3-7 seconds**

### Optimization Tips
1. Use shorter messages for faster responses
2. Ensure stable internet connection
3. Consider caching common responses
4. Use faster TTS models for real-time feel

## 🐛 Troubleshooting

### Common Issues

#### 1. Microphone Not Working
**Symptoms**: Button doesn't respond, no recording starts
**Solutions**:
- Check browser permissions (Settings → Privacy → Microphone)
- Ensure HTTPS or localhost (MediaRecorder requires secure context)
- Try different browser (Chrome/Edge recommended)
- Check browser console for errors

#### 2. No Audio Output
**Symptoms**: Avatar responds but doesn't speak
**Causes**:
- ElevenLabs quota exceeded (10k chars/month free)
- Invalid API key
- Network issues
**Solutions**:
- Check ElevenLabs usage at https://elevenlabs.io/app/usage
- Verify API key in `.env`
- Check backend console for errors
- System continues working without audio (text + animations only)

#### 3. Slow Response Time
**Symptoms**: Takes >10 seconds to respond
**Causes**:
- Slow internet connection
- API rate limiting
- Large audio files
**Solutions**:
- Speak shorter messages
- Check network speed
- Verify API quotas
- Check backend console for bottlenecks

#### 4. Lip Sync Not Working
**Symptoms**: Avatar speaks but mouth doesn't move
**Causes**:
- Rhubarb executable missing
- Phoneme generation failed
**Solutions**:
- Verify `rhubarb.exe` exists in backend folder
- Check file permissions
- Review backend console logs
- Test with `test-speech-to-speech.js`

## 📝 Code Structure

### Frontend Components
```
src/
├── hooks/
│   └── useSpeech.jsx              # Main STS logic
├── components/
│   ├── Avatar.jsx                 # 3D avatar with lip sync
│   ├── console/
│   │   └── CommandConsole.jsx     # Voice input UI
│   ├── hud/
│   │   └── STSStatusIndicator.jsx # Pipeline status
│   └── effects/
│       └── VoiceVisualizer.jsx    # Recording animation
└── App.jsx                        # Main app integration
```

### Backend Modules
```
apps/backend/
├── server.js                      # Express server with /sts endpoint
├── modules/
│   ├── whisper.mjs               # Speech-to-Text
│   ├── openAI.mjs                # AI processing
│   ├── elevenLabs.mjs            # Text-to-Speech
│   ├── lip-sync.mjs              # Orchestrates TTS + lip sync
│   └── rhubarbLipSync.mjs        # Phoneme generation
└── utils/
    ├── audios.mjs                # Audio conversion
    └── files.mjs                 # File operations
```

## 🎨 UI Components

### Status Indicator
Shows current pipeline stage:
- 🎤 **RECORDING** - Red - Capturing voice
- ⚙️ **PROCESSING** - Yellow - Converting and generating
- 🗣️ **SPEAKING** - Green - Avatar responding

### Voice Visualizer
Animated bars that pulse during recording to provide visual feedback.

### Command Console
- Microphone button with recording state
- Text input for manual messages
- Send button
- Status display

## 🔐 Security Considerations

1. **API Keys**: Never commit `.env` file to version control
2. **HTTPS**: Use HTTPS in production for MediaRecorder
3. **Rate Limiting**: Implement backend rate limiting for production
4. **Input Validation**: Sanitize user input before processing
5. **Error Messages**: Don't expose sensitive info in error messages

## 📚 Additional Resources

- `SPEECH_TO_SPEECH_GUIDE.md` - Detailed architecture documentation
- `QUICK_START_STS.md` - Step-by-step testing guide
- `test-speech-to-speech.js` - Automated testing script
- `VOICE_OPTIONS.md` - Available voice configurations

## 🎯 Next Steps

### Immediate Improvements
1. Add conversation history/context
2. Implement interrupt handling
3. Add voice activity detection (VAD)
4. Support multiple languages

### Advanced Features
1. Real-time streaming audio
2. Voice cloning for personalization
3. Emotion detection from voice tone
4. Background noise cancellation
5. Multi-turn conversation memory

### Production Readiness
1. Add authentication
2. Implement rate limiting
3. Set up monitoring and analytics
4. Add error tracking (Sentry)
5. Optimize for mobile devices
6. Add offline mode with local TTS

## 🤝 Contributing

When working on STS features:
1. Test with `test-speech-to-speech.js` first
2. Check both frontend and backend console logs
3. Verify error handling for all failure modes
4. Update documentation for any changes
5. Test on multiple browsers and devices

## 📞 Support

If you encounter issues:
1. Run the test script to diagnose
2. Check console logs (frontend + backend)
3. Verify API keys and quotas
4. Review the troubleshooting section
5. Check the detailed guides

---

**Status**: ✅ Fully Implemented and Tested
**Last Updated**: 2024
**Version**: 1.0.0
