import { Router } from 'express';
import { menuController } from '../controllers/menu.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/restaurant/:restaurantId', menuController.getByRestaurant.bind(menuController));
router.get('/:id', menuController.getById.bind(menuController));
router.get('/', menuController.getAll.bind(menuController));

// Protected routes
router.post('/', authenticate, menuController.create.bind(menuController));
router.put('/:id', authenticate, menuController.update.bind(menuController));
router.delete('/:id', authenticate, menuController.delete.bind(menuController));

export default router;
