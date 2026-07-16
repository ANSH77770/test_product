import React from 'react';
import { motion } from 'framer-motion';
import { AuthHeader } from './AuthHeader';
import { CardFooter } from '@/components/common/CardFooter';
import { cardRevealVariants } from '@/lib/animations';
import { cn } from '@/lib/cn';

/**
 * Main glassmorphism authentication card container with entrance animation, header, and footer.
 * @param {object} props - Component props including title, subtitle, showLogo, children, and footerLinks.
 */
export const AuthCard = ({
  title,
  subtitle,
  showLogo = true,
  children,
  footerLinks,
  className,
}) => {
  return (
    <motion.div
      variants={cardRevealVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'w-full max-w-[480px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/80 dark:border-slate-800/80 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] dark:shadow-[0_20px_50px_rgba(0,_0,_0,_0.5)] flex flex-col justify-between z-10 relative overflow-hidden',
        className
      )}
    >
      {/* Top subtle highlight bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/80 via-blue-500 to-indigo-600 opacity-90" />

      <div>
        {title && (
          <AuthHeader
            title={title}
            subtitle={subtitle}
            showLogo={showLogo}
          />
        )}
        <div className="mt-2">{children}</div>
      </div>

      <CardFooter links={footerLinks} />
    </motion.div>
  );
};
