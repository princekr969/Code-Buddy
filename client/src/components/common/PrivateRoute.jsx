import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import userService from "../../services/userService";
import { useAuthContext } from "../../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuthContext();

  if (loading) return <div>Loading...</div>;

  return currentUser !== null ? children : <Navigate to="/auth?mode=login" />;
}