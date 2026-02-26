# Text-to-Speech Flow Diagram

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                             │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
              ┌─────▼─────┐           ┌──────▼──────┐
              │   TYPE     │           │    SPEAK    │
              │  MESSAGE   │           │   MESSAGE   │
              └─────┬─────┘           └──────┬──────┘
                    │                         │
                    │                         │
┌───────────────────▼─────────────────────────▼───────────────────────┐
│                        FRONTEND (React)                              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐                    ┌──────────────────┐      │
│  │ CommandConsole   │                    │  useSpeech Hook  │      │
│  │  - Text Input    │                    │  - MediaRecorder │      │
│  │  - Mic Button    │◄───────────────────┤  - Audio Capture │      │
│  └────────┬─────────┘                    └────────┬─────────┘      │
│           │                                        │                │
│           │ Text Message                           │ Audio Blob     │
│           │                                        │ (WebM)         │
│           └────────────────┬───────────────────────┘                │
│                            │                                        │
│                            │ POST Request                           │
│                            │                                        │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐              ┌──────────────────┐            │
│  │  POST /tts       │              │  POST /sts       │            │
│  │  (Text Input)    │              │  (Voice Input)   │            │
│  └────────┬─────────┘              └────────┬─────────┘            │
│           │                                  │                      │
│           │                                  │                      │
│           │                         ┌────────▼─────────┐           │
│           │                         │  Whisper Module  │           │
│           │                         │  (Speech-to-Text)│           │
│           │                         └────────┬─────────┘           │
│           │                                  │                      │
│           │                                  │ Transcribed Text     │
│           └──────────────┬───────────────────┘                      │
│                          │                                          │
│                          │ User Text                                │
│                          │                                          │
│                 ┌────────▼─────────┐                                │
│                 │   OpenAI/Groq    │                                │
│                 │   AI Processing  │                                │
│                 │  (LLaMA 3.3 70B) │                                │
│                 └────────┬─────────┘                                │
│                          │                                          │
│                          │ AI Response                              │
│                          │ { text, emotion, animation }             │
│                          │                                          │
│                 ┌────────▼─────────┐                                │
│                 │  Lip Sync Module │                                │
│                 │                  │                                │
│                 │  ┌────────────┐  │                                │
│                 │  │ ElevenLabs │  │  ◄── TEXT-TO-SPEECH HERE!     │
│                 │  │    TTS     │  │                                │
│                 │  └─────┬──────┘  │                                │
│                 │        │         │                                │
│                 │        │ MP3     │                                │
│                 │        │         │                                │
│                 │  ┌─────▼──────┐  │                                │
│                 │  │  Rhubarb   │  │                                │
│                 │  │  Lip Sync  │  │                                │
│                 │  └─────┬──────┘  │                                │
│                 │        │         │                                │
│                 │        │ Phonemes│                                │
│                 │        │         │                                │
│                 │  ┌─────▼──────┐  │                                │
│                 │  │  Base64    │  │                                │
│                 │  │  Encoding  │  │                                │
│                 │  └─────┬──────┘  │                                │
│                 └────────┼─────────┘                                │
│                          │                                          │
│                          │ Response Package                         │
│                          │ { text, audio, lipsync, animation }      │
│                          │                                          │
└──────────────────────────┼──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Avatar Component                           │  │
│  │                                                               │  │
│  │  ┌─────────────┐                                             │  │
│  │  │ Receive Msg │                                             │  │
│  │  └──────┬──────┘                                             │  │
│  │         │                                                     │  │
│  │         │                                                     │  │
│  │  ┌──────▼──────────┐                                         │  │
│  │  │ Create Audio    │  ◄── AUDIO PLAYBACK HERE!              │  │
│  │  │ new Audio(base64)│                                        │  │
│  │  └──────┬──────────┘                                         │  │
│  │         │                                                     │  │
│  │         │ audio.play()                                       │  │
│  │         │                                                     │  │
│  │  ┌──────▼──────────┐      ┌──────────────┐                  │  │
│  │  │  Audio Playing  │──────►│  Lip Sync    │                 │  │
│  │  │  🔊 Speaking    │      │  Animation   │                  │  │
│  │  └─────────────────┘      └──────┬───────┘                  │  │
│  │                                   │                          │  │
│  │                            ┌──────▼───────┐                  │  │
│  │                            │  Facial      │                  │  │
│  │                            │  Expression  │                  │  │
│  │                            └──────┬───────┘                  │  │
│  │                                   │                          │  │
│  │                            ┌──────▼───────┐                  │  │
│  │                            │  Body        │                  │  │
│  │                            │  Animation   │                  │  │
│  │                            └──────────────┘                  │  │
│  │                                                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   USER SEES & HEARS    │
                    │   Avatar Speaking! 🎉  │
                    └────────────────────────┘
```

## Key Points

### ✅ TTS is Already Working!

1. **Text Input Path**:
   ```
   Type Message → /tts → AI → ElevenLabs TTS → Avatar Speaks
   ```

2. **Voice Input Path**:
   ```
   Speak → /sts → Whisper STT → AI → ElevenLabs TTS → Avatar Speaks
   ```

### 🎯 Both Paths Use TTS!

Whether you type or speak, the avatar's response is ALWAYS converted to speech using ElevenLabs TTS.

### 🔊 Audio Generation

The `lipSync` module in the backend:
1. Takes AI response text
2. Calls ElevenLabs API
3. Generates MP3 audio
4. Creates lip sync data
5. Sends both to frontend

### 🎭 Avatar Playback

The Avatar component:
1. Receives audio (base64)
2. Creates Audio object
3. Plays audio
4. Syncs lip movements
5. Shows facial expressions
6. Plays body animations

## Testing Each Stage

### Test 1: Type "Hello"
```
Input: "Hello"
  ↓
AI: "Hi there! How can I help you?"
  ↓
TTS: Generates audio of AI response
  ↓
Avatar: Speaks "Hi there! How can I help you?"
```

### Test 2: Speak "Who are you?"
```
Input: [Voice recording]
  ↓
STT: "Who are you?"
  ↓
AI: "I'm AVA, your AI assistant!"
  ↓
TTS: Generates audio of AI response
  ↓
Avatar: Speaks "I'm AVA, your AI assistant!"
```

## Verification Checklist

✅ Backend has ElevenLabs API key
✅ Backend calls `convertTextToSpeech()`
✅ Audio files are generated in `audios/` folder
✅ Audio is converted to base64
✅ Frontend receives audio in message
✅ Avatar component plays audio
✅ Lip sync animates mouth
✅ User hears the voice

## Summary

**Text-to-Speech is FULLY IMPLEMENTED and WORKING!**

Every response from the AI is converted to speech and played by the avatar with synchronized lip movements. Both text input and voice input result in spoken responses.
