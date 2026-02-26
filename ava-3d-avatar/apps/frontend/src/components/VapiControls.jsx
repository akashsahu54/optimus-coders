import { useVapi } from "../hooks/useVapi";

export const VapiControls = () => {
  const { 
    isCallActive, 
    isSpeaking, 
    transcript, 
    error,
    toggleCall 
  } = useVapi();

  return (
    <div className="vapi-controls">
      {/* Call Status */}
      <div className="status-indicator">
        {isCallActive ? (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-500">Call Active</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full" />
            <span className="text-gray-500">Call Inactive</span>
          </div>
        )}
      </div>

      {/* Speaking Indicator */}
      {isSpeaking && (
        <div className="speaking-indicator">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-blue-500">Speaking...</span>
          </div>
        </div>
      )}

      {/* Transcript Display */}
      {transcript && (
        <div className="transcript-display p-4 bg-gray-800 rounded-lg mt-4">
          <p className="text-sm text-gray-300">{transcript}</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-display p-4 bg-red-900/50 border border-red-500 rounded-lg mt-4">
          <p className="text-sm text-red-300">Error: {error}</p>
        </div>
      )}

      {/* Call Toggle Button */}
      <button
        onClick={() => toggleCall()}
        className={`
          px-6 py-3 rounded-lg font-semibold transition-all
          ${isCallActive 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-green-500 hover:bg-green-600 text-white'
          }
        `}
      >
        {isCallActive ? '📞 End Call' : '📞 Start Call'}
      </button>

      {/* Instructions */}
      {!isCallActive && (
        <p className="text-sm text-gray-400 mt-4 text-center">
          Click "Start Call" to begin voice conversation with AVA
        </p>
      )}
    </div>
  );
};
