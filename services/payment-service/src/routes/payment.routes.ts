import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', paymentController.create.bind(paymentController));
router.get('/order/:orderId', paymentController.getByOrder.bind(paymentController));
router.get('/:id', paymentController.getById.bind(paymentController));
router.patch('/:id/status', paymentController.updateStatus.bind(paymentController));

export default router;
