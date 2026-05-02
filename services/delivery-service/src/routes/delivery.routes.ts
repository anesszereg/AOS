import { Router } from 'express';
import { deliveryController } from '../controllers/delivery.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', deliveryController.create.bind(deliveryController));
router.get('/driver', deliveryController.getDriverDeliveries.bind(deliveryController));
router.get('/order/:orderId', deliveryController.getByOrder.bind(deliveryController));
router.get('/:id', deliveryController.getById.bind(deliveryController));
router.patch('/:id/status', deliveryController.updateStatus.bind(deliveryController));
router.patch('/:id/location', deliveryController.updateLocation.bind(deliveryController));

export default router;
