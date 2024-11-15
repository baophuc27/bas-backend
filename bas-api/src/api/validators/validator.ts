import { BadRequestException } from '@bas/api/errors';
import express from 'express';
import { ValidationChain, validationResult } from 'express-validator';

const validate = (validations: ValidationChain[]) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const exception = new BadRequestException("Validation failure");
    exception.errors = errors.array();

    next(exception);
  };
};


export { validate };
