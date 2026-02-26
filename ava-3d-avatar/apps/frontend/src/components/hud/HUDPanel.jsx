import { motion } from 'framer-motion';
import { StatusBlock } from './StatusBlock';

export const HUDPanel = ({ position = 'left', stats }) => {
  const isLeft = position === 'left';
  
  return (
    <motion.div
      initial={{ x: isLeft ? -100 : 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`fixed top-20 ${isLeft ? 'left-6' : 'right-6'} z-20 pointer-events-none`}
    >
      <div className="glass p-4 rounded-lg space-y-3 min-w-[200px]">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
        
        {stats.map((stat, index) => (
          <StatusBlock key={index} {...stat} delay={index * 0.1} />
        ))}
      </div>
    </motion.div>
  );
};
