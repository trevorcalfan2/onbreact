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

    useEffect(() => {
        if (cookies.get('useR_ID')  ) {
            navigate("/menu");
        }
        if (cookies.get('id')  ) {
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
        await axios.get(`${url}/${form.email}/${md5(form.password)}`)
            .then(response => {
                return response.data;
            }).then(response => {


                if (response.length > 0) {




                    const respuesta = response[0];


                    if(isAdminView){
                    cookies.set('id', respuesta.id, { path: '/' });
                    cookies.set('nombre', respuesta.nombre, { path: '/' });
                    cookies.set('apellido', respuesta.apellido, { path: '/' });
                    cookies.set('email', respuesta.email, { path: '/' });
                    cookies.set('estado', respuesta.estado, { path: '/' });
                    cookies.set('reG_DATE', respuesta.reG_DATE, { path: '/' });
                    cookies.set('uP_DATE', respuesta.uP_DATE, { path: '/' });
                   
                  }
                    else{
                      cookies.set('useR_ID', respuesta.useR_ID, { path: '/' });
                      cookies.set('nombre', respuesta.nombre, { path: '/' });
                      cookies.set('apellido', respuesta.apellido, { path: '/' });
                      cookies.set('email', respuesta.email, { path: '/' });
                      cookies.set('fechaicontrato', respuesta.fechaicontrato, { path: '/' });
                      cookies.set('estado', respuesta.estado, { path: '/' });
                      cookies.set('reG_DATE', respuesta.reG_DATE, { path: '/' });
                      cookies.set('uP_DATE', respuesta.uP_DATE, { path: '/' });
                      cookies.set('llog', respuesta.llog, { path: '/' });
                      cookies.set('iD_CARGO', respuesta.iD_CARGO, { path: '/' });
                      cookies.set('isadmin',isAdminView, { path: '/' })
                    }


                    cookies.set('isadmin', isAdminView, { path: '/' });


                    navigate(isAdminView ? "/menuadmin" : "/menu");


                    document.body.classList.remove('admin-view');


                } else {
                    alert('El usuario o la contraseña no son correctos');
                }
            })
            .catch(error => {
                console.log(error);
            });
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
