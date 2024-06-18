import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Config() {
    const [configData, setConfigData] = useState({
        ID: '',
        VISION: '',
        MISION: '',
        BIENVENIDA: '',
        VIDEOLINK: '',
        NOSOTROS: '',
        FORM: '', // Nuevo campo para el enlace de Google Forms
        visionImage: '',
        misionImage: '',
        nosotrosImage: ''
    });

    const [modal, setModal] = useState({ show: false, title: '', message: '' });

    useEffect(() => {
        fetchConfig();
        fetchImages();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await axios.get(`${config.API_URL}/configs`);
            console.log('Datos recibidos:', response.data);
            if (response.data.length > 0) {
                const data = response.data[0];
                setConfigData(prevState => ({
                    ...prevState,
                    ID: data.id || '',
                    VISION: data.vision || '',
                    MISION: data.mision || '',
                    BIENVENIDA: data.bienvenida || '',
                    VIDEOLINK: data.videolink || '',
                    NOSOTROS: data.nosotros || '',
                    FORM: data.form || '' // Nuevo campo para el enlace de Google Forms
                }));
            }
        } catch (error) {
            console.error('Error al obtener los datos de configuración', error);
        }
    };

    const fetchImages = async () => {
        try {
            const visionImage = await fetchImage('visionimg');
            const misionImage = await fetchImage('misionimg');
            const nosotrosImage = await fetchImage('nosotrosimg');
            setConfigData(prevState => ({
                ...prevState,
                visionImage,
                misionImage,
                nosotrosImage
            }));
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const fetchImage = async (prefix) => {
        try {
            const response = await axios.get(`${config.API_URL}/imagemanagement/getImage/${prefix}`, { responseType: 'blob' });
            const url = URL.createObjectURL(response.data);
            return url;
        } catch (error) {
            console.error(`Error fetching image for ${prefix}:`, error);
            return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfigData({
            ...configData,
            [name]: value
        });
    };

    const handleImageChange = async (e, prefix) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('prefix', prefix);

        try {
            const response = await axios.post(`${config.API_URL}/imagemanagement/uploadImage`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const url = URL.createObjectURL(file);
            setConfigData(prevState => ({
                ...prevState,
                [`${prefix}Image`]: url
            }));
        } catch (error) {
            console.error('Error uploading image:', error);
            setModal({ show: true, title: 'Error', message: 'Error al subir la imagen' });
        }
    };

    const handleDeleteImage = async (prefix) => {
        try {
            await axios.delete(`${config.API_URL}/imagemanagement/deleteImage/${prefix}`);
            setConfigData(prevState => ({
                ...prevState,
                [`${prefix}Image`]: ''
            }));
        } catch (error) {
            console.error('Error deleting image:', error);
            setModal({ show: true, title: 'Error', message: 'Error al eliminar la imagen' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Datos a enviar:', configData);

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
                    <input type="file" className="form-control mt-2" onChange={(e) => handleImageChange(e, 'visionimg')} />
                    {configData.visionImage && (
                        <div className="mt-2">
                            <img src={configData.visionImage} alt="Visión" className="img-thumbnail" style={{ maxHeight: '150px' }} />
                            <button type="button" className="btn btn-danger mt-2" onClick={() => handleDeleteImage('visionimg')}>Eliminar Imagen</button>
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="MISION" className="form-label">Misión</label>
                    <textarea className="form-control" id="MISION" name="MISION" value={configData.MISION} onChange={handleChange} rows="3" />
                    <input type="file" className="form-control mt-2" onChange={(e) => handleImageChange(e, 'misionimg')} />
                    {configData.misionImage && (
                        <div className="mt-2">
                            <img src={configData.misionImage} alt="Misión" className="img-thumbnail" style={{ maxHeight: '150px' }} />
                            <button type="button" className="btn btn-danger mt-2" onClick={() => handleDeleteImage('misionimg')}>Eliminar Imagen</button>
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="NOSOTROS" className="form-label">Nosotros</label>
                    <textarea className="form-control" id="NOSOTROS" name="NOSOTROS" value={configData.NOSOTROS} onChange={handleChange} rows="3" />
                    <input type="file" className="form-control mt-2" onChange={(e) => handleImageChange(e, 'nosotrosimg')} />
                    {configData.nosotrosImage && (
                        <div className="mt-2">
                            <img src={configData.nosotrosImage} alt="Nosotros" className="img-thumbnail" style={{ maxHeight: '150px' }} />
                            <button type="button" className="btn btn-danger mt-2" onClick={() => handleDeleteImage('nosotrosimg')}>Eliminar Imagen</button>
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="BIENVENIDA" className="form-label">Bienvenida</label>
                    <textarea className="form-control" id="BIENVENIDA" name="BIENVENIDA" value={configData.BIENVENIDA} onChange={handleChange} rows="3" />
                </div>
                <div className="mb-3">
                    <label htmlFor="VIDEOLINK" className="form-label">Enlace del Video de Bienvenida</label>
                    <input type="text" className="form-control" id="VIDEOLINK" name="VIDEOLINK" value={configData.VIDEOLINK} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="FORM" className="form-label">Enlace del Formulario de Evaluación</label>
                    <input type="text" className="form-control" id="FORM" name="FORM" value={configData.FORM} onChange={handleChange} />
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
