'use client';

import React from 'react';
import App from '@/App';
import { AppProvider } from '@/contexts/StateProvider';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function HomePage() {
  // The root of the application is wrapped with StrictMode, ErrorBoundary, and the AppProvider.
  // This setup was previously in index.tsx and is now the responsibility of the root page.
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <AppProvider>
          <App />
        </AppProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}