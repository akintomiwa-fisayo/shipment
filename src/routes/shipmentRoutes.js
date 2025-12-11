const express = require("express");
const router = express.Router();
const {
  getAllShipments,
  getShipmentById,
  createShipment,
  updateShipment,
  deleteShipment,
} = require("../controllers/shipmentController");
const { validate } = require("../middleware/validateRequest");

/**
 * @route   GET /api/shipments
 * @desc    Get all shipments with pagination
 */
router.get("/", getAllShipments);

/**
 * @route   GET /api/shipments/:id
 * @desc    Get a single shipment by ID
 */
router.get("/:id", validate("id", "params"), getShipmentById);

/**
 * @route   POST /api/shipments
 * @desc    Create a new shipment
 */
router.post("/", validate("create", "body"), createShipment);

/**
 * @route   PUT /api/shipments/:id
 * @desc    Update a shipment by ID
 */
router.put(
  "/:id",
  validate("id", "params"),
  validate("update", "body"),
  updateShipment
);

/**
 * @route   DELETE /api/shipments/:id
 * @desc    Delete a shipment by ID
 */
router.delete("/:id", validate("id", "params"), deleteShipment);

module.exports = router;
