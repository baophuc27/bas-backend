import { BadRequestException } from '@bas/api/errors';

import { body, query } from 'express-validator';
import { validate } from './validator';

const availableFields = ['createdAt', 'updatedAt', 'roleId', 'phone', 'email', 'fullName', 'id'];

const createUserValidator = validate([
  // body('email')
  //   .isEmail()
  //   .withMessage('Email is Invalid')
  //   .custom(async (mail: string) => {
  //     const isDuplicate = await isDuplicateEmail(mail);
  //     if (isDuplicate) {
  //       throw new BadRequestException('Email is already in use');
  //     }
  //   }),
  body('fullName').isLength({ min: 3 }).withMessage('fullName is required'),
  body('phone').custom(async (phone: string) => {
    const matches = phone?.match(/[\d\-\s\(\)\.]+/);
    if (phone && (matches === null || phone?.length < 8)) {
      throw new BadRequestException('Phone is invalid');
    }
  }),
  body('roleId')
    .notEmpty()
    .withMessage('Role is required')
    .isNumeric()
    .withMessage('Role is Numeric'),
]);

const updateUserValidator = validate([
  body('email').isEmail().withMessage('Email is Invalid'),
  body('fullName').isLength({ min: 3 }).withMessage('fullName is Invalid'),
  body('phone').custom(async (phone: string) => {
    const matches = phone?.match(/[\d\-\s\(\)\.]+/);
    if (phone && (matches === null || phone?.length < 8)) {
      throw new BadRequestException('Phone is invalid');
    }
  }),
]);

const updateProfileValidator = validate([
  body('email').isEmail().withMessage('Email is Invalid'),
  body('fullName').isLength({ min: 3 }).withMessage('fullName is Invalid'),
  body('phone').custom(async (phone: string) => {
    const matches = phone?.match(/[\d\-\s\(\)\.]+/);
    if (phone && (matches === null || phone?.length < 8)) {
      throw new BadRequestException('Phone is invalid');
    }
  }),
]);

const queryValidator = validate([
  query('order')
    .optional({
      nullable: true,
    })
    .isIn(availableFields)
    .withMessage(`order field must be in [${availableFields.join('; ')}]`),
  query('mode').optional().isIn(['ASC', 'DESC']).withMessage('Invalid mode field, it must be ASC or DESC'),
  query('page').isNumeric().withMessage('page must be a number'),
  query('amount').isNumeric().withMessage('amount must be a number'),
  query('roleId').optional({
    nullable: true,
  }).isNumeric().withMessage('roleId must be a number'),
  query('search').optional({
    nullable: true,
  }).isString().withMessage('search must be a string'),
]);

export { createUserValidator, updateUserValidator, queryValidator, updateProfileValidator };
