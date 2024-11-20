import express from 'express';
import { authorization } from '@bas/api/middleware/authorization';
import { berthController } from '@bas/api/controllers';
import { configBerthValidator, updateBerthValidator } from '../validators/berth-validator';
import { usePermissions } from '../middleware/use-permissions';
import { SystemPermission } from '@bas/constant/system-permission';
import { attachOrgId } from '@bas/api/middleware/attach-orgid';

const router = express.Router();

router.use(authorization);
router.use(attachOrgId);
router.post(
  '/:id/finish-session',
  usePermissions([SystemPermission.BERTH_DASHBOARD_EDIT]),
  berthController.finishSession
);
router.put(
  '/:id/config',
  usePermissions([SystemPermission.BERTH_DASHBOARD_EDIT]),
  configBerthValidator,
  berthController.updateConfigurations
);
router.post(
  '/:id/reset',
  usePermissions([SystemPermission.BERTH_DASHBOARD_EDIT]),
  berthController.resetBerth
);

router.get('/status', berthController.getStatus);
router.delete(
  '/:id',
  usePermissions([SystemPermission.BERTH_MANAGEMENT_DELETE]),
  berthController.deleteBerth
);
router.get(
  '/:id',
  usePermissions([SystemPermission.BERTH_DASHBOARD_VIEW, SystemPermission.BERTH_MANAGEMENT_VIEW]),
  berthController.getOne
);
router.put(
  '/:id',
  usePermissions([SystemPermission.BERTH_DASHBOARD_EDIT, SystemPermission.BERTH_MANAGEMENT_EDIT]),
  updateBerthValidator,
  berthController.update
);

router.post(
  '/',
  usePermissions([SystemPermission.BERTH_MANAGEMENT_CREATE]),
  updateBerthValidator,
  berthController.create
);
router.get(
  '/',
  usePermissions([SystemPermission.BERTH_DASHBOARD_VIEW, SystemPermission.BERTH_MANAGEMENT_VIEW]),
  berthController.getAll
);

export default router;
