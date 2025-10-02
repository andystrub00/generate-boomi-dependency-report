const componentsData = [
  {
    "@type": "ComponentMetadata",
    "componentId": "90eb9fdd-5505-435b-a3f3-0f7fcf2f5343",
    "version": 8,
    "name": "GraphQL Agreements No Identifier",
    "type": "profile.json",
    "createdDate": "2025-01-26T21:02:55Z",
    "createdBy": "josh.kloehn@argano.com",
    "modifiedDate": "2025-04-15T17:24:13Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "Order Maturity Check",
    "folderId": "Rjo3MTM4MzAw",
    "branchName": "main",
    "branchId": "QjozNzYwNjU",
    "containsMetadata": true,
    "parentComponentIds": [
      "90bafc38-7387-4df6-82cd-adaa0cdd1ed5",
      "e8fd6b5e-a583-4ab6-989f-43941ccebd3c",
      "f338c91c-c286-4fed-ad6b-22bce86270b0",
      "91baea98-00da-4a68-aa56-30e2c8b0049e"
    ],
    "childComponentIds": [],
    "simple_type": "Profile"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "90bafc38-7387-4df6-82cd-adaa0cdd1ed5",
    "version": 62,
    "name": "Cache Shopify Line Ids and Agreements",
    "type": "process",
    "createdDate": "2024-11-21T20:58:11Z",
    "createdBy": "josh.kloehn@argano.com",
    "modifiedDate": "2025-06-13T15:56:56Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "Cancellations and Refunds",
    "folderId": "Rjo3MDYxODk3",
    "branchName": "main",
    "branchId": "QjozNzYwNjU",
    "parentComponentIds": [
      "a99fd2e6-1c7f-43ae-bb81-1dc8e388fafd"
    ],
    "childComponentIds": [
      "90eb9fdd-5505-435b-a3f3-0f7fcf2f5343"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "e8fd6b5e-a583-4ab6-989f-43941ccebd3c",
    "version": 129,
    "name": "Query Most Recent Billing Document",
    "type": "process",
    "createdDate": "2023-05-08T19:36:26Z",
    "createdBy": "alex.vo@rothys-external.com",
    "modifiedDate": "2025-07-02T21:34:05Z",
    "modifiedBy": "josh.kloehn@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "ECOM & POS Orders",
    "folderId": "Rjo1NjE3Mjcw",
    "branchName": "main",
    "branchId": "QjozNzYwNjU",
    "parentComponentIds": [
      "8355ac82-1667-49f2-be6c-a652b2dadda1",
      "533eb762-52b4-443b-9672-fe90bef4fc51",
      "267e2f68-7fee-44d9-9aca-82f9a789ae6e"
    ],
    "childComponentIds": [
      "90eb9fdd-5505-435b-a3f3-0f7fcf2f5343"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "f338c91c-c286-4fed-ad6b-22bce86270b0",
    "version": 9,
    "name": "Sort and Flag Transactions",
    "type": "process",
    "createdDate": "2025-03-11T20:47:39Z",
    "createdBy": "josh.kloehn@argano.com",
    "modifiedDate": "2025-03-14T15:08:34Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "Return and Exchange Payment Waterfall",
    "folderId": "Rjo3MzQ5MzUx",
    "branchName": "main",
    "branchId": "QjozNzYwNjU",
    "parentComponentIds": [
      "2e61b8c7-b749-497d-895a-88dc3978a608"
    ],
    "childComponentIds": [
      "90eb9fdd-5505-435b-a3f3-0f7fcf2f5343"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "91baea98-00da-4a68-aa56-30e2c8b0049e",
    "version": 20,
    "name": "Sort Transactions by Gateway",
    "type": "transform.map",
    "createdDate": "2025-01-26T17:18:02Z",
    "createdBy": "josh.kloehn@argano.com",
    "modifiedDate": "2025-02-27T21:12:13Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "Return and Exchange Payment Waterfall",
    "folderId": "Rjo3MzQ5MzUx",
    "branchName": "main",
    "branchId": "QjozNzYwNjU",
    "parentComponentIds": [
      "2e61b8c7-b749-497d-895a-88dc3978a608"
    ],
    "childComponentIds": [
      "90eb9fdd-5505-435b-a3f3-0f7fcf2f5343"
    ],
    "containsMetadata": true,
    "simple_type": "Map"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "a99fd2e6-1c7f-43ae-bb81-1dc8e388fafd",
    "version": 240,
    "name": "Shopify Refunds Create Event Processing",
    "type": "process",
    "createdDate": "2024-10-18T15:45:40Z",
    "createdBy": "josh.kloehn@argano.com",
    "modifiedDate": "2025-05-15T13:43:34Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "Cancellations and Refunds",
    "folderId": "Rjo3MDYxODk3",
    "branchName": "main",
    "branchId": "QjozNzYwNjU",
    "parentComponentIds": [],
    "childComponentIds": [
      "90bafc38-7387-4df6-82cd-adaa0cdd1ed5"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "8355ac82-1667-49f2-be6c-a652b2dadda1",
    "version": 572,
    "name": "Shopify Returns Close Event Processing",
    "type": "process",
    "createdDate": "2025-01-21T02:35:29Z",
    "createdBy": "josh.kloehn@argano.com",
    "modifiedDate": "2025-08-06T15:22:13Z",
    "modifiedBy": "josh.kloehn@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "Returns and Exchanges",
    "folderId": "Rjo3MzM5Mjkw",
    "branchName": "main",
    "branchId": "QjozNzYwNjU",
    "parentComponentIds": [],
    "childComponentIds": [
      "e8fd6b5e-a583-4ab6-989f-43941ccebd3c"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "533eb762-52b4-443b-9672-fe90bef4fc51",
    "version": 60,
    "name": "Generate SAP Credit Memo",
    "type": "process",
    "createdDate": "2024-11-21T20:20:27Z",
    "createdBy": "josh.kloehn@argano.com",
    "modifiedDate": "2025-07-21T20:04:48Z",
    "modifiedBy": "josh.kloehn@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "Cancellations and Refunds",
    "folderId": "Rjo3MDYxODk3",
    "branchName": "main",
    "branchId": "QjozNzYwNjU",
    "parentComponentIds": [],
    "childComponentIds": [
      "e8fd6b5e-a583-4ab6-989f-43941ccebd3c"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "267e2f68-7fee-44d9-9aca-82f9a789ae6e",
    "version": 793,
    "name": "Generate SAP Order Payload and Update Shopify",
    "type": "process",
    "createdDate": "2023-03-20T17:33:03Z",
    "createdBy": "josh.kloehn@rothys-external.com",
    "modifiedDate": "2025-07-22T21:11:11Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "ECOM & POS Orders",
    "folderId": "Rjo1NjE3Mjcw",
    "branchName": "main",
    "branchId": "QjozNzYwNjU",
    "parentComponentIds": [],
    "childComponentIds": [
      "e8fd6b5e-a583-4ab6-989f-43941ccebd3c"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  },
  {
    "@type": "ComponentMetadata",
    "componentId": "2e61b8c7-b749-497d-895a-88dc3978a608",
    "version": 132,
    "name": "Exchange Order Multi Gateway Waterfall",
    "type": "process",
    "createdDate": "2025-01-23T19:51:43Z",
    "createdBy": "andy.strubhar@argano.com",
    "modifiedDate": "2025-04-02T15:28:39Z",
    "modifiedBy": "andy.strubhar@argano.com",
    "deleted": false,
    "currentVersion": true,
    "folderName": "Return and Exchange Payment Waterfall",
    "folderId": "Rjo3MzQ5MzUx",
    "branchName": "main",
    "branchId": "QjozNzYwNjU",
    "parentComponentIds": [],
    "childComponentIds": [
      "f338c91c-c286-4fed-ad6b-22bce86270b0",
      "91baea98-00da-4a68-aa56-30e2c8b0049e"
    ],
    "containsMetadata": true,
    "simple_type": "Process"
  }
];