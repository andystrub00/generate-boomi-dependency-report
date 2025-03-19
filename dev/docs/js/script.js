
// Sample data - Replace this with your actual data from Python script
const componentsData = [
    {
        "id": "09b21b7a-fdba-46cd-a4dd-812b3fc6b2f1",
        "name": "Unrefed Flat File",
        "type": "profile.flatfile",
        "version": 1,
        "filepath": "TEST SUBFOLDER",
        "parents": [],
        "children": []
    },
    {
        "id": "26b680b8-4e09-4fd7-8143-872f4eb46e47",
        "name": "[TEMP] [sub] Sub Process One",
        "type": "process",
        "version": 3,
        "filepath": "TEST SUBFOLDER",
        "parents": [
            "e9b2bfa0-9607-4fb5-8ebe-10379a752034"
        ],
        "children": [
            "04b0cc6d-2a36-44a5-8d0f-c8ccf255caf4",
            "a07be6ce-13b6-41e1-a983-f7f78503bc20",
            "fb128b14-fcbb-4a3b-a9d7-c466c11cd518"
        ]
    },
    {
        "id": "3a8fa0b3-0641-4ecb-aad7-085951ba59df",
        "name": "[TEMP] [Main] Parent Process Two",
        "type": "process",
        "version": 2,
        "filepath": "TEST SUBFOLDER",
        "parents": [],
        "children": [
            "a07be6ce-13b6-41e1-a983-f7f78503bc20",
            "fb128b14-fcbb-4a3b-a9d7-c466c11cd518"
        ]
    },
    {
        "id": "a07be6ce-13b6-41e1-a983-f7f78503bc20",
        "name": "[TEMP] Database V2 Operation",
        "type": "connector-action",
        "version": 1,
        "filepath": "TEST SUBFOLDER",
        "parents": [
            "26b680b8-4e09-4fd7-8143-872f4eb46e47",
            "3a8fa0b3-0641-4ecb-aad7-085951ba59df"
        ],
        "children": []
    },
    {
        "id": "e9b2bfa0-9607-4fb5-8ebe-10379a752034",
        "name": "[TEMP] [Main] Parent Process One",
        "type": "process",
        "version": 6,
        "filepath": "TEST SUBFOLDER",
        "parents": [],
        "children": [
            "26b680b8-4e09-4fd7-8143-872f4eb46e47",
            "1d51728d-1417-4e19-a510-71681ee7c3b2"
        ]
    },
    {
        "id": "fb128b14-fcbb-4a3b-a9d7-c466c11cd518",
        "name": "[TEMP] Database V2 Connection",
        "type": "connector-settings",
        "version": 1,
        "filepath": "TEST SUBFOLDER",
        "parents": [
            "26b680b8-4e09-4fd7-8143-872f4eb46e47",
            "3a8fa0b3-0641-4ecb-aad7-085951ba59df"
        ],
        "children": []
    },
    {
        "id": "04b0cc6d-2a36-44a5-8d0f-c8ccf255caf4",
        "name": "Component Reference Testing Map",
        "type": "transform.map",
        "version": 2,
        "filepath": "TEST SUBSUB FOLDER",
        "parents": [
            "26b680b8-4e09-4fd7-8143-872f4eb46e47",
            "e3e4fc78-21bd-49ac-91f3-eaf06d011254"
        ],
        "children": [
            "f3f22476-431b-4e86-a690-fddf33781686"
        ]
    },
    {
        "id": "0e095a54-0662-49ec-b06a-b46dabaad63f",
        "name": "json_profile_in_sub_folder",
        "type": "profile.json",
        "version": 1,
        "filepath": "TEST SUBSUB FOLDER",
        "parents": [
            "5d117b3f-240d-4ba5-8a01-b421b5974158"
        ],
        "children": []
    },
    {
        "id": "1c3be23f-c7ad-406f-877e-80e6f0f463d4",
        "name": "[TEMP] Cross Reference Table",
        "type": "crossref",
        "version": 1,
        "filepath": "TEST SUBSUB FOLDER",
        "parents": [],
        "children": []
    },
    {
        "id": "2754f960-9fa4-46a6-877e-81e0f5f9c666",
        "name": "New PGP Certificate",
        "type": "certificate.pgp",
        "version": 1,
        "filepath": "TEST SUBSUB FOLDER",
        "parents": [],
        "children": []
    },
    {
        "id": "2a1b5cae-4333-4d22-afde-7ce22d9b888e",
        "name": "New Flow Service",
        "type": "flowservice",
        "version": 1,
        "filepath": "TEST SUBSUB FOLDER",
        "parents": [],
        "children": []
    },
    {
        "id": "487cb817-efa4-41ec-867b-006e3ee72863",
        "name": "New Process Property",
        "type": "processproperty",
        "version": 1,
        "filepath": "TEST SUBSUB FOLDER",
        "parents": [],
        "children": []
    },
    {
        "id": "4e396c24-10d9-4cfb-a5a0-a74bb49200f7",
        "name": "New Process Script",
        "type": "script.processing",
        "version": 1,
        "filepath": "TEST SUBSUB FOLDER",
        "parents": [],
        "children": []
    },
    {
        "id": "51872485-5f26-4ca1-99d3-07354ee5f94d",
        "name": "New Custom Library",
        "type": "customlibrary",
        "version": 1,
        "filepath": "TEST SUBSUB FOLDER",
        "parents": [],
        "children": []
    },
    {
        "id": "519b2f35-b55e-44c3-9b41-e585031545da",
        "name": "New Database (Legacy) Profile",
        "type": "profile.db",
        "version": 1,
        "filepath": "TEST SUBSUB FOLDER",
        "parents": [],
        "children": []
    },
    {
        "id": "5bfb845d-96bf-4cc6-bd7e-b4ba97186007",
        "name": "New XML Profile",
        "type": "profile.xml",
        "version": 1,
        "filepath": "TEST SUBSUB FOLDER",
        "parents": [],
        "children": []
    },
    {
        "id": "a148be48-32f2-4ff3-a4bd-d7e200c4dfbb",
        "name": "New XSLT Stylesheet",
        "type": "xslt",
        "version": 1,
        "filepath": "TEST SUBSUB FOLDER",
        "parents": [],
        "children": []
    },
    {
        "id": "a8423230-63ef-420f-b204-927f344564ac",
        "name": "Document Cache",
        "type": "documentcache",
        "version": 1,
        "filepath": "TEST SUBSUB FOLDER",
        "parents": [],
        "children": []
    },
    {
        "id": "aa0313b0-035a-4e9e-a5fe-769b5964c8be",
        "name": "API Service",
        "type": "webservice",
        "version": 1,
        "filepath": "TEST SUBSUB FOLDER",
        "parents": [],
        "children": []
    },
    {
        "id": "b18ab0c2-ae62-4577-a287-71c2fd048d99",
        "name": "New Process Route",
        "type": "processroute",
        "version": 1,
        "filepath": "TEST SUBSUB FOLDER",
        "parents": [],
        "children": []
    },
    {
        "id": "c9eaac72-0e98-48ef-b69d-8b63ce45db2c",
        "name": "API Proxy",
        "type": "webservice.external",
        "version": 1,
        "filepath": "TEST SUBSUB FOLDER",
        "parents": [],
        "children": []
    },
    {
        "id": "d9afee1a-1c78-4f2d-9149-c3684d33ba62",
        "name": "New JSON Profile",
        "type": "profile.json",
        "version": 1,
        "filepath": "TEST SUBSUB FOLDER",
        "parents": [],
        "children": []
    },
    {
        "id": "e0f4b290-7a56-4d1d-a9fc-b75fd00b1858",
        "name": "New Map Script",
        "type": "script.mapping",
        "version": 1,
        "filepath": "TEST SUBSUB FOLDER",
        "parents": [],
        "children": []
    },
    {
        "id": "e9517b83-58a4-40cb-bc63-775e8792f018",
        "name": "New Map Function",
        "type": "transform.function",
        "version": 1,
        "filepath": "TEST SUBSUB FOLDER",
        "parents": [],
        "children": []
    },
    {
        "id": "f3f22476-431b-4e86-a690-fddf33781686",
        "name": "component reference testing flat file",
        "type": "profile.flatfile",
        "version": 2,
        "filepath": "TEST SUBSUB FOLDER",
        "parents": [
            "04b0cc6d-2a36-44a5-8d0f-c8ccf255caf4"
        ],
        "children": []
    },
    {
        "id": "f536eb5b-ec98-47af-82fb-d613acc5802d",
        "name": "New X.509 Certificate",
        "type": "certificate",
        "version": 1,
        "filepath": "TEST SUBSUB FOLDER",
        "parents": [],
        "children": []
    },
    {
        "id": "f9e8d1c1-58e4-4487-a307-e7d6c5372093",
        "name": "New Organization",
        "type": "tporganization",
        "version": 1,
        "filepath": "TEST SUBSUB FOLDER",
        "parents": [],
        "children": []
    },
    {
        "id": "5d117b3f-240d-4ba5-8a01-b421b5974158",
        "name": "map_in_main_folder",
        "type": "transform.map",
        "version": 3,
        "filepath": "Atomsphere API",
        "parents": [
            "e3e4fc78-21bd-49ac-91f3-eaf06d011254"
        ],
        "children": [
            "0e095a54-0662-49ec-b06a-b46dabaad63f"
        ]
    },
    {
        "id": "e3e4fc78-21bd-49ac-91f3-eaf06d011254",
        "name": "[Main] Component Reference Hierarchy Testing",
        "type": "process",
        "version": 5,
        "filepath": "Atomsphere API",
        "parents": [],
        "children": [
            "04b0cc6d-2a36-44a5-8d0f-c8ccf255caf4",
            "5d117b3f-240d-4ba5-8a01-b421b5974158"
        ]
    },
    {
        "id": "1d51728d-1417-4e19-a510-71681ee7c3b2",
        "name": "[sub] Sub Process Three - Outside of Folder",
        "type": "process",
        "version": 1,
        "filepath": "Atomsphere API",
        "parents": [
            "92199af4-6e68-4f74-bbd2-91f58ca024d9",
            "e9b2bfa0-9607-4fb5-8ebe-10379a752034"
        ],
        "children": []
    },
    {
        "id": "92199af4-6e68-4f74-bbd2-91f58ca024d9",
        "name": "[Main] Parent Process Four, outside folder",
        "type": "process",
        "version": 1,
        "filepath": "Atomsphere API",
        "parents": [],
        "children": [
            "1d51728d-1417-4e19-a510-71681ee7c3b2"
        ]
    }
];

// Group mapping for component types
const typeGroups = {
    'Profile': {shape: 'ellipse', color: '#FF6B6B'},
    'Process': {shape: 'rectangle', color: '#4ECDC4'},
    'Connector': {shape: 'roundrectangle', color: '#FFD166'},
    'Connector Operation': {shape: 'rhomboid', color: '#6A0572'},
    'Mapping': {shape: 'barrel', color: '#1A535C'},
    'Document Cache': {shape: 'triangle', color: '#F2B880'},
    'Extended Properties': {shape: 'rectangle', color: '#3D348B'},
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

    // Inside the createGraph function, update the style section:
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

    // Return the cy instance for further manipulation
    return cy;

}
    
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

    console.log("Hello World!");
    console.log(typeof cy.nodes);
    
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



