import dotenv from "dotenv";

dotenv.config();

/**
 * Vapi Server-Side Integration
 * 
 * This module provides server-side Vapi functionality:
 * - Assistant management
 * - Webhook handling
 * - Custom function execution
 * - Conversation logging
 */

const VAPI_API_KEY = process.env.VAPI_API_KEY;
const VAPI_BASE_URL = "https://api.vapi.ai";

/**
 * Create a Vapi assistant
 */
export async function createAssistant(config) {
  const response = await fetch(`${VAPI_BASE_URL}/assistant`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${VAPI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: config.name || "AVA Customer Support",
      model: {
        provider: config.modelProvider || "groq",
        model: config.model || "llama-3.3-70b-versatile",
        messages: config.systemMessages || [
          {
            role: "system",
            content: "You are AVA, a helpful customer support assistant."
          }
        ],
        temperature: config.temperature || 0.7,
      },
      voice: {
        provider: config.voiceProvider || "11labs",
        voiceId: config.voiceId || process.env.ELEVEN_LABS_VOICE_ID,
      },
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      firstMessage: config.firstMessage || "Hello! I'm AVA, your AI assistant. How can I help you today?",
      ...config.additionalSettings
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create assistant: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Get assistant details
 */
export async function getAssistant(assistantId) {
  const response = await fetch(`${VAPI_BASE_URL}/assistant/${assistantId}`, {
    headers: {
      "Authorization": `Bearer ${VAPI_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get assistant: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Update assistant configuration
 */
export async function updateAssistant(assistantId, updates) {
  const response = await fetch(`${VAPI_BASE_URL}/assistant/${assistantId}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${VAPI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update assistant: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Handle Vapi webhooks
 */
export function handleWebhook(event) {
  console.log("📨 Vapi webhook received:", event.type);

  switch (event.type) {
    case "call-started":
      return handleCallStarted(event);
    case "call-ended":
      return handleCallEnded(event);
    case "function-call":
      return handleFunctionCall(event);
    case "transcript":
      return handleTranscript(event);
    default:
      console.log("Unknown webhook type:", event.type);
      return { success: true };
  }
}

/**
 * Handle call started event
 */
function handleCallStarted(event) {
  console.log("📞 Call started:", event.call.id);
  
  // Log to database, analytics, etc.
  // You can track:
  // - Call ID
  // - Customer info
  // - Start time
  
  return { success: true };
}

/**
 * Handle call ended event
 */
function handleCallEnded(event) {
  console.log("📞 Call ended:", event.call.id);
  console.log("Duration:", event.call.duration, "seconds");
  console.log("Cost:", event.call.cost);
  
  // Log to database
  // Calculate metrics
  // Send notifications if needed
  
  return { success: true };
}

/**
 * Handle custom function calls
 */
async function handleFunctionCall(event) {
  const { functionCall } = event;
  console.log("🔧 Function call:", functionCall.name);

  switch (functionCall.name) {
    case "escalate_to_human":
      return await escalateToHuman(functionCall.parameters);
    
    case "get_order_status":
      return await getOrderStatus(functionCall.parameters);
    
    case "schedule_callback":
      return await scheduleCallback(functionCall.parameters);
    
    default:
      return {
        success: false,
        error: `Unknown function: ${functionCall.name}`
      };
  }
}

/**
 * Handle transcript updates
 */
function handleTranscript(event) {
  const { transcript, role } = event;
  console.log(`💬 ${role}: ${transcript}`);
  
  // Store transcript for:
  // - Conversation history
  // - Analytics
  // - Training data
  
  return { success: true };
}

/**
 * Example function: Escalate to human
 */
async function escalateToHuman(params) {
  console.log("🚨 Escalating to human:", params.reason);
  
  // Implement your escalation logic:
  // - Create support ticket
  // - Notify human agents
  // - Transfer call
  
  return {
    success: true,
    message: "I'm connecting you with a human agent right away. Please hold for a moment."
  };
}

/**
 * Example function: Get order status
 */
async function getOrderStatus(params) {
  console.log("📦 Getting order status:", params.orderId);
  
  // Query your database/API
  // Return order information
  
  return {
    success: true,
    status: "shipped",
    trackingNumber: "1Z999AA10123456784",
    estimatedDelivery: "2024-01-15"
  };
}

/**
 * Example function: Schedule callback
 */
async function scheduleCallback(params) {
  console.log("📅 Scheduling callback:", params);
  
  // Add to calendar/CRM
  // Send confirmation
  
  return {
    success: true,
    message: `I've scheduled a callback for ${params.date} at ${params.time}. You'll receive a confirmation email shortly.`
  };
}

/**
 * Generate temporary call token (for secure client-side calls)
 */
export async function generateCallToken(assistantId, metadata = {}) {
  const response = await fetch(`${VAPI_BASE_URL}/call/token`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${VAPI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assistantId,
      metadata,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate token: ${response.statusText}`);
  }

  return await response.json();
}
