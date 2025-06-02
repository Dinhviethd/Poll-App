import {mongoose} from 'mongoose';

const pollSchema= new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    options: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'votes',
        required: true,
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    voteCount: {
        type: Number,
        default: 0,
    },
    isLocked: {
        type: Boolean,
        default: false,
    },
    createAt:{
        type: Date,
        default: Date.now,
    },
    expireAt: {
        type: Date,
    },
})

const PollModel = mongoose.model('polls', pollSchema);
export default PollModel;