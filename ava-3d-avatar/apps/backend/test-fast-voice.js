import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Test script for fast voice-to-voice endpoint
 */
async function testFastVoice() {
  console.log("🧪 Testing Fast Voice-to-Voice Endpoint\n");

  // Test with existing audio file
  const audioPath = path.join(__dirname, "audios", "message_0.wav");
  
  if (!fs.existsSync(audioPath)) {
    console.error("❌ Test audio file not found:", audioPath);
    console.log("💡 Record some audio first using the frontend");
    return;
  }

  const audioBuffer = fs.readFileSync(audioPath);
  const base64Audio = audioBuffer.toString("base64");

  console.log(`📊 Audio size: ${audioBuffer.length} bytes`);
  console.log(`📊 Base64 size: ${base64Audio.length} characters\n`);

  // Test 1: Fast endpoint
  console.log("Test 1: Fast Voice-to-Voice (/fast-v2v)");
  console.log("-".repeat(50));
  
  const startTime1 = Date.now();
  
  try {
    const response1 = await fetch("http://localhost:3000/fast-v2v", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audio: base64Audio }),
    });

    const data1 = await response1.json();
    const clientTime1 = Date.now() - startTime1;

    console.log(`✅ Status: ${response1.status}`);
    console.log(`⚡ Client time: ${clientTime1}ms`);
    console.log(`🚀 Server time: ${data1.processingTime}ms`);
    console.log(`💾 Cached: ${data1.cached || false}`);
    console.log(`📝 Messages: ${data1.messages?.length || 0}`);
    
    if (data1.messages?.[0]) {
      console.log(`📄 First message: "${data1.messages[0].text.substring(0, 80)}..."`);
    }
  } catch (error) {
    console.error(`❌ Error:`, error.message);
  }

  console.log("\n");

  // Test 2: Original endpoint for comparison
  console.log("Test 2: Original Endpoint (/sts) - For Comparison");
  console.log("-".repeat(50));
  
  const startTime2 = Date.now();
  
  try {
    const response2 = await fetch("http://localhost:3000/sts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audio: base64Audio }),
    });

    const data2 = await response2.json();
    const clientTime2 = Date.now() - startTime2;

    console.log(`✅ Status: ${response2.status}`);
    console.log(`⚡ Client time: ${clientTime2}ms`);
    console.log(`📝 Messages: ${data2.messages?.length || 0}`);
  } catch (error) {
    console.error(`❌ Error:`, error.message);
  }

  console.log("\n");

  // Test 3: Cache test (same query again)
  console.log("Test 3: Cache Test (Same Query)");
  console.log("-".repeat(50));
  
  const startTime3 = Date.now();
  
  try {
    const response3 = await fetch("http://localhost:3000/fast-v2v", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audio: base64Audio }),
    });

    const data3 = await response3.json();
    const clientTime3 = Date.now() - startTime3;

    console.log(`✅ Status: ${response3.status}`);
    console.log(`⚡ Client time: ${clientTime3}ms`);
    console.log(`🚀 Server time: ${data3.processingTime}ms`);
    console.log(`💾 Cached: ${data3.cached || false}`);
    
    if (data3.cached) {
      console.log(`🎉 Cache working! Response was instant!`);
    }
  } catch (error) {
    console.error(`❌ Error:`, error.message);
  }

  console.log("\n✅ Tests completed!\n");
}

// Run tests
testFastVoice().catch(console.error);
