import { Router } from 'express';
import { profileController } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, profileController.getProfile.bind(profileController));
router.post('/', authenticate, profileController.createProfile.bind(profileController));
router.put('/', authenticate, profileController.updateProfile.bind(profileController));

export default router;
