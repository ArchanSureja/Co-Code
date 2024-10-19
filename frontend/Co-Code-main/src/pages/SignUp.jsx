import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinRoom.css';
import registerImg from '../assets/register.png';
import { useAuth } from '../store/auth';
import { toast } from 'react-toastify';
export default function SignUp() {
    const authContext = useAuth();
    const navigate = useNavigate();
    const [inputUser, setinputUser] = useState({
        username: "",
        email: "",
        password: "",
        cpassword: ""
    });
    const handleInput = (e) => {
        console.log(e);
        let name = e.target.name;
        let value = e.target.value;
        setinputUser({ ...inputUser, [name]: value });
    }
    const handleSignUp = async (e) => {
        e.preventDefault();
        if (inputUser.password !== inputUser.cpassword) {
            toast.error("Password do not match.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:1000/api/user/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputUser),
            });
            const responseData = await response.json();
            console.log(responseData);
            if (response.ok) {
                toast.success('Registration Successful!');
                authContext.loginUser(inputUser, responseData.token)
                setinputUser({ username: "", email: "", password: "" });
                navigate('/room');
            } else {
                console.log(response);
                toast.error("Registration failed: " + responseData.message);
                console.log("Registration failed: " + responseData.message);
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
                    <img src={registerImg} alt="Sign Up" width={400} height={400} />
                </div>
                <form className="auth-form" onSubmit={handleSignUp} >
                    <h1 className="main-heading mb-3">Sign Up</h1>
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter username..."
                        id="username"
                        required
                        autoComplete="off"
                        value={inputUser.username}
                        onChange={handleInput}
                    />
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
                        type="password"
                        name='password'
                        placeholder="Password"
                        id='password'
                        required
                        autoComplete='off'
                        value={inputUser.password}
                        onChange={handleInput}
                    />
                    <input
                        type="password"
                        name='cpassword'
                        placeholder="Confirm Password"
                        id='cpassword'
                        required
                        autoComplete='off'
                        value={inputUser.cpassword}
                        onChange={handleInput}
                    />
                    <button type='submit' className="section-auth-button">Sign Up</button>
                </form>
            </div>
        </div>
    );
}
