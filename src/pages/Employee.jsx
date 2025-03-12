import React, { useState } from "react";
import "../style/Employee.css";
import { HiMiniUserPlus } from "react-icons/hi2";
import { FaEdit, FaTrash, FaCheck, FaSearch, FaPlus, FaEye } from "react-icons/fa";
import { Container, Form, Button, Row, Col, Card, Badge } from "react-bootstrap";
import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const initialUsers = [
  {
    id: 1,
    name: "Florian Lizet Mata ",
    username: "florianMata",
    role: "Soporte",
    status: "Activo",
    photo: "https://static.vecteezy.com/system/resources/previews/008/844/895/non_2x/user-icon-design-free-png.png",
    email: "mensajeria@lapi.com.mx",
    phone: "555-1234",
    schedule: "Completo",
  },
  {
    id: 2,
    name: "Edgar Hamurabi Delgado Muñoz ",
    username: "hamurabiDelgado",
    role: "Administrador",
    status: "Inactivo",
    photo: "https://static.vecteezy.com/system/resources/previews/008/844/895/non_2x/user-icon-design-free-png.png",
    email: "almacen.general@lapi.com.mx",
    phone: "555-5678",
    schedule: "Medio Tiempo",
  },
  {
    id: 3,
    name: "Angel Eduardo Juarez Alvizo",
    username: "angelJuarez",
    role: "Desarrollo",
    status: "Activo",
    photo: "https://static.vecteezy.com/system/resources/previews/008/844/895/non_2x/user-icon-design-free-png.png",
    email: "mensajeria@lapi.com.mx",
    phone: "555-1234",
    schedule: "Completo",
  },
  {
    id: 4,
    name: "Fabiola Rangel",
    username: "fabiRangel",
    role: "Ventas",
    status: "Inactivo",
    photo: "https://static.vecteezy.com/system/resources/previews/008/844/895/non_2x/user-icon-design-free-png.png",
    email: "almacen.general@lapi.com.mx",
    phone: "555-5678",
    schedule: "Medio Tiempo",
  },
];

const Employee = () => {
  const [users, setUsers] = useState(initialUsers); // Almacenar usuarios en el estado
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const navigate = useNavigate();

  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "Todos" || user.status === statusFilter) &&
      (roleFilter === "Todos" || user.role === roleFilter)
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRoleFilter(event.target.value);
  };

  const handleNewEmployee = () => {
    navigate("/form-employee");
  };

  const handleViewDetails = (user) => {
    Swal.fire({
      title: user.name,
      html: `
        <p><strong>Usuario:</strong> ${user.username}</p>
        <p><strong>Rol:</strong> ${user.role}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Teléfono:</strong> ${user.phone}</p>
        <p><strong>Horario:</strong> ${user.schedule}</p>
      `,
      confirmButtonText: "Cerrar",
    });
  };

  const handleToggleStatus = (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, status: user.status === "Activo" ? "Inactivo" : "Activo" } : user
    );
    setUsers(updatedUsers); // Actualizar el estado con los usuarios modificados
  };

  const handleEditUser = (id) => {
    navigate(`/edit-employee/${id}`);
  };

  return (
    <MainLayout>
      <Container>
        <div className="page-container">
          <div className="card-contenedor">
            <h2 className="dashboard-title_e">Empleados</h2>

            {/* Barra de búsqueda y filtros */}
            <Row className="mb-3 align-items-center">
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre o rol"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="input-search"
                />
              </Col>
              <Col md={3}>
                <Form.Select value={roleFilter} onChange={handleRoleChange} className="select-filter">
                  <option value="Todos">Todos los roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Desarrollo">Desarrollo</option>
                  <option value="Soporte">Soporte</option>
                  <option value="Ventas">Ventas</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select value={statusFilter} onChange={handleStatusChange} className="select-filter">
                  <option value="Todos">Todos los estatus</option>
                  <option value="Activo">Activos</option>
                  <option value="Inactivo">Inactivos</option>
                </Form.Select>
              </Col>
              <Col md={2} className="d-flex justify-content-end">
                <Button variant="primary" className="btn-new" onClick={handleNewEmployee}>
                   <HiMiniUserPlus style={{ padding: "2px" }} />  Nuevo
                </Button>
              </Col>
            </Row>

            {/* Lista de empleados */}
            <div className="card-container_e">
              {filteredUsers.map((user) => (
                <Card key={user.id} className={`card_e ${user.status === "Activo" ? "active" : "inactive"}`}>
                  <Card.Body className="card-body_e">
                    <div className="text-center">
                      <img
                        src={user.photo || "https://static.vecteezy.com/system/resources/previews/008/844/895/non_2x/user-icon-design-free-png.png"}
                        alt="User"
                        className="card-img_e"
                      />
                      <h5 className="card-title_e">{user.name}</h5>
                      <p className="card-text_e"><strong>Usuario:</strong> {user.username}</p>
                      <p className="card-text_e"><strong>Rol:</strong> {user.role}</p>
                      <Badge bg={user.status === "Activo" ? "success" : "danger"}>
                        {user.status}
                      </Badge>
                      <p className="card-text_e"><strong>Horario:</strong> {user.schedule}</p>
                    </div>
                    <div className="card-actions_e">
                      <Button variant="info" onClick={() => handleViewDetails(user)}>
                        <FaEye />
                      </Button>
                      <Button variant="warning" onClick={() => handleEditUser(user.id)}>
                        <FaEdit />
                      </Button>
                      <Button variant={user.status === "Activo" ? "danger" : "success"} onClick={() => handleToggleStatus(user.id)}>
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

export default Employee;
