import mongoose from "mongoose";

const voteSchema= new mongoose.Schema({
    text:{
        type: String,
        required: true,
    },
    pollId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'polls',
        required: true
    },
    voteCount: {
        type: Number, 
        default: 0,
    },
    userVote: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    }],
    
    
})

const voteModel= mongoose.model("votes", voteSchema);
export default voteModel;