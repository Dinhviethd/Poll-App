import VoteModel from '../models/votes.model.js';
import PollModel from '../models/polls.model.js';
import mongoose from 'mongoose';

class VoteController {
    // Vote on a poll option
    async vote(req, res) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { pollId } = req.params;
            const { optionId } = req.body;
            const userId = req.user._id;

            // Check if poll exists and is not locked
            const poll = await PollModel.findById(pollId).session(session);
            if (!poll) {
                return res.status(404).json({
                    success: false,
                    message: 'Poll not found'
                });
            }

            if (poll.isLocked) {
                return res.status(403).json({
                    success: false,
                    message: 'Poll is locked'
                });
            }

            // Check if option exists in poll
            if (!poll.options.includes(optionId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid option'
                });
            }

            // Check if user has already voted
            const existingVote = await VoteModel.findOne({
                _id: optionId,
                userVote: userId
            }).session(session);

            if (existingVote) {
                return res.status(400).json({
                    success: false,
                    message: 'You have already voted for this option'
                });
            }

            // Add vote
            await VoteModel.findByIdAndUpdate(
                optionId,
                {
                    $inc: { voteCount: 1 },
                    $push: { userVote: userId }
                },
                { session }
            );

            // Update poll vote count
            await PollModel.findByIdAndUpdate(
                pollId,
                { $inc: { voteCount: 1 } },
                { session }
            );

            await session.commitTransaction();

            return res.status(200).json({
                success: true,
                message: 'Vote recorded successfully'
            });
        } catch (error) {
            await session.abortTransaction();
            return res.status(500).json({
                success: false,
                message: error.message
            });
        } finally {
            session.endSession();
        }
    }

    // Remove vote from a poll option
    async unvote(req, res) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { pollId } = req.params;
            const { optionId } = req.body;
            const userId = req.user._id;

            // Check if poll exists and is not locked
            const poll = await PollModel.findById(pollId).session(session);
            if (!poll) {
                return res.status(404).json({
                    success: false,
                    message: 'Poll not found'
                });
            }

            if (poll.isLocked) {
                return res.status(403).json({
                    success: false,
                    message: 'Poll is locked'
                });
            }

            // Check if user has voted
            const existingVote = await VoteModel.findOne({
                _id: optionId,
                userVote: userId
            }).session(session);

            if (!existingVote) {
                return res.status(400).json({
                    success: false,
                    message: 'You have not voted for this option'
                });
            }

            // Remove vote
            await VoteModel.findByIdAndUpdate(
                optionId,
                {
                    $inc: { voteCount: -1 },
                    $pull: { userVote: userId }
                },
                { session }
            );

            // Update poll vote count
            await PollModel.findByIdAndUpdate(
                pollId,
                { $inc: { voteCount: -1 } },
                { session }
            );

            await session.commitTransaction();

            return res.status(200).json({
                success: true,
                message: 'Vote removed successfully'
            });
        } catch (error) {
            await session.abortTransaction();
            return res.status(500).json({
                success: false,
                message: error.message
            });
        } finally {
            session.endSession();
        }
    }

    // Get all votes for a poll
    async getVotesForPoll(req, res) {
        try {
            const { pollId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const votes = await VoteModel.find({ pollId })
                .sort({ voteCount: -1 })
                .skip(skip)
                .limit(limit)
                .populate('userVote', 'username');

            const total = await VoteModel.countDocuments({ pollId });

            return res.status(200).json({
                success: true,
                data: {
                    votes,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalVotes: total
                }
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get all votes by current user
    async getMyVotes(req, res) {
        try {
            const userId = req.user._id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const votes = await VoteModel.find({ userVote: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('pollId', 'title');

            const total = await VoteModel.countDocuments({ userVote: userId });

            return res.status(200).json({
                success: true,
                data: {
                    votes,
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalVotes: total
                }
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default new VoteController();
