import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { openAIChain, parser } from "./modules/openAI.mjs";
import { lipSync } from "./modules/lip-sync.mjs";
import { sendDefaultMessages, defaultResponse } from "./modules/defaultMessages.mjs";
import { convertAudioToText } from "./modules/whisper.mjs";

dotenv.config();

const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

app.get("/voices", async (req, res) => {
  res.send(await voice.getVoices(elevenLabsApiKey));
});

app.post("/tts", async (req, res) => {
  const userMessage = await req.body.message;
  console.log("\n" + "=".repeat(60));
  console.log(`💬 TEXT-TO-SPEECH REQUEST: "${userMessage}"`);
  console.log("=".repeat(60));
  
  const defaultMessages = await sendDefaultMessages({ userMessage });
  if (defaultMessages) {
    console.log(`✅ Sending default intro messages`);
    console.log("=".repeat(60) + "\n");
    res.send({ messages: defaultMessages });
    return;
  }
  
  let openAImessages;
  try {
    console.log(`🎯 Step 1: Processing with AI (Groq)...`);
    openAImessages = await openAIChain.invoke({
      question: userMessage,
      format_instructions: parser.getFormatInstructions(),
    });
    console.log(`✅ AI generated ${openAImessages.messages.length} message(s)`);
    console.log(`📝 AI Response Preview: "${openAImessages.messages[0]?.text?.substring(0, 100)}..."`);
  } catch (error) {
    console.error(`❌ AI processing failed:`, error.message);
    console.error(`❌ Error details:`, error);
    console.log(`⚠️  Using default response`);
    openAImessages = { messages: defaultResponse };
  }
  
  try {
    console.log(`🎯 Step 2: Generating speech and lip sync...`);
    openAImessages = await lipSync({ messages: openAImessages.messages });
    console.log(`✅ Text-to-speech pipeline completed!`);
    console.log("=".repeat(60) + "\n");
  } catch (error) {
    console.error(`❌ Lip sync failed:`, error.message);
  }
  
  res.send({ messages: openAImessages });
});

app.post("/sts", async (req, res) => {
  console.log("\n" + "=".repeat(60));
  console.log("🎤 SPEECH-TO-SPEECH REQUEST RECEIVED");
  console.log("=".repeat(60));
  
  const base64Audio = req.body.audio;
  console.log(`📊 Audio data size: ${base64Audio?.length || 0} characters (base64)`);
  
  const audioData = Buffer.from(base64Audio, "base64");
  console.log(`📊 Audio buffer size: ${audioData.length} bytes`);
  
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
  
  let openAImessages;
  try {
    console.log(`🎯 Step 2: Processing with AI (Groq)...`);
    openAImessages = await openAIChain.invoke({
      question: userMessage,
      format_instructions: parser.getFormatInstructions(),
    });
    console.log(`✅ AI generated ${openAImessages.messages.length} message(s)`);
    console.log(`📝 AI Response Preview: "${openAImessages.messages[0]?.text?.substring(0, 100)}..."`);
  } catch (error) {
    console.error(`❌ AI processing failed:`, error.message);
    console.error(`❌ Error details:`, error);
    console.log(`⚠️  Using default response`);
    openAImessages = { messages: defaultResponse };
  }
  
  try {
    console.log(`🎯 Step 3: Generating speech and lip sync...`);
    openAImessages = await lipSync({ messages: openAImessages.messages });
    console.log(`✅ Speech-to-speech pipeline completed!`);
    console.log("=".repeat(60) + "\n");
  } catch (error) {
    console.error(`❌ Lip sync failed:`, error.message);
  }
  
  res.send({ messages: openAImessages });
});

app.listen(port, () => {
  console.log(`\n🚀 AVA Backend Server Started!`);
  console.log(`📡 Server running on: http://localhost:${port}`);
  console.log(`✅ Groq AI (LLaMA 3.3 70B) - Ready`);
  console.log(`🎤 Eleven Labs TTS - Ready`);
  console.log(`💬 Ready to assist customers!\n`);
});
