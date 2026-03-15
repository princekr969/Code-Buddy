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
        // Leave previous room if any
        if (currentRoom) {
          socket.leave(currentRoom);
          io.to(currentRoom).emit(SOCKET_EVENTS.USER_LEFT, { user: socket.user });
        }

        // Join new room
        socket.join(roomId);
        currentRoom = roomId;

        // Notify others in the room
        socket.to(roomId).emit(SOCKET_EVENTS.USER_JOINED, { user: socket.user });

        // Send confirmation to the joining client
        socket.emit(SOCKET_EVENTS.ROOM_JOINED, { roomId });

        console.log(`${socket.user.name} joined room ${roomId}`);
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // ---- FILE UPDATES (Yjs binary) ----
    socket.on(SOCKET_EVENTS.FILE_UPDATED, ({ fileId, update }) => {
      // Broadcast the binary update to all other clients in the same room
      if (currentRoom) {
        socket.to(currentRoom).emit(SOCKET_EVENTS.FILE_UPDATED, { fileId, update });
      }
    });

    // ---- FILE SAVE (persist to database) ----
    socket.on(SOCKET_EVENTS.FILE_SAVED, async ({ fileId, content }) => {
      try {
        // Update the file content in the database
        await File.findByIdAndUpdate(fileId, { content });
        console.log(`File ${fileId} saved by ${socket.user.name}`);

        // Notify other clients that the file has been saved (optional)
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
        // Save the new file to the database (assuming file includes room reference)
        const newFile = new File({
          name: file.name,
          content: file.content || '',
          room: file.room, // room ID should be provided
          owner: socket.user._id, // set owner from authenticated user
        });
        await newFile.save();

        // Also add file reference to the Room document
        await Room.findByIdAndUpdate(file.room, {
          $push: { files: newFile._id }
        });

        // Broadcast the created file to others in the room
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

    // ---- FILE DELETED ----
    socket.on(SOCKET_EVENTS.FILE_DELETED, async ({ fileId }) => {
      try {
        // Remove the file from database
        const file = await File.findByIdAndDelete(fileId);
        if (file) {
          // Remove file reference from its room
          await Room.findByIdAndUpdate(file.room, {
            $pull: { files: fileId }
          });
        }

        // Broadcast deletion to others
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

      try {
        // Create and save the message
        const message = new Message({
          user: socket.user._id,
          message: content,
          room: currentRoom,
        });
        await message.save();

        // Populate user info for the client
        const populatedMessage = await message.populate('user', 'name');

        // Broadcast to all clients in the room (including sender)
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
        // Notify others that user left
        socket.to(currentRoom).emit(SOCKET_EVENTS.USER_LEFT, { user: socket.user });
      }
    });
  });

  return io;
};