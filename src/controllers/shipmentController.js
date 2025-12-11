const Shipment = require("../models/Shipment");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const {
  successResponse,
  paginatedResponse,
} = require("../utils/responseFormatter");

/**
 * @desc    Get all shipments with optional pagination and filtering
 * @route   GET /api/shipments
 * @access  Public
 */
const getAllShipments = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    sortBy = "createdAt",
    order = "desc",
  } = req.query;

  // Build query
  const query = {};
  if (status) {
    query.status = status;
  }

  // Calculate pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  // Build sort object
  const sortOrder = order === "asc" ? 1 : -1;
  const sort = { [sortBy]: sortOrder };

  // Execute query with pagination
  const [shipments, total] = await Promise.all([
    Shipment.find(query).sort(sort).skip(skip).limit(limitNum),
    Shipment.countDocuments(query),
  ]);

  res.status(200).json(paginatedResponse(shipments, pageNum, limitNum, total));
});

/**
 * @desc    Get a single shipment by ID
 * @route   GET /api/shipments/:id
 * @access  Public
 */
const getShipmentById = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);

  if (!shipment) {
    throw ApiError.notFound(`Shipment with ID ${req.params.id} not found`);
  }

  res
    .status(200)
    .json(successResponse(shipment, "Shipment retrieved successfully"));
});

/**
 * @desc    Create a new shipment
 * @route   POST /api/shipments
 * @access  Public
 */
const createShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.create(req.body);

  res
    .status(201)
    .json(successResponse(shipment, "Shipment created successfully"));
});

/**
 * @desc    Update a shipment by ID
 * @route   PUT /api/shipments/:id
 * @access  Public
 */
const updateShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return the updated document
    runValidators: true, // Run model validators on update
  });

  if (!shipment) {
    throw ApiError.notFound(`Shipment with ID ${req.params.id} not found`);
  }

  res
    .status(200)
    .json(successResponse(shipment, "Shipment updated successfully"));
});

/**
 * @desc    Delete a shipment by ID
 * @route   DELETE /api/shipments/:id
 * @access  Public
 */
const deleteShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.findByIdAndDelete(req.params.id);

  if (!shipment) {
    throw ApiError.notFound(`Shipment with ID ${req.params.id} not found`);
  }

  res.status(200).json(successResponse(null, "Shipment deleted successfully"));
});

module.exports = {
  getAllShipments,
  getShipmentById,
  createShipment,
  updateShipment,
  deleteShipment,
};
