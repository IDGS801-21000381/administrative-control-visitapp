import React, { useState, useRef } from 'react';
import MainLayout from '../layouts/MainLayout';
import '../style/Client.css';
import Papa from 'papaparse';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

const tenants = [
  "adamant", "aldaba1", "altozano", "arboleda", "arras", "basania", "campina", "campina1",
  "campina2", "campina3", "campina4", "campina5", "campina6", "campina7", "campina8",
  "campina9", "campina10", "chivas", "cortes", "downtownsantafe", "fujiyama693", "lomas",
  "lomas1", "nymphe", "quintas", "bosques", "mirador", "granjardin", "riberas del campestre",
  "CoyoacLapian", "colinasVista hermosa", "Lapi", "Vista hermosa", "elgin", "yaxiik", "otro"
];

const months = [
  { value: 'Enero', label: 'Enero' },
  { value: 'Febrero', label: 'Febrero' },
  { value: 'Marzo', label: 'Marzo' },
  { value: 'Abril', label: 'Abril' },
  { value: 'Mayo', label: 'Mayo' },
  { value: 'Junio', label: 'Junio' },
  { value: 'Julio', label: 'Julio' },
  { value: 'Agosto', label: 'Agosto' },
  { value: 'Septiembre', label: 'Septiembre' },
  { value: 'Octubre', label: 'Octubre' },
  { value: 'Noviembre', label: 'Noviembre' },
  { value: 'Diciembre', label: 'Diciembre' }
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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const reportRef = useRef();

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

    if (selectedTenant) {
      filtered = filtered.filter(row => 
        row[6]?.toLowerCase() === selectedTenant.toLowerCase()
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter(row => {
        if (!row[1]) return false;
        
        const dateParts = row[1].split(/[/-]/);
        if (dateParts.length < 2) return false;
        
        const month = dateParts[1];
        const monthName = monthsMap[month] || '';
        
        return monthName === selectedMonth;
      });
    }

    setFilteredData(filtered);
  };

  const getFrequentIssues = (data) => {
    if (data.length === 0) return 'No se encontraron problemas recurrentes';
    
    const issues = {};
    data.forEach(row => {
      const issue = row[8] || 'Desconocido';
      issues[issue] = (issues[issue] || 0) + 1;
    });
    
    const sortedIssues = Object.entries(issues).sort((a, b) => b[1] - a[1]);
    return sortedIssues.slice(0, 3).map(([issue, count]) => 
      `${issue} (${count} veces)`
    ).join(', ');
  };

  const getNextMonth = (currentMonth) => {
    if (!currentMonth) return 'Próximo mes';
    
    const monthOrder = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const currentIndex = monthOrder.indexOf(currentMonth);
    if (currentIndex === -1) return 'Próximo mes';
    
    const nextIndex = (currentIndex + 1) % 12;
    return monthOrder[nextIndex];
  };

  // Función para exportar a CSV
  const exportToCSV = () => {
    if (filteredData.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const headers = [
      'ID', 'Fecha', 'Hora', 'Usuario', 'Email', 'Teléfono', 
      'Residencial', 'Tipo de Soporte', 'Descripción', 'Solución', 'Estado'
    ];

    const csvContent = [
      headers,
      ...filteredData
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_${selectedTenant || 'general'}_${selectedMonth || 'todos'}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Función para exportar a Excel
  const exportToExcel = () => {
    if (filteredData.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const headers = [
      'ID', 'Fecha', 'Hora', 'Usuario', 'Email', 'Teléfono', 
      'Residencial', 'Tipo de Soporte', 'Descripción', 'Solución', 'Estado'
    ];

    const wsData = [
      headers,
      ...filteredData
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, `reporte_${selectedTenant || 'general'}_${selectedMonth || 'todos'}.xlsx`);
  };

  const downloadPdf = async () => {
    if (!reportRef.current || filteredData.length === 0) return;
    
    setIsGeneratingPdf(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Configuración optimizada para html2canvas
      const options = {
        scale: 1,
        useCORS: true,
        logging: false,
        removeContainer: true,
        backgroundColor: '#ffffff',
        windowWidth: 900,
        width: 900
      };
      
      // Función para agregar una imagen al PDF
      const addImageToPdf = async (element, isFirstPage = true) => {
        const canvas = await html2canvas(element, options);
        const imgData = canvas.toDataURL('image/jpeg', 0.8);
        
        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        if (!isFirstPage) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'JPEG', 10, 10, imgWidth, imgHeight);
        return imgHeight;
      };
      
      // Dividir el contenido en 3 partes lógicas
      const header = reportRef.current.querySelector('.report-header');
      const section1 = reportRef.current.querySelector('.section-1');
      const section2 = reportRef.current.querySelector('.section-2');
      const section3 = reportRef.current.querySelector('.section-3');
      const section4 = reportRef.current.querySelector('.section-4');
      const footer = reportRef.current.querySelector('.report-footer');
      
      // Primera página: Encabezado + Sección 1
      const tempDiv1 = document.createElement('div');
      tempDiv1.style.width = '900px';
      tempDiv1.style.background = 'white';
      tempDiv1.appendChild(header.cloneNode(true));
      tempDiv1.appendChild(section1.cloneNode(true));
      document.body.appendChild(tempDiv1);
      await addImageToPdf(tempDiv1, true);
      document.body.removeChild(tempDiv1);
      
      // Segunda página: Sección 2 (tabla de visitas)
      const tempDiv2 = document.createElement('div');
      tempDiv2.style.width = '900px';
      tempDiv2.style.background = 'white';
      tempDiv2.appendChild(section2.cloneNode(true));
      document.body.appendChild(tempDiv2);
      await addImageToPdf(tempDiv2, false);
      document.body.removeChild(tempDiv2);
      
      // Tercera página: Secciones 3 y 4 + footer
      const tempDiv3 = document.createElement('div');
      tempDiv3.style.width = '900px';
      tempDiv3.style.background = 'white';
      tempDiv3.appendChild(section3.cloneNode(true));
      tempDiv3.appendChild(section4.cloneNode(true));
      tempDiv3.appendChild(footer.cloneNode(true));
      document.body.appendChild(tempDiv3);
      await addImageToPdf(tempDiv3, false);
      document.body.removeChild(tempDiv3);
      
      // Guardar el PDF
      pdf.save(`reporte_${selectedTenant || 'general'}_${selectedMonth || 'todos'}.pdf`);
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Ocurrió un error al generar el PDF. Por favor intenta nuevamente.');
    } finally {
      setIsGeneratingPdf(false);
    }
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
              <select 
                className="form-select" 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">Todos los meses</option>
                {months.map((month, index) => (
                  <option key={index} value={month.value}>{month.label}</option>
                ))}
              </select>
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

            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button 
                type="button" 
                className="btn btn-primary me-md-2"
                onClick={handleGenerateReport}
                disabled={isGeneratingPdf}
              >
                Generar Reporte
              </button>
              
              {filteredData.length > 0 && (
                <>
                  <button 
                    type="button" 
                    className="btn btn-success me-md-2"
                    onClick={downloadPdf}
                    disabled={isGeneratingPdf}
                  >
                    {isGeneratingPdf ? 'Generando PDF...' : 'Descargar PDF'}
                  </button>
                  
                  <button 
                    type="button" 
                    className="btn btn-secondary me-md-2"
                    onClick={exportToCSV}
                  >
                    Exportar CSV
                  </button>
                  
                  <button 
                    type="button" 
                    className="btn btn-info"
                    onClick={exportToExcel}
                  >
                    Exportar Excel
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        {filteredData.length > 0 && (
          <div className="mt-4">
            <div 
              ref={reportRef} 
              style={{
                background: 'white',
                width: '900px',
                margin: '0 auto',
                boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                overflow: 'hidden'
              }}
            >
              {/* Encabezado del reporte */}
              <div className="report-header">
                <div style={{backgroundColor: '#005baa', height: '40px', width: '100%'}}></div>
                
                <div style={{padding: '30px 40px'}}>
                  <div style={{textAlign: 'center', marginBottom: '30px'}}>
                    <img 
                      src="https://visitapp.la/images/logo-01.png" 
                      alt="VisitApp Logo" 
                      style={{width: '250px'}}
                      crossOrigin="anonymous"
                    />
                  </div>
                  
                  <h1 style={{color: '#003f7d', textAlign: 'center', marginBottom: '10px'}}>
                    Reporte Mensual de Atención y Soporte
                  </h1>
                  
                  <p>
                    <span style={{fontWeight: 'bold', color: '#005baa'}}>Residencial:</span> 
                    {selectedTenant || 'Todos los residenciales'}
                  </p>
                  
                  <p>
                    <span style={{fontWeight: 'bold', color: '#005baa'}}>Periodo del Reporte:</span> 
                    {selectedMonth || 'Todos los meses'}
                  </p>
                </div>
              </div>

              {/* Sección 1: Resumen General */}
              <div className="section-1 report-section" style={{padding: '0 40px'}}>
                <h2 style={{color: '#005baa', marginTop: '30px'}}>1. Resumen General</h2>
                <ul style={{paddingLeft: '20px'}}>
                  <li>Total de Visitas o Soportes Realizados: {filteredData.length}</li>
                  <li>Asuntos Resueltos: {filteredData.filter(row => row[10]?.toLowerCase().includes('resuelto')).length}</li>
                  <li>Asuntos Pendientes o en Proceso: {filteredData.filter(row => row[10]?.toLowerCase().includes('proceso')).length}</li>
                </ul>
              </div>

              {/* Sección 2: Detalle de Visitas */}
              <div className="section-2 report-section" style={{padding: '0 40px 30px'}}>
                <h2 style={{color: '#005baa', marginTop: '30px'}}>2. Detalle de Visitas o Soportes</h2>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  marginTop: '10px',
                  fontSize: '14px'
                }}>
                  <thead>
                    <tr>
                      <th style={{
                        backgroundColor: '#e0efff',
                        color: '#003f7d',
                        padding: '8px',
                        textAlign: 'left',
                        border: '1px solid #ccc'
                      }}>Fecha</th>
                      <th style={{
                        backgroundColor: '#e0efff',
                        color: '#003f7d',
                        padding: '8px',
                        textAlign: 'left',
                        border: '1px solid #ccc'
                      }}>Tipo de Soporte</th>
                      <th style={{
                        backgroundColor: '#e0efff',
                        color: '#003f7d',
                        padding: '8px',
                        textAlign: 'left',
                        border: '1px solid #ccc'
                      }}>Descripción</th>
                      <th style={{
                        backgroundColor: '#e0efff',
                        color: '#003f7d',
                        padding: '8px',
                        textAlign: 'left',
                        border: '1px solid #ccc'
                      }}>Solución</th>
                      <th style={{
                        backgroundColor: '#e0efff',
                        color: '#003f7d',
                        padding: '8px',
                        textAlign: 'left',
                        border: '1px solid #ccc'
                      }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row, index) => (
                      <tr key={index}>
                        <td style={{
                          padding: '8px',
                          textAlign: 'left',
                          border: '1px solid #ccc'
                        }}>{row[1] || 'N/A'}</td>
                        <td style={{
                          padding: '8px',
                          textAlign: 'left',
                          border: '1px solid #ccc'
                        }}>{row[7] || 'N/A'}</td>
                        <td style={{
                          padding: '8px',
                          textAlign: 'left',
                          border: '1px solid #ccc',
                          maxWidth: '200px',
                          wordWrap: 'break-word'
                        }}>{row[8] || 'N/A'}</td>
                        <td style={{
                          padding: '8px',
                          textAlign: 'left',
                          border: '1px solid #ccc',
                          maxWidth: '200px',
                          wordWrap: 'break-word'
                        }}>{row[9] || 'N/A'}</td>
                        <td style={{
                          padding: '8px',
                          textAlign: 'left',
                          border: '1px solid #ccc'
                        }}>{row[10] || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Sección 3: Incidencias */}
              <div className="section-3 report-section" style={{padding: '0 40px 30px'}}>
                <h2 style={{color: '#005baa', marginTop: '30px'}}>3. Incidencias Frecuentes y Recomendaciones</h2>
                <ul style={{paddingLeft: '20px'}}>
                  <li>
                    <span style={{fontWeight: 'bold', color: '#005baa'}}>Problemas Recurrentes:</span> 
                    {getFrequentIssues(filteredData)}
                  </li>
                  <li>
                    <span style={{fontWeight: 'bold', color: '#005baa'}}>Recomendaciones:</span> 
                    Realizar mantenimiento preventivo periódico y actualizar los sistemas regularmente.
                  </li>
                </ul>
              </div>

              {/* Sección 4: Siguientes pasos */}
              <div className="section-4 report-section" style={{padding: '0 40px 30px'}}>
                <h2 style={{color: '#005baa', marginTop: '30px'}}>4. Siguientes Pasos</h2>
                <ul style={{paddingLeft: '20px'}}>
                  <li>
                    <span style={{fontWeight: 'bold', color: '#005baa'}}>Plan de Mantenimiento Preventivo:</span> 
                    Monitoreo continuo de parte de VisitApp
                  </li>
                  <li>
                    <span style={{fontWeight: 'bold', color: '#005baa'}}>Próxima Revisión:</span> 
                    {getNextMonth(selectedMonth)}
                  </li>
                  <li>
                    <span style={{fontWeight: 'bold', color: '#005baa'}}>Acciones Pendientes por Confirmar:</span> 
                    Seguimiento a casos en proceso
                  </li>
                </ul>
              </div>

              {/* Pie del reporte */}
              <div className="report-footer" style={{padding: '0 40px 30px'}}>
                <p style={{marginTop: '30px'}}>
                  Continuamos trabajando para garantizar la mejor experiencia y mantener un alto nivel de satisfacción entre nuestros clientes.
                </p>
              </div>

              <div style={{backgroundColor: '#005baa', height: '40px', width: '100%'}}></div>
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