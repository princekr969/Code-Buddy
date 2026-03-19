import { Server } from "socket.io";
import * as Y from "yjs";
import { File, Message, Room } from "./models/Room.model.js";

export const SOCKET_EVENTS = {
  JOIN_ROOM: "join-room",
  ROOM_JOINED: "room-joined",
  FILE_UPDATED: "file-updated",
  FILE_SYNC: "file-sync",
  REQUEST_FILE_SYNC: "request-file-sync",
  SAVE_FILE: "save-file",
  FILE_SAVED: "file-saved",
  AWARENESS_UPDATE: "awareness-update",
  USER_LEFT: "user-left",
  USER_JOINED: "user-joined",
};

export const setupSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
    transports: ["websocket"],
  });

  const docs = new Map(); // fileId -> Y.Doc

  const getYDoc = async (fileId) => {
    if (!docs.has(fileId)) {
      const ydoc = new Y.Doc();

      const file = await File.findById(fileId);

      if (file?.content) {
        const ytext = ydoc.getText("content");
        ytext.insert(0, file.content);
      }

      docs.set(fileId, ydoc);
    }

    return docs.get(fileId);
  };

  io.use((socket, next) => {
    const { userId, name } = socket.handshake.auth;
    if (!userId) return next(new Error("Auth required"));
    socket.user = { _id: userId, name };
    next();
  });

  io.on("connection", (socket) => {
    let currentRoom = null;

    // ───────── JOIN ROOM ─────────
    socket.on(SOCKET_EVENTS.JOIN_ROOM, async ({ roomId }) => {
      socket.join(roomId);
      currentRoom = roomId;

      const socketsInRoom = await io.in(roomId).fetchSockets();
      const connectedUsers = socketsInRoom
        .filter((s) => s.id !== socket.id) // exclude self
        .map((s) => s.user)
        .filter(Boolean);

      socket.emit(SOCKET_EVENTS.ROOM_JOINED, {
        roomId,
        connectedUsers,
      });


      socket.to(currentRoom).emit(SOCKET_EVENTS.USER_JOINED, {
        user: socket.user,
      });
    });

    // ───────── REQUEST FULL SYNC ─────────
    socket.on(SOCKET_EVENTS.REQUEST_FILE_SYNC, async ({ fileId }) => {
      const ydoc = await getYDoc(fileId);

      const state = Y.encodeStateAsUpdate(ydoc);

      socket.emit(SOCKET_EVENTS.FILE_SYNC, {
        fileId,
        state: Array.from(state),
      });
    });

    socket.on(SOCKET_EVENTS.AWARENESS_UPDATE, ({ fileId, states }) => {
      if (!currentRoom) return;

      socket.to(currentRoom).emit(SOCKET_EVENTS.AWARENESS_UPDATE, {
        fileId,
        states,
      });
    });

    // ───────── RECEIVE UPDATE ─────────
    socket.on(SOCKET_EVENTS.FILE_UPDATED, async ({ fileId, update }) => {
      if (!currentRoom) return;

      const ydoc = await getYDoc(fileId);

      Y.applyUpdate(ydoc, new Uint8Array(update));

      socket.to(currentRoom).emit(SOCKET_EVENTS.FILE_UPDATED, {
        fileId,
        update,
      });
    });

    socket.on(SOCKET_EVENTS.SAVE_FILE, async ({ fileId, content }) => {
      if (!content) {
        // fallback to Yjs doc if no content sent
        const ydoc = docs.get(fileId);
        if (!ydoc) return;
        content = ydoc.getText("content").toString();
      }

      await File.findByIdAndUpdate(fileId, { content });

      await File.findByIdAndUpdate(fileId, { content });
      io.to(currentRoom).emit(SOCKET_EVENTS.FILE_SAVED, {
        fileId,
        content,
      });

      console.log("Saved file:", fileId);
    });


    socket.on("disconnect", () => {
      socket.to(currentRoom).emit(SOCKET_EVENTS.USER_LEFT, {
        user: socket.user,
      });
    });
  });

  return io;
};