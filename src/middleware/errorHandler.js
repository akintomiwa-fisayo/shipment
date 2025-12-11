const ApiError = require("../utils/ApiError");
const { errorResponse } = require("../utils/responseFormatter");
const config = require("../config");

/**
 * Handle Mongoose CastError (invalid ObjectId)
 * @param {Error} err - Mongoose CastError
 * @returns {ApiError}
 */
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return ApiError.badRequest(message);
};

/**
 * Handle Mongoose duplicate key error
 * @param {Error} err - Mongoose duplicate key error
 * @returns {ApiError}
 */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${field} '${value}' already exists`;
  return ApiError.conflict(message);
};

/**
 * Handle Mongoose validation error
 * @param {Error} err - Mongoose validation error
 * @returns {ApiError}
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => ({
    field: el.path,
    message: el.message,
  }));
  const message = "Validation failed";
  const error = ApiError.badRequest(message);
  error.errors = errors;
  return error;
};

/**
 * Send error response in development environment
 * Includes full error details and stack trace
 */
const sendErrorDev = (err, res) => {
  const response = errorResponse(err.message, err.errors);
  response.stack = err.stack;

  res.status(err.statusCode).json(response);
};

/**
 * Send error response in production environment
 * Only includes safe error information
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json(errorResponse(err.message, err.errors));
  } else {
    // Programming or unknown error: don't leak error details
    console.error("ERROR:", err);
    res.status(500).json(errorResponse("Something went wrong"));
  }
};

/**
 * Global error handling middleware
 * Processes all errors and sends appropriate response
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Handle specific Mongoose errors
  let error = err;

  if (err.name === "CastError") {
    error = handleCastError(err);
  }

  if (err.code === 11000) {
    error = handleDuplicateKeyError(err);
  }

  if (err.name === "ValidationError") {
    error = handleValidationError(err);
  }

  // Send appropriate response based on environment
  if (config.nodeEnv === "development") {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

/**
 * Handle 404 Not Found for undefined routes
 */
const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
};

module.exports = { errorHandler, notFoundHandler };
