import os


def get_env_vars():
    creds_fn = f".env_{acct}"
    dir_path = os.path.dirname(os.path.realpath(__file__))
    dot_env_path = os.path.join(dir_path, "..", "env", creds_fn)
    # check if .env file exists
    print(dot_env_path)


get_env_vars("yeah")


print(os.path.dirname(os.path.realpath(__file__)))
