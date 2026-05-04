import { Router } from 'express';
import { restaurantController } from '../controllers/restaurant.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', restaurantController.getAll.bind(restaurantController));
router.get('/search', restaurantController.search.bind(restaurantController));

// Protected routes (must be before /:id to avoid route conflict)
router.get('/my-restaurant', authenticate, restaurantController.getMyRestaurant.bind(restaurantController));
router.post('/', authenticate, restaurantController.create.bind(restaurantController));
router.put('/:id', authenticate, restaurantController.update.bind(restaurantController));
router.delete('/:id', authenticate, restaurantController.delete.bind(restaurantController));

// Public route with :id param (must be last)
router.get('/:id', restaurantController.getById.bind(restaurantController));

export default router;
