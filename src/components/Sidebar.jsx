import React, { useState } from 'react';

const Sidebar = ({ onNavigate, currentView, onAddEmission, onSidebarToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onSidebarToggle) {
      onSidebarToggle(newCollapsed);
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '■' },
    { id: 'emissions', label: 'Emissions Data', icon: '○' },
    { id: 'network', label: 'Network', icon: '◇' },
    { id: 'reports', label: 'Reports', icon: '▲' },
    { id: 'settings', label: 'Settings', icon: '◆' }
  ];

  const quickActions = [
    { id: 'scope1', label: 'Add Scope 1', action: () => onAddEmission(1), color: '#ef4444' },
    { id: 'scope2', label: 'Add Scope 2', action: () => onAddEmission(2), color: '#14b8a6' },
    { id: 'scope3', label: 'Add Scope 3', action: () => onAddEmission(3), color: '#3b82f6' }
  ];

  const sidebarStyle = {
    width: isCollapsed ? '60px' : '280px',
    height: '100vh',
    backgroundColor: '#1F2937',
    color: '#F9FAFB',
    position: 'sticky',
    top: 0,
    transition: 'width 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
    flexShrink: 0
  };

  const headerStyle = {
    padding: '20px',
    borderBottom: '1px solid #374151',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const logoStyle = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#3B82F6'
  };

  const collapseButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#9CA3AF',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '4px'
  };

  const navSectionStyle = {
    padding: '20px 0',
    borderBottom: '1px solid #374151'
  };

  const sectionTitleStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '12px',
    paddingLeft: '20px'
  };

  const navItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    fontSize: '14px',
    fontWeight: '500'
  };

  const navItemActiveStyle = {
    ...navItemStyle,
    backgroundColor: '#3B82F6',
    color: '#FFFFFF'
  };

  const navItemHoverStyle = {
    backgroundColor: '#374151'
  };

  const iconStyle = {
    marginRight: isCollapsed ? '0' : '12px',
    fontSize: '16px'
  };

  const quickActionStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    margin: '4px 0',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    fontSize: '13px',
    fontWeight: '500',
    border: 'none',
    background: 'none',
    color: '#F9FAFB',
    width: '100%',
    textAlign: 'left'
  };

  const actionIconStyle = (color) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: color,
    marginRight: isCollapsed ? '0' : '12px'
  });

  const footerStyle = {
    marginTop: 'auto',
    padding: '20px',
    borderTop: '1px solid #374151'
  };

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const avatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#3B82F6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600'
  };

  const userDetailsStyle = {
    display: isCollapsed ? 'none' : 'block'
  };

  const userNameStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#F9FAFB'
  };

  const userRoleStyle = {
    fontSize: '12px',
    color: '#9CA3AF'
  };

  return (
    <div style={sidebarStyle}>
      {/* Header */}
      <div style={headerStyle}>
        {!isCollapsed && <div style={logoStyle}>3Scopes</div>}
        <button 
          style={collapseButtonStyle}
          onClick={handleToggle}
          onMouseEnter={(e) => e.target.style.color = '#F9FAFB'}
          onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Navigation */}
      <div style={navSectionStyle}>
        {!isCollapsed && <div style={sectionTitleStyle}>Navigation</div>}
        {navigationItems.map((item) => (
          <div
            key={item.id}
            style={currentView === item.id ? navItemActiveStyle : navItemStyle}
            onClick={() => onNavigate(item.id)}
            onMouseEnter={(e) => {
              if (currentView !== item.id) {
                e.target.style.backgroundColor = '#374151';
              }
            }}
            onMouseLeave={(e) => {
              if (currentView !== item.id) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={iconStyle}>{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={navSectionStyle}>
        {!isCollapsed && <div style={sectionTitleStyle}>Quick Actions</div>}
        {quickActions.map((action) => (
          <button
            key={action.id}
            style={quickActionStyle}
            onClick={action.action}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <div style={actionIconStyle(action.color)}></div>
            {!isCollapsed && <span>{action.label}</span>}
          </button>
        ))}
      </div>

      {/* Footer - User Info */}
      <div style={footerStyle}>
        <div style={userInfoStyle}>
          <div style={avatarStyle}>JD</div>
          <div style={userDetailsStyle}>
            <div style={userNameStyle}>John Doe</div>
            <div style={userRoleStyle}>Carbon Analyst</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;