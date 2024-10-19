import React from 'react';
import './Home.css';
import chat from '../assets/chat.png'; // Replace with your actual chat image
import setting from '../assets/setting.png'; // Replace with your actual setting image
import editor from '../assets/editor.png'; // Replace with your actual editor image 
import execution from '../assets/execution.png'; // Replace with your actual execution image
import collaborator from '../assets/collaborators.png'; // Replace with your actual collaborator image
import Card from '../components/card'; // Import the Card component
import { useAuth } from '../store/auth';

const Home = () => {
    const authContext = useAuth();
    return (
        <div className="home">
            <header className="home-header">
                <div className="header-content">
                    {/* <img src={heroImg} alt="Co-Code Logo" className="header-image" /> */}
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
