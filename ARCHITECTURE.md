# AVA System Architecture

## 🏗 High-Level Flow

```
User speaks → Speech-to-Text → Emotion Detection → Avatar Response → Dashboard Update
```

## 📦 Components

### 1. Frontend (User Interface)
**Location:** `/frontend`
**Tech:** React.js / Next.js
**Responsibilities:**
- Voice input capture (Web Speech API)
- Avatar animation display
- Emotion badge display
- Conversation history
- Real-time UI updates

**Key Files:**
- `pages/index.js` - Main user interface
- `components/Avatar.js` - Avatar component (TODO)
- `utils/speech.js` - Speech recognition (TODO)

### 2. Backend (API & Processing)
**Location:** `/backend`
**Tech:** Node.js + Express
**Responsibilities:**
- Emotion detection API
- Conversation storage
- Alert generation
- Dashboard data aggregation

**Key Endpoints:**
- `POST /api/detect-emotion` - Analyze text emotion
- `GET /api/stats` - Dashboard statistics
- `GET /api/alerts` - Recent alerts

### 3. Dashboard (Admin Panel)
**Location:** `/dashboard`
**Tech:** HTML/CSS/JS (Vanilla)
**Responsibilities:**
- Display call statistics
- Show angry/urgent alerts
- Real-time updates
- Business intelligence

## 🔄 Data Flow

### User Interaction Flow:
1. User clicks "Speak" button
2. Browser captures audio (Web Speech API)
3. Audio → Text conversion
4. Text sent to backend `/api/detect-emotion`
5. Backend analyzes emotion (angry/calm/urgent)
6. Response sent back with emotion label
7. Frontend updates avatar expression
8. Avatar speaks response (Text-to-Speech)
9. Dashboard receives alert (if urgent/angry)

### Dashboard Update Flow:
1. Backend detects angry/urgent emotion
2. Alert stored in memory/database
3. Dashboard polls `/api/alerts` every 5 seconds
4. New alerts displayed in real-time
5. Statistics updated automatically

## 🎯 Emotion Detection Logic

**Current Implementation (Simple):**
```javascript
Angry Keywords: frustrated, angry, din se, problem, nahi ho raha
Urgent Keywords: urgent, immediately, abhi, turant, emergency
```

**Future Enhancement:**
- Integrate Hume AI API
- Train custom ML model
- Voice tone analysis
- Sentiment scoring

## 🚀 Deployment Strategy

### Development:
```bash
# Frontend
cd frontend && npm run dev

# Backend
cd backend && npm run dev

# Dashboard
Open dashboard/index.html in browser
```

### Production:
- Frontend: Vercel / Netlify
- Backend: Railway / Render
- Database: MongoDB / PostgreSQL

## 🎨 Avatar Integration Options

1. **Ready Player Me** (Recommended)
   - Easy integration
   - Customizable avatars
   - Free tier available

2. **Live2D**
   - More expressive
   - Requires more setup

3. **Custom SVG Animation**
   - Lightweight
   - Full control

## 📊 Tech Stack Summary

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend | React/Next.js | User interface |
| Backend | Node.js + Express | API server |
| Speech Input | Web Speech API | Voice capture |
| Speech Output | Web Speech API | Voice response |
| Emotion AI | Keyword-based (MVP) | Emotion detection |
| Dashboard | Vanilla JS | Admin panel |
| Styling | CSS-in-JS | UI design |

## 🏆 Demo Script

**For Judges:**

1. **Show User Interface**
   - "This is AVA, our AI Voice Avatar"
   - Click speak button
   - Say: "Main 3 din se call kar raha hoon!"

2. **Show Emotion Detection**
   - Avatar expression changes to concerned
   - Emotion badge shows "ANGRY"
   - Bot responds empathetically

3. **Show Dashboard**
   - Switch to dashboard tab
   - Show real-time alert appeared
   - Highlight statistics update

4. **Explain Impact**
   - "Traditional IVR can't do this"
   - "This reduces customer frustration"
   - "Business gets actionable insights"

## 🎯 Winning Points

✅ **Visual Impact** - Animated avatar catches attention
✅ **Real Problem** - IVR frustration is relatable
✅ **Business Value** - Dashboard shows ROI
✅ **Technical Depth** - Emotion AI + Voice processing
✅ **Scalability** - Clear architecture for growth

## 📝 TODO for Hackathon

**High Priority:**
- [ ] Integrate Web Speech API
- [ ] Add avatar animation
- [ ] Connect frontend to backend
- [ ] Test emotion detection
- [ ] Polish UI/UX

**Medium Priority:**
- [ ] Add Hindi language support
- [ ] Improve emotion keywords
- [ ] Add more conversation examples
- [ ] Dashboard real-time updates

**Low Priority:**
- [ ] Database integration
- [ ] User authentication
- [ ] Advanced ML model
- [ ] Mobile responsive design
