import { motion } from 'framer-motion';

/**
 * Voice Activity Detection Toggle
 * Allows user to enable/disable automatic voice detection
 */
export const VADToggle = ({ enabled, onToggle, isSpeaking }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-3 md:top-6 right-3 md:right-6 z-20"
    >
      <div className="glass p-2 md:p-3 rounded-lg border border-cyan-400/30">
        <div className="flex items-center gap-2 md:gap-3">
          {/* Label */}
          <div className="hidden sm:flex flex-col">
            <span className="text-cyan-400 text-xs mono font-bold">
              AUTO LISTEN
            </span>
            <span className="text-cyan-400/60 text-[10px] mono">
              {enabled ? 'ACTIVE' : 'MANUAL'}
            </span>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={onToggle}
            className={`
              relative w-12 h-6 md:w-14 md:h-7 rounded-full transition-all
              ${enabled 
                ? 'bg-cyan-500/30 border-2 border-cyan-400' 
                : 'bg-gray-500/30 border-2 border-gray-500'
              }
            `}
          >
            <motion.div
              animate={{ 
                x: enabled ? 24 : 2,
                scale: isSpeaking && enabled ? [1, 1.2, 1] : 1
              }}
              transition={{ 
                x: { type: "spring", stiffness: 500, damping: 30 },
                scale: { duration: 0.5, repeat: isSpeaking ? Infinity : 0 }
              }}
              className={`
                absolute top-0.5 w-5 h-5 md:w-6 md:h-6 rounded-full
                ${enabled 
                  ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' 
                  : 'bg-gray-400'
                }
              `}
            />
          </button>

          {/* Status Indicator */}
          {enabled && (
            <motion.div
              animate={{ 
                opacity: isSpeaking ? [1, 0.3, 1] : 1,
                scale: isSpeaking ? [1, 1.2, 1] : 1
              }}
              transition={{ duration: 0.8, repeat: isSpeaking ? Infinity : 0 }}
              className={`
                w-2 h-2 rounded-full
                ${isSpeaking ? 'bg-red-400' : 'bg-green-400'}
              `}
            />
          )}
        </div>

        {/* Tooltip */}
        {enabled && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-[10px] mono text-cyan-400/70 text-center"
          >
            {isSpeaking ? '🎤 Listening...' : '👂 Ready to listen'}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
