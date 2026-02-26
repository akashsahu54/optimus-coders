import { useState, useEffect } from "react";

const BACKEND_URL = "http://localhost:3000";

/**
 * Session Dashboard
 * Shows conversation context, memory usage, and session stats
 */
export const SessionDashboard = ({ sessionId, sessionStats }) => {
  const [memoryStats, setMemoryStats] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (sessionId) {
      loadMemoryStats();
      loadConversationHistory();
    }
  }, [sessionId]);

  const loadMemoryStats = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/memory/stats`);
      if (response.ok) {
        const data = await response.json();
        setMemoryStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to load memory stats:", error);
    }
  };

  const loadConversationHistory = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/conversation/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setConversationHistory(data.history || []);
      }
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  };

  const clearMemory = async () => {
    try {
      await fetch(`${BACKEND_URL}/memory/clear`, { method: "POST" });
      loadMemoryStats();
      alert("Memory cleared!");
    } catch (error) {
      console.error("Failed to clear memory:", error);
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "12px 20px",
          background: "rgba(0, 255, 255, 0.2)",
          border: "1px solid #00ffff",
          borderRadius: "8px",
          color: "#00ffff",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        📊 Session Dashboard
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "400px",
        maxHeight: "600px",
        background: "rgba(0, 0, 0, 0.95)",
        border: "2px solid #00ffff",
        borderRadius: "12px",
        padding: "20px",
        color: "white",
        fontFamily: "monospace",
        fontSize: "12px",
        overflowY: "auto",
        boxShadow: "0 0 30px rgba(0, 255, 255, 0.3)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          paddingBottom: "10px",
          borderBottom: "1px solid rgba(0, 255, 255, 0.3)",
        }}
      >
        <h3 style={{ margin: 0, color: "#00ffff" }}>📊 Session Dashboard</h3>
        <button
          onClick={() => setIsExpanded(false)}
          style={{
            background: "none",
            border: "none",
            color: "#ff0000",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          ✕
        </button>
      </div>

      {/* Session Info */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ color: "#00ffff", marginBottom: "10px", fontWeight: "bold" }}>
          🔑 Session Info
        </div>
        <div style={{ color: "#aaa", fontSize: "11px", wordBreak: "break-all" }}>
          ID: {sessionId}
        </div>
        {sessionStats && (
          <div style={{ marginTop: "10px" }}>
            <div>⏱️ Duration: {sessionStats.duration}s</div>
            <div>📨 Requests: {sessionStats.requestCount}</div>
            <div>💬 Messages: {sessionStats.conversationMessages}</div>
            <div>🎯 State: {sessionStats.state}</div>
          </div>
        )}
      </div>

      {/* Memory Stats */}
      {memoryStats && (
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              color: "#00ffff",
              marginBottom: "10px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>💾 Memory Usage</span>
            <button
              onClick={clearMemory}
              style={{
                padding: "4px 8px",
                background: "rgba(255, 0, 0, 0.2)",
                border: "1px solid #ff0000",
                borderRadius: "4px",
                color: "#ff0000",
                cursor: "pointer",
                fontSize: "10px",
              }}
            >
              Clear
            </button>
          </div>
          <div>
            <div>
              Current: {memoryStats.currentUsageMB.toFixed(2)}MB (
              {memoryStats.usagePercent.toFixed(1)}%)
            </div>
            <div>Peak: {memoryStats.peakUsageMB.toFixed(2)}MB</div>
            <div>Buffers: {memoryStats.audioBufferCount}</div>
            <div>Temp Data: {memoryStats.tempDataCount}</div>
          </div>
          
          {/* Memory Bar */}
          <div
            style={{
              marginTop: "10px",
              height: "8px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(memoryStats.usagePercent, 100)}%`,
                background:
                  memoryStats.usagePercent > 80
                    ? "#ff0000"
                    : memoryStats.usagePercent > 50
                    ? "#ffff00"
                    : "#00ff00",
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>
      )}

      {/* Conversation History */}
      <div>
        <div style={{ color: "#00ffff", marginBottom: "10px", fontWeight: "bold" }}>
          💬 Conversation History ({conversationHistory.length})
        </div>
        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            background: "rgba(0, 0, 0, 0.3)",
            padding: "10px",
            borderRadius: "6px",
          }}
        >
          {conversationHistory.length === 0 ? (
            <div style={{ color: "#666", textAlign: "center" }}>
              No messages yet
            </div>
          ) : (
            conversationHistory.map((msg, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "8px",
                  padding: "8px",
                  background:
                    msg.role === "user"
                      ? "rgba(0, 255, 0, 0.1)"
                      : "rgba(0, 255, 255, 0.1)",
                  borderRadius: "4px",
                  borderLeft: `3px solid ${
                    msg.role === "user" ? "#00ff00" : "#00ffff"
                  }`,
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    color: msg.role === "user" ? "#00ff00" : "#00ffff",
                    marginBottom: "4px",
                  }}
                >
                  {msg.role === "user" ? "👤 User" : "🤖 AVA"}
                </div>
                <div style={{ fontSize: "11px" }}>
                  {msg.content.substring(0, 100)}
                  {msg.content.length > 100 ? "..." : ""}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={() => {
          loadMemoryStats();
          loadConversationHistory();
        }}
        style={{
          marginTop: "15px",
          width: "100%",
          padding: "10px",
          background: "rgba(0, 255, 255, 0.2)",
          border: "1px solid #00ffff",
          borderRadius: "6px",
          color: "#00ffff",
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        🔄 Refresh
      </button>
    </div>
  );
};
