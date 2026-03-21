import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import { useAuthContext } from "../../context/AuthContext";
import { useRoomContext } from "../../context/RoomContext";
import { SocketEvent } from "../../types/socket";
import { Copy, Share2, LogOut } from "lucide-react";
import toast from "react-hot-toast";

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
};

export default function UsersPanel() {
  const navigate = useNavigate();
  const { roomId, users, setUsers } = useRoomContext();
  const { currentUser } = useAuthContext();
  const { socket, on, off, emit } = useSocket();
  

useEffect(() => {
  const handleUserJoined = ({ user }) => {
    setUsers((prev) => {
      if (prev.some((u) => u._id === user._id)) return prev;
      return [...prev, user];
    });
  };

  const handleUserLeft = ({ user }) => {
    setUsers((prev) => prev.filter((u) => u._id !== user._id));
  };

  on(SocketEvent.USER_JOINED, handleUserJoined);
  on(SocketEvent.ROOM_LEAVED, handleUserLeft);

  return () => {
    off(SocketEvent.USER_JOINED, handleUserJoined);
    off(SocketEvent.ROOM_LEAVED, handleUserLeft);
  };
}, [on, off, setUsers]);


  const handleCopyRoomId = () => {
    if (!roomId) return;
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied to clipboard");
  };

  const handleShareRoom = () => {
    if (!roomId) return;
    const url = window.location.href; 
    navigator.clipboard.writeText(url);
    toast.success("Room URL copied to clipboard");
  };

  const handleLeaveRoom = () => {
    if (socket && roomId) {
      emit(SocketEvent.LEAVE_ROOM, { roomId });
    }

    navigate("/dashboard/"+currentUser._id);
  };

  return (
    <div className="h-full bg-slate-950 border-r-2 border-gray-700 text-white w-64 flex flex-col">
      <div className="p-3 border-b border-gray-700">
        <h3 className="font-semibold">Connected Users</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {users.map((user) => {
          const isCurrentUser = user._id === currentUser?._id;
          return (
            <div key={user._id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-white uppercase">
                {getInitials(user.name)}
              </div>
              <div className="flex-1">
                <span className="text-sm">{user.name}</span>
                {isCurrentUser && (
                  <span className="text-xs text-gray-400 ml-1">(You)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer actions */}
      <div className="p-3 border-t border-gray-700 space-y-2">
        <button
          onClick={handleCopyRoomId}
          className="flex items-center gap-2 w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm font-medium transition"
        >
          <Copy size={16} />
          Copy Room ID
        </button>
        <button
          onClick={handleShareRoom}
          className="flex items-center gap-2 w-full px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm font-medium transition"
        >
          <Share2 size={16} />
          Share Room URL
        </button>
        <button
          onClick={handleLeaveRoom}
          className="flex items-center gap-2 w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition"
        >
          <LogOut size={16} />
          Leave Room
        </button>
      </div>
    </div>
  );
}