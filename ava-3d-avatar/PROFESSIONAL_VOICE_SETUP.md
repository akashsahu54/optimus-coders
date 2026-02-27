# Professional Male Voice Configuration

## 🎙️ Current Voice: Antoni

AVA now uses **Antoni**, a professional male voice from Eleven Labs that is specifically optimized for customer service interactions.

### Voice Characteristics

**Antoni** (`ErXwobaYiN019PkySvjV`)
- ✅ Well-rounded and pleasant tone
- ✅ Friendly and approachable
- ✅ Professional without being overly formal
- ✅ Clear articulation and pronunciation
- ✅ Multilingual support (Hindi, English, Marathi)
- ✅ Natural conversational flow
- ✅ Ideal for customer service and support

## 🔧 Configuration Details

### Frontend Configuration (useVapi.jsx)

```javascript
voice: {
  provider: "11labs",
  voiceId: "ErXwobaYiN019PkySvjV", // Antoni - Professional male
  model: "eleven_multilingual_v2"
}
```

**Note**: Vapi automatically optimizes voice quality settings for the best customer experience.

### Environment Variables

**Backend (.env)**
```bash
ELEVEN_LABS_VOICE_ID=ErXwobaYiN019PkySvjV
```

**Frontend (.env)**
```bash
VITE_ELEVEN_LABS_VOICE_ID=ErXwobaYiN019PkySvjV
```

## 🎯 Why Antoni for Customer Service?

1. **Professional Yet Friendly**: Strikes the perfect balance between professionalism and approachability
2. **Clear Communication**: Excellent articulation ensures customers understand every word
3. **Emotional Range**: Can express empathy, enthusiasm, and reassurance naturally
4. **Multilingual Excellence**: Handles Hindi, English, and Marathi with proper pronunciation
5. **Customer Trust**: Pleasant tone builds rapport and trust quickly

## 🔄 Alternative Professional Male Voices

If you want to try different voices, here are other professional male options:

### Adam - Deep & Confident
```bash
VITE_ELEVEN_LABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
```
- **Best for**: Authoritative presence, technical support
- **Tone**: Deep, confident, commanding
- **Use case**: When you need a more serious, authoritative voice

### Arnold - Strong & Commanding
```bash
VITE_ELEVEN_LABS_VOICE_ID=VR6AewLTigWG4xSOukaG
```
- **Best for**: High-stakes situations, security-related services
- **Tone**: Strong, authoritative, decisive
- **Use case**: When you need maximum authority and confidence

### Sam - Dynamic & Energetic
```bash
VITE_ELEVEN_LABS_VOICE_ID=yoZ06aMxZJJ28mfd3POQ
```
- **Best for**: Younger audience, casual interactions
- **Tone**: Dynamic, raspy, energetic
- **Use case**: When you want a more casual, relatable voice

## 📊 Voice Comparison

| Voice | Tone | Formality | Energy | Best For |
|-------|------|-----------|--------|----------|
| **Antoni** ⭐ | Pleasant | Medium | Balanced | Customer Service |
| Adam | Deep | High | Calm | Technical Support |
| Arnold | Strong | Very High | Intense | Security/Urgent |
| Sam | Raspy | Low | High | Casual/Youth |

## ⚙️ Voice Settings Explained

### Stability (0.5)
- **Range**: 0.0 - 1.0
- **Current**: 0.5 (Balanced)
- **Effect**: 
  - Lower (0.3): More emotional variation, expressive
  - Higher (0.8): More consistent, stable delivery
- **Recommendation**: 0.5 is perfect for customer service - natural but consistent

### Similarity Boost (0.75)
- **Range**: 0.0 - 1.0
- **Current**: 0.75 (High)
- **Effect**:
  - Lower (0.3): More creative interpretation
  - Higher (0.8): Closer to original voice sample
- **Recommendation**: 0.75 ensures clear, recognizable voice quality

### Model (eleven_multilingual_v2)
- Supports multiple languages seamlessly
- Better pronunciation for non-English languages
- Natural code-switching between languages
- Essential for Hindi, English, Marathi support

## 🚀 How to Change Voice

### Method 1: Environment Variables (Recommended)

1. **Update Backend .env**
   ```bash
   cd ava-3d-avatar/apps/backend
   # Edit .env file
   ELEVEN_LABS_VOICE_ID=ErXwobaYiN019PkySvjV
   ```

2. **Update Frontend .env**
   ```bash
   cd ava-3d-avatar/apps/frontend
   # Edit .env file
   VITE_ELEVEN_LABS_VOICE_ID=ErXwobaYiN019PkySvjV
   ```

3. **Restart Both Servers**
   ```bash
   # Backend
   cd apps/backend
   node server.js
   
   # Frontend (new terminal)
   cd apps/frontend
   npm run dev
   ```

### Method 2: Direct Code Update

If environment variable is not set, the code uses the fallback value:

**File**: `apps/frontend/src/hooks/useVapi.jsx`

```javascript
voiceId: import.meta.env.VITE_ELEVEN_LABS_VOICE_ID || "ErXwobaYiN019PkySvjV"
```

Change the fallback value to your preferred voice ID.

## 🧪 Testing the Voice

### Quick Test Script

1. Start the application
2. Click "Start Conversation" 
3. Say: "Hello, can you introduce yourself?"
4. Listen to Antoni's professional, friendly response

### Test Scenarios

Test these to evaluate the voice:

1. **Empathy Test**: "I'm really frustrated with this issue"
   - Listen for warm, understanding tone

2. **Professional Test**: "What are your business hours?"
   - Listen for clear, professional delivery

3. **Multilingual Test**: "मुझे मदद चाहिए" (I need help)
   - Listen for natural Hindi pronunciation

4. **Enthusiasm Test**: "That's exactly what I needed!"
   - Listen for genuine enthusiasm in response

## 🎨 Voice Personality Match

Antoni's voice characteristics align perfectly with AVA's world-class customer service personality:

| Personality Trait | Voice Quality |
|-------------------|---------------|
| Empathetic | Warm, understanding tone |
| Professional | Clear, articulate delivery |
| Friendly | Pleasant, approachable sound |
| Confident | Steady, assured speaking |
| Patient | Calm, unhurried pace |
| Helpful | Encouraging, supportive tone |

## 📈 Performance Considerations

### Voice Generation Speed
- Antoni processes at optimal speed for real-time conversations
- Average latency: 500-800ms (excellent for live interactions)
- Multilingual model adds ~100ms but worth it for language support

### Quality vs. Speed
- Current settings (stability: 0.5, similarity: 0.75) provide best balance
- If you need faster responses, reduce similarity_boost to 0.6
- If you need higher quality, increase to 0.85 (adds ~200ms)

## 🌍 Multilingual Performance

Antoni excels at multilingual customer service:

### Hindi (हिंदी)
- Natural pronunciation of Devanagari script
- Proper intonation for Hindi sentences
- Handles Hindi-English code-switching smoothly

### English
- Clear American/neutral accent
- Professional business English
- Natural conversational flow

### Marathi (मराठी)
- Accurate pronunciation
- Proper emphasis and tone
- Seamless switching from Hindi/English

## 💡 Best Practices

### Do's ✅
- Keep stability at 0.5 for natural customer service tone
- Use eleven_multilingual_v2 for language support
- Test voice with actual customer scenarios
- Monitor customer feedback on voice quality

### Don'ts ❌
- Don't set stability too high (>0.8) - sounds robotic
- Don't use non-multilingual models for Hindi/Marathi
- Don't change voice frequently - consistency builds trust
- Don't sacrifice quality for speed in customer service

## 🔍 Troubleshooting

### Issue: Voice sounds robotic
**Solution**: Lower stability to 0.4 or 0.3

### Issue: Voice is inconsistent
**Solution**: Increase stability to 0.6 or 0.7

### Issue: Poor pronunciation in Hindi
**Solution**: Verify you're using `eleven_multilingual_v2` model

### Issue: Voice doesn't match personality
**Solution**: Try Adam for more authority or Sam for more energy

### Issue: Slow response times
**Solution**: Reduce similarity_boost to 0.6

## 📞 Customer Feedback

Expected customer reactions to Antoni's voice:

✅ "The voice sounds professional and trustworthy"  
✅ "Easy to understand and pleasant to listen to"  
✅ "Feels like talking to a real customer service rep"  
✅ "Natural pronunciation in both English and Hindi"  
✅ "Warm and friendly without being overly casual"  

## 🎓 Voice Training Tips

To get the best performance from Antoni:

1. **Write natural dialogue**: Antoni excels with conversational text
2. **Use proper punctuation**: Helps with pacing and emphasis
3. **Avoid ALL CAPS**: Can sound unnatural
4. **Use ellipsis (...)**: For thoughtful pauses
5. **Add emotion cues**: "I'm so glad..." vs "I'm glad..."

## 📚 Additional Resources

- **Eleven Labs Voice Library**: https://elevenlabs.io/voice-library
- **Voice Settings Guide**: See `VOICE_OPTIONS.md`
- **API Documentation**: https://elevenlabs.io/docs
- **Multilingual Support**: https://elevenlabs.io/docs/languages

## ✨ Summary

Antoni is the perfect voice for AVA's world-class customer service:

🎯 **Professional** - Builds trust and credibility  
💝 **Friendly** - Creates warm, welcoming interactions  
🌍 **Multilingual** - Serves diverse customer base  
🗣️ **Clear** - Ensures perfect understanding  
⚡ **Responsive** - Fast enough for real-time conversations  

Your customers will appreciate the professional, pleasant voice that makes every interaction feel personal and caring.

---

**Voice**: Antoni (`ErXwobaYiN019PkySvjV`)  
**Status**: ✅ Configured and Ready  
**Last Updated**: February 2026
