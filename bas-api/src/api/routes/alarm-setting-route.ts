import { alarmSettingController, authController } from '@bas/api/controllers';
import { authorization } from '@bas/api/middleware/authorization';
import express from 'express';
import { usePermissions } from '../middleware/use-permissions';
import { SystemPermission } from '@bas/constant/system-permission';
const router = express.Router();

// AlarmSetting
router.use(authorization);
router.get('/status', alarmSettingController.getAlarmStatus);
router.get('/:berthId', usePermissions([SystemPermission.ALARM_SETTING_VIEW]) ,alarmSettingController.findSetting);
router.put('/', usePermissions([SystemPermission.ALARM_SETTING_EDIT]), alarmSettingController.updateSetting);

export default router;
