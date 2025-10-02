import sys
from utils.utils import (
    fetch_env_variables,
    init_runtime_vars,
    write_javascript_variable_file,
    generate_simple_component_type,
    parse_command_line_args,
)

from folder_parsing.folder_parsing import (
    query_initial_folder,
    build_folder_tree,
)
from component_parsing.component_parsing import (
    get_components_in_folder_tree,
    get_parent_component_references,
    get_child_component_references,
    run_non_folder_tree_comps_to_ground,
)

from component_parsing.single_component_parser import parse_single_component_parent_info


from utils.component_store import ComponentStore

# TODO - Remove temp_utils
from utils.temp_utils import (
    spoof_command_line_args,
    write_to_debug_log,
)

import time
import json


def folder_query(runtime_vars: dict):
    """
    Query components in a folder tree based on the provided runtime variables.

    Parameters
    ----------
    runtime_vars : dict
        A dictionary containing runtime variables for the query.

    Returns
    -------
    ComponentStore
        A ComponentStore object containing the queried components.
    """
    # Query initial folder from Boomi
    initial_folder_response = query_initial_folder(runtime_vars)

    # Add the parent folder name and ID to the runtime variables
    runtime_vars["parent_folder_name"] = initial_folder_response["name"]
    runtime_vars["parent_folder_id"] = initial_folder_response["id"]

    # Build folder tree from initial folder
    folder_tree = build_folder_tree(runtime_vars, initial_folder_response)

    # Get components in folder tree
    base_component_metadata = get_components_in_folder_tree(runtime_vars, folder_tree)

    # Initialize component store
    component_store = ComponentStore(base_component_metadata)

    # Get parent component references
    parent_component_refs = get_parent_component_references(
        runtime_vars, component_store.get_all_components()
    )

    # Update component store with parent component references
    for child_component_id, parent_component_ids in parent_component_refs.items():
        component_store.update_relationships(
            child_component_id, parent_ids=parent_component_ids
        )

    # Get child component references
    child_component_refs = get_child_component_references(
        runtime_vars, component_store.get_all_components()
    )

    # Update component store with child component references
    for parent_component_id, child_component_ids in child_component_refs.items():
        component_store.update_relationships(
            parent_component_id, child_ids=child_component_ids
        )

    # Get all the components outside of the folder tree that either reference or are referenced by something inside the folder tree
    run_non_folder_tree_comps_to_ground(runtime_vars, component_store)

    return component_store


def main():

    # Get command line arguments
    args = parse_command_line_args()

    """
    args = spoof_command_line_args(
        folder_name="Rothys MDH Demo",
        folder_id=None,
        parse_subfolders=True,
    )
    """

    # Fetch environment variables
    env_vars = fetch_env_variables(env_filename=f"{args.account_name}.env")

    # Initialize dictionary of runtime variablesm including environment variables, command line arguments, and API variables
    runtime_vars = init_runtime_vars(env_vars, args)

    # Check if a single component ID was provided
    if runtime_vars.get("component_id"):
        component_store = parse_single_component_parent_info(runtime_vars)

    else:
        # Perform folder query and get component store
        component_store = folder_query(runtime_vars)

    # Get the final component data from the component store
    all_components = component_store.get_all_components(convert_sets_to_lists=True)

    # Generate simple component types for each component
    for component in all_components:
        component["simple_type"] = generate_simple_component_type(component)

    # Write the final data to the JavaScript file for use in HTML.
    write_javascript_variable_file(
        file_path="docs/data/component_data.js",
        variable_data=all_components,
        variable_name="componentsData",
    )


if __name__ == "__main__":

    start_time = time.time()
    main()

    print(f"--- {time.time() - start_time : .3f} seconds ---")
