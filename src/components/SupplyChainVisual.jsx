import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const SupplyChainVisual = ({ onAddConnection }) => {
  const svgRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: null });

  // Sample supply chain data
  const supplyChainData = {
    name: "Your Company",
    emissions: { scope1: 8600, scope2: 5178, scope3: 20712 },
    total: 34490,
    type: "root",
    children: [
      {
        name: "Steel Supplier Co.",
        emissions: { scope1: 12000, scope2: 3200, scope3: 0 },
        total: 15200,
        type: "tier1",
        relationship: "Direct Supplier",
        children: [
          {
            name: "Iron Ore Mining Ltd",
            emissions: { scope1: 8500, scope2: 1200, scope3: 0 },
            total: 9700,
            type: "tier2",
            relationship: "Raw Material"
          },
          {
            name: "Coal Energy Corp",
            emissions: { scope1: 15000, scope2: 800, scope3: 0 },
            total: 15800,
            type: "tier2",
            relationship: "Energy Provider"
          }
        ]
      },
      {
        name: "Logistics Partners Inc",
        emissions: { scope1: 5400, scope2: 2100, scope3: 0 },
        total: 7500,
        type: "tier1",
        relationship: "Transportation",
        children: [
          {
            name: "Fleet Services",
            emissions: { scope1: 3200, scope2: 400, scope3: 0 },
            total: 3600,
            type: "tier2",
            relationship: "Vehicle Fleet"
          }
        ]
      },
      {
        name: "Technology Solutions",
        emissions: { scope1: 1200, scope2: 2800, scope3: 0 },
        total: 4000,
        type: "tier1",
        relationship: "IT Services",
        children: []
      }
    ]
  };

  useEffect(() => {
    const drawVisualization = () => {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const container = svgRef.current.parentElement;
      const containerWidth = container.clientWidth - 48; // Account for padding
      const containerHeight = 600;

      // Ensure minimum width
      const width = Math.max(containerWidth, 800);
      const height = containerHeight;

      svg.attr("width", width).attr("height", height);

      // Create hierarchy
      const root = d3.hierarchy(supplyChainData);
      
      // Adjust layout size based on container width
      const treeWidth = width - 300; // More conservative margin
      const treeHeight = height - 100;
      const treeLayout = d3.tree().size([treeHeight, treeWidth]);
      treeLayout(root);

      // Create groups for links and nodes with responsive margins
      const marginLeft = 150;
      const marginTop = 50;
      const linkGroup = svg.append("g").attr("transform", `translate(${marginLeft}, ${marginTop})`);
      const nodeGroup = svg.append("g").attr("transform", `translate(${marginLeft}, ${marginTop})`);

      // Draw links
      linkGroup
        .selectAll("path")
        .data(root.links())
        .join("path")
        .attr("d", d3.linkHorizontal()
          .x(d => d.y)
          .y(d => d.x))
        .attr("fill", "none")
        .attr("stroke", "#94A3B8")
        .attr("stroke-width", 2);

      // Draw nodes
      const nodes = nodeGroup
        .selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", d => `translate(${d.y}, ${d.x})`)
        .style("cursor", "pointer");

      // Node circles
      nodes
        .append("circle")
        .attr("r", d => d.data.type === "root" ? 25 : 20)
        .attr("fill", d => {
          switch(d.data.type) {
            case "root": return "#3B82F6";
            case "tier1": return "#10B981";
            case "tier2": return "#F59E0B";
            default: return "#6B7280";
          }
        })
        .attr("stroke", "#FFFFFF")
        .attr("stroke-width", 3);

      // Company logos (placeholder)
      nodes
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.3em")
        .attr("font-size", "10px")
        .attr("fill", "white")
        .attr("font-weight", "600")
        .text(d => d.data.name.split(' ').map(word => word[0]).join('').substring(0, 3));

      // Company names - adjust positioning for better responsive layout
      nodes
        .append("text")
        .attr("x", d => {
          if (d.data.type === "root") return 0;
          // Position text to avoid overflow
          const textWidth = d.data.name.length * 6; // Approximate text width
          const spaceRight = width - marginLeft - d.y;
          return spaceRight > textWidth + 50 ? 35 : -35;
        })
        .attr("y", d => d.data.type === "root" ? -35 : 0)
        .attr("text-anchor", d => {
          if (d.data.type === "root") return "middle";
          const textWidth = d.data.name.length * 6;
          const spaceRight = width - marginLeft - d.y;
          return spaceRight > textWidth + 50 ? "start" : "end";
        })
        .attr("font-size", "12px")
        .attr("font-weight", "600")
        .attr("fill", "#111827")
        .text(d => d.data.name);

      // Emissions data - adjust positioning similarly
      nodes
        .append("text")
        .attr("x", d => {
          if (d.data.type === "root") return 0;
          const textWidth = `${d.data.total.toLocaleString()} tCO₂e`.length * 5;
          const spaceRight = width - marginLeft - d.y;
          return spaceRight > textWidth + 50 ? 35 : -35;
        })
        .attr("y", d => d.data.type === "root" ? -20 : 15)
        .attr("text-anchor", d => {
          if (d.data.type === "root") return "middle";
          const textWidth = `${d.data.total.toLocaleString()} tCO₂e`.length * 5;
          const spaceRight = width - marginLeft - d.y;
          return spaceRight > textWidth + 50 ? "start" : "end";
        })
        .attr("font-size", "10px")
        .attr("fill", "#6B7280")
        .text(d => `${d.data.total.toLocaleString()} tCO₂e`);

      // Add hover effects
      nodes
        .on("mouseenter", function(event, d) {
          d3.select(this).select("circle")
            .transition()
            .duration(200)
            .attr("r", d.data.type === "root" ? 28 : 23);

          setTooltip({
            visible: true,
            x: event.pageX,
            y: event.pageY,
            data: d.data
          });
        })
        .on("mouseleave", function(event, d) {
          d3.select(this).select("circle")
            .transition()
            .duration(200)
            .attr("r", d.data.type === "root" ? 25 : 20);

          setTooltip({ visible: false, x: 0, y: 0, data: null });
        })
        .on("click", function(event, d) {
          setSelectedNode(d.data);
        });

      // Add "+" button for adding connections - position responsively
      const addButtonX = Math.min(treeWidth + marginLeft - 50, width - 100);
      const addButton = nodeGroup
        .append("g")
        .attr("transform", `translate(${addButtonX - marginLeft}, 50)`)
        .style("cursor", "pointer")
        .on("click", onAddConnection);

      addButton
        .append("circle")
        .attr("r", 25)
        .attr("fill", "#E5E7EB")
        .attr("stroke", "#3B82F6")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5");

      addButton
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.3em")
        .attr("font-size", "20px")
        .attr("fill", "#3B82F6")
        .attr("font-weight", "600")
        .text("+");

      addButton
        .append("text")
        .attr("text-anchor", "middle")
        .attr("y", 35)
        .attr("font-size", "12px")
        .attr("fill", "#6B7280")
        .text("Add Supplier");
    };

    drawVisualization();

    // Add resize handler
    const handleResize = () => {
      drawVisualization();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [onAddConnection]);

  const containerStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  };

  const headerStyle = {
    padding: '20px 24px',
    borderBottom: '1px solid #E5E7EB',
    backgroundColor: '#F9FAFB'
  };

  const tooltipStyle = {
    position: 'fixed',
    left: tooltip.x + 10,
    top: tooltip.y - 10,
    backgroundColor: '#1F2937',
    color: '#F9FAFB',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '12px',
    zIndex: 1000,
    pointerEvents: 'none',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    display: tooltip.visible ? 'block' : 'none'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          color: '#111827', 
          margin: 0 
        }}>
          Supply Chain Network Visualization
        </h3>
      </div>
      
      <div style={{ 
        padding: '24px', 
        position: 'relative', 
        overflowX: 'auto',
        overflowY: 'hidden'
      }}>
        <svg ref={svgRef} style={{ display: 'block', margin: '0 auto' }}></svg>
        
        {/* Tooltip */}
        {tooltip.visible && tooltip.data && (
          <div style={tooltipStyle}>
            <div style={{ fontWeight: '600', marginBottom: '8px' }}>
              {tooltip.data.name}
            </div>
            <div>Total Emissions: {tooltip.data.total.toLocaleString()} tCO₂e</div>
            <div>Scope 1: {tooltip.data.emissions.scope1.toLocaleString()} tCO₂e</div>
            <div>Scope 2: {tooltip.data.emissions.scope2.toLocaleString()} tCO₂e</div>
            <div>Scope 3: {tooltip.data.emissions.scope3.toLocaleString()} tCO₂e</div>
            {tooltip.data.relationship && (
              <div style={{ marginTop: '4px', fontStyle: 'italic' }}>
                {tooltip.data.relationship}
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          backgroundColor: '#F9FAFB',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Legend</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3B82F6' }}></div>
              Your Company
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }}></div>
              Tier 1 Suppliers
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></div>
              Tier 2 Suppliers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChainVisual;