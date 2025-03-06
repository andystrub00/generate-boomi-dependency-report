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


'''
def build_folder_tree(
    runtime_vars: dict,
    folder_name: str,
    folder_id: str,
    tree: dict = None,
    processed_ids: set = None,
):
    """
    Recursively build a tree structure by querying the API for subfolders
    and processing each subfolder.

    Args:
        folder_name (str): Name of the current folder
        folder_id (str): ID of the current folder
        tree (dict, optional): Current tree structure being built
        processed_ids (set, optional): Set of already processed folder IDs to avoid cycles

    Returns:
        dict: Tree structure with nested subfolders
    """
    # Initialize data structures on first call
    if tree is None:
        tree = {"name": folder_name, "id": folder_id, "subfolders": []}

    if processed_ids is None:
        processed_ids = set()

    # Avoid processing the same folder twice (prevents infinite loops in case of circular references)
    if folder_id in processed_ids:
        return tree

    # Query API for subfolders
    subfolders = query_subfolders(runtime_vars, folder_name).get("result", [])

    processed_ids.add(folder_id)

    # Filter subfolders to only those with matching parent_id
    filtered_subfolders = [sf for sf in subfolders if sf.get("parentId") == folder_id]

    # Process each subfolder recursively
    for subfolder in filtered_subfolders:
        subfolder_name = subfolder["name"]
        subfolder_id = subfolder["id"]

        # Create subfolder node
        subfolder_node = {"name": subfolder_name, "id": subfolder_id, "subfolders": []}

        # Add to tree
        tree["subfolders"].append(subfolder_node)

        # Recursively process this subfolder
        if runtime_vars["parse_subfolders"]:
            build_folder_tree(
                runtime_vars,
                subfolder_name,
                subfolder_id,
                subfolder_node,
                processed_ids,
            )

    return tree

'''


def iterate_folder_tree_depth_first(folder_tree, callback_fn=None):
    """
    Iterate through all folders in the tree using depth-first traversal.

    Args:
        folder_tree (dict): The folder tree structure
        callback_fn (callable, optional): A function to call on each folder
            The callback receives the current folder dict as its argument

    Returns:
        list: All folders in the tree (flattened)
    """
    all_folders = []

    # Process the current folder
    all_folders.append(folder_tree)
    if callback_fn:
        callback_fn(folder_tree)

    # Process all subfolders recursively
    for subfolder in folder_tree.get("subfolders", []):
        subfolder_results = iterate_folder_tree_depth_first(subfolder, callback_fn)
        all_folders.extend(subfolder_results)

    return all_folders


def build_folder_tree(runtime_vars, root_folder):

    # Initialize result list and tracking sets
    all_folders = [root_folder]
    processed_ids = set()

    # TODO - check runtime vars to see if children should be parsed.
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

    # Begin recursive processing
    process_folder(
        runtime_vars,
        runtime_vars["parent_folder_name"],
        runtime_vars["parent_folder_id"],
    )

    return all_folders
