require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/shipment_db",

  // Shipment status options
  shipmentStatuses: ["pending", "in_transit", "delivered", "cancelled"],

  // Default status for new shipments
  defaultStatus: "pending",
};
