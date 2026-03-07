import { useState } from 'react'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css'
import Toast from "./components/common/Toast";
import { AuthPage, Home } from './pages';


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
      <Toast />
    </Router>
  )
}

export default App
