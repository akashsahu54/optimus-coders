# Conversation Mode Guide

## 🎯 What is Conversation Mode?

Conversation Mode enables **natural, hands-free voice conversations** with the AI avatar:

1. **Click once** to enable conversation mode
2. **Just start talking** - system automatically listens
3. **Stop talking** - system automatically processes
4. **Avatar responds** - with speech and animations
5. **Interrupt anytime** - start talking to interrupt avatar
6. **Continuous conversation** - no need to click again!

## 🚀 How to Use

### Step 1: Start the System

```bash
# Terminal 1: Backend
cd ava-3d-avatar/apps/backend
node server.js

# Terminal 2: Frontend
cd ava-3d-avatar/apps/frontend
npm run dev
```

### Step 2: Enable Conversation Mode

1. Open the app in your browser
2. Look at the bottom command console
3. Click the **speaker/microphone button** (left side)
4. Button turns **GREEN** = Conversation mode is ON!

### Step 3: Have a Natural Conversation

**Just start talking!** The system will:
- Automatically detect when you start speaking
- Automatically start recording
- Automatically stop when you're done
- Process your speech and respond
- Allow you to interrupt at any time

## 🎤 Button States

### Manual Mode (Default)
```
[🎤] Blue/Cyan button
```
- Click to enable conversation mode
- Text input is active
- You can type messages

### Conversation Mode Active
```
[🔊] Green button with sound waves
```
- System is listening for your voice
- Text input is disabled
- Just speak naturally!

### Listening/Recording
```
[🔊] Green button pulsing with red dot
```
- You are currently speaking
- System is recording your voice
- Keep talking or stop when done

### Processing
```
[🔊] Green button (no pulse)
Status: "PROCESSING..."
```
- Your speech is being converted to text
- AI is generating a response
- Speech is being synthesized
- Wait for avatar to respond

## 💬 Conversation Flow

### Example Conversation

**You:** *Start talking* "Hello, who are you?"
- System detects voice
- Starts recording automatically
- You stop talking
- System stops recording automatically
- Processes speech-to-text
- AI generates response
- Converts to speech

**Avatar:** *Speaks* "Hi! I'm AVA, your AI assistant..."
- Avatar's mouth moves with speech
- Facial expressions show
- Body animates

**You:** *Interrupt by talking* "Wait, tell me more about..."
- Avatar stops speaking immediately
- System starts recording your new question
- Conversation continues naturally

## ⚡ Key Features

### 1. Voice Activity Detection (VAD)
- Automatically detects when you start speaking
- No need to click button each time
- Adjusts to your speaking pace

### 2. Auto-Stop Recording
- Detects 1.5 seconds of silence
- Automatically stops and processes
- No manual button clicking needed

### 3. Interrupt Handling
- Start talking anytime to interrupt avatar
- Avatar stops speaking immediately
- Your new message takes priority
- Previous message queue is cleared

### 4. Continuous Conversation
- One click enables the mode
- Talk as many times as you want
- Natural back-and-forth dialogue
- Click again to disable

## 🎛️ Settings

### Silence Detection Delay
Default: 1.5 seconds

Edit in `useVoiceActivityDetection.jsx`:
```javascript
silenceDelay: 1500  // milliseconds
```

### Volume Threshold
Default: -50 dB

Edit in `useVoiceActivityDetection.jsx`:
```javascript
volumeThreshold: -50  // decibels
```

Lower value = more sensitive (picks up quieter sounds)
Higher value = less sensitive (only loud sounds)

## 🔧 Troubleshooting

### Issue: System doesn't detect my voice

**Solutions:**
1. Check microphone permissions in browser
2. Speak louder or closer to microphone
3. Reduce background noise
4. Lower the `volumeThreshold` value

### Issue: System stops recording too quickly

**Solution:**
Increase `silenceDelay`:
```javascript
silenceDelay: 2000  // 2 seconds instead of 1.5
```

### Issue: System keeps recording after I stop

**Solution:**
Decrease `silenceDelay`:
```javascript
silenceDelay: 1000  // 1 second instead of 1.5
```

### Issue: Can't interrupt avatar

**Check:**
1. Conversation mode is enabled (green button)
2. Speak loudly enough to trigger VAD
3. Check browser console for errors

### Issue: Button doesn't turn green

**Solutions:**
1. Refresh the page
2. Check microphone permissions
3. Check browser console for errors
4. Try a different browser (Chrome/Edge recommended)

## 📊 Visual Indicators

### Status Display (Top Center)
- "AUTO MODE - READY" = Waiting for you to speak
- "LISTENING TO USER" = Detecting your voice
- "RECORDING VOICE" = Capturing your speech
- "NEURAL PROCESSING..." = Processing your message
- "AVATAR SPEAKING" = Avatar is responding

### Voice Visualizer (Center)
- Animated bars appear when you speak
- Pulses with your voice volume
- Disappears when silent

### HUD Panels (Sides)
- **Left Panel**: Shows "VOICE MODE: AUTO"
- **Right Panel**: Shows "LISTENING" or "READY"

## 🎯 Best Practices

### For Best Experience

1. **Find a quiet place** - Reduce background noise
2. **Speak clearly** - Normal speaking voice
3. **Natural pauses** - System detects when you're done
4. **Don't rush** - Wait for avatar to finish (or interrupt if needed)
5. **One person at a time** - System picks up all voices

### For Development

1. **Monitor console logs** - See VAD events
2. **Adjust thresholds** - Fine-tune for your environment
3. **Test different scenarios** - Quiet room, noisy room, etc.
4. **Check audio levels** - Use browser's audio visualizer

## 🔄 Switching Modes

### From Manual to Conversation Mode
1. Click the microphone button
2. Button turns green
3. Text input becomes disabled
4. Start speaking!

### From Conversation to Manual Mode
1. Click the green button again
2. Button turns blue/cyan
3. Text input becomes enabled
4. Type messages normally

## 🎬 Example Scenarios

### Scenario 1: Quick Question
```
1. Click button (enable conversation mode)
2. Say: "What's the weather?"
3. System auto-records and processes
4. Avatar responds with weather info
5. Click button again (disable mode)
```

### Scenario 2: Long Conversation
```
1. Click button (enable conversation mode)
2. Say: "Tell me about yourself"
3. Avatar responds
4. Say: "What can you help me with?"
5. Avatar responds
6. Say: "Give me an example"
7. Avatar responds
8. Continue as long as you want...
9. Click button when done
```

### Scenario 3: Interrupting Avatar
```
1. Click button (enable conversation mode)
2. Say: "Tell me a long story"
3. Avatar starts speaking...
4. You: "Wait, stop!" (start talking)
5. Avatar stops immediately
6. System records your new message
7. Avatar responds to new message
```

## 🧪 Testing

### Test 1: Basic Conversation
1. Enable conversation mode
2. Say "Hello"
3. Wait for response
4. Say "Thank you"
5. Wait for response

### Test 2: Interruption
1. Enable conversation mode
2. Say "Tell me a long story"
3. While avatar is speaking, say "Stop"
4. Verify avatar stops immediately

### Test 3: Continuous Dialogue
1. Enable conversation mode
2. Have a 5-turn conversation
3. Verify no button clicks needed
4. Verify natural flow

## 📈 Performance

### Expected Timings
- Voice detection: Instant
- Recording start: Instant
- Silence detection: 1.5 seconds
- Speech-to-text: 1-2 seconds
- AI processing: 1-2 seconds
- Text-to-speech: 1-3 seconds
- **Total per turn: 3-7 seconds**

### Optimization Tips
1. Speak concisely for faster responses
2. Ensure stable internet connection
3. Use wired connection if possible
4. Close other bandwidth-heavy apps

## 🔐 Privacy

### What's Recorded
- Only when conversation mode is ON
- Only when you're speaking
- Audio is sent to backend for processing
- Not stored permanently (processed and discarded)

### What's Not Recorded
- When conversation mode is OFF
- When you're silent
- When avatar is speaking
- Background conversations (unless loud enough)

## 📚 Technical Details

### Voice Activity Detection
- Uses Web Audio API
- Analyzes frequency data in real-time
- Calculates average volume in decibels
- Triggers on threshold crossing

### Interrupt Handling
- Monitors for voice while avatar speaks
- Pauses audio immediately on detection
- Clears message queue
- Starts new recording

### Auto-Recording
- Starts on voice detection
- Stops after silence period
- Sends to backend automatically
- No manual intervention needed

## 🎉 Summary

**Conversation Mode makes talking to the avatar feel natural!**

✅ Click once to enable
✅ Just start talking
✅ System auto-detects and records
✅ Avatar responds with speech
✅ Interrupt anytime
✅ Continuous conversation
✅ Click again to disable

**It's like talking to a real person!** 🗣️

---

**Need Help?** Check the troubleshooting section or console logs for debugging.
