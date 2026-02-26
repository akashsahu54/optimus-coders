# 🎤 Eleven Labs Voice Options

## Current Voice
**Adam** - Deep, confident male voice (Perfect for cyberpunk AI assistant)
- Voice ID: `pNInz6obpgDQGcFmaJgB`

---

## Available Male Voices

### Adam (Current)
- **ID**: `pNInz6obpgDQGcFmaJgB`
- **Style**: Deep, confident, professional
- **Best for**: AI assistants, narration, cyberpunk themes

### Arnold
- **ID**: `VR6AewLTigWG4xSOukaG`
- **Style**: Strong, authoritative, commanding
- **Best for**: Military, action, serious content

### Antoni
- **ID**: `ErXwobaYiN019PkySvjV`
- **Style**: Well-rounded, pleasant, friendly
- **Best for**: Customer service, tutorials, general use

### Sam
- **ID**: `yoZ06aMxZJJ28mfd3POQ`
- **Style**: Dynamic, raspy, energetic
- **Best for**: Gaming, entertainment, casual content

### Josh
- **ID**: `TxGEqnHWrfWFTfGW9XjX`
- **Style**: Young, energetic, enthusiastic
- **Best for**: Youth content, upbeat presentations

---

## Available Female Voices

### Rachel (Previous Default)
- **ID**: `21m00Tcm4TlvDq8ikWAM`
- **Style**: Clear, professional, neutral
- **Best for**: General purpose, professional content

### Bella
- **ID**: `EXAVITQu4vr4xnSDxMaL`
- **Style**: Soft, gentle, soothing
- **Best for**: Meditation, calm content

### Elli
- **ID**: `MF3mGyEYCl7XYWbV9V6O`
- **Style**: Young, energetic, friendly
- **Best for**: Casual, upbeat content

### Domi
- **ID**: `AZnzlk1XvdvUeBnXmlld`
- **Style**: Strong, confident, assertive
- **Best for**: News, authoritative content

---

## How to Change Voice

1. Open `.env` file in `apps/backend/`
2. Change the `ELEVEN_LABS_VOICE_ID` value
3. Restart the backend server

```bash
# Example: Change to Arnold
ELEVEN_LABS_VOICE_ID=VR6AewLTigWG4xSOukaG
```

---

## Voice Settings

Current configuration in `elevenLabs.mjs`:

```javascript
voice_settings: {
  stability: 0.5,        // 0-1: Lower = more expressive, Higher = more stable
  similarity_boost: 0.5, // 0-1: How closely to match the original voice
  style: 1,              // 0-1: Exaggeration of the style
  use_speaker_boost: true // Enhance clarity and quality
}
```

### Adjusting Voice Settings

- **Stability**: 
  - Low (0.3): More emotional, varied
  - High (0.8): More consistent, robotic
  
- **Similarity Boost**:
  - Low (0.3): More creative interpretation
  - High (0.8): Closer to original voice sample

- **Style**:
  - 0: Neutral delivery
  - 1: Full character expression

---

## Testing Voices

After changing the voice ID:
1. Restart backend: `node server.js`
2. Send a test message from the frontend
3. Listen to the new voice

---

## Cyberpunk Recommendations

For the Neural Interface theme, these voices work best:

1. **Adam** (Current) - Deep, authoritative AI
2. **Arnold** - Military-grade AI system
3. **Sam** - Edgy, street-smart AI

---

**Note**: Requires valid Eleven Labs API key in `.env` file.
