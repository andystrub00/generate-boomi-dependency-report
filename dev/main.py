from utils.utils import fetch_env_variables, init_runtime_vars

from folder_parsing.folder_parsing import (
    query_initial_folder,
    build_folder_tree,
)
from component_parsing.component_parsing import get_components_in_folder_tree

# TODO - Remove temp_utils
from utils.temp_utils import spoof_command_line_args
import json


def main():

    # Fetch environment variables
    env_vars = fetch_env_variables()

    # Get command line arguments
    # TODO - switch back to normal command line parser
    # args = parse_command_line_args()
    args = spoof_command_line_args(
        folder_name="IAM Integrations", folder_id=None, parse_subfolders=False
    )

    # Initialize dictionary of runtime variablesm including environment variables, command line arguments, and API variables
    runtime_vars = init_runtime_vars(env_vars, args)

    # Query initial folder from Boomi
    initial_folder_response = query_initial_folder(runtime_vars)
    print(f"{initial_folder_response = }")
    # Add the parent folder name and ID to the runtime variables
    runtime_vars["parent_folder_name"] = initial_folder_response["name"]
    runtime_vars["parent_folder_id"] = initial_folder_response["id"]

    # Query all subfolders for the initial folder
    folder_tree = build_folder_tree(runtime_vars, initial_folder_response)

    print(f"{folder_tree = }")

    print(f"{len(folder_tree) = }")
    # folders_with_components = get_components_in_folder_tree(runtime_vars, folder_tree)

    # print(f"{folders_with_components = }")


if __name__ == "__main__":

    main()
