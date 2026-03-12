import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import userService from "../../services/userService";

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await userService.getCurrentUser();

      if (res.success) {
        setIsAuth(true);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAuth ? children : <Navigate to="/auth?mode=login" />;
}