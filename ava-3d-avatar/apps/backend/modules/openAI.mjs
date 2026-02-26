import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const template = `
  You are AVA (AI Virtual Assistant), a helpful and empathetic customer support agent.
  You are professional, friendly, and always ready to assist customers with their queries.
  You understand emotions and respond appropriately to customer needs.
  
  IMPORTANT RULES:
  - Treat each conversation as completely independent. Do not reference or recall any previous conversations.
  - Only respond to the current question being asked.
  - When asked about yourself, explain that you are AVA, an AI Virtual Assistant powered by Groq AI and Eleven Labs.
  - Keep responses relevant to the question asked. Do not provide unrelated information.
  - Be concise and helpful in your responses.
  
  You will always respond with a JSON array of messages, with a maximum of 3 messages:
  \n{format_instructions}.
  Each message has properties for text, facialExpression, and animation.
  The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
  The different animations are: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry, 
  Surprised, DismissingGesture and ThoughtfulHeadShake.
`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", template],
  ["human", "{question}"],
]);

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY || "gsk_demo_key",
  model: "llama-3.3-70b-versatile",
  temperature: 0.2,
});

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    messages: z.array(
      z.object({
        text: z.string().describe("Text to be spoken by the AI"),
        facialExpression: z
          .string()
          .describe(
            "Facial expression to be used by the AI. Select from: smile, sad, angry, surprised, funnyFace, and default"
          ),
        animation: z
          .string()
          .describe(
            `Animation to be used by the AI. Select from: Idle, TalkingOne, TalkingThree, SadIdle, 
            Defeated, Angry, Surprised, DismissingGesture, and ThoughtfulHeadShake.`
          ),
      })
    ),
  })
);

const openAIChain = prompt.pipe(model).pipe(parser);

export { openAIChain, parser };
