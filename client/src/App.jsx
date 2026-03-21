import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Toast from "./components/common/Toast";
import PrivateRoute from "./components/common/PrivateRoute";
import { AuthPage, Home, Dashboard, CodeSpace } from "./pages";
import { AuthProvider } from "./context/AuthContext";
import { RoomProvider } from "./context/RoomContext";
import { SocketProvider } from "./context/SocketContext";
import { FileProvider } from "./context/FileContext";
import { ExecuteCodeContextProvider } from "./context/ExecuteCodeContext";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/room/:roomId"
            element={
              <PrivateRoute>
                <RoomProvider>
                  <SocketProvider>
                    <FileProvider>
                      <ExecuteCodeContextProvider>

                        <CodeSpace />
                      </ExecuteCodeContextProvider>
                    </FileProvider>
                  </SocketProvider>
                </RoomProvider>
              </PrivateRoute>
            }
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<MainLayout/>}>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard/:id"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          </Route>
        </Routes>
      </AuthProvider>

      <Toast />
    </Router>
  );
}

export default App;
