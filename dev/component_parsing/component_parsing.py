import requests
from utils.api_utils import build_query_body, handle_response, query_more_endpoint
from folder_parsing.folder_parsing import iterate_folder_tree_depth_first


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

    flattened_folder_structure = iterate_folder_tree_depth_first(folder_tree)

    for folder in flattened_folder_structure:
        folder["components"] = query_components_from_folder(runtime_vars, folder["id"])

    return flattened_folder_structure
