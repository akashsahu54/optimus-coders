import { motion } from 'framer-motion';
import { GlitchText } from '../effects/GlitchText';

export const TopHUD = ({ status, isThinking }) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-3 md:top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 w-full max-w-[95vw] md:max-w-[400px]"
    >
      <div className="glass p-3 md:p-6 rounded-lg">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 md:w-4 md:h-4 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 border-t-2 border-r-2 border-cyan-400" />
        
        <div className="text-center">
          <GlitchText trigger={isThinking}>
            <h1 className="text-base sm:text-lg md:text-2xl font-black neon-text-cyan mono tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
              NEURAL INTERFACE
            </h1>
          </GlitchText>
          <div className="mt-1 md:mt-2 flex items-center justify-center gap-2 text-xs md:text-sm mono">
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-green-400"
            >
              ●
            </motion.span>
            <span className="text-cyan-400/80 truncate">
              {status || 'AWAITING INPUT'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
