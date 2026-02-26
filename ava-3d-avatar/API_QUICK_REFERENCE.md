# API Quick Reference

## 🔑 Required API Keys

### 1. OpenAI (Speech-to-Text)
```
Website: https://platform.openai.com/
Get Key: https://platform.openai.com/api-keys
Cost: ~$0.006 per minute
```

### 2. Groq (AI Processing)
```
Website: https://console.groq.com/
Get Key: https://console.groq.com/keys
Cost: FREE! 🎉
```

### 3. ElevenLabs (Text-to-Speech)
```
Website: https://elevenlabs.io/
Get Key: https://elevenlabs.io/app/settings/api-keys
Cost: FREE tier (10k chars/month)
```

---

## 📝 .env File Template

```env
# OpenAI - Speech to Text
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE

# Groq - AI Processing (FREE!)
GROQ_API_KEY=gsk_YOUR_KEY_HERE

# ElevenLabs - Text to Speech
ELEVEN_LABS_API_KEY=sk_YOUR_KEY_HERE
ELEVEN_LABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
ELEVEN_LABS_MODEL_ID=eleven_multilingual_v2
```

---

## 💰 Cost Summary

| Service | Free Tier | Light Usage | Medium Usage |
|---------|-----------|-------------|--------------|
| OpenAI | No | $0.30/month | $1.50/month |
| Groq | ✅ FREE | ✅ FREE | ✅ FREE |
| ElevenLabs | 10k chars | FREE | $5/month |
| **TOTAL** | - | **$0.30/month** | **$6.50/month** |

---

## 🎤 Popular Voice IDs

```env
# Male Voices
ELEVEN_LABS_VOICE_ID=pNInz6obpgDQGcFmaJgB  # Adam (default)
ELEVEN_LABS_VOICE_ID=VR6AewLTigWG4xSOukaG  # Arnold
ELEVEN_LABS_VOICE_ID=ErXwobaYiN019PkySvjV  # Antoni

# Female Voices
ELEVEN_LABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM  # Rachel
ELEVEN_LABS_VOICE_ID=AZnzlk1XvdvUeBnXmlld  # Domi
ELEVEN_LABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL  # Bella
```

---

## ✅ Test Your Setup

```bash
cd ava-3d-avatar/apps/backend
node test-speech-to-speech.js
```

---

## 📊 Monitor Usage

- **OpenAI**: https://platform.openai.com/usage
- **Groq**: https://console.groq.com/usage
- **ElevenLabs**: https://elevenlabs.io/app/usage

---

## 🚨 Common Errors

### "Invalid API Key"
→ Check key format and verify it's active

### "Quota Exceeded"
→ Check usage dashboard and upgrade plan

### "Rate Limited"
→ Wait 1-2 minutes, system auto-retries

---

## 🎯 Quick Setup (5 Steps)

1. Get OpenAI key → Add to `.env`
2. Get Groq key → Add to `.env`
3. Get ElevenLabs key → Add to `.env`
4. Run test script
5. Start the system!

---

**Total Setup Time:** ~15 minutes
**Monthly Cost:** As low as $0.30
**Groq is FREE!** 🎉
