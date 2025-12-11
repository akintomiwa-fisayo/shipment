const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const createApp = require("../src/app");
const Shipment = require("../src/models/Shipment");

let app;
let mongoServer;

// Sample shipment data for testing
const sampleShipment = {
  trackingNumber: "TRACK123456",
  senderName: "John Doe",
  receiverName: "Jane Smith",
  origin: "Lagos, Nigeria",
  destination: "Abuja, Nigeria",
  status: "pending",
};

/**
 * Setup before all tests
 * Increased timeout for first-run binary download
 */
beforeAll(async () => {
  // Create in-memory MongoDB instance with increased timeout
  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: "shipment_test",
    },
    binary: {
      downloadDir:
        "./node_modules/.cache/mongodb-memory-server/mongodb-binaries",
    },
  });
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
  app = createApp();
}, 120000); // 2 minute timeout for binary download

/**
 * Cleanup after all tests
 */
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
}, 30000);

/**
 * Clear database before each test
 */
beforeEach(async () => {
  if (mongoose.connection.readyState === 1) {
    await Shipment.deleteMany({});
  }
});

describe("Shipment API", () => {
  describe("POST /api/shipments", () => {
    it("should create a new shipment", async () => {
      const res = await request(app)
        .post("/api/shipments")
        .send(sampleShipment)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Shipment created successfully");
      expect(res.body.data.trackingNumber).toBe(sampleShipment.trackingNumber);
      expect(res.body.data.senderName).toBe(sampleShipment.senderName);
      expect(res.body.data.receiverName).toBe(sampleShipment.receiverName);
      expect(res.body.data.status).toBe("pending");
    });

    it("should return validation error for missing required fields", async () => {
      const res = await request(app)
        .post("/api/shipments")
        .send({ trackingNumber: "TRACK123" })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Validation failed");
    });

    it("should return error for duplicate tracking number", async () => {
      // Create first shipment
      await request(app).post("/api/shipments").send(sampleShipment);

      // Try to create duplicate
      const res = await request(app)
        .post("/api/shipments")
        .send(sampleShipment)
        .expect(409);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("already exists");
    });
  });

  describe("GET /api/shipments", () => {
    it("should return all shipments with pagination", async () => {
      // Create test shipments
      await Shipment.create(sampleShipment);
      await Shipment.create({
        ...sampleShipment,
        trackingNumber: "TRACK789012",
      });

      const res = await request(app).get("/api/shipments").expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.totalItems).toBe(2);
    });

    it("should return empty array when no shipments exist", async () => {
      const res = await request(app).get("/api/shipments").expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(0);
    });

    it("should filter shipments by status", async () => {
      await Shipment.create(sampleShipment);
      await Shipment.create({
        ...sampleShipment,
        trackingNumber: "TRACK789012",
        status: "delivered",
      });

      const res = await request(app)
        .get("/api/shipments?status=delivered")
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].status).toBe("delivered");
    });
  });

  describe("GET /api/shipments/:id", () => {
    it("should return a single shipment by ID", async () => {
      const shipment = await Shipment.create(sampleShipment);

      const res = await request(app)
        .get(`/api/shipments/${shipment._id}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.trackingNumber).toBe(sampleShipment.trackingNumber);
    });

    it("should return 404 for non-existent shipment", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .get(`/api/shipments/${fakeId}`)
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("not found");
    });

    it("should return 400 for invalid ID format", async () => {
      const res = await request(app)
        .get("/api/shipments/invalid-id")
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe("PUT /api/shipments/:id", () => {
    it("should update a shipment", async () => {
      const shipment = await Shipment.create(sampleShipment);

      const res = await request(app)
        .put(`/api/shipments/${shipment._id}`)
        .send({ status: "in_transit" })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("in_transit");
    });

    it("should return 404 for updating non-existent shipment", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`/api/shipments/${fakeId}`)
        .send({ status: "delivered" })
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    it("should return validation error for invalid status", async () => {
      const shipment = await Shipment.create(sampleShipment);

      const res = await request(app)
        .put(`/api/shipments/${shipment._id}`)
        .send({ status: "invalid_status" })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe("DELETE /api/shipments/:id", () => {
    it("should delete a shipment", async () => {
      const shipment = await Shipment.create(sampleShipment);

      const res = await request(app)
        .delete(`/api/shipments/${shipment._id}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Shipment deleted successfully");

      // Verify deletion
      const deletedShipment = await Shipment.findById(shipment._id);
      expect(deletedShipment).toBeNull();
    });

    it("should return 404 for deleting non-existent shipment", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/api/shipments/${fakeId}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe("Health Check", () => {
    it("should return health status", async () => {
      const res = await request(app).get("/api/health").expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Shipment API is running");
    });
  });
});
