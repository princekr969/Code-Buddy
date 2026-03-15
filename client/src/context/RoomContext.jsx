import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import roomService from "../services/roomService";
import { useAuthContext } from "./AuthContext";
import { toast } from "react-hot-toast";

const RoomContext = createContext(null);

export const useRoomContext = () => {
  return useContext(RoomContext);
};



const RoomProvider = ({ children }) => {
    const { roomId } = useParams();
    const [currentRoom, setCurrentRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    
    
    useEffect(() => {
       if (!roomId) return;
    
       const fetchRoom = async () => {
         setLoading(true);
         try {
           const res = await roomService.getRoomById(roomId);
           if (res.success) {
             setCurrentRoom(res.room);
           }
         } catch (error) {
           console.error('Failed to fetch room:', error);
         } finally {
           setLoading(false);
         }
       };
    
       fetchRoom();
     }, [roomId]);

  return (
    <RoomContext.Provider
        value={{
            currentRoom,
            setCurrentRoom,
            loading,
            roomId
        }}
    >
        {children}
    </RoomContext.Provider>
  )
} 

export { RoomProvider };
export default RoomContext;
