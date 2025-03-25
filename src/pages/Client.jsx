import React, { useState } from "react";
import "../style/Client.css";
import { HiMiniUserPlus } from "react-icons/hi2";
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
    anydesk: [],
  },
];

const Client = () => {
  const [clients, setClients] = useState(initialClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [showForm, setShowForm] = useState(false);

  const handleNewClient = (e) => {
    e.preventDefault();
    const form = e.target;
    const newClient = {
      id: clients.length + 1,
      name: form.name.value,
      telNat: form.telNat.value,
      plan: form.plan.value,
      clientType: form.clientType.value,
      status: "Activo",
      administrator: {
        name: form.adminName.value,
        phone: form.adminPhone.value,
      },
      anydesk: [],
    };
    setClients([...clients, newClient]);
    setShowForm(false);
    Swal.fire("¡Guardado!", "El cliente ha sido registrado.", "success");
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
            {!showForm ? (
              <>
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
                    <Form.Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="select-filter"
                    >
                      <option value="Todos">Todos los estatus</option>
                      <option value="Activo">Activos</option>
                      <option value="Inactivo">Inactivos</option>
                    </Form.Select>
                  </Col>
                  <Col md={2} className="d-flex justify-content-end">
                    <Button
                      variant="primary"
                      className="btn-new"
                      onClick={() => setShowForm(true)}
                    >
                      <HiMiniUserPlus /> Nuevo
                    </Button>
                  </Col>
                </Row>

                <div className="card-container_e">
                  {filteredClients.map((client) => (
                    <Card
                      key={client.id}
                      className={`card_e ${client.status === "Activo" ? "active" : "inactive"}`}
                    >
                      <Card.Body className="card-body_e">
                        <h5 className="card-title_e">{client.name}</h5>
                        <p className="card-text_e"><strong>Plan:</strong> {client.plan}</p>
                        <p className="card-text_e"><strong>Tipo:</strong> {client.clientType}</p>
                        <p className="card-text_e"><strong>Administrador:</strong> {client.administrator.name}</p>
                        <Badge bg={client.status === "Activo" ? "success" : "danger"} className="status-badge">
                          {client.status}
                        </Badge>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Form onSubmit={handleNewClient} className="p-4 border rounded bg-light">
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Nombre del Residencial *</Form.Label>
                      <Form.Control type="text" name="name" required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>TelNat *</Form.Label>
                      <Form.Control type="text" name="telNat" required />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Plan Contratado *</Form.Label>
                      <Form.Select name="plan" required>
                        <option value="">Seleccione un plan</option>
                        <option value="Opción 1">Opción 1</option>
                        <option value="Opción 2">Opción 2</option>
                        <option value="Opción 3">Opción 3</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Tipo de Cliente *</Form.Label>
                      <Form.Select name="clientType" required>
                        <option value="">Seleccione un tipo</option>
                        <option value="Residencial">Residencial</option>
                        <option value="Corporativo">Corporativo</option>
                        <option value="Industrial">Industrial</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Nombre del Administrador *</Form.Label>
                      <Form.Control type="text" name="adminName" required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Teléfono del Administrador *</Form.Label>
                      <Form.Control type="text" name="adminPhone" required />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
                  <Button type="submit" variant="primary">Guardar</Button>
                </div>
              </Form>
            )}
          </div>
        </div>
      </Container>
    </MainLayout>
  );
};

export default Client;
