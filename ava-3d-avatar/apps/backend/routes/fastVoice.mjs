import express from "express";
import { transcribe } from "../modules/whisper.mjs";
import { processMessageParallel } from "../modules/parallelProcessor.mjs";
import { convertWebMToMP3Stream, validateAudioBuffer } from "../modules/optimizedAudio.mjs";
import PerformanceMonitor from "../modules/performanceMonitor.mjs";
import { sessionManager } from "../modules/sessionManager.mjs";
import { conversationMemory } from "../modules/conversationMemory.mjs";
import { memoryManager } from "../modules/memoryManager.mjs";

const router = express.Router();

/**
 * Fast Voice-to-Voice endpoint with session management
 * Optimized for minimum latency with context awareness
 */
router.post("/fast-v2v", async (req, res) => {
  const monitor = new PerformanceMonitor();
  monitor.start("total");
  
  try {
    const { audio, sessionId: clientSessionId, userId } = req.body;

    if (!audio) {
      return res.status(400).json({ error: "Audio data required" });
    }

    // Get or create session
    const session = sessionManager.getOrCreateSession(
      userId || clientSessionId,
      { userAgent: req.headers["user-agent"] }
    );
    const sessionId = session.id;

    // Step 1: Decode audio
    monitor.start("decode");
    const audioBuffer = Buffer.from(audio, "base64");
    validateAudioBuffer(audioBuffer);
    monitor.end("decode");

    // Step 2: Convert to MP3 (streaming)
    monitor.start("conversion");
    const mp3Buffer = await convertWebMToMP3Stream(audioBuffer);
    
    // Store in memory manager for potential reuse
    const audioId = memoryManager.storeAudioBuffer(
      `audio_${sessionId}_${Date.now()}`,
      mp3Buffer,
      60000 // 1 minute TTL
    );
    monitor.end("conversion");

    // Step 3: Transcribe (Whisper)
    monitor.start("transcription");
    const userMessage = await transcribe(mp3Buffer);
    monitor.end("transcription");
    
    if (!userMessage) {
      return res.status(400).json({ error: "Could not transcribe audio" });
    }

    console.log(`🎤 [${sessionId}] User: "${userMessage}"`);

    // Step 4: Process with parallel pipeline + context
    monitor.start("ai_processing");
    const response = await processMessageParallel(userMessage, sessionId);
    monitor.end("ai_processing");

    monitor.end("total");
    monitor.log();

    // Get session stats
    const sessionStats = sessionManager.getSessionStats(sessionId);

    res.json({
      ...response,
      sessionId,
      processingTime: monitor.get("total"),
      breakdown: monitor.getAll(),
      sessionStats,
    });
  } catch (error) {
    console.error("Fast V2V error:", error);
    res.status(500).json({
      error: "Processing failed",
      message: error.message,
    });
  }
});

/**
 * Streaming voice-to-voice endpoint
 * Audio chunks stream hote hain for lowest latency
 */
router.post("/stream-v2v", async (req, res) => {
  try {
    const { audio } = req.body;

    if (!audio) {
      return res.status(400).json({ error: "Audio data required" });
    }

    // Set headers for streaming
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Transfer-Encoding", "chunked");

    const audioBuffer = Buffer.from(audio, "base64");
    const mp3Buffer = await convertWebMToMP3Stream(audioBuffer);
    const userMessage = await transcribe(mp3Buffer);

    if (!userMessage) {
      return res.status(400).json({ error: "Could not transcribe audio" });
    }

    // Send transcription immediately
    res.write(JSON.stringify({ type: "transcription", text: userMessage }) + "\n");

    // Process and stream response
    const response = await processMessageParallel(userMessage);
    
    // Stream each message as it's ready
    for (const message of response.messages) {
      res.write(JSON.stringify({ type: "message", data: message }) + "\n");
    }

    res.end();
  } catch (error) {
    console.error("Stream V2V error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Pre-fetch next response
 * User ke bolne se pehle hi next response ready kar lo
 */
router.post("/prefetch", async (req, res) => {
  try {
    const { context, predictedQuery } = req.body;

    // Background mein process karo
    processMessageParallel(predictedQuery).catch(console.error);

    res.json({ status: "prefetching" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

/**
 * Get conversation history
 */
router.get("/conversation/:sessionId", (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = conversationMemory.getHistory(sessionId);
    const stats = conversationMemory.getStats(sessionId);

    res.json({
      sessionId,
      history,
      stats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Clear conversation
 */
router.delete("/conversation/:sessionId", (req, res) => {
  try {
    const { sessionId } = req.params;
    conversationMemory.clearSession(sessionId);
    sessionManager.endSession(sessionId);

    res.json({
      success: true,
      message: "Conversation cleared",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get session statistics
 */
router.get("/session/:sessionId/stats", (req, res) => {
  try {
    const { sessionId } = req.params;
    const stats = sessionManager.getSessionStats(sessionId);

    if (!stats) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all active sessions
 */
router.get("/sessions", (req, res) => {
  try {
    const overview = sessionManager.getAllSessionsOverview();
    res.json(overview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get memory statistics
 */
router.get("/memory/stats", (req, res) => {
  try {
    const stats = memoryManager.getStats();
    const report = memoryManager.getReport();

    res.json({
      stats,
      report,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Clear memory cache
 */
router.post("/memory/clear", (req, res) => {
  try {
    memoryManager.clearAll();
    
    res.json({
      success: true,
      message: "Memory cleared",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
