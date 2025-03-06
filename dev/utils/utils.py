import os
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
    -f, --folder_name: Optional; Name of the folder.
    -i, --folder_id: Optional; ID of the folder.
    -p, --parse_subfolders: Optional; Boolean flag to determine if subfolders should be parsed (default: True).

    Returns:
    argparse.Namespace: Parsed arguments.
    """
    parser = argparse.ArgumentParser(description="Process folder information.")

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

    args = parser.parse_args()

    if not args.folder_name and not args.folder_id:
        parser.error("At least one of --folder_name or --folder_id must be provided.")

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
