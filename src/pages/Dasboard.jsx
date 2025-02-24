import React from "react";
import Siderbar from "../components/Siderbar.jsx";
import NotificationBell from "../components/NotificationBell.jsx";
const Dashboard = () => {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
        <Siderbar /> 
<NotificationBell/>
      {/* Contenido principal */}
      <div style={{ flexGrow: 1, padding: "20px" }}>
        <h1>Holis, soy el Dashboard</h1>
        <img src="logo-01.png" alt="Visitapp Logo" className="logo" />
      </div>
    </div>
  );
};

export default Dashboard;
