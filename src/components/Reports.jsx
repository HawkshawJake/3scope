import React, { useState } from 'react';

const Reports = () => {
  const [selectedCategory, setSelectedCategory] = useState('core');
  const [selectedReport, setSelectedReport] = useState(null);

  const reportCategories = [
    { id: 'core', label: 'Core GHG Protocol Reports', count: 4 },
    { id: 'compliance', label: 'Compliance-Ready ESG Reports', count: 7 },
    { id: 'management', label: 'Management & Internal Insights', count: 5 },
    { id: 'supplier', label: 'Supplier & Network Reports', count: 3 },
    { id: 'offset', label: 'Offset & Mitigation Reports', count: 3 }
  ];

  const coreReports = [
    {
      id: 'annual-ghg',
      title: 'Annual GHG Inventory Report',
      description: 'Total CO₂e by Scope 1, 2, and 3 with year-over-year comparisons',
      outputs: ['Total CO₂e by Scope 1, 2, and 3', 'Breakdown by emission category', 'Year-over-year comparisons', 'Methodology documentation', 'Summary charts (pie and bar)'],
      usedFor: 'Annual sustainability reports, internal ESG summaries, and mandatory filings',
      exportFormats: ['PDF', 'Excel', 'CSV'],
      scheduleOptions: ['Monthly', 'Quarterly', 'Annually']
    },
    {
      id: 'scope1',
      title: 'Scope 1 Emissions Report (Direct Emissions)',
      description: 'Fuel consumption, facility-level breakdown, and fugitive emissions',
      outputs: ['Fuel consumption and related CO₂e', 'Facility-level breakdown', 'Fugitive emissions (refrigerants, etc.)'],
      usedFor: 'Facilities management, energy audits, and carbon reduction projects',
      exportFormats: ['PDF', 'Excel', 'CSV'],
      scheduleOptions: ['Monthly', 'Quarterly', 'Annually']
    },
    {
      id: 'scope2',
      title: 'Scope 2 Emissions Report (Energy Indirect)',
      description: 'Electricity, heating, cooling usage with market-based vs location-based factors',
      outputs: ['Electricity, heating, cooling usage', 'Market-based vs location-based factors', 'Renewable energy certificate (REC) tracking'],
      usedFor: 'Energy procurement planning, RE100 compliance',
      exportFormats: ['PDF', 'Excel', 'CSV'],
      scheduleOptions: ['Monthly', 'Quarterly', 'Annually']
    },
    {
      id: 'scope3',
      title: 'Scope 3 Emissions Report (Value Chain)',
      description: 'Upstream and downstream emissions with supplier-level transparency',
      outputs: ['Upstream (suppliers, logistics, waste)', 'Downstream (product use, end-of-life, transport)', 'Supplier-level transparency with confidence scoring', 'Manual vs connected data ratio'],
      usedFor: 'CSRD, SEC, California SB253/261 compliance and supply chain visibility',
      exportFormats: ['PDF', 'Excel', 'CSV'],
      scheduleOptions: ['Monthly', 'Quarterly', 'Annually']
    }
  ];

  const complianceReports = [
    {
      id: 'csrd',
      title: 'EU CSRD / ESRS Sustainability Disclosure Report',
      description: 'Comprehensive sustainability disclosure aligned with EU Corporate Sustainability Reporting Directive',
      outputs: ['Scope 1–3 emissions', 'Sustainability targets', 'Energy mix analysis', 'Policies documentation', 'Risk management assessment'],
      framework: 'EU CSRD / ESRS',
      exportFormats: ['PDF', 'Excel', 'XML'],
      scheduleOptions: ['Annually']
    },
    {
      id: 'tcfd',
      title: 'TCFD Climate Risk & Governance Report',
      description: 'Task Force on Climate-related Financial Disclosures aligned reporting',
      outputs: ['Scenario analysis', 'Climate risk exposure assessment', 'Governance structures', 'Strategy and risk management'],
      framework: 'TCFD',
      exportFormats: ['PDF', 'Excel'],
      scheduleOptions: ['Annually', 'Bi-annually']
    },
    {
      id: 'cdp',
      title: 'CDP Climate Change Submission',
      description: 'Carbon Disclosure Project questionnaire structured response',
      outputs: ['CDP questionnaire responses', 'Climate data disclosure', 'Performance scoring metrics'],
      framework: 'CDP',
      exportFormats: ['PDF', 'Excel', 'CDP Format'],
      scheduleOptions: ['Annually']
    },
    {
      id: 'ghg-protocol',
      title: 'GHG Protocol Corporate Standard Report',
      description: 'Full GHG inventory following Corporate Accounting and Reporting Standard',
      outputs: ['Complete GHG inventory', 'Emissions factors documentation', 'Methodology detailed report'],
      framework: 'GHG Protocol',
      exportFormats: ['PDF', 'Excel', 'CSV'],
      scheduleOptions: ['Annually']
    },
    {
      id: 'gri-305',
      title: 'GRI 305 Emissions Disclosure Report',
      description: 'Global Reporting Initiative emissions metrics aligned reporting',
      outputs: ['CO₂e emissions data', 'CH₄ and N₂O reporting', 'GRI 305 metrics compliance'],
      framework: 'GRI 305',
      exportFormats: ['PDF', 'Excel', 'GRI Format'],
      scheduleOptions: ['Annually']
    },
    {
      id: 'iso-14064',
      title: 'ISO 14064-1 Verification-ready Emissions Statement',
      description: 'Structured dataset prepared for third-party audit submission',
      outputs: ['Verification-ready dataset', 'Quality assurance documentation', 'Audit trail records'],
      framework: 'ISO 14064-1',
      exportFormats: ['PDF', 'Excel', 'ISO Format'],
      scheduleOptions: ['Annually']
    },
    {
      id: 'sec-climate',
      title: 'SEC Climate Rule / CA SB253 Financial Filings',
      description: 'Securities and Exchange Commission climate disclosure for financial filings',
      outputs: ['Annual verified Scope 1–3 disclosures', 'Investor format documentation', 'Financial impact assessment'],
      framework: 'SEC Climate Rule / CA SB253',
      exportFormats: ['PDF', 'Excel', 'SEC Format'],
      scheduleOptions: ['Annually']
    }
  ];

  const managementReports = [
    {
      id: 'emission-trends',
      title: 'Emission Trends Report',
      description: 'Monthly/quarterly trends with top emission sources analysis',
      outputs: ['Monthly/quarterly emission graphs', 'Emissions per product, site, or business unit', 'Top 5 emission sources and trends'],
      usedFor: 'Internal tracking, management dashboards, performance monitoring',
      exportFormats: ['PDF', 'Excel', 'PowerPoint'],
      scheduleOptions: ['Monthly', 'Quarterly']
    },
    {
      id: 'carbon-intensity',
      title: 'Carbon Intensity Report',
      description: 'CO₂e per revenue, employee, or production unit with industry benchmarks',
      outputs: ['CO₂e per revenue (£/tCO₂e)', 'Emissions per employee', 'Production unit intensity', 'Industry benchmark comparison'],
      usedFor: 'Performance benchmarking, efficiency tracking, target setting',
      exportFormats: ['PDF', 'Excel', 'PowerPoint'],
      scheduleOptions: ['Monthly', 'Quarterly', 'Annually']
    },
    {
      id: 'reduction-progress',
      title: 'Reduction Progress Report',
      description: 'Tracks progress toward net-zero targets with initiative breakdown',
      outputs: ['Net-zero target progress', 'Goal vs actual % achieved', 'Initiative breakdown (renewable switch, supplier changes)', 'Milestone tracking'],
      usedFor: 'Strategy assessment, stakeholder updates, board reporting',
      exportFormats: ['PDF', 'Excel', 'PowerPoint'],
      scheduleOptions: ['Quarterly', 'Annually']
    },
    {
      id: 'forecasting',
      title: 'Forecasting & Scenario Report',
      description: 'Predicts emissions trajectory with what-if scenario modeling',
      outputs: ['Emissions trajectory predictions', 'What-if scenario models', 'Supplier switching impact', 'Renewable adoption scenarios'],
      usedFor: 'Strategic planning, investment decisions, risk assessment',
      exportFormats: ['PDF', 'Excel', 'PowerPoint'],
      scheduleOptions: ['Quarterly', 'Annually']
    },
    {
      id: 'financial-impact',
      title: 'Financial Impact Report',
      description: 'Carbon tax exposure and sustainability project ROI analysis',
      outputs: ['Carbon tax exposure estimates', 'Offset costs for neutrality', 'Sustainability project ROI', 'Cost-benefit analysis'],
      usedFor: 'Financial planning, investment decisions, budget allocation',
      exportFormats: ['PDF', 'Excel', 'PowerPoint'],
      scheduleOptions: ['Quarterly', 'Annually']
    }
  ];

  const supplierReports = [
    {
      id: 'supply-chain-map',
      title: 'Supply Chain Emissions Map',
      description: 'Visual network graph with emissions per entity and confidence scoring',
      outputs: ['Visual emissions graph (CarbonTree view)', '% of total Scope 3 per supplier', 'Data confidence scores', 'Verification status mapping'],
      usedFor: 'Supply chain visibility, supplier assessment, risk identification',
      exportFormats: ['PDF', 'Excel', 'Interactive Map'],
      scheduleOptions: ['Monthly', 'Quarterly']
    },
    {
      id: 'supplier-performance',
      title: 'Supplier Performance Report',
      description: 'Supplier-level emissions trends with performance badges',
      outputs: ['Supplier emissions change over time', 'Performance badges (verified/improving/outlier)', 'Ranking and scoring', 'Improvement recommendations'],
      usedFor: 'Supplier management, procurement decisions, partnership evaluation',
      exportFormats: ['PDF', 'Excel', 'Dashboard'],
      scheduleOptions: ['Monthly', 'Quarterly']
    },
    {
      id: 'connection-report',
      title: 'Connection Report',
      description: 'Overview of all connected companies and data sync status',
      outputs: ['List of connected companies', 'Sync status (live/pending/disconnected)', 'Data coverage percentage', 'Connection quality metrics'],
      usedFor: 'Network management, data quality assessment, integration monitoring',
      exportFormats: ['PDF', 'Excel', 'CSV'],
      scheduleOptions: ['Weekly', 'Monthly']
    }
  ];

  const offsetReports = [
    {
      id: 'offset-ledger',
      title: 'Offset Credit Ledger',
      description: 'Complete record of all purchased offsets by date, type, and project',
      outputs: ['Offset purchases by date', 'Credit types and projects', 'Verification status', 'Cost analysis'],
      usedFor: 'Carbon accounting, compliance verification, financial tracking',
      exportFormats: ['PDF', 'Excel', 'CSV'],
      scheduleOptions: ['Monthly', 'Quarterly', 'Annually']
    },
    {
      id: 'net-emissions',
      title: 'Net Emissions Report',
      description: 'Gross vs net emissions analysis after offset application',
      outputs: ['Gross emissions totals', 'Applied offset credits', 'Net emissions calculation', 'Neutrality status'],
      usedFor: 'Carbon neutrality tracking, external reporting, goal assessment',
      exportFormats: ['PDF', 'Excel', 'CSV'],
      scheduleOptions: ['Monthly', 'Quarterly', 'Annually']
    },
    {
      id: 'mitigation-projects',
      title: 'Mitigation Project Tracker',
      description: 'Tracks sustainability initiatives and their verified reductions',
      outputs: ['Project portfolio overview', 'Verified emission reductions', 'ROI and cost-effectiveness', 'Implementation timeline'],
      usedFor: 'Project management, investment tracking, impact measurement',
      exportFormats: ['PDF', 'Excel', 'Project Dashboard'],
      scheduleOptions: ['Monthly', 'Quarterly']
    }
  ];

  const getCurrentReports = () => {
    switch(selectedCategory) {
      case 'core': return coreReports;
      case 'compliance': return complianceReports;
      case 'management': return managementReports;
      case 'supplier': return supplierReports;
      case 'offset': return offsetReports;
      default: return coreReports;
    }
  };

  const handleGenerateReport = (reportId) => {
    alert(`Generating ${reportId} report...`);
  };

  const handleScheduleReport = (reportId, schedule) => {
    alert(`Scheduling ${reportId} report for ${schedule} delivery...`);
  };

  const pageStyle = {
    backgroundColor: '#F9FAFB',
    minHeight: '100vh'
  };

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
    margin: '0'
  };

  const contentStyle = {
    display: 'flex',
    minHeight: 'calc(100vh - 120px)'
  };

  const sidebarStyle = {
    width: '320px',
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid #E5E7EB',
    padding: '24px'
  };

  const categoryStyle = (isActive) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '8px',
    backgroundColor: isActive ? '#EFF6FF' : 'transparent',
    border: isActive ? '1px solid #DBEAFE' : '1px solid transparent',
    transition: 'all 0.2s ease'
  });

  const categoryLabelStyle = (isActive) => ({
    fontSize: '14px',
    fontWeight: '500',
    color: isActive ? '#1E40AF' : '#374151'
  });

  const categoryCountStyle = {
    fontSize: '12px',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    padding: '2px 8px',
    borderRadius: '12px'
  };

  const mainContentStyle = {
    flex: 1,
    padding: '24px'
  };

  const reportsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px'
  };

  const reportCardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  };

  const reportHeaderStyle = {
    padding: '20px 24px',
    borderBottom: '1px solid #E5E7EB'
  };

  const reportTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 8px 0'
  };

  const reportDescStyle = {
    fontSize: '14px',
    color: '#6B7280',
    margin: '0'
  };

  const reportContentStyle = {
    padding: '20px 24px'
  };

  const sectionTitleStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px'
  };

  const listStyle = {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 16px 0'
  };

  const listItemStyle = {
    fontSize: '13px',
    color: '#6B7280',
    marginBottom: '4px',
    paddingLeft: '12px',
    position: 'relative'
  };

  const bulletStyle = {
    position: 'absolute',
    left: 0,
    top: '6px',
    width: '4px',
    height: '4px',
    backgroundColor: '#9CA3AF',
    borderRadius: '50%'
  };

  const reportFooterStyle = {
    padding: '16px 24px',
    borderTop: '1px solid #E5E7EB',
    backgroundColor: '#F9FAFB',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.2s ease'
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

  const exportOptionsStyle = {
    display: 'flex',
    gap: '8px',
    fontSize: '12px'
  };

  const tagStyle = {
    padding: '2px 6px',
    backgroundColor: '#E5E7EB',
    color: '#374151',
    borderRadius: '4px'
  };

  return (
    <div style={pageStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <h1 style={titleStyle}>Reports</h1>
        <p style={subtitleStyle}>
          Generate comprehensive ESG and emissions reports for compliance, management, and stakeholder communication
        </p>
      </header>

      <div style={contentStyle}>
        {/* Sidebar - Report Categories */}
        <div style={sidebarStyle}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#111827', 
            margin: '0 0 16px 0' 
          }}>
            Report Categories
          </h3>
          
          {reportCategories.map((category) => (
            <div
              key={category.id}
              style={categoryStyle(selectedCategory === category.id)}
              onClick={() => setSelectedCategory(category.id)}
              onMouseEnter={(e) => {
                if (selectedCategory !== category.id) {
                  e.target.style.backgroundColor = '#F9FAFB';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== category.id) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={categoryLabelStyle(selectedCategory === category.id)}>
                {category.label}
              </span>
              <span style={categoryCountStyle}>{category.count}</span>
            </div>
          ))}
        </div>

        {/* Main Content - Reports Grid */}
        <div style={mainContentStyle}>
          <div style={reportsGridStyle}>
            {getCurrentReports().map((report) => (
              <div key={report.id} style={reportCardStyle}>
                {/* Report Header */}
                <div style={reportHeaderStyle}>
                  <h3 style={reportTitleStyle}>{report.title}</h3>
                  <p style={reportDescStyle}>{report.description}</p>
                  {report.framework && (
                    <div style={{ marginTop: '8px' }}>
                      <span style={{
                        ...tagStyle,
                        backgroundColor: '#DBEAFE',
                        color: '#1E40AF'
                      }}>
                        {report.framework}
                      </span>
                    </div>
                  )}
                </div>

                {/* Report Content */}
                <div style={reportContentStyle}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={sectionTitleStyle}>Key Outputs</div>
                    <ul style={listStyle}>
                      {report.outputs.map((output, index) => (
                        <li key={index} style={listItemStyle}>
                          <div style={bulletStyle}></div>
                          {output}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {report.usedFor && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={sectionTitleStyle}>Used For</div>
                      <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                        {report.usedFor}
                      </p>
                    </div>
                  )}

                  <div style={{ marginBottom: '16px' }}>
                    <div style={sectionTitleStyle}>Export Formats</div>
                    <div style={exportOptionsStyle}>
                      {report.exportFormats.map((format, index) => (
                        <span key={index} style={tagStyle}>{format}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={sectionTitleStyle}>Schedule Options</div>
                    <div style={exportOptionsStyle}>
                      {report.scheduleOptions.map((option, index) => (
                        <span key={index} style={tagStyle}>{option}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Report Footer */}
                <div style={reportFooterStyle}>
                  <button
                    style={secondaryButtonStyle}
                    onClick={() => handleScheduleReport(report.id, 'monthly')}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#E5E7EB'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#F3F4F6'}
                  >
                    Schedule
                  </button>
                  <button
                    style={primaryButtonStyle}
                    onClick={() => handleGenerateReport(report.id)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#2563EB'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#3B82F6'}
                  >
                    Generate Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;