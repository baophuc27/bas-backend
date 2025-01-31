import express from 'express';
import { authorization } from '@bas/api/middleware/authorization';
import { dataAppController } from '@bas/api/controllers';
import { usePermissions } from '../middleware/use-permissions';
import { SystemPermission } from '@bas/constant/system-permission';
import { createDataAppValidator, updateDataAppValidator } from '../validators/data-app-validator';

const router = express.Router();

router.use(authorization);

// Get available data app code
router.get(
  '/available-code',
  usePermissions([SystemPermission.BERTH_MANAGEMENT_VIEW]),
  dataAppController.getAvailableCode
);

// Get all data apps with filtering
router.get(
  '/',
  usePermissions([SystemPermission.BERTH_MANAGEMENT_VIEW, SystemPermission.BERTH_MANAGEMENT_VIEW]),
  dataAppController.getAll
);

// Create data app
router.post(
  '/',
  usePermissions([SystemPermission.BERTH_MANAGEMENT_CREATE]),
  createDataAppValidator,
  dataAppController.create
);

// Get data app by code
router.get(
  '/:code',
  usePermissions([SystemPermission.BERTH_MANAGEMENT_VIEW, SystemPermission.BERTH_MANAGEMENT_VIEW]),
  dataAppController.getOne
);

// Update data app
router.put(
  '/:code',
  usePermissions([SystemPermission.BERTH_MANAGEMENT_EDIT]),
  updateDataAppValidator,
  dataAppController.update
);

// Get active data apps
router.get(
  '/status/active',
  usePermissions([SystemPermission.BERTH_MANAGEMENT_VIEW]),
  dataAppController.getActive
);

// Update data app status
router.put(
  '/:code/status',
  usePermissions([SystemPermission.BERTH_MANAGEMENT_EDIT]),
  dataAppController.updateStatus
);

export default router;