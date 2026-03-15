import React, { use } from 'react'
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from 'react-hot-toast';
import roomService from '../services/roomService';
import userService from '../services/userService';
import AuthService from "../services/authService";
import { useRoomContext } from '../context/RoomContext';
import { useAuthContext } from '../context/AuthContext';
import { useFileSystem } from '../context/FileContext';
import MonacoEditor from '../components/codeEditor/monacoEditor';
import FileExplorer from '../components/codeEditor/FileExplorer';

function CodeSpace() {

    const { roomId } = useParams();
    const navigate = useNavigate();
    const {currentUser} = useAuthContext();
    const {currentRoom, setCurrentRoom, loading} = useRoomContext();
    const { setFiles, setOpenFiles, setActiveFile } = useFileSystem();

  useEffect(() => {
    console.log("codespace", currentRoom);
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

    <div className="flex h-screen">
  <FileExplorer />
  <div className="flex-1">
    <MonacoEditor />
  </div>
</div>
  )
}

export default CodeSpace

