import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUser, FaUsers, FaClipboardList, FaBriefcase,
  FaHeadset, FaFileAlt, FaSignOutAlt, FaThLarge,
  FaChevronDown, FaTimes, FaBell
} from "react-icons/fa";
import Swal from "sweetalert2";
import "../style/Sidebar.css";

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [userName, setUserName] = useState("Alvizo");
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Tienes una nueva solicitud de cliente.", read: false },
    { id: 2, text: "Un empleado completó una actividad.", read: false },
    { id: 3, text: "Nueva actualización disponible.", read: false },
    { id: 4, text: "Tu reporte mensual está listo.", read: false },
  ]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);

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

  useEffect(() => {
    setHasNewNotifications(notifications.some((notif) => !notif.read));
  }, [notifications]);

  const toggleSubmenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    Swal.fire("Notificación marcada como vista", "", "success");
  };

  const clearAllNotifications = () => {
    setNotifications([]); // Limpiar todas las notificaciones
    Swal.fire("Bandeja limpiada", "", "success");
  };

  const handleViewNotification = (notif) => {
    Swal.fire({
      title: "Detalle de la notificación",
      html: `<p><strong>Asunto:</strong> ${notif.text}</p>
             <p><strong>Descripción:</strong> Detalles adicionales de la notificación.</p>`,
      showCancelButton: true,
      confirmButtonText: "Visto",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "swal-confirm-button",
        cancelButton: "swal-cancel-button",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        markAsRead(notif.id);
      }
    });
  };

  const handleCloseSidebar = () => {
    setIsOpen(false);
    setIsNotificationOpen(false); // Cerrar notificaciones al cerrar el sidebar
  };

  // Cerrar el menú de notificaciones al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      const notificationDropdown = document.querySelector(".notification-dropdown");
      const notificationBell = document.querySelector(".notification-bell");

      if (
        notificationDropdown &&
        !notificationDropdown.contains(event.target) &&
        !notificationBell.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cerrar el sidebar al hacer clic fuera
  useEffect(() => {
    const handleClickOutsideSidebar = (event) => {
      const sidebar = document.querySelector(".sidebar");
      const sidebarToggle = document.querySelector(".sidebar-toggle");

      if (
        sidebar &&
        !sidebar.contains(event.target) &&
        !sidebarToggle.contains(event.target)
      ) {
        setIsOpen(false); // Cerrar el sidebar
      }
    };

    document.addEventListener("mousedown", handleClickOutsideSidebar);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSidebar);
    };
  }, []);

  return (
    <>
      {!isOpen && (
        <button className="sidebar-toggle" onClick={() => setIsOpen(true)}>
          <img src="/icono.png" alt="Abrir Sidebar" />
          {hasNewNotifications && <span className={`notification-dot ${!hasNewNotifications ? "hidden" : ""}`}></span>}
        </button>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <button className="close-btn" onClick={handleCloseSidebar}>
          <FaTimes />
        </button>

        <div className="sidebar-header">
          <img src="/logo-01.png" alt="Visitapp Logo" className="logo" />
        </div>

        <div className="user-info">
          <Link to="/perfil" className="profile-link">
            <FaUser className="user-icon" />
            <span className="user-name">{userName}</span>
          </Link>

          {/* Botón de notificaciones */}
          <button
            className={`notification-bell ${hasNewNotifications ? "new" : ""}`}
            onClick={toggleNotificationDropdown}
          >
            <FaBell className="bell-icon" />
            {hasNewNotifications && <span className={`notification-dot ${!hasNewNotifications ? "hidden" : ""}`}></span>}
          </button>
        </div>

        <nav className="menu">
          <ul>
            <SidebarItem to="/dashboard" icon={<FaThLarge />} text="Dashboard" />
            <SidebarItem to="/empleado" icon={<FaUsers />} text="Empleados" />
            <SidebarDropdown
              title="Clientes"
              icon={<FaClipboardList />}
              isExpanded={activeMenu === "clientes"}
              onToggle={() => toggleSubmenu("clientes")}
              items={[
                { to: "/Cliente", text: "Nuevo Cliente" },
                { to: "/clientes/lista", text: "Lista de Clientes" },
                { to: "/clientes/seguimiento", text: "Seguimiento" }
              ]}
            />
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

        <div className="separator"></div>

        <div className="logout">
          <SidebarItem to="/login" icon={<FaSignOutAlt />} text="Salir" className="text-red" />
        </div>
      </div>

      {/* Dropdown de notificaciones */}
      {isNotificationOpen && (
        <div className="notification-dropdown">
          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif.id} className={`notification-item ${notif.read ? "read" : "unread"}`}>
                  <span>{notif.text}</span>
                  {!notif.read && (
                    <button className="mark-read" onClick={() => handleViewNotification(notif)}>
                      Ver
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="no-notifications">No hay notificaciones.</p>
            )}
          </div>
          {notifications.length > 0 && (
            <button className="clear-btn" onClick={clearAllNotifications}>Limpiar Bandeja</button>
          )}
        </div>
      )}
    </>
  );
};

// Componentes auxiliares
const SidebarItem = ({ to, icon, text }) => (
  <li className="menu-item">
    <Link to={to} className="menu-link">
      <span className="menu-icon">{icon}</span>
      <span className="menu-text">{text}</span>
    </Link>
  </li>
);

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