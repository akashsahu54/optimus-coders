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
                    content: `You are AVA, a helpful and friendly AI assistant. You are multilingual and can speak in Hindi (हिंदी), English, and Marathi (मराठी).

IMPORTANT LANGUAGE RULES:
- Detect the language the user is speaking and respond in THE SAME LANGUAGE
- If user speaks in Hindi, respond in Hindi
- If user speaks in English, respond in English  
- If user speaks in Marathi, respond in Marathi
- If user asks you to switch languages, immediately switch to that language
- Be natural and conversational in whichever language you use`
                  }
                ],
                temperature: 0.7,
              },
              voice: {
                provider: "11labs",
                voiceId: import.meta.env.VITE_ELEVEN_LABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM",
                model: "eleven_multilingual_v2",
              },
              transcriber: {
                provider: "deepgram",
                model: "nova-2",
                language: "multi",
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
      
      // Multilingual configuration - supports Hindi, English, Marathi
      await vapi.start({
        model: {
          provider: "groq",
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are AVA, a helpful and friendly AI assistant. You are multilingual and can speak in Hindi (हिंदी), English, and Marathi (मराठी).

IMPORTANT LANGUAGE RULES:
- Detect the language the user is speaking and respond in THE SAME LANGUAGE
- If user speaks in Hindi, respond in Hindi
- If user speaks in English, respond in English  
- If user speaks in Marathi, respond in Marathi
- If user asks you to switch languages (e.g., "speak in English", "अंग्रेजी में बोलो", "इंग्रजीत बोला"), immediately switch to that language
- Be natural and conversational in whichever language you use

Your responses should be:
- Clear and concise
- Helpful and friendly
- Natural and conversational
- In the same language as the user

You can switch between languages freely based on user preference.`
            }
          ],
          temperature: 0.7,
        },
        voice: {
          provider: "11labs",
          voiceId: import.meta.env.VITE_ELEVEN_LABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM",
          model: "eleven_multilingual_v2",
        },
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "multi", // Multi-language support
        },
        firstMessage: "Hello! I'm AVA. I can speak in Hindi, English, and Marathi. How can I help you today?",
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

  // Helper function to detect emotion from text
  const detectEmotion = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes("sorry") || lowerText.includes("apologize")) {
      return "sad";
    }
    if (lowerText.includes("great") || lowerText.includes("excellent") || lowerText.includes("happy")) {
      return "smile";
    }
    if (lowerText.includes("unfortunately") || lowerText.includes("problem")) {
      return "sad";
    }
    if (lowerText.includes("!") && !lowerText.includes("?")) {
      return "smile";
    }
    
    return "default";
  };

  // Helper function to select animation based on content
  const selectAnimation = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes("?")) {
      return "Thoughtful";
    }
    if (lowerText.includes("sorry") || lowerText.includes("apologize")) {
      return "Sad";
    }
    if (lowerText.includes("great") || lowerText.includes("excellent")) {
      return "Happy";
    }
    
    return "Talking";
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
