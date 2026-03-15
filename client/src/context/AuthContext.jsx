import { createContext, useContext, useEffect, useState } from "react";
import userService from "../services/userService";

const AuthContext = createContext(null);

export const useAuthContext = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const res = await userService.getCurrentUser();
        if(res.success){
            setCurrentUser(res.user);
        }
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error(err);
        }
        setCurrentUser(null);

      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;