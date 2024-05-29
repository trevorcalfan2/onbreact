import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../css/Index.css';

const About = () => {
    const [data, setData] = useState({
        vision: '',
        misiom: '',
        nosotros: '',
    });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/configs`);
                if (response.data.length > 0) {
                    const configData = response.data[0];
                    console.log(configData);
                    setData({
                        vision: configData.vision,
                        mision: configData.mision,
                        nosotros: configData.nosotros,
                    });
                }
            } catch (error) {
                console.error('Error fetching config data:', error);
            }
        };

        fetchConfig();
    }, []);

    return (
        <div className="container "  style={{ marginTop: '-3rem' }}>
            <div className="row mb-5">
                <div className="col-md-6 text-center">
                    <h3>Visión</h3>
                    <div className="card bg-light p-3 mx-auto" style={{ whiteSpace: 'pre-wrap' }}>
                        {data.vision}
                    </div>
                </div>
                <div className="col-md-6 text-center">
                    <h3>Misión</h3>
                    <div className="card bg-light p-3 mx-auto" style={{ whiteSpace: 'pre-wrap' }}>
                        {data.mision}
                    </div>
                </div>
            </div>
            <div className="row mt-5 justify-content-center">
                <div className="col-md-8 text-center">
                    <h3>Nosotros</h3>
                    <div className="card bg-light p-3 mx-auto" style={{ whiteSpace: 'pre-wrap' }}>
                        {data.nosotros}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
