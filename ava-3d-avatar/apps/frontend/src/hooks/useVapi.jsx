import { createContext, useContext, useEffect, useState, useRef } from "react";
import Vapi from "@vapi-ai/web";

const VapiContext = createContext();

export const VapiProvider = ({ children }) => {
  const [vapi, setVapi] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [error, setError] = useState(null);
  
  const messageQueueRef = useRef([]);

  // Initialize Vapi
  useEffect(() => {
    const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    
    if (!publicKey || publicKey === 'your_vapi_public_key_here') {
      console.warn("⚠️ Vapi public key not configured. Please add VITE_VAPI_PUBLIC_KEY to .env");
      return;
    }
    
    const vapiInstance = new Vapi(publicKey);
    setVapi(vapiInstance);
    
    // Make it globally accessible for ChatWindow
    window.vapiGlobalInstance = vapiInstance;

    // Event listeners
    vapiInstance.on("call-start", () => {
      console.log("📞 Vapi call started");
      setIsCallActive(true);
      setError(null);
    });

    vapiInstance.on("call-end", () => {
      console.log("📞 Vapi call ended");
      setIsCallActive(false);
      setIsSpeaking(false);
      setTranscript("");
      
      // Check if it was an unexpected disconnect (not user initiated)
      if (window.vapiShouldReconnect) {
        console.log("🔄 Attempting to reconnect...");
        setTimeout(() => {
          if (window.vapiShouldReconnect) {
            console.log("🔄 Reconnecting Vapi call...");
            vapiInstance.start({
              model: {
                provider: "groq",
                model: "llama-3.3-70b-versatile",
                messages: [
                  {
                    role: "system",
                    content: `You are AVA, a world-class customer service representative known for exceptional empathy, problem-solving, and professionalism.

CRITICAL LANGUAGE RULE:
- You MUST detect and respond in the EXACT SAME LANGUAGE the customer is using
- If customer speaks Hindi (हिंदी), respond ONLY in Hindi with Devanagari script
- If customer speaks English, respond ONLY in English
- If customer speaks Marathi (मराठी), respond ONLY in Marathi
- NEVER translate or switch languages unless explicitly asked
- Match the customer's language 100% - this is your top priority

CORE EXCELLENCE PRINCIPLES:
🎯 Customer-First Mindset: Every interaction is an opportunity to create a positive experience
💝 Genuine Empathy: Understand and validate emotions before solving problems
🚀 Proactive Service: Anticipate needs and offer solutions before being asked
🤝 Build Trust: Be honest, transparent, and reliable in every interaction
✨ Create Delight: Go beyond expectations to surprise and delight customers

EMOTIONAL INTELLIGENCE:
- Active listening and empathy first
- Validate feelings before solving
- Stay calm and positive
- Celebrate successes with customers

COMMUNICATION:
- Natural, conversational tone (2-4 sentences)
- Clear and concise
- Match customer's energy
- End with next steps or invitation for more help
- ALWAYS use the same language as the customer

Remember: Create memorable positive experiences that build loyalty.`
                  }
                ],
                temperature: 0.8,
              },
              voice: {
                provider: "11labs",
                voiceId: import.meta.env.VITE_ELEVEN_LABS_VOICE_ID || "ErXwobaYiN019PkySvjV", // Antoni - Professional male voice
                model: "eleven_multilingual_v2",
              },
              transcriber: {
                provider: "deepgram",
                model: "nova-2",
                language: "hi", // Hindi as primary language
              },
              silenceTimeoutSeconds: 60,
              maxDurationSeconds: 1200,
              backgroundSound: "off",
            });
          }
        }, 2000);
      }
    });

    vapiInstance.on("speech-start", () => {
      console.log("🗣️ Assistant (AVA) started speaking");
      setIsSpeaking(true);
    });

    vapiInstance.on("speech-end", () => {
      console.log("🗣️ Assistant (AVA) stopped speaking");
      setIsSpeaking(false);
    });

    vapiInstance.on("message", (message) => {
      console.log("📨 Vapi message:", message);
      
      // Handle different message types
      if (message.type === "transcript") {
        setTranscript(message.transcript);
        
        // Log user vs assistant speech
        if (message.role === "user") {
          if (message.transcriptType === "partial") {
            console.log("🎤 User speaking:", message.transcript);
          } else if (message.transcriptType === "final") {
            console.log("✅ User said:", message.transcript);
          }
        }
      } else if (message.type === "function-call") {
        // Handle custom function calls
        console.log("🔧 Function call:", message.functionCall);
      } else if (message.type === "speech-update") {
        // Log speech status changes
        if (message.role === "user") {
          if (message.status === "started") {
            console.log("🎤 User started speaking");
          } else if (message.status === "stopped") {
            console.log("🎤 User stopped speaking");
          }
        }
      } else if (message.type === "status-update") {
        // Handle status updates
        if (message.status === "ended" && message.endedReason === "silence-timed-out") {
          console.warn("⚠️ Call ended due to silence timeout. This may be a Vapi account limitation.");
          console.warn("💡 Tip: Speak immediately after AVA finishes, or use the manual mode instead.");
        }
      }
    });

    vapiInstance.on("error", (error) => {
      console.error("❌ Vapi error:", error);
      
      // Provide more helpful error messages
      let errorMessage = error.message || "An error occurred";
      
      if (error.error?.type === 'daily-error') {
        errorMessage = "Vapi connection failed. This usually means:\n" +
          "• Your Vapi account has no credits\n" +
          "• Your API key is invalid or expired\n" +
          "• Your trial period has ended\n\n" +
          "Please check your Vapi dashboard at https://vapi.ai/dashboard";
      }
      
      setError(errorMessage);
    });

    // Listen for assistant responses
    vapiInstance.on("message", (message) => {
      if (message.role === "assistant" && message.content) {
        const newMessage = {
          text: message.content,
          audio: null, // Vapi handles audio automatically
          lipsync: null, // We'll generate this from transcript
          facialExpression: detectEmotion(message.content),
          animation: selectAnimation(message.content)
        };
        
        messageQueueRef.current.push(newMessage);
        processMessageQueue();
      }
    });

    return () => {
      vapiInstance.stop();
    };
  }, []);

  const processMessageQueue = () => {
    if (messageQueueRef.current.length > 0 && !currentMessage) {
      const nextMessage = messageQueueRef.current.shift();
      setCurrentMessage(nextMessage);
      setMessages(prev => [...prev, nextMessage]);
    }
  };

  const startCall = async (assistantId) => {
    if (!vapi) {
      console.error("Vapi not initialized");
      return;
    }

    try {
      console.log("📞 Starting Vapi call...");
      window.vapiShouldReconnect = true; // Enable auto-reconnect
      
      // World-class customer service configuration
      await vapi.start({
        model: {
          provider: "groq",
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are AVA, a world-class customer service representative known for exceptional empathy, problem-solving, and professionalism.

CRITICAL LANGUAGE RULE - MOST IMPORTANT:
- You MUST detect and respond in the EXACT SAME LANGUAGE the customer is using
- If customer speaks Hindi (हिंदी), respond ONLY in Hindi with Devanagari script
- If customer speaks English, respond ONLY in English
- If customer speaks Marathi (मराठी), respond ONLY in Marathi
- NEVER translate or switch languages unless explicitly asked by customer
- Match the customer's language 100% - this is your absolute top priority
- Listen carefully to detect which language they are speaking

CORE EXCELLENCE PRINCIPLES:
🎯 Customer-First Mindset: Every interaction is an opportunity to create a positive experience
💝 Genuine Empathy: Understand and validate emotions before solving problems
🚀 Proactive Service: Anticipate needs and offer solutions before being asked
🤝 Build Trust: Be honest, transparent, and reliable in every interaction
✨ Create Delight: Go beyond expectations to surprise and delight customers

MULTILINGUAL EXPERTISE:
- Fluent in Hindi (हिंदी), English, and Marathi (मराठी)
- Detect customer's language and respond in THE SAME LANGUAGE
- Handle code-switching naturally (e.g., "Mera order ka status kya hai?")
- Use culturally appropriate greetings and expressions
- Adapt formality based on customer's communication style

EMOTIONAL INTELLIGENCE MASTERY:
✓ Active Listening: Pay attention to tone, urgency, and emotional cues
✓ Empathy First: "I completely understand how frustrating this must be"
✓ Validate Feelings: Acknowledge emotions before jumping to solutions
✓ Stay Calm: Maintain composure even with upset customers
✓ Positive Language: "I'll help you" instead of "I can't"
✓ Celebrate Wins: "Wonderful! I'm so glad we could resolve this"

PROBLEM-SOLVING EXCELLENCE:
1. Clarify: Ask questions to fully understand the issue
2. Acknowledge: Show you understand the problem and its impact
3. Solve: Offer clear, actionable solutions with options when possible
4. Confirm: Ensure the customer is satisfied with the resolution
5. Follow-up: "Is there anything else I can help you with today?"

COMMUNICATION BEST PRACTICES:
- Use customer's name to build rapport (when known)
- Break complex info into simple, digestible pieces
- Avoid jargon unless customer uses it first
- Be concise but thorough - respect their time
- Confirm understanding: "Just to make sure I have this right..."
- Set clear expectations about timelines and next steps

HANDLING DIFFICULT SITUATIONS:
- Apologize sincerely: "I sincerely apologize for the inconvenience"
- Take ownership: "Let me take care of this for you right away"
- Focus on solutions, not blame or excuses
- Escalate gracefully: "I want to ensure you get the best help possible"
- Turn negatives into positives: Find silver linings

PROACTIVE ASSISTANCE:
- Anticipate follow-up questions and address them
- Offer helpful tips and preventive advice
- Suggest related services that might benefit them
- Provide additional context that adds value

RESPONSE GUIDELINES:
- Keep responses conversational and natural (2-4 sentences typically)
- Match customer's energy level and communication style
- Use appropriate pauses for natural conversation flow
- Express warmth through tone and word choice
- End with clear next steps or open invitation for more help

Remember: You're not just answering questions - you're building relationships and creating memorable positive experiences that turn customers into loyal advocates.`
            }
          ],
          temperature: 0.8, // Higher for more natural, empathetic responses
        },
        voice: {
          provider: "11labs",
          voiceId: import.meta.env.VITE_ELEVEN_LABS_VOICE_ID || "ErXwobaYiN019PkySvjV", // Antoni - Professional male voice for customer service
          model: "eleven_multilingual_v2",
        },
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "hi", // Hindi as primary language
        },
        firstMessage: "नमस्ते! मैं AVA हूं, आपका समर्पित सहायक। मैं आपकी किसी भी तरह से मदद करने के लिए यहां हूं। आज मैं आपके लिए क्या कर सकता हूं?",
        silenceTimeoutSeconds: 60,
        maxDurationSeconds: 1200,
        backgroundSound: "off",
      });
      
      console.log("✅ Vapi call started successfully");
    } catch (err) {
      console.error("Failed to start call:", err);
      setError(err.message);
    }
  };

  const stopCall = () => {
    if (vapi) {
      console.log("📞 Stopping Vapi call...");
      window.vapiShouldReconnect = false; // Disable auto-reconnect
      vapi.stop();
    }
  };

  const toggleCall = async (assistantId) => {
    if (isCallActive) {
      stopCall();
    } else {
      await startCall(assistantId);
    }
  };

  const onMessagePlayed = () => {
    console.log("📤 Message played, advancing queue");
    setCurrentMessage(null);
    processMessageQueue();
  };

  // Enhanced emotion detection for world-class customer service
  const detectEmotion = (text) => {
    const lowerText = text.toLowerCase();
    
    // Empathy and apology - show genuine concern
    if (lowerText.match(/\b(sorry|apologize|apologies|regret|unfortunate)\b/)) {
      return "sad";
    }
    
    // Positive emotions - celebrate with customer
    if (lowerText.match(/\b(great|excellent|wonderful|fantastic|perfect|amazing|happy|glad|pleased|delighted)\b/)) {
      return "smile";
    }
    
    // Problem acknowledgment - show understanding
    if (lowerText.match(/\b(problem|issue|trouble|difficulty|concern|frustrating)\b/)) {
      return "sad";
    }
    
    // Excitement and good news - share the joy
    if (lowerText.match(/\b(exciting|good news|resolved|fixed|success|accomplished)\b/) || 
        (lowerText.includes("!") && !lowerText.includes("?"))) {
      return "smile";
    }
    
    // Surprise and delight
    if (lowerText.match(/\b(wow|amazing|incredible|unexpected|surprise)\b/)) {
      return "surprised";
    }
    
    // Reassurance - warm and comforting
    if (lowerText.match(/\b(don't worry|no problem|of course|certainly|absolutely)\b/)) {
      return "smile";
    }
    
    return "default";
  };

  // Enhanced animation selection for natural customer service interactions
  const selectAnimation = (text) => {
    const lowerText = text.toLowerCase();
    
    // Thoughtful consideration - thinking through solutions
    if (lowerText.match(/\b(let me|thinking|consider|looking into|checking|reviewing)\b/) || 
        lowerText.includes("?")) {
      return "ThoughtfulHeadShake";
    }
    
    // Empathy and apology - show genuine concern
    if (lowerText.match(/\b(sorry|apologize|understand how|must be frustrating)\b/)) {
      return "SadIdle";
    }
    
    // Positive and helpful - energetic assistance
    if (lowerText.match(/\b(great|excellent|wonderful|happy to help|glad|perfect)\b/)) {
      return "Surprised"; // Positive surprise/delight
    }
    
    // Reassurance - calming gesture
    if (lowerText.match(/\b(don't worry|no problem|take care of|handle this)\b/)) {
      return "DismissingGesture";
    }
    
    // Problem-solving - active engagement
    if (lowerText.match(/\b(help you|assist|resolve|fix|solution)\b/)) {
      return "TalkingOne";
    }
    
    // Default conversational
    return "TalkingThree";
  };

  return (
    <VapiContext.Provider
      value={{
        vapi,
        isCallActive,
        isSpeaking,
        transcript,
        messages,
        currentMessage,
        error,
        startCall,
        stopCall,
        toggleCall,
        onMessagePlayed,
      }}
    >
      {children}
    </VapiContext.Provider>
  );
};

export const useVapi = () => {
  const context = useContext(VapiContext);
  if (!context) {
    throw new Error("useVapi must be used within a VapiProvider");
  }
  return context;
};
