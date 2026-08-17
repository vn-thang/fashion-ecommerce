import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

export const useNotification = () => {
  const context =
    useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotification phải được sử dụng bên trong NotificationProvider'
    );
  }

  return context;
};