import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../shared/api/queryClient';

import { AuthProvider } from '../features/auth/store/authContext';

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}