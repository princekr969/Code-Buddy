import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuthContext } from './AuthContext';
import { useRoomContext } from './RoomContext';
import { SocketEvent } from '../types/socket';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
};

export const SocketProvider = ({
  children,
  url = import.meta.env.VITE_REACT_APP_SOCKET_URL || 'http://localhost:3001',
}) => {
  const { currentUser } = useAuthContext();
  const { roomId, setUsers } = useRoomContext();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const socketInstanceRef = useRef(null);

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
    socketInstanceRef.current = socket;

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

    socket.on(SocketEvent.ROOM_JOINED, ({ roomId, connectedUsers }) => {
      setUsers([currentUser, ...connectedUsers]);
      console.log(`Successfully joined room: ${roomId}`);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      socketInstanceRef.current = null;
      setIsConnected(false);
    };
  }, [url, currentUser]);

  // Re-join room when roomId changes
  useEffect(() => {
    if (isConnected && socketRef.current && roomId) {
      socketRef.current.emit(SocketEvent.JOIN_ROOM, { roomId, userId: currentUser?._id });
    }
  }, [roomId, isConnected, currentUser]);

  const emit = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit:', event);
    }
  }, []);

  const on = useCallback((event, callback) => {
    socketRef.current?.on(event, callback);
    return () => socketRef.current?.off(event, callback);
  }, []);

  const off = useCallback((event, callback) => {
    socketRef.current?.off(event, callback);
  }, []);

  const once = useCallback((event, callback) => {
    socketRef.current?.once(event, callback);
  }, []);

  // ── value uses a getter so consumers always read the live socket ──────────
  const value = {
    get socket() { return socketRef.current; },
    isConnected,
    emit,
    on,
    off,
    once,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};