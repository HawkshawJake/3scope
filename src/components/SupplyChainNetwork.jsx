import React, { useState } from 'react';
import SupplyChainVisual from './SupplyChainVisual';
import SupplyChainData from './SupplyChainData';

const SupplyChainNetwork = () => {
  const [activeTab, setActiveTab] = useState('visual');
  const [showAddConnection, setShowAddConnection] = useState(false);

  const headerStyle = {
    padding: '32px 24px',
    borderBottom: '1px solid #E5E7EB',
    backgroundColor: '#FFFFFF'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 8px 0'
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: '#6B7280',
    margin: '0 0 24px 0',
    lineHeight: '1.5'
  };

  const headerContentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  };

  const addButtonStyle = {
    backgroundColor: '#3B82F6',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  };

  const tabContainerStyle = {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E7EB'
  };

  const tabListStyle = {
    display: 'flex',
    padding: '0 24px'
  };

  const tabButtonStyle = (isActive) => ({
    padding: '16px 24px',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    borderBottom: isActive ? '2px solid #3B82F6' : '2px solid transparent',
    color: isActive ? '#3B82F6' : '#6B7280',
    transition: 'all 0.2s ease'
  });

  const contentStyle = {
    backgroundColor: '#F9FAFB',
    minHeight: 'calc(100vh - 200px)',
    padding: '24px'
  };

  const footerStyle = {
    backgroundColor: '#FFFFFF',
    padding: '16px 24px',
    borderTop: '1px solid #E5E7EB',
    fontSize: '14px',
    color: '#6B7280',
    textAlign: 'center'
  };

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={headerContentStyle}>
          <div>
            <h1 style={titleStyle}>Supply Chain Network</h1>
            <p style={subtitleStyle}>
              Visualize, connect, and manage Scope 3 relationships in your supply chain.
            </p>
          </div>
          <button 
            style={addButtonStyle}
            onClick={() => setShowAddConnection(true)}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563EB'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3B82F6'}
          >
            Add Connection
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div style={tabContainerStyle}>
        <div style={tabListStyle}>
          <button
            style={tabButtonStyle(activeTab === 'visual')}
            onClick={() => setActiveTab('visual')}
          >
            Visual View
          </button>
          <button
            style={tabButtonStyle(activeTab === 'data')}
            onClick={() => setActiveTab('data')}
          >
            Data View
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={contentStyle}>
        {activeTab === 'visual' ? (
          <SupplyChainVisual onAddConnection={() => setShowAddConnection(true)} />
        ) : (
          <SupplyChainData onAddConnection={() => setShowAddConnection(true)} />
        )}
      </div>

      {/* Footer */}
      <footer style={footerStyle}>
        Linked Scope 3 emissions update automatically when connected companies verify data.
      </footer>
    </div>
  );
};

export default SupplyChainNetwork;