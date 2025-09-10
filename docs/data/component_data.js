const componentsData = [
  {
    "@type": "ComponentMetadata",
    "componentId": "702aa116-d243-4660-a815-5399d72277f6",
    "version": 2,
    "name": "Boomi Environment and Container Information",
    "type": "crossref",
    "createdDate": "2024-05-24T18:01:32Z",
    "createdBy": "andy.strubhar@argano.com",
    "modifiedDate": "2024-06-26T18:14:34Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "#Common",
    "folderId": "Rjo2NjAyOTg4",
    "branchName": "main",
    "branchId": "QjoyNTU4NQ",
    "containsMetadata": true,
    "parentComponentIds": [
      "9296027a-f27a-4921-9b1c-b3d7ff628136",
      "74ff1543-1439-4c2d-9a5a-72f8d13ec3c6",
      "880581cd-6413-4d73-b642-6cd1266e92da",
      "a8903379-fe36-4499-9b9c-a9635bf4c77b",
      "66e54092-bbff-47ee-a6a3-2741dfe7fd8c",
      "d7444b9e-fb20-40ce-a28e-4f775f2b5c59",
      "262dba7a-249e-44e4-9d4c-936a34dc89b0",
      "0e599be0-dc4e-4c5f-babc-d8c2f0e9f70a",
      "25c6fc38-e3dc-45de-ac79-046a39a73859",
      "9938f9d2-8868-487f-a461-f13b5e316c49",
      "be9cccc8-e3a6-4689-b4e6-a68e21b4e28f"
    ],
    "childComponentIds": [],
    "simple_type": "Deployment Configs"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "9296027a-f27a-4921-9b1c-b3d7ff628136",
    "version": 4,
    "name": "[sub] Send Job Change Payload to YL API",
    "type": "process",
    "createdDate": "2024-08-27T17:45:51Z",
    "createdBy": "andy.strubhar@argano.com",
    "modifiedDate": "2024-11-13T19:51:53Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "User Account Manager",
    "folderId": "Rjo2MjM0MjAx",
    "branchName": "main",
    "branchId": "QjoyNTU4NQ",
    "parentComponentIds": [
      "af4a7217-1530-440f-81ee-8a67a201046f"
    ],
    "childComponentIds": [
      "702aa116-d243-4660-a815-5399d72277f6"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "25c6fc38-e3dc-45de-ac79-046a39a73859",
    "version": 4,
    "name": "[sub] Get SF Record Owner Username",
    "type": "process",
    "createdDate": "2024-08-21T18:49:03Z",
    "createdBy": "andy.strubhar@argano.com",
    "modifiedDate": "2024-08-23T17:19:43Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "CDS to SF Processing",
    "folderId": "Rjo2MzM4Njk4",
    "branchName": "main",
    "branchId": "QjoyNTU4NQ",
    "parentComponentIds": [
      "43db6c64-a6ad-4b2d-8814-8e533c9fa50b"
    ],
    "childComponentIds": [
      "702aa116-d243-4660-a815-5399d72277f6"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "74ff1543-1439-4c2d-9a5a-72f8d13ec3c6",
    "version": 24,
    "name": "[TEST] Write to Multiple SFTP Folders",
    "type": "process",
    "createdDate": "2024-09-19T14:47:30Z",
    "createdBy": "andy.strubhar@argano.com",
    "modifiedDate": "2024-09-19T19:54:56Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "Write to Multiple Folders",
    "folderId": "Rjo3MDYwNzcy",
    "branchName": "main",
    "branchId": "QjoyNTU4NQ",
    "parentComponentIds": [],
    "childComponentIds": [
      "702aa116-d243-4660-a815-5399d72277f6"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "880581cd-6413-4d73-b642-6cd1266e92da",
    "version": 31,
    "name": "Execution Time Testing DRIVER",
    "type": "process",
    "createdDate": "2025-05-30T16:04:06Z",
    "createdBy": "andy.strubhar@argano.com",
    "modifiedDate": "2025-06-06T18:37:14Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "Emma",
    "folderId": "Rjo3NjkyNTQx",
    "branchName": "main",
    "branchId": "QjoyNTU4NQ",
    "parentComponentIds": [],
    "childComponentIds": [
      "702aa116-d243-4660-a815-5399d72277f6"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "a8903379-fe36-4499-9b9c-a9635bf4c77b",
    "version": 22,
    "name": "[TEMP] Emma MDM Testing",
    "type": "process",
    "createdDate": "2025-05-15T14:33:46Z",
    "createdBy": "andy.strubhar@argano.com",
    "modifiedDate": "2025-05-20T21:36:34Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "Snowflake MDM Matching Testing",
    "folderId": "Rjo3MjU3NzU0",
    "branchName": "main",
    "branchId": "QjoyNTU4NQ",
    "parentComponentIds": [],
    "childComponentIds": [
      "702aa116-d243-4660-a815-5399d72277f6",
      "be9cccc8-e3a6-4689-b4e6-a68e21b4e28f"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "66e54092-bbff-47ee-a6a3-2741dfe7fd8c",
    "version": 47,
    "name": "[sub] Write WCX Record to Snowflake Reporting Table",
    "type": "process",
    "createdDate": "2024-03-19T13:35:46Z",
    "createdBy": "andy.strubhar@argano.com",
    "modifiedDate": "2025-03-20T16:01:05Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "Snowflake Audit Tables",
    "folderId": "Rjo2NjIyNjE0",
    "branchName": "main",
    "branchId": "QjoyNTU4NQ",
    "parentComponentIds": [
      "c01bad43-f567-4fc8-869d-aba719f4dc7a",
      "3b181bca-7046-40e3-84cf-c15dd45cf22d"
    ],
    "childComponentIds": [
      "702aa116-d243-4660-a815-5399d72277f6"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "d7444b9e-fb20-40ce-a28e-4f775f2b5c59",
    "version": 17,
    "name": "[sub] Send Hire Payload to YL API",
    "type": "process",
    "createdDate": "2024-08-27T17:15:00Z",
    "createdBy": "andy.strubhar@argano.com",
    "modifiedDate": "2024-11-13T19:51:38Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "User Account Manager",
    "folderId": "Rjo2MjM0MjAx",
    "branchName": "main",
    "branchId": "QjoyNTU4NQ",
    "parentComponentIds": [
      "af4a7217-1530-440f-81ee-8a67a201046f"
    ],
    "childComponentIds": [
      "702aa116-d243-4660-a815-5399d72277f6"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "262dba7a-249e-44e4-9d4c-936a34dc89b0",
    "version": 309,
    "name": "[Main] Daily FX Rates",
    "type": "process",
    "createdDate": "2023-10-10T16:28:57Z",
    "createdBy": "mamiller@sc.younglife.org",
    "modifiedDate": "2025-04-07T16:10:56Z",
    "modifiedBy": "mamiller@sc.younglife.org",
    "deleted": false,
    "currentVersion": true,
    "folderName": "Currency Conversion Rate Manager",
    "folderId": "Rjo2MjM0MzQ2",
    "branchName": "main",
    "branchId": "QjoyNTU4NQ",
    "parentComponentIds": [],
    "childComponentIds": [
      "702aa116-d243-4660-a815-5399d72277f6"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "0e599be0-dc4e-4c5f-babc-d8c2f0e9f70a",
    "version": 3,
    "name": "[TazWorks RSI] Get Client Product GUID from Order Type",
    "type": "transform.function",
    "createdDate": "2024-11-13T19:26:47Z",
    "createdBy": "andy.strubhar@argano.com",
    "modifiedDate": "2024-11-22T21:24:51Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "CBC & DQ Integrations",
    "folderId": "Rjo3MjE2NDg4",
    "branchName": "main",
    "branchId": "QjoyNTU4NQ",
    "parentComponentIds": [
      "bf01bd1b-1b21-4aac-82f0-ba7644d5e6e1"
    ],
    "childComponentIds": [
      "702aa116-d243-4660-a815-5399d72277f6"
    ],
    "containsMetadata": true,
    "simple_type": "Function"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "9938f9d2-8868-487f-a461-f13b5e316c49",
    "version": 211,
    "name": "[Main] TazWorks RSI Create Applicant, License & Order",
    "type": "process",
    "createdDate": "2024-11-04T21:22:18Z",
    "createdBy": "andy.strubhar@argano.com",
    "modifiedDate": "2025-06-11T20:01:54Z",
    "modifiedBy": "mamiller@sc.younglife.org",
    "deleted": false,
    "currentVersion": true,
    "folderName": "CBC & DQ Integrations",
    "folderId": "Rjo3MjE2NDg4",
    "branchName": "main",
    "branchId": "QjoyNTU4NQ",
    "parentComponentIds": [
      "19e79d57-1d29-4ba2-b7bc-d139b59a4109"
    ],
    "childComponentIds": [
      "702aa116-d243-4660-a815-5399d72277f6"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "be9cccc8-e3a6-4689-b4e6-a68e21b4e28f",
    "version": 88,
    "name": "[sub] Transform and Load Emma Members to Salesforce",
    "type": "process",
    "createdDate": "2025-04-01T20:52:13Z",
    "createdBy": "andy.strubhar@argano.com",
    "modifiedDate": "2025-08-25T15:06:38Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "Emma Member Export to Salesforce",
    "folderId": "Rjo3MTMxNTE0",
    "branchName": "main",
    "branchId": "QjoyNTU4NQ",
    "parentComponentIds": [
      "a8903379-fe36-4499-9b9c-a9635bf4c77b",
      "663cbaa4-4f2b-46d3-8207-4a1af9f16756"
    ],
    "childComponentIds": [
      "702aa116-d243-4660-a815-5399d72277f6"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "af4a7217-1530-440f-81ee-8a67a201046f",
    "version": 502,
    "name": "[Web Svc] Route User Payloads to YL API",
    "type": "process",
    "createdDate": "2023-10-12T15:05:23Z",
    "createdBy": "andy.strubhar@argano.com",
    "modifiedDate": "2025-06-16T15:40:20Z",
    "modifiedBy": "mamiller@sc.younglife.org",
    "deleted": false,
    "currentVersion": true,
    "folderName": "User Account Manager",
    "folderId": "Rjo2MjM0MjAx",
    "branchName": "main",
    "branchId": "QjoyNTU4NQ",
    "parentComponentIds": [],
    "childComponentIds": [
      "9296027a-f27a-4921-9b1c-b3d7ff628136",
      "d7444b9e-fb20-40ce-a28e-4f775f2b5c59"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "c01bad43-f567-4fc8-869d-aba719f4dc7a",
    "version": 7,
    "name": "[TEMP][Main] Resend Registrants that Failed in IntQ",
    "type": "process",
    "createdDate": "2024-10-21T16:02:07Z",
    "createdBy": "andy.strubhar@argano.com",
    "modifiedDate": "2024-10-21T22:41:07Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "WCX Registrants to SF IntQ",
    "folderId": "Rjo2MjQ0NDg1",
    "branchName": "main",
    "branchId": "QjoyNTU4NQ",
    "parentComponentIds": [],
    "childComponentIds": [
      "66e54092-bbff-47ee-a6a3-2741dfe7fd8c"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "3b181bca-7046-40e3-84cf-c15dd45cf22d",
    "version": 2,
    "name": "Webconnex Process Route",
    "type": "processroute",
    "createdDate": "2025-03-13T17:16:05Z",
    "createdBy": "andy.strubhar@argano.com",
    "modifiedDate": "2025-03-13T17:19:04Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "WCX Registrants to SF IntQ",
    "folderId": "Rjo2MjQ0NDg1",
    "branchName": "main",
    "branchId": "QjoyNTU4NQ",
    "parentComponentIds": [],
    "childComponentIds": [
      "66e54092-bbff-47ee-a6a3-2741dfe7fd8c"
    ],
    "containsMetadata": true,
    "simple_type": "Deployment Configs"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "bf01bd1b-1b21-4aac-82f0-ba7644d5e6e1",
    "version": 7,
    "name": "[Salesforce -> TazWorks RSI] Build TazWorks Submit Order Request",
    "type": "transform.map",
    "createdDate": "2024-11-13T19:09:08Z",
    "createdBy": "andy.strubhar@argano.com",
    "modifiedDate": "2025-02-19T19:56:55Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "CBC & DQ Integrations",
    "folderId": "Rjo3MjE2NDg4",
    "branchName": "main",
    "branchId": "QjoyNTU4NQ",
    "parentComponentIds": [],
    "childComponentIds": [
      "0e599be0-dc4e-4c5f-babc-d8c2f0e9f70a"
    ],
    "containsMetadata": true,
    "simple_type": "Map"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "43db6c64-a6ad-4b2d-8814-8e533c9fa50b",
    "version": 267,
    "name": "[Main] CDS to SF Processing",
    "type": "process",
    "createdDate": "2023-11-30T22:25:50Z",
    "createdBy": "andy.strubhar@argano.com",
    "modifiedDate": "2025-09-04T20:25:43Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "CDS to SF Processing",
    "folderId": "Rjo2MzM4Njk4",
    "branchName": "main",
    "branchId": "QjoyNTU4NQ",
    "parentComponentIds": [],
    "childComponentIds": [
      "25c6fc38-e3dc-45de-ac79-046a39a73859"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "19e79d57-1d29-4ba2-b7bc-d139b59a4109",
    "version": 3,
    "name": "Create TazWorks Applicant, License & Order",
    "type": "processroute",
    "createdDate": "2024-11-15T01:10:41Z",
    "createdBy": "andy.strubhar@argano.com",
    "modifiedDate": "2024-11-26T16:07:05Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "CBC & DQ Integrations",
    "folderId": "Rjo3MjE2NDg4",
    "branchName": "main",
    "branchId": "QjoyNTU4NQ",
    "parentComponentIds": [],
    "childComponentIds": [
      "9938f9d2-8868-487f-a461-f13b5e316c49"
    ],
    "containsMetadata": true,
    "simple_type": "Deployment Configs"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "663cbaa4-4f2b-46d3-8207-4a1af9f16756",
    "version": 392,
    "name": "[sub] Generate Emma Member Export and Write to Salesforce",
    "type": "process",
    "createdDate": "2024-10-17T23:59:32Z",
    "createdBy": "andy.strubhar@argano.com",
    "modifiedDate": "2025-09-10T15:13:14Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "Emma Member Export to Salesforce",
    "folderId": "Rjo3MTMxNTE0",
    "branchName": "main",
    "branchId": "QjoyNTU4NQ",
    "parentComponentIds": [],
    "childComponentIds": [
      "be9cccc8-e3a6-4689-b4e6-a68e21b4e28f"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  }
];