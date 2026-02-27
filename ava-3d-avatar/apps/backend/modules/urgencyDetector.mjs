import dotenv from "dotenv";

dotenv.config();

/**
 * Urgency Detector Module
 * 
 * Identifies urgent customer issues and determines escalation priority.
 * Uses multi-factor scoring based on:
 * - Urgency keywords (40% weight)
 * - Emotional intensity from sentiment (30% weight)
 * - Time-sensitive mentions (20% weight)
 * - Repeated contact patterns (10% weight)
 */

/**
 * Urgency keywords categorized by severity (customer service focused)
 */
const urgencyKeywords = {
  critical: ['emergency', 'urgent', 'immediately', 'asap', 'critical', 'now', 'right now', 'help me now', 'need help now'],
  high: ['soon', 'quickly', 'hurry', 'deadline', 'today', 'fast', 'need this resolved', 'need help', 'please help'],
  medium: ['when', 'how long', 'waiting', 'still waiting', 'can you help', 'need assistance']
};

/**
 * Time-sensitive patterns that indicate urgency (customer service scenarios)
 */
const timeSensitivePatterns = [
  /payment.*due/i,
  /payment.*today/i,
  /bill.*due/i,
  /service.*down/i,
  /service.*not.*working/i,
  /system.*not.*working/i,
  /outage/i,
  /deadline/i,
  /(expire|expires|expired)/i,
  /account.*locked/i,
  /account.*blocked/i,
  /can't.*access/i,
  /cannot.*access/i,
  /not.*working/i,
  /doesn't.*work/i,
  /won't.*work/i,
  /broken/i,
  /issue.*with/i,
  /problem.*with/i
];

/**
 * Detects urgency level in customer message
 * @param {Object} params
 * @param {string} params.text - Text to analyze
 * @param {Object} params.sentiment - Sentiment analysis result (optional)
 * @param {Array} params.conversationHistory - Previous messages
 * @param {Object} params.customerContext - CRM data if available
 * @returns {Promise<UrgencyResult>}
 */
export async function detectUrgency({ text, sentiment = null, conversationHistory = [], customerContext = null }) {
  try {
    const result = calculateUrgencyScore({ text, sentiment, conversationHistory, customerContext });
    
    // Categorize the type of urgency (before generating reasoning)
    result.category = categorizeUrgency(text, result.urgencyIndicators);
    
    // Add reasoning
    result.reasoning = generateReasoning(result);
    
    // Estimate response time based on urgency level
    result.estimatedResponseTime = getEstimatedResponseTime(result.level);
    
    console.log(`🚨 Urgency Detection: ${result.level} (score: ${result.score.toFixed(2)})`);
    if (result.requiresEscalation) {
      console.log(`⚠️  ESCALATION REQUIRED`);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Urgency detection failed:', error);
    // Return safe default on error
    return {
      level: 'medium',
      score: 0.5,
      urgencyIndicators: [],
      category: 'general',
      requiresEscalation: false,
      estimatedResponseTime: 300,
      reasoning: 'Error in urgency detection, defaulting to medium priority',
      error: error.message
    };
  }
}

/**
 * Calculates urgency score using multi-factor analysis
 * @param {Object} params
 * @returns {Object} Urgency result with score, level, and indicators
 */
function calculateUrgencyScore({ text, sentiment, conversationHistory, customerContext }) {
  let score = 0;
  const indicators = [];
  
  const lowerText = text.toLowerCase();
  
  // Factor 1: Urgency keywords (40% weight) - customer service focused
  for (const [level, keywords] of Object.entries(urgencyKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        const weight = level === 'critical' ? 0.35 : level === 'high' ? 0.25 : 0.15;
        score += weight;
        indicators.push(`keyword: ${keyword} (${level})`);
      }
    }
  }
  
  // Factor 2: Emotional intensity (30% weight)
  if (sentiment) {
    if (sentiment.primaryEmotion === 'angry') {
      score += 0.3 * sentiment.confidence;
      indicators.push(`high emotional intensity: anger (confidence: ${(sentiment.confidence * 100).toFixed(0)}%)`);
    } else if (sentiment.primaryEmotion === 'frustrated') {
      score += 0.2 * sentiment.confidence;
      indicators.push(`emotional intensity: frustration (confidence: ${(sentiment.confidence * 100).toFixed(0)}%)`);
    } else if (sentiment.primaryEmotion === 'confused') {
      score += 0.1 * sentiment.confidence;
      indicators.push(`emotional state: confusion (confidence: ${(sentiment.confidence * 100).toFixed(0)}%)`);
    }
  }
  
  // Factor 3: Time-sensitive mentions (25% weight) - higher for customer service
  let timeSensitiveCount = 0;
  for (const pattern of timeSensitivePatterns) {
    if (pattern.test(text)) {
      timeSensitiveCount++;
      indicators.push(`time-sensitive: ${pattern.source.replace(/\\/g, '')}`);
      if (timeSensitiveCount === 1) {
        score += 0.25; // First match gets full weight
      } else if (timeSensitiveCount === 2) {
        score += 0.1; // Second match gets bonus
      }
      if (timeSensitiveCount >= 2) break; // Max 2 patterns
    }
  }
  
  // Factor 4: Repeated contact (10% weight)
  if (conversationHistory && conversationHistory.length > 0) {
    const recentContacts = conversationHistory.filter(
      msg => Date.now() - msg.timestamp < 24 * 60 * 60 * 1000
    );
    if (recentContacts.length > 2) {
      score += 0.1;
      indicators.push(`repeated contact: ${recentContacts.length} times in 24h`);
    }
  }
  
  // Factor 5: Customer context (bonus factors)
  if (customerContext) {
    // VIP customer gets slight urgency boost
    if (customerContext.isVIP) {
      score += 0.05;
      indicators.push('VIP customer');
    }
    
    // Previous unresolved issues
    if (customerContext.openIssues > 0) {
      score += 0.05;
      indicators.push(`${customerContext.openIssues} open issues`);
    }
  }
  
  // Normalize score to 0-1 range
  score = Math.min(score, 1.0);
  
  // Categorize urgency level (adjusted thresholds for customer service)
  let level;
  if (score >= 0.75) level = 'critical';
  else if (score >= 0.5) level = 'high';
  else if (score >= 0.25) level = 'medium';
  else level = 'low';
  
  return {
    score,
    level,
    urgencyIndicators: indicators,
    requiresEscalation: score >= 0.5 // Lower threshold for customer service
  };
}

/**
 * Categorizes the type of urgency
 * @param {string} text - Message text
 * @param {Array} indicators - Detected indicators
 * @returns {string} Category
 */
function categorizeUrgency(text, indicators) {
  const lowerText = text.toLowerCase();
  
  // Check for emergency keywords
  if (lowerText.includes('emergency') || lowerText.includes('critical')) {
    return 'emergency';
  }
  
  // Check for time-sensitive issues
  if (indicators.some(i => i.includes('time-sensitive'))) {
    return 'time_sensitive';
  }
  
  // Check for complaint indicators
  const complaintKeywords = ['complaint', 'unhappy', 'dissatisfied', 'terrible', 'worst'];
  if (complaintKeywords.some(kw => lowerText.includes(kw))) {
    return 'complaint';
  }
  
  // Check for service issues
  const serviceKeywords = ['not working', 'broken', 'down', 'outage', 'problem'];
  if (serviceKeywords.some(kw => lowerText.includes(kw))) {
    return 'service_issue';
  }
  
  // Check for payment issues
  const paymentKeywords = ['payment', 'charge', 'bill', 'refund'];
  if (paymentKeywords.some(kw => lowerText.includes(kw))) {
    return 'payment';
  }
  
  return 'general';
}

/**
 * Generates human-readable reasoning for urgency determination
 * @param {Object} result - Urgency result
 * @returns {string} Reasoning text
 */
function generateReasoning(result) {
  const reasons = [];
  
  if (result.level === 'critical') {
    reasons.push('Critical urgency detected');
  } else if (result.level === 'high') {
    reasons.push('High urgency detected');
  } else if (result.level === 'medium') {
    reasons.push('Moderate urgency detected');
  } else {
    reasons.push('Low urgency detected');
  }
  
  if (result.urgencyIndicators.length > 0) {
    const keywordIndicators = result.urgencyIndicators.filter(i => i.startsWith('keyword:'));
    if (keywordIndicators.length > 0) {
      reasons.push(`${keywordIndicators.length} urgency keyword(s) found`);
    }
    
    const emotionalIndicators = result.urgencyIndicators.filter(i => i.includes('emotional'));
    if (emotionalIndicators.length > 0) {
      reasons.push('elevated emotional state detected');
    }
    
    const timeSensitive = result.urgencyIndicators.some(i => i.includes('time-sensitive'));
    if (timeSensitive) {
      reasons.push('time-sensitive issue identified');
    }
    
    const repeated = result.urgencyIndicators.some(i => i.includes('repeated contact'));
    if (repeated) {
      reasons.push('customer has contacted multiple times');
    }
  }
  
  if (result.requiresEscalation) {
    reasons.push('immediate escalation recommended');
  }
  
  return reasons.join('; ');
}

/**
 * Gets estimated response time based on urgency level
 * @param {string} level - Urgency level
 * @returns {number} Estimated response time in seconds
 */
function getEstimatedResponseTime(level) {
  switch (level) {
    case 'critical':
      return 10; // 10 seconds
    case 'high':
      return 60; // 1 minute
    case 'medium':
      return 300; // 5 minutes
    case 'low':
      return 900; // 15 minutes
    default:
      return 300;
  }
}

/**
 * Checks if escalation should be offered based on urgency
 * @param {Object} urgencyResult - Result from detectUrgency
 * @returns {boolean} Whether to offer escalation
 */
export function shouldOfferEscalation(urgencyResult) {
  return urgencyResult.requiresEscalation || 
         urgencyResult.level === 'critical' || 
         urgencyResult.level === 'high';
}

/**
 * Generates empathetic escalation message based on urgency (customer service focused)
 * @param {Object} urgencyResult - Result from detectUrgency
 * @returns {string} Escalation message
 */
export function generateEscalationMessage(urgencyResult) {
  if (urgencyResult.level === 'critical') {
    return "I completely understand how urgent this is for you. Let me connect you with one of our senior representatives right away who can give you their full attention.";
  } else if (urgencyResult.level === 'high') {
    return "I can see this is really important to you. Would you like me to connect you with a specialist who can personally assist you with this?";
  } else if (urgencyResult.category === 'payment') {
    return "I understand payment matters are important. Would you like to speak with our billing specialist who can help resolve this for you?";
  } else if (urgencyResult.category === 'service_issue') {
    return "I'm sorry you're experiencing this issue. Let me connect you with our technical support team who can help get this working for you.";
  } else {
    return "I'm here to help, but if you'd prefer to speak with one of our representatives, I'd be happy to connect you.";
  }
}

/**
 * Gets priority queue position based on urgency
 * @param {Object} urgencyResult - Result from detectUrgency
 * @returns {number} Queue priority (1 = highest)
 */
export function getQueuePriority(urgencyResult) {
  switch (urgencyResult.level) {
    case 'critical':
      return 1;
    case 'high':
      return 2;
    case 'medium':
      return 3;
    case 'low':
      return 4;
    default:
      return 3;
  }
}
