const express = require('express')
const app = express()
const http = require('http')
const { Server } = require("socket.io")
const multer = require('multer')
const server = http.createServer(app)
const RoomMap = require('./temp_db/roomMap')
const fs = require('fs');
const path = require('path')
const cors = require('cors')
app.use(cors())
const socket_server = new Server(server,{
    cors:{
        origin: "*",
    }
})


// file upload related code
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/') 
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '-' + file.originalname) 
//     }
// })
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
// websocket related code 
let userroomMapper = {}
let activeUserMap = {}
let roomMap = new RoomMap()
let online_map = {}

socket_server.on("connection",(socket)=>{
    console.log("new user connected : " + socket.id)
    socket.on("disconnect",()=>{
        console.log("user disconnected : " + socket.id)
        roomId = userroomMapper[socket.id]
        if(activeUserMap[roomId])
            {
                activeUserMap[roomId]-=1;
                if(activeUserMap[roomId]===0)
                {
                    roomMap.flushRoomToDB(roomId)
                    delete activeUserMap[roomId]
                }
            }
            console.log("members currently online : " +  (roomId in activeUserMap ? activeUserMap[roomId] : 0 ) )
    })
    socket.on("leave-room",(roomId,username)=>{
        if(online_map[roomId])
        {
            online_map[roomId] = online_map[roomId].filter((item)=>item!=username)
            
        }
        console.log("one user leaved from room : " + roomId,username)
        console.log(online_map[roomId])
        if(online_map[roomId])
        {
            socket_server.emit("status-sync",online_map[roomId])
        }
        
    })
    socket.on("join-room",(room,username)=>{
        console.log("socket transmitted room : ",room)
        socket.join(room.roomId)
        console.log("got the room details : " + room.roomId)
        userroomMapper[socket.id]=room.roomId
        if( room.roomId in activeUserMap)
        {
            activeUserMap[room.roomId]+=1;
            online_map[room.roomId].push(username)
        }
        else 
        {
            activeUserMap[room.roomId]=1;
            roomMap.createNewRoom(room.roomId,room)
            console.log("room created : " + roomMap.room_map[room.roomId].roomId)
            online_map[room.roomId]=[]
            online_map[room.roomId].push(username)
        }
        console.log("user joined in room : " + room.roomId + " members currently online : " + activeUserMap[room.roomId],"username :",username)
        socket_server.emit("status-sync",online_map[room.roomId])

    })
    // code for online status of the users 
    socket.on("status-change",(online_map)=>{
        console.log("online status changed :",online_map)
        socket_server.emit("sync-status-change",online_map)
    })
    socket.on("send-message",(obj)=>{
        roomMap.addNewMsgtoRoom(obj) // added new msg to temp_db
        console.log(obj)
        console.log("Listeners for receive-message:", socket_server.listeners("receive-message"));
        socket.to(obj.roomId).emit("receive-message", obj);
        
    })
    socket.on("code-change",(roomId,code)=>{
        roomMap.update_code(roomId,code)
        socket.to(roomId).emit("code-sync", code);
    })
    socket.on("room-sync",(roomObj)=>{
        console.log("got the room details",roomObj)
        console.log(roomMap.room_map[roomObj.roomId])
        roomMap.room_map[roomObj.roomId] = roomObj
        console.log("after adding new participant",roomMap.room_map[roomObj.roomid])
        socket_server.to(roomObj.roomId).emit("roomContext-sync", roomMap.room_map[roomObj.roomId])
    })

})
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.')
    }
    const fileContent = req.file.buffer.toString('utf8');
    console.log("uploaded file content: " + fileContent)
    const roomId = req.body.roomId;
    socket_server.to(roomId).emit('code-sync',fileContent);
   return res.status(200).json({
        message: 'File uploaded successfully!',
        file: req.file
    })
})
app.get('/', (req, res) => {
    res.send('Hello World!')
})


server.listen(2000, () => {
    console.log('WebSocket server is running on http://localhost:2000');
  });



