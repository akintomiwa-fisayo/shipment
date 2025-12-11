# Shipment Management API

A production-ready RESTful API for managing shipments built with Node.js, Express, and MongoDB.

## 🌐 Live Demo

**Base URL:** `https://shipment-production-4397.up.railway.app`

> Replace with your actual deployed URL after deployment

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)

## ✨ Features

- Full CRUD operations for shipment management
- Input validation with Joi
- Consistent error handling
- Pagination and filtering support
- MongoDB integration with Mongoose
- **Swagger/OpenAPI documentation**
- Comprehensive test suite
- Production-ready architecture

## 🛠 Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Validation:** Joi
- **Documentation:** Swagger/OpenAPI 3.0
- **Testing:** Jest & Supertest
- **Security:** Helmet, CORS

## 📁 Project Structure

```
shipment/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # MongoDB connection
│   │   ├── swagger.ts   # OpenAPI/Swagger specification
│   │   └── index.ts     # App configuration
│   ├── controllers/     # Route handlers
│   │   └── shipmentController.ts
│   ├── middleware/      # Custom middleware
│   │   ├── errorHandler.ts
│   │   └── validateRequest.ts
│   ├── models/          # Mongoose models
│   │   └── Shipment.ts
│   ├── routes/          # API routes
│   │   ├── index.ts
│   │   └── shipmentRoutes.ts
│   ├── utils/           # Utility functions
│   │   ├── ApiError.ts
│   │   ├── asyncHandler.ts
│   │   └── responseFormatter.ts
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── tests/               # Test files
│   └── shipment.test.ts
├── .env.example         # Environment variables template
├── .gitignore
├── jest.config.js
├── package.json
├── postman_collection.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd shipment
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file:**

   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/shipment_db
   ```

5. **Start the server:**

   ```bash
   # Development mode with hot reload
   npm run dev

   # Production mode
   npm start
   ```

The API will be available at `https://shipment-production-4397.up.railway.app`

## 📖 API Documentation

### 🔗 Swagger UI (Interactive Documentation)

Access the interactive API documentation at:

- **Local:** `https://shipment-production-4397.up.railway.app/api-docs`
- **Production:** `https://shipment-production-4397.up.railway.app/api-docs`

You can also access the raw OpenAPI JSON specification at:

- **Local:** `https://shipment-production-4397.up.railway.app/api-docs.json`
- **Production:** `https://shipment-production-4397.up.railway.app/api-docs.json`

### Base URL

- **Local:** `https://shipment-production-4397.up.railway.app/api`
- **Production:** `https://shipment-production-4397.up.railway.app/api`

### Endpoints

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| GET    | `/api/health`        | Health check          |
| GET    | `/api/shipments`     | Get all shipments     |
| GET    | `/api/shipments/:id` | Get a single shipment |
| POST   | `/api/shipments`     | Create a shipment     |
| PUT    | `/api/shipments/:id` | Update a shipment     |
| DELETE | `/api/shipments/:id` | Delete a shipment     |

### Shipment Object

```json
{
  "id": "507f1f77bcf86cd799439011",
  "trackingNumber": "TRACK123456",
  "senderName": "John Doe",
  "receiverName": "Jane Smith",
  "origin": "Lagos, Nigeria",
  "destination": "Abuja, Nigeria",
  "status": "pending",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Status Values

- `pending` - Shipment is created but not yet in transit
- `in_transit` - Shipment is on the way
- `delivered` - Shipment has been delivered
- `cancelled` - Shipment has been cancelled

---

### 1. Get All Shipments

**Request:**

```http
GET /api/shipments?page=1&limit=10&status=pending&sortBy=createdAt&order=desc
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| status | string | - | Filter by status |
| sortBy | string | createdAt | Sort field |
| order | string | desc | Sort order (asc/desc) |

**Response (200):**

```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "trackingNumber": "TRACK123456",
      "senderName": "John Doe",
      "receiverName": "Jane Smith",
      "origin": "Lagos, Nigeria",
      "destination": "Abuja, Nigeria",
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 10
  }
}
```

---

### 2. Get Shipment by ID

**Request:**

```http
GET /api/shipments/507f1f77bcf86cd799439011
```

**Response (200):**

```json
{
  "success": true,
  "message": "Shipment retrieved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "trackingNumber": "TRACK123456",
    "senderName": "John Doe",
    "receiverName": "Jane Smith",
    "origin": "Lagos, Nigeria",
    "destination": "Abuja, Nigeria",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (404):**

```json
{
  "success": false,
  "message": "Shipment with ID 507f1f77bcf86cd799439011 not found"
}
```

---

### 3. Create Shipment

**Request:**

```http
POST /api/shipments
Content-Type: application/json

{
  "trackingNumber": "TRACK123456",
  "senderName": "John Doe",
  "receiverName": "Jane Smith",
  "origin": "Lagos, Nigeria",
  "destination": "Abuja, Nigeria",
  "status": "pending"
}
```

**Required Fields:**

- `trackingNumber` (string, 5-50 chars)
- `senderName` (string, 2-100 chars)
- `receiverName` (string, 2-100 chars)
- `origin` (string, 2-200 chars)
- `destination` (string, 2-200 chars)

**Optional Fields:**

- `status` (string, default: "pending")

**Response (201):**

```json
{
  "success": true,
  "message": "Shipment created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "trackingNumber": "TRACK123456",
    "senderName": "John Doe",
    "receiverName": "Jane Smith",
    "origin": "Lagos, Nigeria",
    "destination": "Abuja, Nigeria",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (400) - Validation Error:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "trackingNumber",
      "message": "Tracking number is required"
    },
    {
      "field": "senderName",
      "message": "Sender name is required"
    }
  ]
}
```

**Response (409) - Duplicate Tracking Number:**

```json
{
  "success": false,
  "message": "trackingNumber 'TRACK123456' already exists"
}
```

---

### 4. Update Shipment

**Request:**

```http
PUT /api/shipments/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "status": "in_transit",
  "destination": "Port Harcourt, Nigeria"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Shipment updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "trackingNumber": "TRACK123456",
    "senderName": "John Doe",
    "receiverName": "Jane Smith",
    "origin": "Lagos, Nigeria",
    "destination": "Port Harcourt, Nigeria",
    "status": "in_transit",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Response (400) - Invalid Status:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "status",
      "message": "Status must be one of: pending, in_transit, delivered, cancelled"
    }
  ]
}
```

---

### 5. Delete Shipment

**Request:**

```http
DELETE /api/shipments/507f1f77bcf86cd799439011
```

**Response (200):**

```json
{
  "success": true,
  "message": "Shipment deleted successfully",
  "data": null
}
```

**Response (404):**

```json
{
  "success": false,
  "message": "Shipment with ID 507f1f77bcf86cd799439011 not found"
}
```

---

### Error Response Format

All error responses follow this consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific error message"
    }
  ]
}
```

**Common HTTP Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🚢 Deployment

### Option 1: Render.com (Recommended - Free)

1. Create a [Render](https://render.com) account
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `NODE_ENV` - `production`
6. Deploy!

### Option 2: Railway.app

1. Create a [Railway](https://railway.app) account
2. Create a new project from GitHub
3. Add MongoDB plugin or use MongoDB Atlas
4. Add environment variables
5. Deploy!

### Option 3: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Create `vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [{ "src": "src/server.ts", "use": "@vercel/node" }],
     "routes": [{ "src": "/(.*)", "dest": "src/server.ts" }]
   }
   ```
3. Run `vercel` and follow prompts

### MongoDB Atlas Setup

1. Create a [MongoDB Atlas](https://www.mongodb.com/atlas) account
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string and add to environment variables

## 📬 Postman Collection

Import the included `postman_collection.json` file into Postman to test all endpoints.

The collection includes:

- All API endpoints
- Sample request bodies
- Environment variables setup

## 📝 License

MIT License

## 👤 Author

Built with ❤️ for the TaxTech assessment
