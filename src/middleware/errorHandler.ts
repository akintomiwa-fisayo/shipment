import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import { errorResponse } from '../utils/responseFormatter';
import config from '../config';
import { MongooseError, ValidationError } from '../types';

interface ErrorWithStack extends ApiError {
  stack?: string;
}

/**
 * Handle Mongoose CastError (invalid ObjectId)
 */
const handleCastError = (err: MongooseError): ApiError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return ApiError.badRequest(message);
};

/**
 * Handle Mongoose duplicate key error
 */
const handleDuplicateKeyError = (err: MongooseError): ApiError => {
  const field = Object.keys(err.keyValue || {})[0];
  const value = err.keyValue?.[field];
  const message = `${field} '${value}' already exists`;
  return ApiError.conflict(message);
};

/**
 * Handle Mongoose validation error
 */
const handleValidationError = (err: MongooseError): ApiError => {
  const errors: ValidationError[] = Object.values(err.errors || {}).map((el) => ({
    field: el.path,
    message: el.message,
  }));
  const message = 'Validation failed';
  return ApiError.badRequest(message, errors);
};

/**
 * Send error response in development environment
 * Includes full error details and stack trace
 */
const sendErrorDev = (err: ErrorWithStack, res: Response): void => {
  const response = errorResponse(err.message, err.errors);
  (response as { stack?: string }).stack = err.stack;

  res.status(err.statusCode).json(response);
};

/**
 * Send error response in production environment
 * Only includes safe error information
 */
const sendErrorProd = (err: ApiError, res: Response): void => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json(errorResponse(err.message, err.errors));
  } else {
    // Programming or unknown error: don't leak error details
    console.error('ERROR:', err);
    res.status(500).json(errorResponse('Something went wrong'));
  }
};

/**
 * Global error handling middleware
 * Processes all errors and sends appropriate response
 */
export const errorHandler = (
  err: ApiError & MongooseError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle specific Mongoose errors
  let error: ApiError = err;

  if (err.name === 'CastError') {
    error = handleCastError(err);
  }

  if (err.code === 11000) {
    error = handleDuplicateKeyError(err);
  }

  if (err.name === 'ValidationError') {
    error = handleValidationError(err);
  }

  // Send appropriate response based on environment
  if (config.nodeEnv === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

/**
 * Handle 404 Not Found for undefined routes
 */
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
};

