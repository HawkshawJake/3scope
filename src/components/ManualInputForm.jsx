import React, { useState, useEffect } from 'react';

const ManualInputForm = ({ entity, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    company: '',
    relationship: '',
    region: '',
    sector: '',
    scope1: '',
    scope2: '',
    directEmissions: '',
    notes: '',
    evidenceFile: null
  });

  const [useDirectInput, setUseDirectInput] = useState(false);

  useEffect(() => {
    if (entity) {
      setFormData({
        company: entity.company || '',
        relationship: entity.relationship || '',
        region: entity.region || '',
        sector: entity.sector || '',
        scope1: entity.scope1 || '',
        scope2: entity.scope2 || '',
        directEmissions: entity.scope3Contribution || '',
        notes: entity.notes || '',
        evidenceFile: null
      });
      setUseDirectInput(!!entity.scope3Contribution);
    }
  }, [entity]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, evidenceFile: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const scope3Contribution = useDirectInput 
      ? parseFloat(formData.directEmissions) || 0
      : (parseFloat(formData.scope1) || 0) + (parseFloat(formData.scope2) || 0);

    const submissionData = {
      company: formData.company,
      relationship: formData.relationship,
      region: formData.region,
      sector: formData.sector,
      scope3Contribution,
      notes: formData.notes,
      evidenceFile: formData.evidenceFile?.name || null
    };

    onSubmit(submissionData);
  };

  const modalStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    width: '600px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'hidden'
  };

  const headerStyle = {
    padding: '24px',
    borderBottom: '1px solid #E5E7EB',
    backgroundColor: '#F9FAFB'
  };

  const contentStyle = {
    padding: '24px',
    maxHeight: '60vh',
    overflowY: 'auto'
  };

  const footerStyle = {
    padding: '16px 24px',
    borderTop: '1px solid #E5E7EB',
    backgroundColor: '#F9FAFB',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px'
  };

  const formGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#FFFFFF'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '80px',
    resize: 'vertical'
  };

  const fileInputStyle = {
    ...inputStyle,
    padding: '6px 12px'
  };

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#3B82F6',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#F3F4F6',
    color: '#374151'
  };

  const checkboxStyle = {
    marginRight: '8px'
  };

  const relationshipTypes = [
    'Direct Supplier',
    'Transportation',
    'IT Services',
    'Materials',
    'Manufacturing',
    'Energy Provider',
    'Consulting',
    'Other'
  ];

  const sectors = [
    'Manufacturing',
    'Technology',
    'Transportation & Logistics',
    'Energy & Utilities',
    'Materials & Mining',
    'Construction',
    'Agriculture',
    'Services',
    'Other'
  ];

  return (
    <div style={modalStyle}>
      <div style={headerStyle}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#111827', 
          margin: 0 
        }}>
          {entity ? 'Edit Manual Entry' : 'Add Manual Entry'}
        </h3>
        <p style={{ 
          fontSize: '14px', 
          color: '#6B7280', 
          margin: '4px 0 0 0' 
        }}>
          Manually input supplier emissions data
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={contentStyle}>
          {/* Basic Information */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Supplier Name *</label>
            <input
              type="text"
              style={inputStyle}
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Relationship Type *</label>
              <select
                style={selectStyle}
                value={formData.relationship}
                onChange={(e) => handleInputChange('relationship', e.target.value)}
                required
              >
                <option value="">Select relationship</option>
                {relationshipTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Region</label>
              <input
                type="text"
                style={inputStyle}
                value={formData.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                placeholder="e.g., North America, Europe"
              />
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Sector</label>
            <select
              style={selectStyle}
              value={formData.sector}
              onChange={(e) => handleInputChange('sector', e.target.value)}
            >
              <option value="">Select sector</option>
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          {/* Emissions Input Toggle */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              <input
                type="checkbox"
                style={checkboxStyle}
                checked={useDirectInput}
                onChange={(e) => setUseDirectInput(e.target.checked)}
              />
              Use direct tCO₂e input instead of Scope 1+2 breakdown
            </label>
          </div>

          {/* Emissions Data */}
          {useDirectInput ? (
            <div style={formGroupStyle}>
              <label style={labelStyle}>Direct Emissions (tCO₂e) *</label>
              <input
                type="number"
                style={inputStyle}
                value={formData.directEmissions}
                onChange={(e) => handleInputChange('directEmissions', e.target.value)}
                placeholder="Enter total emissions"
                required
              />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Scope 1 Emissions (tCO₂e)</label>
                <input
                  type="number"
                  style={inputStyle}
                  value={formData.scope1}
                  onChange={(e) => handleInputChange('scope1', e.target.value)}
                  placeholder="Direct emissions"
                />
              </div>
              <div>
                <label style={labelStyle}>Scope 2 Emissions (tCO₂e)</label>
                <input
                  type="number"
                  style={inputStyle}
                  value={formData.scope2}
                  onChange={(e) => handleInputChange('scope2', e.target.value)}
                  placeholder="Energy emissions"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Notes</label>
            <textarea
              style={textareaStyle}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional information, data sources, etc."
            />
          </div>

          {/* Evidence Upload */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Upload Evidence (Optional)</label>
            <input
              type="file"
              style={fileInputStyle}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.xlsx,.csv"
            />
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0' }}>
              Accepted formats: PDF, Images, Excel, CSV
            </p>
          </div>
        </div>

        <div style={footerStyle}>
          <button
            type="button"
            style={secondaryButtonStyle}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={primaryButtonStyle}
          >
            {entity ? 'Update Entry' : 'Add Entry'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManualInputForm;