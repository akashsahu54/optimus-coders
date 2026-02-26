import { useState, useEffect } from "react";

/**
 * Performance statistics display component
 * User ko dikhao ki kitna fast hai system
 */
export const PerformanceStats = ({ processingTime, isProcessing }) => {
  const [history, setHistory] = useState([]);
  const [average, setAverage] = useState(null);

  useEffect(() => {
    if (processingTime) {
      setHistory((prev) => {
        const newHistory = [...prev, processingTime].slice(-10); // Last 10
        const avg = Math.round(
          newHistory.reduce((a, b) => a + b, 0) / newHistory.length
        );
        setAverage(avg);
        return newHistory;
      });
    }
  }, [processingTime]);

  const getSpeedRating = (time) => {
    if (time < 1000) return { label: "⚡ Lightning", color: "#00ff00" };
    if (time < 2000) return { label: "🚀 Fast", color: "#7fff00" };
    if (time < 3000) return { label: "✅ Good", color: "#ffff00" };
    if (time < 5000) return { label: "⚠️ Slow", color: "#ff8800" };
    return { label: "🐌 Very Slow", color: "#ff0000" };
  };

  if (!processingTime && !isProcessing) return null;

  const rating = processingTime ? getSpeedRating(processingTime) : null;
  const avgRating = average ? getSpeedRating(average) : null;

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "15px",
        borderRadius: "10px",
        fontFamily: "monospace",
        fontSize: "12px",
        minWidth: "200px",
        border: "1px solid rgba(0, 255, 255, 0.3)",
        boxShadow: "0 0 20px rgba(0, 255, 255, 0.2)",
      }}
    >
      <div style={{ marginBottom: "10px", fontWeight: "bold", fontSize: "14px" }}>
        ⚡ Performance Stats
      </div>

      {isProcessing && (
        <div style={{ color: "#00ffff", marginBottom: "10px" }}>
          🔄 Processing...
        </div>
      )}

      {processingTime && (
        <>
          <div style={{ marginBottom: "5px" }}>
            <span style={{ color: "#888" }}>Last Response:</span>
            <div style={{ color: rating.color, fontWeight: "bold" }}>
              {rating.label} - {processingTime}ms
            </div>
          </div>

          {average && (
            <div style={{ marginBottom: "5px" }}>
              <span style={{ color: "#888" }}>Average (10):</span>
              <div style={{ color: avgRating.color, fontWeight: "bold" }}>
                {avgRating.label} - {average}ms
              </div>
            </div>
          )}

          <div style={{ marginTop: "10px" }}>
            <span style={{ color: "#888" }}>History:</span>
            <div
              style={{
                display: "flex",
                gap: "2px",
                marginTop: "5px",
                height: "30px",
                alignItems: "flex-end",
              }}
            >
              {history.map((time, i) => {
                const height = Math.min((time / 5000) * 100, 100);
                const color = getSpeedRating(time).color;
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      background: color,
                      height: `${height}%`,
                      minHeight: "2px",
                      borderRadius: "2px",
                      opacity: 0.7 + (i / history.length) * 0.3,
                    }}
                    title={`${time}ms`}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}

      <div
        style={{
          marginTop: "10px",
          paddingTop: "10px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          fontSize: "10px",
          color: "#666",
        }}
      >
        Target: &lt;2000ms for best UX
      </div>
    </div>
  );
};
