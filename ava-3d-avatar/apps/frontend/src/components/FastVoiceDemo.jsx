import { useState } from "react";
import { useFastVoice } from "../hooks/useFastVoice";
import { PerformanceStats } from "./PerformanceStats";

/**
 * Complete demo component for fast voice-to-voice
 * Sab features ek saath dikhata hai
 */
export const FastVoiceDemo = () => {
  const {
    isListening,
    isProcessing,
    messages,
    error,
    processingTime,
    toggleRecording,
    toggleConversation,
  } = useFastVoice();

  const [conversationMode, setConversationMode] = useState(false);

  const handleConversationToggle = () => {
    setConversationMode(!conversationMode);
    toggleConversation();
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Performance Stats */}
      <PerformanceStats
        processingTime={processingTime}
        isProcessing={isProcessing}
      />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#00ffff", textShadow: "0 0 10px #00ffff" }}>
          ⚡ Fast Voice-to-Voice Agent
        </h1>
        <p style={{ color: "#888" }}>
          Lightning-fast responses with parallel processing
        </p>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          marginBottom: "30px",
        }}
      >
        {/* Manual Recording Button */}
        <button
          onClick={toggleRecording}
          disabled={conversationMode || isProcessing}
          style={{
            padding: "15px 30px",
            fontSize: "16px",
            borderRadius: "10px",
            border: "2px solid",
            borderColor: isListening ? "#ff0000" : "#00ff00",
            background: isListening
              ? "rgba(255, 0, 0, 0.2)"
              : "rgba(0, 255, 0, 0.2)",
            color: isListening ? "#ff0000" : "#00ff00",
            cursor: conversationMode ? "not-allowed" : "pointer",
            fontWeight: "bold",
            transition: "all 0.3s",
            opacity: conversationMode ? 0.5 : 1,
          }}
        >
          {isListening ? "🔴 Stop Recording" : "🎤 Start Recording"}
        </button>

        {/* Conversation Mode Button */}
        <button
          onClick={handleConversationToggle}
          disabled={isProcessing}
          style={{
            padding: "15px 30px",
            fontSize: "16px",
            borderRadius: "10px",
            border: "2px solid",
            borderColor: conversationMode ? "#ff00ff" : "#00ffff",
            background: conversationMode
              ? "rgba(255, 0, 255, 0.2)"
              : "rgba(0, 255, 255, 0.2)",
            color: conversationMode ? "#ff00ff" : "#00ffff",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.3s",
          }}
        >
          {conversationMode ? "🔊 Stop Conversation" : "💬 Start Conversation"}
        </button>
      </div>

      {/* Status Indicators */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {isListening && (
          <div
            style={{
              padding: "8px 15px",
              background: "rgba(255, 0, 0, 0.2)",
              border: "1px solid #ff0000",
              borderRadius: "20px",
              color: "#ff0000",
              fontSize: "14px",
              animation: "pulse 1s infinite",
            }}
          >
            🎤 Listening...
          </div>
        )}

        {isProcessing && (
          <div
            style={{
              padding: "8px 15px",
              background: "rgba(255, 255, 0, 0.2)",
              border: "1px solid #ffff00",
              borderRadius: "20px",
              color: "#ffff00",
              fontSize: "14px",
            }}
          >
            ⚡ Processing...
          </div>
        )}

        {conversationMode && (
          <div
            style={{
              padding: "8px 15px",
              background: "rgba(255, 0, 255, 0.2)",
              border: "1px solid #ff00ff",
              borderRadius: "20px",
              color: "#ff00ff",
              fontSize: "14px",
            }}
          >
            💬 Conversation Mode Active
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div
          style={{
            padding: "15px",
            background: "rgba(255, 0, 0, 0.1)",
            border: "1px solid #ff0000",
            borderRadius: "10px",
            color: "#ff0000",
            marginBottom: "20px",
          }}
        >
          ❌ Error: {error}
        </div>
      )}

      {/* Messages Display */}
      <div
        style={{
          background: "rgba(0, 0, 0, 0.3)",
          borderRadius: "10px",
          padding: "20px",
          minHeight: "200px",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#666", padding: "40px" }}>
            <p>No messages yet</p>
            <p style={{ fontSize: "14px", marginTop: "10px" }}>
              Click "Start Recording" or enable "Conversation Mode" to begin
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              style={{
                marginBottom: "15px",
                padding: "15px",
                background: "rgba(0, 255, 255, 0.1)",
                border: "1px solid rgba(0, 255, 255, 0.3)",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  color: "#00ffff",
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                🤖 Avatar Response #{index + 1}
              </div>
              <div style={{ color: "#fff", lineHeight: "1.6" }}>
                {message.text}
              </div>
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "12px",
                  color: "#888",
                  display: "flex",
                  gap: "15px",
                }}
              >
                <span>😊 {message.facialExpression}</span>
                <span>🎭 {message.animation}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Instructions */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "rgba(0, 255, 255, 0.05)",
          border: "1px solid rgba(0, 255, 255, 0.2)",
          borderRadius: "10px",
        }}
      >
        <h3 style={{ color: "#00ffff", marginBottom: "15px" }}>
          📖 How to Use
        </h3>
        <ul style={{ color: "#aaa", lineHeight: "2" }}>
          <li>
            <strong>Manual Mode:</strong> Click "Start Recording" to record your
            voice, click "Stop" when done
          </li>
          <li>
            <strong>Conversation Mode:</strong> Enable for hands-free operation
            with automatic voice detection
          </li>
          <li>
            <strong>Performance:</strong> Watch the top-right corner for
            real-time performance metrics
          </li>
          <li>
            <strong>Fast Response:</strong> Optimized pipeline delivers responses
            in 1-2 seconds
          </li>
        </ul>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};
