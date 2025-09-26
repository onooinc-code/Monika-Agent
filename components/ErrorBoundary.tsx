'use client';

import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// FIX: The ErrorBoundary class must extend React.Component to function correctly as a React Error Boundary.
// This inheritance provides access to component lifecycle methods like componentDidCatch, as well as state management (this.setState) and props (this.props).
class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    error: undefined,
    errorInfo: undefined,
  };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      error: error,
      errorInfo: undefined,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    // FIX: 'this.setState' is now available because ErrorBoundary extends React.Component.
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#0a0a0f] p-8 text-gray-300">
          <div className="max-w-2xl rounded-lg border border-red-500/50 bg-red-900/20 p-8 text-center">
            <h1 className="text-2xl font-bold text-red-400">Something went wrong.</h1>
            <p className="mt-4">An unexpected rendering error occurred, and the application cannot continue. Please try refreshing the page. If the problem persists, please report the details below.</p>
            <div className="mt-6 text-left">
              <details>
                <summary className="cursor-pointer font-semibold text-gray-400">Error Details</summary>
                <pre className="mt-2 h-64 overflow-y-auto whitespace-pre-wrap rounded-md bg-black/30 p-4 text-left font-mono text-xs text-red-300">
                  {this.state.error?.toString()}
                  <br />
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            </div>
          </div>
        </div>
      );
    }

    // FIX: 'this.props' is now available because ErrorBoundary extends React.Component.
    return this.props.children;
  }
}

export default ErrorBoundary;
