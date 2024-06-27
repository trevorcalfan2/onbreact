import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import config from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const getCargoName = (id) => {
    switch (id?.toString()) {
        case '1':
            return 'Analista';
        case '2':
            return 'Gerente';
        case '3':
            return 'Jefe';
        case '4':
            return 'Practicante';
        default:
            return 'Desconocido';
    }
};

const Func = ({ setView }) => {
    const [cargoDescription, setCargoDescription] = useState('');
    const [contacts, setContacts] = useState([]);
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(0);
    const [checkList, setCheckList] = useState({
        role: false,
        contacts: false,
        videos: []
    });

    const cookies = new Cookies();
    const userCargoId = cookies.get('iD_CARGO');

    useEffect(() => {
        const fetchCargoDescription = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/cargos/${userCargoId}`);
                setCargoDescription(response.data.descripcion);
            } catch (error) {
                console.error('Error al obtener la descripción del cargo:', error);
            }
        };

        const fetchContacts = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/contactos`);
                const allContacts = response.data;
                const packResponse = await axios.get(`${config.API_URL}/packcontactos/cargo/${userCargoId}`);
                const packContacts = packResponse.data.map(pack => pack.id);
                const contactsForCargo = allContacts.filter(contact => packContacts.includes(contact.id));
                setContacts(contactsForCargo);
            } catch (error) {
                console.error('Error al obtener los contactos:', error);
            }
        };

        const fetchVideos = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/videos`);
                const allVideos = response.data;
                const packResponse = await axios.get(`${config.API_URL}/packvideos/cargo/${userCargoId}`);
                const packVideos = packResponse.data.map(pack => pack.id);
                const videosForCargo = allVideos.filter(video => packVideos.includes(video.id));
                const transformedVideos = videosForCargo.map(video => ({
                    ...video,
                    embedLink: video.link.replace("watch?v=", "embed/")
                }));
                setVideos(transformedVideos);
                setCheckList(prevCheckList => ({
                    ...prevCheckList,
                    videos: transformedVideos.map(() => false)
                }));
            } catch (error) {
                console.error('Error al obtener los videos:', error);
            }
        };

        fetchCargoDescription();
        fetchContacts();
        fetchVideos();
    }, [userCargoId]);

    const pages = ['Tu rol en la empresa', 'Contactos', ...videos.map((_, index) => `Video de Inducción ${index + 1}`), 'Fin de la Inducción'];

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        if (name.startsWith('video')) {
            const index = parseInt(name.replace('video', ''), 10);
            setCheckList(prevState => ({
                ...prevState,
                videos: prevState.videos.map((val, i) => (i === index ? checked : val))
            }));
        } else {
            setCheckList(prevState => ({
                ...prevState,
                [name]: checked,
            }));
        }
    };

    const handleNextPage = () => {
        if (page < pages.length - 1) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const RoleView = () => (
        <div className="container d-flex justify-content-center">
            <div className="custom-card" style={{ width: '50rem' }}>
                <div className="custom-card-body">
                    <h5 className="custom-card-subtitle mb-2">{getCargoName(userCargoId)}</h5>
                    <p className="custom-card-text">
                        {cargoDescription}
                    </p>
                </div>
            </div>
        </div>
    );

    const ContactsView = () => (
        <div className="container">
            <div className="row row-cols-1 row-cols-md-2 g-4">
                {contacts.map(contact => (
                    <div className="col" key={contact.id}>
                        <div className="custom-card">
                            <div className="custom-card-body">
                                <h5 className="custom-card-title">{contact.nombre}</h5>
                                <p className="custom-card-text">Teléfono: {contact.telf}</p>
                                <p className="custom-card-text">Correo: {contact.correo}</p>
                                <p className="custom-card-text">Cargo: {contact.cargo}</p>
                                <p className="custom-card-text text-break">Más: {contact.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const VideoView = ({ video, index }) => (
        <div className="container mb-0">
            <div className="custom-card">
                <div className="custom-card-body d-flex">
                    <div className="text-section col-md-6 d-flex flex-column justify-content-center p-3">
                        <h2 className="custom-card-title text-break fs-4">{video.titulo}</h2>
                        <p className="custom-card-text text-break">{video.descripcion}</p>
                    </div>
                    <div className="image-section col-md-6 d-flex align-items-center justify-content-center p-3">
                        <iframe
                            width="100%"
                            height="315"
                            src={video.embedLink}
                            title={video.titulo}
                            frameBorder="0"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );

    const EndView = () => (
        <div className="container d-flex justify-content-center">
            <div className="custom-card" style={{ width: '50rem' }}>
                <div className="custom-card-body text-center">
                    <h5 className="custom-card-subtitle mb-2">Fin de la Inducción</h5>
                    <p className="custom-card-text">¡Has completado el proceso de inducción! Ahora puedes proceder a la evaluación.</p>
                    <button className="btn btn-primary" onClick={() => setView('ev')}>Ir a Evaluación</button>
                </div>
            </div>
        </div>
    );

    const PageContent = ({ page }) => {
        if (page === 0) {
            return <RoleView />;
        } else if (page === 1) {
            return <ContactsView />;
        } else if (page === pages.length - 1) {
            return <EndView />;
        } else {
            const videoIndex = page - 2;
            return <VideoView video={videos[videoIndex]} index={videoIndex} />;
        }
    };

    const scrollToActiveStep = () => {
        const activeStep = document.querySelector('.progress-step.active');
        if (activeStep) {
            const progressBar = document.querySelector('.progressbar');
            const offsetLeft = activeStep.offsetLeft;
            const scrollLeft = offsetLeft - (window.innerWidth / 2 - activeStep.clientWidth / 2);
            progressBar.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        scrollToActiveStep();
    }, [page]);

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
                    <TransitionGroup>
                        <CSSTransition key={page} timeout={300} classNames="fade">
                            <PageContent page={page} />
                        </CSSTransition>
                    </TransitionGroup>
                    {page < pages.length - 1 && (
                        <div className="form-check mt-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id={page === 0 ? 'role-check' : page === 1 ? 'contacts-check' : `video${page - 2}-check`}
                                name={page === 0 ? 'role' : page === 1 ? 'contacts' : `video${page - 2}`}
                                checked={page === 0 ? checkList.role : page === 1 ? checkList.contacts : checkList.videos[page - 2]}
                                onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label" htmlFor={page === 0 ? 'role-check' : page === 1 ? 'contacts-check' : `video${page - 2}-check`}>
                                He leído y comprendido
                            </label>
                        </div>
                    )}
                </div><br/>
                <div className="footer">
                    <div className="button-container">
                        <button
                            className="btn btn-secondary btn-md me-2"
                            disabled={page === 0}
                            onClick={handlePreviousPage}
                        >
                            Anterior
                        </button>

                        {page < pages.length - 1 && (
                            <button
                                className="btn btn-primary btn-md"
                                onClick={handleNextPage}
                                disabled={page === 0 ? !checkList.role : page === 1 ? !checkList.contacts : page > 1 && !checkList.videos[page - 2]}
                            >
                                Siguiente
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Func;
