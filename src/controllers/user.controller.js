import UserService from '../services/user.service.js';

class UserController {
    // Register new user
    async register(req, res) {
        try {
            const { username, email, password } = req.body;
            const user = await UserService.Register(username, email, password);
            
            return res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                }
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Login user
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const tokens = await UserService.Login(email, password);
            
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                data: tokens
            });
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get own profile
    async getProfile(req, res) {
        try {
            const user = await UserService.GetById(req.user._id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Remove sensitive data
            const { password, refreshToken, ...userProfile } = user.toObject();

            return res.status(200).json({
                success: true,
                data: { user: userProfile }
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Update own profile
    async updateProfile(req, res) {
        try {
            const updatedUser = await UserService.Update(req.user._id, req.body);
            
            return res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: { user: updatedUser }
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Admin: Get all users
    async getAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await UserService.GetAll(page, limit);
            
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Admin: Get user by ID
    async getUserById(req, res) {
        try {
            const user = await UserService.GetById(req.params.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Remove sensitive data
            const { password, refreshToken, ...userProfile } = user.toObject();

            return res.status(200).json({
                success: true,
                data: { user: userProfile }
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Admin: Delete user
    async deleteUser(req, res) {
        try {
            // Prevent admin from deleting themselves
            if (req.params.id === req.user._id.toString()) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete your own admin account'
                });
            }

            await UserService.Delete(req.params.id);
            
            return res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default new UserController();