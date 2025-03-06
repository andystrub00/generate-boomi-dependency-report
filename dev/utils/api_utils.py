import json
import sys
import xml.etree.ElementTree as ET
import requests


def build_default_headers(persist_connection: bool = True) -> dict:
    """
    Builds defualt headers for Atomsphere API HTTP calls

    Parameters
    ----------
    persist_connection : bool, optional
        "Connection" header set to "keep-alive" if True, "close" if False, by default True

    Returns
    -------
    dict
        Dictionary to be used as headers for Atomsphere API HTTP calls
    """

    # If persist_connection is False or null, set connecton to "close". Else set to "keep-alive".
    if not persist_connection:

        connection = "close"
    else:
        connection = "keep-alive"

    return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Connection": connection,
    }


def build_base_atomsphere_api_url(env_vars: dict) -> str:
    """
    Builds the base URL for Atomsphere API HTTP calls

    Parameters
    ----------
    env_vars : dict
        environment variables, including "ACCOUNT_ID"

    Returns
    -------
    str
        base URL for Atomsphere API HTTP calls
    """

    return f"https://api.boomi.com/api/rest/v1/{env_vars['ACCOUNT_ID']}"


def build_basic_auth_object(env_vars: dict) -> set:
    """
    Build basic authentication object for use in HTTP calls

    Parameters
    ----------
    env_vars : dict
        environment variables, including "BOOMI_USER" & "ACCESS_TOKEN"

    Returns
    -------
    set
        basic authentication object
    """

    return (f"BOOMI_TOKEN.{env_vars['BOOMI_USER']}", env_vars["ACCESS_TOKEN"])


def init_global_api_vars(env_vars: dict) -> dict:
    """
    Initialize global API variables

    Parameters
    ----------
    env_vars : dict
        environment variables - "ACCOUNT_ID", "BOOMI_USER", & "ACCESS_TOKEN"

    Returns
    -------
    dict
        dictionary containing base_url, auth_object, and headers for Atomsphere API HTTP calls
    """

    base_url = build_base_atomsphere_api_url(env_vars)
    auth_object = build_basic_auth_object(env_vars)
    headers = build_default_headers()

    return {"base_url": base_url, "auth_object": auth_object, "headers": headers}


def build_query_body(*query_groups: dict, query_operator: str = "and") -> str:
    """
    Builds a nested query body for use in a POST query.

    Parameters
    ----------
    query_groups : dict
        Dictionaries containing 'argument', 'operator', and 'property' keys to use in the query body.
    query_operator : str, optional
        Logical operator to combine query groups, either "and" or "or". Default is "and".

    Returns
    -------
    str
        The query body as a JSON string.
    """

    nested_expr = []

    for query_group in query_groups:
        query_expr = {
            "argument": query_group.get("argument", []),
            "operator": query_group.get("operator", "EQUALS"),
            "property": query_group.get("property", ""),
        }

        if not isinstance(query_expr["argument"], type([])):
            query_expr["argument"] = [query_expr["argument"]]

        nested_expr.append(query_expr)

    if len(nested_expr) == 1:
        return json.dumps({"QueryFilter": {"expression": nested_expr[0]}})

    return json.dumps(
        {
            "QueryFilter": {
                "expression": {
                    "operator": query_operator,
                    "nestedExpression": nested_expr,
                }
            }
        }
    )


def handle_response(response: requests.Response) -> dict:
    """
    Handle the response from an HTTP request.

    Parameters
    ----------
    response : requests.Response
        The response object to handle.

    Returns
    -------
    dict
        The parsed JSON object if the response status code is 2xx.

    Raises
    ------
    SystemExit
        If the response status code is not 2xx, prints the error message and terminates the execution.
    """
    if response.status_code // 100 == 2:
        return response.json()
    else:
        try:
            root = ET.fromstring(response.text)
            error_message = root.find(".//Data").text
            print(f"Error: {response.status_code} - {response.reason}: {error_message}")
        except ET.ParseError:
            print(f"Error: {response.status_code} - {response.reason}")
            print(f"Failed to parse error message from response XML :{response.text}")
        sys.exit(1)


def query_more_endpoint(
    query_more_token: str, object_type: str, runtime_vars: dict
) -> dict:
    """
    Query the "more" endpoint for additional results.

    Parameters
    ----------
    query_more_token : str
        The query more token from the initial query response.
    object_type : str
        The type of object to query for more results.
    runtime_vars : dict
        The runtime variables dictionary.

    Returns
    -------
    dict
        The response from the query more endpoint.
    """
    query_more_response = requests.post(
        f"{runtime_vars['base_url']}/{object_type}/queryMore",
        headers=runtime_vars["headers"],
        auth=runtime_vars["auth_object"],
        data=query_more_token,
    )

    return handle_response(query_more_response)
