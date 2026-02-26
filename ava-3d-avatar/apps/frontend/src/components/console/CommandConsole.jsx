import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { NeonButton } from './NeonButton';

export const CommandConsole = ({ 
  onSend, 
  conversationMode,
  onToggleConversation,
  isRecording, 
  isLoading, 
  isProcessing,
  vadIsSpeaking
}) => {
  const inputRef = useRef();
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim() && !isLoading && !isProcessing) {
      onSend(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed bottom-3 md:bottom-6 left-0 right-0 z-30 flex justify-center px-3 md:px-6"
    >
      <div className="w-full max-w-4xl">
      <div className="glass p-3 md:p-4 rounded-lg relative">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 md:w-4 md:h-4 border-t-2 border-l-2 border-cyan-400 neon-glow-cyan" />
        <div className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 border-t-2 border-r-2 border-cyan-400 neon-glow-cyan" />
        <div className="absolute bottom-0 left-0 w-3 h-3 md:w-4 md:h-4 border-b-2 border-l-2 border-cyan-400 neon-glow-cyan" />
        <div className="absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 border-b-2 border-r-2 border-cyan-400 neon-glow-cyan" />

        {/* Status Line */}
        <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3 text-[10px] md:text-xs mono text-cyan-400/60 overflow-hidden">
          <span className="text-green-400">●</span>
          <span className="hidden sm:inline">SYSTEM_READY</span>
          <span className="text-cyan-400/40 hidden sm:inline">|</span>
          <span className="truncate">
            {conversationMode 
              ? (vadIsSpeaking ? 'LISTENING...' : isRecording ? 'RECORDING...' : isLoading ? 'PROCESSING...' : 'AUTO_MODE_ACTIVE')
              : (isLoading ? 'PROCESSING...' : 'MANUAL_MODE')
            }
          </span>
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
          {/* Conversation Mode Toggle Button */}
          <NeonButton
            onClick={onToggleConversation}
            disabled={isLoading}
            variant={conversationMode ? 'success' : 'primary'}
            className={`${conversationMode && vadIsSpeaking ? 'animate-pulse' : ''} shrink-0`}
            title={conversationMode ? 'Click to disable auto-conversation' : 'Click to enable auto-conversation'}
          >
            <div className="flex items-center gap-1">
              {conversationMode ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 md:w-5 md:h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
                    />
                  </svg>
                  {vadIsSpeaking && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="w-2 h-2 bg-red-400 rounded-full"
                    />
                  )}
                </>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 md:w-5 md:h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                  />
                </svg>
              )}
            </div>
          </NeonButton>

          {/* Command Input */}
          <div className="flex-1 relative min-w-0">
            <span className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 text-cyan-400 mono text-xs md:text-sm">{'>'}</span>
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-black/50 border border-cyan-400/30 rounded px-6 md:px-8 py-2 md:py-3 text-cyan-400 mono text-xs md:text-sm focus:outline-none focus:border-cyan-400 focus:neon-glow-cyan transition-all placeholder-cyan-400/30"
              placeholder={conversationMode ? "AUTO MODE - Just speak..." : "ENTER_COMMAND..."}
              disabled={isLoading || isProcessing || conversationMode}
            />
            {!inputValue && (
              <span className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-cyan-400/50 mono text-xs md:text-sm cursor-blink" />
            )}
          </div>

          {/* Send Button */}
          <NeonButton
            onClick={handleSend}
            disabled={isLoading || isProcessing || !inputValue.trim() || conversationMode}
            variant="primary"
            className="shrink-0"
          >
            <span className="mono text-xs md:text-sm font-bold">SEND</span>
          </NeonButton>
        </div>
      </div>
      </div>
    </motion.div>
  );
};
