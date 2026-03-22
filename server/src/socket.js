import { Server } from "socket.io";
import * as Y from "yjs";
import mongoose from "mongoose";
import { File, Room, Message } from "./models/Room.model.js";
import User from "./models/User.model.js";


export const SOCKET_EVENTS = {
  JOIN_ROOM: "join-room",
  ROOM_JOINED: "room-joined",
  LEAVE_ROOM: 'leave-room',
  ROOM_LEAVED: 'room-leaved',

  USER_JOINED: "user-joined",
  USER_LEFT: "user-left",

  FILE_SYNC: "file-sync",
  REQUEST_FILE_SYNC: "request-file-sync",

  SAVE_FILE: "save-file",
  FILE_SAVED: "file-saved",
  FILE_UPDATED: "file-updated",
  FILE_CREATED: "file-created",
  FILE_DELETED: "file-deleted",
  FILE_RENAMED: "file-renamed",


  // Chat
  SEND_MESSAGE: 'send-message',
  NEW_MESSAGE: 'new-message',

  AWARENESS_UPDATE: "awareness-update",
};

export const setupSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
    transports: ["websocket"],
  });

  const docs = new Map();

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
      try {
        
        socket.join(roomId);
        currentRoom = roomId;
        const socketsInRoom = await io.in(roomId).fetchSockets();
        const connectedUsers = socketsInRoom
          .filter((s) => s.id !== socket.id)
          .map((s) => s.user)
          .filter(Boolean);
  
        socket.emit(SOCKET_EVENTS.ROOM_JOINED, {
          roomId,
          connectedUsers,
        });
  
  
        socket.to(currentRoom).emit(SOCKET_EVENTS.USER_JOINED, {
          user: socket.user,
        });

const roomObjectId = new mongoose.Types.ObjectId(roomId);
await User.findByIdAndUpdate(socket.user._id, {
  $pull: { recentRooms: { room: roomObjectId } },
});

await User.findByIdAndUpdate(socket.user._id, {
  $push: {
    recentRooms: {
      $each: [{ room: roomObjectId, joinedAt: new Date() }],
      $position: 0,
      $slice: 10,
    },
  },})

      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' })
      }

    });

    // ───────── LEAVE ROOM ─────────
    socket.on(SOCKET_EVENTS.LEAVE_ROOM, ({ roomId }) => {
      if (!currentRoom) return;
      socket.to(currentRoom).emit(SOCKET_EVENTS.ROOM_LEAVED, {
        user: socket.user,
      });
      socket.leave(roomId);
      currentRoom = null;
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


    // ───────── FILE CREATED ─────────
    socket.on(SOCKET_EVENTS.FILE_CREATED, async ({ file }) => {
      if (!currentRoom) return;

      try {
        const newFile = await File.create({
          name: file.name,
          content: file.content || "",
          room: file.roomId,
          owner: socket.user._id,
        });

        const room = await Room.findById(file.roomId);
        room.files.push(newFile._id);
        await room.save();

        socket.to(currentRoom).emit(SOCKET_EVENTS.FILE_CREATED, {
          file: newFile,
        });

        socket.emit(SOCKET_EVENTS.FILE_CREATED_CONFIRM, {
          tempId: file.tempId,
          file: newFile,
        });

        console.log("File created:", newFile.name);
      } catch (err) {
        console.error("Failed to create file:", err);
      }
    });

    // ───────── FILE DELETED ─────────
    socket.on(SOCKET_EVENTS.FILE_DELETED, async ({ fileId }) => {
      if (!currentRoom) return;

      try {
        await File.findByIdAndDelete(fileId);

        socket.to(currentRoom).emit(SOCKET_EVENTS.FILE_DELETED, { fileId });

        console.log("File deleted:", fileId);
      } catch (err) {
        console.error("Failed to delete file:", err);
      }
    });

    // ───────── FILE RENAMED ─────────
    socket.on(SOCKET_EVENTS.FILE_RENAMED, async ({ fileId, newName }) => {
      if (!currentRoom) return;

      try {
        await File.findByIdAndUpdate(fileId, { name: newName });

        socket.to(currentRoom).emit(SOCKET_EVENTS.FILE_RENAMED, { fileId, newName });

        console.log("File renamed:", fileId, "->", newName);
      } catch (err) {
        console.error("Failed to rename file:", err);
      }
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
    });


    // ───────── SEND MESSAGE ─────────
    socket.on(SOCKET_EVENTS.SEND_MESSAGE, async ({ content }) => {
      if (!currentRoom) return;
      if (!content?.trim()) return;

      try {
        const message = await Message.create({
          room: currentRoom,
          user: socket.user._id,
          message: content.trim(),
          time: new Date(),
        });

        const populated = await message.populate("user", "name _id");

        io.to(currentRoom).emit(SOCKET_EVENTS.NEW_MESSAGE, {
          _id: populated._id,
          message: populated.message,
          time: populated.time,
          user: populated.user,
        });

        console.log("Message sent:", populated.message);
      } catch (err) {
        console.error("Failed to save message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(socket.user?.name, "disconnected");
      if (currentRoom) {
        socket.to(currentRoom).emit(SOCKET_EVENTS.ROOM_LEAVED, {
          user: socket.user,
        });
      }
    });
  });

  return io;
};