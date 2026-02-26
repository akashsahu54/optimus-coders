import { motion } from 'framer-motion';

export const NeonButton = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  className = '' 
}) => {
  const variants = {
    primary: {
      bg: 'bg-cyan-500/20',
      border: 'border-cyan-400',
      text: 'text-cyan-400',
      hover: 'hover:bg-cyan-500/30',
      glow: 'neon-glow-cyan',
    },
    danger: {
      bg: 'bg-red-500/20',
      border: 'border-red-400',
      text: 'text-red-400',
      hover: 'hover:bg-red-500/30',
      glow: 'shadow-red-400',
    },
    success: {
      bg: 'bg-green-500/20',
      border: 'border-green-400',
      text: 'text-green-400',
      hover: 'hover:bg-green-500/30',
      glow: 'shadow-green-400',
    },
  };

  const style = variants[variant];

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${style.bg} ${style.border} ${style.text} ${style.hover}
        border-2 rounded px-3 md:px-4 py-2 md:py-3 font-bold transition-all
        ${!disabled ? style.glow : 'opacity-30 cursor-not-allowed'}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};
