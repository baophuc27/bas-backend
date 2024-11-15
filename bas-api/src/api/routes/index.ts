import { Router } from 'express';
import userRoutes from './user-routes';
import authRoutes from './auth-route';
import harborRoute from './harbor-route';
import berthRoute from './berth-route';
import commonRoute from './common-route';
import recordRoute from './record-route';
import vesselRoute from './vessel-route';
import alarmSettingRoute from './alarm-setting-route';
import alarmRoute from './alarm-route';
import { healthCheck } from '@bas/service/kafka-service';
const router = Router();

router.get('/health-check', async (req, res) => {
  res.json({ status: 'ok', kafka: await healthCheck() });
});
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/berth', berthRoute);
router.use('/harbor', harborRoute);
router.use('/common', commonRoute);
router.use('/records', recordRoute);
router.use('/vessels', vesselRoute);
router.use('/alarm-setting', alarmSettingRoute);
router.use('/alarm', alarmRoute);

export default router;
