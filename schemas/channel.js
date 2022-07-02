const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const ChannelSchema = new mongoose.Schema({
    name: {
        type: String,
        default: '',
        required: true
    },
    admin: {
        type: ObjectId,
        ref: 'User'
    },
    participants: [
        { 
            type: ObjectId, 
            ref: 'User' 
        }
    ],
});

const Channel = mongoose.model("Channel", ChannelSchema);

module.exports = Channel;