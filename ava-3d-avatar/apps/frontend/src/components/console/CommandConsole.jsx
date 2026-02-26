import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { NeonButton } from './NeonButton';

export const CommandConsole = ({ 
  onSend, 
  onVoiceStart, 
  onVoiceStop, 
  isRecording, 
  isLoading, 
  isProcessing 
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
      className="fixed bottom-6 left-0 right-0 z-30 flex justify-center px-6"
    >
      <div className="w-full max-w-4xl">
      <div className="glass p-4 rounded-lg relative">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 neon-glow-cyan" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 neon-glow-cyan" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 neon-glow-cyan" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 neon-glow-cyan" />

        {/* Status Line */}
        <div className="flex items-center gap-2 mb-3 text-xs mono text-cyan-400/60">
          <span className="text-green-400">●</span>
          <span>SYSTEM_READY</span>
          <span className="text-cyan-400/40">|</span>
          <span>{isLoading ? 'PROCESSING...' : isRecording ? 'VOICE_INPUT_ACTIVE' : 'STANDBY'}</span>
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Voice Button */}
          <NeonButton
            onClick={isRecording ? onVoiceStop : onVoiceStart}
            disabled={isLoading || isProcessing}
            variant={isRecording ? 'danger' : 'primary'}
            className={isRecording ? 'animate-pulse' : ''}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
              />
            </svg>
          </NeonButton>

          {/* Command Input */}
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 mono text-sm">{'>'}</span>
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-black/50 border border-cyan-400/30 rounded px-8 py-3 text-cyan-400 mono text-sm focus:outline-none focus:border-cyan-400 focus:neon-glow-cyan transition-all placeholder-cyan-400/30"
              placeholder="ENTER_COMMAND..."
              disabled={isLoading || isProcessing}
            />
            {!inputValue && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400/50 mono text-sm cursor-blink" />
            )}
          </div>

          {/* Send Button */}
          <NeonButton
            onClick={handleSend}
            disabled={isLoading || isProcessing || !inputValue.trim()}
            variant="primary"
          >
            <span className="mono text-sm font-bold">SEND</span>
          </NeonButton>
        </div>
      </div>
      </div>
    </motion.div>
  );
};
