import React from 'react';
import { Shield, Sparkles } from 'lucide-react';
import { BRAND_CONFIG } from '@/lib/config';
import { cn } from '@/lib/cn';

/**
 * Enterprise Product Logo with multi-tenant support (Custom image via .env or built-in Shield emblem).
 * @param {object} props - Component props including size and variant.
 */
export const Logo = ({ className, variant = 'default', size = 'md' }) => {
  const isDarkPanel = variant === 'light';

  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      {BRAND_CONFIG.logoUrl ? (
        /* Custom Company Logo loaded via .env */
        <img
          src={BRAND_CONFIG.logoUrl}
          alt={BRAND_CONFIG.companyName}
          className="h-8 max-w-[140px] object-contain transition-transform duration-300 hover:scale-105 shrink-0"
        />
      ) : (
        /* Default Modern Shield Icon when no custom logo image is provided */
        <div
          className={cn(
            'relative flex items-center justify-center rounded-xl p-2.5 transition-transform duration-300 hover:scale-105 shadow-md shrink-0',
            isDarkPanel
              ? 'bg-gradient-to-br from-white/20 to-white/5 border border-white/30 text-white backdrop-blur-md'
              : 'bg-gradient-to-br from-primary to-primary-700 text-white shadow-primary/25'
          )}
        >
          <Shield className="w-5 h-5 transition-transform duration-300" />
          <Sparkles className="w-2.5 h-2.5 absolute -top-0.5 -right-0.5 text-blue-200 animate-pulse" />
        </div>
      )}

      <div className="flex flex-col">
        <span
          className={cn(
            'font-bold tracking-tight leading-none text-lg flex items-center gap-1.5',
            isDarkPanel ? 'text-white' : 'text-slate-900 dark:text-white'
          )}
        >
          {BRAND_CONFIG.companyName}
          {BRAND_CONFIG.companyBadge && (
            <span
              className={cn(
                'text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md tracking-wider shrink-0',
                isDarkPanel
                  ? 'bg-white/15 text-blue-200 border border-white/20'
                  : 'bg-primary/10 text-primary border border-primary/20'
              )}
            >
              {BRAND_CONFIG.companyBadge}
            </span>
          )}
        </span>
      </div>
    </div>
  );
};
