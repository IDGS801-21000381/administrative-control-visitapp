import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import "../style/NotificationBell.css";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Tienes una nueva solicitud de cliente.", read: false },
    { id: 2, text: "Un empleado completó una actividad.", read: false },
    { id: 3, text: "Nueva actualización disponible.", read: false },
    { id: 4, text: "Tu reporte mensual está listo.", read: false },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNew, setHasNew] = useState(true);
  const [isButtonBlue, setIsButtonBlue] = useState(false);

  useEffect(() => {
    setHasNew(notifications.some((notif) => !notif.read));
  }, [notifications]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setIsButtonBlue(!isButtonBlue);
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearReadNotifications = () => {
    setNotifications(notifications.filter((notif) => !notif.read));
  };

  return (
    <div className="notification-container">
      <button
        className={`notification-bell ${isButtonBlue ? "active" : ""} ${hasNew ? "new" : ""}`}
        onClick={toggleDropdown}
      >
        <FaBell className={`bell-icon ${isButtonBlue ? "white-icon" : "blue-icon"}`} />
        {hasNew && <span className="notification-dot"></span>}
      </button>
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif.id} className={`notification-item ${notif.read ? "read" : "unread"}`}>
                  <span>{notif.text}</span>
                  {!notif.read && (
                    <button className="mark-read" onClick={() => markAsRead(notif.id)}>
                      Leído
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="no-notifications">No hay notificaciones.</p>
            )}
          </div>
          {notifications.some((notif) => notif.read) && (
            <button className="clear-btn" onClick={clearReadNotifications}>Limpiar Bandeja</button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;