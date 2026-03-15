import { useState, useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuthContext } from "../../context/AuthContext";
import { useRoomContext } from "../../context/RoomContext";
import { SocketEvent } from "../../types/socket";
import toast from "react-hot-toast";
import roomService from "../../services/roomService";

export default function ChatPanel() {
  const { roomId } = useRoomContext();
  const { on, off, emit } = useSocket();
  const { currentUser } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const data = await roomService.getRoomMessages(roomId);
        if (data.success) {
          setMessages(data.messages.reverse());
          setTimeout(scrollToBottom, 100);
        } else {
          toast.error("Failed to load messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Error loading chat history");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    };

    on(SocketEvent.NEW_MESSAGE, handleNewMessage);
    return () => off(SocketEvent.NEW_MESSAGE, handleNewMessage);
  }, [on, off]);

  const sendMessage = () => {
    if (!input.trim()) return;
    emit(SocketEvent.SEND_MESSAGE, { content: input });
    setInput("");
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 border-r border-gray-700 text-white w-64">
      <div className="p-3 border-b border-gray-700 font-semibold">Chat</div>

      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {loading ? (
          <div className="text-gray-400 text-sm text-center">Loading messages...</div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.user?._id === currentUser?._id;
            return (
              <div
                key={msg._id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-2 py-2 ${
                    isOwn ? "bg-slate-700" : "bg-slate-800"
                  }`}
                > 
                {!isOwn && (
                  <div className="text-[10px] font-semibold text-slate-300">
                    {msg.user?.name || "Unknown"}
                  </div>
                )}
                  <div className="text-sm text-white pl-1">{msg.message}</div>
                  <div className="text-[10px] pl-3 text-slate-300 text-right mt-1">
                    {formatTime(msg.time)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 border-t border-gray-700">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="w-full bg-gray-800 text-white px-3 py-2 rounded text-sm"
        />
      </div>
    </div>
  );
}