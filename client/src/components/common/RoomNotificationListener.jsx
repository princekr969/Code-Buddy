import { useEffect } from "react";
import { useSocket } from "../../context/SocketContext";
import { SocketEvent } from "../../types/socket";
import toast from "react-hot-toast";

export default function RoomNotificationListener() {
  const { on, off, isConnected } = useSocket();

  useEffect(() => {
    if (!isConnected) return;

    const handleUserJoined = ({ user }) => {
      toast(`${user.name} joined the room`);
    };
    const handleUserLeft = ({ user }) => {
      toast(`${user.name} left the room`, { icon: "👋" });
    };

    on(SocketEvent.USER_JOINED, handleUserJoined);
    on(SocketEvent.USER_LEFT, handleUserLeft);

    return () => {
      off(SocketEvent.USER_JOINED, handleUserJoined);
      off(SocketEvent.USER_LEFT, handleUserLeft);
    };
  }, [on, off, isConnected]);

  return null; 
}