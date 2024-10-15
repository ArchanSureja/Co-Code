// Card.jsx
import React from 'react';
import './Card.css'; // Create a CSS file for styling

const Card = ({ image, heading, paragraph, isOdd }) => {
    return (
        <div className={`card ${isOdd ? 'card-odd' : 'card-even'}`}>
            <img src={image} alt={heading} className="card-image" />
            <div className="info">
                <h2 className="card-heading">{heading}</h2>
                <p className="card-paragraph">{paragraph}</p>
            </div>
        </div>
    );
};

export default Card;
