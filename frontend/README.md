# 🚀 AVA Frontend - Quick Start

## ⚡ Installation

```bash
cd frontend
npm install
```

## 🎯 Run Development Server

```bash
npm run dev
```

Open: `http://localhost:5173`

## 📂 Project Structure

```
src/
├── pages/
│   ├── UserPage.jsx       # Voice Avatar Interface
│   └── AdminPage.jsx      # Admin Dashboard
├── components/
│   ├── Avatar.jsx         # Animated Avatar
│   ├── EmotionBadge.jsx   # Emotion Display
│   ├── VoiceButton.jsx    # Speak Button
│   ├── ChatWindow.jsx     # Conversation History
│   ├── StatCard.jsx       # Dashboard Stats
│   └── UrgentList.jsx     # Urgent Alerts
├── data/
│   └── dummyData.js       # Mock Data & Keywords
├── App.jsx                # Router Setup
└── main.jsx               # Entry Point
```

## 🎨 Features

✅ React + Vite + Tailwind CSS
✅ React Router (User & Admin pages)
✅ Speech Recognition (Web Speech API)
✅ Text-to-Speech (Hindi support)
✅ Emotion Detection (Keyword-based)
✅ Animated Avatar
✅ Real-time Dashboard
✅ Professional UI (Glassmorphism)

## 🎤 Test Demo

### User Page (/)
1. Click "Speak Now"
2. Say: "Main 3 din se call kar raha hoon!"
3. Watch emotion change to ANGRY
4. Avatar shakes and responds

### Admin Page (/admin)
1. View live statistics
2. See urgent alerts
3. Monitor performance metrics

## 🌐 Navigation

- **User Interface**: http://localhost:5173/
- **Admin Dashboard**: http://localhost:5173/admin

Use top navigation to switch between pages.

## 🎯 Browser Support

**Recommended:** Chrome (best Speech API support)

## 🚀 Build for Production

```bash
npm run build
npm run preview
```

## 💡 Tips

- Speak clearly for better recognition
- Use Chrome for full features
- Test with Hindi and English phrases
- Check console for errors

Happy Hacking! 🎉
