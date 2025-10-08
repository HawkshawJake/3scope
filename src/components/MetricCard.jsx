import React from 'react';

const MetricCard = ({ title, value, unit, percentage, trend }) => {
  const cardStyle = {
    backgroundColor: '#FFFFFF',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
  };

  const titleStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6B7280',
    margin: '0 0 8px 0',
    letterSpacing: '0.025em',
  };

  const valueStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 4px 0',
    lineHeight: '1.2',
  };

  const unitStyle = {
    fontSize: '14px',
    color: '#6B7280',
    fontWeight: '400',
  };

  const percentageStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6B7280',
    margin: '8px 0 0 0',
  };

  const trendStyle = {
    fontSize: '12px',
    color: trend > 0 ? '#10B981' : '#EF4444',
    fontWeight: '500',
    marginLeft: '8px',
  };

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={valueStyle}>{value.toLocaleString()}</span>
        <span style={unitStyle}>{unit}</span>
      </div>
      {percentage && (
        <div style={percentageStyle}>
          {percentage}%
          {trend && (
            <span style={trendStyle}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MetricCard;