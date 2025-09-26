'use client';

import React from 'react';
import App from '@/App';
import { AppProvider } from '@/contexts/StateProvider';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function HomePage() {
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
