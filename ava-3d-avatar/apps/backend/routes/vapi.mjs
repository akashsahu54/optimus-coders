import express from "express";
import { 
  createAssistant, 
  getAssistant, 
  updateAssistant, 
  handleWebhook,
  generateCallToken 
} from "../modules/vapi.mjs";

const router = express.Router();

/**
 * POST /api/vapi/assistant
 * Create a new Vapi assistant
 */
router.post("/assistant", async (req, res) => {
  try {
    const config = req.body;
    const assistant = await createAssistant(config);
    res.json(assistant);
  } catch (error) {
    console.error("Failed to create assistant:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/vapi/assistant/:id
 * Get assistant details
 */
router.get("/assistant/:id", async (req, res) => {
  try {
    const assistant = await getAssistant(req.params.id);
    res.json(assistant);
  } catch (error) {
    console.error("Failed to get assistant:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/vapi/assistant/:id
 * Update assistant configuration
 */
router.patch("/assistant/:id", async (req, res) => {
  try {
    const updates = req.body;
    const assistant = await updateAssistant(req.params.id, updates);
    res.json(assistant);
  } catch (error) {
    console.error("Failed to update assistant:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/vapi/webhook
 * Handle Vapi webhooks
 */
router.post("/webhook", async (req, res) => {
  try {
    const event = req.body;
    const result = handleWebhook(event);
    res.json(result);
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/vapi/token
 * Generate temporary call token for secure client-side calls
 */
router.post("/token", async (req, res) => {
  try {
    const { assistantId, metadata } = req.body;
    const token = await generateCallToken(assistantId, metadata);
    res.json(token);
  } catch (error) {
    console.error("Failed to generate token:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
