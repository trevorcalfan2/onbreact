import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../css/Index.css'

function Welcome() {
    const [configData, setConfigData] = useState({
        VIDEOLINK: '',
        BIENVENIDA: ''
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/configs`);
            if (response.data.length > 0) {
                const data = response.data[0];
                setConfigData({
                    VIDEOLINK: data.videolink || '',
                    BIENVENIDA: data.bienvenida || ''
                });
            }
        } catch (error) {
            console.error('Error fetching the config data', error);
        }
    };

    const getEmbeddedVideoLink = (link) => {
        if (link.includes("youtube.com")) {
            const videoId = link.split("v=")[1].split("&")[0]; // Handle any additional URL parameters
            return `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
        }
        return link;
    };

    return (
        <div className="container text-center" style={{ marginTop: '-3rem' }}>
            <h1 className="mb-4">¡Bienvenido/a a nuestro equipo!</h1>
            <div className="video-container mb-4" style={{ width: '640px', height: '360px', margin: '0 auto' }}>
                <iframe
                    width="640"
                    height="360"
                    src={getEmbeddedVideoLink(configData.VIDEOLINK)}
                    allowFullScreen
                    title="Bienvenida Video"
                ></iframe>
            </div>
            <p style={{ whiteSpace: 'pre-line' }}>{configData.BIENVENIDA}</p>
        </div>
    );
}

export default Welcome;
