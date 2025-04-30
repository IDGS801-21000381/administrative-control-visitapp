import PropTypes from 'prop-types';
import { extractStatus } from '../../utils/reportUtils.js';

const ReportTable = ({ data = [], correctedTexts = {} }) => {
  const headerStyle = {
    backgroundColor: '#e0efff',
    color: '#003f7d',
    padding: '8px',
    textAlign: 'left',
    border: '1px solid #ccc'
  };

  const cellStyle = {
    padding: '8px',
    textAlign: 'left',
    border: '1px solid #ccc'
  };

  const getStatusText = (status) => {
    const lowerStatus = status?.toLowerCase() || '';
    if (lowerStatus.includes('finalizado') || lowerStatus.includes('terminado')) return 'Finalizado';
    if (lowerStatus.includes('resuelto')) return 'Resuelto';
    if (lowerStatus.includes('pendiente') || lowerStatus.includes('proceso')) return 'Pendiente';
    return status || 'N/A';
  };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
      <thead>
        <tr>
          <th style={headerStyle}>Fecha</th>
          <th style={headerStyle}>Tipo de Soporte</th>
          <th style={headerStyle}>Descripción</th>
          <th style={headerStyle}>Solución</th>
          <th style={headerStyle}>Estado</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => {
          const status = extractStatus(row);
          return (
            <tr key={`row-${index}`}>
              <td style={cellStyle}>{row[1] || 'N/A'}</td>
              <td style={cellStyle}>Soporte Técnico</td>
              <td style={{...cellStyle, maxWidth: '200px', wordWrap: 'break-word'}}>
                {correctedTexts[row[8]] || row[8] || 'N/A'}
              </td>
              <td style={{...cellStyle, maxWidth: '200px', wordWrap: 'break-word'}}>
                {correctedTexts[row[9]] || row[9] || 'N/A'}
              </td>
              <td style={cellStyle}>{getStatusText(status)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

ReportTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ])
    )
  ),
  correctedTexts: PropTypes.object
};

ReportTable.defaultProps = {
  data: [],
  correctedTexts: {}
};

export default ReportTable;