import React, { useEffect, useState } from 'react';
import md5 from 'md5';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../css/Login.css';
import config from '../config';

function Login(props) {
    const baseUrl = `${config.API_URL}/usuarios`;
    const baseUrlAd = `${config.API_URL}/admins`;
    console.log('URL generada:', baseUrl); // Verifica la URL generada
    const cookies = new Cookies();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [isAdminView, setIsAdminView] = useState(false);
    const [alert, setAlert] = useState({
        show: false,
        message: '',
        variant: 'danger'
    });

    useEffect(() => {
        if (cookies.get('useR_ID')) {
            navigate("/menu");
        }
        if (cookies.get('id')) {
            navigate("/menuadmin");
        }
    }, [cookies, navigate]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    }

    const iniciarSesion = async () => {
        const url = isAdminView ? baseUrlAd : baseUrl;

        try {
            const response = await axios.get(`${url}/${form.email}/${md5(form.password)}`);
            const respuesta = response.data;

            if (respuesta.length > 0) {
                const user = respuesta[0];

                if (user.estado !== 'true') {
                    setAlert({
                        show: true,
                        message: 'El usuario no está activo. Por favor, contacte con el administrador.',
                        variant: 'warning'
                    });
                    return;
                }

                if (isAdminView) {
                    cookies.set('id', user.id, { path: '/' });
                    cookies.set('nombre', user.nombre, { path: '/' });
                    cookies.set('apellido', user.apellido, { path: '/' });
                    cookies.set('email', user.email, { path: '/' });
                    cookies.set('estado', user.estado, { path: '/' });
                    cookies.set('reG_DATE', user.reG_DATE, { path: '/' });
                    cookies.set('uP_DATE', user.uP_DATE, { path: '/' });
                } else {
                    cookies.set('useR_ID', user.useR_ID, { path: '/' });
                    cookies.set('nombre', user.nombre, { path: '/' });
                    cookies.set('apellido', user.apellido, { path: '/' });
                    cookies.set('email', user.email, { path: '/' });
                    cookies.set('fechaicontrato', user.fechaicontrato, { path: '/' });
                    cookies.set('estado', user.estado, { path: '/' });
                    cookies.set('reG_DATE', user.reG_DATE, { path: '/' });
                    cookies.set('uP_DATE', user.uP_DATE, { path: '/' });
                    cookies.set('llog', user.llog, { path: '/' });
                    cookies.set('iD_CARGO', user.iD_CARGO, { path: '/' });
                    cookies.set('isadmin', isAdminView, { path: '/' });
                    cookies.set('onB_ESTADO', user.onB_ESTADO, { path: '/' });

                    // Actualizar LLOG  
                    const updatedUser = {
                        ...user,
                        llog: new Date().toISOString()
                    };
                    await axios.put(`${baseUrl}/${user.useR_ID}`, updatedUser);
                }

                cookies.set('isadmin', isAdminView, { path: '/' });

                navigate(isAdminView ? "/menuadmin" : "/menu");

                document.body.classList.remove('admin-view');
            } else {
                setAlert({
                    show: true,
                    message: 'El usuario o la contraseña no son correctos',
                    variant: 'danger'
                });
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setAlert({
                    show: true,
                    message: 'El usuario o la contraseña no son correctos',
                    variant: 'danger'
                });
            } else {
                console.error('Error:', error);
                setAlert({
                    show: true,
                    message: 'Error de conexión. Por favor, inténtelo de nuevo más tarde.',
                    variant: 'danger'
                });
            }
        }
    }

    const cambiarVistaAdmin = () => {
        setIsAdminView(prevState => !prevState);
        // Agregar o quitar clase al body
        if (!isAdminView) {
            document.body.classList.add('admin-view');
        } else {
            document.body.classList.remove('admin-view');
        }
    }

    return (
        <div className="d-flex align-items-center justify-content-center h-100">
            <div className={`container text-center ${isAdminView ? 'admin-view' : ''}`}>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <h1 className={`mb-3 ${isAdminView ? 'text-white' : 'text-dark'}`}>
                            {isAdminView ? 'Acceder como Administrador' : 'Acceder como Cliente'}
                        </h1>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ingresar email"
                                name='email'
                                onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Ingresar contraseña"
                                name='password'
                                onChange={handleChange} />
                        </div>
                        <div className="d-grid mb-3">
                            <button className="btn btn-primary btn-lg" onClick={iniciarSesion}>Iniciar Sesión</button>
                        </div>
                        <div className="d-grid">
                            <span className="btn btn-link" onClick={cambiarVistaAdmin}>
                                {isAdminView ? 'Cambiar a Cliente' : 'Cambiar a Administrador'}
                            </span>
                        </div>
                        {alert.show && (
                            <div className={`alert alert-${alert.variant} mt-3`} role="alert">
                                {alert.message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
