import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { AppRoutes } from '@/routes/AppRoutes';
import { BRAND_CONFIG } from '@/lib/config';
import { cn } from '@/lib/cn';

/**
 * Root Application component providing router, dynamic white-label brand binding, and dark/light theme switch.
 */
export const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(BRAND_CONFIG.defaultTheme === 'dark');

  // Apply dark/light theme classes to document root
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Apply dynamic white-label brand settings (.env) to page title and favicon
  useEffect(() => {
    if (BRAND_CONFIG.appTitle) {
      document.title = BRAND_CONFIG.appTitle;
    }

    if (BRAND_CONFIG.faviconUrl) {
      let faviconLink = document.querySelector("link[rel~='icon']");
      if (!faviconLink) {
        faviconLink = document.createElement('link');
        faviconLink.rel = 'icon';
        document.head.appendChild(faviconLink);
      }
      faviconLink.href = BRAND_CONFIG.faviconUrl;
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground relative selection:bg-primary/20 selection:text-primary">
        {/* Top Floating Theme & Staging Toggle Bar */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border shadow-lg backdrop-blur-md cursor-pointer select-none',
              isDarkMode
                ? 'bg-slate-900/90 border-slate-700 text-blue-200 hover:bg-slate-800'
                : 'bg-white/90 border-slate-200 text-slate-800 hover:bg-slate-50'
            )}
            title="Toggle Dark/Light Mode"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>

        {/* Routes */}
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
};

export default App;
