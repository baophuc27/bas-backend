import express from 'express';
import { authorization } from '@bas/api/middleware/authorization';
import recordController from '../controllers/record-controller';
import { recordLatestValidator } from '../validators/record-validator';
import { SystemPermission } from '@bas/constant/system-permission';
import { usePermissions } from '../middleware/use-permissions';
import { attachOrgId } from '../middleware/attach-orgid';

const router = express.Router();
router.use(attachOrgId);    
router.get('/aggregates/:id',usePermissions([SystemPermission.RECORDING_MANAGEMENT_VIEW]), recordController.getAggregates);
router.get('/export-data/:id', usePermissions([SystemPermission.RECORDING_MANAGEMENT_VIEW]), recordController.exportData);
router.get('/chart/:id',usePermissions([SystemPermission.RECORDING_MANAGEMENT_VIEW]), recordController.getChart);

router.post('/:id/sync',usePermissions([SystemPermission.RECORDING_MANAGEMENT_VIEW]), recordController.sync);

router.get('/latest',usePermissions([SystemPermission.RECORDING_MANAGEMENT_VIEW, SystemPermission.BERTH_DASHBOARD_VIEW]), recordLatestValidator , recordController.findLatestRecord);

router.delete('/:id',usePermissions([SystemPermission.RECORDING_MANAGEMENT_DELETE]), recordController.remove);
router.get('/:id',usePermissions([SystemPermission.RECORDING_MANAGEMENT_VIEW]), recordController.findAllByRecord);

router.get('/', usePermissions([SystemPermission.RECORDING_MANAGEMENT_VIEW]), recordController.findAll);
export default router;
