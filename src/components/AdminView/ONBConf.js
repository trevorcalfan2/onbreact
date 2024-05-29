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
    const [taskCargo, setTaskCargo] = useState(null); // Nuevo estado para tareas
    const [tasks, setTasks] = useState({
        acuerdoConfidencialidad: false,
        procesoDisciplinario: false,
        declaracionJurada: false,
        pagoSubvenciones: false
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

    const handleTaskChange = (e) => {
        const { name, checked } = e.target;
        setTasks({
            ...tasks,
            [name]: checked
        });
    };

    const handleTasks = (cargo) => {
        setTaskCargo(cargo);
        // Inicializar tasks si hay datos disponibles para el cargo
        // Aquí deberías cargar el estado real de las tareas desde la base de datos si es necesario
        setTasks({
            acuerdoConfidencialidad: false,
            procesoDisciplinario: false,
            declaracionJurada: false,
            pagoSubvenciones: false
        });
    };

    const handleCloseTasks = () => {
        setTaskCargo(null);
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
                                    <>
                                        <button className="btn btn-warning btn-sm me-1" onClick={() => handleEdit(cargo)}>
                                            Editar
                                        </button>
                                        <button className="btn btn-info btn-sm" onClick={() => handleTasks(cargo)}>
                                            Tareas
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {taskCargo && (
                <>
                    <div className="modal-overlay show"></div>
                    <div className="modal" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Tareas para {taskCargo.nombrE_CARGO}</h5>
                                    <button type="button" className="close" onClick={handleCloseTasks}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <td>Acuerdo de Confidencialidad</td>
                                                <td>
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            name="acuerdoConfidencialidad"
                                                            checked={tasks.acuerdoConfidencialidad}
                                                            onChange={handleTaskChange}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Proceso Disciplinario</td>
                                                <td>
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            name="procesoDisciplinario"
                                                            checked={tasks.procesoDisciplinario}
                                                            onChange={handleTaskChange}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Declaración Jurada de no tener antecedentes penales ni judiciales</td>
                                                <td>
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            name="declaracionJurada"
                                                            checked={tasks.declaracionJurada}
                                                            onChange={handleTaskChange}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Pago de Subvenciones</td>
                                                <td>
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            name="pagoSubvenciones"
                                                            checked={tasks.pagoSubvenciones}
                                                            onChange={handleTaskChange}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseTasks}>Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default ONBConf;
