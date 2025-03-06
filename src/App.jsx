import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dasboard";
import Employee from "./pages/Employee";
import Client from "./pages/Client";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import Document from "./pages/Document";

const App = () => {
  const [auth, setAuth] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/dashboard" element={auth ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/empleado" element={auth ? <Employee /> : <Navigate to="/login" />} />
        <Route path="/Cliente" element={auth ? <Client /> : <Navigate to="/login" />} />
        <Route path="/Perfil" element={auth ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/Soporte" element={auth ? <Support /> : <Navigate to="/login" />} />
       <Route path="/Docuemnto" element={auth ? <Document /> : <Navigate to="/login" />} />

      </Routes>
    </Router>
  );
};

export default App;
