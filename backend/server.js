const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
let conversations = [];
let alerts = [];

// Emotion detection endpoint
app.post('/api/detect-emotion', (req, res) => {
  const { text } = req.body;
  
  // Simple keyword-based emotion detection
  // TODO: Integrate with Hume AI or ML model
  let emotion = 'neutral';
  let urgency = 'normal';
  
  const angryKeywords = ['frustrated', 'angry', 'din se', 'problem', 'nahi ho raha'];
  const urgentKeywords = ['urgent', 'immediately', 'abhi', 'turant', 'emergency'];
  
  const lowerText = text.toLowerCase();
  
  if (angryKeywords.some(keyword => lowerText.includes(keyword))) {
    emotion = 'angry';
  }
  
  if (urgentKeywords.some(keyword => lowerText.includes(keyword))) {
    urgency = 'urgent';
  }
  
  // Store conversation
  conversations.push({
    text,
    emotion,
    urgency,
    timestamp: new Date()
  });
  
  // Create alert if angry or urgent
  if (emotion === 'angry' || urgency === 'urgent') {
    alerts.push({
      text,
      emotion,
      urgency,
      timestamp: new Date()
    });
  }
  
  res.json({ emotion, urgency });
});

// Get dashboard stats
app.get('/api/stats', (req, res) => {
  const totalCalls = conversations.length;
  const angryCalls = conversations.filter(c => c.emotion === 'angry').length;
  const urgentCalls = conversations.filter(c => c.urgency === 'urgent').length;
  
  res.json({
    totalCalls,
    angryCalls,
    urgentCalls,
    resolvedCalls: Math.floor(totalCalls * 0.7) // Mock data
  });
});

// Get recent alerts
app.get('/api/alerts', (req, res) => {
  res.json(alerts.slice(-10).reverse());
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 AVA Backend running on port ${PORT}`);
});
