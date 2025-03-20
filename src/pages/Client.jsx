import React from 'react';
import MainLayout from '../layouts/MainLayout';
import '../style/Client.css'; // Importar el archivo CSS

const Client = () => {
  return (
    <MainLayout>
      <div className="page-container">
        <div className="card-contenedor">
          <h1 className="dashboard-title_e">Clientes</h1>

          {/* Filtros y botón "Nuevo" */}
          <div className="row mb-3 align-items-center">
            <div className="col-md-3">
              <input
                type="text"
                className="search-input"
                placeholder="Buscar cliente..."
              />
            </div>
            <div className="col-md-3">
              <select className="form-select">
                <option value="">Filtrar por estado</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
            <div className="col-md-2 d-flex justify-content-end">
              <button className="btn btn-custom">Nuevo</button>
            </div>
          </div>

          {/* Lista de clientes */}
          <div className="card-container_e">
            {/* Ejemplo de tarjeta de cliente */}
            <div className="card_e active">
              <div className="card-body_e">
                <img
                  src="https://via.placeholder.com/100"
                  alt="Cliente"
                  className="card-img_e"
                />
                <h3 className="card-title_e">Nombre del Cliente</h3>
                <p className="card-text_e">Correo: cliente@example.com</p>
                <p className="card-text_e">Teléfono: 555-1234</p>
                <div className="card-actions_e">
                  <button className="btn btn-custom">Editar</button>
                  <button className="btn btn-custom">Eliminar</button>
                </div>
              </div>
            </div>

            {/* Más tarjetas de clientes pueden agregarse aquí */}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Client;