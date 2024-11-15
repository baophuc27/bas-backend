import { validate } from './validator';
import { body } from 'express-validator';
import { BadRequestException } from '../errors';

const updateBerthValidator = validate([
  body('name').isString().withMessage('Name must be a string'),
  body('nameEn').optional({nullable : true}).isString().withMessage('NameEn must be a string'),
  body('description').optional({nullable : true}).isString().withMessage('Description must be a string'),
  body('directionCompass').optional().custom(
    (value) => {
      if (value && (value < -360 || value > 360)) {
        throw new BadRequestException('DirectionCompass must be between -360 and 360');
      }
      return true;
    }
  ),
  body('limitZone1').optional().isNumeric().withMessage('LimitZone1 must be a number').default(60),
  body('limitZone2').optional().isNumeric().withMessage('LimitZone2 must be a number').default(120),
  body('limitZone3').optional().isNumeric().withMessage('LimitZone3 must be a number').default(200),
  body('distanceFender').optional().isNumeric().withMessage('DistanceFender must be a number'),
  body('distanceDevice').optional().isNumeric().withMessage('DistanceDevice must be a number'),
]);

const configBerthValidator = validate([
  body('status').isNumeric().withMessage('status must be a number'),
  body('distanceToLeft').isFloat({
    min: 0,
    max: 50
  }).withMessage('distanceToLeft must be a number'),
  body('distanceToRight').isFloat({
    min: 0,
    max: 50
  }).withMessage('distanceToRight must be a number'),
  body('vesselDirection').isBoolean().withMessage('vesselDirection must be a boolean'),
  body('vessel').isObject().withMessage('vessel must be an object'),
])


export { updateBerthValidator, configBerthValidator };