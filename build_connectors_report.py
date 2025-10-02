from utils.utils import fetch_env_variables, chunk_list

from utils.connectors_report_utils import (
    parse_connectors_report_command_line_args,
    BoomiMetadataExtractor,
)


def main():
    # Get command line arguments
    args = parse_connectors_report_command_line_args()

    # Fetch environment variables
    env_vars = fetch_env_variables(env_filename=f"{args.account_name}.env")

    print(f"{env_vars = }")
    print(f"{env_vars['ACCOUNT_ID'] = }")
    print(f"{args.account_name = }")

    # Create extractor instance
    extractor = BoomiMetadataExtractor(
        account_id=env_vars["ACCOUNT_ID"],
        username=env_vars["BOOMI_USER"],
        password=env_vars["ACCESS_TOKEN"],
    )

    # Run extraction
    metadata = extractor.run_extraction(
        environment_name=args.environment,
        export_csv=True,
        csv_filename=f"connectors_report/{args.account_name}_connector_inventory.csv",
    )

    # Optional: Print summary statistics
    if metadata:
        print("\n" + "=" * 60)
        print("SUMMARY STATISTICS")
        print("=" * 60)

        # Count unique connector types
        connector_types = {}
        for item in metadata:
            conn_type = item.get("component_subtype", "Unknown")
            connector_types[conn_type] = connector_types.get(conn_type, 0) + 1

        print("\nConnector Types Found:")
        for conn_type, count in sorted(
            connector_types.items(), key=lambda x: x[1], reverse=True
        ):
            print(f"  {conn_type}: {count}")

        # Count unique processes
        unique_processes = set(item.get("process_name") for item in metadata)
        print(f"\nTotal Unique Processes: {len(unique_processes)}")


# Example usage
if __name__ == "__main__":
    main()
