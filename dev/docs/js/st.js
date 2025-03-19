
// Sample data - Replace this with your actual data from Python script
const componentsData = [
    {id: 'comp1', name: 'Order Process', type: 'Process', version: '1.2', filepath: '/processes/order/main', parents: [], children: ['comp2', 'comp3']},
    {id: 'comp2', name: 'Order Validation', type: 'Process', version: '1.0', filepath: '/processes/order/validation', parents: ['comp1'], children: ['comp4']},
    {id: 'comp3', name: 'Customer Lookup', type: 'Connector', version: '2.1', filepath: '/connectors/customer-db', parents: ['comp1'], children: []},
    {id: 'comp4', name: 'Order to Invoice Map', type: 'Map', version: '1.5', filepath: '/maps/order-invoice', parents: ['comp2'], children: ['comp5']},
    {id: 'comp5', name: 'Invoice Decision', type: 'Decision', version: '1.0', filepath: '/decisions/invoice-route', parents: ['comp4'], children: ['comp6', 'comp7']},
    {id: 'comp6', name: 'Email Service', type: 'Flow Service', version: '3.0', filepath: '/services/email', parents: ['comp5'], children: []},
    {id: 'comp7', name: 'File Trigger', type: 'Trigger', version: '1.1', filepath: '/triggers/file', parents: ['comp5'], children: ['comp8']},
    {id: 'comp8', name: 'FTP Transport', type: 'Transport', version: '2.0', filepath: '/transports/ftp', parents: ['comp7'], children: []},
    {id: 'comp9', name: 'Logging Service', type: 'Other', version: '1.3', filepath: '/services/logging', parents: [], children: ['comp1']}
];

// Group mapping for component types
const typeGroups = {
    'Process': {shape: 'ellipse', color: '#FF6B6B'},
    'Connector': {shape: 'rectangle', color: '#4ECDC4'},
    'Map': {shape: 'roundrectangle', color: '#FFD166'},
    'Decision': {shape: 'rhomboid', color: '#6A0572'},
    'Flow Service': {shape: 'barrel', color: '#1A535C'},
    'Trigger': {shape: 'triangle', color: '#F2B880'},
    'Transport': {shape: 'rectangle', color: '#3D348B'},
    'Other': {shape: 'rectangle', color: '#7D8491'}
};

// Function to create the graph
function createGraph(data) {
    // Prepare nodes and edges for Cytoscape
    const elements = [];
    
    // Add nodes
    data.forEach(comp => {
    const group = typeGroups[comp.type] || typeGroups['Other'];
    elements.push({
        data: {
        id: comp.id,
        label: comp.name,
        type: comp.type,
        version: comp.version,
        filepath: comp.filepath,
        backgroundColor: group.color,
        shape: group.shape
        }
    });
    });
    
    // Add edges
    data.forEach(comp => {
    comp.children.forEach(childId => {
        elements.push({
        data: {
            id: `${comp.id}-${childId}`,
            source: comp.id,
            target: childId
        }
        });
    });
    });
    
    // Initialize Cytoscape
    const cy = cytoscape({
    container: document.getElementById('cy'),
    elements: elements,
    style: [
        {
        selector: 'node',
        style: {
            'label': 'data(label)',
            'background-color': 'data(backgroundColor)',
            'shape': 'data(shape)',
            'width': '60px',
            'height': '60px',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-wrap': 'wrap',
            'font-size': '10px',
            'text-max-width': '80px'
        }
        },
        {
        selector: 'edge',
        style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
        }
        },
        {
        selector: '.highlighted',
        style: {
            'line-color': '#ff0000',
            'target-arrow-color': '#ff0000',
            'z-index': 999
        }
        },
        {
        selector: '.selected',
        style: {
            'border-width': '3px',
            'border-color': '#3366ff'
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
            node.removeClass('faded');
            node.connectedEdges().removeClass('faded');
        } else {
            node.addClass('faded');
            node.connectedEdges().addClass('faded');
        }
        });
    });
    
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
        if (type === 'Process') colorBox.style.borderRadius = '50%';
        if (type === 'Decision') colorBox.style.transform = 'rotate(45deg)';
        
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
        const legend = document.querySelector('.legend');
        sidebar.insertBefore(filterContainer, legend.nextSibling);
    }
    
    function updateTypeFilters() {
        const selectedTypes = Array.from(document.querySelectorAll('.type-filters input[type="checkbox"]:checked'))
        .map(cb => cb.dataset.type);
        
        cy.nodes().forEach(node => {
        const type = node.data('type');
        if (selectedTypes.includes(type)) {
            node.removeClass('filtered-out');
        } else {
            node.addClass('filtered-out');
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
}