/**
 * Custom error classes untuk better error handling and classification
 */

export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT = 'RATE_LIMIT',
  DATABASE = 'DATABASE',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  INTERNAL = 'INTERNAL',
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    type: ErrorType,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorType.VALIDATION, 400, true, context);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', context?: Record<string, any>) {
    super(message, ErrorType.AUTHENTICATION, 401, true, context);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied', context?: Record<string, any>) {
    super(message, ErrorType.AUTHORIZATION, 403, true, context);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const message = identifier 
      ? `${resource} with ID '${identifier}' not found`
      : `${resource} not found`;
    super(message, ErrorType.NOT_FOUND, 404, true, { resource, identifier });
  }
}

export class ConflictError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorType.CONFLICT, 409, true, context);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', context?: Record<string, any>) {
    super(message, ErrorType.RATE_LIMIT, 429, true, context);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorType.DATABASE, 500, true, context);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string = 'External service error') {
    super(message, ErrorType.EXTERNAL_SERVICE, 502, true, { service });
  }
}

export class InternalError extends AppError {
  constructor(message: string = 'Internal server error', context?: Record<string, any>) {
    super(message, ErrorType.INTERNAL, 500, false, context);
  }
}

/**
 * Error handler utility functions
 */

export function handleError(error: unknown): AppError {
  // If it's already an AppError, return it
  if (error instanceof AppError) {
    return error;
  }

  // Handle Prisma errors
  if (error instanceof Error) {
    const message = error.message;
    
    // Prisma unique constraint violation
    if (message.includes('Unique constraint')) {
      return new ConflictError('Resource already exists', { originalError: message });
    }
    
    // Prisma not found
    if (message.includes('Record not found')) {
      return new NotFoundError('Resource', message);
    }
    
    // Prisma connection error
    if (message.includes('Can\'t reach database server')) {
      return new DatabaseError('Database connection failed', { originalError: message });
    }
    
    // Generic error
    return new InternalError(message, { originalError: message });
  }

  // Unknown error type
  return new InternalError('An unknown error occurred');
}

/**
 * Format error untuk API response
 */
export function formatErrorResponse(error: AppError) {
  const response: any = {
    ok: false,
    message: error.message,
    type: error.type,
  };

  // Add context in development
  if (process.env.NODE_ENV === 'development' && error.context) {
    response.context = error.context;
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development' && error.stack) {
    response.stack = error.stack;
  }

  return response;
}

/**
 * Check if error is operational (expected) vs programming error
 */
export function isOperationalError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}