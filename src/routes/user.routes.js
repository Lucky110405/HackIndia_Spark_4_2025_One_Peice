import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes
router.use(verifyJWT);
router.get('/profile', userController.getUserProfile);
router.patch('/update', userController.updateUser);
router.get('/assets', userController.getUserAssets);
router.post('/verify-wallet', userController.verifyWalletAddress);

export default router;