import React from 'react';
import { FOOTER_LINKS } from '@/lib/constants';
import { BRAND_CONFIG } from '@/lib/config';
import { cn } from '@/lib/cn';

/**
 * Reusable footer containing legal links (Terms, Privacy Policy, Need Help) and enterprise compliance notice.
 * Reads footer text dynamically from .env via BRAND_CONFIG.
 * @param {object} props - Component props including custom links array and className.
 */
export const CardFooter = ({ links = FOOTER_LINKS, className }) => {
  return (
    <footer className={cn('mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 w-full flex flex-col items-center gap-3', className)}>
      <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
        {links.map((link, index) => (
          <React.Fragment key={link.label}>
            <a
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                // UI only demonstration
              }}
              className="hover:text-primary dark:hover:text-blue-400 transition-colors duration-200 cursor-pointer underline-offset-4 hover:underline"
            >
              {link.label}
            </a>
            {index < links.length - 1 && (
              <span className="text-slate-200 dark:text-slate-800 hidden sm:inline select-none">•</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="text-[11px] text-slate-400/80 dark:text-slate-600 tracking-tight text-center">
        {BRAND_CONFIG.footerCopyright}
      </p>
    </footer>
  );
};
