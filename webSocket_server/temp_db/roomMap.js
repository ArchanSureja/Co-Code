class RoomMap {
    constructor(){
        this.room_map = {}
    }
    createNewRoom(roomId,roomObj)
    {
        this.room_map[roomId] = roomObj
    }
    update_code(roomId,code)
    {
        this.room_map[roomId].contents = code
    }
    addNewMsgtoRoom(obj)
    {
        this.room_map[obj.roomId].messages.push(obj.newmsg)
        console.log("updated message in the room",this.room_map[obj.roomId].messages)
    }
   async flushRoomToDB(roomId)
    {
     
        const room = this.room_map[roomId]
        if (!room) {
            console.error(`Room with ID ${roomId} does not exist.`);
            return;
        }
        try { 
            console.log("room details to be saved in db : ", room)
            const res = await fetch(`http://localhost:1000/api/Flushroom/${roomId}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(room)
            })
            const updatedRoom = await res.json();
            console.log(updatedRoom);
            this.room_map[roomId] = updatedRoom; 

        }
        catch (error) {
            console.error(`Failed to flush room ${roomId} to database:`, error);
        }
        
    }
}
module.exports =  RoomMap
