import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../css/Index.css';

const Welcome = ({ setView }) => {
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

    const handleButtonClick = () => {
        setView('about');
    };

    return (
        <div>
            <div className='welcome-container'>
                <div className="row">
                    <div className="col-md-6 text-section">
                        <h1>¡Bienvenido/a a nuestro equipo!</h1>
                        <p>{configData.BIENVENIDA}</p>
                    </div>
                    <div className="col-md-6 video-section">
                        <iframe
                            src={getEmbeddedVideoLink(configData.VIDEOLINK)}
                            allowFullScreen
                            title="Bienvenida Video"
                            className="mb-3"
                        ></iframe>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12 d-flex justify-content-end">
                        <button
                            className="btn btn-primary"
                            onClick={handleButtonClick}
                        >
                            Conócenos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
