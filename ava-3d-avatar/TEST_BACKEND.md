# Backend Testing Guide

## Problem
Avatar says "Hi I'm AVA" for every question, regardless of what you ask.

## Possible Causes
1. Groq AI is failing and using default/cached responses
2. Backend is not processing messages correctly
3. API key issues

## Step 1: Test Groq API

Run this command in the backend folder:
```bash
cd ava-3d-avatar/apps/backend
node test-groq-api.js
```

**Expected output:**
```
✅ SUCCESS! Groq API is working!
📨 Response: Hello! Nice to meet you.
```

**If you see errors:**
- Check your GROQ_API_KEY in `.env`
- Verify the key is valid at https://console.groq.com
- Check if you have quota remaining

## Step 2: Check Backend Console

When you send a message, the backend should show:
```
============================================================
💬 TEXT-TO-SPEECH REQUEST: "hi"
============================================================
🎯 Step 1: Processing with AI (Groq)...
✅ AI generated 1 message(s)
🎯 Step 2: Generating speech and lip sync...
✅ Text-to-speech pipeline completed!
============================================================
```

**If you see:**
```
❌ AI processing failed: [error message]
⚠️  Using default response
```

This means Groq is failing. Common reasons:
- Invalid API key
- Quota exceeded
- Network issues
- Groq service down

## Step 3: Test with curl

Test the backend directly:
```bash
curl -X POST http://localhost:3000/tts \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"what is your name\"}"
```

Check the response - it should contain different text for different questions.

## Step 4: Clear Browser Cache

The browser might be caching old responses:
1. Press `Ctrl + Shift + Delete` (or `Cmd + Shift + Delete` on Mac)
2. Select "Cached images and files"
3. Click "Clear data"
4. Hard refresh: `Ctrl + Shift + R`

## Step 5: Check for Errors

Look in the backend console for:
- `❌ AI processing failed`
- `⚠️ Using default response`
- Any error messages about API keys
- Network errors

## Common Fixes

### Fix 1: Groq API Key Invalid
Get a new key from https://console.groq.com and update `.env`:
```
GROQ_API_KEY=your_new_key_here
```

### Fix 2: Quota Exceeded
Groq free tier has limits. Check your usage at https://console.groq.com

### Fix 3: Wrong Model
The code uses `llama-3.3-70b-versatile`. If this model is unavailable, update `openAI.mjs`:
```javascript
model: "llama-3.1-70b-versatile",  // Try older version
```

### Fix 4: Network Issues
Check if you can reach Groq:
```bash
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer YOUR_GROQ_API_KEY"
```

## What Should Happen

When working correctly:
1. You type "hi" → Backend receives "hi"
2. Groq AI generates response: "Hello! How can I help you?"
3. ElevenLabs converts to speech
4. Avatar speaks the NEW response (not cached)
5. Different questions get different answers

## Still Not Working?

1. Restart the backend server
2. Check all API keys are valid
3. Look for error messages in backend console
4. Try the test-groq-api.js script
5. Check Groq service status at https://status.groq.com
