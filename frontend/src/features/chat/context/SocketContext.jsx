import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../auth/store/authContext';

const SocketContext = createContext(null);

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL;

export const SocketProvider = ({ children }) => {
  const { token } = useAuth();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      setIsConnected(false);
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: {
        token
      },
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    socket.on('connect', () => {

      setIsConnected(true);
    });

    socket.on('disconnect', reason => {
      setIsConnected(false);
    });

    socket.on('connect_error', error => {
      console.error(
        '[CHAT SOCKET] Connect error:',
        error.message
      );

      setIsConnected(false);
    });

    return () => {
      socket.disconnect();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }

      setIsConnected(false);
    };
  }, [token]);

  const disconnectSocket = () => {
    if (!socketRef.current) {
      return;
    }

    socketRef.current.disconnect();
    socketRef.current = null;
    setIsConnected(false);
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        disconnectSocket
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () =>
  useContext(SocketContext);