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

function Menu() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const [view, setView] = useState('welcome');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

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

    const renderComponent = () => {
        const onBEstado = cookies.get('onB_ESTADO');
        
       
      
        switch (view) {
          case 'welcome':
            return <Welcome setView={setView} />;
          case 'form':
            if (onBEstado === false) {
                return <div>Ya has completado todos los formularios.</div>;
            }
           else{return <Form />;}
          case 'func':
            return <Func />;
          case 'about':
            return <About setView={setView} />;
          case 'ev':
            return <Ev  />;

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
    const handleCloseProfile = () => setShowProfileModal(false);

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
                                        <img src="https://via.placeholder.com/30" alt="User Avatar" className="rounded-circle me-2" /> {cookies.get('nombre')} {cookies.get('apellido')}
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
                    <div id="content" className="p-3">
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
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={handleCloseProfile}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Menu;
