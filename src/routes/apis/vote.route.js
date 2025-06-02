import express from 'express';
import { authenticateJWT } from '../../middleware/authenticateJWT.js';
import VoteController from '../../controllers/vote.controller.js';

const router = express.Router();


router.post('/:pollId/vote', authenticateJWT, VoteController.vote);
router.delete('/:pollId/unvote', authenticateJWT, VoteController.unvote);
router.get('/:pollId/votes', VoteController.getVotesForPoll);
router.get('/my-votes', authenticateJWT, VoteController.getMyVotes);

export default router;