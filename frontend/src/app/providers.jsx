import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../shared/api/queryClient';

import { AuthProvider } from '../features/auth/store/authContext';
import { NotificationProvider } from '../features/notification/context/NotificationContext';
import { SocketProvider } from '../features/chat/context/SocketContext';

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
         <SocketProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}