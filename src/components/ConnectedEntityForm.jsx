import React, { useState, useEffect } from 'react';

const ConnectedEntityForm = ({ entity, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    company: '',
    relationship: '',
    searchTerm: '',
    selectedCompany: null
  });

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock search results for companies on the platform
  const mockCompanies = [
    {
      id: 1,
      name: "Green Steel Manufacturing",
      status: "verified",
      scope1: 12500,
      scope2: 3200,
      lastUpdated: "2024-10-05",
      industry: "Manufacturing"
    },
    {
      id: 2,
      name: "EcoLogistics Corp",
      status: "verified",
      scope1: 5400,
      scope2: 2100,
      lastUpdated: "2024-10-03",
      industry: "Transportation"
    },
    {
      id: 3,
      name: "TechSolutions Inc",
      status: "pending",
      scope1: 1200,
      scope2: 2800,
      lastUpdated: "2024-09-28",
      industry: "Technology"
    },
    {
      id: 4,
      name: "Renewable Energy Partners",
      status: "verified",
      scope1: 800,
      scope2: 1500,
      lastUpdated: "2024-10-01",
      industry: "Energy"
    }
  ];

  useEffect(() => {
    if (entity) {
      setFormData({
        company: entity.company || '',
        relationship: entity.relationship || '',
        searchTerm: entity.company || '',
        selectedCompany: entity.selectedCompany || null
      });
    }
  }, [entity]);

  const handleSearch = (term) => {
    setFormData(prev => ({ ...prev, searchTerm: term }));
    
    if (term.length > 2) {
      setIsSearching(true);
      // Simulate API search delay
      setTimeout(() => {
        const results = mockCompanies.filter(company =>
          company.name.toLowerCase().includes(term.toLowerCase()) ||
          company.industry.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(results);
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectCompany = (company) => {
    setFormData(prev => ({
      ...prev,
      selectedCompany: company,
      company: company.name,
      searchTerm: company.name
    }));
    setSearchResults([]);
  };

  const handleInviteSupplier = () => {
    // Mock invite functionality
    alert(`Invitation sent to ${formData.searchTerm}. They will receive an email to join the platform.`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submissionData = {
      company: formData.company,
      relationship: formData.relationship,
      scope3Contribution: formData.selectedCompany 
        ? formData.selectedCompany.scope1 + formData.selectedCompany.scope2
        : 0,
      connectedCompanyId: formData.selectedCompany?.id,
      autoSync: true
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

  const searchResultStyle = {
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
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

  const inviteButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#10B981',
    color: 'white',
    marginTop: '12px'
  };

  const statusBadgeStyle = (status) => ({
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '500',
    backgroundColor: status === 'verified' ? '#D1FAE5' : '#FEF3C7',
    color: status === 'verified' ? '#065F46' : '#92400E'
  });

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

  return (
    <div style={modalStyle}>
      <div style={headerStyle}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#111827', 
          margin: 0 
        }}>
          {entity ? 'Edit Connected Entity' : 'Connect Entity'}
        </h3>
        <p style={{ 
          fontSize: '14px', 
          color: '#6B7280', 
          margin: '4px 0 0 0' 
        }}>
          Search for companies already on the platform or invite new suppliers
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={contentStyle}>
          {/* Search Bar */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Search Companies</label>
            <input
              type="text"
              style={inputStyle}
              value={formData.searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by company name or industry..."
            />
            
            {isSearching && (
              <div style={{ padding: '12px', textAlign: 'center', color: '#6B7280' }}>
                Searching...
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div style={{ marginTop: '12px', maxHeight: '200px', overflowY: 'auto' }}>
                {searchResults.map((company) => (
                  <div
                    key={company.id}
                    style={searchResultStyle}
                    onClick={() => handleSelectCompany(company)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#F9FAFB'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '14px' }}>
                          {company.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>
                          {company.industry} • Last updated: {company.lastUpdated}
                        </div>
                        <div style={{ fontSize: '12px', color: '#374151', marginTop: '4px' }}>
                          Total: {(company.scope1 + company.scope2).toLocaleString()} tCO₂e 
                          (Scope 1: {company.scope1.toLocaleString()}, Scope 2: {company.scope2.toLocaleString()})
                        </div>
                      </div>
                      <span style={statusBadgeStyle(company.status)}>
                        {company.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results / Invite */}
            {formData.searchTerm.length > 2 && searchResults.length === 0 && !isSearching && (
              <div style={{ 
                marginTop: '12px', 
                padding: '16px', 
                backgroundColor: '#F9FAFB', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                  No companies found matching "{formData.searchTerm}"
                </div>
                <button
                  type="button"
                  style={inviteButtonStyle}
                  onClick={handleInviteSupplier}
                >
                  Invite "{formData.searchTerm}" to Platform
                </button>
              </div>
            )}
          </div>

          {/* Selected Company Info */}
          {formData.selectedCompany && (
            <div style={{
              ...formGroupStyle,
              backgroundColor: '#EFF6FF',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #DBEAFE'
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0', color: '#1E40AF' }}>
                Selected Company: {formData.selectedCompany.name}
              </h4>
              <div style={{ fontSize: '12px', color: '#374151' }}>
                <div>Industry: {formData.selectedCompany.industry}</div>
                <div>Status: <span style={statusBadgeStyle(formData.selectedCompany.status)}>{formData.selectedCompany.status}</span></div>
                <div>Total Emissions: {(formData.selectedCompany.scope1 + formData.selectedCompany.scope2).toLocaleString()} tCO₂e</div>
                <div style={{ marginTop: '8px', fontStyle: 'italic' }}>
                  ✓ Data will auto-sync from this company's verified emissions
                </div>
              </div>
            </div>
          )}

          {/* Relationship Type */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>Relationship Type *</label>
            <select
              style={selectStyle}
              value={formData.relationship}
              onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
              required
            >
              <option value="">Select relationship</option>
              {relationshipTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
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
            disabled={!formData.selectedCompany || !formData.relationship}
          >
            {entity ? 'Update Connection' : 'Connect Entity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConnectedEntityForm;