from utils.utils import fetch_env_variables, init_runtime_vars

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

    # TODO - Remove Logging
    write_to_debug_log(
        json.dumps(
            component_store.get_all_components(convert_sets_to_lists=True), indent=4
        ),
        debug_log_filename="final_component_store",
        debug_log_suffix=".json",
    )

    final_export = []
    all_comps = component_store.get_all_components(convert_sets_to_lists=True)
    for comp in all_comps:
        final_export.append(
            {
                "id": comp.get("componentId"),
                "name": comp.get("name"),
                "type": comp.get("type"),
                "version": comp.get("version"),
                "filepath": comp.get("folderName"),
                "parents": comp.get("parentComponentIds"),
                "children": comp.get("childComponentIds"),
            }
        )

    with open("temp_output.json", "w") as outfile:
        outfile.write(json.dumps(final_export, indent=4))


if __name__ == "__main__":

    main()
