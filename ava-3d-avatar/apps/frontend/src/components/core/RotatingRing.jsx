import { motion } from 'framer-motion';

export const RotatingRing = ({ isActive, isThinking }) => {
  const speed = isThinking ? 2 : isActive ? 4 : 8;
  
  return (
    <motion.div
      className="absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[600px] md:h-[600px] rounded-full border-2 border-cyan-400/30"
      style={{
        boxShadow: '0 0 20px rgba(0, 245, 255, 0.3), inset 0 0 20px rgba(0, 245, 255, 0.1)',
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {/* Corner Markers */}
      <div className="absolute top-0 left-1/2 w-1 h-4 md:w-2 md:h-8 bg-cyan-400 -translate-x-1/2 neon-glow-cyan" />
      <div className="absolute bottom-0 left-1/2 w-1 h-4 md:w-2 md:h-8 bg-cyan-400 -translate-x-1/2 neon-glow-cyan" />
      <div className="absolute left-0 top-1/2 w-4 h-1 md:w-8 md:h-2 bg-cyan-400 -translate-y-1/2 neon-glow-cyan" />
      <div className="absolute right-0 top-1/2 w-4 h-1 md:w-8 md:h-2 bg-cyan-400 -translate-y-1/2 neon-glow-cyan" />
    </motion.div>
  );
};
