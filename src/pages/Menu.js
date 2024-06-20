import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Menu.css';
import Form from '../components/Onboarding/Form';
import Welcome from '../components/UserSide/Welcome';
import Func from '../components/UserSide/Func';
import About from '../components/UserSide/About';
import Ev from '../components/UserSide/Ev';
import axios from 'axios';
import config from '../config';
import EndForm from '../components/Onboarding/EndForm'

function Menu() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const [view, setView] = useState('welcome');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState('');
    const [newProfilePhoto, setNewProfilePhoto] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const cerrarSesion = () => {
        cookies.remove('useR_ID', { path: '/' });
        cookies.remove('nombre', { path: '/' });
        cookies.remove('apellido', { path: '/' });
        cookies.remove('email', { path: '/' });
        cookies.remove('fechaicontrato', { path: '/' });
        cookies.remove('estado', { path: '/' });
        cookies.remove('isadmin', { path: '/' });
        cookies.remove('reG_DATE', { path: '/' });
        cookies.remove('uP_DATE', { path: '/' });
        cookies.remove('llog', { path: '/' });
        cookies.remove('iD_CARGO', { path: '/' });
        cookies.remove('onB_ESTADO', { path: '/' });
        navigate("/");
    }

    useEffect(() => {
        if (!cookies.get('useR_ID')) {
            navigate("/");
        }
    }, [cookies, navigate]);

    useEffect(() => {
        const fetchProfilePhoto = async () => {
            const userId = cookies.get('useR_ID');
            try {
                const response = await axios.get(`${config.API_URL}/ImageManagement/getImage/${userId}`, { responseType: 'blob' });
                const imageObjectURL = URL.createObjectURL(response.data);
                setProfilePhoto(imageObjectURL);

                // Clean up the object URL to avoid memory leaks
                return () => {
                    URL.revokeObjectURL(imageObjectURL);
                };
            } catch (error) {
                console.error('Error fetching profile photo:', error);
            }
        };
        fetchProfilePhoto();
    }, []);  // Notice the empty dependency array here

    const handleButtonClick = (viewName) => {
        setView(viewName);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [dropdownOpen]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProfilePhoto(file);
        }
    };

    const handleUpdateProfilePhoto = async () => {
        const userId = cookies.get('useR_ID');
        const formData = new FormData();
        formData.append('file', newProfilePhoto);
        formData.append('prefix', userId);

        setIsUpdating(true);
        try {
            await axios.post(`${config.API_URL}/ImageManagement/uploadImage`, formData);
            const response = await axios.get(`${config.API_URL}/ImageManagement/getImage/${userId}`, { responseType: 'blob' });
            const imageObjectURL = URL.createObjectURL(response.data);
            setProfilePhoto(imageObjectURL);
            setNewProfilePhoto(null);
            setShowProfileModal(false);

            // Clean up the object URL to avoid memory leaks
            return () => {
                URL.revokeObjectURL(imageObjectURL);
            };
        } catch (error) {
            console.error('Error updating profile photo:', error);
            setErrorMessage('Hubo un error al actualizar la foto de perfil. Por favor, inténtelo de nuevo.');
        } finally {
            setIsUpdating(false);
        }
    };

    const renderComponent = () => {
        const onBEstado = cookies.get('onB_ESTADO');
        
        switch (view) {
          case 'welcome':
            return <Welcome setView={setView} />;
          case 'form':
            if (onBEstado === false) {
                return <div>Ya has completado todos los formularios.</div>;
            }
           else{return <Form setView={setView} />;}
          case 'func':
            return <Func setView={setView} />;
          case 'about':
            return <About setView={setView} />;
          case 'ev':
            return <Ev setView={setView} />;
        case 'endform':
                return <EndForm setView={setView} />;

          default:
            return <Welcome setView={setView} />;
        }
      };

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

    const cargoName = getCargoName(cookies.get('iD_CARGO'));

    const handleShowProfile = () => setShowProfileModal(true);
    const handleCloseProfile = () => {
        setShowProfileModal(false);
        setNewProfilePhoto(null);
        setErrorMessage('');
    };
    return (
        <>
            <div className="cont">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">ANGKOR GROUP</a>
                        <button className="navbar-toggler" type="button" onClick={toggleDropdown} aria-controls="navbarNavDropdown" aria-expanded={dropdownOpen} aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className={`collapse navbar-collapse ${dropdownOpen ? 'show' : ''}`} id="navbarNavDropdown">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item dropdown" ref={dropdownRef}>
                                    <a className="nav-link dropdown-toggle no-background" href="#" role="button" onClick={toggleDropdown} aria-expanded={dropdownOpen}>
                                        <img src={isUpdating ? 'https://via.placeholder.com/30' : profilePhoto || 'https://via.placeholder.com/30'} alt="User Avatar" className="rounded-circle me-2" style={{ width: '30px', height: '30px' }} /> {cookies.get('nombre')} {cookies.get('apellido')}
                                    </a>
                                    <ul className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdownMenuLink">
                                        <li className="dropdown-header">Bienvenido, {cookies.get('nombre')} {cookies.get('apellido')}</li>
                                        <li><a className="dropdown-item" href="#">{cargoName}</a></li>
                                        <li><a className="dropdown-item" href="#">{cookies.get('email')}</a></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><a className="dropdown-item" href="#" onClick={handleShowProfile}>Ver Perfil</a></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><a className="dropdown-item" href="#" onClick={cerrarSesion}>Cerrar Sesión</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <br />
                <div className="wrapper d-flex">
                    <nav id="sidebar">
                        <div className="sidebar-header">
                            <h3>ANGKOR GROUP</h3>
                            <strong>AG</strong>
                        </div>
                        <ul className="list-unstyled components">
                            <li>
                                <a href="#" onClick={() => handleButtonClick('welcome')} className={view === 'welcome' ? 'active' : ''}>
                                    <i className="fa-solid fa-house"></i>
                                    Bienvenido
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={() => handleButtonClick('about')} className={view === 'about' ? 'active' : ''}>
                                    <i className="fas fa-info-circle"></i>
                                    Conócenos
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={() => handleButtonClick('form')} className={view === 'form' ? 'active' : ''}>
                                    <i className="fas fa-file-alt"></i>
                                    Documentos
                                </a>
                            </li>

                            <li>
                                <a href="#" onClick={() => handleButtonClick('func')} className={view === 'func' ? 'active' : ''}>
                                    <i className="fas fa-stream"></i>
                                    Inducción
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={() => handleButtonClick('ev')} className={view === 'ev' ? 'active' : ''}>
                                    <i className="fas fa-tasks"></i>
                                    Evaluacion
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <div id="content" >
                        {renderComponent()}
                    </div>
                </div>
            </div>

            {/* Profile Modal */}
            {showProfileModal && (
                <div className="custom-modal">
                    <div className="custom-modal-content">
                        <span className="close" onClick={handleCloseProfile}>&times;</span>
                        <div className="modal-header">
                            <h5 className="modal-title">Perfil del Usuario</h5>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <p><strong>Nombre:</strong> {cookies.get('nombre')}</p>
                                    <p><strong>Apellido:</strong> {cookies.get('apellido')}</p>
                                    <p><strong>Email:</strong> {cookies.get('email')}</p>
                                    <p><strong>Fecha de Inicio de Contrato:</strong> {cookies.get('fechaicontrato')}</p>
                                    <p><strong>Estado:</strong> {cookies.get('estado') === 'true' || cookies.get('estado') === true ? 'Activo' : 'Inactivo'}</p>
                                    <p><strong>Fecha de Registro:</strong> {cookies.get('reG_DATE')}</p>
                                    <p><strong>Última Actualización:</strong> {cookies.get('uP_DATE')}</p>
                                    <p><strong>Último Inicio de Sesión:</strong> {cookies.get('llog')}</p>
                                    <p><strong>Cargo:</strong> {cargoName}</p>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="profilePhoto">Actualizar Foto de Perfil</label>
                                        <input
                                            type="file"
                                            className="form-control-file"
                                            id="profilePhoto"
                                            onChange={handleFileChange}
                                            accept=".jpg"
                                        />
                                    </div>
                                    <div className="mt-3">
                                        <p><strong>Previsualización Actual:</strong></p>
                                        {isUpdating ? (
                                            <img src="https://via.placeholder.com/100" alt="Loading" className="img-thumbnail" style={{ width: '100px', height: '100px' }} />
                                        ) : (
                                            profilePhoto && <img src={profilePhoto} alt="Foto Actual de Perfil" className="img-thumbnail" style={{ width: '100px', height: '100px' }} />
                                        )}
                                    </div>
                                    <div className="mt-3">
                                        <p><strong>Previsualización Nueva:</strong></p>
                                        {newProfilePhoto && <img src={URL.createObjectURL(newProfilePhoto)} alt="Nueva Foto de Perfil" className="img-thumbnail" style={{ width: '100px', height: '100px' }} />}
                                    </div>
                                    {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary mb-0 me-2" onClick={handleUpdateProfilePhoto} disabled={!newProfilePhoto}>Actualizar Foto de Perfil</button>
                            <button className="btn btn-secondary mb-0" onClick={handleCloseProfile}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Menu;
