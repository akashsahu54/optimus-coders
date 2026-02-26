import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export const GlitchText = ({ children, trigger = false }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsGlitching(true);
      const timer = setTimeout(() => setIsGlitching(false), 300);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <motion.div
      className={isGlitching ? 'glitch' : ''}
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {children}
      {isGlitching && (
        <>
          <motion.div
            className="absolute inset-0 text-cyan-400"
            style={{ clipPath: 'inset(0 0 50% 0)' }}
            animate={{ x: [-2, 2, -2] }}
            transition={{ duration: 0.1, repeat: 3 }}
          >
            {children}
          </motion.div>
          <motion.div
            className="absolute inset-0 text-magenta-400"
            style={{ clipPath: 'inset(50% 0 0 0)' }}
            animate={{ x: [2, -2, 2] }}
            transition={{ duration: 0.1, repeat: 3 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </motion.div>
  );
};
