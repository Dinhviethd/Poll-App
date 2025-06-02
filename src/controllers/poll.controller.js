import PollService from '../services/poll.service.js';

class PollController {
    // Get all polls with pagination
    async getAllPolls(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const polls = await PollService.getAllPolls(page, limit);

            return res.status(200).json({
                success: true,
                data: polls
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get poll by ID
    async getPollById(req, res) {
        try {
            const poll = await PollService.getPollById(req.params.id);
            if (!poll) {
                return res.status(404).json({
                    success: false,
                    message: 'Poll not found'
                });
            }

            return res.status(200).json({
                success: true,
                data: poll
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Create new poll
    async createPoll(req, res) {
        try {
            const pollData = {
                ...req.body,
                creator: req.user._id
            };
            const poll = await PollService.createPoll(pollData);

            return res.status(201).json({
                success: true,
                message: 'Poll created successfully',
                data: poll
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Update poll
    async updatePoll(req, res) {
        try {
            const poll = await PollService.updatePoll(req.params.id, req.body);
            if (!poll) {
                return res.status(404).json({
                    success: false,
                    message: 'Poll not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Poll updated successfully',
                data: poll
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Delete poll
    async deletePoll(req, res) {
        try {
            const result = await PollService.deletePoll(req.params.id);
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Poll not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Poll deleted successfully'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Lock poll
    async lockPoll(req, res) {
        try {
            const poll = await PollService.lockPoll(req.params.id);
            if (!poll) {
                return res.status(404).json({
                    success: false,
                    message: 'Poll not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Poll locked successfully',
                data: poll
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Unlock poll
    async unlockPoll(req, res) {
        try {
            const poll = await PollService.unlockPoll(req.params.id);
            if (!poll) {
                return res.status(404).json({
                    success: false,
                    message: 'Poll not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Poll unlocked successfully',
                data: poll
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Add option to poll
    async addOption(req, res) {
        try {
            const { optionText } = req.body;
            const poll = await PollService.addOption(req.params.id, optionText);
            
            return res.status(200).json({
                success: true,
                message: 'Option added successfully',
                data: poll
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Remove option from poll
    async removeOption(req, res) {
        try {
            const poll = await PollService.removeOption(req.params.id, req.params.optionId);
            
            return res.status(200).json({
                success: true,
                message: 'Option removed successfully',
                data: poll
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default new PollController();