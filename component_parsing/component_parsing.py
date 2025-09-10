import json
import requests

from utils.api_utils import (
    build_query_body,
    generate_bulk_get_requests,
    handle_response,
    query_more_endpoint,
)


def get_component_metadata(runtime_vars: dict, component_id: str) -> dict:
    """
    Get component metadata from Boomi based on component ID.

    Parameters
    ----------
    runtime_vars : dict
        Dictionary of runtime variables.
    component_id : str
        Component ID of the component.

    Returns
    -------
    dict
        The component metadata object for this component.
    """

    component_metadata_response = requests.get(
        f"{runtime_vars['base_url']}/ComponentMetadata/{component_id}",
        headers=runtime_vars["headers"],
        auth=runtime_vars["auth_object"],
    )

    component_metadata_response = handle_response(component_metadata_response)

    return component_metadata_response


def query_components_from_folder(runtime_vars: dict, folder_id: str) -> dict:
    """
    Query all components from a folder in Boomi.

    Parameters
    ----------
    runtime_vars : dict
        Dictionary of runtime variables.
    folder_id : str
        ID of the folder.

    Returns
    -------
    dict
        Dictionary of components in the folder.
    """

    component_metadata_query = build_query_body(
        {
            "property": "folderId",
            "operator": "EQUALS",
            "argument": folder_id,
        },
        {"property": "deleted", "operator": "EQUALS", "argument": False},
        {"property": "currentVersion", "operator": "EQUALS", "argument": True},
    )

    component_metadata_response = requests.post(
        f"{runtime_vars['base_url']}/ComponentMetadata/query",
        headers=runtime_vars["headers"],
        auth=runtime_vars["auth_object"],
        data=component_metadata_query,
    )

    all_component_metadata = handle_response(component_metadata_response)

    while "queryToken" in all_component_metadata:
        query_token = all_component_metadata["queryToken"]
        more_components = query_more_endpoint(query_token, "folder", runtime_vars)
        all_component_metadata["result"].extend(more_components["result"])
        if "queryToken" in more_components:
            all_component_metadata["queryToken"] = more_components["queryToken"]
        else:
            del all_component_metadata["queryToken"]

    return all_component_metadata


def get_components_in_folder_tree(runtime_vars: dict, folder_tree: dict) -> list:
    """
    Retrieves components for each folder in the folder tree.
    Parameters
    ----------
    runtime_vars : dict
        A dictionary containing runtime variables needed for querying components.
    folder_tree : dict
        A dictionary representing the folder tree structure, where each folder is expected to have an 'id' key.
    Returns
    -------
    list
        The updated folder tree with components added to each folder under the 'components' key.
    """

    """    
    for folder in folder_tree:
        folder["components"] = query_components_from_folder(
            runtime_vars, folder["id"]
        ).get("result", [])
    """

    components = []
    for folder in folder_tree:
        components.extend(
            query_components_from_folder(runtime_vars, folder["id"]).get("result", [])
        )

    return components


def parse_component_references_bulk_response(component_refs: list[dict]) -> dict:
    """
    Parse the response from the component references API endpoint.

    Parameters
    ----------
    component_refs : list of dict
        A list of component reference objects.

    Returns
    -------
    dict
        A dict of parsed component reference objects, with the form {component_id: [parent_component_id_1, parent_component_id_2]}.
    """

    parsed_component_refs = {}

    for bulk_response in component_refs:
        if bulk_response.get("statusCode") == 200:
            for component_ref in bulk_response.get("Result", {}).get("references", []):
                child_component_id = component_ref.get("componentId")
                parent_component_id = component_ref.get("parentComponentId")
                parsed_component_refs.setdefault(child_component_id, set()).add(
                    parent_component_id
                )

    return parsed_component_refs


def get_parent_component_references(
    runtime_vars: dict, child_components: list[dict]
) -> dict:
    """
    Query parent component references for a list of child component IDs.

    Parameters
    ----------
    runtime_vars : dict
        Dictionary of runtime variables.
    child_components : list[dict]
        List of child component objects.

    Returns
    -------
    list
        List of component reference objects
    """

    # Get a list of only the component IDs from the child components
    child_component_ids = [
        child_comp.get("componentId") for child_comp in child_components
    ]

    # Generate bulk GET requests for the parent component references
    parent_component_references_get_requests = generate_bulk_get_requests(
        child_component_ids
    )

    all_parent_component_references = []

    for single_get_request in parent_component_references_get_requests:

        parent_component_references_response = requests.post(
            f"{runtime_vars['base_url']}/ComponentReference/bulk",
            headers=runtime_vars["headers"],
            auth=runtime_vars["auth_object"],
            data=json.dumps(single_get_request),
        )

        all_parent_component_references.extend(
            handle_response(parent_component_references_response).get("response", [])
        )

    return parse_component_references_bulk_response(all_parent_component_references)


def parse_component_references_query_responses(component_refs: list[dict]) -> dict:
    """
    Parse the response from the component references query API endpoint.

    Parameters
    ----------
    component_refs : list of dict
        A list of component reference objects.

    Returns
    -------
    dict
        A dict of parsed component reference objects, with the form {parent_component_id: [child_component_id_1, child_component_id_2]}.
    """

    parsed_component_refs = {}

    for query_response in component_refs:
        # Add the child component ID to the list of the corresponding parent component ID
        parsed_component_refs.setdefault(
            query_response.get("parentComponentId"), []
        ).append(query_response.get("componentId"))

    return parsed_component_refs


def get_child_component_references(
    runtime_vars: dict, parent_components: list[dict]
) -> list:
    """
    Query child component references

    Parameters
    ----------
    runtime_vars : dict
        Dictionary of runtime variables.
    parent_components : list[dict]
        List of parent component objects.

    Returns
    -------
    list
        List of component reference objects
    """

    all_component_references = []

    for parent_component in parent_components:

        if parent_component.get("containsMetadata") == False:
            continue

        parent_component_id = parent_component.get("componentId")
        parent_component_version = parent_component.get("version")

        query_body = build_query_body(
            {
                "property": "parentComponentId",
                "operator": "EQUALS",
                "argument": parent_component_id,
            },
            {
                "property": "parentVersion",
                "operator": "EQUALS",
                "argument": parent_component_version,
            },
        )

        component_references_response = requests.post(
            f"{runtime_vars['base_url']}/ComponentReference/query",
            headers=runtime_vars["headers"],
            auth=runtime_vars["auth_object"],
            data=query_body,
        )

        component_references_response = handle_response(component_references_response)

        while "queryToken" in component_references_response:
            query_token = component_references_response["queryToken"]
            more_component_refs = query_more_endpoint(
                query_token, "ComponentReference", runtime_vars
            )
            component_references_response["result"].extend(
                more_component_refs["result"]
            )
            if "queryToken" in more_component_refs:
                component_references_response["queryToken"] = more_component_refs[
                    "queryToken"
                ]
            else:
                del component_references_response["queryToken"]

        if component_references_response.get("numberOfResults") > 0:
            for component_reference in component_references_response.get("result", []):
                all_component_references.extend(
                    component_reference.get("references", [])
                )

    return parse_component_references_query_responses(all_component_references)


def get_metadata_and_parents_of_components(
    runtime_vars: dict,
    components: list[dict],
) -> tuple[list[dict]]:
    """
    Retrieve metadata and parent references for a list of components.
    Parameters
    ----------
    runtime_vars : dict
        A dictionary containing runtime variables needed for fetching metadata.
    components : list of dict
        A list of dictionaries, each containing component information, including 'componentId'.

    Returns
    ----------
    tuple of list of dict
        A tuple containing two lists:
        - The first list contains metadata for each component.
        - The second list contains parent component references for each component.
    """
    # Fetch metadata for each component
    # Fetch parent references for each component based on their metadata

    all_comp_metadata = [
        get_component_metadata(runtime_vars, comp.get("componentId"))
        for comp in components
    ]

    all_comp_parents = get_parent_component_references(runtime_vars, all_comp_metadata)

    return all_comp_metadata, all_comp_parents


def run_non_folder_tree_comps_to_ground(runtime_vars: dict, component_store) -> None:
    """
    Process non-folder tree components to retrieve their metadata and parent relationships,
    and update the component store accordingly.

    Parameters
    ----------
    runtime_vars : dict
        Dictionary of runtime variables needed for API requests.
    component_store : ComponentStore
        An instance of the ComponentStore class that manages the storage and retrieval of component data.

    Returns
    -------
    None
    """

    # Flag to check if there are non-folder tree components left to process
    non_folder_tree_comps_exist = True

    while non_folder_tree_comps_exist:
        # Retrieve components without metadata from the component store
        non_folder_tree_comps = component_store.get_without_metadata()

        # If no components are left, exit the loop
        if len(non_folder_tree_comps) == 0:
            non_folder_tree_comps_exist = False
            break

        # Get metadata and parent references for the non-folder tree components
        non_folder_tree_metadata, non_folder_tree_parents = (
            get_metadata_and_parents_of_components(runtime_vars, non_folder_tree_comps)
        )

        # Update the component store with the retrieved metadata
        for comp_metadata in non_folder_tree_metadata:
            component_store.update_component_metadata(comp_metadata)

        # Update the component store with the parent-child relationships
        for parent_comp_id, child_comp_ids in non_folder_tree_parents.items():
            component_store.update_relationships(parent_comp_id, child_comp_ids)


def run_non_folder_tree_comps_to_n_nodes(runtime_vars: dict, component_store) -> None:
    """
    Process non-folder tree components to retrieve their metadata and parent relationships,
    and update the component store accordingly.

    Parameters
    ----------
    runtime_vars : dict
        Dictionary of runtime variables needed for API requests.
    component_store : ComponentStore
        An instance of the ComponentStore class that manages the storage and retrieval of component data.

    Returns
    -------
    None
    """

    # Flag to check if there are non-folder tree components left to process
    non_folder_tree_comps_exist = True
    leaves_to_parse = runtime_vars["nodes_to_process"] - 1

    while non_folder_tree_comps_exist and leaves_to_parse > 0:

        # Retrieve components without metadata from the component store
        non_folder_tree_comps = component_store.get_without_metadata()

        # If no components are left, exit the loop
        if len(non_folder_tree_comps) == 0:
            non_folder_tree_comps_exist = False
            break

        # Get metadata and parent references for the non-folder tree components
        non_folder_tree_metadata, non_folder_tree_parents = (
            get_metadata_and_parents_of_components(runtime_vars, non_folder_tree_comps)
        )

        # Update the component store with the retrieved metadata
        for comp_metadata in non_folder_tree_metadata:
            component_store.update_component_metadata(comp_metadata)

        # Update the component store with the parent-child relationships
        for parent_comp_id, child_comp_ids in non_folder_tree_parents.items():
            component_store.update_relationships(parent_comp_id, child_comp_ids)

        # Decrement the leaves_to_parse counter
        leaves_to_parse -= 1

    # Retrieve components without metadata from the component store
    non_folder_tree_comps = component_store.get_without_metadata()

    # If no components are left, exit the loop
    if len(non_folder_tree_comps) != 0:
        # Get metadata and parent references for the non-folder tree components
        non_folder_tree_metadata, non_folder_tree_parents = (
            get_metadata_and_parents_of_components(runtime_vars, non_folder_tree_comps)
        )

        # Update the component store with the retrieved metadata
        for comp_metadata in non_folder_tree_metadata:
            component_store.update_component_metadata(comp_metadata)
