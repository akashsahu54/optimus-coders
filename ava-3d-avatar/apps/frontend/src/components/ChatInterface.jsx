import React, { useRef } from "react";
import { useSpeech } from "../hooks/useSpeech";

export const ChatInterface = ({ hidden, ...props }) => {
  const input = useRef();
  const { tts, loading, message, startRecording, stopRecording, recording } = useSpeech();

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && !message) {
      tts(text);
      input.current.value = "";
    }
  };
  if (hidden) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-10 flex flex-col pointer-events-none">
      {/* Header at top */}
      <div className="p-6">
        <div className="backdrop-blur-md bg-white bg-opacity-70 p-6 rounded-2xl shadow-2xl inline-block">
          <h1 className="font-black text-3xl text-gray-900 mb-2">Digital Human</h1>
          <p className="text-gray-700 text-base">
            {loading ? "🤔 Thinking..." : "Type a message and press enter to chat with the AI"}
          </p>
        </div>
      </div>
      
      {/* Spacer to push input to bottom */}
      <div className="flex-1"></div>
      
      {/* Input at bottom */}
      <div className="p-6">
        <div className="flex items-center gap-3 pointer-events-auto max-w-4xl mx-auto bg-white bg-opacity-90 backdrop-blur-md p-4 rounded-2xl shadow-2xl">
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`bg-blue-500 hover:bg-blue-600 text-white p-3 px-4 font-semibold uppercase rounded-lg transition-all ${
            recording ? "bg-red-500 hover:bg-red-600 animate-pulse" : ""
          } ${loading || message ? "cursor-not-allowed opacity-30" : ""}`}
          disabled={loading || message}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
            />
          </svg>
        </button>

        <input
          className="w-full placeholder:text-gray-500 placeholder:italic p-3 rounded-lg bg-gray-50 border-2 border-gray-200 focus:border-blue-400 focus:outline-none transition-all"
          placeholder="Type a message..."
          ref={input}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button
          disabled={loading || message}
          onClick={sendMessage}
          className={`bg-blue-500 hover:bg-blue-600 text-white p-3 px-8 font-semibold uppercase rounded-lg transition-all ${
            loading || message ? "cursor-not-allowed opacity-30" : ""
          }`}
        >
          Send
        </button>
        </div>
      </div>
    </div>
  );
};
