import express from 'express';
import { authorization } from '@bas/api/middleware/authorization';
import { harborController } from '@bas/api/controllers';
import { usePermissions } from '../middleware/use-permissions';
import { SystemPermission } from '@bas/constant/system-permission';
import { attachOrgId } from '@bas/api/middleware/attach-orgid';
import { checkAndCreateHarbor } from '@bas/api/middleware/checkAndCreateHarbor';
const router = express.Router();

// Harbor
router.use(authorization);
router.use(attachOrgId);
router.use(checkAndCreateHarbor);
router.get(
  '/information',
  usePermissions([SystemPermission.PORT_DASHBOARD_VIEW, SystemPermission.PORT_INFORMATION_VIEW]),
  harborController.getOne
);
router.put(
  '/configuration',
  usePermissions([SystemPermission.PORT_INFORMATION_EDIT]),
  harborController.configuration
);

export default router;
