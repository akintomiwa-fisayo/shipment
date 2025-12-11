const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Shipment Management API",
      version: "1.0.0",
      description:
        "A production-ready RESTful API for managing shipments. This API provides full CRUD operations for shipment tracking with comprehensive validation and error handling.",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://your-production-url.com",
        description: "Production server",
      },
    ],
    tags: [
      {
        name: "Health",
        description: "API health check endpoints",
      },
      {
        name: "Shipments",
        description: "Shipment management operations",
      },
    ],
    components: {
      schemas: {
        Shipment: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for the shipment",
              example: "507f1f77bcf86cd799439011",
            },
            trackingNumber: {
              type: "string",
              description: "Unique tracking number for the shipment",
              example: "TRACK123456",
            },
            senderName: {
              type: "string",
              description: "Name of the sender",
              example: "John Doe",
            },
            receiverName: {
              type: "string",
              description: "Name of the receiver",
              example: "Jane Smith",
            },
            origin: {
              type: "string",
              description: "Origin location of the shipment",
              example: "Lagos, Nigeria",
            },
            destination: {
              type: "string",
              description: "Destination location of the shipment",
              example: "Abuja, Nigeria",
            },
            status: {
              type: "string",
              enum: ["pending", "in_transit", "delivered", "cancelled"],
              description: "Current status of the shipment",
              example: "pending",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the shipment was created",
              example: "2024-01-15T10:30:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when the shipment was last updated",
              example: "2024-01-15T10:30:00.000Z",
            },
          },
        },
        CreateShipmentRequest: {
          type: "object",
          required: [
            "trackingNumber",
            "senderName",
            "receiverName",
            "origin",
            "destination",
          ],
          properties: {
            trackingNumber: {
              type: "string",
              minLength: 5,
              maxLength: 50,
              description: "Unique tracking number (5-50 characters)",
              example: "TRACK123456",
            },
            senderName: {
              type: "string",
              minLength: 2,
              maxLength: 100,
              description: "Name of the sender (2-100 characters)",
              example: "John Doe",
            },
            receiverName: {
              type: "string",
              minLength: 2,
              maxLength: 100,
              description: "Name of the receiver (2-100 characters)",
              example: "Jane Smith",
            },
            origin: {
              type: "string",
              minLength: 2,
              maxLength: 200,
              description: "Origin location (2-200 characters)",
              example: "Lagos, Nigeria",
            },
            destination: {
              type: "string",
              minLength: 2,
              maxLength: 200,
              description: "Destination location (2-200 characters)",
              example: "Abuja, Nigeria",
            },
            status: {
              type: "string",
              enum: ["pending", "in_transit", "delivered", "cancelled"],
              default: "pending",
              description:
                "Status of the shipment (optional, defaults to pending)",
              example: "pending",
            },
          },
        },
        UpdateShipmentRequest: {
          type: "object",
          minProperties: 1,
          properties: {
            trackingNumber: {
              type: "string",
              minLength: 5,
              maxLength: 50,
              description: "Unique tracking number (5-50 characters)",
              example: "TRACK789012",
            },
            senderName: {
              type: "string",
              minLength: 2,
              maxLength: 100,
              description: "Name of the sender (2-100 characters)",
              example: "John Doe Updated",
            },
            receiverName: {
              type: "string",
              minLength: 2,
              maxLength: 100,
              description: "Name of the receiver (2-100 characters)",
              example: "Jane Smith Updated",
            },
            origin: {
              type: "string",
              minLength: 2,
              maxLength: 200,
              description: "Origin location (2-200 characters)",
              example: "Port Harcourt, Nigeria",
            },
            destination: {
              type: "string",
              minLength: 2,
              maxLength: 200,
              description: "Destination location (2-200 characters)",
              example: "Kano, Nigeria",
            },
            status: {
              type: "string",
              enum: ["pending", "in_transit", "delivered", "cancelled"],
              description: "Status of the shipment",
              example: "in_transit",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Success",
            },
            data: {
              $ref: "#/components/schemas/Shipment",
            },
          },
        },
        PaginatedResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Success",
            },
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Shipment",
              },
            },
            pagination: {
              type: "object",
              properties: {
                currentPage: {
                  type: "integer",
                  example: 1,
                },
                totalPages: {
                  type: "integer",
                  example: 5,
                },
                totalItems: {
                  type: "integer",
                  example: 50,
                },
                itemsPerPage: {
                  type: "integer",
                  example: 10,
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: {
                    type: "string",
                    example: "trackingNumber",
                  },
                  message: {
                    type: "string",
                    example: "Tracking number is required",
                  },
                },
              },
            },
          },
        },
        HealthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Shipment API is running",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00.000Z",
            },
          },
        },
      },
    },
    paths: {
      "/api/health": {
        get: {
          operationId: "healthCheck",
          tags: ["Health"],
          summary: "Health check",
          description: "Check if the API is running and healthy",
          responses: {
            200: {
              description: "API is healthy",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/HealthResponse",
                  },
                },
              },
            },
          },
        },
      },
      "/api/shipments": {
        get: {
          operationId: "getAllShipments",
          tags: ["Shipments"],
          summary: "Get all shipments",
          description:
            "Retrieve all shipments with optional pagination, filtering, and sorting",
          parameters: [
            {
              name: "page",
              in: "query",
              description: "Page number for pagination",
              schema: {
                type: "integer",
                default: 1,
                minimum: 1,
              },
            },
            {
              name: "limit",
              in: "query",
              description: "Number of items per page",
              schema: {
                type: "integer",
                default: 10,
                minimum: 1,
                maximum: 100,
              },
            },
            {
              name: "status",
              in: "query",
              description: "Filter by shipment status",
              schema: {
                type: "string",
                enum: ["pending", "in_transit", "delivered", "cancelled"],
              },
            },
            {
              name: "sortBy",
              in: "query",
              description: "Field to sort by",
              schema: {
                type: "string",
                default: "createdAt",
                enum: [
                  "createdAt",
                  "updatedAt",
                  "trackingNumber",
                  "senderName",
                  "status",
                ],
              },
            },
            {
              name: "order",
              in: "query",
              description: "Sort order",
              schema: {
                type: "string",
                default: "desc",
                enum: ["asc", "desc"],
              },
            },
          ],
          responses: {
            200: {
              description: "Successful response with paginated shipments",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/PaginatedResponse",
                  },
                },
              },
            },
          },
        },
        post: {
          operationId: "createShipment",
          tags: ["Shipments"],
          summary: "Create a shipment",
          description: "Create a new shipment with the provided details",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateShipmentRequest",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Shipment created successfully",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SuccessResponse" },
                      {
                        type: "object",
                        properties: {
                          message: {
                            example: "Shipment created successfully",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            400: {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                  example: {
                    success: false,
                    message: "Validation failed",
                    errors: [
                      {
                        field: "trackingNumber",
                        message: "Tracking number is required",
                      },
                    ],
                  },
                },
              },
            },
            409: {
              description: "Conflict - Duplicate tracking number",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                  example: {
                    success: false,
                    message: "trackingNumber 'TRACK123456' already exists",
                  },
                },
              },
            },
          },
        },
      },
      "/api/shipments/{id}": {
        get: {
          operationId: "getShipmentById",
          tags: ["Shipments"],
          summary: "Get a shipment by ID",
          description: "Retrieve a single shipment by its unique identifier",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "MongoDB ObjectId of the shipment",
              schema: {
                type: "string",
                pattern: "^[0-9a-fA-F]{24}$",
              },
              example: "507f1f77bcf86cd799439011",
            },
          ],
          responses: {
            200: {
              description: "Shipment found",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SuccessResponse" },
                      {
                        type: "object",
                        properties: {
                          message: {
                            example: "Shipment retrieved successfully",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            400: {
              description: "Invalid ID format",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                  example: {
                    success: false,
                    message: "Validation failed",
                    errors: [
                      {
                        field: "id",
                        message: "Invalid shipment ID format",
                      },
                    ],
                  },
                },
              },
            },
            404: {
              description: "Shipment not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                  example: {
                    success: false,
                    message:
                      "Shipment with ID 507f1f77bcf86cd799439011 not found",
                  },
                },
              },
            },
          },
        },
        put: {
          operationId: "updateShipment",
          tags: ["Shipments"],
          summary: "Update a shipment",
          description:
            "Update an existing shipment. All fields are optional - only provided fields will be updated.",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "MongoDB ObjectId of the shipment",
              schema: {
                type: "string",
                pattern: "^[0-9a-fA-F]{24}$",
              },
              example: "507f1f77bcf86cd799439011",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UpdateShipmentRequest",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Shipment updated successfully",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SuccessResponse" },
                      {
                        type: "object",
                        properties: {
                          message: {
                            example: "Shipment updated successfully",
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            400: {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                  example: {
                    success: false,
                    message: "Validation failed",
                    errors: [
                      {
                        field: "status",
                        message:
                          "Status must be one of: pending, in_transit, delivered, cancelled",
                      },
                    ],
                  },
                },
              },
            },
            404: {
              description: "Shipment not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                  example: {
                    success: false,
                    message:
                      "Shipment with ID 507f1f77bcf86cd799439011 not found",
                  },
                },
              },
            },
          },
        },
        delete: {
          operationId: "deleteShipment",
          tags: ["Shipments"],
          summary: "Delete a shipment",
          description: "Delete a shipment by its unique identifier",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "MongoDB ObjectId of the shipment",
              schema: {
                type: "string",
                pattern: "^[0-9a-fA-F]{24}$",
              },
              example: "507f1f77bcf86cd799439011",
            },
          ],
          responses: {
            200: {
              description: "Shipment deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: {
                        type: "boolean",
                        example: true,
                      },
                      message: {
                        type: "string",
                        example: "Shipment deleted successfully",
                      },
                      data: {
                        type: "null",
                        example: null,
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Invalid ID format",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
            404: {
              description: "Shipment not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                  example: {
                    success: false,
                    message:
                      "Shipment with ID 507f1f77bcf86cd799439011 not found",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [], // We're defining everything in the definition object
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
