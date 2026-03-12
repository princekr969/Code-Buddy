import { useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css'
import Toast from "./components/common/Toast";
import PrivateRoute from './components/common/PrivateRoute';
import { AuthPage, Home, Dashboard } from './pages';
import { AppProvider } from './context/AppContext';


function App() {

  return (
    <Router>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
      </AppProvider>

      <Toast />
    </Router>
  )
}

export default App
