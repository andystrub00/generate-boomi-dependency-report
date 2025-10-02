import requests
import base64
import xml.etree.ElementTree as ET
import csv
import json
from typing import List, Dict, Any
from datetime import datetime


class BoomiMetadataExtractor:
    """
    Extracts integration metadata from Boomi AtomSphere API
    """

    def __init__(self, account_id: str, username: str, password: str):
        """
        Initialize the Boomi API client

        Args:
            account_id: Your Boomi account ID
            username: API username (format: username@account_id)
            password: API password/token
        """
        self.account_id = account_id
        self.base_url = f"https://api.boomi.com/api/rest/v1/{account_id}"

        self.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        self.auth = (f"BOOMI_TOKEN.{username}", password)

    def query_deployed_packages(
        self, environment_name: str = None
    ) -> List[Dict[str, Any]]:
        """
        Query all deployed packages (processes) in the account

        Args:
            environment_name: Optional environment name to filter (e.g., "AWS Molecule Prod")

        Returns:
            List of deployed package metadata dictionaries
        """
        url = f"{self.base_url}/DeployedPackage/query"

        # Build query filter
        nested_expressions = [
            {
                "argument": ["process"],
                "operator": "EQUALS",
                "property": "componentType",
            },
            {"argument": [True], "operator": "EQUALS", "property": "active"},
        ]

        # Add environment filter if specified
        if environment_name:
            nested_expressions.append(
                {
                    "argument": [environment_name],
                    "operator": "EQUALS",
                    "property": "environmentName",
                }
            )

        query = {
            "QueryFilter": {
                "expression": {
                    "operator": "and",
                    "nestedExpression": nested_expressions,
                }
            }
        }

        try:
            response = requests.post(
                url, headers=self.headers, json=query, auth=self.auth
            )
            response.raise_for_status()

            result = response.json()
            deployed_packages = result.get("result", [])

            print(f"Found {len(deployed_packages)} deployed processes")
            if environment_name:
                print(f"  Filtered to environment: {environment_name}")

            return deployed_packages

        except requests.exceptions.RequestException as e:
            print(f"Error querying deployed packages: {e}")
            if hasattr(e.response, "text"):
                print(f"Response: {e.response.text}")
            return []

    def get_process_name(self, component_id: str) -> str:
        """
        Get the process name from component ID

        Args:
            component_id: The component (process) ID

        Returns:
            Process name
        """
        url = f"{self.base_url}/Process/{component_id}"

        try:
            response = requests.get(url, headers=self.headers, auth=self.auth)
            response.raise_for_status()

            process_data = response.json()
            return process_data.get("name", "Unknown")

        except requests.exceptions.RequestException as e:
            print(f"Error getting process name for {component_id}: {e}")
            return "Unknown"

    def get_package_manifest(self, package_id: str) -> List[Dict[str, Any]]:
        """
        Get the component manifest for a deployed package

        Args:
            package_id: The package ID from DeployedPackage

        Returns:
            List of component info dictionaries with id and version
        """
        url = f"{self.base_url}/PackagedComponentManifest/{package_id}"

        try:
            response = requests.get(url, headers=self.headers, auth=self.auth)
            response.raise_for_status()

            manifest = response.json()
            component_info = manifest.get("componentInfo", [])

            return component_info

        except requests.exceptions.RequestException as e:
            print(f"Error getting package manifest for {package_id}: {e}")
            if hasattr(e, "response") and e.response is not None:
                print(f"Response: {e.response.text}")
            return []

    def get_component_metadata_bulk(
        self, component_ids: List[str]
    ) -> List[Dict[str, Any]]:
        """
        Get metadata for multiple components in bulk

        Args:
            component_ids: List of component IDs

        Returns:
            List of component metadata dictionaries
        """
        url = f"{self.base_url}/ComponentMetadata/bulk"

        # Build request body
        request_body = {
            "request": [{"id": comp_id} for comp_id in component_ids],
            "type": "GET",
        }

        try:
            response = requests.post(
                url, headers=self.headers, json=request_body, auth=self.auth
            )
            response.raise_for_status()

            result = response.json()
            return result.get("response", [])

        except requests.exceptions.RequestException as e:
            print(f"Error getting bulk component metadata: {e}")
            if hasattr(e, "response") and e.response is not None:
                print(f"Response: {e.response.text}")
            return []

    def parse_component_metadata(
        self, metadata: Dict[str, Any], process_name: str
    ) -> List[Dict[str, Any]]:
        """
        Parse component metadata to extract connector and operation information

        Args:
            metadata: Component metadata from bulk API
            process_name: Name of the process

        Returns:
            List of dictionaries containing connector/operation metadata
        """
        results = []
        metadata = metadata.get("Result", {})
        try:
            # Get the component type
            component_type = metadata.get("type", "Unknown")
            component_name = metadata.get("name", "Unknown")
            component_id = metadata.get("id", "Unknown")

            # For process components, parse the XML if available
            if component_type == "process":
                # The metadata might contain inlineDocument with XML
                inline_doc = metadata.get("inlineDocument")
                if inline_doc:
                    # xml_results = self.parse_process_xml(inline_doc, process_name)
                    # results.extend(xml_results)
                    pass
            # For connection components
            elif component_type == "connector-settings":
                connection_type = metadata.get("subType", "Unknown")
                results.append(
                    {
                        "process_name": process_name,
                        "component_id": component_id,
                        "component_name": component_name,
                        "component_type": "Connection",
                        "shape_type": "CONNECTION",
                        "connector_type": connection_type,
                        "connection_name": component_name,
                        "operation_type": "N/A",
                        "operation_name": "N/A",
                    }
                )

            # For operation components
            elif "connector-action" in component_type:
                operation_type = metadata.get("subType", "Unknown")
                results.append(
                    {
                        "process_name": process_name,
                        "component_id": component_id,
                        "component_name": component_name,
                        "component_type": component_type,
                        "shape_type": "OPERATION",
                        "connector_type": "operation_type",
                        "connection_name": "Unknown",
                        "operation_type": operation_type,
                        "operation_name": component_name,
                    }
                )

        except Exception as e:
            print(f"Error parsing component metadata: {e}")

        return results

    def parse_process_xml(
        self, xml_content: str, process_name: str
    ) -> List[Dict[str, Any]]:
        """
        Parse process XML to extract connector and operation information

        Args:
            xml_content: XML content as string
            process_name: Name of the process

        Returns:
            List of dictionaries containing connector/operation metadata
        """
        if not xml_content:
            return []

        results = []

        try:
            # Parse XML with namespace handling
            root = ET.fromstring(xml_content)

            # Define namespaces (Boomi uses these)
            namespaces = {
                "bns": "http://api.platform.boomi.com/",
                "xsi": "http://www.w3.org/2001/XMLSchema-instance",
            }

            # Find all shapes that contain operations
            shapes = root.findall(".//bns:shapes", namespaces)

            for shape in shapes:
                # Look for connector shapes
                connector = shape.find(".//bns:connector", namespaces)

                if connector is not None:
                    # Extract connector info
                    connector_type = connector.get(
                        "{http://www.w3.org/2001/XMLSchema-instance}type", "Unknown"
                    )

                    # Get connection
                    connection = connector.find(".//bns:connection", namespaces)
                    connection_name = "Unknown"
                    connection_id = "Unknown"
                    if connection is not None:
                        connection_name = connection.get("name", "Unknown")
                        connection_id = connection.get("id", "Unknown")

                    # Get operation
                    operation = connector.find(".//bns:operation", namespaces)
                    operation_type = "Unknown"
                    operation_name = "Unknown"
                    operation_id = "Unknown"

                    if operation is not None:
                        operation_type = operation.get(
                            "{http://www.w3.org/2001/XMLSchema-instance}type", "Unknown"
                        )
                        operation_name = operation.get("name", "Unknown")
                        operation_id = operation.get("id", "Unknown")

                    # Get shape properties for additional context
                    shape_type = shape.find(".//bns:shapeType", namespaces)
                    shape_type_text = (
                        shape_type.text if shape_type is not None else "Unknown"
                    )

                    results.append(
                        {
                            "process_name": process_name,
                            "component_id": "N/A",
                            "component_name": "N/A",
                            "component_type": "Process Shape",
                            "shape_type": shape_type_text,
                            "connector_type": connector_type.replace(
                                "bns:", ""
                            ).replace("Connector", ""),
                            "connection_name": connection_name,
                            "connection_id": connection_id,
                            "operation_type": operation_type.replace(
                                "bns:", ""
                            ).replace("Operation", ""),
                            "operation_name": operation_name,
                            "operation_id": operation_id,
                        }
                    )

            # Also look for Try-Catch blocks to understand current error handling
            try_catch_blocks = root.findall(
                './/bns:shapes[bns:shapeType="TRY_CATCH"]', namespaces
            )

            if try_catch_blocks:
                results.append(
                    {
                        "process_name": process_name,
                        "component_id": "N/A",
                        "component_name": "N/A",
                        "component_type": "Error Handling",
                        "shape_type": "ERROR_HANDLING",
                        "connector_type": "Try-Catch Block Present",
                        "connection_name": "N/A",
                        "connection_id": "N/A",
                        "operation_type": f"{len(try_catch_blocks)} Try-Catch block(s)",
                        "operation_name": "N/A",
                        "operation_id": "N/A",
                    }
                )

        except ET.ParseError as e:
            print(f"Error parsing XML for {process_name}: {e}")

        return results

    def export_to_csv(self, data: List[Dict[str, Any]], filename: str = None):
        """
        Export metadata to CSV file

        Args:
            data: List of metadata dictionaries
            filename: Output filename (default: boomi_metadata_TIMESTAMP.csv)
        """
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"boomi_metadata_{timestamp}.csv"

        if not data:
            print("No data to export")
            return

        # Get all unique keys
        fieldnames = list(data[0].keys())

        try:
            with open(filename, "w", newline="", encoding="utf-8") as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(data)

            print(f"Data exported to {filename}")

        except IOError as e:
            print(f"Error writing CSV file: {e}")

    def run_extraction(
        self,
        environment_name: str = None,
        export_csv: bool = True,
        csv_filename: str = None,
    ):
        """
        Main method to run the complete extraction process

        Args:
            environment_name: Optional environment name to filter (e.g., "AWS Molecule Prod")
            export_csv: Whether to export results to CSV
            csv_filename: Optional custom CSV filename

        Returns:
            List of all extracted metadata
        """
        print("Starting Boomi metadata extraction...")
        print("=" * 60)

        # Step 1: Query all deployed packages
        print("\nStep 1: Querying deployed packages...")
        deployed_packages = self.query_deployed_packages(environment_name)

        if not deployed_packages:
            print("No deployed packages found. Exiting.")
            return []

        # Step 2: Download and parse each process
        print(f"\nStep 2: Processing {len(deployed_packages)} deployed packages...")
        all_metadata = []

        for i, package in enumerate(deployed_packages, 1):
            component_id = package.get("componentId")
            package_id = package.get("packageId")
            environment_id = package.get("environmentId")
            deployed_date = package.get("deployedDate", "Unknown")
            deployed_by = package.get("deployedBy", "Unknown")

            # Get process name
            print(f"  [{i}/{len(deployed_packages)}] Getting process details...")
            process_name = self.get_process_name(component_id)
            print(f"    Process: {process_name}")
            print(f"    Deployed: {deployed_date} by {deployed_by}")

            if not package_id:
                print(f"    Warning: No package ID found for {process_name}")
                continue

            # Get package manifest (all components in this deployment)
            print(f"    Getting package manifest...")
            component_info = self.get_package_manifest(package_id)

            if not component_info:
                print(f"    Warning: No components found in package manifest")
                continue

            print(f"    Found {len(component_info)} components in package")

            # Get all component IDs
            component_ids = [
                comp.get("id") for comp in component_info if comp.get("id")
            ]

            if not component_ids:
                print(f"    Warning: No valid component IDs found")
                continue

            # Get metadata for all components in bulk
            print(f"    Fetching metadata for {len(component_ids)} components...")
            components_metadata = self.get_component_metadata_bulk(component_ids)

            # Parse each component's metadata
            for comp_metadata in components_metadata:
                metadata = self.parse_component_metadata(comp_metadata, process_name)

                # Add deployment information to each record
                for record in metadata:
                    record["deployment_id"] = package.get("deploymentId")
                    record["environment_id"] = environment_id
                    record["deployed_date"] = deployed_date
                    record["deployed_by"] = deployed_by
                    record["package_version"] = package.get("packageVersion")

                all_metadata.extend(metadata)

            print(
                f"    Extracted {len(all_metadata) - len([m for m in all_metadata if m.get('process_name') != process_name])} total items"
            )

        # Step 3: Export results
        print(f"\nStep 3: Processing complete!")
        print(f"Total connector/operations found: {len(all_metadata)}")

        if export_csv and all_metadata:
            print("\nExporting to CSV...")
            self.export_to_csv(all_metadata, csv_filename)

        return all_metadata


# Example usage
if __name__ == "__main__":
    # Configuration
    ACCOUNT_ID = "personal-K8JJK1"  # e.g., youraccount-12345
    USERNAME = "andy.strubhar@argano.com"
    PASSWORD = "84726757-2168-4354-8d31-4bf2ad1c80fb"

    # Optional: Specify environment name to filter
    # Set to None to get all environments
    ENVIRONMENT_NAME = "AWS Molecule Prod"  # Or None for all environments

    # Create extractor instance
    extractor = BoomiMetadataExtractor(
        account_id=ACCOUNT_ID, username=USERNAME, password=PASSWORD
    )

    # Run extraction
    metadata = extractor.run_extraction(
        environment_name=ENVIRONMENT_NAME,
        export_csv=True,
        csv_filename="boomi_integration_inventory.csv",
    )

    # Optional: Print summary statistics
    if metadata:
        print("\n" + "=" * 60)
        print("SUMMARY STATISTICS")
        print("=" * 60)

        # Count unique connector types
        connector_types = {}
        for item in metadata:
            conn_type = item.get("connector_type", "Unknown")
            connector_types[conn_type] = connector_types.get(conn_type, 0) + 1

        print("\nConnector Types Found:")
        for conn_type, count in sorted(
            connector_types.items(), key=lambda x: x[1], reverse=True
        ):
            print(f"  {conn_type}: {count}")

        # Count unique processes
        unique_processes = set(item.get("process_name") for item in metadata)
        print(f"\nTotal Unique Processes: {len(unique_processes)}")

        # Count processes with error handling
        error_handling = [
            item for item in metadata if item.get("shape_type") == "ERROR_HANDLING"
        ]
        if error_handling:
            print(
                f"\nProcesses with Try-Catch blocks: {len(set(item.get('process_name') for item in error_handling))}"
            )
