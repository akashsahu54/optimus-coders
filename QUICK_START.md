# 🚀 Quick Start Guide - AVA Frontend

## ⚡ For Arjun (Frontend Developer)

### 📋 Prerequisites
```bash
# Check if Node.js is installed
node --version

# If not installed, download from: https://nodejs.org/
```

### 🎯 Setup Steps

#### 1️⃣ Install Dependencies
```bash
cd frontend
npm install
```

#### 2️⃣ Run Development Server
```bash
npm run dev
```

#### 3️⃣ Open in Browser
```
http://localhost:3000
```

#### 4️⃣ Open Dashboard (Separate Tab)
```
Open: dashboard/index.html directly in browser
```

---

## 🎨 Frontend Features (Already Implemented)

### ✅ User Interface (`frontend/pages/index.js`)
- **Animated Avatar** - Changes expression based on emotion
- **Emotion Detection** - Keyword-based (angry, happy, concerned, neutral)
- **Speech Recognition** - Web Speech API (Hindi + English)
- **Text-to-Speech** - AI responds with voice
- **Speaking Animation** - Sound waves when bot speaks
- **Urgency Detection** - Flags high urgency after 2 angry messages
- **Conversation History** - Shows all messages with emotion tags
- **Real-time Stats** - Total messages, emotion, urgency level

### ✅ Admin Dashboard (`dashboard/index.html`)
- **Live Statistics** - Total calls, angry, urgent, resolved
- **Alert System** - Shows recent angry/urgent conversations
- **Auto-refresh** - Updates every 8 seconds
- **Professional UI** - Glass morphism design

---

## 🎤 How to Test

### Test Scenario 1: Happy Customer
1. Click "Speak" button
2. Say: "Thank you for your help, this is great!"
3. Watch:
   - Avatar becomes 😊
   - Emotion badge: HAPPY (green)
   - Bot responds positively

### Test Scenario 2: Angry Customer
1. Click "Speak" button
2. Say: "Main 3 din se call kar raha hoon! Problem solve nahi ho raha!"
3. Watch:
   - Avatar becomes 😟 (shakes)
   - Emotion badge: ANGRY (red)
   - Bot responds empathetically
   - Urgency level increases

### Test Scenario 3: Urgent Issue
1. Click "Speak" button
2. Say: "Urgent help chahiye! Immediately solve karo!"
3. Watch:
   - Avatar becomes 🤔
   - Emotion badge: CONCERNED (orange)
   - Bot prioritizes response

### Test Scenario 4: High Urgency Alert
1. Say 2 angry messages in a row
2. Watch:
   - 🚨 HIGH URGENCY alert appears
   - "Escalating to supervisor" message
   - Dashboard shows urgent flag

---

## 🎯 Emotion Keywords (Built-in)

### Angry Keywords:
- frustrated
- angry
- problem
- nahi ho raha
- din se
- refund
- complaint

### Happy Keywords:
- thank you
- great
- good
- excellent
- dhanyavaad
- achha

### Urgent Keywords:
- urgent
- immediately
- abhi
- turant
- emergency
- help

---

## 🎨 Customization Guide

### Change Avatar Emoji
```javascript
// In frontend/pages/index.js, line ~120
const getAvatarEmoji = () => {
  switch(emotion) {
    case 'happy': return '😊';  // Change this
    case 'angry': return '😟';  // Change this
    case 'concerned': return '🤔';  // Change this
    default: return '🙂';  // Change this
  }
};
```

### Change Colors
```javascript
// In frontend/pages/index.js, line ~130
const getEmotionColor = () => {
  switch(emotion) {
    case 'happy': return '#51cf66';  // Green
    case 'angry': return '#ff6b6b';  // Red
    case 'concerned': return '#ffa500';  // Orange
    default: return '#4dabf7';  // Blue
  }
};
```

### Add More Responses
```javascript
// In frontend/pages/index.js, line ~40
const responses = {
  angry: [
    "Add your custom response here",
    "Another response",
  ],
  // ... add more
};
```

---

## 🐛 Troubleshooting

### Issue: Microphone not working
**Solution:** 
- Use Chrome browser (best support)
- Allow microphone permission when prompted
- Check if HTTPS or localhost (required for Web Speech API)

### Issue: Voice not speaking
**Solution:**
- Check browser volume
- Try different browser (Chrome recommended)
- Check if Text-to-Speech is enabled in browser settings

### Issue: Hindi not recognized
**Solution:**
- Speak clearly
- Check if Hindi language pack is installed
- Try English first to test

### Issue: npm install fails
**Solution:**
```bash
# Clear cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules

# Reinstall
npm install
```

---

## 📱 Browser Compatibility

| Browser | Speech Recognition | Text-to-Speech | Status |
|---------|-------------------|----------------|--------|
| Chrome | ✅ | ✅ | Recommended |
| Edge | ✅ | ✅ | Good |
| Firefox | ❌ | ✅ | Partial |
| Safari | ⚠️ | ✅ | Limited |

**Recommendation:** Use Chrome for demo

---

## 🎬 Demo Preparation Checklist

**Before Demo:**
- [ ] Test microphone
- [ ] Open frontend (localhost:3000)
- [ ] Open dashboard (separate tab)
- [ ] Test with sample phrases
- [ ] Check audio output
- [ ] Close unnecessary tabs
- [ ] Full screen mode ready

**During Demo:**
1. Show frontend first
2. Speak angry phrase
3. Show emotion change
4. Switch to dashboard
5. Show alert appeared
6. Explain business value

---

## 🔥 Pro Tips

1. **Practice phrases** - Memorize 2-3 demo phrases
2. **Speak clearly** - Enunciate for better recognition
3. **Show contrast** - Demo happy → angry → urgent
4. **Highlight animations** - Point out avatar changes
5. **Dashboard timing** - Switch at right moment
6. **Backup plan** - Have video recording ready

---

## 📞 Quick Commands

```bash
# Start frontend
cd frontend && npm run dev

# Check if running
curl http://localhost:3000

# Stop server
Ctrl + C

# Reinstall dependencies
rm -rf node_modules && npm install
```

---

## 🎯 What Makes This Special

✅ **Real Speech Recognition** - Not fake, actually works
✅ **Emotion Detection** - Smart keyword analysis
✅ **Animated Avatar** - Engaging visual feedback
✅ **Hindi Support** - India-first approach
✅ **Business Dashboard** - Shows practical value
✅ **Professional UI** - Production-ready design

---

## 🏆 Winning Strategy

**Your Advantage:**
1. Working demo (not just slides)
2. Visual impact (animated avatar)
3. Emotional intelligence (detects feelings)
4. Business value (dashboard proves ROI)
5. India-specific (Hindi language)

**Judges will see:**
- Technical execution ✅
- Problem-solution fit ✅
- Business viability ✅
- User experience ✅
- Innovation ✅

---

## 📝 Next Steps (If Time Permits)

**Enhancements:**
- [ ] Add more avatar animations
- [ ] Integrate backend API
- [ ] Add language toggle (Hindi/English)
- [ ] Improve emotion detection accuracy
- [ ] Add user authentication
- [ ] Mobile responsive design

**But for hackathon, current version is COMPLETE and DEMO-READY! 🚀**

---

**Good luck Arjun! You've got this! 💪**
