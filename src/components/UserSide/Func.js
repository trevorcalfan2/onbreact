import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import config from '../../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

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

const Func = () => {
    const [cargoDescription, setCargoDescription] = useState('');
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

        fetchCargoDescription();
    }, [userCargoId]);

    return (
        <div className="container d-flex justify-content-center">
            <div className="card text-center" style={{ width: '50rem' }}>
                <div className="card-body">
                    <h5 className="card-title">Tu rol en la empresa</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{getCargoName(userCargoId)}</h6>
                    <p className="card-text" style={{ whiteSpace: 'pre-wrap' }}>
                        {cargoDescription}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Func;
