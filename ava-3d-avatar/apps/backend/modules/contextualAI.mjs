import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import dotenv from "dotenv";
import { conversationMemory } from "./conversationMemory.mjs";

dotenv.config();

/**
 * Contextual AI with conversation memory
 * Maintains smooth, natural conversations with context awareness
 */

const systemTemplate = `
You are AVA (AI Virtual Assistant), a helpful and empathetic customer support agent.
You are professional, friendly, and always ready to assist customers with their queries.
You understand emotions and respond appropriately to customer needs.

CONVERSATION CONTEXT:
{conversationContext}

IMPORTANT RULES:
- Use the conversation context to provide relevant, contextual responses
- Remember what the user has said previously in this conversation
- Maintain conversation flow naturally
- If the user refers to something mentioned earlier, acknowledge it
- Be concise but informative
- Show empathy and understanding

You will always respond with a JSON array of messages, with a maximum of 3 messages:
{format_instructions}

Each message has properties for text, facialExpression, and animation.
Facial expressions: smile, sad, angry, surprised, funnyFace, default
Animations: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry, 
Surprised, DismissingGesture, ThoughtfulHeadShake
`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["human", "{question}"],
]);

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY || "gsk_demo_key",
  model: "llama-3.3-70b-versatile",
  temperature: 0.3, // Slightly higher for more natural responses
});

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    messages: z.array(
      z.object({
        text: z.string().describe("Text to be spoken by the AI"),
        facialExpression: z
          .string()
          .describe(
            "Facial expression: smile, sad, angry, surprised, funnyFace, default"
          ),
        animation: z
          .string()
          .describe(
            "Animation: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry, Surprised, DismissingGesture, ThoughtfulHeadShake"
          ),
      })
    ),
  })
);

const contextualChain = prompt.pipe(model).pipe(parser);

/**
 * Chat with context awareness
 */
export const chatWithContext = async (userMessage, sessionId = "default") => {
  try {
    // Add user message to history
    conversationMemory.addMessage(sessionId, "user", userMessage);

    // Get conversation context
    const history = conversationMemory.getHistory(sessionId, 5); // Last 5 messages
    const conversationContext = history.length > 0
      ? history.map(msg => `${msg.role}: ${msg.content}`).join("\n")
      : "This is the start of the conversation.";

    // Generate response with context
    const response = await contextualChain.invoke({
      question: userMessage,
      conversationContext,
      format_instructions: parser.getFormatInstructions(),
    });

    // Add assistant response to history
    if (response.messages && response.messages.length > 0) {
      const assistantMessage = response.messages
        .map(msg => msg.text)
        .join(" ");
      conversationMemory.addMessage(sessionId, "assistant", assistantMessage);
    }

    return response;
  } catch (error) {
    console.error("Contextual chat error:", error);
    throw error;
  }
};

/**
 * Get conversation summary
 */
export const getConversationSummary = (sessionId) => {
  const stats = conversationMemory.getStats(sessionId);
  const history = conversationMemory.getHistory(sessionId);
  
  return {
    messageCount: stats.messageCount,
    duration: Math.round(stats.duration / 1000), // seconds
    lastMessage: history[history.length - 1]?.content || "No messages",
  };
};

/**
 * Clear conversation
 */
export const clearConversation = (sessionId) => {
  conversationMemory.clearSession(sessionId);
};

export { contextualChain, parser };
