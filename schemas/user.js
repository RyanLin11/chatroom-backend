const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['Admin', 'User'],
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    display_name: {
        type: String,
    },
    image: {
        type: String,
    },
    channels: [
        {
            type: ObjectId,
            ref: "Channel",
        }
    ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;