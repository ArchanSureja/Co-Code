import React from 'react';
import './Home.css';
import chat from '../assets/chat.png'; 
import setting from '../assets/setting.png'; 
import editor from '../assets/editor.png'; 
import execution from '../assets/execution.png'; 
import collaborator from '../assets/collaborators.png'; 
import Card from '../components/card'; 
import { useAuth } from '../store/auth';

const Home = () => {
    const authContext = useAuth();
    return (
        <div className="home">
            <header className="home-header">
                <div className="header-content">
                    <h1 className="header-title">Co-Code</h1>
                    <h2>Welcome , {authContext.loggedInUser?.username || "user"}</h2>
                    <p className="header-subtitle">Code Chat and Collaborate, It's All in Sync</p>
                </div>
            </header>
            <section className="features">
                <Card
                    image={chat}
                    heading="💬 Group Chat"
                    paragraph="Group chatting allows users to communicate in real-time while working on code."
                    isOdd={1}
                />
                <Card
                    image={editor}
                    heading="🖥️ RealTime Editor"
                    paragraph="Open and Edit files "
                />
                <Card
                    image={execution}
                    heading="🚀 Code Execution"
                    paragraph="Users can execute the code directly within the collaboration environment, providing instant feedback and results."
                    isOdd={1}
                />
                <Card
                    image={collaborator}
                    heading="👥 Collaborators"
                    paragraph="User presence list of users currently in the collaboration session, including online/offline status indicators."
                />
                <Card
                    image={setting}
                    heading="⚙️ Settings"
                    paragraph="Create, open, edit, save, delete, and organize files and folders."
                    isOdd={1}
                />
            </section>
        </div>
    );
};

export default Home;
