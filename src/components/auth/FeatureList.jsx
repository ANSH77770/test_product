import React from 'react';
import { motion } from 'framer-motion';
import { FeatureCard } from './FeatureCard';
import { BRAND_FEATURES } from '@/lib/constants';
import { containerVariants } from '@/lib/animations';
import { cn } from '@/lib/cn';

/**
 * List container for rendering all brand features with staggered Framer Motion entrances.
 * @param {object} props - Component props including features array and className.
 */
export const FeatureList = ({ features = BRAND_FEATURES, className }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn('flex flex-col space-y-4 w-full mt-6', className)}
    >
      {features.map((feature, idx) => (
        <FeatureCard key={feature.id} feature={feature} index={idx} />
      ))}
    </motion.div>
  );
};
