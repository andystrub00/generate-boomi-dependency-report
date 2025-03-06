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
