import { userController } from '@bas/api/controllers';
import express from 'express';
import { authorization } from '@bas/api/middleware/authorization';
import { queryValidator } from '@bas/api/validators/user-validator';
import { useRoles } from '../middleware/use-roles';
import { SystemRole } from '@bas/database/master-data/system-role';

const router = express.Router();

// User Management
router.get('/', authorization, useRoles([SystemRole.ADMIN]), queryValidator, userController.findAllUser);
router.get('/me', authorization, userController.findMyInformation);
router.get('/data-token', authorization, userController.getSocketToken);
router.get('/roles', authorization, userController.getRoles);
// router.put('/:id', adminAuthentication, updateUserValidator, userController.updateUserById);
// router.delete('/:id', adminAuthentication, userController.deleteOneUserById);

export default router;
