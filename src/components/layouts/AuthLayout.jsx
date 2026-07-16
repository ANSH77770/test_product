import React from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageTransition } from '@/components/common/PageTransition';

/**
 * Common layout wrapper providing animated gradient background, floating elements, and page transitions.
 * @param {object} props - Component props including children and className.
 */
export const AuthLayout = ({ children, className }) => {
  return (
    <PageContainer className={className}>
      <PageTransition>{children}</PageTransition>
    </PageContainer>
  );
};
