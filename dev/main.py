from utils.utils import fetch_env_variables, init_runtime_vars

from folder_parsing.folder_parsing import (
    query_initial_folder,
    build_folder_tree,
)
from component_parsing.component_parsing import (
    get_components_in_folder_tree,
    get_parent_component_references,
    get_child_component_references,
)


from utils.component_store import ComponentStore

# TODO - Remove temp_utils
from utils.temp_utils import (
    spoof_command_line_args,
    write_to_debug_log,
)
import json


def main():

    # Fetch environment variables
    env_vars = fetch_env_variables()

    # Get command line arguments
    # TODO - switch back to normal command line parser
    # args = parse_command_line_args()
    args = spoof_command_line_args(
        folder_name="TEST SUBFOLDER", folder_id=None, parse_subfolders=True
    )

    # Initialize dictionary of runtime variablesm including environment variables, command line arguments, and API variables
    runtime_vars = init_runtime_vars(env_vars, args)

    # Query initial folder from Boomi
    initial_folder_response = query_initial_folder(runtime_vars)

    # Add the parent folder name and ID to the runtime variables
    runtime_vars["parent_folder_name"] = initial_folder_response["name"]
    runtime_vars["parent_folder_id"] = initial_folder_response["id"]

    # Build folder tree from initial folder
    folder_tree = build_folder_tree(runtime_vars, initial_folder_response)

    # Get components in folder tree
    component_refs = get_components_in_folder_tree(runtime_vars, folder_tree)

    # Initialize component store
    component_store = ComponentStore(component_refs)

    # Get parent component references
    parent_component_refs = get_parent_component_references(
        runtime_vars, component_store.get_all_components()
    )

    # Update component store with parent component references
    for child_component_id, parent_component_ids in parent_component_refs.items():
        component_store.update_relationships(
            child_component_id, parent_ids=parent_component_ids
        )

    # Write components to debug log
    # TODO - Remove this logging
    write_to_debug_log(
        json.dumps(component_store.convert_sets_to_lists(), indent=4),
        debug_log_filename="component_store_post_parent_refs",
        debug_log_suffix=".json",
    )

    child_component_refs = get_child_component_references(
        runtime_vars, component_store.get_all_components()
    )

    print(f"{child_component_refs=}")

    # Write components to debug log
    # TODO - Remove this logging
    write_to_debug_log(
        json.dumps(child_component_refs, indent=4),
        debug_log_filename="child_component_refs",
        debug_log_suffix=".json",
    )


if __name__ == "__main__":

    main()
