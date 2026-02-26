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
          stability: 0.5,
          similarity_boost: 0.5,
          style: 1,
          use_speaker_boost: true
        }
      },
      responseType: 'arraybuffer'
    });

    fs.writeFileSync(absolutePath, response.data);
    console.log(`✅ Audio file created: ${absolutePath}`);
  } catch (error) {
    console.error(`❌ Error creating audio file:`, error.message);
    throw error;
  }
}

export { convertTextToSpeech };
