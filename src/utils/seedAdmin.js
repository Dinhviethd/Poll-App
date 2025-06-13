import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import UserModel from '../models/users.model.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        // Kết nối MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Kiểm tra xem đã có admin chưa
        const existingAdmin = await UserModel.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Admin account already exists');
            return;
        }

        // Tạo admin mới
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = await UserModel.create({
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
        });

        console.log('Admin account created successfully:', {
            username: admin.username,
            email: admin.email,
            role: admin.role
        });

    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Chạy script
seedAdmin();
