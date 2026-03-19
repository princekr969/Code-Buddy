import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { useAuthContext } from "./AuthContext";
import { useRoomContext } from "./RoomContext";
import { useSocket } from "./SocketContext";
import { SocketEvent } from "../types/socket";

const FileContext = createContext();

export const useFileSystem = () => {
  const context = useContext(FileContext);
  if (!context) throw new Error("useFileSystem must be used within a FileProvider");
  return context;
};

export const FileProvider = ({ children, initialFiles = [] }) => {
  const { currentUser } = useAuthContext();
  const { roomId } = useRoomContext();
  const { isConnected, emit } = useSocket();

  const [files, setFiles] = useState(initialFiles);
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  // ── stable ref so callbacks always see latest files without re-creating ──
  const filesRef = useRef(files);
  const openFilesRef = useRef(openFiles);
  const activeFileRef = useRef(activeFile);

  // keep refs in sync
  const setFilesWithRef = useCallback((updater) => {
    setFiles((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      filesRef.current = next;
      return next;
    });
  }, []);

  const setOpenFilesWithRef = useCallback((updater) => {
    setOpenFiles((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      openFilesRef.current = next;
      return next;
    });
  }, []);

  const setActiveFileWithRef = useCallback((updater) => {
    setActiveFile((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      activeFileRef.current = next;
      return next;
    });
  }, []);

  // ── openFile reads from ref so it never has a stale files closure ─────────
  const openFile = useCallback((fileId) => {
    const file = filesRef.current.find((f) => f._id === fileId);
    if (!file) return;

    setOpenFilesWithRef((prev) => {
      if (prev.some((f) => f._id === fileId)) return prev;
      return [...prev, file];
    });

    setActiveFileWithRef(file);
  }, [setOpenFilesWithRef, setActiveFileWithRef]);

  const createFile = useCallback(
    (fileData) => {
      const newFile = {
        _id: fileData._id || `file-${Date.now()}`,
        name: fileData.name || "untitled",
        content: fileData.content || "",
        isDirty: false,
        ...fileData,
      };

      setFilesWithRef((prev) => [...prev, newFile]);

      setOpenFilesWithRef((prev) => {
        if (prev.some((f) => f._id === newFile._id)) return prev;
        return [...prev, newFile];
      });
      setActiveFileWithRef(newFile);

      if (isConnected && roomId) {
        emit(SocketEvent.FILE_CREATED, {
          file: { name: newFile.name, content: newFile.content, room: roomId },
        });
      }

      return newFile;
    },
    [isConnected, emit, roomId, setFilesWithRef, setOpenFilesWithRef, setActiveFileWithRef],
  );

  const renameFile = useCallback(
    (fileId, newName) => {
      setFilesWithRef((prev) =>
        prev.map((f) => (f._id === fileId ? { ...f, name: newName } : f)),
      );
      setOpenFilesWithRef((prev) =>
        prev.map((f) => (f._id === fileId ? { ...f, name: newName } : f)),
      );
      setActiveFileWithRef((prev) =>
        prev?._id === fileId ? { ...prev, name: newName } : prev,
      );

      if (isConnected) emit(SocketEvent.FILE_RENAMED, { fileId, newName });
    },
    [isConnected, emit, setFilesWithRef, setOpenFilesWithRef, setActiveFileWithRef],
  );

  const markFileAsSaved = useCallback(
    (fileId) => {
      const mark = (f) => (f._id === fileId ? { ...f, isDirty: false } : f);
      setFilesWithRef((prev) => prev.map(mark));
      setOpenFilesWithRef((prev) => prev.map(mark));
      setActiveFileWithRef((prev) => (prev?._id === fileId ? { ...prev, isDirty: false } : prev));
    },
    [setFilesWithRef, setOpenFilesWithRef, setActiveFileWithRef],
  );

  const closeFile = useCallback(
    (fileId) => {
      setOpenFilesWithRef((prev) => prev.filter((f) => f._id !== fileId));
      setActiveFileWithRef((prev) => {
        if (prev?._id !== fileId) return prev;
        const remaining = openFilesRef.current.filter((f) => f._id !== fileId);
        return remaining.length > 0 ? remaining[0] : null;
      });
    },
    [setOpenFilesWithRef, setActiveFileWithRef],
  );

  const deleteFile = useCallback(
    (fileId) => {
      setFilesWithRef((prev) => prev.filter((f) => f._id !== fileId));
      closeFile(fileId);
      if (isConnected) emit(SocketEvent.FILE_DELETED, { fileId });
    },
    [closeFile, isConnected, emit, setFilesWithRef],
  );

  const value = {
    files,
    openFiles,
    activeFile,
    setActiveFile: setActiveFileWithRef,
    setFiles: setFilesWithRef,
    setOpenFiles: setOpenFilesWithRef,
    createFile,
    markFileAsSaved,
    openFile,
    closeFile,
    deleteFile,
    renameFile,
  };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};