import { alarmController } from '@bas/api/controllers';
import { authorization } from '@bas/api/middleware/authorization';
import express from 'express';
import { usePermissions } from '../middleware/use-permissions';
import { SystemPermission } from '@bas/constant/system-permission';
const router = express.Router();

// Alarm
router.use(authorization);
router.get('/', usePermissions([SystemPermission.ALARM_MANAGEMENT_VIEW]), alarmController.findAll);
router.get('/export-data', usePermissions([SystemPermission.ALARM_MANAGEMENT_VIEW]), alarmController.exportData);
router.delete('/all', usePermissions([SystemPermission.ALARM_MANAGEMENT_DELETE]), alarmController.removeAllAlarm);
router.delete('/:id', usePermissions([SystemPermission.ALARM_MANAGEMENT_DELETE]), alarmController.removeAlarm);

export default router;
