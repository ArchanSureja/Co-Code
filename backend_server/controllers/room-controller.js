// roomController.js

const Room = require("../model/room");
const User = require("../model/user");


// Create a new room
async function createRoom(req, res) {
  try {
    console.log(req.body);
    const { roomId, createdBy, participants, contents } = req.body;
    // Ensure that the creator exists in the User collection
    const user = await User.findOne({ username: createdBy.username });
    if (!user) {
      return res.status(400).json({ error: "Creator user does not exist" });
    }

    // Create a new room
    const newRoom = new Room({
      roomId,
      createdBy,
      participants: participants || [],
      messages: [],
      contents: "",
    });

    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get a room by roomId, but only if the user is the creator or a participant
async function getRoom(req, res) {
  try {
    const { roomId } = req.params;

    // Find the room by roomId
    const room = await Room.findOne({ roomId : roomId });
    console.log("fetched rooom ",room)
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if the user is either the creator or a participant
    const { username } = req.user.newUser;
    console.log("potential bug might be this : " , username) // Assuming `req.user` contains the authenticated user
    const isParticipantOrCreator = room.createdBy.username === username || 
      room.participants.some(participant => participant.username === username);

    if (!isParticipantOrCreator) {
      return res.status(403).json({ error: "Access denied. You're not a participant or the creator." });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update a room, but only if the user is a participant or the creator
async function updateRoom(req, res) {
  try {
    const { roomId } = req.params;
    const updates = req.body;

    // Find the room by roomId
    const room = await Room.findOne({ roomId : roomId });
    console.log(room);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if the user is either the creator or a participant
    let { username } = req.user;
       // check if user request from the web socket server
       if(username===undefined && "newUser" in req.user)
        {
          console.log("User request from web socket server " + req.user)
           username = req.user.newUser.username
        }
    console.log("REQUEST SENT BY : ",username) // Assuming `req.user` contains the authenticated user
    const isParticipantOrCreator = room.createdBy.username === username || 
      room.participants.some(participant => participant.username === username);

    if (!isParticipantOrCreator) {
      return res.status(403).json({ error: "Permission denied. You are not a participant or the creator." });
    }

    // Perform the update
    const updatedRoom = await Room.findOneAndUpdate({ roomId }, updates, { new: true });
    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete a room, but only if the user is the creator
async function deleteRoom(req, res) {
  try {
    const { roomId } = req.params;

    // Find the room by roomId
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if the user is the creator
    const { username } = req.user.newUser; 
    console.log("DELETE",username)
    if (room.createdBy.username !== username) {
      return res.status(403).json({ error: "Permission denied. Only the creator can delete this room." });
    }

    // Perform the delete
    await Room.findOneAndDelete({ roomId });
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createRoom,
  getRoom,
  updateRoom,
  deleteRoom,
};
