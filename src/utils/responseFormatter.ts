import { ApiResponse, PaginatedResponse, ValidationError } from '../types';

/**
 * Format success response
 * @param data - Response data
 * @param message - Success message
 * @returns Formatted response object
 */
export const successResponse = <T>(
  data: T,
  message = 'Success'
): ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
  };
};

/**
 * Format error response
 * @param message - Error message
 * @param errors - Validation errors or additional error details
 * @returns Formatted error response object
 */
export const errorResponse = (
  message: string,
  errors?: ValidationError[]
): ApiResponse => {
  const response: ApiResponse = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return response;
};

/**
 * Format paginated response
 * @param data - Array of items
 * @param page - Current page
 * @param limit - Items per page
 * @param total - Total number of items
 * @returns Formatted paginated response
 */
export const paginatedResponse = <T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> => {
  return {
    success: true,
    message: 'Success',
    data,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  };
};

