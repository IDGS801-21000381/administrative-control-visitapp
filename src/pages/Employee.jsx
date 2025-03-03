import React from "react";
import "../style/Employee.css";
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";

const users = [
  {
    name: "Jaime Alejandro Mendoza Reséndiz",
    username: "jaimemen",
    domicilio: "Administración",
    moroso: "No",
    login: "3-3-2025 1:52 pm",
    email: "mensajeria@lapi.com.mx",
    notificaciones: "Activas",
    supervisor: "Inactivas",
  },
  {
    name: "Jorge Domínguez",
    username: "jorgedom",
    domicilio: "Compras",
    moroso: "No",
    login: "26-2-2025 4:09 pm",
    email: "almacen.general@lapi.com.mx",
    notificaciones: "Activas",
    supervisor: "Inactivas",
  },
];

const Employee = () => {
  return (
    <div className="dashboard-container_e">
      <h2 className="dashboard-title_e">Colonos</h2>
      <div className="card-container_e">
        {users.map((user, index) => (
          <div key={index} className="card_e">
            <div className="card-body_e">
              <img src="https://via.placeholder.com/50" alt="User" className="card-img_e" />
              <h5 className="card-title_e">{user.name}</h5>
              <p className="card-text_e"><strong>Usuario:</strong> {user.username}</p>
              <p className="card-text_e"><strong>Domicilio:</strong> {user.domicilio}</p>
              <p className="card-text_e"><strong>Moroso:</strong> {user.moroso}</p>
              <p className="card-text_e"><strong>Último login:</strong> {user.login}</p>
              <p className="card-text_e"><strong>Email:</strong> {user.email}</p>
              <p className={`card-text_e ${user.notificaciones === "Activas" ? "text-success_e" : "text-danger_e"}`}>
                <strong>Notificaciones:</strong> {user.notificaciones}
              </p>
              <p className={`card-text_e ${user.supervisor === "Inactivas" ? "text-danger_e" : "text-success_e"}`}>
                <strong>Notificaciones como supervisor:</strong> {user.supervisor}
              </p>
              <div className="card-actions_e">
                <button className="card-btn_e btn btn-primary"><FaEdit /></button>
                <button className="card-btn_e btn btn-danger"><FaTrash /></button>
                <button className="card-btn_e btn btn-success"><FaCheck /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employee;
