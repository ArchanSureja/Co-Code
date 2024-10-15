// GroupChat.jsx
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './GroupChat.css';

const socket = io('http://localhost:5000');

const GroupChat = ({ roomId, username }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.emit('join-room', { roomId, username });

        socket.on('receive-message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        socket.on('user-joined', (data) => {
            setMessages((prevMessages) => [...prevMessages, { username: 'System', message: `${data.username} joined the room` }]);
        });

        return () => {
            socket.disconnect();
        };
    }, [roomId, username]);

    const handleSendMessage = () => {
        if (message.trim()) {
            socket.emit('send-message', { roomId, message, username });
            setMessages((prevMessages) => [...prevMessages, { username, message }]);
            setMessage('');
        }
    };

    return (
        <div className="group-chat">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.username === username ? 'self' : ''}`}>
                        <strong>{msg.username}: </strong>{msg.message}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default GroupChat;
