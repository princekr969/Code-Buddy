import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import authService from "../services/authService";
import userService from "../services/userService";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { Loader, Plus, Link as LinkIcon, Calendar } from "lucide-react";

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomTitle, setRoomTitle] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const { status, setStatus, currentUser, setCurrentUser } = useAppContext();
  const navigate = useNavigate();

  // Fetch rooms on mount
  useEffect(() => {
    const fetchRooms = async () => {
      // Implement your room fetching logic here
      // setRooms(data);
      setLoadingRooms(false);
    };
    fetchRooms();
  }, []);

  const handleCreateRoom = async () => {
    // Implement create room logic
  };

  const handleJoin = async (roomId) => {
    // Implement join room logic
  };    

  const handleJoinRoom = async () => {
    // Implement join room from modal
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <Navbar />

      {loading && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-center items-center">
          <Loader className="w-10 h-10 text-purple-500 animate-spin" />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{currentUser?.name}</span> 👋
            </h1>
            <p className="text-gray-400">Manage your coding rooms and collaborate in real-time</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-5 py-2.5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Create Room
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 px-5 py-2.5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <LinkIcon className="w-5 h-5" />
              Join Room
            </button>
          </div>
        </div>

        {/* Room Cards */}
        {loadingRooms ? (
          <div className="flex justify-center mt-20">
            <Loader className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-800 mb-6">
              <Plus className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">No rooms yet</h3>
            <p className="text-gray-400 mb-6">Create your first room and start collaborating!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Create Your First Room
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                    {room.title}
                  </h2>
                  <span className="px-2 py-1 bg-gray-700 rounded-lg text-xs text-gray-300">
                    {room.language || "C++"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Created {new Date(room.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => handleJoin(room._id)}
                  className="w-full bg-gray-700 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 text-white py-2.5 rounded-xl font-medium transition-all duration-300"
                >
                  Join Room
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Create Room Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">Create New Room</h2>
              <p className="text-gray-400 mb-6">Give your room a title to get started</p>
              <input
                type="text"
                value={roomTitle}
                onChange={(e) => setRoomTitle(e.target.value)}
                placeholder="e.g., My Python Project"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-6"
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRoom}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Create Room
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Join Room Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">Join a Room</h2>
              <p className="text-gray-400 mb-6">Enter the room ID provided by your teammate</p>
              <input
                type="text"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="Room ID"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                autoFocus
              />
              <div className="p-3 bg-gray-800/50 rounded-lg mb-6">
                <p className="text-sm text-gray-400">You'll join as</p>
                <p className="text-white font-medium">{currentUser?.username}</p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoinRoom}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Join Room
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;