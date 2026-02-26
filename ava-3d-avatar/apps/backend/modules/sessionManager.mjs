import crypto from "crypto";
import { conversationMemory } from "./conversationMemory.mjs";
import { memoryManager } from "./memoryManager.mjs";

/**
 * Session Manager
 * Manages user sessions with smooth state transitions
 */
class SessionManager {
  constructor() {
    this.activeSessions = new Map();
    this.sessionTimeout = 1800000; // 30 minutes
    
    // Cleanup inactive sessions every 5 minutes
    setInterval(() => this.cleanupInactiveSessions(), 300000);
  }

  /**
   * Create or get session
   */
  getOrCreateSession(userId = null, metadata = {}) {
    const sessionId = userId 
      ? this.generateSessionId(userId)
      : this.generateRandomSessionId();

    if (!this.activeSessions.has(sessionId)) {
      this.activeSessions.set(sessionId, {
        id: sessionId,
        userId,
        createdAt: Date.now(),
        lastActivityAt: Date.now(),
        state: "active",
        metadata,
        requestCount: 0,
      });

      console.log(`🆕 New session created: ${sessionId}`);
    }

    const session = this.activeSessions.get(sessionId);
    session.lastActivityAt = Date.now();
    session.requestCount++;

    return session;
  }

  /**
   * Generate session ID from user ID
   */
  generateSessionId(userId) {
    return crypto.createHash("sha256").update(userId).digest("hex").substring(0, 16);
  }

  /**
   * Generate random session ID
   */
  generateRandomSessionId() {
    return crypto.randomBytes(8).toString("hex");
  }

  /**
   * Update session state
   */
  updateSessionState(sessionId, state) {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.state = state;
      session.lastActivityAt = Date.now();
    }
  }

  /**
   * Get session info
   */
  getSession(sessionId) {
    return this.activeSessions.get(sessionId);
  }

  /**
   * End session
   */
  endSession(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      // Clear conversation memory
      conversationMemory.clearSession(sessionId);
      
      // Remove from active sessions
      this.activeSessions.delete(sessionId);
      
      console.log(`👋 Session ended: ${sessionId}`);
      
      return {
        duration: Date.now() - session.createdAt,
        requestCount: session.requestCount,
      };
    }
    return null;
  }

  /**
   * Cleanup inactive sessions
   */
  cleanupInactiveSessions() {
    const now = Date.now();
    let cleaned = 0;

    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (now - session.lastActivityAt > this.sessionTimeout) {
        this.endSession(sessionId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} inactive sessions`);
    }
  }

  /**
   * Get active sessions count
   */
  getActiveSessionsCount() {
    return this.activeSessions.size;
  }

  /**
   * Get session statistics
   */
  getSessionStats(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    const conversationStats = conversationMemory.getStats(sessionId);
    const memoryStats = memoryManager.getStats();

    return {
      sessionId: session.id,
      duration: Math.round((Date.now() - session.createdAt) / 1000), // seconds
      requestCount: session.requestCount,
      state: session.state,
      conversationMessages: conversationStats.messageCount,
      memoryUsageMB: memoryStats.currentUsageMB.toFixed(2),
    };
  }

  /**
   * Get all sessions overview
   */
  getAllSessionsOverview() {
    const sessions = [];
    
    for (const [sessionId, session] of this.activeSessions.entries()) {
      sessions.push({
        id: sessionId,
        userId: session.userId,
        duration: Math.round((Date.now() - session.createdAt) / 1000),
        requestCount: session.requestCount,
        state: session.state,
      });
    }

    return {
      totalSessions: sessions.length,
      sessions,
      memoryStats: memoryManager.getStats(),
    };
  }
}

// Singleton instance
export const sessionManager = new SessionManager();

export default SessionManager;
