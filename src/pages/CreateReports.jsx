import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import '../style/Client.css';
import Papa from 'papaparse';

const tenants = [
  "adamant", "aldaba1", "altozano", "arboleda", "arras", "basania", "campina", "campina1",
  "campina2", "campina3", "campina4", "campina5", "campina6", "campina7", "campina8",
  "campina9", "campina10", "chivas", "cortes", "downtownsantafe", "fujiyama693", "lomas",
  "lomas1", "nymphe", "quintas", "bosques", "mirador", "granjardin", "riberas del campestre",
  "CoyoacLapian", "colinasVista hermosa", "Lapi", "Vista hermosa", "elgin", "yaxiik", "otro"
];

const monthsMap = {
  '01': 'Enero', '1': 'Enero', 'enero': 'Enero',
  '02': 'Febrero', '2': 'Febrero', 'febrero': 'Febrero', 'feb': 'Febrero',
  '03': 'Marzo', '3': 'Marzo', 'marzo': 'Marzo', 'mar': 'Marzo',
  '04': 'Abril', '4': 'Abril', 'abril': 'Abril', 'abr': 'Abril',
  '05': 'Mayo', '5': 'Mayo', 'mayo': 'Mayo', 'may': 'Mayo',
  '06': 'Junio', '6': 'Junio', 'junio': 'Junio', 'jun': 'Junio',
  '07': 'Julio', '7': 'Julio', 'julio': 'Julio', 'jul': 'Julio',
  '08': 'Agosto', '8': 'Agosto', 'agosto': 'Agosto', 'ago': 'Agosto',
  '09': 'Septiembre', '9': 'Septiembre', 'septiembre': 'Septiembre', 'sep': 'Septiembre',
  '10': 'Octubre', 'octubre': 'Octubre', 'oct': 'Octubre',
  '11': 'Noviembre', 'noviembre': 'Noviembre', 'nov': 'Noviembre',
  '12': 'Diciembre', 'diciembre': 'Diciembre', 'dic': 'Diciembre'
};

const CreateReports = () => {
  const [selectedTenant, setSelectedTenant] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (result) => {
        setCsvData(result.data.slice(1)); // Ignorar encabezados
        setFileUploaded(true);
      },
      header: false,
    });
  };

  const handleGenerateReport = () => {
    if (!fileUploaded) {
      alert('Por favor sube un archivo CSV primero');
      return;
    }

    let filtered = csvData;

    // Filtrar por tenant si está seleccionado
    if (selectedTenant) {
      filtered = filtered.filter(row => 
        row[6]?.toLowerCase() === selectedTenant.toLowerCase()
      );
    }

    // Filtrar por mes si está seleccionado
    if (selectedMonth) {
      filtered = filtered.filter(row => {
        if (!row[1]) return false;
        
        // Extraer mes de la fecha (formato esperado: DD/MM/YYYY o similar)
        const dateParts = row[1].split(/[/-]/);
        if (dateParts.length < 2) return false;
        
        const month = dateParts[1];
        const monthName = monthsMap[month] || '';
        
        return monthName === selectedMonth;
      });
    }

    setFilteredData(filtered);
  };

  return (
    <MainLayout>
      <div className="page-container">
        <div className="card card-body shadow-lg p-4">
          <h1 className="dashboard-title_e text-center mb-4">Creación de Reportes</h1>
          
          <form>
            <div className="mb-3">
              <label className="form-label">Seleccionar Tenant</label>
              <select 
                className="form-select" 
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
              >
                <option value="">Todos los tenants</option>
                {tenants.map((tenant, index) => (
                  <option key={index} value={tenant}>{tenant}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Seleccionar Mes</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ej: 03, 3, marzo o mar"
                value={selectedMonth}
                onChange={(e) => {
                  const input = e.target.value.toLowerCase();
                  setSelectedMonth(monthsMap[input] || input);
                }}
              />
              <small className="text-muted">Puedes usar número (1-12) o nombre del mes</small>
            </div>

            <div className="mb-3">
              <label className="form-label">Subir Archivo CSV</label>
              <input 
                type="file" 
                className="form-control" 
                accept=".csv" 
                onChange={handleFileUpload} 
              />
            </div>

            <div className="d-grid">
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleGenerateReport}
              >
                Generar Reporte
              </button>
            </div>
          </form>
        </div>

        {filteredData.length > 0 && (
          <div className="card mt-4 p-3 shadow-sm">
            <h4 className="mb-3">Resultados del Reporte</h4>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Fecha</th>
                    <th>Tenant</th>
                    <th>Problemática</th>
                    <th>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, index) => (
                    <tr key={index}>
                      <td>{row[1]}</td>
                      <td>{row[6]}</td>
                      <td>{row[8]}</td>
                      <td>{row[9]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredData.length === 0 && fileUploaded && (
          <div className="alert alert-info mt-4">
            No se encontraron registros que coincidan con los filtros seleccionados.
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CreateReports;