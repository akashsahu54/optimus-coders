
# AVA - AI Virtual Assistant Architecture

## 🏗 High-Level Flow

```
User Input (Text/Voice) → Backend API → Groq AI (LLaMA 3.3 70B) → Eleven Labs TTS → 
Rhubarb Lip-Sync → Frontend 3D Avatar → Animated Response
```

## 📦 Components

### 1. Frontend (3D Avatar Interface)
**Location:** `ava-3d-avatar/apps/frontend/`
**Tech:** React + Vite + Three.js + React Three Fiber
**Port:** 5173
**Responsibilities:**
- 3D avatar rendering and animation
- Real-time lip-sync visualization
- Chat interface (text input)
- Voice input capture (optional)
- Audio playback
- Facial expression control

**Key Files:**
- `src/App.jsx` - Main application component
- `src/components/Avatar.jsx` - 3D avatar with animations
- `src/components/ChatInterface.jsx` - User input interface
- `src/components/Scenario.jsx` - Scene setup
- `src/hooks/useSpeech.jsx` - Speech synthesis and API calls
- `src/constants/facialExpressions.js` - Emotion mappings
- `src/constants/visemesMapping.js` - Phoneme to viseme mapping
- `public/models/avatar.glb` - 3D avatar model
- `public/animations/*.fbx` - Animation files

**Dependencies:**
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers for R3F
- `three` - 3D graphics library

### 2. Backend (AI & TTS Processing)
**Location:** `ava-3d-avatar/apps/backend/`
**Tech:** Node.js + Express + LangChain
**Port:** 3000
**Responsibilities:**
- AI conversation handling (Groq)
- Text-to-speech generation (Eleven Labs)
- Lip-sync data generation (Rhubarb)
- Audio processing (FFmpeg)
- Response formatting with emotions

**Key Endpoints:**
- `POST /tts` - Text message → AI response + audio + lip-sync
- `POST /sts` - Speech-to-text → AI response (optional)
- `GET /voices` - List available Eleven Labs voices

**Key Files:**
- `server.js` - Express server setup
- `modules/openAI.mjs` - Groq AI integration (LangChain)
- `modules/elevenLabs.mjs` - Text-to-speech API
- `modules/lip-sync.mjs` - Audio processing orchestration
- `modules/rhubarbLipSync.mjs` - Phoneme generation
- `modules/whisper.mjs` - Speech-to-text (optional)
- `modules/defaultMessages.mjs` - Fallback responses
- `utils/audios.mjs` - Audio file management
- `utils/files.mjs` - File system utilities
- `ffmpeg.exe` - Audio conversion tool
- `rhubarb.exe` - Lip-sync analysis tool

**Dependencies:**
- `@langchain/groq` - Groq AI integration
- `elevenlabs-node` - Eleven Labs TTS
- `express` - Web server
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

### 3. Dashboard (Admin Panel)
**Location:** `dashboard/`
**Tech:** HTML/CSS/JS (Vanilla)
**Responsibilities:**
- Display conversation statistics
- Monitor system health
- View conversation history
- Analytics dashboard

## 🔄 Data Flow

### User Interaction Flow:
1. **User Input**: User types message in chat interface
2. **API Request**: Frontend sends POST to `/tts` endpoint
3. **AI Processing**: 
   - Backend receives message
   - Groq AI (LLaMA 3.3 70B) generates intelligent response
   - Response includes text, facial expression, and animation type
4. **TTS Generation**:
   - Eleven Labs converts text to natural speech (MP3)
   - FFmpeg converts MP3 to WAV format
5. **Lip-Sync Generation**:
   - Rhubarb analyzes WAV file
   - Generates phoneme timestamps (mouth shapes)
   - Creates viseme data for lip-sync
6. **Response Delivery**:
   - Backend sends JSON with:
     - Text response
     - Base64 encoded audio
     - Lip-sync data (mouth cues)
     - Facial expression
     - Animation name
7. **Frontend Rendering**:
   - Audio plays through speakers
   - 3D avatar animates (idle → talking)
   - Mouth syncs with speech (visemes)
   - Facial expression changes (smile, sad, etc.)
   - Returns to idle state when done

### Voice Input Flow (Optional):
1. User clicks microphone button
2. Browser captures audio (Web Speech API)
3. Audio sent to backend `/sts` endpoint
4. Whisper converts speech to text
5. Follows same flow as text input above

## 🎯 AI & Animation Logic

### Groq AI Configuration:
```javascript
Model: llama-3.3-70b-versatile
Temperature: 0.2 (more focused responses)
Context: Customer support agent personality
Output: Structured JSON with text, emotion, animation
```

### Facial Expressions:
- `smile` - Happy, positive responses
- `sad` - Empathetic, apologetic responses
- `angry` - Frustrated scenarios (rare)
- `surprised` - Unexpected information
- `funnyFace` - Playful responses
- `default` - Neutral state

### Animations:
- `Idle` - Default standing pose
- `TalkingOne` - Primary talking animation
- `TalkingThree` - Alternative talking animation
- `SadIdle` - Sad standing pose
- `Defeated` - Disappointed gesture
- `Angry` - Frustrated gesture
- `Surprised` - Surprised reaction
- `DismissingGesture` - Dismissive hand wave
- `ThoughtfulHeadShake` - Thinking gesture

### Lip-Sync Phonemes (Rhubarb):
```
A, B, C, D, E, F, G, H, X (silence)
Mapped to 3D morph targets for realistic mouth movement
```

## 🚀 Deployment Strategy

### Development:
```bash
# Backend (Terminal 1)
cd ava-3d-avatar/apps/backend
npm start
# Runs on http://localhost:3000

# Frontend (Terminal 2)
cd ava-3d-avatar/apps/frontend
npm run dev
# Runs on http://localhost:5173
```

### Environment Variables (.env):
```bash
# Groq AI (Free Tier)
GROQ_API_KEY=gsk_xxx...

# Eleven Labs TTS
ELEVEN_LABS_API_KEY=sk_xxx...
ELEVEN_LABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
ELEVEN_LABS_MODEL_ID=eleven_multilingual_v2
```

### Production Considerations:
- **Frontend**: Vercel / Netlify / GitHub Pages
- **Backend**: Railway / Render / Heroku
- **API Keys**: Use paid tiers for higher rate limits
- **CDN**: Serve 3D models and animations from CDN
- **Caching**: Cache audio responses for common queries
- **Load Balancing**: Multiple backend instances
- **Database**: Store conversation history (optional)

## 🎨 3D Avatar Technology

### Current Implementation:
- **Format**: GLB (GL Transmission Format)
- **Renderer**: Three.js via React Three Fiber
- **Animations**: FBX format (11 animations)
- **Morph Targets**: Facial expressions and visemes
- **Lighting**: Three-point lighting setup
- **Camera**: Orbital controls for viewing

### Avatar Features:
- **Realistic 3D Model**: Human-like appearance
- **Smooth Animations**: Blended transitions
- **Lip-Sync**: Real-time phoneme-based mouth movement
- **Facial Expressions**: Dynamic emotion display
- **Idle Animations**: Natural breathing and movement
- **Responsive**: Adapts to different screen sizes

## 📊 Tech Stack Summary

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **AI Model** | Groq LLaMA 3.3 70B | Intelligent conversation |
| **TTS** | Eleven Labs | Natural voice synthesis |
| **Lip-Sync** | Rhubarb | Phoneme generation |
| **Audio Processing** | FFmpeg | Format conversion |
| **Frontend Framework** | React + Vite | Fast development |
| **3D Rendering** | Three.js + R3F | Avatar visualization |
| **Backend** | Node.js + Express | API server |
| **AI Framework** | LangChain | Structured AI outputs |
| **Styling** | Tailwind CSS | UI design |
| **Voice Input** | Web Speech API | Optional voice capture |

### API Services:ier, fast inference, 70B parameter model
- **Eleven Labs**: High-quality TTS, multilingual support
- **Rate Limits**: ~30 req/min (Groq free tier)
- **Groq**: Free t

## 🏆 Demo Script

**For Judges:**

1. **Show User Interface**
   - "This is AVA, our AI Voice Avatar"
   - Click speak button
   - Say: "Main 3 din se call kar raha hoon!"

2. **Show Emotion Detection**
   - Avatar expression changes to concerned
   - Emotion badge shows "ANGRY"
   - Bot responds empathetically

3. **Show Dashboard**
   - Switch to dashboard tab
   - Show real-time alert appeared
   - Highlight statistics update

4. **Explain Impact**
   - "Traditional IVR can't do this"
   - "This reduces customer frustration"
   - "Business gets actionable insights"

## 🎯 Winning Points

✅ **Visual Impact** - Animated avatar catches attention
✅ **Real Problem** - IVR frustration is relatable
✅ **Business Value** - Dashboard shows ROI
✅ **Technical Depth** - Emotion AI + Voice processing
✅ **Scalability** - Clear architecture for growth

## 📝 TODO for Hackathon

**High Priority:**
- [ ] Integrate Web Speech API
- [ ] Add avatar animation
- [ ] Connect frontend to backend
- [ ] Test emotion detection
- [ ] Polish UI/UX

**Medium Priority:**
- [ ] Add Hindi language support
- [ ] Improve emotion keywords
- [ ] Add more conversation examples
- [ ] Dashboard real-time updates

**Low Priority:**
- [ ] Database integration
- [ ] User authentication
- [ ] Advanced ML model
- [ ] Mobile responsive design
