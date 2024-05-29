import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import '../css/MenuAdmin.css';
import Dashboard from '../components/AdminView/Dashboard';
import User from '../components/UserCrud/User';
import CreateUser from '../components/UserCrud/CreateUser';
import Config from '../components/AdminView/Config';
import Onboarding from '../components/AdminView/ONBConf';

function MenuAdmin() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const cerrarSesion = () => {
        cookies.remove('id', { path: '/' });
        cookies.remove('nombre', { path: '/' });
        cookies.remove('apellido', { path: '/' });
        cookies.remove('email', { path: '/' });
        cookies.remove('estado', { path: '/' });
        cookies.remove('reG_DATE', { path: '/' });
        cookies.remove('uP_DATE', { path: '/' });
        cookies.remove('isadmin', { path: '/' });
        navigate("/");
    }

    useEffect(() => {
        if (!cookies.get('id')) {
            navigate("/");
        }
        if (cookies.get('isadmin') === 'false') {
            navigate("/");
        }
    }, [cookies, navigate]);

    const [view, setView] = useState('dashboard');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const handleButtonClick = (viewName) => {
        setView(viewName);
    };

    const toggleDropdown = (event) => {
        event.preventDefault();
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
        switch(view) {
            case 'user':
                return <User setView={setView} />;
            case 'createUser':
                return <CreateUser setView={setView} />;
            case 'configuracion':
                return <Config />; // Añadimos la vista de configuración aquí
            case 'onboarding':
                return <Onboarding />;
            default:
                return <Dashboard />;
        }
    };

    const handleShowProfile = () => setShowProfileModal(true);
    const handleCloseProfile = () => setShowProfileModal(false);

    return (
        <>
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
                                    <li><a className="dropdown-item" href="#">ADMIN</a></li>
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
            <div className="wrapper d-flex">
                <nav id="sidebar">
                    <div className="sidebar-header">
                        <h3>ANGKOR GROUP</h3>
                        <strong>AG</strong>
                    </div>

                    <ul className="list-unstyled components">
                        <li>
                            <a href="#" onClick={() => handleButtonClick('dashboard')} className={view === 'dashboard' ? 'active' : ''}>
                                <i className="fa-solid fa-chart-simple"></i>
                                Dashboard
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => handleButtonClick('user')} className={view === 'user' ? 'active' : ''}>
                                <i className="fas fa-user"></i>
                                Usuarios
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => handleButtonClick('configuracion')} className={view === 'configuracion' ? 'active' : ''}>
                                <i className="fas fa-cog"></i>
                                Configuración
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={() => handleButtonClick('onboarding')} className={view === 'onboarding' ? 'active' : ''}>
                                <i className="fas fa-user-plus"></i>
                                Onboarding
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fas fa-paper-plane"></i>
                                Contact
                            </a>
                        </li>
                    </ul>
                </nav>
                <div id="content" className="p-3" style={{ marginLeft: '250px' }}>
                    {renderComponent()}
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
                            
                            <p><strong>Fecha de Registro:</strong> {cookies.get('reG_DATE')}</p>
                            <p><strong>Última Actualización:</strong> {cookies.get('uP_DATE')}</p>
                          
                            <p><strong>Cargo:</strong> ADMIN</p>
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

export default MenuAdmin;
