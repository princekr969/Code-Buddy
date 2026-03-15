import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuthContext } from './AuthContext';
import { useSocket } from './SocketContext';
import { SocketEvent } from '../types/socket';

const FileContext = createContext();

export const useFileSystem = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileSystem must be used within a FileProvider');
  }
  return context;
};

export const FileProvider = ({ children, initialFiles = [] }) => {
  const { currentUser } = useAuthContext();
  const { socket, isConnected, emit } = useSocket();

  const [files, setFiles] = useState(initialFiles);
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  const createFile = useCallback(
    (fileData) => {
      const newFile = {
        _id: fileData._id || `file-${Date.now()}`,
        name: fileData.name || 'untitled',
        content: fileData.content || '',
        language: fileData.language || 'plaintext',
        owner: fileData.owner || currentUser,
        isDirty: false,
        ...fileData,
      };
      setFiles((prev) => [...prev, newFile]);
      openFile(newFile._id);

      if (isConnected) {
        emit(SocketEvent.FILE_CREATED, { file: newFile });
      }

      return newFile;
    },
    [currentUser, isConnected, emit]
  );

  const renameFile = useCallback((fileId, newPath) => {
    setFiles(prev =>
      prev.map(f => f._id === fileId ? { ...f, path: newPath, name: newPath.split('/').pop() } : f)
    );
  }, []);

  const updateFileContent = useCallback(
    (fileId, newContent, broadcast = true) => {
      setFiles((prev) =>
        prev.map((file) => (file._id === fileId ? { ...file, content: newContent, isDirty: true } : file))
      );
      setOpenFiles((prev) =>
        prev.map((file) => (file._id === fileId ? { ...file, content: newContent, isDirty: true } : file))
      );
      if (activeFile?._id === fileId) {
        setActiveFile((prev) => ({ ...prev, content: newContent, isDirty: true }));
      }

      if (broadcast && isConnected) {
        emit(SocketEvent.FILE_UPDATED, { fileId, newContent });
      }
    },
    [activeFile, isConnected, emit]
  );

  const markFileAsSaved = useCallback(
    (fileId) => {
      setFiles((prev) =>
        prev.map((file) => (file._id === fileId ? { ...file, isDirty: false } : file))
      );
      setOpenFiles((prev) =>
        prev.map((file) => (file._id === fileId ? { ...file, isDirty: false } : file))
      );
      if (activeFile?._id === fileId) {
        setActiveFile((prev) => ({ ...prev, isDirty: false }));
      }
    },
    [activeFile]
  );

  const openFile = useCallback(
    (fileId) => {
      const file = files.find((f) => f._id === fileId);
      if (!file) return;

      setOpenFiles((prev) => {
        if (prev.some((f) => f._id === fileId)) return prev;
        return [...prev, file];
      });

      setActiveFile(file);
    },
    [files]
  );

  const closeFile = useCallback(
    (fileId) => {
      setOpenFiles((prev) => prev.filter((f) => f._id !== fileId));
      if (activeFile?._id === fileId) {
        const remaining = openFiles.filter((f) => f._id !== fileId);
        setActiveFile(remaining.length > 0 ? remaining[0] : null);
      }
    },
    [activeFile, openFiles]
  );

  const deleteFile = useCallback(
    (fileId) => {
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
      closeFile(fileId);
      if (isConnected) {
        emit(SocketEvent.FILE_DELETED, { fileId });
      }
    },
    [closeFile, isConnected, emit]
  );

  const value = {
    files,
    openFiles,
    activeFile,
    setActiveFile,
    
    setFiles,
    setOpenFiles,
    createFile,
    updateFileContent,
    markFileAsSaved,
    openFile,
    closeFile,
    deleteFile,
    renameFile,
  };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};