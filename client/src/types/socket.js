export const SocketEvent = {
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