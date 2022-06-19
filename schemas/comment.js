const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const CommentSchema = new mongoose.Schema({
    channel: {
        type: ObjectId,
        ref: 'Channel',
        required: true,
    },
    sender: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true
    },
    post_time: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;