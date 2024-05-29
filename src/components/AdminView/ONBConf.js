import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import config from '../../config';
import '../../css/Index.css';

function ONBConf() {
    const [cargos, setCargos] = useState([]);
    const [editingCargo, setEditingCargo] = useState(null);
    const [editedCargo, setEditedCargo] = useState({
        iD_CARGO: '',
        nombrE_CARGO: '',
        descripcion: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCargos();
    }, []);

    const fetchCargos = () => {
        setLoading(true);
        axios.get(`${config.API_URL}/cargos`)
            .then(response => {
                console.log('Cargos recibidos:', response.data);
                setCargos(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener los cargos:', error);
                setError('Error al obtener los cargos');
                setLoading(false);
            });
    };

    const handleEdit = (cargo) => {
        setEditingCargo(cargo.iD_CARGO);
        setEditedCargo({
            iD_CARGO: cargo.iD_CARGO,
            nombrE_CARGO: cargo.nombrE_CARGO,
            descripcion: cargo.descripcion || ''
        });
    };

    const handleSaveEdit = () => {
        axios.put(`${config.API_URL}/cargos/${editingCargo}`, editedCargo)
            .then(response => {
                fetchCargos();
                setEditingCargo(null);
                setEditedCargo({ iD_CARGO: '', nombrE_CARGO: '', descripcion: '' });
            })
            .catch(error => {
                console.error('Error al actualizar el cargo:', error);
                setError('Error al actualizar el cargo');
            });
    };

    const handleCancelEdit = () => {
        setEditingCargo(null);
        setEditedCargo({ iD_CARGO: '', nombrE_CARGO: '', descripcion: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedCargo({
            ...editedCargo,
            [name]: value
        });
    };

    if (loading) {
        return <div className="container">Cargando...</div>;
    }

    if (error) {
        return <div className="container text-danger">{error}</div>;
    }

    return (
        <div className="container">
            <h2>Configuración de Cargos</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre del Cargo</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {cargos.map(cargo => (
                        <tr key={cargo.iD_CARGO}>
                            <td>{cargo.iD_CARGO}</td>
                            <td>
                                {editingCargo === cargo.iD_CARGO ? (
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nombrE_CARGO"
                                        value={editedCargo.nombrE_CARGO}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    cargo.nombrE_CARGO
                                )}
                            </td>
                            <td>
                                {editingCargo === cargo.iD_CARGO ? (
                                    <textarea
                                        className="form-control"
                                        name="descripcion"
                                        value={editedCargo.descripcion}
                                        onChange={handleInputChange}
                                        style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                                    />
                                ) : (
                                    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{cargo.descripcion}</pre>
                                )}
                            </td>
                            <td>
                                {editingCargo === cargo.iD_CARGO ? (
                                    <>
                                        <button className="btn btn-primary btn-sm me-1" onClick={handleSaveEdit}>
                                            Guardar
                                        </button>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <button className="btn btn-warning btn-sm" onClick={() => handleEdit(cargo)}>
                                        Editar
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ONBConf;
