import { motion, AnimatePresence } from 'framer-motion';

/**
 * Speech-to-Speech Status Indicator
 * Shows the current stage of the STS pipeline
 */
export const STSStatusIndicator = ({ isRecording, isLoading, isProcessing }) => {
  const getStatus = () => {
    if (isRecording) {
      return {
        stage: 'RECORDING',
        icon: '🎤',
        color: 'red',
        message: 'Listening to your voice...'
      };
    }
    if (isLoading) {
      return {
        stage: 'PROCESSING',
        icon: '⚙️',
        color: 'yellow',
        message: 'Converting speech and generating response...'
      };
    }
    if (isProcessing) {
      return {
        stage: 'SPEAKING',
        icon: '🗣️',
        color: 'green',
        message: 'Avatar is speaking...'
      };
    }
    return null;
  };

  const status = getStatus();

  return (
    <AnimatePresence>
      {status && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 md:top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        >
          <div className={`
            glass px-4 md:px-6 py-2 md:py-3 rounded-lg
            border-2 
            ${status.color === 'red' ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : ''}
            ${status.color === 'yellow' ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]' : ''}
            ${status.color === 'green' ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : ''}
          `}>
            <div className="flex items-center gap-2 md:gap-3">
              {/* Animated Icon */}
              <motion.span
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: status.color === 'yellow' ? [0, 360] : 0
                }}
                transition={{ 
                  duration: status.color === 'yellow' ? 2 : 1,
                  repeat: Infinity 
                }}
                className="text-lg md:text-xl"
              >
                {status.icon}
              </motion.span>

              {/* Status Text */}
              <div className="flex flex-col">
                <span className={`
                  mono text-xs md:text-sm font-bold
                  ${status.color === 'red' ? 'text-red-400' : ''}
                  ${status.color === 'yellow' ? 'text-yellow-400' : ''}
                  ${status.color === 'green' ? 'text-green-400' : ''}
                `}>
                  {status.stage}
                </span>
                <span className="text-cyan-400/70 text-[10px] md:text-xs mono hidden sm:block">
                  {status.message}
                </span>
              </div>

              {/* Animated Dots */}
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                    className={`
                      w-1.5 h-1.5 md:w-2 md:h-2 rounded-full
                      ${status.color === 'red' ? 'bg-red-400' : ''}
                      ${status.color === 'yellow' ? 'bg-yellow-400' : ''}
                      ${status.color === 'green' ? 'bg-green-400' : ''}
                    `}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
