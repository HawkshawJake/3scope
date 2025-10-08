import React from 'react';

const EmissionsTable = ({ emissionsData }) => {
  const tableStyle = {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    overflow: 'hidden',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  };

  const headerStyle = {
    backgroundColor: '#F9FAFB',
    padding: '16px 24px',
    borderBottom: '1px solid #E5E7EB',
  };

  const titleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  };

  const tableHeaderStyle = {
    backgroundColor: '#F9FAFB',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '12px 24px',
    borderBottom: '1px solid #E5E7EB',
  };

  const tableCellStyle = {
    padding: '16px 24px',
    borderBottom: '1px solid #F3F4F6',
    fontSize: '14px',
  };

  const scopeLabelStyle = {
    fontWeight: '600',
    color: '#111827',
  };

  const categoryStyle = {
    color: '#6B7280',
  };

  const emissionsStyle = {
    fontWeight: '600',
    color: '#111827',
  };

  const percentageStyle = {
    fontWeight: '600',
    color: '#111827',
  };

  const changeStyle = (change) => ({
    fontWeight: '600',
    color: change > 0 ? '#10B981' : '#EF4444',
  });

  return (
    <div style={tableStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>Emissions by Scope</h3>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...tableHeaderStyle, textAlign: 'left' }}>Scope</th>
            <th style={{ ...tableHeaderStyle, textAlign: 'left' }}>Category</th>
            <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>Emissions (kg CO₂e)</th>
            <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>% of Total</th>
            <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>Change from Prior</th>
          </tr>
        </thead>
        <tbody>
          {emissionsData.map((row, index) => (
            <tr key={index}>
              <td style={{ ...tableCellStyle, ...scopeLabelStyle }}>{row.scope}</td>
              <td style={{ ...tableCellStyle, ...categoryStyle }}>{row.category}</td>
              <td style={{ ...tableCellStyle, ...emissionsStyle, textAlign: 'right' }}>
                {row.emissions.toLocaleString()}
              </td>
              <td style={{ ...tableCellStyle, ...percentageStyle, textAlign: 'right' }}>
                {row.percentage}%
              </td>
              <td style={{ ...tableCellStyle, ...changeStyle(row.change), textAlign: 'right' }}>
                ↗ {row.change}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmissionsTable;