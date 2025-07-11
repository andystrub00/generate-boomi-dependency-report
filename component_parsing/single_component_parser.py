from component_parsing.component_parsing import (
    get_component_metadata,
    get_parent_component_references,
    run_non_folder_tree_comps_to_ground,
)
from utils.component_store import ComponentStore


def parse_single_component_parent_info(runtime_vars: dict):

    # Get initial component metadata
    initial_component_metadata = get_component_metadata(
        runtime_vars, runtime_vars["component_id"]
    )

    component_store = ComponentStore([initial_component_metadata])

    # for generation in range(runtime_vars['nodes_to_process']):

    # Get parent component references
    parent_component_refs = get_parent_component_references(
        runtime_vars, component_store.get_all_components()
    )

    # Update component store with parent component references
    for child_component_id, parent_component_ids in parent_component_refs.items():
        component_store.update_relationships(
            child_component_id, parent_ids=parent_component_ids
        )

    # Get all the components outside of the folder tree that either reference or are referenced by something inside the folder tree
    run_non_folder_tree_comps_to_ground(runtime_vars, component_store)

    return component_store
