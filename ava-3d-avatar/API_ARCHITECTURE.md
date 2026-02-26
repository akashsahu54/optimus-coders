# API Architecture

## 🏗️ System Architecture with APIs

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER                                     │
│                    (Speaks into mic)                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Audio (WebM)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                              │
│                                                                  │
│  • Captures audio with MediaRecorder                            │
│  • Converts to base64                                           │
│  • Sends to backend                                             │
│  • Plays response audio                                         │
│  • Animates avatar                                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ POST /sts
                         │ { audio: "base64..." }
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js)                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Step 1: Convert Audio Format                             │  │
│  │ • WebM → MP3 (using FFmpeg)                              │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                          │
│                       │ MP3 file                                 │
│                       ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Step 2: Speech-to-Text                                   │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐    │  │
│  │  │         🔑 OPENAI WHISPER API                   │    │  │
│  │  │  https://api.openai.com/v1/audio/transcriptions│    │  │
│  │  │                                                  │    │  │
│  │  │  Input:  MP3 audio file                         │    │  │
│  │  │  Output: "Hello, who are you?"                  │    │  │
│  │  │  Cost:   $0.006 per minute                      │    │  │
│  │  └─────────────────────────────────────────────────┘    │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                          │
│                       │ Transcribed text                         │
│                       ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Step 3: AI Processing                                    │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐    │  │
│  │  │         🔑 GROQ API (FREE!)                     │    │  │
│  │  │  https://api.groq.com/openai/v1/chat/completions│   │  │
│  │  │                                                  │    │  │
│  │  │  Model:  LLaMA 3.3 70B Versatile               │    │  │
│  │  │  Input:  "Hello, who are you?"                  │    │  │
│  │  │  Output: {                                      │    │  │
│  │  │    text: "Hi! I'm AVA...",                      │    │  │
│  │  │    facialExpression: "smile",                   │    │  │
│  │  │    animation: "TalkingOne"                      │    │  │
│  │  │  }                                              │    │  │
│  │  │  Cost:   FREE! 🎉                               │    │  │
│  │  └─────────────────────────────────────────────────┘    │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                          │
│                       │ AI response                              │
│                       ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Step 4: Text-to-Speech                                   │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────┐    │  │
│  │  │         🔑 ELEVENLABS API                       │    │  │
│  │  │  https://api.elevenlabs.io/v1/text-to-speech   │    │  │
│  │  │                                                  │    │  │
│  │  │  Voice:  Adam (pNInz6obpgDQGcFmaJgB)           │    │  │
│  │  │  Input:  "Hi! I'm AVA..."                       │    │  │
│  │  │  Output: MP3 audio file                         │    │  │
│  │  │  Cost:   FREE tier (10k chars/month)           │    │  │
│  │  └─────────────────────────────────────────────────┘    │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                          │
│                       │ MP3 audio                                │
│                       ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Step 5: Lip Sync Generation                              │  │
│  │ • Rhubarb analyzes audio                                 │  │
│  │ • Generates phoneme timing                               │  │
│  │ • Creates mouth cue data                                 │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                          │
│                       │ Response package                         │
│                       │ { text, audio, lipsync, animation }      │
└───────────────────────┼──────────────────────────────────────────┘
                        │
                        │ JSON response
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                              │
│                                                                  │
│  • Receives response                                            │
│  • Plays audio                                                  │
│  • Syncs lip movements                                          │
│  • Shows facial expressions                                     │
│  • Plays body animations                                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
                    ┌─────────┐
                    │  USER   │
                    │ (Hears  │
                    │ Avatar) │
                    └─────────┘
```

## 🔑 API Details

### 1. OpenAI Whisper API

**Endpoint:**
```
POST https://api.openai.com/v1/audio/transcriptions
```

**Request:**
```javascript
{
  file: audio.mp3,
  model: "whisper-1"
}
```

**Response:**
```javascript
{
  text: "Hello, who are you?"
}
```

**Used in:** `modules/whisper.mjs`

---

### 2. Groq API

**Endpoint:**
```
POST https://api.groq.com/openai/v1/chat/completions
```

**Request:**
```javascript
{
  model: "llama-3.3-70b-versatile",
  messages: [
    { role: "system", content: "You are AVA..." },
    { role: "user", content: "Hello, who are you?" }
  ],
  temperature: 0.2
}
```

**Response:**
```javascript
{
  messages: [
    {
      text: "Hi! I'm AVA, your AI assistant...",
      facialExpression: "smile",
      animation: "TalkingOne"
    }
  ]
}
```

**Used in:** `modules/openAI.mjs`

---

### 3. ElevenLabs API

**Endpoint:**
```
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
```

**Request:**
```javascript
{
  text: "Hi! I'm AVA, your AI assistant...",
  model_id: "eleven_multilingual_v2",
  voice_settings: {
    stability: 0.5,
    similarity_boost: 0.5,
    style: 1,
    use_speaker_boost: true
  }
}
```

**Response:**
```
Binary MP3 audio data
```

**Used in:** `modules/elevenLabs.mjs`

---

## 📊 Data Flow

### Input: User Speech
```
Audio Recording (WebM)
  ↓
Base64 Encoding
  ↓
HTTP POST to Backend
```

### Processing Pipeline
```
1. Audio Conversion (FFmpeg)
   WebM → MP3

2. Speech-to-Text (OpenAI Whisper)
   MP3 → Text

3. AI Processing (Groq)
   Text → Structured Response

4. Text-to-Speech (ElevenLabs)
   Text → MP3 Audio

5. Lip Sync (Rhubarb)
   MP3 → Phoneme Data
```

### Output: Avatar Response
```
JSON Package:
{
  text: "...",
  audio: "base64...",
  lipsync: { mouthCues: [...] },
  animation: "...",
  facialExpression: "..."
}
  ↓
Frontend Playback
  ↓
Avatar Speaks
```

---

## 💰 Cost Breakdown per Conversation Turn

### Example: 10-second user message, 15-second avatar response

**OpenAI Whisper:**
```
10 seconds = 0.167 minutes
Cost: 0.167 × $0.006 = $0.001
```

**Groq:**
```
Cost: $0.00 (FREE!)
```

**ElevenLabs:**
```
~100 characters in response
Free tier: 10,000 chars/month
Cost: $0.00 (within free tier)
```

**Total per turn: ~$0.001** (less than a penny!)

---

## 🔒 API Security

### Authentication Methods

**OpenAI:**
```javascript
headers: {
  'Authorization': 'Bearer sk-proj-...'
}
```

**Groq:**
```javascript
headers: {
  'Authorization': 'Bearer gsk_...'
}
```

**ElevenLabs:**
```javascript
headers: {
  'xi-api-key': 'sk_...'
}
```

### Best Practices

1. ✅ Store keys in `.env` file
2. ✅ Never commit `.env` to git
3. ✅ Use different keys for dev/prod
4. ✅ Rotate keys regularly
5. ✅ Monitor usage dashboards

---

## 🚀 Performance

### Typical Response Times

| Step | Time | API |
|------|------|-----|
| Audio conversion | <1s | Local (FFmpeg) |
| Speech-to-Text | 1-2s | OpenAI |
| AI processing | 1-2s | Groq |
| Text-to-Speech | 1-3s | ElevenLabs |
| Lip sync | <1s | Local (Rhubarb) |
| **Total** | **3-7s** | - |

### Optimization Tips

1. Use faster TTS models
2. Reduce audio quality if needed
3. Cache common responses
4. Parallel processing where possible
5. Use CDN for static assets

---

## 📈 Scaling Considerations

### For Production

**Rate Limits:**
- OpenAI: 3,000 requests/min (paid tier)
- Groq: Very generous (check docs)
- ElevenLabs: Depends on plan

**Caching:**
- Cache common AI responses
- Cache TTS audio for repeated phrases
- Use Redis for session management

**Load Balancing:**
- Multiple backend instances
- Queue system for requests
- Fallback APIs for redundancy

---

## 🎯 Summary

**3 APIs Power the System:**

1. 🎤 **OpenAI Whisper** - Your voice → Text
2. 🤖 **Groq** - Text → AI response (FREE!)
3. 🔊 **ElevenLabs** - Text → Avatar voice

**Total Cost:** As low as $0.001 per conversation turn!

**Setup Time:** 15 minutes to get all API keys

**Performance:** 3-7 seconds per response

---

**Ready to set up?** See `API_SETUP_GUIDE.md` for detailed instructions!
