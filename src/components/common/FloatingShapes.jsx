import React from 'react';
import { motion } from 'framer-motion';
import { floatingShapeVariants } from '@/lib/animations';

/**
 * Animated floating blurred background shapes providing deep glassmorphism aesthetics.
 */
export const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {/* Primary Glow Shape - Top Left */}
      <motion.div
        variants={floatingShapeVariants.shape1}
        animate="animate"
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-primary/30 to-blue-500/20 blur-3xl opacity-50 dark:opacity-40"
      />

      {/* Secondary Glow Shape - Bottom Right */}
      <motion.div
        variants={floatingShapeVariants.shape2}
        animate="animate"
        className="absolute -bottom-40 -right-40 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-purple-500/25 to-indigo-500/20 blur-3xl opacity-50 dark:opacity-35"
      />

      {/* Accent Glow Shape - Center Right */}
      <motion.div
        variants={floatingShapeVariants.shape3}
        animate="animate"
        className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-gradient-to-bl from-cyan-400/20 to-blue-600/15 blur-3xl opacity-40 dark:opacity-30"
      />

      {/* Subtle Grid Overlay for Enterprise Feel */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60 dark:opacity-30"
      />
    </div>
  );
};
