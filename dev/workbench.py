import os
import json
from utils.temp_utils import write_to_debug_log
from utils.component_store import ComponentStore

from utils.utils import fetch_env_variables, init_runtime_vars

from folder_parsing.folder_parsing import (
    query_initial_folder,
    build_folder_tree,
)
from component_parsing.component_parsing import (
    get_components_in_folder_tree,
    get_parent_component_references,
)

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

    component_store = ComponentStore(component_refs)

    write_to_debug_log(
        json.dumps(component_store.get_all_components(), indent=4),
        debug_log_filename="component_store",
        debug_log_suffix=".json",
    )


if __name__ == "__main__":
    main()
