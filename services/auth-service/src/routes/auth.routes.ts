import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate, registerSchema, loginSchema, refreshSchema } from '../middleware/validation';

const router = Router();

router.post('/register', validate(registerSchema), authController.register.bind(authController));
router.post('/login', validate(loginSchema), authController.login.bind(authController));
router.post('/refresh', validate(refreshSchema), authController.refresh.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.get('/verify', authController.verify.bind(authController));

export default router;
