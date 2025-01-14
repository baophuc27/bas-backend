import express from 'express';
import { syncController } from '@bas/api/controllers';
import { authorization } from '../middleware/authorization';
import { SystemPermission } from '@bas/constant/system-permission';
import { usePermissions } from '../middleware/use-permissions';

const router = express.Router();
router.post(
  '/',
  syncController.syncDataApp
);

export default router;
