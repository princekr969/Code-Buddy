import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import userService from "../../services/userService";


function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function RecentSkeleton() {
  return (
    <div className="shrink-0 w-52 rounded-xl bg-gray-900/50 border border-gray-800/60 p-4 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg bg-gray-800" />
        <div className="w-3.5 h-3.5 rounded bg-gray-800" />
      </div>
      <div className="w-3/4 h-3.5 rounded bg-gray-800 mb-2" />
      <div className="w-1/2 h-3 rounded bg-gray-800/60" />
    </div>
  );
}

export default function RecentRooms() {
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();
  const [recentRooms, setRecentRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecentRooms = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      setError(null);
      const res = await userService.getRecentRooms();
      setRecentRooms(res.recentRooms || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => { fetchRecentRooms(); }, [fetchRecentRooms]);

  const handleJoin = (roomId) => navigate(`/room/${roomId}`);

  if (loading) return (
    <section>
      <h2 className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mb-3">Recent</h2>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {Array.from({ length: 4 }).map((_, i) => <RecentSkeleton key={i} />)}
      </div>
    </section>
  );

  if (error) return (
    <section>
      <h2 className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mb-3">Recent</h2>
      <div className="rounded-xl bg-gray-900/40 border border-gray-800 p-5 text-center">
        <p className="text-gray-500 text-sm mb-3">{error}</p>
        <button onClick={fetchRecentRooms} className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition">Retry</button>
      </div>
    </section>
  );

  if (recentRooms.length === 0) return (
    <section>
      <h2 className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 mb-3">Recent</h2>
      <div className="rounded-xl bg-gray-900/30 border border-gray-800/40 border-dashed p-5 text-center">
        <p className="text-gray-600 text-sm">No recent rooms — join one to see it here.</p>
      </div>
    </section>
  );

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">Recent</h2>
        <span className="text-[10px] text-gray-500">{recentRooms.length} room{recentRooms.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {recentRooms.map(({ room, joinedAt }, i) => {
          return (
            <motion.button
              key={room._id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              onClick={() => handleJoin(room._id)}
              className={`group relative shrink-0 w-52 text-left rounded-xl bg-gray-900/50 border border-gray-800/60 hover:border-white/20 p-4 flex flex-col gap-2.5 transition-all duration-150 hover:bg-gray-900/80`}
            >
              {/* Top row */}
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-lg bg-slate-600 flex items-center justify-center text-white font-bold text-xs`}>
                  {(room.title || "R").charAt(0).toUpperCase()}
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all duration-150" />
              </div>

              {/* Name */}
              <p className="text-white text-sm font-medium truncate leading-snug">{room.title || "Unnamed Room"}</p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-medium text-gray-400`}>
                  {room.owner?.name ? `by ${room.owner.name}` : ""}
                </span>
                <span className="flex items-center gap-1 text-gray-400 text-[11px]">
                  <Clock className="w-3 h-3" />
                  {timeAgo(joinedAt)}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}