import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRoomContext } from "../context/RoomContext";
import { useFileSystem } from "../context/FileContext";
import MonacoEditor from "../components/codeEditor/monacoEditor";
import FileExplorer from "../components/sidebar/FileExplorer";
import {
  ActivityBar,
  ChatPanel,
  UsersPanel,
  RunPanel,
} from "../components/sidebar";
import {RoomNotificationListener} from "../components/common";

function CodeSpace() {
  const { currentRoom, setCurrentRoom, loading } = useRoomContext();
  const { setFiles, setOpenFiles, setActiveFile } = useFileSystem();
  const [activeTab, setActiveTab] = useState("files");

  const handleTabClick = (tabId) => {
    setActiveTab((prev) => (prev === tabId ? "none" : tabId));
  };

  const renderSidePanel = () => {
    switch (activeTab) {
      case "none":
        return null;
      case "files":
        return <div className="w-64"><FileExplorer /></div>;
      case "chat":
        return <div className="w-64"><ChatPanel /></div>;
      case "users":
        return <div className="w-64"><UsersPanel /></div>;
      case "run":
        return <div className="w-64"><RunPanel /></div>;
      default:
        return <div className="w-64"><FileExplorer /></div>;
    }
  };

  useEffect(() => {
    if (currentRoom?.files) {
      setFiles(currentRoom.files);
      if (currentRoom.files.length > 0) {
        const firstFile = currentRoom.files[0];
        setOpenFiles([firstFile]);
        setActiveFile(firstFile);
      }
    }
  }, [currentRoom, setFiles, setOpenFiles, setActiveFile]);

  if (loading) return <div>Loading room...</div>;
  if (!currentRoom) return <div>Room not found</div>;

  return (
  <div className="flex h-screen bg-slate-950 overflow-hidden">
    <ActivityBar activeTab={activeTab} setActiveTab={handleTabClick} />
    {renderSidePanel()}
    <div className="flex-1 min-w-0 overflow-hidden"> 
      <MonacoEditor />
    </div>
    <RoomNotificationListener />
  </div>
);
}

export default CodeSpace;
