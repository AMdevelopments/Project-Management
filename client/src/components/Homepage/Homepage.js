//Homepage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Homepage.scss'
const HomePage = () => {
    const [content, setContent] = useState({ welcomeMessage: '', appDescription: '' });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/homepage');
                setContent({
                    welcomeMessage: response.data.welcome_message,
                    appDescription: response.data.app_description
                });
            } catch (error) {
                console.error("Failed to fetch homepage content", error);
            }
        };

        fetchContent();
    }, []);

    return (
        <div className="homepage-container">
            <h1>Welcome to Our App</h1>
            <p>{content.welcomeMessage}</p>
            <p>{content.appDescription}</p>
        </div>
    );
};

export default HomePage;
