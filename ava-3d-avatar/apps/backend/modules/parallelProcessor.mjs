import { chatWithContext } from "./contextualAI.mjs";
import { fastTextToSpeech } from "./streamingTTS.mjs";
import { lipSync } from "./lip-sync.mjs";
import { responseCache } from "./responseCache.mjs";
import { memoryManager } from "./memoryManager.mjs";

/**
 * Parallel processing for faster response
 * Multiple steps simultaneously execute hote hain
 * WITH context awareness and memory management
 */
export const processMessageParallel = async (userMessage, sessionId = "default") => {
  try {
    // Check cache first (only for non-contextual queries)
    const cacheKey = `${sessionId}:${userMessage}`;
    const cached = responseCache.get(cacheKey);
    if (cached && !cached.contextual) {
      console.log("✅ Cache hit - instant response!");
      return cached;
    }

    // Step 1: AI response with context awareness
    const aiResponse = await chatWithContext(userMessage, sessionId);
    
    if (!aiResponse || !aiResponse.messages || aiResponse.messages.length === 0) {
      throw new Error("Invalid AI response");
    }

    // Step 2: Parallel processing - sabhi messages ke liye simultaneously
    const processedMessages = await Promise.all(
      aiResponse.messages.map(async (message) => {
        try {
          // TTS and lip sync parallel mein chalao
          const [audioBuffer, _] = await Promise.all([
            fastTextToSpeech(message.text),
            Promise.resolve(), // Placeholder for any other parallel task
          ]);

          // Lip sync generate karo
          const lipsyncData = await lipSync(audioBuffer);

          return {
            text: message.text,
            audio: audioBuffer.toString("base64"),
            lipsync: lipsyncData,
            facialExpression: message.facialExpression || "smile",
            animation: message.animation || "talking",
          };
        } catch (error) {
          console.error("Message processing error:", error);
          return null;
        }
      })
    );

    const result = {
      messages: processedMessages.filter((msg) => msg !== null),
      sessionId,
      contextual: true,
    };

    // Cache the result (with session context)
    responseCache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error("Parallel processing error:", error);
    throw error;
  }
};

/**
 * Batch processing for multiple messages
 */
export const processBatch = async (messages) => {
  return Promise.all(messages.map((msg) => processMessageParallel(msg)));
};
