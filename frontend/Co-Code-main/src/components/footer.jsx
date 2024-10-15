import React from 'react';
import './Footer.css'; // Import your CSS file for styling

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-section about">
                <h2>About Us</h2>
                <p>
                    Brief description of your project or company. This can include the mission, vision, or any other relevant information.
                </p>
            </div>
            <div className="footer-section links">
                <h2>Quick Links</h2>
                <ul>
                    <li><a href="/home">Home</a></li>
                    <li><a href="/features">Features</a></li>
                    <li><a href="/pricing">Pricing</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </div>
            <div className="footer-section contact">
                <h2>Contact Us</h2>
                <p>Email: info@example.com</p>
                <p>Phone: +1 123-456-7890</p>
                <div className="social-media">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
