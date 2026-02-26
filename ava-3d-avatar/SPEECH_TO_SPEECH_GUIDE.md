# Speech-to-Speech (STS) Implementation Guide

## Overview
The AVA 3D Avatar system implements a complete speech-to-speech pipeline that converts user voice input to text, processes it through AI, and generates speech output with synchronized lip movements.

## Architecture Flow

```
User Voice Input (WebM)
    ↓
Frontend: MediaRecorder captures audio
    ↓
Frontend: Convert to Base64
    ↓
Backend: /sts endpoint receives audio
    ↓
Backend: Convert WebM → MP3 (FFmpeg)
    ↓
Backend: Speech-to-Text (OpenAI Whisper)
    ↓
Backend: AI Processing (Groq LLaMA 3.3 70B)
    ↓
Backend: Text-to-Speech (ElevenLabs)
    ↓
Backend: Lip Sync Generation (Rhubarb)
    ↓
Frontend: Play audio + animate avatar
```

## Components

### Frontend Components

#### 1. useSpeech Hook (`src/hooks/useSpeech.jsx`)
- Manages MediaRecorder for voice capture
- Handles recording state
- Sends audio to backend `/sts` endpoint
- Manages message queue and playback

**Key Functions:**
- `startRecording()` - Starts voice capture
- `stopRecording()` - Stops capture and sends to backend
- `tts(message)` - Text-to-speech for typed messages
- `onMessagePlayed()` - Advances to next message

#### 2. CommandConsole (`src/components/console/CommandConsole.jsx`)
- Voice button with recording indicator
- Text input for manual messages
- Visual feedback for recording/processing states

#### 3. Avatar Component (`src/components/Avatar.jsx`)
- Plays audio messages
- Synchronizes lip movements with phonemes
- Handles facial expressions and animations
- Auto-advances on audio completion or error

### Backend Components

#### 1. Server Endpoints (`apps/backend/server.js`)

**POST /sts** - Speech-to-Speech
```javascript
Input: { audio: "base64_encoded_webm" }
Output: { messages: [{ text, audio, lipsync, animation, facialExpression }] }
```

**POST /tts** - Text-to-Speech
```javascript
Input: { message: "text string" }
Output: { messages: [{ text, audio, lipsync, animation, facialExpression }] }
```

#### 2. Whisper Module (`modules/whisper.mjs`)
- Converts audio to text using OpenAI Whisper
- Handles WebM → MP3 conversion
- Returns transcribed text

#### 3. OpenAI/Groq Module (`modules/openAI.mjs`)
- Processes text through Groq LLaMA 3.3 70B
- Generates structured responses with:
  - Text content
  - Facial expression
  - Animation type
- Returns up to 3 messages per response

#### 4. ElevenLabs Module (`modules/elevenLabs.mjs`)
- Converts text to speech
- Uses voice ID: `pNInz6obpgDQGcFmaJgB` (Adam voice)
- Handles rate limiting and quota errors gracefully
- Saves audio as MP3 files

#### 5. Lip Sync Module (`modules/lip-sync.mjs`)
- Generates phoneme timing using Rhubarb
- Creates mouth cue data for lip synchronization
- Converts audio to base64 for frontend
- Handles errors gracefully (continues without audio)

## Configuration

### Required Environment Variables

```env
# OpenAI (for Whisper STT)
OPENAI_API_KEY=sk-proj-...

# Groq (for AI responses - FREE!)
GROQ_API_KEY=gsk_...

# ElevenLabs (for TTS)
ELEVEN_LABS_API_KEY=sk_...
ELEVEN_LABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
ELEVEN_LABS_MODEL_ID=eleven_multilingual_v2
```

### Required Dependencies

**Backend:**
- FFmpeg (for audio conversion)
- Rhubarb (for lip sync generation)
- Node.js packages: express, cors, dotenv, axios, langchain

**Frontend:**
- React
- Three.js / React Three Fiber
- MediaRecorder API (browser)

## Testing the Speech-to-Speech Flow

### 1. Start Backend Server
```bash
cd ava-3d-avatar/apps/backend
node server.js
```

Expected output:
```
🚀 AVA Backend Server Started!
📡 Server running on: http://localhost:3000
✅ Groq AI (LLaMA 3.3 70B) - Ready
🎤 Eleven Labs TTS - Ready
💬 Ready to assist customers!
```

### 2. Start Frontend
```bash
cd ava-3d-avatar/apps/frontend
npm run dev
```

### 3. Test Voice Input
1. Click the microphone button in the command console
2. Speak a message (e.g., "Hello, who are you?")
3. Click the microphone button again to stop recording
4. Watch the console for processing steps:
   - "📩 Received audio data"
   - "🎤 Converting speech to text..."
   - "🤖 Calling OpenAI API..."
   - "✅ OpenAI response received"
   - "✅ Message converted to speech"

### 4. Verify Output
- Avatar should speak the response
- Lips should move in sync with audio
- Facial expressions should match emotion
- Animation should match the response type

## Error Handling

### Frontend
- **No audio data**: Auto-advances after 2 seconds
- **Audio playback failed**: Logs warning and continues
- **Microphone access denied**: Logs error in console

### Backend
- **Whisper API failure**: Returns default response
- **Groq API failure**: Returns default response
- **ElevenLabs quota exceeded**: Continues without audio
- **Rate limiting**: Retries with exponential backoff
- **Lip sync failure**: Continues with empty mouth cues

## Performance Optimizations

1. **Parallel Processing**: Audio generation and lip sync run in parallel
2. **Base64 Encoding**: Audio sent as base64 to avoid file serving
3. **Message Queue**: Frontend queues multiple messages for smooth playback
4. **Graceful Degradation**: System continues working even if TTS fails

## Troubleshooting

### Issue: No audio output
**Solution**: Check ElevenLabs API quota and key validity

### Issue: Lip sync not working
**Solution**: Verify Rhubarb executable is present and has execute permissions

### Issue: Voice recording not starting
**Solution**: Check browser microphone permissions

### Issue: Slow response time
**Solution**: 
- Check network connection
- Verify API keys are valid
- Consider using faster TTS model

## API Rate Limits

- **OpenAI Whisper**: Depends on your plan
- **Groq**: Very generous free tier
- **ElevenLabs**: 
  - Free tier: 10,000 characters/month
  - Paid tiers: Higher limits

## Future Enhancements

1. **Real-time Streaming**: Stream audio as it's generated
2. **Voice Cloning**: Use custom voice models
3. **Multi-language Support**: Detect and respond in user's language
4. **Emotion Detection**: Analyze voice tone for better responses
5. **Interrupt Handling**: Allow users to interrupt avatar mid-speech
6. **Local TTS**: Add offline TTS option for privacy
