# API Setup Guide

## 📋 Required APIs

Your speech-to-speech system requires **3 APIs** to work:

| API | Purpose | Cost | Required |
|-----|---------|------|----------|
| **OpenAI** | Speech-to-Text (Whisper) | Paid | ✅ Yes |
| **Groq** | AI Responses (LLaMA 3.3 70B) | FREE! | ✅ Yes |
| **ElevenLabs** | Text-to-Speech | Free tier available | ✅ Yes |

## 🔑 API Keys Setup

### 1. OpenAI API (Speech-to-Text)

**What it does:** Converts your voice to text using Whisper model

**How to get:**
1. Go to https://platform.openai.com/signup
2. Create an account or sign in
3. Go to https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Copy the key (starts with `sk-proj-...`)

**Pricing:**
- Whisper: $0.006 per minute of audio
- Example: 100 minutes = $0.60

**Add to `.env`:**
```env
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
```

---

### 2. Groq API (AI Processing)

**What it does:** Generates intelligent responses using LLaMA 3.3 70B model

**How to get:**
1. Go to https://console.groq.com/
2. Sign up with Google/GitHub
3. Go to https://console.groq.com/keys
4. Click "Create API Key"
5. Copy the key (starts with `gsk_...`)

**Pricing:**
- **100% FREE!** 🎉
- Very generous rate limits
- No credit card required

**Add to `.env`:**
```env
GROQ_API_KEY=gsk_YOUR_KEY_HERE
```

---

### 3. ElevenLabs API (Text-to-Speech)

**What it does:** Converts AI responses to natural-sounding speech

**How to get:**
1. Go to https://elevenlabs.io/sign-up
2. Create an account
3. Go to https://elevenlabs.io/app/settings/api-keys
4. Copy your API key (starts with `sk_...`)
5. Note your Voice ID (default: Adam)

**Pricing:**
- **Free tier**: 10,000 characters/month
- **Starter**: $5/month - 30,000 characters
- **Creator**: $22/month - 100,000 characters

**Add to `.env`:**
```env
ELEVEN_LABS_API_KEY=sk_YOUR_KEY_HERE
ELEVEN_LABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
ELEVEN_LABS_MODEL_ID=eleven_multilingual_v2
```

---

## 📝 Complete .env File

Create or edit `ava-3d-avatar/apps/backend/.env`:

```env
# OpenAI Configuration (for Whisper Speech-to-Text)
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_KEY_HERE

# Groq Configuration (FREE AI Processing!)
GROQ_API_KEY=gsk_YOUR_GROQ_KEY_HERE

# Eleven Labs Configuration (Text-to-Speech)
ELEVEN_LABS_API_KEY=sk_YOUR_ELEVENLABS_KEY_HERE
ELEVEN_LABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
ELEVEN_LABS_MODEL_ID=eleven_multilingual_v2
```

---

## 🎤 Voice Options (ElevenLabs)

### Default Voice: Adam
```env
ELEVEN_LABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
```
- Deep, confident male voice
- Perfect for professional AI assistant

### Other Popular Voices

**Male Voices:**
```env
# Arnold - Strong, authoritative
ELEVEN_LABS_VOICE_ID=VR6AewLTigWG4xSOukaG

# Antoni - Well-rounded, pleasant
ELEVEN_LABS_VOICE_ID=ErXwobaYiN019PkySvjV

# Sam - Dynamic, raspy
ELEVEN_LABS_VOICE_ID=yoZ06aMxZJJ28mfd3POQ

# Josh - Young, energetic
ELEVEN_LABS_VOICE_ID=TxGEqnHWrfWFTfGW9XjX
```

**Female Voices:**
```env
# Rachel - Calm, clear
ELEVEN_LABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# Domi - Strong, confident
ELEVEN_LABS_VOICE_ID=AZnzlk1XvdvUeBnXmlld

# Bella - Soft, friendly
ELEVEN_LABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL

# Elli - Young, upbeat
ELEVEN_LABS_VOICE_ID=MF3mGyEYCl7XYWbV9V6O
```

To find more voices:
1. Go to https://elevenlabs.io/app/voice-library
2. Browse available voices
3. Click on a voice to get its ID

---

## 💰 Cost Estimation

### Example Usage: 1 Hour of Conversation

**Assumptions:**
- 30 voice messages from user (average 10 seconds each)
- 30 responses from avatar (average 15 seconds each)

**Costs:**
```
OpenAI Whisper:
- User speech: 30 × 10s = 300s = 5 minutes
- Cost: 5 × $0.006 = $0.03

Groq:
- FREE! $0.00

ElevenLabs:
- Avatar responses: ~3,000 characters
- Free tier: 10,000 chars/month
- Cost: $0.00 (within free tier)

Total: $0.03 per hour
```

### Monthly Cost Estimates

**Light Usage** (10 hours/month):
- OpenAI: $0.30
- Groq: FREE
- ElevenLabs: FREE (within 10k chars)
- **Total: ~$0.30/month**

**Medium Usage** (50 hours/month):
- OpenAI: $1.50
- Groq: FREE
- ElevenLabs: $5.00 (need Starter plan)
- **Total: ~$6.50/month**

**Heavy Usage** (200 hours/month):
- OpenAI: $6.00
- Groq: FREE
- ElevenLabs: $22.00 (need Creator plan)
- **Total: ~$28.00/month**

---

## ✅ Verify API Keys

### Method 1: Use Test Script

```bash
cd ava-3d-avatar/apps/backend
node test-speech-to-speech.js
```

This will test all APIs and show which ones are working.

### Method 2: Manual Testing

**Test OpenAI:**
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_OPENAI_KEY"
```

**Test Groq:**
```bash
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer YOUR_GROQ_KEY"
```

**Test ElevenLabs:**
```bash
curl https://api.elevenlabs.io/v1/voices \
  -H "xi-api-key: YOUR_ELEVENLABS_KEY"
```

---

## 🔒 Security Best Practices

### 1. Never Commit API Keys
```bash
# .gitignore should include:
.env
.env.local
.env.*.local
```

### 2. Use Environment Variables
- Store keys in `.env` file
- Never hardcode in source code
- Use different keys for dev/prod

### 3. Rotate Keys Regularly
- Change keys every 3-6 months
- Immediately rotate if compromised
- Use separate keys per environment

### 4. Monitor Usage
- Check OpenAI usage: https://platform.openai.com/usage
- Check Groq usage: https://console.groq.com/usage
- Check ElevenLabs usage: https://elevenlabs.io/app/usage

### 5. Set Spending Limits
- OpenAI: Set monthly budget limits
- ElevenLabs: Choose appropriate plan
- Monitor costs regularly

---

## 🚨 Troubleshooting

### Error: "Invalid API Key"

**OpenAI:**
- Check key starts with `sk-proj-`
- Verify key is active at https://platform.openai.com/api-keys
- Ensure billing is set up

**Groq:**
- Check key starts with `gsk_`
- Verify key at https://console.groq.com/keys
- Try creating a new key

**ElevenLabs:**
- Check key starts with `sk_`
- Verify at https://elevenlabs.io/app/settings/api-keys
- Check account is active

### Error: "Quota Exceeded"

**OpenAI:**
- Check usage at https://platform.openai.com/usage
- Add payment method
- Increase spending limit

**Groq:**
- Wait a few minutes (rate limit)
- Very generous limits, rarely hit

**ElevenLabs:**
- Check usage at https://elevenlabs.io/app/usage
- Upgrade plan if needed
- System continues without audio if exceeded

### Error: "Rate Limited"

**Solution:**
- Wait 1-2 minutes
- Reduce request frequency
- System has automatic retry logic

---

## 📊 API Usage Monitoring

### Check Current Usage

**OpenAI:**
```bash
# View in dashboard
https://platform.openai.com/usage
```

**Groq:**
```bash
# View in console
https://console.groq.com/usage
```

**ElevenLabs:**
```bash
# View in app
https://elevenlabs.io/app/usage
```

### Set Up Alerts

**OpenAI:**
1. Go to https://platform.openai.com/account/billing/limits
2. Set monthly budget
3. Enable email notifications

**ElevenLabs:**
1. Go to https://elevenlabs.io/app/settings
2. Enable usage notifications
3. Set threshold alerts

---

## 🎯 Quick Start Checklist

- [ ] Create OpenAI account
- [ ] Get OpenAI API key
- [ ] Add payment method to OpenAI
- [ ] Create Groq account (FREE!)
- [ ] Get Groq API key
- [ ] Create ElevenLabs account
- [ ] Get ElevenLabs API key
- [ ] Copy all keys to `.env` file
- [ ] Run test script to verify
- [ ] Start using the system!

---

## 📚 Additional Resources

### Documentation
- OpenAI Whisper: https://platform.openai.com/docs/guides/speech-to-text
- Groq: https://console.groq.com/docs
- ElevenLabs: https://elevenlabs.io/docs

### Support
- OpenAI: https://help.openai.com/
- Groq: https://console.groq.com/support
- ElevenLabs: https://elevenlabs.io/support

### Pricing
- OpenAI: https://openai.com/pricing
- Groq: FREE (no pricing page needed!)
- ElevenLabs: https://elevenlabs.io/pricing

---

## 🎉 Summary

**3 APIs Required:**
1. ✅ **OpenAI** - Speech-to-Text (~$0.30/month light usage)
2. ✅ **Groq** - AI Processing (FREE!)
3. ✅ **ElevenLabs** - Text-to-Speech (FREE tier: 10k chars/month)

**Total Cost:** As low as $0.30/month for light usage!

**Setup Time:** ~15 minutes to get all API keys

**Ready to start?** Follow the checklist above! 🚀
