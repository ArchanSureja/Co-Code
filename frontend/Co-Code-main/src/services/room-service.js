
async function getRoomFromDB(roomId)
{
    try{
    
    const response = await fetch(`http://192.168.74.228:1000/api/room/${roomId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': "Bearer " + localStorage.getItem('token')
        },
    });
    let data = await response.json();
    console.log("before joinig the room this is the room details : ",data)
    if(response.ok){
        return data
    }
    else{
        console.log("failed to auth or room is not found")
        return 
    }
}catch(e){
     console.log("failed to auth or room is not found")
}
}
export default getRoomFromDB