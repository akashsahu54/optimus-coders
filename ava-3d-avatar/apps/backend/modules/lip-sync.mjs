import { convertTextToSpeech } from "./elevenLabs.mjs";
import { getPhonemes } from "./rhubarbLipSync.mjs";
import { readJsonTranscript, audioFileToBase64 } from "../utils/files.mjs";

const MAX_RETRIES = 10;
const RETRY_DELAY = 0;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const lipSync = async ({ messages }) => {
  await Promise.all(
    messages.map(async (message, index) => {
      const fileName = `audios/message_${index}.mp3`;

      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          await convertTextToSpeech({ text: message.text, fileName });
          await delay(RETRY_DELAY);
          break;
        } catch (error) {
          console.error(`⚠️ Attempt ${attempt + 1}/${MAX_RETRIES} failed for message ${index}:`, error.message);
          
          if (error.message === 'AUTH_FAILED' || error.message === 'RATE_LIMITED') {
            console.error(`❌ Eleven Labs API limit reached. Skipping audio generation.`);
            message.audio = "";
            message.lipsync = { mouthCues: [] };
            break;
          }
          
          if (error.response && error.response.status === 429) {
            if (attempt < MAX_RETRIES - 1) {
              console.log(`⏳ Rate limited, retrying in ${RETRY_DELAY}ms...`);
              await delay(RETRY_DELAY);
            } else {
              console.error(`❌ Max retries reached. Eleven Labs quota exceeded.`);
              message.audio = "";
              message.lipsync = { mouthCues: [] };
              return;
            }
          } else if (attempt === MAX_RETRIES - 1) {
            console.error(`❌ Failed after ${MAX_RETRIES} attempts`);
            message.audio = "";
            message.lipsync = { mouthCues: [] };
            return;
          }
        }
      }
      console.log(`✅ Message ${index} converted to speech`);
    })
  );

  await Promise.all(
    messages.map(async (message, index) => {
      const fileName = `audios/message_${index}.mp3`;

      try {
        await getPhonemes({ message: index });
        message.audio = await audioFileToBase64({ fileName });
        message.lipsync = await readJsonTranscript({ fileName: `audios/message_${index}.json` });
      } catch (error) {
        console.error(`Error while getting phonemes for message ${index}:`, error);
      }
    })
  );

  return messages;
};

export { lipSync };
