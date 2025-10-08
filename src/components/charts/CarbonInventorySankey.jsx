import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';

const CarbonInventorySankey = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !data.nodes || !data.links) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 150, bottom: 40, left: 80 };

    svg.attr("width", width).attr("height", height);

    const sankeyGenerator = sankey()
      .nodeWidth(20)
      .nodePadding(15)
      .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
      .nodeSort(null); // Prevent automatic sorting

    const { nodes, links } = sankeyGenerator(data);

    // Color scheme matching the image exactly
    const nodeColors = {
      'Total emissions': '#4DD0E1', // Cyan
      'Emissions': '#B0BEC5', // Light gray
      'Scope 1': '#FF8A65', // Light orange  
      'Scope 2': '#BA68C8', // Light purple
      'Scope 3': '#AED581', // Light green
      'Stationary Combustion': '#FF9800', // Orange
      'Mobile Combustion': '#8BC34A', // Green
      'Fugitives': '#F44336', // Red
      'Electricity': '#9C27B0', // Purple
      'District Heating': '#795548', // Brown
      'Steam': '#E91E63', // Pink
      'Cooling': '#607D8B', // Blue-gray
      'Purchased Goods': '#CDDC39', // Lime
    };

    // Draw links with proper flow colors
    svg.append("g")
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", d => {
        // Use the source node color for the flow
        return nodeColors[d.source.name] || '#E0E0E0';
      })
      .attr("stroke-width", d => Math.max(1, d.width))
      .attr("fill", "none")
      .attr("opacity", 0.6)
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 0.8);
        
        // Show tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "sankey-tooltip")
          .style("position", "absolute")
          .style("background", "#1F2937")
          .style("color", "white")
          .style("padding", "8px 12px")
          .style("border-radius", "6px")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .style("z-index", "1000")
          .style("opacity", 0);

        tooltip.transition()
          .duration(200)
          .style("opacity", 1);

        tooltip.html(`${d.source.name} → ${d.target.name}<br/>${d.value.toLocaleString()} kg CO₂e`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this).attr("opacity", 0.6);
        d3.selectAll(".sankey-tooltip").remove();
      });

    // Draw nodes
    const nodeGroups = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g");

    nodeGroups.append("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("fill", d => nodeColors[d.name] || '#64B5F6')
      .attr("stroke", "none")
      .attr("rx", 0); // No rounded corners for sharper look

    // Add node labels positioned properly
    nodeGroups.append("text")
      .attr("x", d => {
        // Position labels based on which side of the diagram
        if (d.x0 < width * 0.3) return d.x1 + 8; // Left side nodes
        if (d.x0 > width * 0.7) return d.x0 - 8; // Right side nodes  
        return d.x0 + (d.x1 - d.x0) / 2; // Middle nodes
      })
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => {
        if (d.x0 < width * 0.3) return "start";
        if (d.x0 > width * 0.7) return "end";
        return "middle";
      })
      .style("font-family", "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif")
      .style("font-size", "13px")
      .style("font-weight", "500")
      .style("fill", "#374151")
      .text(d => d.name);

    // Add values below node names
    nodeGroups.append("text")
      .attr("x", d => {
        if (d.x0 < width * 0.3) return d.x1 + 8;
        if (d.x0 > width * 0.7) return d.x0 - 8;
        return d.x0 + (d.x1 - d.x0) / 2;
      })
      .attr("y", d => (d.y1 + d.y0) / 2)
      .attr("dy", "1.6em")
      .attr("text-anchor", d => {
        if (d.x0 < width * 0.3) return "start";
        if (d.x0 > width * 0.7) return "end";
        return "middle";
      })
      .style("font-family", "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("fill", "#6B7280")
      .text(d => d.value ? d.value.toLocaleString() : '');

  }, [data]);

  return (
    <div style={{ 
      backgroundColor: '#FFFFFF',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      overflow: 'auto'
    }}>
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: '600', 
        color: '#111827', 
        margin: '0 0 20px 0' 
      }}>
        Carbon Inventory
      </h3>
      <svg ref={svgRef} style={{ width: '100%', height: 'auto', minHeight: '400px' }}></svg>
    </div>
  );
};

export default CarbonInventorySankey;