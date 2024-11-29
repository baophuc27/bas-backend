import express from 'express';
import { commonController } from '@bas/api/controllers';
import { uploadLogo } from '@bas/utils/multer';
import { checkApikey } from '../middleware/check-apikey';
import { authorization } from '../middleware/authorization';
const API_KEY = 'U2FsdGVkX1+h+5sFHnOBcJdFohfA7/lNm5TWcVeUGkc=';

const router = express.Router();
router.use(authorization);
router.get('/org-information', commonController.getOrgInformation);
router.post(
  '/upload-logo',
  checkApikey(API_KEY),
  uploadLogo.single('logo'),
  commonController.uploadLogo
);
router.put(
  '/reset-alarm-setting/:berthId',
  checkApikey(API_KEY),
  commonController.resetAlarmSetting
);

export default router;
