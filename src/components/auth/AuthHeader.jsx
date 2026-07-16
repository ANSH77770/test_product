import React from 'react';
import { CardHeader } from '@/components/common/CardHeader';
import { Logo } from '@/components/common/Logo';

/**
 * Specialized header for authentication cards with product logo, title, and subtitle.
 * @param {object} props - Component props including title, subtitle, and showLogo flag.
 */
export const AuthHeader = ({ title, subtitle, showLogo = true, className }) => {
  return (
    <CardHeader
      title={title}
      subtitle={subtitle}
      logoSlot={showLogo ? <Logo variant="default" size="md" /> : null}
      className={className}
    />
  );
};
