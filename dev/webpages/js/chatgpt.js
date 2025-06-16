// main.js


console.log(componentsData)
// Shapes and colors for each simple_type
const typeStyles = {
    "Profile":       { shape: "ellipse", color: "#f94144" },
    "Process":       { shape: "round-rectangle", color: "#f3722c" },
    "Connector Operation": { shape: "diamond", color: "#f9c74f" },
    "Connector":     { shape: "hexagon", color: "#90be6d" },
    "Map":           { shape: "triangle", color: "#43aa8b" },
    "Deployment Configs": { shape: "pentagon", color: "#577590" },
    "Function":      { shape: "star", color: "#277da1" },
    "Document Cache":{ shape: "tag", color: "#4d908e" },
    "Other":         { shape: "rectangle", color: "#9e9e9e" }
  };
  
  const cy = cytoscape({
    container: document.getElementById('cy'),
    elements: [],
    style: [
      {
        selector: 'node',
        style: {
          'label': 'data(label)',
          'shape': 'data(shape)',
          'background-color': 'data(color)',
          'text-valign': 'center',
          'color': '#fff',
          'text-outline-width': 2,
          'text-outline-color': '#444'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#888',
          'target-arrow-color': '#888',
          'target-arrow-shape': 'triangle'
        }
      }
    ],
    layout: { name: 'dagre', fit: true },
    wheelSensitivity: 0.1
  });
  
  let typeSet = new Set();
  let allNodes = new Map();
  let allEdges = [];
  
  componentsData.forEach(comp => {
    typeSet.add(comp.simple_type);
    const style = typeStyles[comp.simple_type] || typeStyles["Other"];
  
    const node = {
      data: {
        id: comp.componentId,
        label: comp.name,
        shape: style.shape,
        color: style.color,
        info: comp
      }
    };
  
    allNodes.set(comp.componentId, node);
  
    comp.childComponentIds.forEach(childId => {
      allEdges.push({
        data: { id: `${comp.componentId}-${childId}`, source: comp.componentId, target: childId }
      });
    });
  });
  
  // Add nodes and edges to the graph
  cy.add(Array.from(allNodes.values()));
  cy.add(allEdges);
  
  // Checklist for simple_types
  const typeFilters = document.getElementById('typeFilters');
  typeSet.forEach(type => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" data-type="${type}" checked /> ${type}`;
    typeFilters.appendChild(label);
  });
  
  function applyFilters() {
    const enabledTypes = new Set();
    document.querySelectorAll('#typeFilters input[type=checkbox]').forEach(cb => {
      if (cb.checked) enabledTypes.add(cb.dataset.type);
    });
  
    cy.nodes().forEach(n => {
      const nodeType = n.data('info').simple_type;
      n.style('display', enabledTypes.has(nodeType) ? 'element' : 'none');
    });
  
    cy.edges().forEach(e => {
      const srcVisible = e.source().style('display') !== 'none';
      const tgtVisible = e.target().style('display') !== 'none';
      e.style('display', (srcVisible && tgtVisible) ? 'element' : 'none');
    });
  }
  
  document.querySelectorAll('#typeFilters input[type=checkbox]').forEach(cb =>
    cb.addEventListener('change', applyFilters)
  );
  
  // Node click info
  cy.on('tap', 'node', evt => {
    const info = evt.target.data('info');
    document.getElementById('infoName').textContent = info.name;
    document.getElementById('infoType').textContent = info.simple_type;
    document.getElementById('infoVersion').textContent = info.version;
    document.getElementById('infoPath').textContent = info.folderName;
  });
  
  // Toggle isolated components
  let hideIsolated = false;
  document.getElementById('toggleIsolated').addEventListener('click', () => {
    hideIsolated = !hideIsolated;
  
    cy.nodes().forEach(n => {
      const visible = n.style('display') !== 'none';
      const connected = n.connectedEdges().some(e => e.style('display') !== 'none');
      if (hideIsolated && visible && !connected) {
        n.style('display', 'none');
      } else if (!hideIsolated && visible === false) {
        applyFilters(); // Re-apply filter to restore
      }
    });
  
    cy.edges().forEach(e => {
      const srcVisible = e.source().style('display') !== 'none';
      const tgtVisible = e.target().style('display') !== 'none';
      e.style('display', (srcVisible && tgtVisible) ? 'element' : 'none');
    });
  });
  
  // Export isolated components
  document.getElementById('exportIsolated').addEventListener('click', () => {
    const rows = [['componentId', 'name', 'simple_type', 'type', 'version', 'folderName']];
    cy.nodes().forEach(n => {
      const visible = n.style('display') !== 'none';
      const connected = n.connectedEdges().some(e => e.style('display') !== 'none');
      if (!connected && visible) {
        const info = n.data('info');
        rows.push([
          info.componentId, info.name, info.simple_type,
          info.type, info.version, info.folderName
        ]);
      }
    });
  
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'isolated_components.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
  
  // Reformat graph
  document.getElementById('reformatGraph').addEventListener('click', () => {
    cy.layout({ name: 'dagre', fit: true }).run();
  });
  