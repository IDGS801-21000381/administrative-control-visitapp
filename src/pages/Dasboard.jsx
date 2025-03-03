import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import MainLayout from '../layouts/MainLayout';
import '../style/Dasboard.css'; // Asegúrate de que el archivo CSS esté correctamente vinculado

Chart.register(...registerables);

const Dashboard = () => {
  const chartRefs = {
    bar: useRef(null),
    pie: useRef(null),
    sprint: useRef(null),
    supportSprint: useRef(null),
    employeesSupport: useRef(null),
    employeesDev: useRef(null),
  };

  const chartInstances = useRef({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const createChart = (ref, type, data, id) => {
    if (chartInstances.current[id]) {
      chartInstances.current[id].destroy();
    }
    chartInstances.current[id] = new Chart(ref.current, {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: data.datasets[0].label,
            font: {
              size: 16,
            },
          },
        },
      },
    });
  };

  useEffect(() => {
    createChart(chartRefs.bar, 'bar', {
      labels: ['Arras', 'Nymphe', 'Arboledas', 'Vistahermosa', 'Adamant'],
      datasets: [{ label: 'Residencial con más casos', data: [12, 19, 3, 5, 2], backgroundColor: ['#4c72b0', '#5a9bd4', '#8da0cb', '#b3cde3', '#ccebc5'] }],
    }, 'bar');

    createChart(chartRefs.pie, 'pie', {
      labels: ['Administrador', 'Zendesk', 'Personal', 'Otro'],
      datasets: [{ label: 'Tickets Resueltos', data: [30, 20, 25, 25], backgroundColor: ['#4c72b0', '#5a9bd4', '#8da0cb', '#b3cde3'] }],
    }, 'pie');

    createChart(chartRefs.sprint, 'doughnut', {
      labels: ['Completado', 'Pendiente', 'Trabajando', 'Asignada'],
      datasets: [{ label: 'Sprint Desarrollo', data: [50, 20, 20, 10], backgroundColor: ['#4c72b0', '#5a9bd4', '#8da0cb', '#b3cde3'] }],
    }, 'sprint');

    createChart(chartRefs.supportSprint, 'doughnut', {
      labels: ['Completado', 'Pendiente', 'Trabajando', 'Asignada'],
      datasets: [{ label: 'Sprint Soporte', data: [60, 15, 15, 10], backgroundColor: ['#4c72b0', '#5a9bd4', '#8da0cb', '#b3cde3'] }],
    }, 'supportSprint');

    createChart(chartRefs.employeesSupport, 'bar', {
      labels: ['Rodolfo', 'Florian', 'Angel', 'Alexis', 'Cris'],
      datasets: [{ label: 'Actividades Completadas De Soporte', data: [10, 15, 12, 18, 20], backgroundColor: ['#4c72b0', '#5a9bd4', '#8da0cb', '#b3cde3'] }],
    }, 'employeesSupport');

    createChart(chartRefs.employeesDev, 'bar', {
      labels: ['Hamurabi', 'Carlos', 'Antonio'],
      datasets: [{ label: 'Actividades Completadas De Desarrollo', data: [8, 9, 14], backgroundColor: ['#4c72b0', '#5a9bd4', '#8da0cb'] }],
    }, 'employeesDev');

    return () => {
      Object.values(chartInstances.current).forEach(chart => chart.destroy());
    };
  }, []);

  return (
    <MainLayout>
      <Container fluid className="dashboard-container">
        <Card className="dashboard-card">
          <h3 className="dashboard-title">Dashboard</h3>
          {/* Filtros */}
          <div className="filters-container">
            <Form.Control
              type="date"
              className="input-search"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Form.Control
              type="date"
              className="input-search"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Form.Select className="input-search">
              <option selected>Seleccione</option>
              <option>Enero</option>
              <option>Febrero</option>
              <option>Marzo</option>
              <option>Abril</option>
              <option>Mayo</option>
              <option>Junio</option>
              <option>Julio</option>
              <option>Septiembre</option>
              <option>Octubre</option>
              <option>Noviembre</option>
              <option>Diciembre</option>
            </Form.Select>
            <Form.Select className="input-search">
              <option selected>Seleccione</option>
              <option>2020</option>
              <option>2021</option>
              <option>2022</option>
              <option>2023</option>
              <option>2024</option>
              <option>2025</option>
              <option>2026</option>
              <option>2027</option>
            </Form.Select>
            <Button variant="dark" className="btn-today">Hoy</Button>
            <Button variant="secondary" className="btn-week">Semana</Button>
            <Button variant="primary" className="btn-search">Buscar</Button>
          </div>
          {/* Sección de gráficos */}
          <h4 className="section-title" style={{ color: 'black' }}>Clientes</h4>
          <Row>
            <Col md={6}>
              <Card className="chart-card">
                <canvas ref={chartRefs.bar} />
              </Card>
            </Col>
            <Col md={6}>
              <Card className="chart-card">
                <canvas ref={chartRefs.pie} />
              </Card>
            </Col>
          </Row>
          <h4 className="section-title" style={{ color: 'black' }}>Avances de Actividades</h4>
          <Row>
            <Col md={6}>
              <Card className="chart-card">
                <canvas ref={chartRefs.sprint} />
              </Card>
            </Col>
            <Col md={6}>
              <Card className="chart-card">
                <canvas ref={chartRefs.supportSprint} />
              </Card>
            </Col>
          </Row>
          <h4 className="section-title" style={{ color: 'black' }}>Empleados</h4>
          <Row>
            <Col md={6}>
              <Card className="chart-card">
                <canvas ref={chartRefs.employeesSupport} />
              </Card>
            </Col>
            <Col md={6}>
              <Card className="chart-card">
                <canvas ref={chartRefs.employeesDev} />
              </Card>
            </Col>
          </Row>
        </Card>
      </Container>
    </MainLayout>
  );
};

export default Dashboard;