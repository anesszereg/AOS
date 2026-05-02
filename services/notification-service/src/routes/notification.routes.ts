import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', notificationController.create.bind(notificationController));
router.get('/user', notificationController.getUserNotifications.bind(notificationController));
router.get('/:id', notificationController.getById.bind(notificationController));
router.patch('/:id/read', notificationController.markAsRead.bind(notificationController));
router.delete('/:id', notificationController.delete.bind(notificationController));

export default router;
