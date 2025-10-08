import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const GlobalEmissionsMap = () => {
  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedScope, setSelectedScope] = useState('All');
  const [mapData, setMapData] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // Sample global emissions data by region
  const emissionsData = {
    '2023': {
      'North America': { total: 5200000, scope1: 1800000, scope2: 1500000, scope3: 1900000 },
      'Europe': { total: 3400000, scope1: 1200000, scope2: 900000, scope3: 1300000 },
      'Asia Pacific': { total: 8900000, scope1: 3200000, scope2: 2800000, scope3: 2900000 },
      'South America': { total: 1200000, scope1: 400000, scope2: 350000, scope3: 450000 },
      'Africa': { total: 1800000, scope1: 600000, scope2: 500000, scope3: 700000 },
      'Middle East': { total: 2100000, scope1: 750000, scope2: 650000, scope3: 700000 }
    },
    '2022': {
      'North America': { total: 5400000, scope1: 1900000, scope2: 1600000, scope3: 1900000 },
      'Europe': { total: 3600000, scope1: 1300000, scope2: 950000, scope3: 1350000 },
      'Asia Pacific': { total: 9200000, scope1: 3400000, scope2: 2900000, scope3: 2900000 },
      'South America': { total: 1300000, scope1: 450000, scope2: 400000, scope3: 450000 },
      'Africa': { total: 1900000, scope1: 650000, scope2: 550000, scope3: 700000 },
      'Middle East': { total: 2200000, scope1: 800000, scope2: 700000, scope3: 700000 }
    }
  };

  // Simplified world regions GeoJSON (in a real app, this would be loaded from a file)
  const worldRegions = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": { "name": "North America", "region": "North America" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [-170, 70], [-50, 70], [-50, 20], [-170, 20], [-170, 70]
          ]]
        }
      },
      {
        "type": "Feature", 
        "properties": { "name": "Europe", "region": "Europe" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [-20, 75], [50, 75], [50, 35], [-20, 35], [-20, 75]
          ]]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Asia Pacific", "region": "Asia Pacific" },
        "geometry": {
          "type": "Polygon", 
          "coordinates": [[
            [50, 75], [180, 75], [180, -50], [50, -50], [50, 75]
          ]]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "South America", "region": "South America" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [-90, 15], [-30, 15], [-30, -60], [-90, -60], [-90, 15]
          ]]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Africa", "region": "Africa" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [-20, 40], [55, 40], [55, -40], [-20, -40], [-20, 40]
          ]]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Middle East", "region": "Middle East" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [25, 45], [75, 45], [75, 10], [25, 10], [25, 45]
          ]]
        }
      }
    ]
  };

  // Get color based on emission intensity
  const getEmissionColor = (region) => {
    const yearData = emissionsData[selectedYear];
    if (!yearData || !yearData[region]) return '#E0E0E0';

    const regionData = yearData[region];
    let value;

    if (selectedScope === 'All') {
      value = regionData.total;
    } else {
      const scopeKey = `scope${selectedScope}`;
      value = regionData[scopeKey] || 0;
    }

    // Normalize value to 0-1 based on min/max in current dataset
    const allValues = Object.values(yearData).map(data => 
      selectedScope === 'All' ? data.total : data[`scope${selectedScope}`] || 0
    );
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const normalized = (value - minValue) / (maxValue - minValue);

    // Create gradient from green (#00C853) to red (#D32F2F)
    const startColor = { r: 0, g: 200, b: 83 };
    const endColor = { r: 211, g: 47, b: 47 };

    const r = Math.round(startColor.r + (endColor.r - startColor.r) * normalized);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * normalized);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * normalized);

    return `rgb(${r}, ${g}, ${b})`;
  };

  // Style function for GeoJSON features
  const geoJsonStyle = (feature) => {
    const region = feature.properties.region;
    return {
      fillColor: getEmissionColor(region),
      weight: 2,
      opacity: 1,
      color: '#FFFFFF',
      fillOpacity: 0.8
    };
  };

  // Event handlers for map features
  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          fillOpacity: 0.9
        });
        setHoveredRegion(feature.properties.region);
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          fillOpacity: 0.8
        });
        setHoveredRegion(null);
      }
    });
  };

  // Get tooltip data for hovered region
  const getTooltipData = () => {
    if (!hoveredRegion) return null;
    
    const yearData = emissionsData[selectedYear];
    if (!yearData || !yearData[hoveredRegion]) return null;

    const data = yearData[hoveredRegion];
    return {
      region: hoveredRegion,
      total: data.total,
      scope1: data.scope1,
      scope2: data.scope2,
      scope3: data.scope3
    };
  };

  const tooltipData = getTooltipData();

  const containerStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  };

  const headerStyle = {
    padding: '24px',
    borderBottom: '1px solid #E5E7EB',
    backgroundColor: '#F9FAFB'
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 16px 0'
  };

  const filtersStyle = {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  };

  const filterGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  };

  const selectStyle = {
    padding: '8px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#FFFFFF',
    color: '#111827',
    outline: 'none'
  };

  const mapContainerStyle = {
    height: '400px',
    position: 'relative'
  };

  const tooltipStyle = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    backgroundColor: '#1F2937',
    color: '#FFFFFF',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    zIndex: 1000,
    minWidth: '200px',
    pointerEvents: 'none'
  };

  const legendStyle = {
    position: 'absolute',
    bottom: '16px',
    left: '16px',
    backgroundColor: '#FFFFFF',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    zIndex: 1000
  };

  const legendGradientStyle = {
    width: '200px',
    height: '20px',
    background: 'linear-gradient(to right, #00C853, #D32F2F)',
    borderRadius: '4px',
    marginBottom: '8px'
  };

  const legendLabelsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#6B7280'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>Global Emissions Zones</h3>
        <div style={filtersStyle}>
          <div style={filterGroupStyle}>
            <label style={labelStyle}>Year</label>
            <select 
              style={selectStyle}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
          <div style={filterGroupStyle}>
            <label style={labelStyle}>Scope</label>
            <select 
              style={selectStyle}
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
            >
              <option value="All">All Scopes</option>
              <option value="1">Scope 1</option>
              <option value="2">Scope 2</option>
              <option value="3">Scope 3</option>
            </select>
          </div>
        </div>
      </div>
      
      <div style={mapContainerStyle}>
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={true}
          worldCopyJump={false}
          maxBounds={[[-85, -180], [85, 180]]}
          maxBoundsViscosity={1.0}
          minZoom={1}
          maxZoom={6}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <GeoJSON
            data={worldRegions}
            style={geoJsonStyle}
            onEachFeature={onEachFeature}
          />
        </MapContainer>

        {/* Tooltip */}
        {tooltipData && (
          <div style={tooltipStyle}>
            <div style={{ fontWeight: '600', marginBottom: '8px' }}>
              {tooltipData.region}
            </div>
            <div style={{ marginBottom: '4px' }}>
              Total CO₂e: {tooltipData.total.toLocaleString()} kg
            </div>
            <div style={{ marginBottom: '4px' }}>
              Scope 1: {tooltipData.scope1.toLocaleString()} kg
            </div>
            <div style={{ marginBottom: '4px' }}>
              Scope 2: {tooltipData.scope2.toLocaleString()} kg
            </div>
            <div>
              Scope 3: {tooltipData.scope3.toLocaleString()} kg
            </div>
          </div>
        )}

        {/* Legend */}
        <div style={legendStyle}>
          <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
            Emission Intensity
          </div>
          <div style={legendGradientStyle}></div>
          <div style={legendLabelsStyle}>
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalEmissionsMap;