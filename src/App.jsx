import { useState } from 'react'
import Sidebar from './components/Sidebar'
import SupplyChainNetwork from './components/SupplyChainNetwork'
import Reports from './components/Reports'
import MetricCard from './components/MetricCard'
import EmissionsPieChart from './components/charts/EmissionsPieChart'
import MonthlyEmissionsChart from './components/charts/MonthlyEmissionsChart'
import CarbonInventorySankey from './components/charts/CarbonInventorySankey'
import GlobalEmissionsMap from './components/GlobalEmissionsMap'
import EmissionsTable from './components/EmissionsTable'
import EmissionForm from './components/EmissionForm'
import './App.css'

function App() {
  const [emissions, setEmissions] = useState({
    1: [
      { id: 1, source: 'Stationary Combustion', amount: 8600, unit: 'kg', description: 'Natural gas heating' }
    ],
    2: [
      { id: 2, source: 'Purchased Electricity', amount: 5178, unit: 'kg', description: 'Office electricity' }
    ],
    3: [
      { id: 3, source: 'Purchased Goods', amount: 20712, unit: 'kg', description: 'Supply chain emissions' }
    ]
  });
  
  const [showForm, setShowForm] = useState(false);
  const [selectedScope, setSelectedScope] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  // Sample monthly data for charts
  const monthlyData = {
    scope1: [1200, 1100, 1800, 2500, 1900, 2000, 2200, 1500, 2300, 3000, 2400, 3100],
    scope2: [800, 900, 1200, 1500, 1100, 1300, 1400, 1600, 1200, 1800, 1700, 1900],
    scope3: [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600]
  };

  // Sankey data structure matching the carbon inventory design exactly
  const sankeyData = {
    nodes: [
      // Column 1: Total
      { name: "Total emissions", value: 123456, layer: 0 },
      
      // Column 2: Emissions 
      { name: "Emissions", value: 123456, layer: 1 },
      
      // Column 3: Scopes (ordered to match image)
      { name: "Scope 1", value: 20000, layer: 2 },
      { name: "Scope 2", value: 33000, layer: 2 },
      { name: "Scope 3", value: 70456, layer: 2 },
      
      // Column 4: Sources (ordered by scope and position in image)
      { name: "Stationary Combustion", value: 8000, layer: 3 },
      { name: "Mobile Combustion", value: 8000, layer: 3 },
      { name: "Fugitives", value: 4000, layer: 3 },
      { name: "Electricity", value: 20000, layer: 3 },
      { name: "District Heating", value: 6000, layer: 3 },
      { name: "Steam", value: 4000, layer: 3 },
      { name: "Cooling", value: 3000, layer: 3 },
      { name: "Purchased Goods", value: 40000, layer: 3 }
    ],
    links: [
      // Total to Emissions
      { source: 0, target: 1, value: 123456 },
      
      // Emissions to Scopes (maintaining order)
      { source: 1, target: 2, value: 20000 }, // To Scope 1
      { source: 1, target: 3, value: 33000 }, // To Scope 2  
      { source: 1, target: 4, value: 70456 }, // To Scope 3
      
      // Scope 1 to sources (ordered as in image)
      { source: 2, target: 5, value: 8000 },  // Stationary Combustion
      { source: 2, target: 6, value: 8000 },  // Mobile Combustion  
      { source: 2, target: 7, value: 4000 },  // Fugitives
      
      // Scope 2 to sources (ordered as in image)
      { source: 3, target: 8, value: 20000 }, // Electricity
      { source: 3, target: 9, value: 6000 },  // District Heating
      { source: 3, target: 10, value: 4000 }, // Steam
      { source: 3, target: 11, value: 3000 }, // Cooling
      
      // Scope 3 to sources  
      { source: 4, target: 12, value: 40000 } // Purchased Goods (single large flow)
    ]
  };

  const handleAddEmission = (scope) => {
    setSelectedScope(scope);
    setShowForm(true);
  };

  const handleSubmitEmission = (emission) => {
    setEmissions(prev => ({
      ...prev,
      [emission.scope]: [...prev[emission.scope], emission]
    }));
    setShowForm(false);
    setSelectedScope(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedScope(null);
  };

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const getTotalEmissions = () => {
    return Object.values(emissions).flat().reduce((total, emission) => total + emission.amount, 0);
  };

  const getScopeTotal = (scope) => {
    return emissions[scope].reduce((total, emission) => total + emission.amount, 0);
  };

  const getPercentage = (scope) => {
    const total = getTotalEmissions();
    const scopeTotal = getScopeTotal(scope);
    return total > 0 ? Math.round((scopeTotal / total) * 100) : 0;
  };

  // Data for emissions table
  const emissionsTableData = [
    { scope: 'Scope 1', category: 'Stationary Combustion', emissions: 8600, percentage: 25, change: 6 },
    { scope: 'Scope 2', category: 'Purchased Electricity', emissions: 5178, percentage: 15, change: 9 },
    { scope: 'Scope 3', category: 'Purchased Goods', emissions: 20712, percentage: 60, change: 12 }
  ];

  return (
    <div className="App" style={{ display: 'flex' }}>
      {/* Sidebar Navigation */}
      <Sidebar 
        onNavigate={handleNavigate}
        currentView={currentView}
        onAddEmission={handleAddEmission}
        onSidebarToggle={handleSidebarToggle}
      />
      
      {/* Main Content Area */}
      <div style={{ flex: 1 }}>
        {currentView === 'network' ? (
          <SupplyChainNetwork />
        ) : currentView === 'reports' ? (
          <Reports />
        ) : (
          <>
            {/* Dashboard Content */}
            {/* Header */}
            <header style={{ 
              padding: '32px 24px',
              borderBottom: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF'
            }}>
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#111827', 
                margin: 0 
              }}>
                Total CO₂ₑ Emissions Year
              </h1>
        </header>

        <div style={{ 
          padding: '24px',
          backgroundColor: '#F9FAFB',
          minHeight: 'calc(100vh - 100px)'
        }}>
        {/* Top Metrics Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '24px',
          marginBottom: '24px'
        }}>
          <MetricCard 
            title="Total CO₂ₑ Emissions Year"
            value={Math.round(getTotalEmissions())}
            unit="kg"
          />
          <MetricCard 
            title="Scope 1"
            value={getPercentage(1)}
            unit="%"
            percentage={getPercentage(1)}
            trend={6}
          />
          <MetricCard 
            title="Scope 2"
            value={getPercentage(2)}
            unit="%"
            percentage={getPercentage(2)}
            trend={9}
          />
          <MetricCard 
            title="Scope 3"
            value={getPercentage(3)}
            unit="%"
            percentage={getPercentage(3)}
            trend={12}
          />
        </div>

        {/* Charts Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '24px',
          marginBottom: '24px'
        }}>
          {/* Monthly Bar Chart */}
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '20px' 
            }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#111827', 
                margin: 0 
              }}>
                Total CO₂ₑ Emissions Over Time
              </h3>
              <button 
                onClick={() => handleAddEmission(1)}
                style={{
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Add Data
              </button>
            </div>
            <div style={{ height: '300px' }}>
              <MonthlyEmissionsChart monthlyData={monthlyData} />
            </div>
          </div>

          {/* Pie Chart */}
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#111827', 
              margin: '0 0 20px 0' 
            }}>
              Emissions by Scope
            </h3>
            <div style={{ height: '300px' }}>
              <EmissionsPieChart 
                scope1={getScopeTotal(1)}
                scope2={getScopeTotal(2)}
                scope3={getScopeTotal(3)}
              />
            </div>
          </div>
        </div>

        {/* Carbon Inventory and Global Emissions Map - Side by Side */}
        <div 
          className="side-by-side-grid"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '24px',
            marginBottom: '24px'
          }}
        >
          {/* Carbon Inventory Sankey Diagram - Left Side */}
          <CarbonInventorySankey data={sankeyData} />
          
          {/* Global Emissions Zones Map - Right Side */}
          <GlobalEmissionsMap />
        </div>

        {/* Table */}
        <EmissionsTable emissionsData={emissionsTableData} />
        </div>
          </>
        )}
      </div>

      {showForm && (
        <EmissionForm
          scope={selectedScope}
          onSubmit={handleSubmitEmission}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  )
}

export default App
