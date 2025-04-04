import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dasboard";
import Employee from "./pages/Employee";
import Client from "./pages/Client";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import Document from "./pages/Document";
import Page404 from "./pages/page404";
import CreateReports from "./pages/CreateReports";

const App = () => {
  const [auth, setAuth] = useState(localStorage.getItem("isAuthenticated") === "true");

  useEffect(() => {
    if (auth) {
      localStorage.setItem("isAuthenticated", "true");
    } else {
      localStorage.removeItem("isAuthenticated");
    }
  }, [auth]);

  const ProtectedRoute = ({ element }) => {
    return auth ? element : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={auth ? "/dashboard" : "/login"} replace />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/empleado" element={<ProtectedRoute element={<Employee />} />} />
        <Route path="/Cliente" element={<ProtectedRoute element={<Client />} />} />
        <Route path="/Perfil" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/Soporte" element={<ProtectedRoute element={<Support />} />} />
        <Route path="/Docuemnto" element={<ProtectedRoute element={<Document />} />} />
         <Route path="/Reportes" element={<ProtectedRoute element={<CreateReports />} />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Router>
  );
};

export default App;


function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}