import React from 'react';
import Sidebar from '../components/Siderbar';
import '../style/style.css'; // Asegúrate de que el archivo CSS esté correctamente vinculado
import NotificationBell from '../components/NotificationBell';
import { Container, Row, Col, Card, Button, ButtonGroup, Form } from 'react-bootstrap';

const MainLayout = ({ children }) => {
  return (
    <div className="dashboard-container d-flex">
      {/* Sidebar fijo */}
      <div className="position-fixed">
        <Sidebar />
      </div>

      {/* Contenedor principal */}
      <Container className="d-flex flex-column flex-grow-9">
     
        {children} {/* Aquí se insertarán las secciones específicas de cada página */}
      </Container>
    </div>
  );
};

export default MainLayout;
