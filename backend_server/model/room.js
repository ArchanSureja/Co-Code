const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    createdBy: {
        username: { type: String, required: true },
    },
    participants: [{
        username: { type: String, required: true }
    }],
    messages: [{
        username: { type: String, required: true },
        text: { type: String, required: true },
    }],
    contents:
    {
        type: String
    }
})

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;

