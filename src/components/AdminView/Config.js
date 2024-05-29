import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Config() {
    const [configData, setConfigData] = useState({
        ID: '',  // Asegúrate de incluir el ID en el estado
        VISION: '',
        MISION: '',
        BIENVENIDA: '',
        VIDEOLINK: '',
        NOSOTROS: ''
    });
    const [modal, setModal] = useState({ show: false, title: '', message: '' });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/configs`);
            console.log('Datos recibidos:', response.data); // Log para verificar los datos recibidos
            if (response.data.length > 0) {
                const data = response.data[0];
                setConfigData({
                    ID: data.id || '',
                    VISION: data.vision || '',
                    MISION: data.mision || '',
                    BIENVENIDA: data.bienvenida || '',
                    VIDEOLINK: data.videolink || '',
                    NOSOTROS: data.nosotros || ''
                });
            }
        } catch (error) {
            console.error('Error al obtener los datos de configuración', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfigData({
            ...configData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Datos a enviar:', configData); // Log para verificar los datos antes de enviar

        // Validación simple
        if (!configData.VISION || !configData.MISION || !configData.BIENVENIDA || !configData.VIDEOLINK || !configData.NOSOTROS) {
            setModal({ show: true, title: 'Error', message: 'Todos los campos son obligatorios.' });
            return;
        }

        try {
            if (configData.ID) {
                await axios.put(`${config.API_URL}/configs/${configData.ID}`, configData);
            } else {
                const { ID, ...dataWithoutID } = configData;
                await axios.post(`${config.API_URL}/configs`, dataWithoutID);
            }
            setModal({ show: true, title: 'Éxito', message: '¡Datos de configuración guardados exitosamente!' });
        } catch (error) {
            console.error('Error al guardar los datos de configuración', error);
            setModal({ show: true, title: 'Error', message: 'Error al guardar los datos de configuración' });
        }
    };

    const closeModal = () => {
        setModal({ show: false, title: '', message: '' });
    };

    return (
        <div className="container">
            <h2>Configuración</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="VISION" className="form-label">Visión</label>
                    <textarea className="form-control" id="VISION" name="VISION" value={configData.VISION} onChange={handleChange} rows="3" />
                </div>
                <div className="mb-3">
                    <label htmlFor="MISION" className="form-label">Misión</label>
                    <textarea className="form-control" id="MISION" name="MISION" value={configData.MISION} onChange={handleChange} rows="3" />
                </div>
                <div className="mb-3">
                    <label htmlFor="BIENVENIDA" className="form-label">Bienvenida</label>
                    <textarea className="form-control" id="BIENVENIDA" name="BIENVENIDA" value={configData.BIENVENIDA} onChange={handleChange} rows="3" />
                </div>
                <div className="mb-3">
                    <label htmlFor="VIDEOLINK" className="form-label">Enlace del Video</label>
                    <input type="text" className="form-control" id="VIDEOLINK" name="VIDEOLINK" value={configData.VIDEOLINK} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="NOSOTROS" className="form-label">Nosotros</label>
                    <textarea className="form-control" id="NOSOTROS" name="NOSOTROS" value={configData.NOSOTROS} onChange={handleChange} rows="3" />
                </div>
                <button type="submit" className="btn btn-primary">Guardar</button>
            </form>

            {/* Modal */}
            <div className={`modal fade ${modal.show ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{modal.title}</h5>
                            <button type="button" className="close" aria-label="Close" onClick={closeModal}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>{modal.message}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Config;
