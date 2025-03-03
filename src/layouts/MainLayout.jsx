import React from 'react';
import Sidebar from '../components/Siderbar';
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
        <NotificationBell />
        {children} {/* Aquí se insertarán las secciones específicas de cada página */}
      </Container>
    </div>
  );
};

export default MainLayout;
