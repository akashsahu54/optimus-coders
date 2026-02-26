# 🔧 Troubleshooting Guide

## Common Issues

### 1. Eleven Labs API Error: "Unusual Activity Detected" (401)

**Error Message:**
```
status: 401
"detected_unusual_activity"
"Unusual activity detected. Free Tier usage exhausted."
```

**Causes:**
- Free tier monthly quota exhausted (10,000 characters/month)
- Too many requests in short time
- API key rate limiting

**Solutions:**

#### Option A: Wait and Retry
- Free tier resets monthly
- Wait a few minutes between requests
- Reduce request frequency

#### Option B: Upgrade Eleven Labs Plan
1. Go to https://elevenlabs.io/pricing
2. Upgrade to paid plan for more quota
3. Get new API key
4. Update `.env` file

#### Option C: Use Alternative TTS (Temporary)
You can switch to browser's built-in TTS temporarily:

1. Comment out Eleven Labs in `server.js`
2. Use Web Speech API in frontend

**Quick Fix - Restart Backend:**
```bash
cd ava-3d-avatar/apps/backend
node server.js
```

---

### 2. Backend Connection Refused (ERR_CONNECTION_REFUSED)

**Error:**
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
http://localhost:3000/tts
```

**Causes:**
- Backend server not running
- Backend crashed
- Wrong port configuration

**Solutions:**

1. **Check if backend is running:**
   ```bash
   # Should see process on port 3000
   netstat -ano | findstr :3000
   ```

2. **Restart backend:**
   ```bash
   cd ava-3d-avatar/apps/backend
   node server.js
   ```

3. **Check backend logs:**
   - Look for error messages in terminal
   - Check if API keys are valid

---

### 3. Voice Not Working / No Audio

**Causes:**
- Invalid voice ID
- API key expired
- Audio file generation failed

**Solutions:**

1. **Verify voice ID in `.env`:**
   ```env
   ELEVEN_LABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
   ```

2. **Test API key:**
   ```bash
   curl -X GET "https://api.elevenlabs.io/v1/voices" \
     -H "xi-api-key: YOUR_API_KEY"
   ```

3. **Check browser console:**
   - Look for audio playback errors
   - Check if audio data is received

---

### 4. 3D Avatar Not Loading

**Error:**
```
Could not load /models/avatar.glb
```

**Solutions:**

1. **Clear Vite cache:**
   ```bash
   cd ava-3d-avatar/apps/frontend
   rm -rf node_modules/.vite
   yarn dev
   ```

2. **Verify model files exist:**
   ```bash
   ls public/models/
   # Should see: avatar.glb, animations.glb
   ```

---

### 5. Cyberpunk Styles Not Loading

**Causes:**
- PostCSS configuration error
- Tailwind not processing
- CSS file not imported

**Solutions:**

1. **Check `postcss.config.cjs` exists:**
   ```javascript
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   }
   ```

2. **Verify Tailwind config:**
   ```bash
   cat tailwind.config.js
   ```

3. **Restart frontend:**
   ```bash
   yarn dev
   ```

---

## API Key Issues

### Getting New API Keys

**Groq (Free):**
1. Visit https://console.groq.com
2. Sign up / Login
3. Generate API key
4. Add to `.env`: `GROQ_API_KEY=your_key`

**Eleven Labs (Free tier available):**
1. Visit https://elevenlabs.io
2. Sign up / Login
3. Go to Profile → API Keys
4. Generate new key
5. Add to `.env`: `ELEVEN_LABS_API_KEY=your_key`

---

## Port Conflicts

If ports 3000 or 5173/5174 are in use:

**Find process using port:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

**Change ports:**
- Backend: Edit `server.js` → `const PORT = 3001;`
- Frontend: Vite will auto-select next available port

---

## Performance Issues

### Slow Response Times

1. **Check API latency:**
   - Groq is usually very fast (<1s)
   - Eleven Labs can take 2-5s for TTS

2. **Reduce voice settings:**
   ```javascript
   // In elevenLabs.mjs
   voice_settings: {
     stability: 0.7,  // Higher = faster
     similarity_boost: 0.3,  // Lower = faster
   }
   ```

3. **Use faster model:**
   ```env
   ELEVEN_LABS_MODEL_ID=eleven_monolingual_v1
   ```

---

## Debug Mode

Enable detailed logging:

**Backend:**
```javascript
// In server.js, add:
console.log('Request received:', req.body);
console.log('Response:', response);
```

**Frontend:**
```javascript
// In useSpeech.jsx, add:
console.log('Sending message:', text);
console.log('Received response:', data);
```

---

## Still Having Issues?

1. Check all environment variables in `.env`
2. Verify API keys are valid
3. Check network connectivity
4. Review browser console for errors
5. Check backend terminal for errors
6. Restart both servers

---

## Quick Reset

If everything is broken:

```bash
# Stop all processes
# Ctrl+C in both terminals

# Backend
cd ava-3d-avatar/apps/backend
node server.js

# Frontend (new terminal)
cd ava-3d-avatar/apps/frontend
rm -rf node_modules/.vite
yarn dev
```

Then open: `http://localhost:5174`
