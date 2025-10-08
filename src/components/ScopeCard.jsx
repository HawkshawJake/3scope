import { useState } from 'react';

const ScopeCard = ({ scope, emissions, onAddEmission }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const scopeData = {
    1: {
      title: 'Scope 1: Direct Emissions',
      color: '#ef4444',
      hoverColor: '#dc2626',
      description: 'Direct greenhouse gas emissions from sources owned or controlled by your organization',
      examples: [
        'Company-owned vehicles and fleet operations',
        'On-site fuel combustion (heating, cooling)',
        'Manufacturing and industrial processes',
        'Fugitive emissions from refrigeration',
        'Company-owned facilities and equipment'
      ]
    },
    2: {
      title: 'Scope 2: Electricity Indirect',
      color: '#14b8a6',
      hoverColor: '#0f766e',
      description: 'Indirect emissions from purchased energy consumed by your organization',
      examples: [
        'Purchased electricity for offices and facilities',
        'Purchased steam for heating',
        'Purchased heating and cooling systems',
        'Grid electricity for manufacturing',
        'Renewable energy certificates (RECs)'
      ]
    },
    3: {
      title: 'Scope 3: Other Indirect',
      color: '#3b82f6',
      hoverColor: '#1d4ed8',
      description: 'All other indirect emissions in your value chain',
      examples: [
        'Business travel and employee commuting',
        'Supply chain and purchased goods',
        'Waste disposal and treatment',
        'Downstream transportation',
        'Product use and end-of-life treatment'
      ]
    }
  };

  const data = scopeData[scope];
  const scopeEmissions = emissions || [];
  const total = scopeEmissions.reduce((sum, emission) => sum + emission.amount, 0);

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: `2px solid ${data.color}`,
    borderRadius: '12px',
    padding: '24px',
    margin: '16px 0',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transform: isExpanded ? 'scale(1.02)' : 'scale(1)',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  };

  const titleStyle = {
    color: data.color,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0
  };

  const totalStyle = {
    backgroundColor: data.color,
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '1.1rem',
    fontWeight: 'bold'
  };

  const descriptionStyle = {
    color: '#6b7280',
    fontSize: '1rem',
    lineHeight: '1.6',
    marginBottom: '16px'
  };

  const examplesStyle = {
    marginTop: '16px'
  };

  const exampleItemStyle = {
    backgroundColor: '#f9fafb',
    padding: '12px',
    margin: '8px 0',
    borderRadius: '8px',
    borderLeft: `4px solid ${data.color}`,
    fontSize: '0.95rem',
    color: '#374151'
  };

  const buttonStyle = {
    backgroundColor: data.color,
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    marginTop: '16px',
    transition: 'background-color 0.2s ease'
  };

  const addEmissionStyle = {
    ...buttonStyle,
    backgroundColor: '#6b7280',
    marginLeft: '8px'
  };

  return (
    <div 
      style={cardStyle}
      onClick={() => setIsExpanded(!isExpanded)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = data.hoverColor;
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = data.color;
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div style={headerStyle}>
        <h3 style={titleStyle}>{data.title}</h3>
        <div style={totalStyle}>
          {total.toFixed(2)} tCO₂e
        </div>
      </div>
      
      <p style={descriptionStyle}>{data.description}</p>
      
      {isExpanded && (
        <div style={examplesStyle}>
          <h4 style={{ color: data.color, marginBottom: '12px' }}>Common Sources:</h4>
          {data.examples.map((example, index) => (
            <div key={index} style={exampleItemStyle}>
              • {example}
            </div>
          ))}
          
          <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
            <button 
              style={buttonStyle}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = data.hoverColor}
              onMouseLeave={(e) => e.target.style.backgroundColor = data.color}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
            <button 
              style={addEmissionStyle}
              onClick={(e) => {
                e.stopPropagation();
                onAddEmission(scope);
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#6b7280'}
            >
              Add Emission Source
            </button>
          </div>
        </div>
      )}
      
      {!isExpanded && (
        <div style={{ marginTop: '12px', color: '#9ca3af', fontSize: '0.9rem' }}>
          Click to view examples and add emissions →
        </div>
      )}
    </div>
  );
};

export default ScopeCard;