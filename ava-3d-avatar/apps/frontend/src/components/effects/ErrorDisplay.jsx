import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export const ErrorDisplay = ({ error, onDismiss }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (error) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onDismiss, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, onDismiss]);

  return (
    <AnimatePresence>
      {show && error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <motion.div
            animate={{ x: [-2, 2, -2, 0] }}
            transition={{ duration: 0.2, times: [0, 0.25, 0.5, 1] }}
            className="glass p-6 rounded-lg border-2 border-red-400 min-w-[400px]"
            style={{
              boxShadow: '0 0 20px rgba(255, 0, 68, 0.5)',
            }}
          >
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-400" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-400" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-400" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-400" />

            <div className="text-center">
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-red-400 text-4xl mb-4"
              >
                ⚠
              </motion.div>
              <h3 className="text-red-400 font-bold mono text-lg mb-2">
                SYSTEM ERROR
              </h3>
              <p className="text-red-400/80 mono text-sm">
                {error}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
