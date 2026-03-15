import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useAuthContext } from './AuthContext';
import { useRoomContext } from './RoomContext';
import { SocketEvent } from '../types/socket';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children, url = import.meta.env.VITE_REACT_APP_SOCKET_URL || 'http://localhost:3001' }) => {
  const { currentUser } = useAuthContext();
  const { roomId } = useRoomContext();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!currentUser?._id) return;

    const socket = io(url, {
      auth: { userId: currentUser._id, name: currentUser.name },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);

      if (roomId) {
        socket.emit(SocketEvent.JOIN_ROOM, { roomId, userId: currentUser._id });
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    socket.on(SocketEvent.ROOM_JOINED, ({ roomId }) => {
      console.log(`Successfully joined room: ${roomId}`);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [url, currentUser, roomId]);

  useEffect(() => {
    if (isConnected && socketRef.current && roomId) {
      socketRef.current.emit(SocketEvent.JOIN_ROOM, { roomId, userId: currentUser?._id });
    }
  }, [roomId, isConnected, currentUser]);

  const emit = (event, data) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit:', event);
    }
  };

  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off(event, callback);
      }
    };
  };

  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  const once = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.once(event, callback);
    }
  };

  const value = {
    socket: socketRef.current,
    isConnected,
    emit,
    on,
    off,
    once,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};