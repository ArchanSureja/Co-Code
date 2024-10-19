const express = require('express');
const mongoose = require('mongoose');
const auth= require('./middleware/authMiddleware');
const errHandler = require('./middleware/errorHandler');
const roomRouter = require('./routers/room-router');
const userRouter = require('./routers/user-router');
const webSocketRouter = require('./routers/webSocketRouter')
const cors = require('cors')
const app = express();

app.use(cors({
   origin : "*"
}))
app.use(express.json());
// route for signup user and login user 
app.use("/api/user",userRouter)
app.use("/api/Flushroom",webSocketRouter) 
app.use("/api/room",auth); 
app.use("/api/room",roomRouter);
app.use(errHandler);
mongoose.connect("mongodb+srv://vipullakum:vipul123@cluster0.smwi5ak.mongodb.net/co-code?retryWrites=true&w=majority&appName=Cluster0").then(
   console.log("mongodb is connected")
 )
 app.listen(1000, ()=>{
    console.log("Server is running on port 1000");
 })
