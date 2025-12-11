const Joi = require("joi");
const ApiError = require("../utils/ApiError");
const config = require("../config");

/**
 * Shipment validation schemas using Joi
 */
const shipmentSchemas = {
  // Schema for creating a new shipment
  create: Joi.object({
    trackingNumber: Joi.string()
      .trim()
      .uppercase()
      .min(5)
      .max(50)
      .required()
      .messages({
        "string.empty": "Tracking number is required",
        "string.min": "Tracking number must be at least 5 characters",
        "string.max": "Tracking number cannot exceed 50 characters",
        "any.required": "Tracking number is required",
      }),
    senderName: Joi.string().trim().min(2).max(100).required().messages({
      "string.empty": "Sender name is required",
      "string.min": "Sender name must be at least 2 characters",
      "string.max": "Sender name cannot exceed 100 characters",
      "any.required": "Sender name is required",
    }),
    receiverName: Joi.string().trim().min(2).max(100).required().messages({
      "string.empty": "Receiver name is required",
      "string.min": "Receiver name must be at least 2 characters",
      "string.max": "Receiver name cannot exceed 100 characters",
      "any.required": "Receiver name is required",
    }),
    origin: Joi.string().trim().min(2).max(200).required().messages({
      "string.empty": "Origin is required",
      "string.min": "Origin must be at least 2 characters",
      "string.max": "Origin cannot exceed 200 characters",
      "any.required": "Origin is required",
    }),
    destination: Joi.string().trim().min(2).max(200).required().messages({
      "string.empty": "Destination is required",
      "string.min": "Destination must be at least 2 characters",
      "string.max": "Destination cannot exceed 200 characters",
      "any.required": "Destination is required",
    }),
    status: Joi.string()
      .valid(...config.shipmentStatuses)
      .default(config.defaultStatus)
      .messages({
        "any.only": `Status must be one of: ${config.shipmentStatuses.join(
          ", "
        )}`,
      }),
  }),

  // Schema for updating a shipment (all fields optional)
  update: Joi.object({
    trackingNumber: Joi.string().trim().uppercase().min(5).max(50).messages({
      "string.min": "Tracking number must be at least 5 characters",
      "string.max": "Tracking number cannot exceed 50 characters",
    }),
    senderName: Joi.string().trim().min(2).max(100).messages({
      "string.min": "Sender name must be at least 2 characters",
      "string.max": "Sender name cannot exceed 100 characters",
    }),
    receiverName: Joi.string().trim().min(2).max(100).messages({
      "string.min": "Receiver name must be at least 2 characters",
      "string.max": "Receiver name cannot exceed 100 characters",
    }),
    origin: Joi.string().trim().min(2).max(200).messages({
      "string.min": "Origin must be at least 2 characters",
      "string.max": "Origin cannot exceed 200 characters",
    }),
    destination: Joi.string().trim().min(2).max(200).messages({
      "string.min": "Destination must be at least 2 characters",
      "string.max": "Destination cannot exceed 200 characters",
    }),
    status: Joi.string()
      .valid(...config.shipmentStatuses)
      .messages({
        "any.only": `Status must be one of: ${config.shipmentStatuses.join(
          ", "
        )}`,
      }),
  })
    .min(1)
    .messages({
      "object.min": "At least one field is required for update",
    }),

  // Schema for validating MongoDB ObjectId
  id: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.pattern.base": "Invalid shipment ID format",
        "any.required": "Shipment ID is required",
      }),
  }),
};

/**
 * Validation middleware factory
 * @param {string} schemaName - Name of the schema to use for validation
 * @param {string} property - Request property to validate ('body', 'params', 'query')
 * @returns {Function} Express middleware function
 */
const validate = (schemaName, property = "body") => {
  return (req, res, next) => {
    const schema = shipmentSchemas[schemaName];

    if (!schema) {
      return next(
        ApiError.internal(`Validation schema '${schemaName}' not found`)
      );
    }

    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return next(ApiError.badRequest("Validation failed", errors));
    }

    // Replace request property with validated and sanitized value
    req[property] = value;
    next();
  };
};

module.exports = { validate, shipmentSchemas };
