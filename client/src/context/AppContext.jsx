import { createContext, useContext, useEffect, useState } from "react";
import userService from "../services/userService";

const AppContext = createContext(null);

export const useAppContext = () => {
  return useContext(AppContext);
};

const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await userService.getCurrentUser();
        if(res.success){
            setCurrentUser(res.user);
        }
      } catch (err) {

      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AppContext.Provider
      value={{
        users,
        setUsers,
        currentUser,
        setCurrentUser,
        room,
        setRoom,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider };
export default AppContext;