
import React from 'react';
import { render } from '@testing-library/react';
import { AppProvider } from '../contexts/StateProvider';
import { AuthProvider } from '../contexts/hooks/auth/useAuth.tsx';

const AllTheProviders = ({ children }) => {
  return (
    <AuthProvider>
      <AppProvider>{children}</AppProvider>
    </AuthProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
