import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  glow?: 'none' | 'indigo' | 'purple' | 'emerald' | 'cyan';
  hoverEffect?: boolean;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  glow = 'none',
  hoverEffect = true,
  className = '',
  ...props
}) => {
  const glowStyles = {
    none: '',
    indigo: 'glow-indigo border-indigo-500/30',
    purple: 'glow-purple border-purple-500/30',
    emerald: 'glow-emerald border-emerald-500/30',
    cyan: 'shadow-glass-cyan border-cyan-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-2xl p-6 ${hoverEffect ? 'glass-card' : 'glass-panel'} ${glowStyles[glow]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
