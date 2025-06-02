import mongoose from 'mongoose';

const accountSchema= new mongoose.Schema({
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
    refreshToken: {
        type: String,
    },
},
{
    timestamps: true, 
});

const AccountModel = mongoose.model('accounts', accountSchema);
export default AccountModel;