import {
  body,
  param,
} from 'express-validator';
import moment from 'moment';


export const recordLatestValidator = [
  param('id').isInt().toInt(),
  param('startTime').custom((value) => {
    if (value) {
      return moment(value).isValid();
    }
    return true;
  }),
  param('endTime').custom((value , { req  }) => {
    if (value) {
      return moment(value).isValid();
    }
    // check endTime is greater than startTime
    if (req?.query?.startTime && moment(value).isBefore(req.query.startTime)) {
      throw new Error('endTime must be greater than startTime');
    }

    return true;
  }),
];