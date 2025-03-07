import json
import requests
from utils.api_utils import (
    build_query_body,
    generate_bulk_get_requests,
    handle_response,
    query_more_endpoint,
)


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


def get_parent_component_references(
    runtime_vars: dict, child_components: list[dict]
) -> list:
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

    return parse_component_references_response(all_parent_component_references)


def parse_component_references_response(component_refs: list[dict]) -> dict:
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

        all_component_references.append(component_references_response.get("result", []))

    return all_component_references
