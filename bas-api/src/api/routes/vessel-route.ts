import express from 'express';
import { vesselController } from '@bas/api/controllers';
import { authorization } from '../middleware/authorization';
import { SystemPermission } from '@bas/constant/system-permission';
import { usePermissions } from '../middleware/use-permissions';
import { attachOrgId } from '../middleware/attach-orgid';

const router = express.Router();
router.use(authorization);
router.use(attachOrgId);
router.get(
  '/',
  usePermissions([SystemPermission.VESSEL_MANAGEMENT_VIEW]),
  vesselController.getListing
);

export default router;
