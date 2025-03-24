import React, { useState } from "react";
import "../style/Client.css";
import { HiMiniUserPlus } from "react-icons/hi2";
import { FaEdit, FaTrash, FaCheck, FaSearch, FaPlus, FaEye } from "react-icons/fa";
import { Container, Form, Button, Row, Col, Card, Badge } from "react-bootstrap";
import MainLayout from "../layouts/MainLayout";
import Swal from "sweetalert2";

const initialClients = [
  {
    id: 1,
    name: "Residencial Las Flores",
    telNat: "123-456-7890",
    plan: "Opción 1",
    clientType: "Residencial",
    status: "Activo",
    administrator: {
      name: "Juan Pérez",
      phone: "555-1234",
    },
    anydesk: [
      { id: "12345", password: "abcde" },
      { id: "67890", password: "fghij" },
    ],
  },
];

const Client = () => {
  const [clients, setClients] = useState(initialClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const handleNewClient = () => {
    Swal.fire({
      title: "Nuevo Cliente",
      html: `
        <form id="newClientForm">
          <div class="input-field">
            <input required autocomplete="off" type="text" name="name" id="name" placeholder=" " />
            <label for="name">Nombre del Residencial *</label>
          </div>
          <div class="input-field">
            <input required autocomplete="off" type="text" name="telNat" id="telNat" placeholder=" " />
            <label for="telNat">TelNat *</label>
          </div>
          <div class="input-field">
            <select name="plan" id="plan" required>
              <option value="">Seleccione un plan *</option>
              <option value="Opción 1">Opción 1</option>
              <option value="Opción 2">Opción 2</option>
              <option value="Opción 3">Opción 3</option>
            </select>
            <label for="plan">Plan Contratado *</label>
          </div>
          <div class="input-field">
            <select name="clientType" id="clientType" required>
              <option value="">Seleccione un tipo *</option>
              <option value="Residencial">Residencial</option>
              <option value="Corporativo">Corporativo</option>
              <option value="Industrial">Industrial</option>
            </select>
            <label for="clientType">Tipo de Cliente *</label>
          </div>
          <div class="input-field">
            <input required autocomplete="off" type="text" name="adminName" id="adminName" placeholder=" " />
            <label for="adminName">Nombre del Administrador *</label>
          </div>
          <div class="input-field">
            <input required autocomplete="off" type="text" name="adminPhone" id="adminPhone" placeholder=" " />
            <label for="adminPhone">Teléfono del Administrador *</label>
          </div>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      focusConfirm: false,
      preConfirm: () => {
        const name = Swal.getPopup().querySelector("#name").value;
        const telNat = Swal.getPopup().querySelector("#telNat").value;
        const plan = Swal.getPopup().querySelector("#plan").value;
        const clientType = Swal.getPopup().querySelector("#clientType").value;
        const adminName = Swal.getPopup().querySelector("#adminName").value;
        const adminPhone = Swal.getPopup().querySelector("#adminPhone").value;

        if (!name || !telNat || !plan || !clientType || !adminName || !adminPhone) {
          Swal.showValidationMessage("Por favor, complete todos los campos obligatorios (*)");
          return false;
        }

        return {
          id: clients.length + 1,
          name,
          telNat,
          plan,
          clientType,
          status: "Activo",
          administrator: {
            name: adminName,
            phone: adminPhone,
          },
          anydesk: [],
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newClient = result.value;
        setClients([...clients, newClient]);
        Swal.fire("¡Guardado!", "El cliente ha sido registrado.", "success");
      }
    });
  };

  const handleViewDetails = (client) => {
    Swal.fire({
      title: client.name,
      html: `
        <p><strong>TelNat:</strong> ${client.telNat}</p>
        <p><strong>Plan:</strong> ${client.plan}</p>
        <p><strong>Tipo de Cliente:</strong> ${client.clientType}</p>
        <p><strong>Administrador:</strong> ${client.administrator.name}</p>
        <p><strong>Teléfono:</strong> ${client.administrator.phone}</p>
        <p><strong>Anydesk:</strong></p>
        <ul>
          ${client.anydesk.map((ad) => `<li>ID: ${ad.id}, Contraseña: ${ad.password}</li>`).join("")}
        </ul>
      `,
      confirmButtonText: "Cerrar",
    });
  };

  const handleToggleStatus = (id) => {
    const updatedClients = clients.map((client) =>
      client.id === id ? { ...client, status: client.status === "Activo" ? "Inactivo" : "Activo" } : client
    );
    setClients(updatedClients);
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "Todos" || client.status === statusFilter)
  );

  return (
    <MainLayout>
      <Container>
        <div className="page-container">
          <div className="card-contenedor">
            <h2 className="dashboard-title_e">Clientes</h2>

            {/* Barra de búsqueda y filtros */}
            <Row className="mb-3 align-items-center">
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-search"
                />
              </Col>
              <Col md={3}>
                <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select-filter">
                  <option value="Todos">Todos los estatus</option>
                  <option value="Activo">Activos</option>
                  <option value="Inactivo">Inactivos</option>
                </Form.Select>
              </Col>
              <Col md={2} className="d-flex justify-content-end">
                <Button variant="primary" className="btn-new" onClick={handleNewClient}>
                  <HiMiniUserPlus style={{ pa: "2px" }} /> Nuevo
                </Button>
              </Col>
            </Row>

            {/* Lista de clientes */}
            <div className="card-container_e">
              {filteredClients.map((client) => (
                <Card key={client.id} className={`card_e ${client.status === "Activo" ? "active" : "inactive"}`}>
                  <Card.Body className="card-body_e">
                    <div className="text-center">
                      <h5 className="card-title_e">{client.name}</h5>
                      <p className="card-text_e"><strong>Plan:</strong> {client.plan}</p>
                      <p className="card-text_e"><strong>Tipo:</strong> {client.clientType}</p>
                      <p className="card-text_e"><strong>Administrador:</strong> {client.administrator.name}</p>
                      <p className="card-text_e"><strong>Teléfono:</strong> {client.administrator.phone}</p>
                      <Badge bg={client.status === "Activo" ? "success" : "danger"} className="status-badge">
                        {client.status}
                      </Badge>
                    </div>
                    <div className="card-actions_e">
                      <Button variant="info" onClick={() => handleViewDetails(client)}>
                        <FaEye />
                      </Button>
                      <Button variant="warning" onClick={() => handleToggleStatus(client.id)}>
                        <FaCheck />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
};

export default Client;