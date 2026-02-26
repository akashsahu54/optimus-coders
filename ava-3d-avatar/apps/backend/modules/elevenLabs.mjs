import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import axios from "axios";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
const voiceID = process.env.ELEVEN_LABS_VOICE_ID;
const modelID = process.env.ELEVEN_LABS_MODEL_ID;

async function convertTextToSpeech({ text, fileName }) {
  const absolutePath = path.resolve(process.cwd(), fileName);
  console.log(`Converting text to speech: "${text}"`);
  console.log(`Target file: ${absolutePath}`);
  console.log(`Using Voice ID: ${voiceID}`);
  console.log(`Using API Key: ${elevenLabsApiKey?.substring(0, 10)}...`);
  
  try {
    const response = await axios({
      method: 'post',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceID}`,
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': elevenLabsApiKey,
        'Content-Type': 'application/json',
      },
      data: {
        text: text,
        model_id: modelID,
        voice_settings: {
          stability: 0.75,              // Increased for smoother voice (0-1)
          similarity_boost: 0.75,       // Increased for better quality (0-1)
          style: 0.5,                   // Reduced for less dramatic (0-1)
          use_speaker_boost: true       // Enhance clarity
        }
      },
      responseType: 'arraybuffer'
    });

    fs.writeFileSync(absolutePath, response.data);
    console.log(`✅ Audio file created: ${absolutePath}`);
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      console.error(`❌ Eleven Labs API returned status: ${status}`);
      
      // Try to parse error response
      try {
        const errorText = Buffer.from(error.response.data).toString();
        console.error(`Error details: ${errorText}`);
      } catch (e) {
        console.error(`Error response data:`, error.response.data);
      }
      
      if (status === 401) {
        console.error(`❌ Eleven Labs API Error: Authentication failed`);
        console.error(`💡 Solution: Check your API key permissions at https://elevenlabs.io`);
        // Create a silent audio file as fallback
        const silentAudio = Buffer.from([]);
        fs.writeFileSync(absolutePath, silentAudio);
        throw new Error('AUTH_FAILED');
      } else if (status === 429) {
        console.error(`❌ Rate limit exceeded. Please wait before trying again.`);
        throw new Error('RATE_LIMITED');
      }
    }
    console.error(`❌ Error creating audio file:`, error.message);
    throw error;
  }
}

export { convertTextToSpeech };
