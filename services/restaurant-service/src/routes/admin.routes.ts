import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireRole(['admin']));

// Restaurant approval management
router.get('/restaurants/pending', adminController.getPendingRestaurants.bind(adminController));
router.patch('/restaurants/:id/approve', adminController.approveRestaurant.bind(adminController));
router.patch('/restaurants/:id/reject', adminController.rejectRestaurant.bind(adminController));

export default router;
