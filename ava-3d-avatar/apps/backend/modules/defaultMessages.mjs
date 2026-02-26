import { audioFileToBase64, readJsonTranscript } from "../utils/files.mjs";
import dotenv from "dotenv";
dotenv.config();

const openAIApiKey = process.env.OPENAI_API_KEY;
const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;

async function sendDefaultMessages({ userMessage }) {
  let messages;
  if (!userMessage) {
    messages = [
      {
        text: "Hello! I'm AVA, your AI Virtual Assistant.",
        audio: await audioFileToBase64({ fileName: "audios/intro_0.wav" }),
        lipsync: await readJsonTranscript({ fileName: "audios/intro_0.json" }),
        facialExpression: "smile",
        animation: "TalkingOne",
      },
      {
        text: "I'm here to help you with any questions or concerns you may have. How can I assist you today?",
        audio: await audioFileToBase64({ fileName: "audios/intro_1.wav" }),
        lipsync: await readJsonTranscript({ fileName: "audios/intro_1.json" }),
        facialExpression: "smile",
        animation: "TalkingTwo",
      },
    ];
    return messages;
  }
  if (!elevenLabsApiKey) {
    messages = [
      {
        text: "Please configure your API keys to enable voice responses.",
        audio: await audioFileToBase64({ fileName: "audios/api_0.wav" }),
        lipsync: await readJsonTranscript({ fileName: "audios/api_0.json" }),
        facialExpression: "default",
        animation: "TalkingThree",
      },
      {
        text: "Check the .env file in the backend folder and add your Groq and Eleven Labs API keys.",
        audio: await audioFileToBase64({ fileName: "audios/api_1.wav" }),
        lipsync: await readJsonTranscript({ fileName: "audios/api_1.json" }),
        facialExpression: "smile",
        animation: "TalkingOne",
      },
    ];
    return messages;
  }
}

const defaultResponse = [
  {
    text: "I apologize, but I'm having trouble processing your request. Could you please rephrase your question?",
    facialExpression: "sad",
    animation: "Idle",
  },
];

export { sendDefaultMessages, defaultResponse };
