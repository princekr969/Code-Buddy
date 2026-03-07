import { motion, AnimatePresence } from "framer-motion";
import { Users, Copy, X, Check, Terminal, Folder, File, ChevronRight, Menu } from "lucide-react";
import { useState, useEffect } from "react";

export const CodeEditor = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "User1 joined the room", type: "success" },
    { id: 2, text: "URL copied to clipboard", type: "info" },
  ]);
  const [activeFile, setActiveFile] = useState("index.cpp");
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Auto-close sidebar on mobile
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Simulate notifications
    const timer1 = setTimeout(() => {
      addNotification("User1 joined the room", "success");
    }, 2000);

    const timer2 = setTimeout(() => {
      addNotification("URL copied to clipboard", "info");
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const addNotification = (text, type) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  return (
    <div className="flex flex-col md:flex-row h-[400px] sm:h-[500px] md:h-[600px] rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 shadow-2xl bg-white relative">
      

      {/* Left Sidebar - Modern Terminal Style */}
      <AnimatePresence mode="wait">
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`${
              window.innerWidth < 768 
                ? 'absolute inset-y-0 left-0 z-10 w-64 sm:w-72' 

                : 'relative w-64 sm:w-72'
            } bg-gray-50 text-gray-900 border-r border-gray-200 flex flex-col`}
          >
            {/* Sidebar Header */}
            <div className="p-3 sm:p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-xs sm:text-sm uppercase tracking-wider text-gray-500">
                  TEAM MEMBERS
                </h2>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                  2 online
                </span>
              </div>
            </div>
            
            {/* Users List */}
            <div className="p-2 sm:p-3 space-y-2 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between p-1.5 sm:p-2 rounded-lg bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500 flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                    A
                  </div>
                  <div>
                    <p className="font-medium text-xs sm:text-sm">admin</p>
                    <p className="text-xs text-gray-500 hidden xs:inline">You · Host</p>
                  </div>
                </div>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </div>
              
              <div className="flex items-center justify-between p-1.5 sm:p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 transition-all">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                    U1
                  </div>
                  <div>
                    <p className="font-medium text-xs sm:text-sm">User1</p>
                    <p className="text-xs text-gray-500 hidden xs:inline">Editor</p>
                  </div>
                </div>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </div>
            </div>

            {/* File Explorer Section */}
            <div className="border-t border-gray-200 bg-white">
              <div className="p-2 sm:p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    EXPLORER
                  </h3>
                  <Folder className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </div>
                <div className="space-y-1">
                  <div 
                    className="flex items-center space-x-2 text-xs sm:text-sm p-1 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => setActiveFile("index.cpp")}
                  >
                    <ChevronRight className="w-2 h-2 sm:w-3 sm:h-3 text-gray-400" />
                    <File className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                    <span className={activeFile === "index.cpp" ? "text-blue-600 font-medium truncate" : "text-gray-700 truncate"}>
                      index.cpp
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm p-1 hover:bg-gray-100 rounded cursor-pointer pl-4 sm:pl-6">
                    <File className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                    <span className="text-gray-600 truncate">main.cpp</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm p-1 hover:bg-gray-100 rounded cursor-pointer pl-4 sm:pl-6">
                    <File className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                    <span className="text-gray-600 truncate">utils.cpp</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-2 sm:p-3 border-t border-gray-200 flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => addNotification("URL copied to clipboard", "info")}
              >
                <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Copy Link</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center px-2 sm:px-3 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 hover:bg-gray-50"
              >
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Editor Area - Clean Terminal Theme */}
      <div className={`flex-1 relative bg-gradient-to-br from-gray-900 to-gray-800`}>
        {/* Editor Header */}
        <div className="flex sm:items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/90 border-b border-gray-700 gap-2">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#FF5F56]"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#27C93F]"></div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <Terminal className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              <span className="text-white font-mono truncate max-w-[100px] sm:max-w-none">
                {activeFile}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              <span className="hidden sm:inline">Press </span>
              <span className="px-1 sm:px-1.5 py-0.5 bg-gray-700 rounded text-white">ESC</span>
              <span className="hidden sm:inline"> to exit</span>
            </button>
          </div>
        </div>

        {/* Terminal-like Code Content */}
        <div className="p-3 sm:p-4 md:p-6 font-mono text-xs sm:text-sm h-[calc(100%-60px)] overflow-auto">
          {/* C++ Code Section */}
          <div>
            <div className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-4">
              // Example code in {activeFile}
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <div className="flex flex-wrap">
                <span className="text-gray-500 w-6 sm:w-8 text-right mr-2 sm:mr-4 text-xs">1</span>
                <span className="text-blue-400">#include</span>
                <span className="text-orange-300 ml-1 sm:ml-2 break-all">&lt;iostream&gt;</span>
              </div>
              <div className="flex flex-wrap">
                <span className="text-gray-500 w-6 sm:w-8 text-right mr-2 sm:mr-4 text-xs">2</span>
                <span className="text-blue-400">int</span>
                <span className="text-yellow-400 ml-1 sm:ml-2">main</span>
                <span className="text-white">()</span>
                <span className="text-white">{"{"}</span>
              </div>
              <div className="flex flex-wrap">
                <span className="text-gray-500 w-6 sm:w-8 text-right mr-2 sm:mr-4 text-xs">3</span>
                <span className="text-blue-400 ml-2 sm:ml-4">std::</span>
                <span className="text-yellow-400">cout</span>
                <span className="text-white"> &lt;&lt; </span>
                <span className="text-green-400 break-all">"Hello, World!"</span>
                <span className="text-white">;</span>
              </div>
              <div className="flex flex-wrap">
                <span className="text-gray-500 w-6 sm:w-8 text-right mr-2 sm:mr-4 text-xs">4</span>
                <span className="text-blue-400 ml-2 sm:ml-4">return</span>
                <span className="text-yellow-400 ml-1 sm:ml-2">0</span>
                <span className="text-white">;</span>
              </div>
              <div className="flex flex-wrap">
                <span className="text-gray-500 w-6 sm:w-8 text-right mr-2 sm:mr-4 text-xs">5</span>
                <span className="text-white">{"}"}</span>
              </div>
            </div>
          </div>

          {/* Additional code lines for better visualization */}
          <div className="mt-4 space-y-0.5 sm:space-y-1 opacity-50">
            <div className="flex flex-wrap">
              <span className="text-gray-500 w-6 sm:w-8 text-right mr-2 sm:mr-4 text-xs">6</span>
              <span className="text-gray-400">// More code...</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};