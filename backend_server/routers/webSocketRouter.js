const express = require('express')
const router = express.Router()
const { handleFlushRoom } = require('../controllers/handleFlushRoom')
router.put("/:roomId",handleFlushRoom)
module.exports = router 