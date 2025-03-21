import sys
import requests
from utils.api_utils import build_query_body, handle_response, query_more_endpoint


def query_initial_folder(runtime_vars: dict):

    if runtime_vars["folder_id"] is not None:
        initial_folder_query_property = "id"
        initial_folder_query_argument = runtime_vars["folder_id"]
    else:
        initial_folder_query_property = "name"
        initial_folder_query_argument = runtime_vars["folder_name"]

    initial_folder_query = build_query_body(
        {
            "property": initial_folder_query_property,
            "operator": "EQUALS",
            "argument": initial_folder_query_argument,
        },
        {"property": "deleted", "operator": "EQUALS", "argument": False},
    )

    initial_folder_response = requests.post(
        f"{runtime_vars['base_url']}/Folder/query",
        headers=runtime_vars["headers"],
        auth=runtime_vars["auth_object"],
        data=initial_folder_query,
    )

    matching_folders = handle_response(initial_folder_response)

    if matching_folders.get("numberOfResults") == 0:
        print(
            "Error: No folders found matching the specified criteria. Please check your parameters and try again."
        )
        sys.exit(1)
    elif matching_folders.get("numberOfResults") > 1:
        print(
            f"Error: {matching_folders.get('numberOfResults')} folders found matching the specified criteria. Please refine your search by passing a Folder ID with -i or --folder_id."
        )
        sys.exit(1)
    else:
        return matching_folders.get("result")[0]


def query_subfolders(runtime_vars: dict, parent_folder_name: str) -> dict:
    """
    Queries the API for subfolders of a given parent folder.

    Parameters
    ----------
    runtime_vars : dict
        Dictionary containing reusable runtime variables.
    parent_folder_name : str
        The name of the parent folder to query subfolders from.

    Returns
    -------
    dict
        Dictionary containing the API response with subfolder details.
    """

    subfolder_query = build_query_body(
        {
            "property": "parentName",
            "operator": "EQUALS",
            "argument": parent_folder_name,
        },
        {"property": "deleted", "operator": "EQUALS", "argument": False},
    )

    subfolder_response = requests.post(
        f"{runtime_vars['base_url']}/Folder/query",
        headers=runtime_vars["headers"],
        auth=runtime_vars["auth_object"],
        data=subfolder_query,
    )

    all_subfolders = handle_response(subfolder_response)

    while "queryToken" in all_subfolders:
        query_token = all_subfolders["queryToken"]
        more_subfolders = query_more_endpoint(query_token, "folder", runtime_vars)
        all_subfolders["result"].extend(more_subfolders["result"])
        if "queryToken" in more_subfolders:
            all_subfolders["queryToken"] = more_subfolders["queryToken"]
        else:
            del all_subfolders["queryToken"]

    return all_subfolders


def build_folder_tree(runtime_vars: dict, root_folder: dict) -> list:
    """
    Gets all folders from a parent folder, returning a list of Atomsphere API Folder Objects.

    Parameters
    ----------
    runtime_vars : dict
        dictionary containing reusable runtime varibalbes
    root_folder : dict
        the root folder to query from

    Returns
    -------
    list
        list of all folders found in the parent folder
    """

    # Initialize result list and tracking sets
    all_folders = [root_folder]
    processed_ids = set()

    # Define recursive helper function
    def process_folder(runtime_vars, folder_name, folder_id):
        # Skip if already processed
        if folder_id in processed_ids:
            return

        # Mark as processed
        processed_ids.add(folder_id)

        # Query API for subfolders
        subfolders = query_subfolders(runtime_vars, folder_name).get("result", [])

        # Filter out subfolders with different parent ID
        filtered_subfolders = [
            sf for sf in subfolders if sf.get("parentId") == folder_id
        ]

        # Add all filtered subfolders to our result list
        all_folders.extend(filtered_subfolders)

        # Process each subfolder recursively
        for subfolder in filtered_subfolders:
            subfolder_name = subfolder["name"]
            subfolder_id = subfolder["id"]
            process_folder(runtime_vars, subfolder_name, subfolder_id)

    # Check if we should parse subfolders
    if runtime_vars["parse_subfolders"]:
        # Begin recursive processing
        process_folder(
            runtime_vars,
            runtime_vars["parent_folder_name"],
            runtime_vars["parent_folder_id"],
        )

    return all_folders
