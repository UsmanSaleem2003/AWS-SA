import { ZodError } from 'zod';

import { HttpError } from './http-error.js';

export function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        details: error.flatten()
      }
    });
  }

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        details: error.details
      }
    });
  }

  return res.status(500).json({
    error: {
      message: 'Internal server error'
    }
  });
}
