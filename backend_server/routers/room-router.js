const express = require('express')
const router = express.Router()
// import controllers 
const {createRoom,getRoom,updateRoom,deleteRoom} = require('../controllers/room-controller')
router.post("/",createRoom)
router.get("/:roomId",getRoom)
router.put("/:roomId",updateRoom)
router.delete("/:roomId",deleteRoom)
module.exports = router 