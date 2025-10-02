import os
import json
import argparse
from dotenv import dotenv_values
from utils.api_utils import init_global_api_vars


def fetch_env_variables(env_filename=".env", env_path=None):
    """
    Load environment variables from a specified .env file.

    Parameters
    ----------
    env_filename : str, optional
        The name of the .env file (default is ".env").
    env_path : str, optional
        The full path to the .env file. If None, the function constructs the path
        based on the directory structure.

    Returns
    -------
    dict
        A dictionary containing the environment variables from the .env file.

    Notes
    -----
    - If `env_path` is not provided, the function assumes the .env file is
      located in the "env" directory at the root of the project.
    - The `dotenv_values` function from the `dotenv` module is used to load the
      environment variables.
    """

    if env_path is None:
        # Determine the base directory of the project (assumes two levels up from this script)
        base_dir = os.path.dirname(
            os.path.dirname(os.path.realpath(__file__))
        )  # Gets the project's root directory

        # Construct the default path to the .env file
        env_path = os.path.join(base_dir, "env", env_filename)

    # Load and return environment variables as a dictionary
    return dotenv_values(env_path)


def parse_command_line_args():
    """
    Parses command-line arguments for folder processing.

    Arguments:
    -a, --account_name: Optional; Boomi account nickname which will be appended to the .env filename,
                            e.g -a younglife will look for env vars in younglife.env
    -f, --folder_name: Optional; Name of the folder.
    -i, --folder_id: Optional; ID of the folder.
    -p, --parse_subfolders: Optional; Boolean flag to determine if subfolders should be parsed (default: True).
    -c, --component_id: Optional, ID of a specific component to process.
    -n, --nodes_to_process: Optional, Number of nodes above the component to process, pass 0 to parse entire tree (default: 0)

    Returns:
    argparse.Namespace: Parsed arguments.
    """
    parser = argparse.ArgumentParser(description="Process folder information.")
    parser.add_argument(
        "-a",
        "--account_name",
        type=str,
        default="",
        help="Boomi account name for env file, e.g -a argano will look for argano.env",
    )
    parser.add_argument("-f", "--folder_name", type=str, help="Name of the folder")
    parser.add_argument("-i", "--folder_id", type=str, help="ID of the folder")
    parser.add_argument(
        "-p",
        "--parse_subfolders",
        type=bool,
        nargs="?",  # Allows an optional argument with no value, defaulting to the `const` value if provided
        const=True,  # Sets the value to True if the argument is provided without an explicit value
        default=True,  # Defaults to True if the argument is not provided
        help="Whether to parse subfolders (default: True)",
    )
    parser.add_argument(
        "-c", "--component_id", type=str, help="ID of a specific component to process."
    )
    parser.add_argument(
        "-n",
        "--nodes_to_process",
        type=int,
        default=0,
        help="Number of nodes above the component to process, pass 0 to parse entire tree (default: 0)",
    )

    args = parser.parse_args()

    if not args.folder_name and not args.folder_id and not args.component_id:
        parser.error(
            "At least one of --folder_name, --folder_id or --component_id must be provided."
        )

    elif (args.folder_name or args.folder_id) and args.component_id:
        parser.error(
            "If --folder_name or --folder_id is provided, --component_id cannot be used."
        )

    return args


def init_runtime_vars(env_vars: dict, args: argparse.Namespace) -> dict:
    """
    Initialize runtime variables by combining environment variables, command line arguments, and API vars.

    Parameters
    ----------
    env_vars : dict
        Environment variables.
    args : argparse.Namespace
        Command-line arguments.

    Returns
    -------
    dict
        Runtime variables.
    """
    # Initialize global API variables
    api_vars = init_global_api_vars(env_vars)

    runtime_vars = {}

    for env_key, env_val in env_vars.items():
        runtime_vars[env_key] = env_val

    for arg_key, arg_val in vars(args).items():
        runtime_vars[arg_key] = arg_val

    for api_key, api_val in api_vars.items():
        runtime_vars[api_key] = api_val

    return runtime_vars


def write_javascript_variable_file(
    file_path: str, variable_data: dict, variable_name: str = "componentsData"
) -> str:
    """
    Writes a dictionary to a JavaScript file for use in HTML pages

    Parameters
    ----------
    file_path : str
        File Path for the JavaScript file
    variable_data : dict
        The dict to write
    variable_name : str
        The name of the JavaScript variable


    Returns
    -------
    str
        The file path to the JavaScript file
    """

    # Create the JavaScript file content
    # This creates a variable named 'variable_data' containing your JSON data
    js_content = f"const {variable_name} = {json.dumps(variable_data, indent=2)};"

    # Write the JavaScript file
    with open(file_path, "w") as js_file:
        js_file.write(js_content)

    return file_path


def generate_simple_component_type(component: dict) -> str:
    """
    Generate a simple component type string based on the component's type.

    Parameters
    ----------
    component : dict
        The component dictionary containing its type.

    Returns
    -------
    str
        A simple string representation of the component type.
    """
    # Map of component types to their simple representations
    component_type_map = {
        "process": "Process",
        "connector-settings": "Connector",
        "connector-action": "Connector Operation",
        "flowservice": "Connector Operation",
        "webservice": "Connector Operation",
        "webservice.external": "Connector Operation",
        "profile.xml": "Profile",
        "profile.flatfile": "Profile",
        "profile.json": "Profile",
        "profile.db": "Profile",
        "transform.map": "Map",
        "documentcache": "Document Cache",
        "transform.function": "Function",
        "script.processing": "Function",
        "script.mapping": "Function",
        "processroute": "Deployment Configs",
        "customlibrary": "Deployment Configs",
        "certificate.pgp": "Deployment Configs",
        "processproperty": "Deployment Configs",
        "crossref": "Deployment Configs",
    }

    # Get the component type from the dictionary and return its simple representation

    return component_type_map.get(component["type"], "Other")


def chunk_list(original_list: list, chunk_size: int) -> list[list]:
    """
    The 'chunk_list' function takes a list and a chunk size as input, and returns a list of sublists
    where each sublist contains elements from the original list based on the specified chunk size.

    Parameters
    ----------
    original_list : list
        A list of elements that you want to chunk into smaller lists.
    chunk_size : int
        The 'chunk_size' parameter specifies the number of elements you want in each chunk when splitting
    the original list into smaller chunks.

    Returns
    -------
    list[list] : A list of lists, where each sublist is a chunk of the original list.
    """

    return [
        original_list[i : i + chunk_size]
        for i in range(0, len(original_list), chunk_size)
    ]
