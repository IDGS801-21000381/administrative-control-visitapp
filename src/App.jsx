import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dasboard";

const App = () => {
  const [auth, setAuth] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setAuth={setAuth} />} />
        <Route path="/dashboard" element={auth ? <Dashboard /> : <Login setAuth={setAuth} />} />
      </Routes>
    </Router>
  );
};

export default App;
