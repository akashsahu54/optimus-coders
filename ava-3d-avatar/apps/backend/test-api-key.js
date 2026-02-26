import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.ELEVEN_LABS_API_KEY;

console.log('Testing Eleven Labs API Key...');
console.log('API Key:', apiKey);

async function testAPIKey() {
  try {
    // Test 1: Get available voices
    console.log('\n📋 Test 1: Fetching available voices...');
    const voicesResponse = await axios.get('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': apiKey
      }
    });
    console.log('✅ Success! Found', voicesResponse.data.voices.length, 'voices');
    
    // Test 2: Get user info
    console.log('\n👤 Test 2: Fetching user info...');
    const userResponse = await axios.get('https://api.elevenlabs.io/v1/user', {
      headers: {
        'xi-api-key': apiKey
      }
    });
    console.log('✅ Success! User info:');
    console.log('  - Character count:', userResponse.data.subscription.character_count);
    console.log('  - Character limit:', userResponse.data.subscription.character_limit);
    console.log('  - Remaining:', userResponse.data.subscription.character_limit - userResponse.data.subscription.character_count);
    
    console.log('\n🎉 API Key is valid and working!');
    
  } catch (error) {
    console.error('\n❌ API Key test failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testAPIKey();
