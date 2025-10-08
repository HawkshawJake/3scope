import React, { useState } from 'react';
import ManualInputForm from './ManualInputForm';
import ConnectedEntityForm from './ConnectedEntityForm';

const SupplyChainData = ({ onAddConnection }) => {
  const [inputMode, setInputMode] = useState('manual'); // 'manual' or 'connected'
  const [showForm, setShowForm] = useState(false);
  const [editingEntity, setEditingEntity] = useState(null);

  // Sample data for connected entities
  const [entities, setEntities] = useState([
    {
      id: 1,
      company: "Steel Supplier Co.",
      relationship: "Direct Supplier",
      scope3Contribution: 15200,
      lastUpdated: "2024-10-05",
      connectionStatus: "Connected",
      type: "connected"
    },
    {
      id: 2,
      company: "Logistics Partners Inc",
      relationship: "Transportation",
      scope3Contribution: 7500,
      lastUpdated: "2024-10-03",
      connectionStatus: "Connected",
      type: "connected"
    },
    {
      id: 3,
      company: "Technology Solutions",
      relationship: "IT Services",
      scope3Contribution: 4000,
      lastUpdated: "2024-10-01",
      connectionStatus: "Pending",
      type: "connected"
    },
    {
      id: 4,
      company: "Regional Paper Supplier",
      relationship: "Materials",
      scope3Contribution: 2800,
      lastUpdated: "2024-09-28",
      connectionStatus: "Manual Input",
      type: "manual"
    }
  ]);

  const handleAddEntity = (entityData) => {
    const newEntity = {
      id: Date.now(),
      ...entityData,
      lastUpdated: new Date().toISOString().split('T')[0],
      connectionStatus: inputMode === 'manual' ? 'Manual Input' : 'Connected',
      type: inputMode
    };
    setEntities([...entities, newEntity]);
    setShowForm(false);
  };

  const handleEditEntity = (entity) => {
    setEditingEntity(entity);
    setInputMode(entity.type);
    setShowForm(true);
  };

  const handleUpdateEntity = (entityData) => {
    setEntities(entities.map(entity => 
      entity.id === editingEntity.id 
        ? { ...entity, ...entityData, lastUpdated: new Date().toISOString().split('T')[0] }
        : entity
    ));
    setShowForm(false);
    setEditingEntity(null);
  };

  const handleRemoveEntity = (id) => {
    setEntities(entities.filter(entity => entity.id !== id));
  };

  const containerStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  };

  const headerStyle = {
    padding: '20px 24px',
    borderBottom: '1px solid #E5E7EB',
    backgroundColor: '#F9FAFB'
  };

  const toggleContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '20px'
  };

  const toggleButtonStyle = (isActive) => ({
    padding: '8px 16px',
    border: '1px solid #D1D5DB',
    backgroundColor: isActive ? '#3B82F6' : '#FFFFFF',
    color: isActive ? '#FFFFFF' : '#374151',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });

  const addButtonStyle = {
    backgroundColor: '#10B981',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginLeft: 'auto'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  };

  const thStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #E5E7EB',
    backgroundColor: '#F9FAFB',
    fontWeight: '600',
    color: '#374151'
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #F3F4F6',
    color: '#111827'
  };

  const statusBadgeStyle = (status) => ({
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: 
      status === 'Connected' ? '#D1FAE5' :
      status === 'Pending' ? '#FEF3C7' : '#F3F4F6',
    color:
      status === 'Connected' ? '#065F46' :
      status === 'Pending' ? '#92400E' : '#374151'
  });

  const actionButtonStyle = {
    padding: '4px 8px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    marginRight: '8px'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#111827', 
            margin: 0 
          }}>
            Connected Entities
          </h3>
        </div>
      </div>
      
      <div style={{ padding: '24px' }}>
        {/* Toggle and Add Button */}
        <div style={toggleContainerStyle}>
          <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>Input Mode:</span>
          <button
            style={toggleButtonStyle(inputMode === 'manual')}
            onClick={() => setInputMode('manual')}
          >
            Manual Input
          </button>
          <button
            style={toggleButtonStyle(inputMode === 'connected')}
            onClick={() => setInputMode('connected')}
          >
            Connected Entity
          </button>
          <button
            style={addButtonStyle}
            onClick={() => {
              setEditingEntity(null);
              setShowForm(true);
            }}
          >
            + Add {inputMode === 'manual' ? 'Manual Entry' : 'Connected Entity'}
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Company</th>
                <th style={thStyle}>Relationship Type</th>
                <th style={thStyle}>Scope 3 Contribution (tCO₂e)</th>
                <th style={thStyle}>Last Updated</th>
                <th style={thStyle}>Connection Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entities.map((entity) => (
                <tr key={entity.id}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: '500' }}>{entity.company}</div>
                  </td>
                  <td style={tdStyle}>{entity.relationship}</td>
                  <td style={tdStyle}>{entity.scope3Contribution.toLocaleString()}</td>
                  <td style={tdStyle}>{entity.lastUpdated}</td>
                  <td style={tdStyle}>
                    <span style={statusBadgeStyle(entity.connectionStatus)}>
                      {entity.connectionStatus}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button
                      style={{
                        ...actionButtonStyle,
                        backgroundColor: '#3B82F6',
                        color: 'white'
                      }}
                      onClick={() => handleEditEntity(entity)}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        ...actionButtonStyle,
                        backgroundColor: '#EF4444',
                        color: 'white'
                      }}
                      onClick={() => handleRemoveEntity(entity.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {entities.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6B7280',
            fontSize: '14px'
          }}>
            No entities connected yet. Add your first supplier connection.
          </div>
        )}
      </div>

      {/* Forms */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          {inputMode === 'manual' ? (
            <ManualInputForm
              entity={editingEntity}
              onSubmit={editingEntity ? handleUpdateEntity : handleAddEntity}
              onCancel={() => {
                setShowForm(false);
                setEditingEntity(null);
              }}
            />
          ) : (
            <ConnectedEntityForm
              entity={editingEntity}
              onSubmit={editingEntity ? handleUpdateEntity : handleAddEntity}
              onCancel={() => {
                setShowForm(false);
                setEditingEntity(null);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SupplyChainData;