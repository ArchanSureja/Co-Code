import React, { useEffect, useState , useRef} from 'react';
import './FeaturesPage.css';
import { toast } from 'react-toastify';
import { LuFiles } from "react-icons/lu";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { VscRunAll } from "react-icons/vsc";
import { FcCollaboration } from "react-icons/fc";
import { IoSettingsOutline } from "react-icons/io5";
import { useRoom } from '../context/roomContext/roomContext';

import io from 'socket.io-client';
import Chat from './Chat';
import Editor from './Editor';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import getRoomFromDB from '../services/room-service';

const Features = () => {
    const navigate = useNavigate();
    const socketRef = useRef(null); 
    const roomContext = useRoom()
    const authContext = useAuth()
    const [online_map , setonline_map] = useState([]);
    const [selectedFeature, setSelectedFeature] = useState('chat');
    const [isSocketConnected,setisSocketConnected] = useState(false);
    const [file, setFile] = useState(null);
    // const [participantEmail,setparticipantEmail] = useState('')
    useEffect(() => {
        if (!roomContext.roomState?.roomId) {
            toast.error("Lost the connection. Please join the room again.");
            console.log("No room context available, redirecting to JoinRoom");
            navigate('/room'); 
            return;
          }
        socketRef.current = io("http://localhost:2000")
        console.log(socketRef.current)
        socketRef.current.emit("join-room",roomContext.roomState,authContext.loggedInUser?.username)
        socketRef.current.on("status-sync",(online_map)=>{
            setonline_map(()=>[
                ...online_map
            ])
        })
        socketRef.current.on("roomContext-sync",(roomObj)=>{
            roomContext.dispatch({ type: 'SET_ROOM', payload: roomObj });  // Set the room context
            console.log("updated room context ", roomContext)
            navigate(`/features`);
        })
        setisSocketConnected(true)
        setonline_map(pre=>[...pre,authContext.loggedInUser?.username])
        return () => {
            if (socketRef.current) {
              socketRef.current.emit('leave-room', roomContext.roomState.roomId,authContext.loggedInUser?.username);
              socketRef.current.disconnect(); 
              console.log('Left room:',roomContext.roomState)
            }
          };
      }, []);
      const handleFileChange = (e) => {
        setFile(e.target.files[0]);  
    };
    const handleSubmit = async (e) => {
        e.preventDefault();  
        

        if (!file) {
            alert("Please select a file before submitting.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);  
        formData.append('roomId', roomContext.roomState.roomId);

        try {
            const response = await fetch('http://localhost:2000/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();  // Parse the JSON response from the server
                console.log("File uploaded successfully:", result);
            } else {
                console.error("File upload failed.");
                alert("File upload failed. Please try again.");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error uploading file. Please try again.");
        }
    };
  
    const handleSend = async (e) =>{
        e.preventDefault();
        let participantEmail = e.target.elements.email.value
        console.log("got the email",participantEmail)
        if(!participantEmail){
            toast.error("Please enter the participant's email.")
            return
        }
        // check user is in db or not 
        try{
    
            const response = await fetch(`http://localhost:1000/api/user/${participantEmail}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': "Bearer " + localStorage.getItem('token')
                },
            });
            var data = await response.json();
            if(response.ok){
                console.log("validation of the email",data)
            }
            else{
                console.log("error",data)
                toast.error("user not found with this email!!")
                e.target.elements.email.value = ""
                
                return 
            }
        }catch(e){
             console.log("something went wrong")
             return 
        }

        // getting room object 
        const roomId = roomContext.roomState.roomId
        let room = await getRoomFromDB(roomId)

        //adding participant to the room 
        let isValid = true
        for(let i=0;i<room.participants.length;i++) {
            if(room.participants[i].username == data.user.username)
                {
                    isValid = false
                    toast.error(`User ${data.user.username} is already a participant in the room.`);
                    e.target.elements.email.value = ""
                 
                    break;
                }
                else 
                {
                    continue;
                }
        }
        if (data.user.username === room.createdBy.username)
            {
                isValid = false
                toast.error(`User ${data.user.username} is already a participant in the room.`);
                e.target.elements.email.value = '';
                
            }
        
        if(!isValid) return 
        room.participants.push({ username: data.user.username})
        console.log("added participant in the room ", room)


        // put reques for updating the room 
        try{
    
            const response = await fetch(`http://localhost:1000/api/room/${roomId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': "Bearer " + localStorage.getItem('token')
                },
                body: JSON.stringify(room),
            });
            var data = await response.json();
            if(response.ok){
                console.log("updated room",data)
                // now send the code in email 
                try{
    
                    const response = await fetch(`http://localhost:7000/send-room-code`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            roomCode: roomId,
                            email: participantEmail,
                            creator : room.createdBy.username
                        }),
                    });
                    var data = await response.json();
                    if(response.ok){
                       
                        toast.success("participant added successfully and code shared via email")
                        e.target.elements.email.value = ""
                        // adding the updated room to the temp_db in websocket server 
                        const roomData = await getRoomFromDB(roomId); // updated room data 
                        socketRef.current.emit("room-sync", roomData); // send updated room to all users in the room
                        return
                    }
                    else{
                        console.log("error",data)
                        return
                    }
                }catch(e){
                     console.log("something went wrong")
                     return 
                }
            }

            else{
                console.log("error",data)
            }
        }catch(e){
             console.log("something went wrong")
             return 
        }

     
    }
    const renderFeatureContent = () => {
        switch (selectedFeature) {
            case 'editor':
                return (
                <div className="feature-content">
                <form className="file-folder-info" onSubmit={handleSubmit}>
                <h2>Files</h2>
                <input
                    type="file"
                    id="file"
                    name="file"
                    required
                    onChange={handleFileChange} />
                    <button type='submit'>open</button>
                <hr />
                </form>
                    <div className="editor">
                         { isSocketConnected  ? <Editor socket={socketRef.current} /> : <p> Connecting to the editor.....</p>}
                        </div>
                    </div>
                );
            case 'runner':
                return (
                    <div className="feature-content">
                        <div className="runner-container">
                            <h2>Runner</h2>
                            <div className="runner-block">
                                <h3>Select Language</h3>
                                <select>
                                    <option>JavaScript</option>
                                    <option>Python</option>
                                    <option>Java</option>
                                
                                </select>
                                <h3>Input</h3>
                                <textarea placeholder="Provide input..."></textarea>
                                <h3>Output</h3>
                                <textarea placeholder="Output will be displayed here..."></textarea>
                            </div>
                        </div>
                    <div className="editor">
                      { isSocketConnected ?
                         <Editor socket={socketRef.current}/>
                         : <p> Connecting to the editor.....</p>}                     
                    </div>
                    </div>
                );
            case 'chat': 
            return (
                <div className="feature-content">
                    <div className="chat-container">

                       { isSocketConnected? <Chat socket={socketRef.current} /> : <p>Connecting to chat...</p>}
                    </div>

                    <div className="editor">

                    { isSocketConnected ? <Editor socket={socketRef.current}/> : <p> Connecting to the editor.....</p>}

                    </div>
                </div>
            );   
            case 'collaborators':
                return (
                    <div className="feature-content">
                        <div className="collaborator-container">

                            <h2>Collaborators</h2>
                            <hr />
                            <div className="collaborators-block">
                            {online_map.map((user, index) => (
                        <div key={index}>
                            <strong>{user}</strong> : online
                        </div>
                    ))}
                                  
                                
                            </div>
                        </div>

                        <div className="editor">

                        { isSocketConnected ? <Editor socket={socketRef.current}/> : <p> Connecting to the server.............</p>}

                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="feature-content">
                        <div className="settings-container">
                            <h2>Settings & Share Room code</h2>
                            <hr />
                            <form className="settings-block" onSubmit={handleSend}>
                               <label>Participant Email</label>
                               <input type="email" name="email" id="email" />
                               <button type="submit">send</button>
                            </form>
                        </div>
                        <div className="editor">
                        { isSocketConnected ? <Editor socket={socketRef.current} /> : <p> Connecting to the editor.....</p>}

                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    return (
        <div className="features-page">
            <div className="sidebar">
                <ul>
                    <li onClick={() => setSelectedFeature('editor')}><LuFiles /></li>
                    <li onClick={() => setSelectedFeature('runner')}><VscRunAll /></li>
                    <li onClick={() => setSelectedFeature('chat')}><HiChatBubbleLeftRight /></li>
                    <li onClick={() => setSelectedFeature('collaborators')}><FcCollaboration /></li>
                    <li onClick={() => setSelectedFeature('settings')}><IoSettingsOutline /></li>
                </ul>
            </div>
            <div className="content">
                {renderFeatureContent()}
            </div>
        </div>
    );
}

export default Features;