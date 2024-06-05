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
    const [taskCargo, setTaskCargo] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [taskError, setTaskError] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        fetchCargos();
    }, []);

    const fetchCargos = () => {
        setLoading(true);
        axios.get(`${config.API_URL}/cargos`)
            .then(response => {
                setCargos(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Error al obtener los cargos');
                setLoading(false);
            });
    };

    const fetchTasks = (cargoId) => {
        axios.get(`${config.API_URL}/tareas`)
            .then(response => {
                const allTasks = response.data;
                axios.get(`${config.API_URL}/packs/cargo/${cargoId}`)
                    .then(packResponse => {
                        const packTasks = packResponse.data;
                        const tasksWithState = allTasks.map(task => ({
                            ...task,
                            completed: packTasks.some(pack => pack.iD_TAREA === task.iD_TAREA)
                        }));
                        setTasks(tasksWithState);
                    })
                    .catch(error => {
                        setError('Error al obtener las tareas del cargo');
                    });
            })
            .catch(error => {
                setError('Error al obtener las tareas');
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
                setToastMessage('La descripción del cargo se ha actualizado correctamente.');
                setShowToast(true);
            })
            .catch(error => {
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
        setTasks(tasks.map(task =>
            task.iD_TAREA === parseInt(name) ? { ...task, completed: checked } : task
        ));
    };

    const handleTasks = (cargo) => {
        setTaskCargo(cargo);
        fetchTasks(cargo.iD_CARGO);
    };

    const handleSaveTasks = () => {
        const tasksToSave = tasks.filter(task => task.completed);
        if (tasksToSave.length === 0) {
            setTaskError('Debe seleccionar al menos una tarea');
            return;
        }

        const packsToSave = tasksToSave.map(task => ({
            iD_CARGO: taskCargo.iD_CARGO,
            iD_TAREA: task.iD_TAREA
        }));

        axios.post(`${config.API_URL}/packs/bulk`, packsToSave)
            .then(response => {
                handleCloseTasks();
                setToastMessage('Las tareas se han guardado correctamente.');
                setShowToast(true);
            })
            .catch(error => {
                setError('Error al guardar las tareas');
            });
    };

    const handleCloseTasks = () => {
        setTaskCargo(null);
        setTaskError(null);
    };

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

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
                                    {taskError && (
                                        <div className="alert alert-danger" role="alert">
                                            {taskError}
                                        </div>
                                    )}
                                    <table className="table">
                                        <tbody>
                                            {tasks.map(task => (
                                                <tr key={task.iD_TAREA}>
                                                    <td>{task.nombrE_TAREA}</td>
                                                    <td>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name={task.iD_TAREA.toString()}
                                                                checked={task.completed}
                                                                onChange={handleTaskChange}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" onClick={handleSaveTasks}>Guardar</button>
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseTasks}>Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {showToast && (
                <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
                    <div className="toast show align-items-center text-white bg-success border-0">
                        <div className="d-flex">
                            <div className="toast-body">
                                {toastMessage}
                            </div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowToast(false)}></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ONBConf;
