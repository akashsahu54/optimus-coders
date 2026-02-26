/**
 * Speech-to-Speech Test Script
 * Tests the complete STS pipeline without requiring frontend
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testSpeechToSpeech() {
  log('\n🧪 Starting Speech-to-Speech Test Suite\n', 'cyan');

  // Test 1: Check environment variables
  log('Test 1: Checking Environment Variables...', 'blue');
  const requiredEnvVars = [
    'OPENAI_API_KEY',
    'GROQ_API_KEY',
    'ELEVEN_LABS_API_KEY',
    'ELEVEN_LABS_VOICE_ID',
    'ELEVEN_LABS_MODEL_ID'
  ];

  let envCheckPassed = true;
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      log(`  ✅ ${envVar}: Set`, 'green');
    } else {
      log(`  ❌ ${envVar}: Missing`, 'red');
      envCheckPassed = false;
    }
  }

  if (!envCheckPassed) {
    log('\n❌ Environment check failed. Please set all required variables in .env', 'red');
    return;
  }

  // Test 2: Check required executables
  log('\nTest 2: Checking Required Executables...', 'blue');
  const executables = [
    { name: 'FFmpeg', path: 'ffmpeg.exe' },
    { name: 'Rhubarb', path: 'rhubarb.exe' }
  ];

  let execCheckPassed = true;
  for (const exec of executables) {
    const fullPath = path.join(process.cwd(), exec.path);
    if (fs.existsSync(fullPath)) {
      log(`  ✅ ${exec.name}: Found at ${exec.path}`, 'green');
    } else {
      log(`  ❌ ${exec.name}: Not found at ${exec.path}`, 'red');
      execCheckPassed = false;
    }
  }

  if (!execCheckPassed) {
    log('\n⚠️  Some executables are missing. Speech-to-speech may not work fully.', 'yellow');
  }

  // Test 3: Check audio directory
  log('\nTest 3: Checking Audio Directory...', 'blue');
  const audioDir = path.join(process.cwd(), 'audios');
  if (fs.existsSync(audioDir)) {
    log(`  ✅ Audio directory exists: ${audioDir}`, 'green');
    const files = fs.readdirSync(audioDir);
    log(`  📁 Contains ${files.length} files`, 'cyan');
  } else {
    log(`  ⚠️  Audio directory not found. Creating...`, 'yellow');
    fs.mkdirSync(audioDir, { recursive: true });
    log(`  ✅ Created: ${audioDir}`, 'green');
  }

  // Test 4: Test Text-to-Speech
  log('\nTest 4: Testing Text-to-Speech (ElevenLabs)...', 'blue');
  try {
    const { convertTextToSpeech } = await import('./modules/elevenLabs.mjs');
    const testText = 'Hello, this is a test of the text to speech system.';
    const testFile = 'audios/test_output.mp3';
    
    log(`  🎤 Converting: "${testText}"`, 'cyan');
    await convertTextToSpeech({ text: testText, fileName: testFile });
    
    if (fs.existsSync(testFile)) {
      const stats = fs.statSync(testFile);
      log(`  ✅ Audio file created: ${testFile} (${stats.size} bytes)`, 'green');
    } else {
      log(`  ❌ Audio file not created`, 'red');
    }
  } catch (error) {
    log(`  ❌ TTS Error: ${error.message}`, 'red');
    if (error.message === 'AUTH_FAILED') {
      log(`  💡 Check your ElevenLabs API key permissions`, 'yellow');
    }
  }

  // Test 5: Test Lip Sync Generation
  log('\nTest 5: Testing Lip Sync Generation (Rhubarb)...', 'blue');
  try {
    const { getPhonemes } = await import('./modules/rhubarbLipSync.mjs');
    const testAudioFile = 'audios/test_output.mp3';
    
    if (fs.existsSync(testAudioFile)) {
      log(`  🎬 Generating phonemes for test audio...`, 'cyan');
      await getPhonemes({ message: 'test_output' });
      
      const jsonFile = 'audios/test_output.json';
      if (fs.existsSync(jsonFile)) {
        const lipsyncData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
        log(`  ✅ Lip sync data generated: ${lipsyncData.mouthCues?.length || 0} mouth cues`, 'green');
      } else {
        log(`  ❌ Lip sync JSON not created`, 'red');
      }
    } else {
      log(`  ⚠️  Skipping (no test audio file)`, 'yellow');
    }
  } catch (error) {
    log(`  ❌ Lip Sync Error: ${error.message}`, 'red');
  }

  // Test 6: Test AI Response Generation
  log('\nTest 6: Testing AI Response (Groq)...', 'blue');
  try {
    const { openAIChain, parser } = await import('./modules/openAI.mjs');
    const testQuestion = 'Who are you?';
    
    log(`  🤖 Asking: "${testQuestion}"`, 'cyan');
    const response = await openAIChain.invoke({
      question: testQuestion,
      format_instructions: parser.getFormatInstructions(),
    });
    
    if (response && response.messages && response.messages.length > 0) {
      log(`  ✅ AI Response received: ${response.messages.length} message(s)`, 'green');
      log(`  💬 First message: "${response.messages[0].text.substring(0, 50)}..."`, 'cyan');
      log(`  😊 Expression: ${response.messages[0].facialExpression}`, 'cyan');
      log(`  🎭 Animation: ${response.messages[0].animation}`, 'cyan');
    } else {
      log(`  ❌ Invalid response format`, 'red');
    }
  } catch (error) {
    log(`  ❌ AI Error: ${error.message}`, 'red');
  }

  // Test 7: Test Complete Pipeline
  log('\nTest 7: Testing Complete STS Pipeline...', 'blue');
  try {
    const { openAIChain, parser } = await import('./modules/openAI.mjs');
    const { lipSync } = await import('./modules/lip-sync.mjs');
    
    log(`  🔄 Running full pipeline...`, 'cyan');
    
    // Get AI response
    const aiResponse = await openAIChain.invoke({
      question: 'Say hello in a friendly way',
      format_instructions: parser.getFormatInstructions(),
    });
    
    // Generate audio and lip sync
    const finalMessages = await lipSync({ messages: aiResponse.messages });
    
    if (finalMessages && finalMessages.length > 0) {
      const firstMsg = finalMessages[0];
      log(`  ✅ Pipeline completed successfully!`, 'green');
      log(`  📝 Text: ${firstMsg.text}`, 'cyan');
      log(`  🎵 Audio: ${firstMsg.audio ? `${firstMsg.audio.length} chars (base64)` : 'None'}`, 'cyan');
      log(`  👄 Lip sync: ${firstMsg.lipsync?.mouthCues?.length || 0} cues`, 'cyan');
    } else {
      log(`  ❌ Pipeline failed to produce messages`, 'red');
    }
  } catch (error) {
    log(`  ❌ Pipeline Error: ${error.message}`, 'red');
  }

  // Summary
  log('\n' + '='.repeat(60), 'cyan');
  log('📊 Test Summary', 'cyan');
  log('='.repeat(60), 'cyan');
  log('✅ Environment variables: ' + (envCheckPassed ? 'PASS' : 'FAIL'), envCheckPassed ? 'green' : 'red');
  log('✅ Executables: ' + (execCheckPassed ? 'PASS' : 'WARN'), execCheckPassed ? 'green' : 'yellow');
  log('\n💡 Next Steps:', 'yellow');
  log('  1. Start the backend server: node server.js', 'cyan');
  log('  2. Start the frontend: npm run dev', 'cyan');
  log('  3. Click the microphone button and speak', 'cyan');
  log('  4. Watch the avatar respond with speech!\n', 'cyan');
}

// Run tests
testSpeechToSpeech().catch(error => {
  log(`\n❌ Test suite failed: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
