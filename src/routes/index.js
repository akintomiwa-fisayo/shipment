const express = require("express");
const router = express.Router();
const shipmentRoutes = require("./shipmentRoutes");

// API Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Shipment API is running",
    timestamp: new Date().toISOString(),
  });
});

// Mount shipment routes
router.use("/shipments", shipmentRoutes);

module.exports = router;
