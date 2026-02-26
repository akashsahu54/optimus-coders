import { motion } from 'framer-motion';
import { GlitchText } from '../effects/GlitchText';

export const TopHUD = ({ status, isThinking }) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
    >
      <div className="glass p-6 rounded-lg min-w-[400px]">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
        
        <div className="text-center">
          <GlitchText trigger={isThinking}>
            <h1 className="text-2xl font-black neon-text-cyan mono tracking-wider">
              NEURAL INTERFACE
            </h1>
          </GlitchText>
          <div className="mt-2 flex items-center justify-center gap-2 text-sm mono">
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-green-400"
            >
              ●
            </motion.span>
            <span className="text-cyan-400/80">
              {status || 'AWAITING INPUT'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
