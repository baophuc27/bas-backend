import { authController } from '@bas/api/controllers';
import { authorization } from '@bas/api/middleware/authorization';
import { controllerPath } from '@bas/constant';

import express from 'express';
const router = express.Router();

// Auth
router.post(controllerPath.IDENTIFIER, authController.login);
router.post(controllerPath.REFRESH, authController.refresh);
router.post(controllerPath.LOGOUT, authController.logout);

export default router;
