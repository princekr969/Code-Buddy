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
  const joinedRoomRef = useRef(null); // tracks which room was actually joined

  // Create socket once per user
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
      // Reset so the roomId effect re-joins after reconnection
      joinedRoomRef.current = null;
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      joinedRoomRef.current = null;
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      joinedRoomRef.current = null;
      setIsConnected(false);
    };
  }, [url, currentUser]);

  // Join room — guarded so JOIN_ROOM is never emitted twice for the same room
  useEffect(() => {
    if (!isConnected || !socketRef.current || !roomId) return;
    if (joinedRoomRef.current === roomId) return; // already joined, skip

    joinedRoomRef.current = roomId;
    socketRef.current.emit(SocketEvent.JOIN_ROOM, { roomId, userId: currentUser?._id });
  }, [roomId, isConnected, currentUser]);

  // ROOM_JOINED listener — separate effect so it survives reconnects
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleRoomJoined = ({ connectedUsers }) => {
      setUsers([currentUser, ...(connectedUsers || [])]);
    };

    socket.on(SocketEvent.ROOM_JOINED, handleRoomJoined);
    return () => socket.off(SocketEvent.ROOM_JOINED, handleRoomJoined);
  }, [currentUser, setUsers, isConnected]);

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