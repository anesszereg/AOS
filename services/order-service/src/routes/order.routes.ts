import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', orderController.create.bind(orderController));
router.get('/user', orderController.getUserOrders.bind(orderController));
router.get('/restaurant/:restaurantId', orderController.getRestaurantOrders.bind(orderController));
router.get('/:id', orderController.getById.bind(orderController));
router.patch('/:id/status', orderController.updateStatus.bind(orderController));
router.delete('/:id', orderController.cancel.bind(orderController));

export default router;
