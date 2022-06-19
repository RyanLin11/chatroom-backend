const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const ChannelSchema = new mongoose.Schema({
    participants: [{ type: ObjectId, ref: 'User' }],
});

const Channel = mongoose.model("Channel", ChannelSchema);

module.exports = Channel;