import express from 'express';
import UserController from '../../controllers/user.controller.js';
import { authenticateJWT, isAdmin } from '../../middleware/authenticateJWT.js';
import { validateRegister, validateLogin, validateUpdateProfile } from '../../middleware/user.validate.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, UserController.register);
router.post('/login', validateLogin, UserController.login);

router.get('/profile', authenticateJWT, UserController.getProfile);
router.put('/profile', authenticateJWT, validateUpdateProfile, UserController.updateProfile);

// Admin routes
router.get('/', authenticateJWT, isAdmin, UserController.getAllUsers);
router.get('/:id', authenticateJWT, isAdmin, UserController.getUserById);
router.delete('/:id', authenticateJWT, isAdmin, UserController.deleteUser);

export default router;
