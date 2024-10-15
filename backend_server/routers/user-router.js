const express = require('express')
const router = express.Router()
// import controllers 
const {createUser,loginUser,checkUserByEmail} = require('../controllers/user-controller')
router.get("/:email",checkUserByEmail)
router.post("/signup",createUser)
router.post("/login",loginUser)
module.exports = router 