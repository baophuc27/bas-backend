import { BadRequestException } from '@bas/api/errors';
import { body, query } from 'express-validator';
import { validate } from './validator';

const availableFields = ['code', 'status', 'displayName', 'lastHeartbeat', 'lastDataActive', 'createdAt', 'updatedAt'];

const createDataAppValidator = validate([
  body('code')
    .notEmpty()
    .withMessage('Code is required')
    .matches(/^[A-Z]\d{3}[A-Z][0-9A-Z]$/)
    .withMessage('Invalid code format'),

  body('status')
    .optional(),
  
  body('displayName')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Display name must be between 1 and 100 characters'),
  
  body('berthId')
    .optional()
]);

const updateDataAppValidator = validate([
  body('status')
    .optional(),
  
  body('displayName')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Display name must be between 1 and 100 characters'),
  
  body('berthId')
    .optional()
]);

const queryValidator = validate([
  query('order')
    .optional({
      nullable: true,
    })
    .isIn(availableFields)
    .withMessage(`order field must be in [${availableFields.join('; ')}]`),
  
  query('mode')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('Invalid mode field, it must be ASC or DESC'),
  
  query('page')
    .optional()
    .isNumeric()
    .withMessage('page must be a number'),
  
  query('amount')
    .optional()
    .isNumeric()
    .withMessage('amount must be a number'),
  
  query('status')
    .optional({
      nullable: true,
    })
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Invalid status'),
  
  query('search')
    .optional({
      nullable: true,
    })
    .isString()
    .withMessage('search must be a string')
]);

const updateStatusValidator = validate([
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Invalid status')
]);

export {
  createDataAppValidator,
  updateDataAppValidator,
  queryValidator,
  updateStatusValidator
};