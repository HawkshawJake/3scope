import { useState } from 'react';

const EmissionForm = ({ scope, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    unit: 'tCO2e',
    description: ''
  });

  const scopeColors = {
    1: '#ef4444',
    2: '#14b8a6',
    3: '#3b82f6'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.source && formData.amount) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
        scope: scope,
        id: Date.now()
      });
      setFormData({ source: '', amount: '', unit: 'tCO2e', description: '' });
    }
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const formStyle = {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
    border: `3px solid ${scopeColors[scope]}`
  };

  const titleStyle = {
    color: scopeColors[scope],
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '24px',
    textAlign: 'center'
  };

  const inputGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#374151'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '1rem',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box'
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 12px center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
    paddingRight: '40px'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '80px',
    resize: 'vertical'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px'
  };

  const buttonStyle = {
    padding: '12px 24px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  };

  const submitButtonStyle = {
    ...buttonStyle,
    backgroundColor: scopeColors[scope],
    color: 'white'
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6b7280',
    color: 'white'
  };

  return (
    <div style={overlayStyle} onClick={onCancel}>
      <form style={formStyle} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3 style={titleStyle}>Add Scope {scope} Emission Source</h3>
        
        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="source">
            Emission Source *
          </label>
          <input
            style={inputStyle}
            type="text"
            id="source"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            placeholder="e.g., Company vehicles, Office electricity, Business travel"
            required
            onFocus={(e) => e.target.style.borderColor = scopeColors[scope]}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="amount">
            Amount *
          </label>
          <input
            style={inputStyle}
            type="number"
            id="amount"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            required
            onFocus={(e) => e.target.style.borderColor = scopeColors[scope]}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="unit">
            Unit
          </label>
          <select
            style={selectStyle}
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            onFocus={(e) => e.target.style.borderColor = scopeColors[scope]}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          >
            <option value="tCO2e">tCO₂e (metric tons CO₂ equivalent)</option>
            <option value="kgCO2e">kgCO₂e (kilograms CO₂ equivalent)</option>
            <option value="lbsCO2e">lbsCO₂e (pounds CO₂ equivalent)</option>
          </select>
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle} htmlFor="description">
            Description (Optional)
          </label>
          <textarea
            style={textareaStyle}
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Additional details about this emission source..."
            onFocus={(e) => e.target.style.borderColor = scopeColors[scope]}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        <div style={buttonGroupStyle}>
          <button
            type="button"
            style={cancelButtonStyle}
            onClick={onCancel}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#6b7280'}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={submitButtonStyle}
            onMouseEnter={(e) => e.target.style.backgroundColor = scope === 1 ? '#dc2626' : scope === 2 ? '#0f766e' : '#1d4ed8'}
            onMouseLeave={(e) => e.target.style.backgroundColor = scopeColors[scope]}
          >
            Add Emission
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmissionForm;