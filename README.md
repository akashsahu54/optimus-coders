# 🤖 AVA - AI Virtual Assistant

An intelligent 3D AI avatar chatbot with real-time conversation, emotion detection, and lip-sync capabilities built for customer support automation.

## 🎯 Project Overview

AVA (AI Virtual Assistant) is a next-generation customer support solution that combines:
- **3D Animated Avatar** with realistic facial expressions and lip-sync
- **AI-Powered Conversations** using Groq's LLaMA 3.3 (70B) model
- **Natural Voice Synthesis** via Eleven Labs TTS
- **Real-time Emotion Detection** for better customer understanding
- **Admin Dashboard** for monitoring conversations and analytics

## ✨ Key Features

### 🎭 Intelligent Avatar
- Realistic 3D character with multiple animations
- Synchronized lip movements using Rhubarb Lip-Sync
- Dynamic facial expressions (smile, sad, angry, surprised, etc.)
- Smooth transitions between animations

### 🧠 AI Brain
- Powered by **Groq AI** (LLaMA 3.3 70B) for fast, intelligent responses
- Context-aware conversations with memory
- Structured responses with emotion and animation metadata
- Free and unlimited API usage

### 🎤 Voice & Audio
- High-quality voice synthesis using **Eleven Labs**
- Multiple voice options available
- Real-time audio generation
- Automatic lip-sync generation

### 📊 Analytics Dashboard
- Real-time conversation monitoring
- Emotion tracking and analytics
- Urgency detection for escalation
- Customer satisfaction metrics

## 🏗️ Architecture

```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│     Frontend (React + Three.js) │
│  - 3D Avatar Rendering          │
│  - Chat Interface               │
│  - Audio Playback               │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Backend (Node.js/Express)   │
│  - API Routes                   │
│  - Request Processing           │
└──────────┬──────────────────────┘
           │
           ├──────────────┬──────────────┬──────────────┐
           ▼              ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
    │  Groq AI │   │  Eleven  │   │ Rhubarb  │   │  FFmpeg  │
    │  (LLM)   │   │   Labs   │   │ Lip-Sync │   │  (Audio) │
    └──────────┘   └──────────┘   └──────────┘   └──────────┘
```

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18 or higher)
2. **Groq API Key** (Free) - [Get it here](https://console.groq.com/)
3. **Eleven Labs API Key** - [Sign up here](https://elevenlabs.io/)
4. **FFmpeg** - [Download here](https://ffmpeg.org/download.html)

### Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd ava-ai-assistant
```

2. **Install backend dependencies:**
```bash
cd talking-avatar-reference/apps/backend
npm install
```

3. **Install frontend dependencies:**
```bash
cd ../frontend
npm install
```

4. **Setup environment variables:**

Create `.env` file in `apps/backend/`:
```env
# Groq AI Configuration (FREE!)
GROQ_API_KEY=your_groq_api_key_here

# Eleven Labs Configuration
ELEVEN_LABS_API_KEY=your_elevenlabs_api_key_here
ELEVEN_LABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
ELEVEN_LABS_MODEL_ID=eleven_multilingual_v2
```

5. **Setup FFmpeg and Rhubarb:**
- Place `ffmpeg.exe` in `apps/backend/` folder
- Place `rhubarb.exe` in `apps/backend/` folder
- Copy `res/` folder from Rhubarb to `apps/backend/res/`

### Running the Application

**Start Backend:**
```bash
cd apps/backend
npm run dev
```
Backend will run on `http://localhost:3000`

**Start Frontend:**
```bash
cd apps/frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## 🎮 Usage

1. Open `http://localhost:5173` in your browser
2. Type your message in the chat box
3. Press Enter or click Send
4. Watch AVA respond with voice and animations!

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Three.js** - 3D rendering
- **React Three Fiber** - React renderer for Three.js
- **Vite** - Build tool
- **Tailwind CSS** - Styling

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **LangChain** - AI orchestration
- **Axios** - HTTP client
- **FFmpeg** - Audio processing
- **Rhubarb Lip-Sync** - Lip sync generation

### AI Services
- **Groq** - LLM inference (LLaMA 3.3 70B)
- **Eleven Labs** - Text-to-Speech
- **Rhubarb** - Lip-sync generation

## 📁 Project Structure

```
talking-avatar-reference/
├── apps/
│   ├── backend/
│   │   ├── modules/
│   │   │   ├── openAI.mjs (now using Groq)
│   │   │   ├── elevenLabs.mjs
│   │   │   ├── lip-sync.mjs
│   │   │   └── rhubarbLipSync.mjs
│   │   ├── utils/
│   │   ├── audios/
│   │   ├── res/ (Rhubarb resources)
│   │   ├── server.js
│   │   ├── package.json
│   │   └── .env
│   │
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Avatar.jsx
│       │   │   ├── ChatInterface.jsx
│       │   │   └── Scenario.jsx
│       │   ├── hooks/
│       │   │   └── useSpeech.jsx
│       │   ├── constants/
│       │   └── main.jsx
│       ├── public/
│       │   ├── models/
│       │   └── animations/
│       └── package.json
```

## 🎨 Customization

### Change Avatar Personality

Edit `apps/backend/modules/openAI.mjs`:
```javascript
const template = `
  You are AVA, a helpful customer support assistant.
  You are friendly, professional, and empathetic.
  // Customize personality here
`;
```

### Add New Animations

1. Add animation file to `apps/frontend/public/animations/`
2. Update animation list in Avatar component
3. Reference in AI prompt template

### Change Voice

Update `ELEVEN_LABS_VOICE_ID` in `.env` with your preferred voice ID from Eleven Labs.

## 🐛 Troubleshooting

### Backend crashes with "quota_exceeded"
- **Solution:** Your Eleven Labs free tier quota is exhausted. Create a new account or upgrade.

### "Invalid API Key" error
- **Solution:** Verify your Groq API key is correct in `.env` file.

### FFmpeg not found
- **Solution:** Ensure `ffmpeg.exe` is in the `apps/backend/` directory.

### Lip sync not working
- **Solution:** Check that `rhubarb.exe` and `res/` folder are properly placed in `apps/backend/`.

## 📝 License

This project is built for educational and hackathon purposes.

## 🙏 Acknowledgments

- Groq for providing fast, free LLM inference
- Eleven Labs for high-quality TTS
- Rhubarb Lip-Sync for phoneme generation
- Ready Player Me for 3D avatar models

## 👥 Team

Built with ❤️ by Optimus Coders for Sitnovate 2.0


