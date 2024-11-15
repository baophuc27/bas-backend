import { NextFunction, Request, Response } from 'express';
import { logError } from '@bas/utils/logger';
import { BaseError } from '@bas/api/errors';

export const handleError = async (err: Error): Promise<void> => {
  logError(err);
  console.log(err);
  // Send mail or do something else to alert some error occured
};

export const isTrustedError = (error: Error | BaseError) => {
  if (error instanceof BaseError) {
    return error.isOperational;
  }
  return false;
};

export const errorHandler = (err: BaseError, req: Request, res: Response, next: NextFunction) => {
  logError(err);

  if (!isTrustedError(err)) {
    handleError(err);
    err.message = 'Internal server error';
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    internalCode: err.internalCode,
    errors: err.errors || [],
  });
};
