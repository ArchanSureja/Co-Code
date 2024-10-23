import React, { useEffect, useState, useRef } from 'react';
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
import axios from 'axios';
import LanguageSelector from '../components/LanguageSelector';
import { RiAdminLine } from "react-icons/ri";

const Features = () => {
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const roomContext = useRoom()
    const authContext = useAuth()
    const [online_map, setonline_map] = useState([]);
    const [selectedFeature, setSelectedFeature] = useState('chat');
    const [isSocketConnected, setisSocketConnected] = useState(false);
    const [file, setFile] = useState(null);
    useEffect(() => {
        if (!roomContext.roomState?.roomId) {
            toast.error("Lost the connection. Please join the room again.");
            console.log("No room context available, redirecting to JoinRoom");
            navigate('/room');
            return;
        }
        // socketRef.current = io("http://localhost:2000")
         socketRef.current = io("http://192.168.74.228:2000")
        console.log(socketRef.current)
        socketRef.current.emit("join-room", roomContext.roomState, authContext.loggedInUser?.username)
        socketRef.current.on("status-sync", (onlinemap) => {
            setonline_map(()=>[
                ...onlinemap
            ])
            if(onlinemap.length > online_map.length)
            {
                if(onlinemap[onlinemap.length-1]!==authContext.loggedInUser?.username)
                    {
                        toast.success(`${onlinemap[onlinemap.length-1]} joined the room `)
                    }
            }
        })
        socketRef.current.on("roomContext-sync", (roomObj) => {
            roomContext.dispatch({ type: 'SET_ROOM', payload: roomObj });  // Set the room context
            console.log("updated room context ", roomContext)
            navigate(`/features`);
        })
        socketRef.current.on("deleted-room",()=>{
            toast.error("Room is destroyed by the creator")
            navigate(`/room`);
        })
        socketRef.current.on("leave-notifiacation",(user)=>{
            toast.error(`${user} left the room`)
        })
        setisSocketConnected(true)
        setonline_map(pre => [...pre, authContext.loggedInUser?.username])
        return () => {
            if (socketRef.current) {
                socketRef.current.emit('leave-room', roomContext.roomState.roomId, authContext.loggedInUser?.username);
                socketRef.current.disconnect();
                console.log('Left room:', roomContext.roomState)
            }
        };
    }, []);
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        const allowedExtensions = ['.js', '.py', '.cpp', '.java', '.sh'];
        const maxSizeInBytes = 5 * 1024 * 1024;

        if (file) {
            const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

            if (!allowedExtensions.includes(fileExtension)) {
                toast.error('Unsupported file type! Please upload a .js, .py, .cpp, .java, or .sh file.');
                // e.target.value = '';   
                return;
            }

            if (file.size > maxSizeInBytes) {
                toast.error('File size exceeds the 5MB limit. Please upload a smaller file.');
                // e.target.value = '';  
                return;
            }
            setFile(e.target.files[0]);
        }
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
            const response = await fetch('http://192.168.74.228:2000/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();  // Parse the JSON response from the server
                console.log("File uploaded successfully:", result);
                codeRef.current = result.fileContent;
            } else {
                console.error("File upload failed.");
                alert("File upload failed. Please try again.");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error uploading file. Please try again.");
        }
    };
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this room?")) {
            return;
        }
        socketRef.current.emit("delete-room",roomContext.roomState.roomId)
        try {
            const response = await fetch(`http://192.168.74.228:1000/api/room/${roomContext.roomState.roomId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': "Bearer " + localStorage.getItem('token')
                },
            });

            if (response.ok) {
                toast.success("Room deleted successfully!");
                navigate('/room');
            } else {
                console.error("Failed to delete room.");
                alert("Failed to delete room. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting room:", error);
            alert("Error deleting room. Please try again.");
        }
    }
    const handleSend = async (e) => {
        e.preventDefault();
        let participantEmail = e.target.elements.email.value
        console.log("got the email", participantEmail)
        if (!participantEmail) {
            toast.error("Please enter the participant's email.")
            return
        }
        // check user is in db or not 
        try {

            const response = await fetch(`http://192.168.74.228:1000/api/user/${participantEmail}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': "Bearer " + localStorage.getItem('token')
                },
            });
            var data = await response.json();
            if (response.ok) {
                console.log("validation of the email", data)
            }
            else {
                console.log("error", data)
                toast.error("user not found with this email!!")
                e.target.elements.email.value = ""

                return
            }
        } catch (e) {
            console.log("something went wrong")
            return
        }

        // getting room object 
        const roomId = roomContext.roomState.roomId
        let room = await getRoomFromDB(roomId)

        //adding participant to the room 
        let isValid = true
        for (let i = 0; i < room.participants.length; i++) {
            if (room.participants[i].username == data.user.username) {
                isValid = false
                toast.error(`User ${data.user.username} is already a participant in the room.`);
                e.target.elements.email.value = ""

                break;
            }
            else {
                continue;
            }
        }
        if (data.user.username === room.createdBy.username) {
            isValid = false
            toast.error(`User ${data.user.username} is already a participant in the room.`);
            e.target.elements.email.value = '';

        }

        if (!isValid) return
        room.participants.push({ username: data.user.username })
        console.log("added participant in the room ", room)


        // put reques for updating the room 
        try {

            const response = await fetch(`http://192.168.74.228:1000/api/room/${roomId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': "Bearer " + localStorage.getItem('token')
                },
                body: JSON.stringify(room),
            });
            var data = await response.json();
            if (response.ok) {
                console.log("updated room", data)
                // now send the code in email 
                try {

                    const response = await fetch(`http://192.168.74.228:7000/send-room-code`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            roomCode: roomId,
                            email: participantEmail,
                            creator: room.createdBy.username
                        }),
                    });
                    var data = await response.json();
                    if (response.ok) {

                        toast.success("participant added successfully and code shared via email")
                        e.target.elements.email.value = ""
                        // adding the updated room to the temp_db in websocket server 
                        const roomData = await getRoomFromDB(roomId); // updated room data 
                        socketRef.current.emit("room-sync", roomData); // send updated room to all users in the room
                        return
                    }
                    else {
                        console.log("error", data)
                        return
                    }
                } catch (e) {
                    console.log("something went wrong")
                    return
                }
            }

            else {
                console.log("error", data)
            }
        } catch (e) {
            console.log("something went wrong")
            return
        }


    }

    const codeRef = useRef(null);
    const [output, setOutput] = useState("");
    const [codeInput, setCodeInput] = useState("");
    const [language, setLanguage] = useState({ "language": "javascript", "version": "18.15.0" });

    const handleLanguageChange = (selectedLanguage) => {
        setLanguage(selectedLanguage);
        console.log(language);
    };

    const runCode = async () => {

        console.log('Running code');
        console.log('code : ', codeRef.current);

        if (!codeRef.current) {
            toast.error("No code to execute.");
            return;
        }

        try {
            const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
                language: language.language,
                version: language.version,
                files: [
                    {
                        content: codeRef.current,
                        // content: roomContext.roomState.contents,
                    }
                ],
                stdin: codeInput,
            });

            const result = response.data;
            console.log('Execution Result:', result);

            if (result.run.stderr) {
                toast.error(`Error`);
                setOutput(result.run.stderr); // Set the error in the output
            } else {
                toast.success('Code executed successfully');
                setOutput(result.run.stdout); // Set the output in state
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to execute code');
            setOutput('Failed to execute code'); // Display error in output
        }
    };


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
                                accept=".js,.py,.cpp,.java,.sh"
                                onChange={handleFileChange} />
                            <button className='btn' type='submit'>open</button>
                            <hr />
                        </form>
                        <div className="editor">
                            {isSocketConnected ? <Editor socket={socketRef.current} setCodeRef={codeRef} /> : <p> Connecting to the editor.....</p>}
                        </div>
                    </div>
                );
            case 'runner':
                return (

                    <div className="feature-content">
                        <div className="runner-container">
                            <h2>Runner</h2>
                            <div className="runner-block">
                                <LanguageSelector onLanguageSelect={handleLanguageChange} />

                                <h3>Input</h3>
                                <textarea
                                    placeholder="Provide input..."
                                    value={codeInput}
                                    onChange={(e) => setCodeInput(e.target.value)}  // Capture user input
                                ></textarea>

                                <h3>Output</h3>
                                <textarea
                                    value={output}
                                    placeholder="Output will be displayed here..."
                                    readOnly
                                ></textarea>

                                <button className='btn' onClick={runCode}>Run Code</button>
                            </div>
                        </div>

                        <div className="editor">
                            {isSocketConnected ?
                                <Editor socket={socketRef.current} setCodeRef={codeRef} /> :
                                <p>Connecting to the editor.....</p>
                            }
                        </div>
                    </div>
                );

            case 'chat':
                return (
                    <div className="feature-content">
                        <div className="chat-container">

                            {isSocketConnected ? <Chat socket={socketRef.current} /> : <p>Connecting to chat...</p>}
                        </div>

                        <div className="editor">

                            {isSocketConnected ? <Editor socket={socketRef.current} setCodeRef={codeRef}/> : <p> Connecting to the editor.....</p>}

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

                            {isSocketConnected ? <Editor socket={socketRef.current} setCodeRef={codeRef}/> : <p> Connecting to the server.............</p>}

                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="feature-content">
                        <div className="settings-container">
                        {roomContext.roomState.createdBy.username === authContext.loggedInUser?.username ? (
               <>  <form className="settings-block" onSubmit={handleSend}>
                    <label>Participant Email</label>
                    <input type="email" name="email" id="email" />
                    <button type="submit">send</button>
                </form>
                  <button onClick={handleDelete}>Delete Room</button>
                  </>
            ) : (
                <p>Contact room creator to add the other participants.</p> )}
                            <hr />
                            <h4>Creator : <strong>{roomContext.roomState.createdBy.username}</strong></h4>
                            <h3>Participants List</h3>
                            <ul>
                                {roomContext.roomState.participants.map((participant, index) => (
                                    <li key={index}>{participant.username}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="editor">
                            {isSocketConnected ? <Editor socket={socketRef.current} setCodeRef={codeRef} /> : <p> Connecting to the editor.....</p>}

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
                    <li onClick={() => setSelectedFeature('settings')}><RiAdminLine /></li>
                </ul>
            </div>
            <div className="content">
                {renderFeatureContent()}
            </div>
        </div>
    );
}

export default Features;
