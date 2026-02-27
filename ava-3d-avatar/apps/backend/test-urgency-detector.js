import { detectUrgency, shouldOfferEscalation, generateEscalationMessage, getQueuePriority } from './modules/urgencyDetector.mjs';

/**
 * Test suite for Urgency Detector
 */

console.log('🧪 Testing Urgency Detector Module\n');
console.log('='.repeat(60));

// Test cases with different urgency levels
const testCases = [
  {
    name: 'Critical - Emergency keyword',
    text: 'This is an emergency! My account is locked and I need access immediately!',
    sentiment: { primaryEmotion: 'angry', confidence: 0.9 },
    expectedLevel: 'critical'
  },
  {
    name: 'High - Urgent with frustration',
    text: 'I need this resolved urgently. I have been waiting for hours!',
    sentiment: { primaryEmotion: 'frustrated', confidence: 0.85 },
    expectedLevel: 'high'
  },
  {
    name: 'High - Payment deadline',
    text: 'My payment is due today and the system is not working',
    sentiment: { primaryEmotion: 'frustrated', confidence: 0.7 },
    expectedLevel: 'high'
  },
  {
    name: 'Medium - Service issue',
    text: 'The service is not working properly. Can you help?',
    sentiment: { primaryEmotion: 'neutral', confidence: 0.6 },
    expectedLevel: 'medium'
  },
  {
    name: 'Medium - Waiting inquiry',
    text: 'How long will this take? I have been waiting.',
    sentiment: { primaryEmotion: 'confused', confidence: 0.7 },
    expectedLevel: 'medium'
  },
  {
    name: 'Low - General inquiry',
    text: 'Can you tell me about your services?',
    sentiment: { primaryEmotion: 'neutral', confidence: 0.8 },
    expectedLevel: 'low'
  },
  {
    name: 'Low - Positive feedback',
    text: 'Thank you for your help! Everything is working great.',
    sentiment: { primaryEmotion: 'happy', confidence: 0.9 },
    expectedLevel: 'low'
  },
  {
    name: 'Critical - Multiple urgency indicators',
    text: 'URGENT! My account expired and I need access now for a critical deadline!',
    sentiment: { primaryEmotion: 'angry', confidence: 0.95 },
    expectedLevel: 'critical'
  }
];

// Run tests
async function runTests() {
  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    console.log(`\n📝 Test: ${testCase.name}`);
    console.log(`   Input: "${testCase.text}"`);
    console.log(`   Sentiment: ${testCase.sentiment.primaryEmotion} (${(testCase.sentiment.confidence * 100).toFixed(0)}%)`);
    
    try {
      const result = await detectUrgency({
        text: testCase.text,
        sentiment: testCase.sentiment,
        conversationHistory: [],
        customerContext: null
      });
      
      console.log(`   Result: ${result.level} (score: ${result.score.toFixed(2)})`);
      console.log(`   Category: ${result.category}`);
      console.log(`   Escalation: ${result.requiresEscalation ? 'YES' : 'NO'}`);
      console.log(`   Response Time: ${result.estimatedResponseTime}s`);
      console.log(`   Indicators: ${result.urgencyIndicators.length}`);
      result.urgencyIndicators.forEach(ind => console.log(`      - ${ind}`));
      console.log(`   Reasoning: ${result.reasoning}`);
      
      // Check if result matches expected level
      if (result.level === testCase.expectedLevel) {
        console.log(`   ✅ PASS`);
        passed++;
      } else {
        console.log(`   ❌ FAIL - Expected ${testCase.expectedLevel}, got ${result.level}`);
        failed++;
      }
      
      // Test helper functions
      if (result.requiresEscalation) {
        const escalationMsg = generateEscalationMessage(result);
        console.log(`   💬 Escalation Message: "${escalationMsg}"`);
      }
      
      const priority = getQueuePriority(result);
      console.log(`   🎯 Queue Priority: ${priority}`);
      
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
      failed++;
    }
    
    console.log('-'.repeat(60));
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);
  console.log(`${'='.repeat(60)}\n`);
}

// Test with conversation history (repeated contact)
async function testRepeatedContact() {
  console.log('\n🔄 Testing Repeated Contact Detection\n');
  console.log('='.repeat(60));
  
  const conversationHistory = [
    { text: 'I need help with my account', timestamp: Date.now() - 2 * 60 * 60 * 1000 }, // 2 hours ago
    { text: 'Still waiting for help', timestamp: Date.now() - 1 * 60 * 60 * 1000 }, // 1 hour ago
    { text: 'This is the third time I am asking', timestamp: Date.now() - 30 * 60 * 1000 } // 30 min ago
  ];
  
  const result = await detectUrgency({
    text: 'I really need help now!',
    sentiment: { primaryEmotion: 'frustrated', confidence: 0.8 },
    conversationHistory,
    customerContext: null
  });
  
  console.log(`Result: ${result.level} (score: ${result.score.toFixed(2)})`);
  console.log(`Escalation Required: ${result.requiresEscalation ? 'YES' : 'NO'}`);
  console.log(`Indicators:`);
  result.urgencyIndicators.forEach(ind => console.log(`   - ${ind}`));
  console.log(`Reasoning: ${result.reasoning}`);
  console.log('='.repeat(60));
}

// Test with VIP customer context
async function testVIPCustomer() {
  console.log('\n👑 Testing VIP Customer Context\n');
  console.log('='.repeat(60));
  
  const customerContext = {
    isVIP: true,
    openIssues: 2
  };
  
  const result = await detectUrgency({
    text: 'I need assistance with my account',
    sentiment: { primaryEmotion: 'neutral', confidence: 0.7 },
    conversationHistory: [],
    customerContext
  });
  
  console.log(`Result: ${result.level} (score: ${result.score.toFixed(2)})`);
  console.log(`Escalation Required: ${result.requiresEscalation ? 'YES' : 'NO'}`);
  console.log(`Indicators:`);
  result.urgencyIndicators.forEach(ind => console.log(`   - ${ind}`));
  console.log(`Reasoning: ${result.reasoning}`);
  console.log('='.repeat(60));
}

// Run all tests
(async () => {
  await runTests();
  await testRepeatedContact();
  await testVIPCustomer();
  
  console.log('\n✅ All tests completed!\n');
})();
