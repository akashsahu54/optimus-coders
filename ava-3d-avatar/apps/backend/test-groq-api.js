import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";

dotenv.config();

console.log("\n🧪 Testing Groq API Connection...\n");
console.log("API Key:", process.env.GROQ_API_KEY ? `${process.env.GROQ_API_KEY.substring(0, 20)}...` : "NOT FOUND");

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.2,
});

async function testGroq() {
  try {
    console.log("\n📤 Sending test message to Groq AI...");
    const response = await model.invoke("Say hello in one sentence.");
    console.log("\n✅ SUCCESS! Groq API is working!");
    console.log("\n📨 Response:", response.content);
    console.log("\n✅ Your Groq API key is valid and working correctly!\n");
  } catch (error) {
    console.error("\n❌ ERROR! Groq API test failed:");
    console.error("Error message:", error.message);
    console.error("\nPossible issues:");
    console.error("1. Invalid API key");
    console.error("2. API key expired or quota exceeded");
    console.error("3. Network connection issue");
    console.error("4. Groq service is down");
    console.error("\nPlease check your GROQ_API_KEY in the .env file\n");
  }
}

testGroq();
