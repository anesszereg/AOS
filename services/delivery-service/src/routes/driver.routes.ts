import { Router } from 'express';
import { driverController } from '../controllers/driver.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Driver status and location
router.patch('/status', driverController.updateStatus.bind(driverController));
router.patch('/location', driverController.updateLocation.bind(driverController));

// Driver earnings and stats
router.get('/earnings', driverController.getEarnings.bind(driverController));
router.get('/stats', driverController.getStats.bind(driverController));

// Orders and deliveries
router.get('/available-orders', driverController.getAvailableOrders.bind(driverController));
router.get('/active-delivery', driverController.getActiveDelivery.bind(driverController));

export default router;
