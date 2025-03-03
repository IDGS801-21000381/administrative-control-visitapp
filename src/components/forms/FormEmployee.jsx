import React, { useState } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';

const FormEmployee = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    correoPersonal: '',
    correoEmpresa: '',
    telefonoPersonal: '',
    telefonoEmpresa: '',
    direccion: '',
    rol: 'administrador', // valor por defecto
    horario: '',
    usuario: '', // valor por defecto
    contrasena: '', // valor por defecto
    fotografia: '',
    estado: 'activo', // valor por defecto
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Empleado guardado:', formData);
  };

  const handleCancel = () => {
    setFormData({
      nombre: '',
      primerApellido: '',
      segundoApellido: '',
      correoPersonal: '',
      correoEmpresa: '',
      telefonoPersonal: '',
      telefonoEmpresa: '',
      direccion: '',
      rol: 'administrador',
      horario: '',
      usuario: '',
      contrasena: '',
      fotografia: '',
      estado: 'activo',
    });
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h5 className="card-title text-center">Formulario de Empleado</h5>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="nombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="primerApellido">
                <Form.Label>Primer Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="primerApellido"
                  value={formData.primerApellido}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="segundoApellido">
                <Form.Label>Segundo Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="segundoApellido"
                  value={formData.segundoApellido}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="correoPersonal">
                <Form.Label>Correo Personal</Form.Label>
                <Form.Control
                  type="email"
                  name="correoPersonal"
                  value={formData.correoPersonal}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="correoEmpresa">
                <Form.Label>Correo de la Empresa (Opcional)</Form.Label>
                <Form.Control
                  type="email"
                  name="correoEmpresa"
                  value={formData.correoEmpresa}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="telefonoPersonal">
                <Form.Label>Teléfono Personal</Form.Label>
                <Form.Control
                  type="tel"
                  name="telefonoPersonal"
                  value={formData.telefonoPersonal}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="telefonoEmpresa">
                <Form.Label>Teléfono de la Empresa (Opcional)</Form.Label>
                <Form.Control
                  type="tel"
                  name="telefonoEmpresa"
                  value={formData.telefonoEmpresa}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="direccion">
                <Form.Label>Dirección (Opcional)</Form.Label>
                <Form.Control
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="rol">
                <Form.Label>Rol</Form.Label>
                <Form.Control
                  as="select"
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  required
                >
                  <option value="administrador">Administrador</option>
                  <option value="desarrollo">Desarrollo</option>
                  <option value="soporte">Soporte</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="horario">
                <Form.Label>Horario (Opcional)</Form.Label>
                <Form.Control
                  as="select"
                  name="horario"
                  value={formData.horario}
                  onChange={handleChange}
                >
                  <option value="">Seleccione</option>
                  <option value="completo">Completo</option>
                  <option value="medioTiempo">Medio Tiempo</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="usuario">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  type="text"
                  name="usuario"
                  value={formData.usuario || formData.nombre.toLowerCase()}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="contrasena">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="fotografia">
                <Form.Label>Fotografía (Opcional)</Form.Label>
                <Form.Control
                  type="file"
                  name="fotografia"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FormEmployee;
