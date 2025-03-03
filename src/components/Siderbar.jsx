import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUser, FaUsers, FaClipboardList, FaBriefcase,
  FaHeadset, FaFileAlt, FaSignOutAlt, FaThLarge,
  FaChevronDown, FaTimes
} from "react-icons/fa";
import "../style/Sidebar.css";

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [userName, setUserName] = useState("Alvizo");
  const [isOpen, setIsOpen] = useState(false); // Estado para mostrar/ocultar el sidebar

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userData = JSON.parse(atob(token.split(".")[1]));
        setUserName(userData.name || "Usuario");
      } catch (error) {
        console.error("Error al obtener el nombre del usuario:", error);
        setUserName("Usuario");
      }
    }
  }, []);

  const toggleSubmenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <>
      {/* Botón para abrir sidebar */}
      {!isOpen && (
        <button className="sidebar-toggle" onClick={() => setIsOpen(true)}>
          <img src="/icono.png" alt="Abrir Sidebar" />
        </button>
      )}

      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        {/* Botón para cerrar sidebar */}
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          <FaTimes />
        </button>

        {/* Logo */}
        <div className="sidebar-header">
          <img src="/logo-01.png" alt="Visitapp Logo" className="logo" />
        </div>

        {/* Usuario */}
        <div className="user-info">
          <Link to="/perfil" className="profile-link">
            <FaUser className="user-icon" />
            <span className="user-name">{userName}</span>
          </Link>
        </div>

        {/* Menú */}
        <nav className="menu">
          <ul>
            <SidebarItem to="/dashboard" icon={<FaThLarge />} text="Dashboard" />
            <SidebarItem to="/empleado" icon={<FaUsers />} text="Empleados" />

            {/* Clientes con submenú */}
            <SidebarDropdown
              title="Clientes"
              icon={<FaClipboardList />}
              isExpanded={activeMenu === "clientes"}
              onToggle={() => toggleSubmenu("clientes")}
              items={[
                { to: "/Client", text: "Nuevo Cliente" },
                { to: "/clientes/lista", text: "Lista de Clientes" },
                { to: "/clientes/seguimiento", text: "Seguimiento" }
              ]}
            />

            {/* Actividades con submenú */}
            <SidebarDropdown
              title="Actividades"
              icon={<FaBriefcase />}
              isExpanded={activeMenu === "actividades"}
              onToggle={() => toggleSubmenu("actividades")}
              items={[
                { to: "/activity", text: "Nueva Actividad" },
                { to: "/actividades/calendario", text: "Calendario" },
                { to: "/actividades/reportes", text: "Reportes" }
              ]}
            />

            {/* Soporte y Formación con submenú */}
            <SidebarDropdown
              title="Soporte y Formación"
              icon={<FaHeadset />}
              isExpanded={activeMenu === "soporte"}
              onToggle={() => toggleSubmenu("soporte")}
              items={[
                { to: "/soporte/tickets", text: "Tickets" },
                { to: "/soporte/cursos", text: "Cursos" },
                { to: "/soporte/documentacion", text: "Documentación" }
              ]}
            />

            <SidebarItem to="/documentos" icon={<FaFileAlt />} text="Documentos" />
          </ul>
        </nav>

        {/* Línea separadora */}
        <div className="separator"></div>

        {/* Cerrar sesión */}
        <div className="logout">
          <SidebarItem to="/login" icon={<FaSignOutAlt />} text="Salir" className="text-red" />
        </div>
      </div>
    </>
  );
};

// Componente para elementos sin submenú
const SidebarItem = ({ to, icon, text }) => (
  <li className="menu-item">
    <Link to={to} className="menu-link">
      <span className="menu-icon">{icon}</span>
      <span className="menu-text">{text}</span>
    </Link>
  </li>
);

// Componente para submenús
const SidebarDropdown = ({ title, icon, isExpanded, onToggle, items }) => (
  <li className="menu-item">
    <div className="menu-link" onClick={onToggle}>
      <span className="menu-icon">{icon}</span>
      <span className="menu-text">{title}</span>
      <FaChevronDown className={`chevron-icon ${isExpanded ? "rotate" : ""}`} />
    </div>
    <ul className={`submenu ${isExpanded ? "expanded" : ""}`}>
      {items.map((item, index) => (
        <li key={index} className="submenu-item">
          <Link to={item.to} className="submenu-link">{item.text}</Link>
        </li>
      ))}
    </ul>
  </li>
);

export default Sidebar;
