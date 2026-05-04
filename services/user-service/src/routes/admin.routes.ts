import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireRole(['admin']));

// User management
router.get('/users', adminController.getAllUsers.bind(adminController));
router.get('/users/:userId', adminController.getUserById.bind(adminController));
router.patch('/users/:userId/status', adminController.updateUserStatus.bind(adminController));
router.delete('/users/:userId', adminController.deleteUser.bind(adminController));

// Platform statistics
router.get('/stats', adminController.getStats.bind(adminController));

export default router;
