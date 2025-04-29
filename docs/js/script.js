// Declare cy as a global variable
let cy;

// Sample data - Replace this with your actual data from Python script
console.log(componentsData)

// Group mapping for component types
const typeGroups = {
    'Profile': {shape: 'ellipse', color: '#FF6B6B'},
    'Connector Operation': {shape: 'rhomboid', color: '#6A0572'},
    'Process': {shape: 'rectangle', color: '#4ECDC4'},
    'Connector': {shape: 'roundrectangle', color: '#FFD166'},
    'Map': {shape: 'barrel', color: '#1A535C'},
    'Document Cache': {shape: 'triangle', color: '#F2B880'},
    'Function': {shape: 'rectangle', color: '#3D348B'},
    'Deployment Configs': {shape: 'octagon', color: '#4B5842'},
    'Other': {shape: 'rectangle', color: '#7D8491'}
};

// Function to create the graph
function createGraph(data) {
    // Prepare nodes and edges for Cytoscape
    const elements = [];
    
    // Add nodes
    data.forEach(comp => {
        const group = typeGroups[comp.simple_type] || typeGroups['Other'];
        elements.push({
            data: {
                id: comp.componentId,
                label: comp.name,
                type: comp.type,
                version: comp.version,
                filepath: comp.folderName,
                backgroundColor: group.color,
                shape: group.shape,
                simpleType: comp.simple_type
            }
        });
    });
    
    // Add edges
    data.forEach(comp => {
        comp.childComponentIds.forEach(childId => {
            elements.push({
                data: {
                    id: `${comp.componentId}-${childId}`,
                    source: comp.componentId,
                    target: childId
                }
            });
        });
    });
    
    // Initialize Cytoscape
    cy = cytoscape({
        container: document.getElementById('cy'),
        elements: elements,
        style: [
            {
            selector: 'node',
            style: {
                'label': 'data(label)',
                'background-color': 'data(backgroundColor)',
                'shape': 'data(shape)',
                'width': '100px',  // Increased width
                'height': '80px',  // Increased height
                'text-valign': 'center',
                'text-halign': 'center',
                'text-wrap': 'wrap',
                'font-size': '12px',  // Increased font size
                'text-max-width': '90px',  // Increased text width
                'color': '#000000',  // Black text for better readability
                'text-outline-color': '#ffffff',  // White outline
                'text-outline-width': '1px',  // Small outline for contrast
                'text-background-color': 'rgba(255, 255, 255, 0.7)',  // Semi-transparent white background
                'text-background-opacity': 1,
                'text-background-shape': 'roundrectangle',
                'text-background-padding': '3px'
            }
            },
            {
            selector: 'edge',
            style: {
                'width': 3,
                'line-color': '#888',  // Slightly darker gray
                'target-arrow-color': '#888',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
                'arrow-scale': 1.5  // Larger arrows
            }
            },
            {
            selector: '.highlighted',
            style: {
                'line-color': '#ff0000',
                'target-arrow-color': '#ff0000',
                'z-index': 999,
                'width': 4  // Thicker highlighted edges
            }
            },
            {
            selector: '.selected',
            style: {
                'border-width': '4px',
                'border-color': '#3366ff',
                'border-opacity': 1
            }
            },
            {
                selector: '.faded',
                style: {
                    'opacity': 0.2, // Make the node and edge very transparent
                    'text-opacity': 0.2, // Fade the label as well
                    'z-index': 0 // Push faded elements to the background
                }
            },
            // Add specific styles for different shapes
            {
            selector: 'node[shape="ellipse"]',  // Process
            style: {
                'shape': 'ellipse',
                'width': '110px',  // Wider for ellipses
                'height': '80px',
            }
            },
            {
            selector: 'node[shape="rectangle"]',  // Connector and Others
            style: {
                'shape': 'rectangle',
                'width': '100px',
                'height': '70px',
            }
            },
            {
            selector: 'node[shape="roundrectangle"]',  // Map
            style: {
                'shape': 'roundrectangle',
                'width': '110px',
                'height': '70px',
                'border-radius': '10px'
            }
            },
            {
            selector: 'node[shape="rhomboid"]',  // Decision
            style: {
                'shape': 'rhomboid',
                'width': '120px',  // Wider for rhomboids
                'height': '70px',
            }
            },
            {
            selector: 'node[shape="barrel"]',  // Flow Service
            style: {
                'shape': 'barrel',
                'width': '110px',
                'height': '80px',
            }
            },
            {
            selector: 'node[shape="triangle"]',  // Trigger
            style: {
                'shape': 'triangle',
                'width': '100px',
                'height': '90px',  // Taller for triangles
            }
            }
        ],
        layout: {
            name: 'cose',
            idealEdgeLength: 100,
            nodeOverlap: 20,
            refresh: 20,
            fit: true,
            padding: 30,
            randomize: false,
            componentSpacing: 100,
            nodeRepulsion: 400000,
            edgeElasticity: 100,
            nestingFactor: 5,
            gravity: 80,
            numIter: 1000,
            initialTemp: 200,
            coolingFactor: 0.95,
            minTemp: 1.0
        }
    });
    
    // Update stats
    document.getElementById('stats').textContent = `Components: ${data.length} | Connections: ${cy.edges().length}`;

    // Node selection
    cy.on('tap', 'node', function(evt) {
        const node = evt.target;
        const nodeData = node.data();
        
        // Highlight connected edges
        cy.elements().removeClass('highlighted selected');
        node.addClass('selected');
        node.neighborhood().addClass('highlighted');
        
        // Show component details
        document.getElementById('component-details').classList.add('visible');
        document.getElementById('detail-name').textContent = nodeData.label;
        document.getElementById('detail-type').textContent = nodeData.type;
        document.getElementById('detail-version').textContent = nodeData.version;
        document.getElementById('detail-path').textContent = nodeData.filepath;
      });
      
      cy.on('tap', function(evt) {
        if (evt.target === cy) {
          cy.elements().removeClass('highlighted selected');
          document.getElementById('component-details').classList.remove('visible');
        }
      });
    
    // Reset view button
    document.getElementById('reset').addEventListener('click', () => {
    cy.fit();
    cy.elements().removeClass('highlighted selected');
    document.getElementById('component-details').classList.remove('visible');
    });
    
    // Expand all button
    document.getElementById('expand-all').addEventListener('click', () => {
    cy.nodes().unlock();
    cy.layout({
        name: 'cose',
        padding: 30,
        componentSpacing: 100,
        nodeRepulsion: 400000,
        nodeOverlap: 20,
        gravity: 80
    }).run();
    });
    
    // Collapse all button
    document.getElementById('collapse-all').addEventListener('click', () => {
        const rootNodes = cy.nodes().filter(node => node.indegree() === 0);
        const centerX = cy.width() / 2;
        const centerY = cy.height() / 2;
        const radius = Math.min(cy.width(), cy.height()) / 4;
        const angle = (2 * Math.PI) / rootNodes.length;
        
        rootNodes.forEach((node, i) => {
        const x = centerX + radius * Math.cos(i * angle);
        const y = centerY + radius * Math.sin(i * angle);
        node.position({ x, y });
        });
        
        cy.nodes().not(rootNodes).positions(node => {
        const connectedTo = node.incomers('node');
        if (connectedTo.length > 0) {
            const parentPos = connectedTo.first().position();
            return {
            x: parentPos.x + (Math.random() - 0.5) * 100,
            y: parentPos.y + (Math.random() * 100) + 50
            };
        }
        });
        
        cy.nodes().lock();
    });
    
    // Search functionality
    document.getElementById('search').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        if (query.length < 2) {
            cy.elements().removeClass('faded');
            return;
        }
        
        cy.nodes().forEach(node => {
            const name = node.data('label').toLowerCase();
            const type = node.data('type').toLowerCase();
            const path = node.data('filepath').toLowerCase();
            
            if (name.includes(query) || type.includes(query) || path.includes(query)) {
                console.log(`Node matched: ${node.data('label')}`); // Debugging log
                node.removeClass('faded');
                node.connectedEdges().removeClass('faded');
            } else {
                //console.log(`Node matched: ${node.data('label')}`); // Debugging log
                node.addClass('faded');
                node.connectedEdges().addClass('faded');
            }
        });
    });
    

    /*
    // Save/Load Layout
    document.getElementById('save-layout').addEventListener('click', () => {
        const positions = {};
        cy.nodes().forEach(node => {
        positions[node.id()] = node.position();
        });
        localStorage.setItem('boomiDiagramLayout', JSON.stringify(positions));
        alert('Layout saved!');
    });
    
    document.getElementById('load-layout').addEventListener('click', () => {
        const savedLayout = localStorage.getItem('boomiDiagramLayout');
        if (savedLayout) {
        const positions = JSON.parse(savedLayout);
        cy.nodes().forEach(node => {
            if (positions[node.id()]) {
            node.position(positions[node.id()]);
            }
        });
        cy.fit();
        alert('Layout loaded!');
        } else {
        alert('No saved layout found!');
        }
    });
    */
    
    
    // Export PNG
    document.getElementById('export-png').addEventListener('click', () => {
        const png = cy.png({scale: 2, full: true, output: 'blob'});
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(png);
        downloadLink.download = 'boomi-dependencies.png';
        downloadLink.click();
    });
    
    // File import functionality
    document.getElementById('file-input').addEventListener('change', function() {
        const fileNameSpan = document.getElementById('file-name');
        if (this.files.length > 0) {
        fileNameSpan.textContent = this.files[0].name;
        } else {
        fileNameSpan.textContent = '';
        }
    });
    
    document.getElementById('import-data').addEventListener('click', () => {
        const fileInput = document.getElementById('file-input');
        if (fileInput.files.length === 0) {
        alert('Please select a file to import');
        return;
        }
        
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validate imported data
            if (!Array.isArray(importedData)) {
            throw new Error('Imported data is not an array');
            }
            
            // Check if each item has required properties
            for (const item of importedData) {
            if (!item.id || !item.name || !item.type) {
                throw new Error('One or more components are missing required properties (id, name, type)');
            }
            
            // Ensure parents and children are arrays
            if (!Array.isArray(item.parents)) {
                item.parents = [];
            }
            if (!Array.isArray(item.children)) {
                item.children = [];
            }
            }
            
            // Clear current graph and create new one
            cy.destroy();
            createGraph(importedData);
            
            alert('Data imported successfully');
        } catch (error) {
            alert(`Error importing data: ${error.message}`);
        }
        };
        
        reader.readAsText(file);
    });

    // Return the cy instance for further manipulation
    return cy;

}


function updateNodeVisibility() {
    cy.nodes().forEach(node => {
        if (node.hasClass('filtered-out') || node.hasClass('hidden-isolated')) {
            // Ensure the node is hidden if it has the filtered-out or hidden-isolated class
            cy.style()
                .selector(`#${node.id()}`)
                .style({
                    'visibility': 'hidden'  // Hide the node
                })
                .update();
        } else {
            // Ensure the node is visible if it doesn't have filtered-out or hidden-isolated classes
            cy.style()
                .selector(`#${node.id()}`)
                .style({
                    'visibility': 'visible'  // Make the node visible
                })
                .update();
        }
    });
}


// Global state to track whether isolated nodes are hidden
let isolatedNodesHidden = false;

// Function to toggle the visibility of nodes with no edges
function toggleIsolatedNodes() {
    // Get all isolated nodes (nodes with no edges)
    const isolatedNodes = cy.nodes().filter(node => node.degree() === 0);

    if (isolatedNodesHidden) {
        // Show all isolated nodes unless they have the 'filtered-out' class
        isolatedNodes.forEach(node => {
            /*
            if (!node.hasClass('filtered-out')) {
                node.removeClass('hidden-isolated');
                cy.style()
                    .selector(`#${node.id()}`)
                    .style({
                        'visibility': 'visible'  // Make the node visible
                    })
                    .update();
            }
            */
            node.removeClass('hidden-isolated');
        });
        isolatedNodesHidden = false; // Update state
        updateNodeVisibility(); // Update visibility of all nodes
    } else {
        // Hide all isolated nodes
        isolatedNodes.forEach(node => {
            node.addClass('hidden-isolated');
            cy.style()
                .selector(`#${node.id()}`)
                .style({
                    'visibility': 'hidden'  // Hide the node
                })
                .update();
        });
        isolatedNodesHidden = true; // Update state
    }
}

// Add event listener to the button
document.getElementById('toggle-isolated-nodes').addEventListener('click', toggleIsolatedNodes);

    
// Function to handle filtering by component type
function addComponentTypeFilters() {
    const filterContainer = document.createElement('div');
    filterContainer.className = 'type-filters';
    filterContainer.innerHTML = '<h3>Filter by Type</h3>';
    
    const typeCheckboxes = document.createElement('div');
    
    // Get unique component types
    const types = Object.keys(typeGroups);
    
    types.forEach(type => {
    const group = typeGroups[type];
    const checkboxId = `filter-${type.toLowerCase().replace(/\s+/g, '-')}`;
    
    const checkboxItem = document.createElement('div');
    checkboxItem.className = 'legend-item';
    
    const colorBox = document.createElement('div');
    colorBox.className = 'legend-color';
    colorBox.style.backgroundColor = group.color;

    // Apply shape styles based on typeGroups
    if (group.shape === 'ellipse') {
        colorBox.style.borderRadius = '50%';
    } else if (group.shape === 'rhomboid') {
        colorBox.style.transform = 'skewX(-20deg)';
    } else if (group.shape === 'roundrectangle') {
        colorBox.style.borderRadius = '10px';
    } else if (group.shape === 'triangle') {
        colorBox.style.width = '0';
        colorBox.style.height = '0';
        colorBox.style.borderLeft = '10px solid transparent';
        colorBox.style.borderRight = '10px solid transparent';
        colorBox.style.borderBottom = `20px solid ${group.color}`;
        colorBox.style.backgroundColor = 'transparent'; // Remove background for triangle
    } else if (group.shape === 'barrel') {
        colorBox.style.borderRadius = '50% / 25%'; // Barrel-like shape
    } else if (group.shape === 'octagon') {
        colorBox.style.clipPath = 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';
    } else {
        colorBox.style.borderRadius = '0'; // Default to rectangle
    }

    const label = document.createElement('label');
    label.htmlFor = checkboxId;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = true;
    checkbox.dataset.type = type;
    
    checkbox.addEventListener('change', updateTypeFilters);
    
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(` ${type}`));
    
    checkboxItem.appendChild(colorBox);
    checkboxItem.appendChild(label);
    typeCheckboxes.appendChild(checkboxItem);
    });
    
    filterContainer.appendChild(typeCheckboxes);
    
    // Add a select/deselect all button
    const selectAllContainer = document.createElement('div');
    selectAllContainer.style.marginTop = '10px';
    
    const selectAllBtn = document.createElement('button');
    selectAllBtn.textContent = 'Select All';
    selectAllBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.type-filters input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = true);
    updateTypeFilters();
    });
    
    const deselectAllBtn = document.createElement('button');
    deselectAllBtn.textContent = 'Deselect All';
    deselectAllBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.type-filters input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    updateTypeFilters();
    });
    
    selectAllContainer.appendChild(selectAllBtn);
    selectAllContainer.appendChild(deselectAllBtn);
    filterContainer.appendChild(selectAllContainer);
    
    // Add the filter container after the legend
    const sidebar = document.querySelector('.sidebar');
    const component_details = document.querySelector('.component-details');
    sidebar.insertBefore(filterContainer, component_details);
}

// Update filters
function updateTypeFilters() {
    const selectedTypes = Array.from(document.querySelectorAll('.type-filters input[type="checkbox"]:checked'))
        .map(cb => cb.dataset.type);

    // Iterate over each node and apply the 'filtered-out' class based on selection
    cy.nodes().forEach(node => {
        const type = node.data('simpleType');
        if (selectedTypes.includes(type)) {
            node.removeClass('filtered-out');
            // Ensure the node is visible unless it's hidden due to isolation
            if (!node.hasClass('hidden-isolated')) {
                cy.style()
                    .selector(`#${node.id()}`)
                    .style({
                        'visibility': 'visible'  // Make the node visible
                    })
                    .update();
            }

            // Ensure edges connected to this node are visible
            node.neighborhood('edge').forEach(edge => {
                const sourceNode = edge.source();
                const targetNode = edge.target();

                // Only show the edge if both the source and target nodes are visible
                if (!sourceNode.hasClass('filtered-out') && !targetNode.hasClass('filtered-out')) {
                    cy.style()
                        .selector(`#${edge.id()}`)
                        .style({
                            'visibility': 'visible'  // Make the edge visible
                        })
                        .update();
                }
            });
        } else {
            node.addClass('filtered-out');
            // Hide the node
            cy.style()
                .selector(`#${node.id()}`)
                .style({
                    'visibility': 'hidden'  // Hide the node
                })
                .update();

            // Hide edges connected to this node
            node.neighborhood('edge').forEach(edge => {
                cy.style()
                    .selector(`#${edge.id()}`)
                    .style({
                        'visibility': 'hidden'  // Hide the edge
                    })
                    .update();
            });
        }
    });
}




// Add style for filtered-out nodes
const filterStyle = document.createElement('style');
filterStyle.innerHTML = `
    .filtered-out {
    display: none;
    }
`;
document.head.appendChild(filterStyle);

// Initialize with sample data
createGraph(componentsData);

// Add type filters after creating the graph
addComponentTypeFilters();

// Toggle the Isolated Nodes to be hidden initially
toggleIsolatedNodes();




function logNodeStatus(){
    console.log(cy.nodes());
    console.log(`timestamp,nodeLabel,filtered-out,hidden-isolated`);

    cy.nodes().forEach(node => {
        console.log(`,${node.data('label')},${node.hasClass('filtered-out')},${node.hasClass('hidden-isolated')}`);
    });
}


// Add event listener to the button
document.getElementById('log-node-status').addEventListener('click', logNodeStatus);