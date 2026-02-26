import { motion } from 'framer-motion';
import { RotatingRing } from './RotatingRing';
import { EnergyPulse } from './EnergyPulse';

export const AIReactor = ({ isActive, isThinking, children }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
      {/* Outer Rotating Ring */}
      <RotatingRing isActive={isActive} isThinking={isThinking} />
      
      {/* Energy Pulse Effect */}
      <EnergyPulse isActive={isActive} />
      
      {/* Digital Human (3D Canvas) */}
      <motion.div
        className="absolute inset-0"
        animate={isThinking ? { opacity: [1, 0.8, 1] } : {}}
        transition={{ duration: 0.5, repeat: isThinking ? Infinity : 0 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
