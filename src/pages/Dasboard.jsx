import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { Container, Row, Col, Card, Button, Form, ButtonGroup } from 'react-bootstrap';
import MainLayout from '../layouts/MainLayout';
import "../style/Dasboard.css";

Chart.register(...registerables);

const Dashboard = () => {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const sprintChartRef = useRef(null);
  const supportSprintChartRef = useRef(null);
  const employeesSupportChartRef = useRef(null);
  const employeesDevChartRef = useRef(null);

  const chartInstances = useRef({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const createChart = (ref, type, data, id) => {
    if (chartInstances.current[id]) {
      chartInstances.current[id].destroy();
    }
    chartInstances.current[id] = new Chart(ref.current, { type, data, options: { responsive: true } });
  };

  useEffect(() => {
    createChart(barChartRef, 'bar', {
      labels: ['Arras', 'Nymphe', 'Arboledas', 'Vistahermosa', 'Adamant'],
      datasets: [{ label: 'Casos Residenciales', data: [12, 19, 3, 5, 2], backgroundColor: ['#371be5', '#2914ce', '#1c0db7', '#0e07a0', '#000089'] }]
    }, 'barChart');

    createChart(pieChartRef, 'pie', {
      labels: ['Administrador', 'Zendesk', 'Personal', 'Otro'],
      datasets: [{ label: 'Tickets Resueltos', data: [30, 20, 25, 25], backgroundColor: ['#331c9d', '#261588', '#1a0e74', '#0d0760'] }]
    }, 'pieChart');

    createChart(sprintChartRef, 'doughnut', {
      labels: ['Completado', 'Pendiente', 'Trabajando', 'Asignada'],
      datasets: [{ label: 'Sprint Desarrollo', data: [50, 20, 20, 10], backgroundColor: ['#0e0784', '#000064', '#1d0ea3', '#391ce2'] }]
    }, 'sprintChart');

    createChart(supportSprintChartRef, 'doughnut', {
      labels: ['Completado', 'Pendiente', 'Trabajando', 'Asignada'],
      datasets: [{ label: 'Sprint Soporte', data: [60, 15, 15, 10], backgroundColor: ['#1d0ea3', '#00004c', '#2b15c3', '#321aa0'] }]
    }, 'supportSprintChart');

    createChart(employeesSupportChartRef, 'bar', {
      labels: ['Rodolfo', 'Florian', 'Angel', 'Alexis', 'Cris'],
      datasets: [{ label: 'Actividades Completadas', data: [10, 15, 12, 18, 20], backgroundColor: ['#391ce2', '#2b15c3', '#1d0ea3', '#0e0784', '#000064'] }]
    }, 'employeesSupportChart');

    createChart(employeesDevChartRef, 'bar', {
      labels: ['Hamurabi', 'Carlos', 'Antonio'],
      datasets: [{ label: 'Actividades Completadas', data: [8, 9, 14], backgroundColor: ['#321aa0', '#25147b', '#190d57'] }]
    }, 'employeesDevChart');
  }, []);

  return (
    <MainLayout>
      <Container fluid className=" vh-100 p-7 mt-8" style={{ marginTop: "10px" }}>

        <h1 className="text-center my-5 dashboard-title">Dashboard</h1>

        {/* Filtros */}
        <Row className="mb-8 filter-section">
          <Col md={3}></Col> {/* Espacio vacío */}
          <Col md={8} className="d-flex">
            <Form.Control type="date" className="me-2" onChange={(e) => setStartDate(e.target.value)} />
            <Form.Control type="date" className="me-2" onChange={(e) => setEndDate(e.target.value)} />
            <Button variant="primary">Buscar</Button>
          </Col>
          <Col md={1}></Col> {/* Espacio vacío */}
        </Row>

        {/* Botones de filtro */}
        <Row className="mb-3">
          <Col md={3}></Col> {/* Espacio vacío */}
          <Col md={8} className="d-flex justify-content-center">
            <ButtonGroup>
              <Button variant="outline-primary">Día</Button>
              <Button variant="outline-primary">Semana</Button>
              <Button variant="outline-primary">Mes</Button>
              <Button variant="outline-primary">Año</Button>
            </ButtonGroup>
          </Col>
          <Col md={1}></Col> {/* Espacio vacío */}
        </Row>

        {/* Contenedor de gráficos */}
        <Row className="gx-5 gy-5">
          <Col md={3}></Col> {/* Espacio vacío */}
          <Col md={8}>
            <Card className="chart-container flex-grow-1 p-4" style={{ minHeight: '80vh' }}>
              <Row className="gx-5 gy-5">
                <Col md={6}><Card className="chart-card h-100 p-3"><h5>Residencial con más problemas</h5><canvas ref={barChartRef}></canvas></Card></Col>
                <Col md={6}><Card className="chart-card h-100 p-3"><h5>Tipo de tickets resueltos</h5><canvas ref={pieChartRef}></canvas></Card></Col>
              </Row>

              <Row className="gx-5 gy-5">
                <Col md={6}><Card className="chart-card h-100 p-3"><h5>Sprint de desarrollo semanal</h5><canvas ref={sprintChartRef}></canvas></Card></Col>
                <Col md={6}><Card className="chart-card h-100 p-3"><h5>Sprint de soporte</h5><canvas ref={supportSprintChartRef}></canvas></Card></Col>
              </Row>

              <Row className="gx-5 gy-5">
                <Col md={6}><Card className="chart-card h-100 p-3"><h5>Actividades de soporte</h5><canvas ref={employeesSupportChartRef}></canvas></Card></Col>
                <Col md={6}><Card className="chart-card h-100 p-3"><h5>Actividades de desarrollo</h5><canvas ref={employeesDevChartRef}></canvas></Card></Col>
              </Row>
            </Card>
          </Col>
          <Col md={1}></Col> {/* Espacio vacío */}
        </Row>
      </Container>
    </MainLayout>
  );
};

export default Dashboard;
