import { useState, useEffect, useCallback } from "react";

const BACKEND_URL = "http://localhost:3000";

/**
 * Session management hook
 * Maintains conversation context and state
 */
export const useSession = () => {
  const [sessionId, setSessionId] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [sessionStats, setSessionStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generate or retrieve session ID
  useEffect(() => {
    const storedSessionId = localStorage.getItem("ava_session_id");
    
    if (storedSessionId) {
      setSessionId(storedSessionId);
      loadConversationHistory(storedSessionId);
    } else {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      localStorage.setItem("ava_session_id", newSessionId);
    }
  }, []);

  /**
   * Generate unique session ID
   */
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * Load conversation history
   */
  const loadConversationHistory = async (sid) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BACKEND_URL}/conversation/${sid}`);
      
      if (response.ok) {
        const data = await response.json();
        setConversationHistory(data.history || []);
        setSessionStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to load conversation history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear conversation
   */
  const clearConversation = useCallback(async () => {
    if (!sessionId) return;

    try {
      await fetch(`${BACKEND_URL}/conversation/${sessionId}`, {
        method: "DELETE",
      });

      setConversationHistory([]);
      
      // Generate new session
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      localStorage.setItem("ava_session_id", newSessionId);
      
      console.log("🧹 Conversation cleared, new session started");
    } catch (error) {
      console.error("Failed to clear conversation:", error);
    }
  }, [sessionId]);

  /**
   * Refresh session stats
   */
  const refreshStats = useCallback(async () => {
    if (!sessionId) return;

    try {
      const response = await fetch(`${BACKEND_URL}/session/${sessionId}/stats`);
      
      if (response.ok) {
        const stats = await response.json();
        setSessionStats(stats);
      }
    } catch (error) {
      console.error("Failed to refresh stats:", error);
    }
  }, [sessionId]);

  /**
   * Add message to local history (optimistic update)
   */
  const addMessageToHistory = useCallback((role, content) => {
    setConversationHistory((prev) => [
      ...prev,
      { role, content, timestamp: Date.now() },
    ]);
  }, []);

  return {
    sessionId,
    conversationHistory,
    sessionStats,
    isLoading,
    clearConversation,
    refreshStats,
    addMessageToHistory,
  };
};
