import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export const BootSequence = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [show, setShow] = useState(true);

  const bootMessages = [
    'INITIALIZING NEURAL INTERFACE...',
    'LOADING AI CORE SYSTEMS...',
    'ESTABLISHING QUANTUM LINK...',
    'CALIBRATING VOICE RECOGNITION...',
    'SYSTEM READY',
  ];

  useEffect(() => {
    const timers = bootMessages.map((_, index) => 
      setTimeout(() => setStage(index), index * 600)
    );

    const finalTimer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500);
    }, bootMessages.length * 600 + 500);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finalTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        >
          <div className="text-center space-y-6">
            {/* Logo/Title */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-6xl font-black neon-text-cyan mono tracking-wider">
                NEURAL
              </h1>
              <h2 className="text-4xl font-bold text-magenta-400 mono">
                INTERFACE
              </h2>
            </motion.div>

            {/* Boot Messages */}
            <div className="h-32 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-cyan-400 mono text-sm"
                >
                  {bootMessages[stage]}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Loading Bar */}
            <div className="w-96 h-1 bg-cyan-900/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-cyan-400 neon-glow-cyan"
                initial={{ width: '0%' }}
                animate={{ width: `${((stage + 1) / bootMessages.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Percentage */}
            <motion.div
              className="text-cyan-400/60 mono text-xs"
              key={stage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {Math.round(((stage + 1) / bootMessages.length) * 100)}%
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
