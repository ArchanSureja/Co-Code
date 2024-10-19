import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinRoom.css';
import loginImg from '../assets/login.png';
import { useAuth } from '../store/auth';
import { toast } from 'react-toastify';

export default function Login() {
    const authContext = useAuth();
    const [inputUser, setinputUser] = useState({
        username: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const handleInput = (e) => {
        const { name, value } = e.target;
        setinputUser({ ...inputUser, [name]: value });
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:1000/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputUser),
            });
            const responseData = await response.json();
            console.log(responseData); 
            if (response.ok) {
                toast.success('login is Successful!');
                authContext.loginUser(inputUser,responseData.token)
                setinputUser({ username: "", email: "", password: "" });
                navigate('/room');
            } else {
                console.log(response);
                toast.error("login failed: " + responseData.message);
                console.log("login failed: " + responseData.message);
            }
        } catch (error) {
            toast.error("Registration failed: " + error.message);
            console.log("Registration failed: " + error);
        }
    }



    return (
        <div className="section-auth">
            <div className="container grid grid-two-cols">
                <div className="section-auth-image">
                    <img src={loginImg} alt="Login" width={400} height={400} />
                </div>
                <form className="auth-form" onSubmit={handleLogin}>
                    <h1 className="main-heading mb-3">Login</h1>
                    <input
                        type="email"
                        name='email'
                        placeholder="Email"
                        id='email'
                        required
                        autoComplete='off'
                        value={inputUser.email}
                        onChange={handleInput}
                    />
                    <input
                        type="username"
                        name='username'
                        placeholder="Username"
                        id='username'
                        required
                        autoComplete='off'
                        value={inputUser.username}
                        onChange={handleInput}
                    />
                    <input
                        type="password"
                        name='password'
                        placeholder="Password"
                        id='password'
                        required
                        autoComplete='off'
                        value={inputUser.password}
                        onChange={handleInput}
                    />
                    <button type='submit' className="section-auth-button">Login</button>
                </form>
            </div>
        </div>
    );
}

