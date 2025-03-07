from typing import Optional


class ComponentStore:
    """
    A storage class for managing components and their relationships efficiently.

    Parameters
    ----------
    component_list : list of dict
        A list of component dictionaries to initialize the store.
    """

    def __init__(self, component_list: list[dict]):
        """
        Initialize the ComponentStore with a list of components.

        Parameters
        ----------
        component_list : list of dict
            A list of components where each component is a dictionary.
        """
        self.components_by_id = {}
        self.components_by_parent_id = {}  # parent_id -> list of component objects
        self.components_by_child_id = {}  # child_id -> list of component objects
        self.components_by_folder_id = {}  # folder_id -> list of component objects

        for component in component_list:
            self.add_component(component)

    def add_component(self, component: dict):
        """
        Add a new component to the store.

        Parameters
        ----------
        component : dict
            A dictionary representing a component with at least a 'componentId' key.
        """
        component_id = component["componentId"]
        component_copy = component.copy()
        component_copy.setdefault("parentComponentIds", [])
        component_copy.setdefault("childComponentIds", [])

        self.components_by_id[component_id] = component_copy

        folder_id = component.get("folderId")
        if folder_id:
            self.components_by_folder_id.setdefault(folder_id, []).append(
                component_copy
            )

    def update_relationships(
        self,
        component_id: str,
        parent_ids: list[str] = None,
        child_ids: list[str] = None,
    ) -> bool:
        """
        Update a component's parent and child relationships.

        Parameters
        ----------
        component_id : str
            The ID of the component to update.
        parent_ids : list of str, optional
            A list of parent component IDs to associate.
        child_ids : list of str, optional
            A list of child component IDs to associate.

        Returns
        -------
        bool
            True if the update was successful, False if the component was not found.
        """
        if component_id not in self.components_by_id:
            return False

        component = self.components_by_id[component_id]

        if parent_ids:
            for parent_id in parent_ids:
                if parent_id in component["parentComponentIds"]:
                    continue
                component["parentComponentIds"].append(parent_id)
                self.components_by_parent_id.setdefault(parent_id, []).append(component)

                if parent_id in self.components_by_id:
                    parent = self.components_by_id[parent_id]
                    if component_id not in parent["childComponentIds"]:
                        parent["childComponentIds"].append(component_id)
                        self.components_by_child_id.setdefault(component_id, []).append(
                            parent
                        )

        if child_ids:
            for child_id in child_ids:
                if child_id in component["childComponentIds"]:
                    continue
                component["childComponentIds"].append(child_id)
                self.components_by_child_id.setdefault(child_id, []).append(component)

                if child_id in self.components_by_id:
                    child = self.components_by_id[child_id]
                    if component_id not in child["parentComponentIds"]:
                        child["parentComponentIds"].append(component_id)
                        self.components_by_parent_id.setdefault(
                            component_id, []
                        ).append(child)

        return True

    def get_by_id(self, component_id: str) -> Optional[dict]:
        """
        Retrieve a component by its ID.

        Parameters
        ----------
        component_id : str
            The ID of the component to retrieve.

        Returns
        -------
        dict or None
            The component dictionary if found, otherwise None.
        """
        return self.components_by_id.get(component_id)

    def get_by_parent_id(self, parent_id: str) -> Optional[list[dict]]:
        """
        Retrieve all components that have the given parent ID.

        Parameters
        ----------
        parent_id : str
            The parent component ID to search for.

        Returns
        -------
        list of dict
            A list of component dictionaries.
        """
        return self.components_by_parent_id.get(parent_id, [])

    def get_by_child_id(self, child_id: str) -> Optional[list[dict]]:
        """
        Retrieve all components that have the given child ID.

        Parameters
        ----------
        child_id : str
            The child component ID to search for.

        Returns
        -------
        list of dict
            A list of component dictionaries.
        """
        return self.components_by_child_id.get(child_id, [])

    def get_by_folder_id(self, folder_id: str) -> Optional[list[dict]]:
        """
        Retrieve all components in the given folder.

        Parameters
        ----------
        folder_id : str
            The folder ID to search for.

        Returns
        -------
        list of dict
            A list of component dictionaries.
        """
        return self.components_by_folder_id.get(folder_id, [])

    def get_all_components(self) -> list[dict]:
        """
        Retrieve all components stored.

        Returns
        -------
        list of dict
            A list of all component dictionaries.
        """
        return list(self.components_by_id.values())
