import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/restaurant/:restaurantId', reviewController.getByRestaurant.bind(reviewController));

// Protected routes
router.use(authenticate);
router.post('/', reviewController.create.bind(reviewController));
router.get('/my-reviews', reviewController.getMyReviews.bind(reviewController));
router.patch('/:id/respond', reviewController.respond.bind(reviewController));

export default router;
