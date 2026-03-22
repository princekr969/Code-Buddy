import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Toast from "./components/common/Toast";
import { AuthPage, Home, Dashboard, CodeSpace } from "./pages";
import { AuthProvider, FileProvider, RoomProvider, SocketProvider, ExecuteCodeContextProvider } from "./context";
import { AuthRoute, PrivateRoute } from "./components/common";
import MainLayout from "./layouts/MainLayout";
import Features from "./components/home/Features";
import LanguagesHoneycomb from "./components/home/LanguagesHoneycomb";

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
          <Route path="/auth" element={<AuthRoute><AuthPage /></AuthRoute>} />
          <Route element={<MainLayout/>}>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/languages" element={<LanguagesHoneycomb />} />
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
