import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@/components/common/Logo';
import { FeatureList } from './FeatureList';
import { cn } from '@/lib/cn';

/**
 * Enterprise Brand Panel (Left Split Layout panel) with animated features and premium gradient backdrop.
 * @param {object} props - Component props including className.
 */
export const BrandPanel = ({ className }) => {
  return (
    <div
      className={cn(
        'relative hidden lg:flex flex-col justify-between p-10 xl:p-12 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950/90 to-indigo-950 border border-slate-800/80 shadow-2xl text-white select-none min-h-[640px]',
        className
      )}
    >
      {/* Background ambient glowing shapes within the panel */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary/25 blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none animate-pulse-subtle" />
      
      {/* Subtle top-light border accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Top Header Logo */}
      <div className="relative z-10 flex items-center justify-between">
        <Logo variant="light" size="lg" />
        <span className="text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-white/10 text-blue-200 border border-white/15">
          Workspace SSO
        </span>
      </div>

      {/* Middle Content */}
      <div className="relative z-10 my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="space-y-3 mb-4"
        >
          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Welcome Back
          </h1>
          <p className="text-base xl:text-lg text-slate-300 font-normal leading-relaxed max-w-md">
            Sign in to continue to your workspace.
          </p>
        </motion.div>

        {/* Feature Cards List */}
        <FeatureList />
      </div>

      {/* Bottom Panel Info */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Systems Operational</span>
        </div>
        <span>v2.4.0 (Enterprise Edge)</span>
      </div>
    </div>
  );
};
