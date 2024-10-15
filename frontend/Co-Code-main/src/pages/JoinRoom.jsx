// JoinRoom.jsx
import React, {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinRoom.css';
import heroImg from '../assets/hero.png';
import { useRoom } from '../context/roomContext/roomContext';
import getRoomFromDB from '../services/room-service'
import { toast

} from 'react-toastify';
const generateRandomRoomId = () => {
    const characters = '-ABCDEFGHIJKLMNOPQRSTUVWXYZ-abcdefghijklmnopqrstuvwxyz-0123456789-';
    let result = '';
    const length = 10; // You can change the length of the room ID as needed
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
};
const JoinRoom = ({ image, heading }) => {
    const [roomId, setRoomId] = useState(generateRandomRoomId());
    const [isJoining,setisJoining] = useState(false)
    const navigate = useNavigate();
    const {dispatch} = useRoom();
    async function createRoomRequestToBE()
    {
        let user = JSON.parse(localStorage.getItem('user'));
        let room = {
            roomId: roomId,
            createdBy : {
                username : user.username
            },
            participants:[],
            messages:[],
            contents:"",

        }
        const response = await fetch(`http://localhost:1000/api/room/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': "Bearer " + localStorage.getItem('token')
            },
            body: JSON.stringify(room),
        });
        let data = await response.json();
        console.log(data)
        if(response.ok){
            console.log("room created in BE successfully")
            dispatch({ type: 'SET_ROOM', payload: data });
            navigate(`/features`)
           
        }
        else{
            console.log("failed to create room")
        }
    }

    async function  handlebtnCreateClick() {
        if(isJoining === false)
        {  
            await createRoomRequestToBE();          
        }

    }
    async function handlebtnJoinClick() {
        if(isJoining===true){
           
            const roomData = await getRoomFromDB(roomId); 
            if(!roomData) {
                toast.error("you are not allowed to join this room or room is not exists")
                return 

            } // Fetch room data from DB
            dispatch({ type: 'SET_ROOM', payload: roomData });  // Set the room context
            navigate(`/features`);
            
        }
   
    }
    function handleInputRoomId(event)
    {
        setRoomId(event.target.value);
    }

    function toggle()
    {
        if(isJoining)
        {
            setRoomId(generateRandomRoomId())
            setisJoining(false)
        }
        else
        {
            setRoomId("")
            setisJoining(true)
        }
        
    }
    return (
        <div className="section-auth">
            <div className="container grid grid-two-cols">
                <div className="section-auth-image" >
                    <img src={heroImg} alt="Join Room" width={400} height={400} />
                </div >
                <div className="auth-form">
                    { isJoining && <><h1 className="main-heading mb-3">Join a Room</h1>
                    <input
                        type="text"
                        name='roomId'
                        placeholder="roomId"
                        id='roomId'
                        required
                        autoComplete='off'
                        value={roomId}
                        onChange={handleInputRoomId}
                    /> <button onClick={handlebtnJoinClick} className="section-auth-button">join</button>
                     <p>If you want to create room <span style={{ color : 'blue' , cursor : 'pointer'}} onClick={toggle}>Click hear</span></p></>}
                    { !isJoining && <><h1 className="main-heading mb-3">create a Room</h1>
                    <input
                        type="text"
                        name='roomId'
                        placeholder="roomId"
                        id='roomId'
                        required
                        autoComplete='off'
                        value={roomId}
                        readOnly={true}
                    />
                    <button onClick={handlebtnCreateClick} className="section-auth-button">create </button>
                    <p>If you want to join room <span style={{ color : 'blue' , cursor : 'pointer'} }onClick={toggle}>Click hear</span></p>
                    </>
                    }
                    
                </div>
           </div >
           </div>
)
}
export default JoinRoom;
