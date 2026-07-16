import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Lock } from 'lucide-react';
import { featureCardVariants } from '@/lib/animations';
import { cn } from '@/lib/cn';

const iconMap = {
  ShieldCheck,
  Zap,
  Lock,
};

/**
 * Individual feature card displayed on the Brand Panel (Desktop left panel).
 * @param {object} props - Component props including feature data and index.
 */
export const FeatureCard = ({ feature, index, className }) => {
  const IconComponent = iconMap[feature.iconName] || ShieldCheck;

  return (
    <motion.div
      custom={index}
      variants={featureCardVariants}
      whileHover="hover"
      className={cn(
        'group relative rounded-2xl p-5 bg-white/10 dark:bg-white/5 border border-white/15 backdrop-blur-md shadow-lg transition-colors duration-300 hover:bg-white/15 hover:border-white/25 select-none',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-white/20 text-blue-300 group-hover:scale-110 group-hover:text-white transition-all duration-300 shadow-inner">
          <IconComponent className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-bold text-white text-base tracking-tight truncate">
              {feature.title}
            </h3>
            {feature.badge && (
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 shrink-0">
                {feature.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-300 font-normal leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
