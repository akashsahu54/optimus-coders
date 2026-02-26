import { motion } from 'framer-motion';

export const EnergyPulse = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[400px] h-[400px] rounded-full border border-cyan-400/20"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.8, 1.5, 2],
            opacity: [0.5, 0.3, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  );
};
