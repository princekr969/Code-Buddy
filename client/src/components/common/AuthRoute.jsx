import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

export default function AuthRoute({ children }) {
      const { currentUser, loading } = useAuthContext();
  if (loading) return <div>Loading...</div>;

    return currentUser !== null ? <Navigate to={`/dashboard/${currentUser._id}`} replace /> : children;
}
