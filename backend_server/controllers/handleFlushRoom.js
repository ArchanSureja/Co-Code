const Room = require("../model/room");
const User = require("../model/user");

async function handleFlushRoom(req, res) {
    try {
      const { roomId } = req.params;
      const updates = req.body;
      const room = await Room.findOne({ roomId : roomId });
      console.log(room);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
      const updatedRoom = await Room.findOneAndUpdate({ roomId }, updates, { new: true });
      res.status(200).json(updatedRoom);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
module.exports = {
     handleFlushRoom
  };