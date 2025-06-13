import PollModel from '../models/polls.model.js';
import VoteModel from '../models/votes.model.js';
import mongoose from 'mongoose';

class PollService {
    // Get all polls with pagination
    async getAllPolls(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const polls = await PollModel.find()
                .sort({ createAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('creator', 'username')
                .populate('options');

            const total = await PollModel.countDocuments();

            return {
                polls,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalPolls: total
            };
        } catch (error) {
            throw new Error('Error getting polls: ' + error.message);
        }
    }

    // Get poll by ID
    async getPollById(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid poll ID');
            }

            const poll = await PollModel.findById(id)
                .populate('creator', 'username')
                .populate('options');

            return poll;
        } catch (error) {
            throw new Error('Error getting poll: ' + error.message);
        }
    }    // Create new poll
    async createPoll(pollData) {
        try {
            const { title, description, creator } = pollData;
            const options = pollData.options || [];

            // First create poll
            const newPoll = await PollModel.create({
                title,
                description,
                options: [],
                creator,
                voteCount: 0,
                isLocked: false
            });

            // Then create vote options with the poll ID
            const optionDocs = options.map(optionText => ({
                text: optionText,
                pollId: newPoll._id,
                voteCount: 0,
                userVote: []
            }));

            const createdOptions = await VoteModel.create(optionDocs);

            // Update poll with option references
            newPoll.options = createdOptions.map(opt => opt._id);
            await newPoll.save();

            return await PollModel.findById(newPoll._id).populate('options');
        } catch (error) {
            throw new Error('Error creating poll: ' + error.message);
        }
    }

    // Update poll
    async updatePoll(id, updateData) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid poll ID');
            }

            const poll = await PollModel.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true }
            ).populate('options');

            return poll;
        } catch (error) {
            throw new Error('Error updating poll: ' + error.message);
        }
    }

    // Delete poll
    async deletePoll(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid poll ID');
            }

            const poll = await PollModel.findById(id);
            if (!poll) {
                throw new Error('Poll not found');
            }

            // Delete all associated votes
            await VoteModel.deleteMany({ _id: { $in: poll.options } });
            // Delete the poll
            await PollModel.findByIdAndDelete(id);

            return true;
        } catch (error) {
            throw new Error('Error deleting poll: ' + error.message);
        }
    }

    // Lock poll
    async lockPoll(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid poll ID');
            }

            const poll = await PollModel.findByIdAndUpdate(
                id,
                { isLocked: true },
                { new: true }
            ).populate('options');

            return poll;
        } catch (error) {
            throw new Error('Error locking poll: ' + error.message);
        }
    }

    // Unlock poll
    async unlockPoll(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid poll ID');
            }

            const poll = await PollModel.findByIdAndUpdate(
                id,
                { isLocked: false },
                { new: true }
            ).populate('options');

            return poll;
        } catch (error) {
            throw new Error('Error unlocking poll: ' + error.message);
        }
    }

    // Add option to poll
    async addOption(pollId, optionText) {
        try {
            if (!mongoose.Types.ObjectId.isValid(pollId)) {
                throw new Error('Invalid poll ID');
            }

            const poll = await PollModel.findById(pollId);
            if (!poll) {
                throw new Error('Poll not found');
            }

            if (poll.isLocked) {
                throw new Error('Cannot add option to locked poll');
            }

            // Create new option
            const newOption = await VoteModel.create({
                text: optionText,
                pollId: poll._id,
                voteCount: 0,
                userVote: []
            });

            // Add option to poll
            poll.options.push(newOption._id);
            await poll.save();

            return await PollModel.findById(pollId).populate('options');
        } catch (error) {
            throw new Error('Error adding option: ' + error.message);
        }
    }

    // Remove option from poll
    async removeOption(pollId, optionId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(pollId) || !mongoose.Types.ObjectId.isValid(optionId)) {
                throw new Error('Invalid poll or option ID');
            }

            const poll = await PollModel.findById(pollId);
            if (!poll) {
                throw new Error('Poll not found');
            }

            if (poll.isLocked) {
                throw new Error('Cannot remove option from locked poll');
            }

            // Remove option from poll
            poll.options = poll.options.filter(opt => opt.toString() !== optionId);
            await poll.save();

            // Delete option
            await VoteModel.findByIdAndDelete(optionId);

            return await PollModel.findById(pollId).populate('options');
        } catch (error) {
            throw new Error('Error removing option: ' + error.message);
        }
    }
}

export default new PollService();