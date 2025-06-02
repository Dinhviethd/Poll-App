import express from 'express';
import { authenticateJWT, isAdmin } from '../../middleware/authenticateJWT.js';
import PollController from '../../controllers/poll.controller.js';

const router = express.Router();

// Public routes
router.get('/', PollController.getAllPolls);
router.get('/:id', PollController.getPollById);

// Admin 
router.post('/', authenticateJWT, isAdmin, PollController.createPoll);
router.put('/:id', authenticateJWT, isAdmin, PollController.updatePoll);
router.delete('/:id', authenticateJWT, isAdmin, PollController.deletePoll);

// Poll management routes
router.patch('/:id/lock', authenticateJWT, isAdmin, PollController.lockPoll);
router.patch('/:id/unlock', authenticateJWT, isAdmin, PollController.unlockPoll);
router.post('/:id/options', authenticateJWT, isAdmin, PollController.addOption);
router.delete('/:id/options/:optionId', authenticateJWT, isAdmin, PollController.removeOption);

export default router;