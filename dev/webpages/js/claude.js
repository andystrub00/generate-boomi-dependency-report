// Load data
//let componentsData = [];

// Sample data - Replace this with your actual data from Python script
console.log(componentsData)

const typeColors = {
    'Profile': '#FF9800',
    'Process': '#2196F3',
    'Connector Operation': '#9C27B0',
    'Connector': '#F44336',
    'Map': '#4CAF50',
    'Deployment Configs': '#795548',
    'Function': '#00BCD4',
    'Other': '#9E9E9E',
    'Document Cache': '#FFEB3B'
};

const typeShapes = {
    'Profile': symbolSquare,
    'Process': symbolCircle,
    'Connector Operation': symbolDiamond,
    'Connector': symbolTriangle,
    'Map': symbolCross,
    'Deployment Configs': symbolWye,
    'Function': symbolStar,
    'Other': symbolSquare,
    'Document Cache': symbolTriangle
};

// Simple shapes using d3 symbols
function symbolCircle(size) {
    return d3.symbol().type(d3.symbolCircle).size(size)();
}

function symbolSquare(size) {
    return d3.symbol().type(d3.symbolSquare).size(size)();
}

function symbolTriangle(size) {
    return d3.symbol().type(d3.symbolTriangle).size(size)();
}

function symbolDiamond(size) {
    return d3.symbol().type(d3.symbolDiamond).size(size)();
}

function symbolCross(size) {
    return d3.symbol().type(d3.symbolCross).size(size * 1.5)();
}

function symbolStar(size) {
    return d3.symbol().type(d3.symbolStar).size(size * 1.2)();
}

function symbolWye(size) {
    return d3.symbol().type(d3.symbolWye).size(size)();
}

// State variables
let showIsolated = true;
let enabledTypes = {};
let simulation;
let svg, g;
let width, height;
let currentScale = 1;
let isDragging = false;

function initializeApp() {
    // Use the data from our script tag
    initializeVisualization(componentsData);
}

function initializeVisualization(componentsData) {
    //componentsData = data;
    
    // Initialize type filters
    const types = [...new Set(componentsData.map(d => d.simple_type))];
    types.forEach(type => {
        enabledTypes[type] = true;
    });
    
    createTypeFilters(types);
    createForceGraph();
    
    // Set up event listeners
    document.getElementById('toggle-isolated').addEventListener('click', toggleIsolated);
    document.getElementById('export-isolated').addEventListener('click', exportIsolatedComponents);
    document.getElementById('reorganize').addEventListener('click', reorganizeLayout);
    document.getElementById('zoom-in').addEventListener('click', () => zoom(0.2));
    document.getElementById('zoom-out').addEventListener('click', () => zoom(-0.2));
    document.getElementById('zoom-reset').addEventListener('click', resetZoom);
    
    // Initial update
    updateVisualization();
}

function createTypeFilters(types) {
    const container = document.getElementById('type-filters');
    container.innerHTML = '';
    
    types.forEach(type => {
        const div = document.createElement('div');
        div.className = 'checkbox-container';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `filter-${type.toLowerCase().replace(/\s+/g, '-')}`;
        checkbox.checked = enabledTypes[type];
        checkbox.addEventListener('change', () => {
            enabledTypes[type] = checkbox.checked;
            updateVisualization();
        });
        
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.style.color = typeColors[type] || '#000';
        label.textContent = ` ${type}`;
        
        div.appendChild(checkbox);
        div.appendChild(label);
        container.appendChild(div);
    });
}

function createForceGraph() {
    // Clear previous visualization
    const visualizationElement = document.getElementById('visualization');
    visualizationElement.innerHTML = '';
    
    // Set up SVG
    width = visualizationElement.clientWidth;
    height = visualizationElement.clientHeight;
    
    svg = d3.select('#visualization')
        .attr('width', width)
        .attr('height', height);
        
    // Create a group element for zooming
    g = svg.append('g');
    
    // Add zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
            currentScale = event.transform.k;
            document.getElementById('zoom-level').textContent = `${Math.round(currentScale * 100)}%`;
        });
        
    svg.call(zoom);
    
    // Center the initial view
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8));
}

function updateVisualization() {
    // Filter components based on enabled types and isolated setting
    const filteredComponents = componentsData.filter(component => {
        // Check if type is enabled
        if (!enabledTypes[component.simple_type]) {
            return false;
        }
        
        // Check isolated status
        if (!showIsolated && 
            component.parentComponentIds.length === 0 && 
            component.childComponentIds.length === 0) {
            return false;
        }
        
        return true;
    });
    
    // Create a dictionary of filtered components for easy lookup
    const componentsDict = {};
    filteredComponents.forEach(component => {
        componentsDict[component.componentId] = component;
    });
    
    // Create links based on parent-child relationships
    const links = [];
    filteredComponents.forEach(component => {
        component.childComponentIds.forEach(childId => {
            if (componentsDict[childId]) {
                links.push({
                    source: component.componentId,
                    target: childId
                });
            }
        });
    });
    
    // Set up the force simulation
    if (simulation) {
        simulation.stop();
    }
    
    simulation = d3.forceSimulation(filteredComponents)
        .force('link', d3.forceLink(links)
            .id(d => d.componentId)
            .distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(0, 0))
        .force('collide', d3.forceCollide().radius(40));
    
    // Clear previous elements
    g.selectAll('*').remove();
    
    // Create links
    const link = g.append('g')
        .attr('class', 'links')
        .selectAll('path')
        .data(links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('marker-end', 'url(#arrow)');
    
    // Define arrow marker
    g.append('defs').append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 20)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#999');
    
    // Create nodes
    const node = g.append('g')
        .attr('class', 'nodes')
        .selectAll('.node')
        .data(filteredComponents)
        .enter().append('g')
        .attr('class', 'node')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended))
        .on('click', showDetails);
    
    // Add shapes based on type
    node.append('path')
        .attr('d', d => {
            const shape = typeShapes[d.simple_type] || symbolCircle;
            return shape(350);
        })
        .attr('class', d => d.simple_type.toLowerCase().replace(/\s+/g, '-'))
        .style('fill', d => typeColors[d.simple_type] || '#ccc')
        .style('stroke', '#fff')
        .style('stroke-width', '1.5px');
    
    // Add labels
    node.append('text')
        .attr('dy', 30)
        .attr('text-anchor', 'middle')
        .text(d => d.name)
        .style('font-size', '10px')
        .style('fill', '#333');
    
    // Update positions on each tick
    simulation.on('tick', () => {
        link.attr('d', d => {
            const sourceX = d.source.x || 0;
            const sourceY = d.source.y || 0;
            const targetX = d.target.x || 0;
            const targetY = d.target.y || 0;
            
            return `M${sourceX},${sourceY}L${targetX},${targetY}`;
        });
        
        node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
    });
}

function showDetails(event, d) {
    const detailPanel = document.getElementById('detail-panel');
    const detailContent = document.getElementById('detail-content');
    
    // Show the panel
    detailPanel.style.display = 'block';
    
    // Fill in the details
    detailContent.innerHTML = `
        <div class="detail-item"><strong>Name:</strong> ${d.name}</div>
        <div class="detail-item"><strong>Type:</strong> ${d.type}</div>
        <div class="detail-item"><strong>Simple Type:</strong> ${d.simple_type}</div>
        <div class="detail-item"><strong>Version:</strong> ${d.version}</div>
        <div class="detail-item"><strong>Path:</strong> ${d.folderName}</div>
        <div class="detail-item"><strong>Created:</strong> ${new Date(d.createdDate).toLocaleString()}</div>
        <div class="detail-item"><strong>Modified:</strong> ${new Date(d.modifiedDate).toLocaleString()}</div>
    `;
    
    // Stop propagation to prevent drag
    event.stopPropagation();
}

function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
    isDragging = true;
}

function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
}

function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    // Keep position fixed after dragging
    setTimeout(() => {
        isDragging = false;
    }, 100);
}

function toggleIsolated() {
    showIsolated = !showIsolated;
    document.getElementById('toggle-isolated').textContent = 
        showIsolated ? "Hide Isolated Components" : "Show Isolated Components";
    updateVisualization();
}

function exportIsolatedComponents() {
    // Find isolated components
    const isolatedComponents = componentsData.filter(component => 
        component.parentComponentIds.length === 0 && 
        component.childComponentIds.length === 0
    );
    
    // Convert to CSV
    const fields = Object.keys(isolatedComponents[0] || {}).filter(k => k !== '@type');
    
    const csv = Papa.unparse({
        fields,
        data: isolatedComponents.map(comp => {
            const row = {};
            fields.forEach(field => {
                if (Array.isArray(comp[field])) {
                    row[field] = comp[field].join(', ');
                } else {
                    row[field] = comp[field];
                }
            });
            return row;
        })
    });
    
    // Download the CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'isolated_components.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function reorganizeLayout() {
    // Restart simulation with stronger forces for better layout
    if (simulation) {
        simulation
            .force('charge', d3.forceManyBody().strength(-500))
            .force('link', d3.forceLink().id(d => d.componentId).distance(150))
            .alpha(1)
            .restart();
        
        // Restore original forces after layout stabilizes
        setTimeout(() => {
            simulation
                .force('charge', d3.forceManyBody().strength(-300))
                .force('link', d3.forceLink().id(d => d.componentId).distance(100));
        }, 2000);
    }
}

function zoom(delta) {
    const newScale = Math.max(0.1, Math.min(4, currentScale + delta));
    
    // Get current transform
    const transform = d3.zoomTransform(svg.node());
    
    // Apply new scale while maintaining the center
    const newTransform = d3.zoomIdentity
        .translate(transform.x, transform.y)
        .scale(newScale);
        
    // Apply the transform
    svg.call(d3.zoom().transform, newTransform);
}

function resetZoom() {
    svg.call(d3.zoom().transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8));
}

/*
// Load external data from /data/component_data.js
function loadExternalData() {
    try {
        // First try to load from expected path
        componentsData = window.componentsData || [];
        initializeVisualization(componentsData);
    } catch (e) {
        console.error("Could not load data from external file:", e);
        // Use the sample data as fallback
        initializeVisualization(componentsData);
    }
}
*/

// Initialize on load
window.onload = function() {
    //loadExternalData();
    initializeVisualization(componentsData);
};

// Handle window resize
window.addEventListener('resize', () => {
    width = document.getElementById('visualization').clientWidth;
    height = document.getElementById('visualization').clientHeight;
    d3.select('#visualization')
        .attr('width', width)
        .attr('height', height);
});
