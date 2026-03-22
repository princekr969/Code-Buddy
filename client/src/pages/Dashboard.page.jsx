import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Loader, Plus, Link as LinkIcon, Calendar, X, ArrowRight, Clock } from "lucide-react";
import roomService from "../services/roomService";
import RecentRooms from "../components/room/RecentRooms";

const ACCENT_COLORS = [
  { bg: "bg-violet-500", text: "text-violet-400", border: "hover:border-violet-500/30", ring: "group-hover:ring-violet-500/20" },
  { bg: "bg-blue-500",   text: "text-blue-400",   border: "hover:border-blue-500/30",   ring: "group-hover:ring-blue-500/20"   },
  { bg: "bg-emerald-500",text: "text-emerald-400",border: "hover:border-emerald-500/30",ring: "group-hover:ring-emerald-500/20"},
  { bg: "bg-rose-500",   text: "text-rose-400",   border: "hover:border-rose-500/30",   ring: "group-hover:ring-rose-500/20"   },
  { bg: "bg-amber-500",  text: "text-amber-400",  border: "hover:border-amber-500/30",  ring: "group-hover:ring-amber-500/20"  },
  { bg: "bg-cyan-500",   text: "text-cyan-400",   border: "hover:border-cyan-500/30",   ring: "group-hover:ring-cyan-500/20"   },
];

function roomAccent(id = "") {
  const idx = [...id].reduce((a, c) => a + c.charCodeAt(0), 0) % ACCENT_COLORS.length;
  return ACCENT_COLORS[idx];
}

function RoomSkeleton() {
  return (
    <div className="bg-gray-900/50 border border-gray-800/60 rounded-2xl p-6 animate-pulse">
      <div className="flex items-start justify-between mb-5">
        <div className="w-10 h-10 rounded-xl bg-gray-800" />
        <div className="w-12 h-5 rounded-md bg-gray-800" />
      </div>
      <div className="w-2/3 h-4 rounded bg-gray-800 mb-2" />
      <div className="w-1/2 h-3 rounded bg-gray-800/60 mb-6" />
      <div className="w-full h-9 rounded-xl bg-gray-800/60" />
    </div>
  );
}

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomTitle, setRoomTitle] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    if (!roomTitle.trim()) { toast.error("Room title cannot be empty"); return; }
    setLoading(true);
    try {
      const res = await roomService.createRoom(roomTitle);
      if (res.success) {
        toast.success("Room created");
        setRooms((prev) => [...prev, res.room]);
        setShowCreateModal(false);
        setRoomTitle("");
        navigate(`/room/${res.room._id}`);
      } else toast.error(res.message || "Failed to create room");
    } catch { toast.error("Failed to create room"); }
    finally { setLoading(false); }
  };

  const handleJoin = async (roomId) => {
    setLoading(true);
    try {
      const res = await roomService.getRoomById(roomId);
      if (res.success) navigate(`/room/${roomId}`);
      else toast.error(res.message || "Room not found");
    } catch { toast.error("Failed to join room"); }
    finally { setLoading(false); }
  };

  const handleJoinRoom = async () => {
    if (!joinRoomId.trim()) { toast.error("Room ID cannot be empty"); return; }
    setLoading(true);
    try {
      const res = await roomService.getRoomById(joinRoomId);
      if (res.success) navigate(`/room/${joinRoomId}`);
      else toast.error(res.message || "Room not found");
    } catch { toast.error("Failed to join room"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      setLoadingRooms(true);
      try {
        const data = await roomService.getRoomsById(currentUser._id);
        if (!data.success) toast.error(data.message);
        else setRooms(data.rooms);
      } catch (e) { console.error(e); }
      finally { setLoadingRooms(false); }
    };
    fetchRooms();
  }, [currentUser._id]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 flex items-start justify-center" aria-hidden>
        <div className="w-150 h-100 rounded-full bg-purple-900/20 blur-[120px] translate-y-[-30%]" />
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-position-[64px_64px] [radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-center items-center">
            <Loader className="w-8 h-8 text-purple-400 animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div>
            <div className="inline-flex items-center rounded-full bg-gray-800/80 px-3 py-1 text-xs text-gray-300 mb-4 border border-gray-700/60">
              <span className="relative flex h-1.5 w-1.5 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              Your workspace
            </div>
            <h1 className="text-3xl font-bold text-white mb-1.5">
              Welcome back, <span className="text-purple-400">{currentUser?.name}</span>
            </h1>
            <p className="text-gray-500 text-sm">Manage your rooms and collaborate in real-time</p>
          </div>

          <div className="flex gap-2.5 shrink-0">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-white text-slate-950 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-gray-100">
              <Plus className="w-4 h-4" /> Create Room
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setShowJoinModal(true)}
              className="flex items-center gap-2 bg-transparent text-gray-300 border border-gray-700 hover:border-gray-500 hover:text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all">
              <LinkIcon className="w-4 h-4" /> Join Room
            </motion.button>
          </div>
        </motion.div>

        {/* Recent Rooms */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="mb-12">
          <RecentRooms />
        </motion.div>

        {/* Divider */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="relative flex items-center justify-center mb-8">
          <div className="flex-1 h-px bg-white/20" />
          <span className="mx-4 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase text-gray-400 border border-gray-800 bg-slate-950 select-none">
            Your Rooms
          </span>
          <div className="flex-1 h-px bg-white/20" />
        </motion.div>

        {/* Room grid */}
        {loadingRooms ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <RoomSkeleton key={i} />)}
          </div>
        ) : rooms.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 mb-6">
              <Plus className="w-7 h-7 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No rooms yet</h3>
            <p className="text-gray-500 text-sm mb-8">Create your first room and start collaborating</p>
            <button onClick={() => setShowCreateModal(true)}
              className="bg-white text-slate-950 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all">
              Create Your First Room
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room, i) => {
              const accent = roomAccent(room._id);
              return (
                <motion.div key={room._id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  onClick={() => handleJoin(room._id)}
                  className={`group relative bg-gray-900/50 border border-gray-800/60 hover:border-white/20 p-6 rounded-2xl cursor-pointer transition-all duration-200 ring-1 ring-transparent hover:bg-gray-900/80`}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-10 h-10 rounded-xl bg-slate-600 flex items-center justify-center text-white font-bold text-sm`}>
                      {(room.title || "R").charAt(0).toUpperCase()}
                    </div>
                    
                  </div>

                  {/* Title */}
                  <h2 className="text-sm font-semibold text-white mb-1 truncate">{room.title}</h2>

                  {/* Meta */}
                  <div className="flex items-center gap-2 text-gray-600 text-xs mb-5">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(room.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span className="mx-1">·</span>
                    <Clock className="w-3 h-3" />
                    <span>{new Date(room.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500 group-hover:text-gray-300 transition-colors pt-4 border-t border-gray-800/60">
                    <span className={`font-medium text-gray-400`}>Open Room</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }} transition={{ duration: 0.18 }}
              className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-md p-7 shadow-2xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Create Room</h2>
                  <p className="text-gray-500 text-sm mt-0.5">Give your room a name to get started</p>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-600 hover:text-gray-300 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <input type="text" value={roomTitle} onChange={(e) => setRoomTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateRoom()}
                placeholder="e.g., My Python Project"
                className="w-full p-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 mb-6 text-sm"
                autoFocus />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-500 hover:text-white transition-colors text-sm">Cancel</button>
                <button onClick={handleCreateRoom}
                  className="px-5 py-2 bg-white text-slate-950 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all">
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showJoinModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowJoinModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }} transition={{ duration: 0.18 }}
              className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-md p-7 shadow-2xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Join a Room</h2>
                  <p className="text-gray-500 text-sm mt-0.5">Enter the room ID from your teammate</p>
                </div>
                <button onClick={() => setShowJoinModal(false)} className="text-gray-600 hover:text-gray-300 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <input type="text" value={joinRoomId} onChange={(e) => setJoinRoomId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
                placeholder="Paste room ID here"
                className="w-full p-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 mb-4 text-sm"
                autoFocus />
              <div className="flex items-center gap-3 p-3 bg-gray-900 border border-gray-800 rounded-xl mb-6">
                <div className="w-7 h-7 rounded-lg bg-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {(currentUser?.name || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[11px] text-gray-600 uppercase tracking-wider">Joining as</p>
                  <p className="text-sm text-white font-medium">{currentUser?.name || currentUser?.username}</p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowJoinModal(false)} className="px-4 py-2 text-gray-500 hover:text-white transition-colors text-sm">Cancel</button>
                <button onClick={handleJoinRoom}
                  className="px-5 py-2 bg-white text-slate-950 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all">
                  Join
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes blob {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(30px, -50px) scale(1.1); }
          66%  { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default Dashboard;