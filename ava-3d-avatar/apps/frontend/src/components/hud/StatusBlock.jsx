import { motion } from 'framer-motion';

export const StatusBlock = ({ label, value, status = 'active', delay = 0 }) => {
  const statusColors = {
    active: 'text-cyan-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
    success: 'text-green-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="border-l-2 border-cyan-400/50 pl-3 flicker"
    >
      <div className="text-xs text-cyan-400/60 mono uppercase tracking-wider">{label}</div>
      <div className={`text-sm font-bold mono ${statusColors[status]}`}>{value}</div>
    </motion.div>
  );
};
