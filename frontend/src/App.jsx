import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MaterialsPage from "./pages/MaterialsPage";
import Header from "./components/Header";

function App() {
  // Храним состояние авторизации
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  return (
    <Router>
      <Header setIsAuth={setIsAuth} />
      <Routes>
        {/* Передаём setIsAuth в LoginPage */}
        <Route path="/login" element={<LoginPage setIsAuth={setIsAuth} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/materials"
          element={isAuth ? <MaterialsPage /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/materials" />} />
      </Routes>
    </Router>
  );
}

export default App;
