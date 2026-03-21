export const SocketEvent = {
  // Connection / Room
  JOIN_ROOM: 'join-room',
  ROOM_JOINED: 'room-joined',
  LEAVE_ROOM: 'leave-room',
  ROOM_LEAVED: 'room-leaved',

  USER_JOINED: "user-joined",
  USER_LEFT: "user-left",


  // File editing
  FILE_UPDATED: 'file-updated',
  SAVE_FILE: 'save-file',
  FILE_SAVED: 'file-saved',
  FILE_CREATED: 'file-created',
  FILE_CREATED_CONFIRM: "file-created-confirm",
  FILE_DELETED: 'file-deleted',
  FILE_RENAMED: 'file-renamed',

  // Chat
  SEND_MESSAGE: 'send-message',
  NEW_MESSAGE: 'new-message',

  REGISTER_AWARENESS: 'register-awareness',
  AWARENESS_UPDATE: "awareness-update",
  FILE_SYNC: "file-sync",
  REQUEST_FILE_SYNC: "request-file-sync",
};