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
    const [contacts, setContacts] = useState([]);
    const [associatedContacts, setAssociatedContacts] = useState([]);
    const [videos, setVideos] = useState([]);
    const [associatedVideos, setAssociatedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [taskError, setTaskError] = useState(null);
    const [contactError, setContactError] = useState(null);
    const [videoError, setVideoError] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [contactCargo, setContactCargo] = useState(null);
    const [videoCargo, setVideoCargo] = useState(null);

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
        if (!cargoId) {
            setError('ID del cargo no está definido');
            return;
        }
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

    const fetchContacts = (cargoId) => {
        if (!cargoId) {
            setError('ID del cargo no está definido');
            return;
        }
        axios.get(`${config.API_URL}/contactos`)
            .then(response => {
                const allContacts = response.data;
                axios.get(`${config.API_URL}/packcontactos/cargo/${cargoId}`)
                    .then(packResponse => {
                        const packContacts = packResponse.data;
                        const associatedContactIds = packContacts.map(pack => pack.id);
                        const contactsWithState = allContacts.filter(contact => !associatedContactIds.includes(contact.id));
                        setContacts(contactsWithState);
                        setAssociatedContacts(allContacts.filter(contact => associatedContactIds.includes(contact.id)));
                    })
                    .catch(error => {
                        setError('Error al obtener los contactos del cargo');
                    });
            })
            .catch(error => {
                setError('Error al obtener los contactos');
            });
    };

    const fetchVideos = (cargoId) => {
        if (!cargoId) {
            setError('ID del cargo no está definido');
            return;
        }
        axios.get(`${config.API_URL}/videos`)
            .then(response => {
                const allVideos = response.data;
                axios.get(`${config.API_URL}/packvideos/cargo/${cargoId}`)
                    .then(packResponse => {
                        const packVideos = packResponse.data;
                        const associatedVideoIds = packVideos.map(pack => pack.id);
                        const videosWithState = allVideos.filter(video => !associatedVideoIds.includes(video.id));
                        setVideos(videosWithState);
                        setAssociatedVideos(allVideos.filter(video => associatedVideoIds.includes(video.id)));
                    })
                    .catch(error => {
                        setError('Error al obtener los videos del cargo');
                    });
            })
            .catch(error => {
                setError('Error al obtener los videos');
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

    const handleContactChange = (e) => {
        const { name, checked } = e.target;
        setContacts(contacts.map(contact =>
            contact.id === parseInt(name) ? { ...contact, associated: checked } : contact
        ));
    };

    const handleVideoChange = (e) => {
        const { name, checked } = e.target;
        setVideos(videos.map(video =>
            video.id === parseInt(name) ? { ...video, associated: checked } : video
        ));
    };

    const handleTasks = (cargo) => {
        if (!cargo || !cargo.iD_CARGO) {
            setError('Cargo no está definido');
            return;
        }
        setTaskCargo(cargo);
        fetchTasks(cargo.iD_CARGO);
    };

    const handleContacts = (cargo) => {
        if (!cargo || !cargo.iD_CARGO) {
            setError('Cargo no está definido');
            return;
        }
        setContactCargo(cargo);
        fetchContacts(cargo.iD_CARGO);
    };

    const handleVideos = (cargo) => {
        if (!cargo || !cargo.iD_CARGO) {
            setError('Cargo no está definido');
            return;
        }
        setVideoCargo(cargo);
        fetchVideos(cargo.iD_CARGO);
    };

    const handleAddContact = (contactId) => {
        setContacts(contacts.filter(contact => contact.id !== contactId));
        setAssociatedContacts(associatedContacts.concat(contacts.find(contact => contact.id === contactId)));
    };

    const handleRemoveContact = (contactId) => {
        if (associatedContacts.length > 1) {
            setAssociatedContacts(associatedContacts.filter(contact => contact.id !== contactId));
            setContacts(contacts.concat(associatedContacts.find(contact => contact.id === contactId)));
        } else {
            setContactError('Debe haber al menos un contacto asociado');
        }
    };

    const handleAddVideo = (videoId) => {
        setVideos(videos.filter(video => video.id !== videoId));
        setAssociatedVideos(associatedVideos.concat(videos.find(video => video.id === videoId)));
    };

    const handleRemoveVideo = (videoId) => {
        if (associatedVideos.length > 1) {
            setAssociatedVideos(associatedVideos.filter(video => video.id !== videoId));
            setVideos(videos.concat(associatedVideos.find(video => video.id === videoId)));
        } else {
            setVideoError('Debe haber al menos un video asociado');
        }
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

    const handleSaveContacts = () => {
        const contactsToSave = associatedContacts.map(contact => ({
            ID_CARGO: contactCargo.iD_CARGO,
            ID: contact.id
        }));
    
        axios.post(`${config.API_URL}/packcontactos/bulk`, contactsToSave)
            .then(response => {
                handleCloseContacts();
                setToastMessage('Los contactos se han guardado correctamente.');
                setShowToast(true);
                fetchContacts(contactCargo.iD_CARGO); // Refetch contacts to update state
            })
            .catch(error => {
                setError('Error al guardar los contactos');
            });
    };
    
    const handleSaveVideos = () => {
        const videosToSave = associatedVideos.map(video => ({
            ID_CARGO: videoCargo.iD_CARGO,
            ID: video.id
        }));
    
        axios.post(`${config.API_URL}/packvideos/bulk`, videosToSave)
            .then(response => {
                handleCloseVideos();
                setToastMessage('Los videos se han guardado correctamente.');
                setShowToast(true);
                fetchVideos(videoCargo.iD_CARGO); // Refetch videos to update state
            })
            .catch(error => {
                setError('Error al guardar los videos');
            });
    };
    
    const handleCloseTasks = () => {
        setTaskCargo(null);
        setTaskError(null);
    };
    
    const handleCloseContacts = () => {
        setContactCargo(null);
        setContactError(null);
    };
    
    const handleCloseVideos = () => {
        setVideoCargo(null);
        setVideoError(null);
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
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cargo</th>
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
                                        <button className="btn btn-info btn-sm me-1" onClick={() => handleTasks(cargo)}>
                                            Tareas
                                        </button>
                                        <button className="btn btn-info btn-sm me-1" onClick={() => handleContacts(cargo)}>
                                            Contactos
                                        </button>
                                        <button className="btn btn-info btn-sm" onClick={() => handleVideos(cargo)}>
                                            Videos
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
                        <div className="modal-dialog modal-lg" style={{ maxWidth: '900px' }}>
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
                                    <table className="table table-striped table-bordered">
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
    
            {contactCargo && (
                <>
                    <div className="modal-overlay show"></div>
                    <div className="modal" style={{ display: 'block' }}>
                        <div className="modal-dialog modal-lg" style={{ maxWidth: '1200px' }}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Contactos para {contactCargo.nombrE_CARGO}</h5>
                                    <button type="button" className="close" onClick={handleCloseContacts}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {contactError && (
                                        <div className="alert alert-danger" role="alert">
                                            {contactError}
                                        </div>
                                    )}
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h6>Contactos no asociados</h6>
                                            <table className="table table-striped table-bordered">
                                                <tbody>
                                                    {contacts.map(contact => (
                                                        <tr key={contact.id}>
                                                            <td className='text-break'>{contact.nombre}</td>
                                                            <td>{contact.telf}</td>
                                                            <td className='text-break'>{contact.correo}</td>
                                                            <td>{contact.cargo}</td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-primary btn-sm"
                                                                    onClick={() => handleAddContact(contact.id)}
                                                                >
                                                                    Añadir
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-md-6">
                                            <h6>Contactos Asociados</h6>
                                            <table className="table table-striped table-bordered">
                                                <tbody>
                                                    {associatedContacts.map(contact => (
                                                        <tr key={contact.id}>
                                                            <td className='text-break'>{contact.nombre}</td>
                                                            <td>{contact.telf}</td>
                                                            <td className='text-break'>{contact.correo}</td>
                                                            <td>{contact.cargo}</td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => handleRemoveContact(contact.id)}
                                                                    disabled={associatedContacts.length === 1}
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary mb-0" onClick={handleSaveContacts}>Guardar</button>
                                    <button type="button" className="btn btn-secondary mb-0" onClick={handleCloseContacts}>Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
    
            {videoCargo && (
                <>
                    <div className="modal-overlay show"></div>
                    <div className="modal" style={{ display: 'block' }}>
                        <div className="modal-dialog modal-lg" style={{ maxWidth: '1200px' }}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Videos para {videoCargo.nombrE_CARGO}</h5>
                                    <button type="button" className="close" onClick={handleCloseVideos}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {videoError && (
                                        <div className="alert alert-danger" role="alert">
                                            {videoError}
                                        </div>
                                    )}
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h6>Videos no asociados</h6>
                                            <table className="table table-striped table-bordered">
                                                <tbody>
                                                    {videos.map(video => (
                                                        <tr key={video.id}>
                                                            <td className='text-break'>{video.titulo}</td>
                                                            <td className='d-none'>{video.descripcion}</td>
                                                            <td  className='text-break'>
                                                                <a href={video.link} target="_blank" rel="noopener noreferrer">
                                                                    {video.link}
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-primary btn-sm"
                                                                    onClick={() => handleAddVideo(video.id)}
                                                                >
                                                                    Añadir
                                                                </button>
                                                                <button
                                                                    className="btn btn-secondary btn-sm ms-1"
                                                                    onClick={() => window.open(video.link, '_blank')}
                                                                >
                                                                    Ver
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-md-6 " >
                                            <h6>Videos Asociados</h6>
                                            <table className="table table-striped table-bordered">
                                                <tbody>
                                                    {associatedVideos.map(video => (
                                                        <tr  key={video.id}>
                                                            <td className='text-break'>{video.titulo}</td>
                                                            <td className='d-none'>{video.descripcion}</td>
                                                            <td className='text-break'>
                                                                <a href={video.link} target="_blank" rel="noopener noreferrer">
                                                                    {video.link}
                                                                </a>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => handleRemoveVideo(video.id)}
                                                                    disabled={associatedVideos.length === 1}
                                                                >
                                                                    Eliminar
                                                                </button>
                                                                <button
                                                                    className="btn btn-secondary btn-sm ms-1"
                                                                    onClick={() => window.open(video.link, '_blank')}
                                                                >
                                                                    Ver
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary mb-0" onClick={handleSaveVideos}>Guardar</button>
                                    <button type="button" className="btn btn-secondary mb-0" onClick={handleCloseVideos}>Cerrar</button>
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
    