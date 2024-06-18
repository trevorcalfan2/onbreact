import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../css/Form.css';  // Importa los estilos de Form

import { CSSTransition, TransitionGroup } from 'react-transition-group';

const About = ({ setView }) => {
    const [data, setData] = useState({
        vision: '',
        mision: '',
        nosotros: '',
        visionImage: '',
        misionImage: '',
        nosotrosImage: ''
    });

    const [page, setPage] = useState(0);
    const [checkList, setCheckList] = useState({
        vision: false,
        mision: false,
        nosotros: false,
    });

    const pages = ['Visión', 'Misión', 'Nosotros'];
    
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/configs`);
                if (response.data.length > 0) {
                    const configData = response.data[0];
                    setData(prevState => ({
                        ...prevState,
                        vision: configData.vision,
                        mision: configData.mision,
                        nosotros: configData.nosotros
                    }));
                }
            } catch (error) {
                console.error('Error fetching config data:', error);
            }
        };

        const fetchImages = async () => {
            try {
                const visionImage = await fetchImage('visionimg');
                const misionImage = await fetchImage('misionimg');
                const nosotrosImage = await fetchImage('nosotrosimg');
                setData(prevState => ({
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

        fetchConfig();
        fetchImages();
    }, []);

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCheckList(prevState => ({
            ...prevState,
            [name]: checked,
        }));
    };

    const handleNextPage = () => {
        if (page < pages.length - 1) {
            setPage(page + 1);
        } else {
            setView('form'); // Aquí redirigimos a la vista de Documentos
        }
    };

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const PageContent = ({ page }) => {
        const pageData = {
            0: { title: "Visión", text: data.vision, image: data.visionImage },
            1: { title: "Misión", text: data.mision, image: data.misionImage },
            2: { title: "Nosotros", text: data.nosotros, image: data.nosotrosImage }
        };

        return (
            <div className="row align-items-center">
                <div className="col-md-12">
                    <div className="custom-card h-100 mt-3">
                        <div className="custom-card-body d-flex">
                            <div className="text-section col-md-6 d-flex flex-column justify-content-center">
                                <p className="me-3 custom-card-text" style={{ whiteSpace: 'pre-wrap' }}>{pageData[page].text}</p>
                            </div>
                            <div className="image-section col-md-6 d-flex align-items-center justify-content-center">
                                {pageData[page].image && <img src={pageData[page].image} alt={pageData[page].title} className="img-fluid" style={{ maxHeight: '100%', objectFit: 'cover' }} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="form">
            <div className="progressbar">
                {pages.map((title, index) => (
                    <div
                        key={index}
                        className={`progress-step ${index === page ? 'active' : ''} ${index < page ? 'completed' : ''}`}
                    >
                        <div className="step">{index + 1}</div>
                        {index === page && <p className="active-title">{title}</p>}
                    </div>
                ))}
            </div>
            <div className="container-lg">
                <div className="header">
                    <h1 className='d-none'>{pages[page]}</h1>
                </div>
                <div className="body">
                    <TransitionGroup component={null}>
                        <CSSTransition key={page} timeout={300} classNames="fade">
                            <PageContent page={page} />
                        </CSSTransition>
                    </TransitionGroup>
                    <div className="form-check mt-3">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id={`${pages[page].toLowerCase()}-check`}
                            name={pages[page].toLowerCase()}
                            checked={checkList[pages[page].toLowerCase()]}
                            onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label" htmlFor={`${pages[page].toLowerCase()}-check`}>
                            He leído y comprendido
                        </label>
                    </div>
                </div>
                <div className="footer">
                    <div className="button-container">
                        <button
                            className="btn btn-secondary btn-md me-2"
                            disabled={page === 0}
                            onClick={handlePreviousPage}
                        >
                            Anterior
                        </button>

                        <button
                            className="btn btn-primary btn-md"
                            onClick={handleNextPage}
                            disabled={!checkList[pages[page].toLowerCase()]}
                        >
                            {page === pages.length - 1 ? "Continuar en Documentos" : "Siguiente"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
