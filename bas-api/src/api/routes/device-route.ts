import express from 'express';
import { deviceController } from '@bas/api/controllers';
import { authorization } from '@bas/api/middleware/authorization';
const router = express.Router();

// Device
router.get('/device/:id', authorization, deviceController.getDeviceById);