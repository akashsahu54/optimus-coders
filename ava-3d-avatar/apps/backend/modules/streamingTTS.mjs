import { ElevenLabsClient } from "elevenlabs";
import dotenv from "dotenv";

dotenv.config();

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_LABS_API_KEY,
});

/**
 * Streaming TTS - Audio chunks immediately return karta hai
 * Latency reduce hoti hai because user audio sunta hai jaise hi generate hota hai
 */
export const streamTextToSpeech = async (text, voiceId = "pNInz6obpgDQGcFmaJgB") => {
  try {
    const audioStream = await client.textToSpeech.convertAsStream(voiceId, {
      text,
      model_id: "eleven_turbo_v2_5", // Fastest model
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.75,
        use_speaker_boost: true,
      },
    });

    return audioStream;
  } catch (error) {
    console.error("Streaming TTS error:", error);
    throw error;
  }
};

/**
 * Fast TTS with optimized settings
 */
export const fastTextToSpeech = async (text, voiceId = "pNInz6obpgDQGcFmaJgB") => {
  try {
    const audio = await client.textToSpeech.convert(voiceId, {
      text,
      model_id: "eleven_turbo_v2_5", // Turbo model for speed
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.75,
        use_speaker_boost: true,
      },
      output_format: "mp3_44100_128", // Optimized format
    });

    const chunks = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  } catch (error) {
    console.error("Fast TTS error:", error);
    throw error;
  }
};
