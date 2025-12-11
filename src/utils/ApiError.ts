import { ValidationError } from '../types';

/**
 * Custom API Error class for handling operational errors
 * Extends the built-in Error class with additional properties
 */
class ApiError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public errors?: ValidationError[];

  /**
   * Create an API Error
   * @param statusCode - HTTP status code
   * @param message - Error message
   * @param isOperational - Whether the error is operational (expected)
   */
  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a 400 Bad Request error
   * @param message - Error message
   * @param errors - Validation errors array
   */
  static badRequest(message = 'Bad Request', errors?: ValidationError[]): ApiError {
    const error = new ApiError(400, message);
    if (errors) {
      error.errors = errors;
    }
    return error;
  }

  /**
   * Create a 404 Not Found error
   * @param message - Error message
   */
  static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(404, message);
  }

  /**
   * Create a 409 Conflict error
   * @param message - Error message
   */
  static conflict(message = 'Resource already exists'): ApiError {
    return new ApiError(409, message);
  }

  /**
   * Create a 422 Unprocessable Entity error
   * @param message - Error message
   */
  static unprocessable(message = 'Unprocessable Entity'): ApiError {
    return new ApiError(422, message);
  }

  /**
   * Create a 500 Internal Server Error
   * @param message - Error message
   */
  static internal(message = 'Internal Server Error'): ApiError {
    return new ApiError(500, message, false);
  }
}

export default ApiError;

