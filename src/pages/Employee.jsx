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
    name: "Florian Lizet Mata",
    username: "florianMata",
    role: "Soporte",
    status: "Activo",
    photo: "https://static.vecteezy.com/system/resources/previews/008/844/895/non_2x/user-icon-design-free-png.png",
    email: "mensajeria@lapi.com.mx",
    phone: "555-1234",
    schedule: "Completo",
    homeOffice: "Lunes",
    direccion: "Calle Falsa 123",
    correoPersonal: "florian@example.com",
    correoEmpresa: "florian@empresa.com",
    telefonoPersonal: "555-1234",
    telefonoEmpresa: "555-5678",
  },
  // Agrega más usuarios si es necesario
];

const Employee = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const navigate = useNavigate();

  const generateUsername = (nombre, primerApellido, segundoApellido) => {
    const firstPart = nombre.split(" ")[0].toLowerCase();
    const secondPart = primerApellido.substring(0, 2).toLowerCase();
    const thirdPart = segundoApellido
      ? segundoApellido.substring(0, 2).toLowerCase()
      : primerApellido.substring(primerApellido.length - 2).toLowerCase();
    const username = firstPart + secondPart + thirdPart;
    return username.length >= 4 ? username : username + "xx";
  };

  const handleNewEmployee = () => {
    Swal.fire({
      title: "Nuevo Empleado",
      html: `
        <form id="newEmployeeForm">
          <div class="input-field">
            <input required autocomplete="off" type="text" name="nombre" id="nombre" placeholder=" " />
            <label for="nombre">Nombre *</label>
          </div>
          <div class="input-field">
            <input required autocomplete="off" type="text" name="primerApellido" id="primerApellido" placeholder=" " />
            <label for="primerApellido">Primer Apellido *</label>
          </div>
          <div class="input-field">
            <input autocomplete="off" type="text" name="segundoApellido" id="segundoApellido" placeholder=" " />
            <label for="segundoApellido">Segundo Apellido</label>
          </div>
          <div class="input-field">
            <input required autocomplete="off" type="email" name="correoPersonal" id="correoPersonal" placeholder=" " />
            <label for="correoPersonal">Correo Personal *</label>
          </div>
          <div class="input-field">
            <input autocomplete="off" type="email" name="correoEmpresa" id="correoEmpresa" placeholder=" " />
            <label for="correoEmpresa">Correo Empresa</label>
          </div>
          <div class="input-field">
            <input required autocomplete="off" type="tel" name="telefonoPersonal" id="telefonoPersonal" placeholder=" " />
            <label for="telefonoPersonal">Teléfono Personal *</label>
          </div>
          <div class="input-field">
            <input autocomplete="off" type="tel" name="telefonoEmpresa" id="telefonoEmpresa" placeholder=" " />
            <label for="telefonoEmpresa">Teléfono Empresa</label>
          </div>
          <div class="input-field">
            <input autocomplete="off" type="text" name="direccion" id="direccion" placeholder=" " />
            <label for="direccion">Dirección</label>
          </div>
          <div class="input-field">
            <select name="rol" id="rol" required>
              <option value="">Seleccione un rol *</option>
              <option value="administrador">Administrador</option>
              <option value="Soporte">Soporte</option>
              <option value="Ventas">Ventas</option>
              <option value="Desarrollo">Desarrollo</option>
            </select>
            <label for="rol">Rol *</label>
          </div>
          <div class="input-field">
            <select name="horario" id="horario" required>
              <option value="">Seleccione un horario *</option>
              <option value="Medio Tiempo">Medio Tiempo</option>
              <option value="Tiempo Completo">Tiempo Completo</option>
            </select>
            <label for="horario">Horario *</label>
          </div>
          <div class="input-field">
            <select name="homeOffice" id="homeOffice">
              <option value="">No hay</option>
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miércoles">Miércoles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
            </select>
            <label for="homeOffice">Día de Home Office</label>
          </div>
          <div class="input-field">
            <input autocomplete="off" type="text" name="fotografia" id="fotografia" placeholder=" " />
            <label for="fotografia">Fotografía (URL o adjuntar)</label>
          </div>
          <div class="input-field">
            <input required autocomplete="off" type="text" name="usuario" id="usuario" placeholder=" " />
            <label for="usuario">Usuario *</label>
          </div>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      focusConfirm: false,
      preConfirm: () => {
        const nombre = Swal.getPopup().querySelector("#nombre").value;
        const primerApellido = Swal.getPopup().querySelector("#primerApellido").value;
        const segundoApellido = Swal.getPopup().querySelector("#segundoApellido").value;
        const correoPersonal = Swal.getPopup().querySelector("#correoPersonal").value;
        const correoEmpresa = Swal.getPopup().querySelector("#correoEmpresa").value;
        const telefonoPersonal = Swal.getPopup().querySelector("#telefonoPersonal").value;
        const telefonoEmpresa = Swal.getPopup().querySelector("#telefonoEmpresa").value;
        const direccion = Swal.getPopup().querySelector("#direccion").value;
        const rol = Swal.getPopup().querySelector("#rol").value;
        const horario = Swal.getPopup().querySelector("#horario").value;
        const homeOffice = Swal.getPopup().querySelector("#homeOffice").value;
        const fotografia = Swal.getPopup().querySelector("#fotografia").value;
        const usuario = Swal.getPopup().querySelector("#usuario").value;

        if (!nombre || !primerApellido || !correoPersonal || !telefonoPersonal || !rol || !horario || !usuario) {
          Swal.showValidationMessage("Por favor, complete todos los campos obligatorios (*)");
          return false;
        }

        const contrasena = usuario;
        const estado = "Activo";
        const fechaRegistro = new Date().toISOString().split("T")[0];
        const id = users.length + 1;

        return {
          id,
          name: `${nombre} ${primerApellido} ${segundoApellido || ""}`,
          username: usuario,
          role: rol,
          status: estado,
          photo: fotografia || "https://static.vecteezy.com/system/resources/previews/008/844/895/non_2x/user-icon-design-free-png.png",
          email: correoPersonal,
          phone: telefonoPersonal,
          schedule: horario,
          homeOffice,
          direccion,
          correoPersonal,
          correoEmpresa,
          telefonoPersonal,
          telefonoEmpresa,
          fechaRegistro,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newUser = result.value;
        setUsers([...users, newUser]);
        Swal.fire("¡Guardado!", `El empleado ha sido registrado. La contraseña por defecto es: ${newUser.username}`, "success");
      }
    });
  };

  const handleViewDetails = (user) => {
    Swal.fire({
      title: user.name,
      html: `
        <p><strong>ID:</strong> ${user.id}</p>
        <p><strong>Usuario:</strong> ${user.username}</p>
        <p><strong>Rol:</strong> ${user.role}</p>
        <p><strong>Email Personal:</strong> ${user.correoPersonal}</p>
        <p><strong>Email Empresa:</strong> ${user.correoEmpresa || "N/A"}</p>
        <p><strong>Teléfono Personal:</strong> ${user.telefonoPersonal}</p>
        <p><strong>Teléfono Empresa:</strong> ${user.telefonoEmpresa || "N/A"}</p>
        <p><strong>Dirección:</strong> ${user.direccion}</p>
        <p><strong>Horario:</strong> ${user.schedule}</p>
        <p><strong>Home Office:</strong> ${user.homeOffice || "No hay"}</p>
        <p><strong>Estado:</strong> ${user.status}</p>
        <p><strong>Fecha de Registro:</strong> ${user.fechaRegistro}</p>
      `,
      confirmButtonText: "Cerrar",
    });
  };

  const handleEditUser = (user) => {
    Swal.fire({
      title: "Editar Empleado",
      html: `
        <form id="editForm">
          <div class="input-field">
            <input required autocomplete="off" type="text" name="nombre" id="nombre" value="${user.name.split(" ")[0]}" />
            <label for="nombre">Nombre *</label>
          </div>
          <div class="input-field">
            <input required autocomplete="off" type="text" name="primerApellido" id="primerApellido" value="${user.name.split(" ")[1]}" />
            <label for="primerApellido">Primer Apellido *</label>
          </div>
          <div class="input-field">
            <input autocomplete="off" type="text" name="segundoApellido" id="segundoApellido" value="${user.name.split(" ")[2] || ""}" />
            <label for="segundoApellido">Segundo Apellido</label>
          </div>
          <div class="input-field">
            <input required autocomplete="off" type="email" name="correoPersonal" id="correoPersonal" value="${user.correoPersonal}" />
            <label for="correoPersonal">Correo Personal *</label>
          </div>
          <div class="input-field">
            <input autocomplete="off" type="email" name="correoEmpresa" id="correoEmpresa" value="${user.correoEmpresa || ""}" />
            <label for="correoEmpresa">Correo Empresa</label>
          </div>
          <div class="input-field">
            <input required autocomplete="off" type="tel" name="telefonoPersonal" id="telefonoPersonal" value="${user.telefonoPersonal}" />
            <label for="telefonoPersonal">Teléfono Personal *</label>
          </div>
          <div class="input-field">
            <input autocomplete="off" type="tel" name="telefonoEmpresa" id="telefonoEmpresa" value="${user.telefonoEmpresa || ""}" />
            <label for="telefonoEmpresa">Teléfono Empresa</label>
          </div>
          <div class="input-field">
            <input autocomplete="off" type="text" name="direccion" id="direccion" value="${user.direccion}" />
            <label for="direccion">Dirección</label>
          </div>
          <div class="input-field">
            <select name="rol" id="rol" required>
              <option value="">Seleccione un rol *</option>
              <option value="administrador" ${user.role === "administrador" ? "selected" : ""}>Administrador</option>
              <option value="Soporte" ${user.role === "Soporte" ? "selected" : ""}>Soporte</option>
              <option value="Ventas" ${user.role === "Ventas" ? "selected" : ""}>Ventas</option>
              <option value="Desarrollo" ${user.role === "Desarrollo" ? "selected" : ""}>Desarrollo</option>
            </select>
            <label for="rol">Rol *</label>
          </div>
          <div class="input-field">
            <select name="horario" id="horario" required>
              <option value="">Seleccione un horario *</option>
              <option value="Medio Tiempo" ${user.schedule === "Medio Tiempo" ? "selected" : ""}>Medio Tiempo</option>
              <option value="Tiempo Completo" ${user.schedule === "Tiempo Completo" ? "selected" : ""}>Tiempo Completo</option>
            </select>
            <label for="horario">Horario *</label>
          </div>
          <div class="input-field">
            <select name="homeOffice" id="homeOffice">
              <option value="">No hay</option>
              <option value="Lunes" ${user.homeOffice === "Lunes" ? "selected" : ""}>Lunes</option>
              <option value="Martes" ${user.homeOffice === "Martes" ? "selected" : ""}>Martes</option>
              <option value="Miércoles" ${user.homeOffice === "Miércoles" ? "selected" : ""}>Miércoles</option>
              <option value="Jueves" ${user.homeOffice === "Jueves" ? "selected" : ""}>Jueves</option>
              <option value="Viernes" ${user.homeOffice === "Viernes" ? "selected" : ""}>Viernes</option>
            </select>
            <label for="homeOffice">Día de Home Office</label>
          </div>
          <div class="input-field">
            <input autocomplete="off" type="text" name="fotografia" id="fotografia" value="${user.photo}" placeholder=" " />
            <label for="fotografia">Fotografía (URL o adjuntar)</label>
          </div>
          <div class="input-field">
            <input required autocomplete="off" type="text" name="usuario" id="usuario" value="${user.username}" />
            <label for="usuario">Usuario *</label>
          </div>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar Cambios",
      cancelButtonText: "Cancelar",
      focusConfirm: false,
      preConfirm: () => {
        const nombre = Swal.getPopup().querySelector("#nombre").value;
        const primerApellido = Swal.getPopup().querySelector("#primerApellido").value;
        const segundoApellido = Swal.getPopup().querySelector("#segundoApellido").value;
        const correoPersonal = Swal.getPopup().querySelector("#correoPersonal").value;
        const correoEmpresa = Swal.getPopup().querySelector("#correoEmpresa").value;
        const telefonoPersonal = Swal.getPopup().querySelector("#telefonoPersonal").value;
        const telefonoEmpresa = Swal.getPopup().querySelector("#telefonoEmpresa").value;
        const direccion = Swal.getPopup().querySelector("#direccion").value;
        const rol = Swal.getPopup().querySelector("#rol").value;
        const horario = Swal.getPopup().querySelector("#horario").value;
        const homeOffice = Swal.getPopup().querySelector("#homeOffice").value;
        const fotografia = Swal.getPopup().querySelector("#fotografia").value;
        const usuario = Swal.getPopup().querySelector("#usuario").value;

        if (!nombre || !primerApellido || !correoPersonal || !telefonoPersonal || !rol || !horario || !usuario) {
          Swal.showValidationMessage("Por favor, complete todos los campos obligatorios (*)");
          return false;
        }

        return {
          ...user,
          name: `${nombre} ${primerApellido} ${segundoApellido || ""}`,
          username: usuario,
          correoPersonal,
          correoEmpresa,
          telefonoPersonal,
          telefonoEmpresa,
          direccion,
          role: rol,
          schedule: horario,
          homeOffice,
          photo: fotografia,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedUser = result.value;
        const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
        setUsers(updatedUsers);
        Swal.fire("¡Guardado!", "Los cambios han sido guardados.", "success");
      }
    });
  };

  const handleToggleStatus = (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, status: user.status === "Activo" ? "Inactivo" : "Activo" } : user
    );
    setUsers(updatedUsers);
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
      (statusFilter === "Todos" || user.status === statusFilter) &&
      (roleFilter === "Todos" || user.role === roleFilter)
  );

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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-search"
                />
              </Col>
              <Col md={3}>
                <Form.Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="select-filter">
                  <option value="Todos">Todos los roles</option>
                  <option value="administrador">Administrador</option>
                  <option value="Soporte">Soporte</option>
                  <option value="Ventas">Ventas</option>
                  <option value="Desarrollo">Desarrollo</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select-filter">
                  <option value="Todos">Todos los estatus</option>
                  <option value="Activo">Activos</option>
                  <option value="Inactivo">Inactivos</option>
                </Form.Select>
              </Col>
              <Col md={2} className="d-flex justify-content-end">
                <Button variant="primary" className="btn-new" onClick={handleNewEmployee}>
                  <HiMiniUserPlus style={{ pa: "2px" }} /> Nuevo
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
                   <center><Badge bg={user.status === "Activo" ? "success" : "danger"} className="status-badge">
                        {user.status}
                      </Badge></center>   
                      <p className="card-text_e"><strong>Horario:</strong> {user.schedule}</p>
                      <p className="card-text_e"><strong>Home Office:</strong> {user.homeOffice || "No hay"}</p>
                    </div>
                    <div className="card-actions_e">
                      <Button variant="info" onClick={() => handleViewDetails(user)}>
                        <FaEye />
                      </Button>
                      <Button variant="warning" onClick={() => handleEditUser(user)}>
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