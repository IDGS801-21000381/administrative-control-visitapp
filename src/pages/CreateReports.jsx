import React, { useState, useRef, useEffect, useCallback } from 'react';
import MainLayout from '../layouts/MainLayout';
import '../style/Client.css';
import Papa from 'papaparse';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import tenants from '../constants/tenants';
import monthsMap from '../constants/monthsMap';
import { corregirTexto, resumirTexto } from '../service/textProcessor.js';

const CreateReports = () => {
  const [selectedTenant, setSelectedTenant] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [includeNextReview, setIncludeNextReview] = useState(true);
  const [csvData, setCsvData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isProcessingText, setIsProcessingText] = useState(false);
  const [reportSummary, setReportSummary] = useState('');
  const [correctedTexts, setCorrectedTexts] = useState({});
  
  // Estados para contenido editable y validado
  const [editableFrequentIssues, setEditableFrequentIssues] = useState('');
  const [editableRecommendations, setEditableRecommendations] = useState('');
  const [editablePreventivePlan, setEditablePreventivePlan] = useState('');
  const [validatedContent, setValidatedContent] = useState({
    frequentIssues: '',
    recommendations: '',
    preventivePlan: ''
  });

  const reportRef = useRef();

  const processReportTexts = useCallback(async (data) => {
    setIsProcessingText(true);
    try {
      const textsToCorrect = {};
      const sampleData = data.slice(0, 5);
      
      for (const row of sampleData) {
        if (row[8]) {
          const corrected = await corregirTexto(row[8]);
          textsToCorrect[row[8]] = corrected;
        }
        if (row[9]) {
          const corrected = await corregirTexto(row[9]);
          textsToCorrect[row[9]] = corrected;
        }
      }
      
      setCorrectedTexts(textsToCorrect);
      
      const summaryContent = `Reporte de ${selectedTenant || 'todos los tenants'} para ${selectedMonth || 'todos los meses'}. ` +
                            `Total de visitas: ${data.length}. ` +
                            `Problemas frecuentes: ${getFrequentIssues(data)}. ` +
                            `Recomendaciones: Realizar mantenimiento preventivo.`;
      
      const summary = await resumirTexto(summaryContent);
      setReportSummary(summary);
      
    } catch (error) {
      console.error('Error procesando textos:', error);
    } finally {
      setIsProcessingText(false);
    }
  }, [selectedTenant, selectedMonth]);

  useEffect(() => {
    if (filteredData.length > 0) {
      processReportTexts(filteredData);
    }
  }, [filteredData, processReportTexts]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (fileExtension === 'csv') {
      Papa.parse(file, {
        complete: (result) => {
          setCsvData(result.data.slice(1));
          setFileUploaded(true);
        },
        header: false,
      });
    } else if (fileExtension === 'xlsx') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setCsvData(jsonData.slice(1));
        setFileUploaded(true);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Por favor sube un archivo CSV o XLSX');
    }
  };

  const handleGenerateReport = () => {
    if (!fileUploaded) {
      alert('Por favor sube un archivo primero');
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
    setEditableFrequentIssues(getFrequentIssues(filtered));
    setEditableRecommendations('Realizar mantenimiento preventivo periódico y actualizar los sistemas regularmente.');
    setEditablePreventivePlan('Monitoreo continuo de parte de VisitApp');
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

  const getNextReviewDate = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    
    while (nextMonth.getDay() !== 5) {
      nextMonth.setDate(nextMonth.getDate() + 1);
    }
    
    const day = nextMonth.getDate();
    const month = nextMonth.getMonth() + 1;
    
    return `${day} de ${monthsMap[month.toString()]}`;
  };

  const getCurrentDate = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const extractStatus = (row) => {
    const namePattern = /(Angel|Florian|Rodolfo|Cris|Alexis)/i;
    const rowString = row.join(' ');
    const nameMatch = rowString.match(namePattern);
    
    if (nameMatch) {
      const nameIndex = rowString.indexOf(nameMatch[0]);
      const statusPart = rowString.substring(0, nameIndex).trim();
      return statusPart || 'N/A';
    }
    return 'N/A';
  };

  const getCorrectedText = (originalText) => {
    return correctedTexts[originalText] || originalText;
  };

  const validateContent = async () => {
    try {
      const correctedFrequent = await corregirTexto(editableFrequentIssues);
      const correctedRecommendations = await corregirTexto(editableRecommendations);
      const correctedPreventive = await corregirTexto(editablePreventivePlan);

      setValidatedContent({
        frequentIssues: correctedFrequent,
        recommendations: correctedRecommendations,
        preventivePlan: correctedPreventive
      });

      return true;
    } catch (error) {
      console.error('Error validando contenido:', error);
      alert('Error al validar el contenido. Verifica la conexión e intenta nuevamente.');
      return false;
    }
  };

  const downloadPdf = async () => {
    if (!reportRef.current || filteredData.length === 0) return;
    
    const isValid = await validateContent();
    if (!isValid) return;

    setIsGeneratingPdf(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const options = {
        scale: 1,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 900,
        width: 900,
        onclone: (clonedDoc) => {
          clonedDoc.querySelectorAll('.editable-field').forEach(element => {
            element.style.display = 'none';
          });
          clonedDoc.querySelectorAll('.validated-text').forEach(element => {
            element.style.display = 'block';
          });
        }
      };

      const canvas = await html2canvas(reportRef.current, options);
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      const imgWidth = pdf.internal.pageSize.getWidth() - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 10, 10, imgWidth, imgHeight);
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
                {Object.entries(monthsMap).filter(([key]) => isNaN(key) || key.length > 2).map(([key, value]) => (
                  <option key={key} value={value}>{value}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">¿Incluir próxima revisión?</label>
              <select 
                className="form-select" 
                value={includeNextReview}
                onChange={(e) => setIncludeNextReview(e.target.value === 'true')}
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Subir Archivo (CSV o Excel)</label>
              <input 
                type="file" 
                className="form-control" 
                accept=".csv,.xlsx,.xls" 
                onChange={handleFileUpload} 
              />
            </div>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button 
                type="button" 
                className="btn btn-primary me-md-2"
                onClick={handleGenerateReport}
                disabled={isGeneratingPdf || isProcessingText}
              >
                Generar Reporte
              </button>
              
              {filteredData.length > 0 && (
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={downloadPdf}
                  disabled={isGeneratingPdf || isProcessingText}
                >
                  {isGeneratingPdf ? 'Generando PDF...' : 'Descargar PDF'}
                </button>
              )}
            </div>
          </form>
        </div>

        {isProcessingText && (
          <div className="alert alert-info mt-4">
            Procesando y mejorando el contenido del reporte...
          </div>
        )}

        {filteredData.length > 0 && (
          <div className="mt-4 report-preview">
            <div 
              ref={reportRef} 
              style={{
                background: 'white',
                width: '900px',
                margin: '0 auto',
                boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div className="background-image" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'url(/vi.png)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                opacity: 0.1,
                zIndex: 0
              }}></div>

              <div style={{position: 'relative', zIndex: 1}}>
                <div className="report-header">
                  <div style={{backgroundColor: '#005baa', height: '40px', width: '100%'}}></div>
                  
                  <div style={{padding: '30px 40px'}}>
                    <div style={{textAlign: 'center', marginBottom: '30px'}}>
                      <img 
                        src="/logo-01.png" 
                        alt="VisitApp Logo" 
                        style={{width: '250px'}}
                      />
                    </div>
                    
                    <h1 style={{color: '#003f7d', textAlign: 'center', marginBottom: '10px'}}>
                      Reporte Mensual de Atención y Soporte
                    </h1>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                      <div>
                        <p>
                          <span style={{fontWeight: 'bold', color: '#005baa'}}>Residencial:</span> 
                          {selectedTenant || 'Todos los residenciales'}
                        </p>
                        
                        <p>
                          <span style={{fontWeight: 'bold', color: '#005baa'}}>Periodo del Reporte:</span> 
                          {selectedMonth || 'Todos los meses'}
                        </p>
                        
                        <p>
                          <span style={{fontWeight: 'bold', color: '#005baa'}}>Fecha de Creación:</span> 
                          {getCurrentDate()}
                        </p>
                      </div>
                      
                      {includeNextReview && (
                        <div>
                          <p>
                            <span style={{fontWeight: 'bold', color: '#005baa'}}>Próxima Revisión:</span> 
                            {getNextReviewDate()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="report-section" style={{padding: '0 40px'}}>
                  <h2 style={{color: '#005baa', marginTop: '30px'}}>1. Resumen General</h2>
                  <ul style={{paddingLeft: '20px'}}>
                    <li>Total de Visitas o Soportes Realizados: {filteredData.length}</li>
                    <li>Asuntos Resueltos: {
                      filteredData.filter(row => {
                        const status = extractStatus(row);
                        return status.toLowerCase().includes('finalizado') || 
                               status.toLowerCase().includes('resuelto') ||
                               status.toLowerCase().includes('terminado');
                      }).length
                    }</li>
                    <li>Asuntos Pendientes: {
                      filteredData.filter(row => {
                        const status = extractStatus(row);
                        return status.toLowerCase().includes('pendiente') || 
                               status.toLowerCase().includes('proceso');
                      }).length
                    }</li>
                  </ul>
                </div>

                <div className="report-section" style={{padding: '0 40px 30px'}}>
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
                      {filteredData.map((row, index) => {
                        const status = extractStatus(row);
                        return (
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
                            }}>Soporte Técnico</td>
                            <td style={{
                              padding: '8px',
                              textAlign: 'left',
                              border: '1px solid #ccc',
                              maxWidth: '200px',
                              wordWrap: 'break-word'
                            }}>{getCorrectedText(row[8]) || 'N/A'}</td>
                            <td style={{
                              padding: '8px',
                              textAlign: 'left',
                              border: '1px solid #ccc',
                              maxWidth: '200px',
                              wordWrap: 'break-word'
                            }}>{getCorrectedText(row[9]) || 'N/A'}</td>
                            <td style={{
                              padding: '8px',
                              textAlign: 'left',
                              border: '1px solid #ccc'
                            }}>{
                              status.toLowerCase().includes('finalizado') ? 'Finalizado' :
                              status.toLowerCase().includes('pendiente') ? 'Pendiente' :
                              status.toLowerCase().includes('resuelto') ? 'Resuelto' :
                              status.toLowerCase().includes('terminado') ? 'Finalizado' :
                              status.toLowerCase().includes('proceso') ? 'Pendiente' :
                              status || 'N/A'
                            }</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="report-section" style={{padding: '0 40px 30px'}}>
                  <h2 style={{color: '#005baa', marginTop: '30px'}}>3. Incidencias Frecuentes y Recomendaciones</h2>
                  <ul style={{paddingLeft: '20px'}}>
                    <li>
                      <span style={{fontWeight: 'bold', color: '#005baa'}}>Problemas Recurrentes:</span>
                      <textarea
                        value={editableFrequentIssues}
                        onChange={(e) => setEditableFrequentIssues(e.target.value)}
                        className="editable-field"
                        style={{marginTop: '5px'}}
                      />
                      <div className="validated-text" style={{display: 'none'}}>
                        {validatedContent.frequentIssues}
                      </div>
                    </li>
                    <li>
                      <span style={{fontWeight: 'bold', color: '#005baa'}}>Recomendaciones:</span>
                      <textarea
                        value={editableRecommendations}
                        onChange={(e) => setEditableRecommendations(e.target.value)}
                        className="editable-field"
                        style={{marginTop: '5px'}}
                      />
                      <div className="validated-text" style={{display: 'none'}}>
                        {validatedContent.recommendations}
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="report-section" style={{padding: '0 40px 30px'}}>
                  <h2 style={{color: '#005baa', marginTop: '30px'}}>4. Siguientes Pasos</h2>
                  <ul style={{paddingLeft: '20px'}}>
                    <li>
                      <span style={{fontWeight: 'bold', color: '#005baa'}}>Plan de Mantenimiento Preventivo:</span>
                      <input
                        type="text"
                        value={editablePreventivePlan}
                        onChange={(e) => setEditablePreventivePlan(e.target.value)}
                        className="editable-field"
                        style={{marginTop: '5px'}}
                      />
                      <div className="validated-text" style={{display: 'none'}}>
                        {validatedContent.preventivePlan}
                      </div>
                    </li>
                    <li>
                      <span style={{fontWeight: 'bold', color: '#005baa'}}>Acciones Pendientes por Confirmar:</span>
                      <div style={{marginTop: '5px'}}>
                        Continuaremos trabajando para garantizar la mejor experiencia y mantener un alto nivel de satisfacción entre nuestros clientes.
                      </div>
                    </li>
                  </ul>
                </div>

                <div style={{backgroundColor: '#005baa', height: '40px', width: '100%'}}></div>
              </div>
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