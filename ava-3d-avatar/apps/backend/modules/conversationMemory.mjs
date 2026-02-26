import crypto from "crypto";

/**
 * Conversation Memory Manager
 * Maintains conversation history with smart context management
 */
class ConversationMemory {
  constructor(options = {}) {
    this.sessions = new Map();
    this.maxMessagesPerSession = options.maxMessages || 10;
    this.sessionTTL = options.sessionTTL || 1800000; // 30 minutes
    this.maxTokens = options.maxTokens || 2000; // Approximate token limit
    
    // Cleanup old sessions every 5 minutes
    setInterval(() => this.cleanup(), 300000);
  }

  /**
   * Generate session ID from user identifier
   */
  generateSessionId(userId = "default") {
    return crypto.createHash("md5").update(userId).digest("hex");
  }

  /**
   * Get or create session
   */
  getSession(sessionId) {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        id: sessionId,
        messages: [],
        context: {},
        createdAt: Date.now(),
        lastAccessedAt: Date.now(),
        metadata: {},
      });
    }

    const session = this.sessions.get(sessionId);
    session.lastAccessedAt = Date.now();
    return session;
  }

  /**
   * Add message to conversation history
   */
  addMessage(sessionId, role, content, metadata = {}) {
    const session = this.getSession(sessionId);
    
    session.messages.push({
      role, // 'user' or 'assistant'
      content,
      timestamp: Date.now(),
      metadata,
    });

    // Trim old messages if exceeding limit
    if (session.messages.length > this.maxMessagesPerSession) {
      // Keep first message (context) and recent messages
      const firstMessage = session.messages[0];
      const recentMessages = session.messages.slice(-this.maxMessagesPerSession + 1);
      session.messages = [firstMessage, ...recentMessages];
    }

    return session;
  }

  /**
   * Get conversation history formatted for AI
   */
  getHistory(sessionId, limit = null) {
    const session = this.getSession(sessionId);
    const messages = limit 
      ? session.messages.slice(-limit)
      : session.messages;

    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  /**
   * Get conversation context (summary of key points)
   */
  getContext(sessionId) {
    const session = this.getSession(sessionId);
    
    if (session.messages.length === 0) {
      return "";
    }

    // Create context summary
    const recentMessages = session.messages.slice(-5);
    const context = recentMessages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join("\n");

    return context;
  }

  /**
   * Set custom context data
   */
  setContextData(sessionId, key, value) {
    const session = this.getSession(sessionId);
    session.context[key] = value;
  }

  /**
   * Get custom context data
   */
  getContextData(sessionId, key) {
    const session = this.getSession(sessionId);
    return session.context[key];
  }

  /**
   * Clear session history
   */
  clearSession(sessionId) {
    this.sessions.delete(sessionId);
  }

  /**
   * Get session statistics
   */
  getStats(sessionId) {
    const session = this.getSession(sessionId);
    
    return {
      messageCount: session.messages.length,
      duration: Date.now() - session.createdAt,
      lastAccessed: Date.now() - session.lastAccessedAt,
      contextSize: Object.keys(session.context).length,
    };
  }

  /**
   * Cleanup expired sessions
   */
  cleanup() {
    const now = Date.now();
    let cleaned = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastAccessedAt > this.sessionTTL) {
        this.sessions.delete(sessionId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} expired sessions`);
    }
  }

  /**
   * Get all active sessions count
   */
  getActiveSessionsCount() {
    return this.sessions.size;
  }

  /**
   * Export session for persistence
   */
  exportSession(sessionId) {
    const session = this.getSession(sessionId);
    return JSON.stringify(session);
  }

  /**
   * Import session from persistence
   */
  importSession(sessionData) {
    const session = JSON.parse(sessionData);
    this.sessions.set(session.id, session);
    return session.id;
  }
}

// Singleton instance
export const conversationMemory = new ConversationMemory({
  maxMessages: 10,
  sessionTTL: 1800000, // 30 minutes
  maxTokens: 2000,
});

export default ConversationMemory;
