import { NextResponse } from 'next/server';

export class ApiError extends Error {
  statusCode: number;
  code?: string;
  details?: any;

  constructor(statusCode: number, message: string, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

/**
 * Centralized API Error Mapper
 * 
 * Required mapping:
 * UNAUTHORIZED                -> 401
 * FORBIDDEN                   -> 403
 * NOT_FOUND                   -> 404
 * VALIDATION_ERROR            -> 400
 * CONCURRENCY_CONFLICT / P2034 -> 409
 * RATE_LIMITED                -> 429
 * STORAGE_UNAVAILABLE         -> 503
 * Unexpected error            -> 500
 */
export function handleApiError(error: any) {
  const message = error?.message || '';
  const code = error?.code || '';
  const statusCode = error?.statusCode;

  // 1. UNAUTHORIZED -> 401
  if (
    message === 'UNAUTHORIZED' ||
    code === 'UNAUTHORIZED' ||
    statusCode === 401 ||
    message.toLowerCase().includes('jwt') ||
    message.toLowerCase().includes('unauthorized')
  ) {
    return NextResponse.json(
      { error: 'Authentication required. Please sign in to continue.' },
      { status: 401 }
    );
  }

  // 2. FORBIDDEN -> 403
  if (
    message === 'FORBIDDEN' ||
    code === 'FORBIDDEN' ||
    statusCode === 403 ||
    message.startsWith('UNAUTHORIZED_STATE_TRANSITION') ||
    message.startsWith('FORBIDDEN_')
  ) {
    return NextResponse.json(
      { error: 'Access denied: Insufficient permissions for this action.' },
      { status: 403 }
    );
  }

  // 3. NOT_FOUND -> 404
  if (message === 'NOT_FOUND' || code === 'NOT_FOUND' || statusCode === 404) {
    return NextResponse.json(
      { error: 'The requested resource was not found.' },
      { status: 404 }
    );
  }

  // 4. VALIDATION_ERROR / BAD REQUEST -> 400
  if (
    message === 'VALIDATION_ERROR' ||
    code === 'VALIDATION_ERROR' ||
    statusCode === 400 ||
    error?.name === 'ZodError' ||
    message.startsWith('INVALID_')
  ) {
    return NextResponse.json(
      {
        error: message.startsWith('INVALID_') ? message : 'Invalid request parameters.',
        details: error?.issues || error?.errors || error?.details || undefined,
      },
      { status: 400 }
    );
  }

  // 5. CONCURRENCY_CONFLICT / P2034 -> 409
  if (
    message === 'CONCURRENCY_CONFLICT' ||
    code === 'CONCURRENCY_CONFLICT' ||
    code === 'P2034' ||
    statusCode === 409 ||
    message.includes('write conflict') ||
    message.includes('deadlock')
  ) {
    return NextResponse.json(
      { error: 'Reservation conflict: This resource is no longer available or was concurrently modified.' },
      { status: 409 }
    );
  }

  // 6. RATE_LIMITED -> 429
  if (message === 'RATE_LIMITED' || code === 'RATE_LIMITED' || statusCode === 429) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down and try again later.' },
      { status: 429 }
    );
  }

  // 7. STORAGE_UNAVAILABLE -> 503
  if (
    message === 'STORAGE_UNAVAILABLE' ||
    code === 'STORAGE_UNAVAILABLE' ||
    statusCode === 503
  ) {
    return NextResponse.json(
      { error: 'Persistent cloud storage is currently unavailable. Please try again later.' },
      { status: 503 }
    );
  }

  // 8. Unexpected Error -> 500 (Sanitized: never expose stack traces, connection strings or internal SQL)
  console.error('[API Internal Server Error]:', error?.stack || error);
  return NextResponse.json(
    { error: 'An unexpected internal server error occurred.' },
    { status: 500 }
  );
}
