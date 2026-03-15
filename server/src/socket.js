import { Server } from 'socket.io';
import { File, Message, Room } from './models/Room.model.js';


export const SOCKET_EVENTS = {
  // Connection / Room
  JOIN_ROOM: 'join-room',
  ROOM_JOINED: 'room-joined',
  LEAVE_ROOM: 'leave-room',
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',

  // File editing
  FILE_UPDATED: 'file-updated',
  FILE_SAVED: 'file-saved',
  FILE_CREATED: 'file-created',
  FILE_DELETED: 'file-deleted',
  FILE_RENAMED: 'file-renamed',

  // Typing indicators
  TYPING_START: 'typing-start',
  TYPING_PAUSE: 'typing-pause',

  // Chat
  SEND_MESSAGE: 'send-message',
  NEW_MESSAGE: 'new-message',
};

export const setupSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
    transports: ['websocket'],
  });

  io.use((socket, next) => {
    const { userId, name } = socket.handshake.auth;
    if (!userId) {
      return next(new Error('Authentication required'));
    }
    socket.user = { _id: userId, name };
    next();
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.id})`);

    let currentRoom = null;

    // ---- ROOM MANAGEMENT ----
    socket.on(SOCKET_EVENTS.JOIN_ROOM, async ({ roomId }) => {
      try {
        if (currentRoom) {
          socket.leave(currentRoom);
          io.to(currentRoom).emit(SOCKET_EVENTS.USER_LEFT, { user: socket.user });
        }

        socket.join(roomId);
        currentRoom = roomId;

        socket.to(roomId).emit(SOCKET_EVENTS.USER_JOINED, { user: socket.user });

        socket.emit(SOCKET_EVENTS.ROOM_JOINED, { roomId });

        console.log(`${socket.user.name} joined room ${roomId}`);
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    

    // ---- FILE UPDATES 
    socket.on(SOCKET_EVENTS.FILE_UPDATED, ({ fileId, update }) => {
      if (currentRoom) {
        socket.to(currentRoom).emit(SOCKET_EVENTS.FILE_UPDATED, { fileId, update });
      }
    });

    // ---- FILE SAVE ----
    socket.on(SOCKET_EVENTS.FILE_SAVED, async ({ fileId, content }) => {
      try {
        await File.findByIdAndUpdate(fileId, { content });
        console.log(`File ${fileId} saved by ${socket.user.name}`);

        if (currentRoom) {
          socket.to(currentRoom).emit(SOCKET_EVENTS.FILE_SAVED, { fileId });
        }
      } catch (error) {
        console.error('Error saving file:', error);
        socket.emit('error', { message: 'Failed to save file' });
      }
    });

    // ---- FILE CREATED ----
    socket.on(SOCKET_EVENTS.FILE_CREATED, async ({ file }) => {
      try {
        console.log(`Creating file ${file.name} in room ${file.room} by ${socket.user.name}`);
        const newFile = new File({
          name: file.name,
          content: file.content || '',
          room: file.room, 
          owner: socket.user._id, 
        });
        await newFile.save();

        await Room.findByIdAndUpdate(file.room, {
          $push: { files: newFile._id }
        });

        if (currentRoom) {
          io.to(currentRoom).emit(SOCKET_EVENTS.FILE_CREATED, {
            file: { ...newFile.toObject(), owner: socket.user }
          });
        }
      } catch (error) {
        console.error('Error creating file:', error);
        socket.emit('error', { message: 'Failed to create file' });
      }
    });

    // ---- FILE RENAMED ----
    socket.on(SOCKET_EVENTS.FILE_RENAMED, async ({ fileId, newName }) => {
      try {
        const updatedFile = await File.findByIdAndUpdate(
          fileId,
          { name: newName },
          { new: true }
        );

        if (updatedFile && currentRoom) {
          io.to(currentRoom).emit(SOCKET_EVENTS.FILE_RENAMED, {
            fileId,
            newName,
          });
          console.log(`File ${fileId} renamed to ${newName} by ${socket.user.name}`);
        }
      } catch (error) {
        console.error('Error renaming file:', error);
        socket.emit('error', { message: 'Failed to rename file' });
      }
    });

    // ---- FILE DELETED ----
    socket.on(SOCKET_EVENTS.FILE_DELETED, async ({ fileId }) => {
      try {
        const file = await File.findByIdAndDelete(fileId);
        if (file) {
          await Room.findByIdAndUpdate(file.room, {
            $pull: { files: fileId }
          });
        }

        if (currentRoom) {
          io.to(currentRoom).emit(SOCKET_EVENTS.FILE_DELETED, { fileId });
        }
      } catch (error) {
        console.error('Error deleting file:', error);
        socket.emit('error', { message: 'Failed to delete file' });
      }
    });

    // ---- CHAT MESSAGES ----
    socket.on(SOCKET_EVENTS.SEND_MESSAGE, async ({ content }) => {
      if (!currentRoom) return;
      console.log(`Message from ${socket.user.name} in room ${currentRoom}: ${content}`);

      try {
        const message = new Message({
          user: socket.user._id,
          message: content,
          room: currentRoom,
        });
        await message.save();

        const populatedMessage = await message.populate('user', 'name');

        io.to(currentRoom).emit(SOCKET_EVENTS.NEW_MESSAGE, populatedMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // ---- TYPING INDICATORS ----
    socket.on(SOCKET_EVENTS.TYPING_START, ({ fileId, cursorPosition }) => {
      if (currentRoom) {
        socket.to(currentRoom).emit(SOCKET_EVENTS.TYPING_START, {
          user: socket.user,
          fileId,
          cursorPosition,
        });
      }
    });

    socket.on(SOCKET_EVENTS.TYPING_PAUSE, ({ fileId }) => {
      if (currentRoom) {
        socket.to(currentRoom).emit(SOCKET_EVENTS.TYPING_PAUSE, {
          user: socket.user,
          fileId,
        });
      }
    });

    // ---- DISCONNECT ----
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name} (${socket.id})`);
      if (currentRoom) {
        socket.to(currentRoom).emit(SOCKET_EVENTS.USER_LEFT, { user: socket.user });
      }
    });
  });

  return io;
};