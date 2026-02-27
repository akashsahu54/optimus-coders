# Language Configuration Guide

## 🌍 Quick Language Setup

AVA is now configured for **Hindi (हिंदी)** as the primary language. Here's how to change it if needed.

## 📝 Current Configuration

```javascript
transcriber: {
  provider: "deepgram",
  model: "nova-2",
  language: "hi", // Hindi
  keywords: ["AVA", "order", "status", "help", "मदद", "ऑर्डर", "स्टेटस"],
}

firstMessage: "नमस्ते! मैं AVA हूं, आपकी समर्पित सहायक..."
```

## 🔄 Switch to Different Language

### Option 1: English

**File**: `apps/frontend/src/hooks/useVapi.jsx`

```javascript
transcriber: {
  provider: "deepgram",
  model: "nova-2",
  language: "en", // English
}

firstMessage: "Hello! I'm AVA, your dedicated assistant. How can I help you today?"
```

### Option 2: Marathi (मराठी)

```javascript
transcriber: {
  provider: "deepgram",
  model: "nova-2",
  language: "mr", // Marathi
}

firstMessage: "नमस्कार! मी AVA आहे, तुमची समर्पित सहाय्यक. आज मी तुमच्यासाठी काय करू शकते?"
```

### Option 3: Multi-Language (Not Recommended)

```javascript
transcriber: {
  provider: "deepgram",
  model: "nova-2",
  language: "multi", // Multiple languages
}

firstMessage: "Hello! नमस्ते! I'm AVA. How can I help you?"
```

**Note**: Multi-language mode may cause transcription issues (showing English instead of Hindi text). Keywords parameter is not supported by Vapi.

## 🎯 Supported Languages

| Language | Code | First Message Example |
|----------|------|----------------------|
| Hindi | `hi` | नमस्ते! मैं AVA हूं... |
| English | `en` | Hello! I'm AVA... |
| Marathi | `mr` | नमस्कार! मी AVA आहे... |
| Tamil | `ta` | வணக்கம்! நான் AVA... |
| Telugu | `te` | నమస్కారం! నేను AVA... |
| Bengali | `bn` | নমস্কার! আমি AVA... |
| Gujarati | `gu` | નમસ્તે! હું AVA છું... |
| Kannada | `kn` | ನಮಸ್ಕಾರ! ನಾನು AVA... |
| Malayalam | `ml` | നമസ്കാരം! ഞാൻ AVA... |
| Punjabi | `pa` | ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ AVA ਹਾਂ... |

## 📍 Where to Make Changes

### 1. Main Call Configuration
**File**: `apps/frontend/src/hooks/useVapi.jsx`  
**Function**: `startCall()`  
**Lines**: ~260-270

### 2. Reconnection Configuration
**File**: `apps/frontend/src/hooks/useVapi.jsx`  
**Function**: Inside `useEffect` (reconnection logic)  
**Lines**: ~80-90

**Important**: Update BOTH locations for consistency!

## 🔧 Step-by-Step Change Process

### Step 1: Choose Your Language
Decide which language your primary customers speak.

### Step 2: Update Transcriber
```javascript
// Find this section in useVapi.jsx
transcriber: {
  provider: "deepgram",
  model: "nova-2",
  language: "YOUR_LANGUAGE_CODE", // Change this
  keywords: ["YOUR", "KEYWORDS", "HERE"],
}
```

### Step 3: Update First Message
```javascript
firstMessage: "Your greeting in the chosen language"
```

### Step 4: Update Keywords
Add common words your customers will say:
```javascript
keywords: [
  "AVA",
  "order", "ऑर्डर",
  "status", "स्टेटस",
  "help", "मदद",
  // Add more based on your business
]
```

### Step 5: Update System Prompt (Optional)
If you want to emphasize a specific language:
```javascript
content: `You are AVA...

CRITICAL: Always respond in [YOUR LANGUAGE] unless customer switches language.
...`
```

### Step 6: Restart Application
```bash
cd apps/frontend
npm run dev
```

## 💡 Pro Tips

### 1. Match Voice to Language
If using Hindi, consider using a Hindi-optimized voice:
```bash
# In .env
VITE_ELEVEN_LABS_VOICE_ID=your_hindi_voice_id
```

### 2. Add Business-Specific Keywords
```javascript
keywords: [
  "AVA",
  "order", "ऑर्डर",
  "delivery", "डिलीवरी",
  "payment", "पेमेंट",
  "refund", "रिफंड",
  "cancel", "कैंसल",
  // Your product names
  "laptop", "लैपटॉप",
  "mobile", "मोबाइल",
]
```

### 3. Test Thoroughly
After changing language:
- Test common customer queries
- Verify transcription accuracy
- Check response language matches
- Test with different accents

## 🌐 Multi-Region Setup

If you serve multiple regions, consider:

### Option A: Separate Deployments
- Deploy one instance per language
- Route customers based on region
- Best accuracy per language

### Option B: Dynamic Language Detection
- Start with `language: "multi"`
- Detect language from first message
- Switch transcriber dynamically
- More complex but flexible

### Option C: Language Selection UI
- Add language selector button
- Let customer choose preferred language
- Update transcriber on selection
- Best user experience

## 🔍 Troubleshooting

### Issue: Wrong language transcription
**Check**:
- [ ] Transcriber language code is correct
- [ ] Keywords include target language words
- [ ] First message matches language
- [ ] Both call and reconnect configs updated

### Issue: Mixed language responses
**Check**:
- [ ] System prompt emphasizes language matching
- [ ] Temperature not too high (keep at 0.8)
- [ ] Model supports your language (Groq Llama does)

### Issue: Poor accuracy
**Check**:
- [ ] Using correct language code
- [ ] Keywords are relevant
- [ ] Microphone quality is good
- [ ] Background noise is minimal

## 📊 Language Performance

Based on testing:

| Language | Transcription Accuracy | Response Quality |
|----------|----------------------|------------------|
| Hindi | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐⭐ Excellent |
| English | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐⭐ Excellent |
| Marathi | ⭐⭐⭐⭐ Very Good | ⭐⭐⭐⭐ Very Good |
| Tamil | ⭐⭐⭐⭐ Very Good | ⭐⭐⭐⭐ Very Good |
| Multi | ⭐⭐⭐ Good | ⭐⭐⭐⭐ Very Good |

**Recommendation**: Use single language mode for best results.

## ✅ Quick Reference

### Hindi (Current)
```javascript
language: "hi"
firstMessage: "नमस्ते! मैं AVA हूं..."
```

### English
```javascript
language: "en"
firstMessage: "Hello! I'm AVA..."
```

### Marathi
```javascript
language: "mr"
firstMessage: "नमस्कार! मी AVA आहे..."
```

**Note**: Keywords parameter is not supported by Vapi.

---

**Current Setup**: Hindi (हिंदी) Primary  
**Transcription**: Devanagari Script  
**Voice**: Professional Male (Antoni)  
**Status**: ✅ Optimized for Hindi Customers
