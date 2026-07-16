import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageContainer } from '@/components/common/PageContainer';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// Lazy load pages for code splitting & performance optimization
const Login = lazy(() => import('@/pages/Login'));
const OtpVerification = lazy(() => import('@/pages/OtpVerification'));

const PageFallback = () => (
  <PageContainer>
    <div className="flex flex-col items-center justify-center space-y-3 py-20">
      <LoadingSpinner size="lg" className="text-primary" />
      <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
        Loading Workspace...
      </span>
    </div>
  </PageContainer>
);

/**
 * Main application routes with lazy loading, Suspense fallback, and Framer Motion route animations.
 */
export const AppRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<PageFallback />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

export default AppRoutes;
