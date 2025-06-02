import mongoose from 'mongoose';

const userSchema= new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
     phoneNumber: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
}, {
    timestamps: true, //tự động thêm createdAt và updatedAt
})

const UserModel = mongoose.model('users', userSchema); //Tạo model UserModel từ schema và tạo collection users trong MongoDB
export default UserModel;