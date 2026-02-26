# Voice Quality Improvement Guide

## 🎤 Issue: Harsh or Robotic Sound

If the avatar's voice sounds harsh, robotic, or unnatural, here are solutions:

## ✅ Solution 1: Adjust Voice Settings (Applied)

I've updated the voice settings in `elevenLabs.mjs` to be smoother:

```javascript
voice_settings: {
  stability: 0.75,              // Higher = more consistent, less variation
  similarity_boost: 0.75,       // Higher = better quality, more natural
  style: 0.5,                   // Lower = less dramatic, more neutral
  use_speaker_boost: true       // Enhances clarity
}
```

### What Each Setting Does:

**Stability (0-1):**
- Low (0.3): More expressive, varied, but can sound inconsistent
- Medium (0.5): Balanced
- High (0.75): Smooth, consistent, professional
- **Recommended: 0.75 for smooth voice**

**Similarity Boost (0-1):**
- Low (0.3): Less like original voice, can sound generic
- Medium (0.5): Balanced
- High (0.75): More like original voice, better quality
- **Recommended: 0.75 for natural sound**

**Style (0-1):**
- Low (0): Neutral, calm, less dramatic
- Medium (0.5): Balanced expression
- High (1): Very expressive, dramatic
- **Recommended: 0.5 for natural conversation**

## ✅ Solution 2: Try a Different Voice

Some voices are naturally smoother than others. Here are the best options:

### Smoothest Male Voices:

**1. Antoni (Recommended for smooth sound)**
```env
ELEVEN_LABS_VOICE_ID=ErXwobaYiN019PkySvjV
```
- Well-rounded, pleasant
- Very smooth and natural
- Great for professional AI

**2. Josh**
```env
ELEVEN_LABS_VOICE_ID=TxGEqnHWrfWFTfGW9XjX
```
- Young, clear, friendly
- Smooth and energetic
- Good for casual conversations

**3. Callum**
```env
ELEVEN_LABS_VOICE_ID=N2lVS1w4EtoT3dr4eOWO
```
- Calm, smooth, professional
- Very natural sounding
- Excellent for AI assistant

### Smoothest Female Voices:

**1. Rachel (Highly Recommended)**
```env
ELEVEN_LABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```
- Calm, clear, professional
- Very smooth and natural
- Perfect for AI assistant

**2. Bella**
```env
ELEVEN_LABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL
```
- Soft, friendly, gentle
- Extremely smooth
- Great for warm conversations

**3. Elli**
```env
ELEVEN_LABS_VOICE_ID=MF3mGyEYCl7XYWbV9V6O
```
- Young, upbeat, smooth
- Natural and friendly
- Good for casual AI

### Current Voice (Adam):
```env
ELEVEN_LABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
```
- Deep, confident male
- Can sound harsh with wrong settings
- Better with higher stability

## 🔧 How to Change Voice

1. Open `ava-3d-avatar/apps/backend/.env`
2. Change the `ELEVEN_LABS_VOICE_ID` line
3. Restart the backend server
4. Test with a new message

Example:
```env
# Change from Adam to Rachel (smoother)
ELEVEN_LABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

## 🎛️ Fine-Tuning Settings

If voice is still harsh after changing settings, try these adjustments:

### For Smoother Sound:
```javascript
voice_settings: {
  stability: 0.85,              // Even more stable
  similarity_boost: 0.8,        // Higher quality
  style: 0.3,                   // Less dramatic
  use_speaker_boost: true
}
```

### For More Natural Variation:
```javascript
voice_settings: {
  stability: 0.65,              // Slightly less stable
  similarity_boost: 0.75,       // Good quality
  style: 0.6,                   // More expressive
  use_speaker_boost: true
}
```

### For Professional/Calm:
```javascript
voice_settings: {
  stability: 0.9,               // Very stable
  similarity_boost: 0.7,        // Good quality
  style: 0.2,                   // Very neutral
  use_speaker_boost: true
}
```

## 🧪 Testing Different Settings

### Quick Test Script

1. Edit `elevenLabs.mjs` with new settings
2. Restart backend: `node server.js`
3. Type a test message: "Hello, this is a test"
4. Listen to the result
5. Adjust settings if needed

### Test Phrases

Use these to evaluate voice quality:
- "Hello, how can I help you today?"
- "I'm AVA, your AI assistant"
- "That's a great question, let me explain"
- "Thank you for using our service"

## 📊 Voice Comparison

| Voice | Gender | Smoothness | Energy | Best For |
|-------|--------|------------|--------|----------|
| Rachel | Female | ⭐⭐⭐⭐⭐ | Medium | Professional AI |
| Antoni | Male | ⭐⭐⭐⭐⭐ | Medium | Smooth conversations |
| Bella | Female | ⭐⭐⭐⭐⭐ | Low | Gentle, calm |
| Josh | Male | ⭐⭐⭐⭐ | High | Energetic AI |
| Adam | Male | ⭐⭐⭐ | Medium | Deep, authoritative |
| Elli | Female | ⭐⭐⭐⭐ | High | Upbeat, friendly |

## 🎯 Recommended Configuration

For the smoothest, most natural sound:

```env
# In .env file
ELEVEN_LABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM  # Rachel
ELEVEN_LABS_MODEL_ID=eleven_multilingual_v2
```

```javascript
// In elevenLabs.mjs
voice_settings: {
  stability: 0.75,
  similarity_boost: 0.75,
  style: 0.5,
  use_speaker_boost: true
}
```

## 🔍 Troubleshooting

### Issue: Voice still sounds harsh

**Try:**
1. Increase stability to 0.85
2. Decrease style to 0.3
3. Try Rachel or Antoni voice
4. Check audio output quality (not system issue)

### Issue: Voice sounds robotic

**Try:**
1. Decrease stability to 0.65
2. Increase style to 0.6
3. Try a different voice
4. Check if using correct model_id

### Issue: Voice has artifacts/glitches

**Try:**
1. Check internet connection
2. Verify API key is valid
3. Check ElevenLabs service status
4. Try regenerating the audio

## 💡 Pro Tips

1. **Female voices** are generally smoother than male voices
2. **Higher stability** = smoother but less expressive
3. **Lower style** = more neutral, less dramatic
4. **Test with longer sentences** to hear full quality
5. **Different voices work better for different content**

## 🎬 Quick Fix Summary

**Immediate Actions:**
1. ✅ Voice settings already updated to smoother values
2. Try Rachel voice: `ELEVEN_LABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM`
3. Restart backend server
4. Test with "Hello, how are you?"

**Expected Result:**
- Smoother, more natural voice
- Less harsh or robotic sound
- Better overall quality

---

**Current Settings:** ✅ Optimized for smooth sound
**Recommended Voice:** Rachel (21m00Tcm4TlvDq8ikWAM)
**Next Step:** Restart backend and test!
