import express from 'express'
import pollRoute from './apis/poll.route.js'
import userRoute from './apis/user.route.js'
import voteRoute from './apis/vote.route.js'
const router= express.Router();

router.use('/polls', pollRoute);
router.use('/users', userRoute);
router.use('/votes', voteRoute);

export default router;