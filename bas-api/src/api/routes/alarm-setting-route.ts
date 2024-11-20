import { alarmSettingController, authController } from '@bas/api/controllers';
import { authorization } from '@bas/api/middleware/authorization';
import express from 'express';
import { usePermissions } from '../middleware/use-permissions';
import { SystemPermission } from '@bas/constant/system-permission';
import { attachOrgId } from '../middleware/attach-orgid';

const router = express.Router();
router.use(authorization);
router.use(attachOrgId);
router.get('/status', alarmSettingController.getAlarmStatus);
router.get(
  '/:berthId',
  usePermissions([SystemPermission.ALARM_SETTING_VIEW]),
  alarmSettingController.findSetting
);
router.put(
  '/',
  usePermissions([SystemPermission.ALARM_SETTING_EDIT]),
  alarmSettingController.updateSetting
);

export default router;
