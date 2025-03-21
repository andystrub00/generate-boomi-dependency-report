import os
import argparse


# TODO - Remove this script
def spoof_command_line_args(
    folder_name: str = "example_folder_name",
    folder_id: str = None,
    parse_subfolders: bool = True,
):
    """
    Spoofs an argparse.Namespace object

    Parameters
    ----------
    folder_name : str, optional
        default folder_name to use, by default "example_folder_name"
    folder_id : str, optional
        defualt folder_id to use, by default None
    parse_subfolders : bool, optional
        default value of parsee_subfolders to use, by default True

    Returns
    -------
    argparse.Namespace
        spoofed argparse.Namespace object
    """

    parser = argparse.ArgumentParser(description="Process folder information.")

    parser.add_argument(
        "-f",
        "--folder_name",
        type=str,
        nargs="?",  # Allows an optional argument with no value, defaulting to the `const` value if provided
        const=folder_name,  # Sets the value to True if the argument is provided without an explicit value
        default=folder_name,  # Defaults to True if the argument is not provided
        help="Name of the folder",
    )
    parser.add_argument(
        "-i",
        "--folder_id",
        type=str,
        nargs="?",  # Allows an optional argument with no value, defaulting to the `const` value if provided
        const=folder_id,  # Sets the value to True if the argument is provided without an explicit value
        default=folder_id,  # Defaults to True if the argument is not provided
        help="ID of the folder",
    )
    parser.add_argument(
        "-p",
        "--parse_subfolders",
        type=bool,
        nargs="?",  # Allows an optional argument with no value, defaulting to the `const` value if provided
        const=parse_subfolders,  # Sets the value to True if the argument is provided without an explicit value
        default=parse_subfolders,  # Defaults to True if the argument is not provided
        help="Whether to parse subfolders (default: True)",
    )

    args = parser.parse_args()

    if not args.folder_name and not args.folder_id:
        parser.error("At least one of --folder_name or --folder_id must be provided.")

    return args


def write_to_debug_log(
    message: str,
    debug_log_path: str = "logging",
    debug_log_filename: str = "debug_log",
    debug_log_suffix: str = ".txt",
):
    """
    Writes a debug message to a log file.
    Parameters
    ----------
    message : str
        The debug message to be written to the log file.
    debug_log_path : str, optional
        The relative path to the directory where the log file will be stored (default is "logging").
    debug_log_filename : str, optional
        The name of the log file without the suffix (default is "debug_log").
    debug_log_suffix : str, optional
        The suffix of the log file (default is ".txt").
    Returns
    -------
    None
    """

    # Get the directory where the current script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Get the parent directory of the script
    parent_dir = os.path.dirname(script_dir)

    # Construct the path to the logging folder
    logging_folder = os.path.join(parent_dir, debug_log_path)

    # Check if the folder exists
    if os.path.isdir(logging_folder):

        with open(
            f"{os.path.join(logging_folder,debug_log_filename)}{debug_log_suffix}", "w"
        ) as f:
            f.write(f"{message}")

        print(
            f"Debug log written to {os.path.join(logging_folder,debug_log_filename)}{debug_log_suffix}."
        )

    else:
        print(f"Error: {logging_folder} does not exist.")
        print("Debug log not written.")
