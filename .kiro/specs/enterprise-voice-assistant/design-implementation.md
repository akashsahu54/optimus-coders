# Implementation Details (Continued from design.md)

## Real-Time Processing Pipeline

### Pipeline Flow

```
User Input → STT → Analysis Orchestrator → [Parallel Analysis] → Result Aggregation → Response Generation → TTS
                         ↓
                    ┌────┴────┬─────────┬──────────┐
                    ↓         ↓         ↓          ↓
              Sentiment  Urgency   Fraud    Context
              Analyzer   Detector  Detector  Manager
                    ↓         ↓         ↓          ↓
                    └────┬────┴─────────┴──────────┘
                         ↓
                  Database Logger
                         ↓
                  Alert Manager
```

### Parallel Processing Strategy

To minimize latency, the three analysis modules run in parallel:

```javascript
// In analysisOrchestrator.mjs
async function analyzeConversation({ userMessage, aiResponse, conversationId, conversationHistory, metadata }) {
  const startTime = Date.now();
  
  // Run all analyzers in parallel
  const [sentimentResult, urgencyResult, fraudResult] = await Promise.all([
    analyzeSentiment({ 
      text: userMessage, 
      conversationHistory, 
      language: metadata.language 
    }).catch(handleSentimentError),
    
    detectUrgency({ 
      text: userMessage, 
      conversationHistory, 
      customerContext: metadata.customerContext 
    }).catch(handleUrgencyError),
    
    detectFraud({ 
      text: userMessage, 
      conversationHistory, 
      conversationId, 
      customerContext: metadata.customerContext,
      metadata 
    }).catch(handleFraudError)
  ]);
  
  // Aggregate results
  const analysisResult = {
    sentiment: sentimentResult,
    urgency: urgencyResult,
    fraud: fraudResult,
    conversationId,
    timestamp: Date.now(),
    processingTime: Date.now() - startTime,
    requiresEscalation: urgencyResult.requiresEscalation || fraudResult.requiresVerification
  };
  
  // Async operations (don't block response)
  setImmediate(() => {
    logAnalysisToDatabase(analysisResult);
    processAlerts(analysisResult);
  });
  
  return analysisResult;
}
```


## ML/AI Models and APIs

### Sentiment Analysis Implementation

**Primary Approach**: Use Groq AI (LLaMA 3.3 70B) with specialized prompts

**Prompt Engineering**:
```javascript
const sentimentPrompt = `
Analyze the emotional tone of the following customer message.
Consider the context of previous messages if provided.

Customer Message: "{userMessage}"
Previous Context: {conversationHistory}
Language: {language}

Respond with a JSON object containing:
- primaryEmotion: one of [frustrated, happy, angry, neutral, confused]
- confidence: number between 0 and 1
- emotionScores: object with scores for each emotion
- valence: number between -1 (negative) and 1 (positive)
- arousal: number between 0 (calm) and 1 (excited)
- indicators: array of keywords/phrases that influenced the analysis

Be especially sensitive to:
- Frustration indicators: repetition, "still", "again", "why"
- Anger indicators: strong language, demands, threats
- Confusion indicators: questions, "don't understand", "unclear"
- Happiness indicators: thanks, appreciation, positive feedback
`;
```

**Fallback Approach**: Rule-based sentiment detection

```javascript
const sentimentRules = {
  frustrated: {
    keywords: ['frustrated', 'annoyed', 'irritated', 'still waiting', 'again', 'repeatedly'],
    patterns: [/why (is|are|do|does).*still/i, /how many times/i],
    weight: 0.7
  },
  angry: {
    keywords: ['angry', 'furious', 'unacceptable', 'terrible', 'worst', 'demand'],
    patterns: [/this is (ridiculous|unacceptable|terrible)/i],
    weight: 0.8
  },
  happy: {
    keywords: ['thank', 'thanks', 'appreciate', 'great', 'excellent', 'perfect', 'wonderful'],
    patterns: [/thank you/i, /thanks (so much|a lot)/i],
    weight: 0.6
  },
  confused: {
    keywords: ['confused', 'don\'t understand', 'unclear', 'what do you mean', 'explain'],
    patterns: [/what (does|do|is) .* mean/i, /i don't (understand|get)/i],
    weight: 0.7
  }
};
```

### Urgency Detection Implementation

**Multi-Factor Scoring**:

```javascript
function calculateUrgencyScore({ text, sentiment, conversationHistory, customerContext }) {
  let score = 0;
  const indicators = [];
  
  // Factor 1: Urgency keywords (40% weight)
  const urgencyKeywords = {
    critical: ['emergency', 'urgent', 'immediately', 'asap', 'critical', 'now'],
    high: ['soon', 'quickly', 'hurry', 'deadline', 'today'],
    medium: ['when', 'how long', 'waiting']
  };
  
  for (const [level, keywords] of Object.entries(urgencyKeywords)) {
    for (const keyword of keywords) {
      if (text.toLowerCase().includes(keyword)) {
        score += level === 'critical' ? 0.4 : level === 'high' ? 0.25 : 0.15;
        indicators.push(`keyword: ${keyword}`);
      }
    }
  }
  
  // Factor 2: Emotional intensity (30% weight)
  if (sentiment.primaryEmotion === 'angry') {
    score += 0.3 * sentiment.confidence;
    indicators.push('high emotional intensity: anger');
  } else if (sentiment.primaryEmotion === 'frustrated') {
    score += 0.2 * sentiment.confidence;
    indicators.push('emotional intensity: frustration');
  }
  
  // Factor 3: Time-sensitive mentions (20% weight)
  const timeSensitivePatterns = [
    /payment.*due/i,
    /service.*down/i,
    /outage/i,
    /deadline/i,
    /(expire|expires|expired)/i
  ];
  
  for (const pattern of timeSensitivePatterns) {
    if (pattern.test(text)) {
      score += 0.2;
      indicators.push(`time-sensitive: ${pattern.source}`);
      break;
    }
  }
  
  // Factor 4: Repeated contact (10% weight)
  const recentContacts = conversationHistory.filter(
    msg => Date.now() - msg.timestamp < 24 * 60 * 60 * 1000
  );
  if (recentContacts.length > 2) {
    score += 0.1;
    indicators.push(`repeated contact: ${recentContacts.length} times in 24h`);
  }
  
  // Normalize score to 0-1 range
  score = Math.min(score, 1.0);
  
  // Categorize
  let level;
  if (score >= 0.8) level = 'critical';
  else if (score >= 0.6) level = 'high';
  else if (score >= 0.3) level = 'medium';
  else level = 'low';
  
  return {
    score,
    level,
    indicators,
    requiresEscalation: score >= 0.6
  };
}
```


### Fraud Detection Implementation

**Pattern-Based Detection**:

```javascript
async function detectFraud({ text, conversationHistory, conversationId, customerContext, metadata }) {
  const indicators = [];
  let riskScore = 0;
  
  // Pattern 1: Inconsistent Information
  const inconsistencies = detectInconsistencies(conversationHistory, customerContext);
  if (inconsistencies.length > 0) {
    riskScore += 0.3;
    indicators.push({
      type: 'inconsistent_info',
      severity: 0.7,
      description: 'Customer provided conflicting information',
      evidence: inconsistencies
    });
  }
  
  // Pattern 2: Unusual Request Patterns
  const unusualRequests = [
    /change.*account.*details/i,
    /update.*phone.*number/i,
    /reset.*password/i,
    /transfer.*to.*different.*account/i
  ];
  
  for (const pattern of unusualRequests) {
    if (pattern.test(text)) {
      riskScore += 0.2;
      indicators.push({
        type: 'unusual_request',
        severity: 0.5,
        description: 'Request matches unusual pattern',
        evidence: { pattern: pattern.source, text }
      });
    }
  }
  
  // Pattern 3: Social Engineering Indicators
  const socialEngineeringKeywords = [
    'verify', 'confirm', 'urgent', 'immediately', 'security', 
    'account locked', 'suspicious activity'
  ];
  
  const keywordCount = socialEngineeringKeywords.filter(
    kw => text.toLowerCase().includes(kw)
  ).length;
  
  if (keywordCount >= 3) {
    riskScore += 0.4;
    indicators.push({
      type: 'social_engineering',
      severity: 0.8,
      description: 'Multiple social engineering keywords detected',
      evidence: { keywordCount, keywords: socialEngineeringKeywords }
    });
  }
  
  // Pattern 4: Rapid Information Requests
  const informationRequests = conversationHistory.filter(
    msg => /\b(what|tell|give|provide|send)\b.*\b(number|code|password|pin|otp)\b/i.test(msg.text)
  );
  
  if (informationRequests.length >= 2) {
    riskScore += 0.3;
    indicators.push({
      type: 'rapid_info_requests',
      severity: 0.6,
      description: 'Multiple requests for sensitive information',
      evidence: { count: informationRequests.length }
    });
  }
  
  // Pattern 5: Geographic/Device Anomalies
  if (customerContext && metadata.location) {
    const distanceFromUsual = calculateDistance(
      customerContext.usualLocation,
      metadata.location
    );
    
    if (distanceFromUsual > 1000) { // More than 1000km from usual location
      riskScore += 0.25;
      indicators.push({
        type: 'geographic_anomaly',
        severity: 0.5,
        description: 'Call from unusual geographic location',
        evidence: { distance: distanceFromUsual, location: metadata.location }
      });
    }
  }
  
  // Normalize risk score
  riskScore = Math.min(riskScore, 1.0);
  
  // Determine risk level
  let riskLevel;
  if (riskScore >= 0.8) riskLevel = 'critical';
  else if (riskScore >= 0.6) riskLevel = 'high';
  else if (riskScore >= 0.3) riskLevel = 'medium';
  else riskLevel = 'low';
  
  // Generate recommended actions
  const recommendedActions = generateFraudActions(riskLevel, indicators);
  
  return {
    riskScore,
    riskLevel,
    indicators,
    requiresVerification: riskScore >= 0.6,
    recommendedActions,
    anomalyDetails: {
      totalIndicators: indicators.length,
      highSeverityCount: indicators.filter(i => i.severity >= 0.7).length
    }
  };
}

function generateFraudActions(riskLevel, indicators) {
  const actions = [];
  
  if (riskLevel === 'critical' || riskLevel === 'high') {
    actions.push('Implement multi-factor authentication');
    actions.push('Request additional verification questions');
    actions.push('Flag account for manual review');
    actions.push('Limit transaction capabilities');
  }
  
  if (indicators.some(i => i.type === 'social_engineering')) {
    actions.push('Warn about phishing attempts');
    actions.push('Verify through alternative channel');
  }
  
  if (indicators.some(i => i.type === 'geographic_anomaly')) {
    actions.push('Verify location through SMS/email');
    actions.push('Check recent account activity');
  }
  
  return actions;
}
```


## Security and Privacy Considerations

### Data Encryption

**In Transit**:
- All API communications use TLS 1.3
- WebSocket connections for real-time updates use WSS (WebSocket Secure)
- Internal service communication uses mTLS (mutual TLS)

**At Rest**:
```javascript
import crypto from 'crypto';

class DataEncryption {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32 bytes
  }
  
  encrypt(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }
  
  decrypt(encryptedData, iv, authTag) {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }
}

// Usage in database operations
async function saveAnalysisRecord(analysisResult) {
  const encryption = new DataEncryption();
  
  // Encrypt sensitive fields
  const encryptedTranscript = encryption.encrypt(analysisResult.userMessage);
  const encryptedCustomerInfo = encryption.encrypt(analysisResult.customerInfo);
  
  await db.collection('analysis_records').insertOne({
    ...analysisResult,
    userMessage: encryptedTranscript,
    customerInfo: encryptedCustomerInfo,
    encrypted: true,
    encryptionVersion: '1.0'
  });
}
```

### PII Protection

**Data Minimization**:
- Only store necessary customer information
- Anonymize data for analytics aggregation
- Implement data retention policies (auto-delete after configured period)

**Access Control**:
```javascript
const accessLevels = {
  ANALYST: ['read:analytics', 'read:aggregated_data'],
  SUPERVISOR: ['read:analytics', 'read:conversations', 'read:alerts'],
  ADMIN: ['read:*', 'write:*', 'delete:*'],
  SYSTEM: ['read:*', 'write:*']
};

function checkPermission(user, action, resource) {
  const userPermissions = accessLevels[user.role] || [];
  const requiredPermission = `${action}:${resource}`;
  
  return userPermissions.some(perm => {
    if (perm.endsWith(':*')) {
      return requiredPermission.startsWith(perm.split(':')[0]);
    }
    return perm === requiredPermission;
  });
}
```

### Compliance Features

**GDPR/DPDP Compliance**:

```javascript
// Right to Access
async function exportCustomerData(customerId) {
  const conversations = await db.collection('analysis_records')
    .find({ 'customerInfo.customerId': customerId })
    .toArray();
  
  // Decrypt and format for export
  const encryption = new DataEncryption();
  const exportData = conversations.map(conv => ({
    timestamp: conv.timestamp,
    transcript: encryption.decrypt(conv.userMessage.encrypted, conv.userMessage.iv, conv.userMessage.authTag),
    sentiment: conv.sentiment,
    urgency: conv.urgency,
    // Exclude internal fraud detection details
  }));
  
  return exportData;
}

// Right to be Forgotten
async function deleteCustomerData(customerId) {
  // Delete all records
  await db.collection('analysis_records').deleteMany({
    'customerInfo.customerId': customerId
  });
  
  await db.collection('alerts').deleteMany({
    'customerInfo.customerId': customerId
  });
  
  // Log deletion for audit trail
  await db.collection('audit_log').insertOne({
    action: 'data_deletion',
    customerId,
    timestamp: new Date(),
    reason: 'customer_request'
  });
}

// Data Retention Policy
async function enforceRetentionPolicy() {
  const retentionDays = parseInt(process.env.DATA_RETENTION_DAYS) || 365;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
  
  const result = await db.collection('analysis_records').deleteMany({
    timestamp: { $lt: cutoffDate }
  });
  
  console.log(`Deleted ${result.deletedCount} records older than ${retentionDays} days`);
}
```

### Audit Logging

```javascript
async function logAuditEvent(event) {
  await db.collection('audit_log').insertOne({
    timestamp: new Date(),
    eventType: event.type,
    userId: event.userId,
    action: event.action,
    resource: event.resource,
    result: event.result,
    ipAddress: event.ipAddress,
    userAgent: event.userAgent,
    metadata: event.metadata
  });
}

// Usage
await logAuditEvent({
  type: 'data_access',
  userId: req.user.id,
  action: 'read',
  resource: 'conversation_analysis',
  result: 'success',
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  metadata: { conversationId: req.params.id }
});
```


## Integration with Existing System

### Modifying server.js

Add analysis pipeline to both `/tts` and `/sts` endpoints:

```javascript
import { analyzeConversation } from "./modules/analysisOrchestrator.mjs";
import { generateConversationId } from "./utils/helpers.mjs";

// Add conversation tracking
const activeConversations = new Map();

app.post("/tts", async (req, res) => {
  const userMessage = req.body.message;
  const conversationId = req.body.conversationId || generateConversationId();
  
  console.log("\n" + "=".repeat(60));
  console.log(`💬 TEXT-TO-SPEECH REQUEST: "${userMessage}"`);
  console.log(`🔑 Conversation ID: ${conversationId}`);
  console.log("=".repeat(60));
  
  // Get or initialize conversation history
  let conversationHistory = activeConversations.get(conversationId) || [];
  
  // Handle default messages
  const defaultMessages = await sendDefaultMessages({ userMessage });
  if (defaultMessages) {
    console.log(`✅ Sending default intro messages`);
    console.log("=".repeat(60) + "\n");
    res.send({ messages: defaultMessages, conversationId });
    return;
  }
  
  // Step 1: Analyze user input
  console.log(`🎯 Step 1: Analyzing user input...`);
  const analysisResult = await analyzeConversation({
    userMessage,
    conversationId,
    conversationHistory,
    metadata: {
      channel: 'text',
      language: 'hi',
      timestamp: Date.now()
    }
  });
  
  console.log(`✅ Analysis complete:`);
  console.log(`   Sentiment: ${analysisResult.sentiment.primaryEmotion} (${(analysisResult.sentiment.confidence * 100).toFixed(0)}%)`);
  console.log(`   Urgency: ${analysisResult.urgency.level} (score: ${analysisResult.urgency.score.toFixed(2)})`);
  console.log(`   Fraud Risk: ${analysisResult.fraud.riskLevel} (score: ${analysisResult.fraud.riskScore.toFixed(2)})`);
  
  // Step 2: Generate AI response
  let openAImessages;
  try {
    console.log(`🎯 Step 2: Processing with AI (Groq)...`);
    
    // Modify prompt based on analysis
    let contextualPrompt = userMessage;
    if (analysisResult.urgency.requiresEscalation) {
      contextualPrompt += "\n[SYSTEM: High urgency detected. Offer escalation to human agent.]";
    }
    if (analysisResult.sentiment.primaryEmotion === 'frustrated' || 
        analysisResult.sentiment.primaryEmotion === 'angry') {
      contextualPrompt += "\n[SYSTEM: Customer is frustrated/angry. Use empathetic tone.]";
    }
    if (analysisResult.fraud.requiresVerification) {
      contextualPrompt += "\n[SYSTEM: Fraud risk detected. Add verification questions naturally.]";
    }
    
    openAImessages = await openAIChain.invoke({
      question: contextualPrompt,
      format_instructions: parser.getFormatInstructions(),
    });
    console.log(`✅ AI generated ${openAImessages.messages.length} message(s)`);
  } catch (error) {
    console.error(`❌ AI processing failed:`, error.message);
    openAImessages = { messages: defaultResponse };
  }
  
  // Step 3: Generate speech and lip sync
  try {
    console.log(`🎯 Step 3: Generating speech and lip sync...`);
    openAImessages = await lipSync({ messages: openAImessages.messages });
    console.log(`✅ Text-to-speech pipeline completed!`);
  } catch (error) {
    console.error(`❌ Lip sync failed:`, error.message);
  }
  
  // Update conversation history
  conversationHistory.push({
    role: 'user',
    text: userMessage,
    timestamp: Date.now()
  });
  conversationHistory.push({
    role: 'assistant',
    text: openAImessages.messages[0]?.text,
    timestamp: Date.now()
  });
  activeConversations.set(conversationId, conversationHistory);
  
  console.log("=".repeat(60) + "\n");
  
  res.send({ 
    messages: openAImessages, 
    conversationId,
    analysis: {
      sentiment: analysisResult.sentiment.primaryEmotion,
      urgency: analysisResult.urgency.level,
      requiresEscalation: analysisResult.requiresEscalation
    }
  });
});

app.post("/sts", async (req, res) => {
  console.log("\n" + "=".repeat(60));
  console.log("🎤 SPEECH-TO-SPEECH REQUEST RECEIVED");
  console.log("=".repeat(60));
  
  const base64Audio = req.body.audio;
  const conversationId = req.body.conversationId || generateConversationId();
  
  console.log(`🔑 Conversation ID: ${conversationId}`);
  console.log(`📊 Audio data size: ${base64Audio?.length || 0} characters (base64)`);
  
  const audioData = Buffer.from(base64Audio, "base64");
  console.log(`📊 Audio buffer size: ${audioData.length} bytes`);
  
  // Get conversation history
  let conversationHistory = activeConversations.get(conversationId) || [];
  
  // Step 1: Convert speech to text
  let userMessage;
  try {
    console.log(`🎯 Step 1: Converting speech to text (Whisper)...`);
    userMessage = await convertAudioToText({ audioData });
    console.log(`✅ Transcription: "${userMessage}"`);
  } catch (error) {
    console.error(`❌ Speech-to-text failed:`, error.message);
    res.status(500).json({ error: "Speech recognition failed", details: error.message });
    return;
  }
  
  // Step 2: Analyze conversation
  console.log(`🎯 Step 2: Analyzing conversation...`);
  const analysisResult = await analyzeConversation({
    userMessage,
    conversationId,
    conversationHistory,
    metadata: {
      channel: 'voice',
      language: 'hi',
      timestamp: Date.now()
    }
  });
  
  console.log(`✅ Analysis complete:`);
  console.log(`   Sentiment: ${analysisResult.sentiment.primaryEmotion}`);
  console.log(`   Urgency: ${analysisResult.urgency.level}`);
  console.log(`   Fraud Risk: ${analysisResult.fraud.riskLevel}`);
  
  // Step 3: Generate AI response (with context from analysis)
  let openAImessages;
  try {
    console.log(`🎯 Step 3: Processing with AI (Groq)...`);
    
    let contextualPrompt = userMessage;
    if (analysisResult.urgency.requiresEscalation) {
      contextualPrompt += "\n[SYSTEM: High urgency. Offer escalation.]";
    }
    if (analysisResult.sentiment.primaryEmotion === 'frustrated' || 
        analysisResult.sentiment.primaryEmotion === 'angry') {
      contextualPrompt += "\n[SYSTEM: Use empathetic tone.]";
    }
    if (analysisResult.fraud.requiresVerification) {
      contextualPrompt += "\n[SYSTEM: Add verification questions.]";
    }
    
    openAImessages = await openAIChain.invoke({
      question: contextualPrompt,
      format_instructions: parser.getFormatInstructions(),
    });
    console.log(`✅ AI generated ${openAImessages.messages.length} message(s)`);
  } catch (error) {
    console.error(`❌ AI processing failed:`, error.message);
    openAImessages = { messages: defaultResponse };
  }
  
  // Step 4: Generate speech and lip sync
  try {
    console.log(`🎯 Step 4: Generating speech and lip sync...`);
    openAImessages = await lipSync({ messages: openAImessages.messages });
    console.log(`✅ Speech-to-speech pipeline completed!`);
  } catch (error) {
    console.error(`❌ Lip sync failed:`, error.message);
  }
  
  // Update conversation history
  conversationHistory.push({
    role: 'user',
    text: userMessage,
    timestamp: Date.now()
  });
  conversationHistory.push({
    role: 'assistant',
    text: openAImessages.messages[0]?.text,
    timestamp: Date.now()
  });
  activeConversations.set(conversationId, conversationHistory);
  
  console.log("=".repeat(60) + "\n");
  
  res.send({ 
    messages: openAImessages, 
    conversationId,
    analysis: {
      sentiment: analysisResult.sentiment.primaryEmotion,
      urgency: analysisResult.urgency.level,
      requiresEscalation: analysisResult.requiresEscalation
    }
  });
});
```


### Database Setup

**MongoDB Schema** (recommended for flexibility with analysis data):

```javascript
// Initialize MongoDB connection
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db('enterprise_voice_assistant');

// Create collections with indexes
await db.collection('analysis_records').createIndexes([
  { key: { conversationId: 1 } },
  { key: { timestamp: -1 } },
  { key: { 'sentiment.primaryEmotion': 1 } },
  { key: { 'urgency.level': 1 } },
  { key: { 'fraud.riskLevel': 1 } },
  { key: { 'customerInfo.customerId': 1 } }
]);

await db.collection('alerts').createIndexes([
  { key: { conversationId: 1 } },
  { key: { timestamp: -1 } },
  { key: { status: 1 } },
  { key: { severity: 1 } }
]);

await db.collection('analytics_aggregations').createIndexes([
  { key: { date: -1 } },
  { key: { period: 1 } }
]);
```

**PostgreSQL Alternative** (for relational data and complex queries):

```sql
-- Analysis Records Table
CREATE TABLE analysis_records (
  id SERIAL PRIMARY KEY,
  conversation_id VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  channel VARCHAR(50),
  language VARCHAR(10),
  user_message_encrypted TEXT,
  user_message_iv VARCHAR(255),
  user_message_auth_tag VARCHAR(255),
  ai_response TEXT,
  sentiment_emotion VARCHAR(50),
  sentiment_confidence DECIMAL(3,2),
  sentiment_valence DECIMAL(3,2),
  sentiment_arousal DECIMAL(3,2),
  urgency_level VARCHAR(20),
  urgency_score DECIMAL(3,2),
  urgency_requires_escalation BOOLEAN,
  fraud_risk_score DECIMAL(3,2),
  fraud_risk_level VARCHAR(20),
  fraud_requires_verification BOOLEAN,
  customer_id VARCHAR(255),
  escalated BOOLEAN DEFAULT FALSE,
  escalation_timestamp TIMESTAMP,
  INDEX idx_conversation_id (conversation_id),
  INDEX idx_timestamp (timestamp),
  INDEX idx_sentiment (sentiment_emotion),
  INDEX idx_urgency (urgency_level),
  INDEX idx_fraud (fraud_risk_level),
  INDEX idx_customer (customer_id)
);

-- Alerts Table
CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  alert_id VARCHAR(255) UNIQUE NOT NULL,
  conversation_id VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  type VARCHAR(50),
  severity VARCHAR(20),
  title VARCHAR(255),
  description TEXT,
  status VARCHAR(50) DEFAULT 'open',
  assigned_to VARCHAR(255),
  resolved_at TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES analysis_records(conversation_id)
);

-- Analytics Aggregations Table
CREATE TABLE analytics_aggregations (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  period VARCHAR(20),
  total_conversations INT,
  sentiment_frustrated INT,
  sentiment_happy INT,
  sentiment_angry INT,
  sentiment_neutral INT,
  sentiment_confused INT,
  urgency_low INT,
  urgency_medium INT,
  urgency_high INT,
  urgency_critical INT,
  fraud_flagged INT,
  alerts_total INT,
  UNIQUE(date, period)
);
```

### Analytics API Implementation

```javascript
// apps/backend/routes/analytics.mjs
import express from 'express';
const router = express.Router();

// Get conversation analysis by ID
router.get('/conversation/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    const records = await db.collection('analysis_records')
      .find({ conversationId })
      .sort({ timestamp: 1 })
      .toArray();
    
    if (records.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    res.json({
      conversationId,
      messageCount: records.length,
      records: records.map(r => ({
        timestamp: r.timestamp,
        userMessage: r.userMessage, // Will be encrypted
        sentiment: r.sentiment,
        urgency: r.urgency,
        fraud: r.fraud
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get aggregated sentiment metrics
router.get('/sentiment', async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    const matchStage = {};
    if (startDate || endDate) {
      matchStage.timestamp = {};
      if (startDate) matchStage.timestamp.$gte = new Date(startDate);
      if (endDate) matchStage.timestamp.$lte = new Date(endDate);
    }
    
    const groupByFormat = groupBy === 'hour' ? '%Y-%m-%d %H:00' :
                          groupBy === 'week' ? '%Y-W%V' :
                          groupBy === 'month' ? '%Y-%m' :
                          '%Y-%m-%d';
    
    const results = await db.collection('analysis_records').aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: groupByFormat, date: '$timestamp' } },
            emotion: '$sentiment.primaryEmotion'
          },
          count: { $sum: 1 },
          avgConfidence: { $avg: '$sentiment.confidence' },
          avgValence: { $avg: '$sentiment.valence' },
          avgArousal: { $avg: '$sentiment.arousal' }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]).toArray();
    
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get urgency statistics
router.get('/urgency', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchStage = {};
    if (startDate || endDate) {
      matchStage.timestamp = {};
      if (startDate) matchStage.timestamp.$gte = new Date(startDate);
      if (endDate) matchStage.timestamp.$lte = new Date(endDate);
    }
    
    const stats = await db.collection('analysis_records').aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$urgency.level',
          count: { $sum: 1 },
          avgScore: { $avg: '$urgency.score' },
          escalationCount: {
            $sum: { $cond: ['$urgency.requiresEscalation', 1, 0] }
          }
        }
      }
    ]).toArray();
    
    const total = stats.reduce((sum, s) => sum + s.count, 0);
    const escalationRate = stats.reduce((sum, s) => sum + s.escalationCount, 0) / total;
    
    res.json({
      byLevel: stats,
      total,
      escalationRate: escalationRate.toFixed(3)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get fraud detection summary
router.get('/fraud', async (req, res) => {
  try {
    const { startDate, endDate, riskLevel } = req.query;
    
    const matchStage = {};
    if (startDate || endDate) {
      matchStage.timestamp = {};
      if (startDate) matchStage.timestamp.$gte = new Date(startDate);
      if (endDate) matchStage.timestamp.$lte = new Date(endDate);
    }
    if (riskLevel) {
      matchStage['fraud.riskLevel'] = riskLevel;
    }
    
    const stats = await db.collection('analysis_records').aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$fraud.riskLevel',
          count: { $sum: 1 },
          avgRiskScore: { $avg: '$fraud.riskScore' },
          verificationRequired: {
            $sum: { $cond: ['$fraud.requiresVerification', 1, 0] }
          }
        }
      }
    ]).toArray();
    
    const indicatorStats = await db.collection('analysis_records').aggregate([
      { $match: matchStage },
      { $unwind: '$fraud.indicators' },
      {
        $group: {
          _id: '$fraud.indicators.type',
          count: { $sum: 1 },
          avgSeverity: { $avg: '$fraud.indicators.severity' }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();
    
    res.json({
      byRiskLevel: stats,
      topIndicators: indicatorStats.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get real-time dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const [
      totalConversations,
      sentimentDistribution,
      urgencyDistribution,
      activeAlerts,
      recentHighRiskFraud
    ] = await Promise.all([
      db.collection('analysis_records').countDocuments({
        timestamp: { $gte: last24Hours }
      }),
      
      db.collection('analysis_records').aggregate([
        { $match: { timestamp: { $gte: last24Hours } } },
        { $group: { _id: '$sentiment.primaryEmotion', count: { $sum: 1 } } }
      ]).toArray(),
      
      db.collection('analysis_records').aggregate([
        { $match: { timestamp: { $gte: last24Hours } } },
        { $group: { _id: '$urgency.level', count: { $sum: 1 } } }
      ]).toArray(),
      
      db.collection('alerts').countDocuments({
        status: 'open',
        timestamp: { $gte: last24Hours }
      }),
      
      db.collection('analysis_records').find({
        'fraud.riskLevel': { $in: ['high', 'critical'] },
        timestamp: { $gte: last24Hours }
      }).limit(10).toArray()
    ]);
    
    res.json({
      period: 'last_24_hours',
      totalConversations,
      sentiment: sentimentDistribution,
      urgency: urgencyDistribution,
      activeAlerts,
      highRiskFraud: recentHighRiskFraud.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get alert history
router.get('/alerts', async (req, res) => {
  try {
    const { status, type, limit = 50 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    
    const alerts = await db.collection('alerts')
      .find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .toArray();
    
    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

