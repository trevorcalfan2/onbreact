import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Ev() {
    const [evaluationFormLink, setEvaluationFormLink] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/configs`);
            if (response.data.length > 0) {
                const data = response.data[0];
                setEvaluationFormLink(data.form || '');
            }
        } catch (error) {
            console.error('Error fetching the config data', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center">
            <div className="custom-card p-3" style={{ width: '100%', maxWidth: '700px' }}>
                <div className="card-body">
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando…</span>
                            </div>
                        </div>
                    ) : evaluationFormLink ? (
                        <iframe src={evaluationFormLink} width="100%" height="965" frameBorder="0" marginHeight="0" marginWidth="0" onLoad={() => setLoading(false)}>Cargando…</iframe>
                    ) : (
                        <p className="text-center">No hay formulario de evaluación configurado.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Ev;
