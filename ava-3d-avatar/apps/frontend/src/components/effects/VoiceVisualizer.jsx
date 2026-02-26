import { motion } from 'framer-motion';

export const VoiceVisualizer = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Dark Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black"
      />

      {/* Circular Equalizer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {[...Array(12)].map((_, i) => {
          const angle = (i * 360) / 12;
          const radius = 350;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <motion.div
              key={i}
              className="absolute w-1 bg-cyan-400 rounded-full neon-glow-cyan"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transformOrigin: 'center',
              }}
              animate={{
                height: [20, 60, 20],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>

      {/* Pulsing Waves */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-400/30"
          animate={{
            width: [300, 500, 700],
            height: [300, 500, 700],
            opacity: [0.5, 0.2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Scan Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent"
        animate={{
          y: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};
