/**
 * Response utilities untuk consistent API responses
 */

export interface ApiResponse<T = any> {
  ok: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp?: string;
}

/**
 * Create success response
 */
export function successResponse<T>(data: T, message: string = 'Success'): ApiResponse<T> {
  return {
    ok: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create error response
 */
export function errorResponse(message: string, status: number = 500): ApiResponse {
  return {
    ok: false,
    message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create paginated response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Success'
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);
  
  return {
    ok: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create validation error response
 */
export function validationErrorResponse(errors: Record<string, string[]>): ApiResponse {
  return {
    ok: false,
    message: 'Data tidak valid',
    data: errors,
    timestamp: new Date().toISOString(),
  };
}