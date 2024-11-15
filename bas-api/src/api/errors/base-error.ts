import { HttpStatusCode } from '@bas/constant/http-status-code';

class BaseError extends Error {
  public readonly name: string;
  public readonly statusCode: HttpStatusCode;
  public readonly isOperational: boolean;
  public readonly internalCode: number;
  public errors: any[];

  constructor(
    name: string,
    statusCode: HttpStatusCode,
    description: string,
    isOperational: boolean,
    internalCode?: number
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.internalCode = internalCode || 0;
    this.errors = [];
    Error.captureStackTrace(this);
  }
}

export default BaseError;
