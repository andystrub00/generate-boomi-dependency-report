class ComponentStore:
    def __init__(self, component_list):
        # Primary storage by componentId
        self.components_by_id = {}

        # Indices for fast lookups (store component IDs, not objects)
        self.components_by_parent_id = {}  # parent_id -> set of component IDs
        self.components_by_child_id = {}  # child_id -> set of component IDs
        self.components_by_folder_id = {}  # folder_id -> set of component IDs

        # Initialize with components
        for component in component_list:
            component["containsMetadata"] = True
            self.add_component(component)

    def add_component(self, component):
        """Add a new component to the store"""
        component_id = component["componentId"]

        # Skip if this component is already in the store
        if component_id in self.components_by_id:
            return self.components_by_id[component_id]

        # Create a copy and initialize relationship sets if not present
        component_copy = component.copy()

        # Add containsMetadata flag
        if "containsMetadata" not in component_copy:
            # For existing components from the input list, assume they have metadata
            component_copy["containsMetadata"] = False

        if "parentComponentIds" not in component_copy:
            component_copy["parentComponentIds"] = set()
        elif isinstance(component_copy["parentComponentIds"], list):
            component_copy["parentComponentIds"] = set(
                component_copy["parentComponentIds"]
            )

        if "childComponentIds" not in component_copy:
            component_copy["childComponentIds"] = set()
        elif isinstance(component_copy["childComponentIds"], list):
            component_copy["childComponentIds"] = set(
                component_copy["childComponentIds"]
            )

        # Store in primary map
        self.components_by_id[component_id] = component_copy

        # Index by folder
        folder_id = component.get("folderId")
        if folder_id:
            if folder_id not in self.components_by_folder_id:
                self.components_by_folder_id[folder_id] = set()
            self.components_by_folder_id[folder_id].add(component_id)

        return component_copy

    def create_placeholder_component(self, component_id):
        """Create a minimal component with the given ID if it doesn't exist"""
        if component_id in self.components_by_id:
            return self.components_by_id[component_id]

        # Create a minimal component with the necessary fields
        placeholder = {
            "componentId": component_id,
            "parentComponentIds": set(),
            "childComponentIds": set(),
            "containsMetadata": False,  # Flag indicating this is just a placeholder
        }

        return self.add_component(placeholder)

    def update_relationships(self, component_id, parent_ids=None, child_ids=None):
        """Update a component's parent and child relationships, creating components if needed"""
        # Create the component if it doesn't exist
        if component_id not in self.components_by_id:
            self.create_placeholder_component(component_id)

        component = self.components_by_id[component_id]

        # Update parent relationships
        if parent_ids:
            for parent_id in parent_ids:
                # Create parent component if it doesn't exist
                if parent_id not in self.components_by_id:
                    self.create_placeholder_component(parent_id)

                # Add parent to component
                component["parentComponentIds"].add(parent_id)

                # Update index
                if parent_id not in self.components_by_parent_id:
                    self.components_by_parent_id[parent_id] = set()
                self.components_by_parent_id[parent_id].add(component_id)

                # Update reverse relationship
                parent = self.components_by_id[parent_id]
                parent["childComponentIds"].add(component_id)

                # Update child index
                if component_id not in self.components_by_child_id:
                    self.components_by_child_id[component_id] = set()
                self.components_by_child_id[component_id].add(parent_id)

        # Update child relationships
        if child_ids:
            for child_id in child_ids:
                # Create child component if it doesn't exist
                if child_id not in self.components_by_id:
                    self.create_placeholder_component(child_id)

                # Add child to component
                component["childComponentIds"].add(child_id)

                # Update index
                if child_id not in self.components_by_child_id:
                    self.components_by_child_id[child_id] = set()
                self.components_by_child_id[child_id].add(component_id)

                # Update reverse relationship
                child = self.components_by_id[child_id]
                child["parentComponentIds"].add(component_id)

                # Update parent index
                if component_id not in self.components_by_parent_id:
                    self.components_by_parent_id[component_id] = set()
                self.components_by_parent_id[component_id].add(child_id)

        return True

    def update_component_metadata(self, component):
        """Update a component with full metadata"""
        component_id = component["componentId"]

        # Create or retrieve the component
        existing = self.components_by_id.get(component_id)

        if existing:
            # Preserve relationships
            parent_ids = existing.get("parentComponentIds", set())
            child_ids = existing.get("childComponentIds", set())

            # Update with new data
            updated_component = component.copy()

            # Ensure sets for relationships
            if "parentComponentIds" not in updated_component:
                updated_component["parentComponentIds"] = parent_ids
            elif isinstance(updated_component["parentComponentIds"], list):
                updated_component["parentComponentIds"] = set(
                    updated_component["parentComponentIds"]
                )
                updated_component["parentComponentIds"].update(parent_ids)

            if "childComponentIds" not in updated_component:
                updated_component["childComponentIds"] = child_ids
            elif isinstance(updated_component["childComponentIds"], list):
                updated_component["childComponentIds"] = set(
                    updated_component["childComponentIds"]
                )
                updated_component["childComponentIds"].update(child_ids)

            # Mark as containing metadata
            updated_component["containsMetadata"] = True

            # Update in store
            self.components_by_id[component_id] = updated_component

            # Update folder index if needed
            folder_id = updated_component.get("folderId")
            if folder_id:
                if folder_id not in self.components_by_folder_id:
                    self.components_by_folder_id[folder_id] = set()
                self.components_by_folder_id[folder_id].add(component_id)

            return updated_component
        else:
            # Add as new component
            component_copy = component.copy()
            component_copy["containsMetadata"] = True
            return self.add_component(component_copy)

    # Fast lookup methods
    def get_by_id(self, component_id):
        """Get a component by ID"""
        return self.components_by_id.get(component_id)

    def get_by_parent_id(self, parent_id):
        """Get all components that have the given parent"""
        component_ids = self.components_by_parent_id.get(parent_id, set())
        return [
            self.components_by_id[cid]
            for cid in component_ids
            if cid in self.components_by_id
        ]

    def get_by_child_id(self, child_id):
        """Get all components that have the given child"""
        component_ids = self.components_by_child_id.get(child_id, set())
        return [
            self.components_by_id[cid]
            for cid in component_ids
            if cid in self.components_by_id
        ]

    def get_by_folder_id(self, folder_id):
        """Get all components in the given folder"""
        component_ids = self.components_by_folder_id.get(folder_id, set())
        return [
            self.components_by_id[cid]
            for cid in component_ids
            if cid in self.components_by_id
        ]

    def get_without_metadata(self):
        """Get all components with containsMetadata = False"""
        return [
            component
            for component in self.components_by_id.values()
            if not component.get("containsMetadata", True)
        ]

    def get_all_components(self):
        """Get all components"""
        return list(self.components_by_id.values())

    def convert_sets_to_lists(self):
        """Convert all sets to lists for JSON serialization"""
        result = []
        for component in self.components_by_id.values():
            component_copy = component.copy()
            if isinstance(component_copy["parentComponentIds"], set):
                component_copy["parentComponentIds"] = list(
                    component_copy["parentComponentIds"]
                )
            if isinstance(component_copy["childComponentIds"], set):
                component_copy["childComponentIds"] = list(
                    component_copy["childComponentIds"]
                )
            result.append(component_copy)
        return result
