import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import config from '../../config';
import '../../css/Index.css';
import CryptoJS from 'crypto-js';

function UserTable({ setView }) {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [viewingUser, setViewingUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);
    const [editedUser, setEditedUser] = useState({
        USER_ID: '',
        NOMBRE: '',
        APELLIDO: '',
        EMAIL: '',
        ID_CARGO: '',
        ESTADO: '',
        PASSWORD: '',
        ORIGINAL_PASSWORD: '', // Para mantener la contraseña original
        REG_DATE: '', // Añadir REG_DATE al estado del usuario editado
        UP_DATE: ''
    });

    const fetchUsers = () => {
        axios.get(`${config.API_URL}/usuarios`)
            .then(response => {
                const usuarios = response.data.map(user => {
                    let cargo;
                    switch (user.iD_CARGO) {
                        case 1:
                            cargo = 'Analista';
                            break;
                        case 2:
                            cargo = 'Gerente';
                            break;
                        case 3:
                            cargo = 'Jefe';
                            break;
                        case 4:
                            cargo = 'Practicante';
                            break;
                        default:
                            cargo = 'Desconocido';
                    }

                    return {
                        cargo: user.iD_CARGO,
                        id: user.useR_ID,
                        nombre: user.nombre,
                        apellido: user.apellido,
                        email: user.email,
                        cargoname: cargo,
                        estado: user.estado,
                        password: user.password,
                        log: user.llog,
                        reg_date: user.reG_DATE,
                        up_date: user.uP_DATE, // Incluir UP_DATE en los datos del usuario
                        progress: 75
                    };
                });
                setUsers(usuarios);
            })
            .catch(error => {
                console.error('Error al obtener los usuarios:', error);
            });
    };

    const handleEdit = (user) => {
        setEditingUser(user.id);
        setEditedUser({
            USER_ID: user.id,
            NOMBRE: user.nombre,
            APELLIDO: user.apellido,
            EMAIL: user.email,
            ID_CARGO: user.cargo,
            ESTADO: user.estado,
            PASSWORD: '', // Vaciar la contraseña para detectar si se actualiza
            ORIGINAL_PASSWORD: user.password, // Mantener la contraseña original
            REG_DATE: user.reg_date, // Mantener REG_DATE sin cambios
            UP_DATE: user.up_date // Mantener UP_DATE sin cambios
        });
    };

    const handleView = (user) => {
        setViewingUser(user);
    };

    const handleDeleteClick = (user) => {
        setDeleteUser(user);
    };

    const handleDeleteConfirm = () => {
        axios.delete(`${config.API_URL}/usuarios/${deleteUser.id}`)
            .then(response => {
                setUsers(users.filter(user => user.id !== deleteUser.id));
                setDeleteUser(null);
            })
            .catch(error => {
                console.error('Error al eliminar el usuario:', error);
            });
    };

    const handleDeleteCancel = () => {
        setDeleteUser(null);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSaveEdit = () => {
        let updatedUser = {
            ...editedUser,
            ID_CARGO: parseInt(editedUser.ID_CARGO),
            UP_DATE: new Date().toISOString(), // Agregar la fecha de actualización
            PASSWORD: editedUser.PASSWORD ? CryptoJS.MD5(editedUser.PASSWORD).toString() : editedUser.ORIGINAL_PASSWORD,
            LLOG: users.find(user => user.id === editingUser).log, // Mantener el valor de LLOG
            REG_DATE: editedUser.REG_DATE // Mantener el valor de REG_DATE sin cambios
        };

        axios.put(`${config.API_URL}/usuarios/${editingUser}`, updatedUser)
            .then(response => {
                fetchUsers();
                setEditingUser(null);
                setEditedUser({ USER_ID: '', NOMBRE: '', APELLIDO: '', EMAIL: '', ID_CARGO: '', ESTADO: '', PASSWORD: '', ORIGINAL_PASSWORD: '', REG_DATE: '', UP_DATE: '' });
            })
            .catch(error => {
                console.error('Error al actualizar el usuario:', error);
            });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditedUser({
            ...editedUser,
            [name.toUpperCase()]: type === 'checkbox' ? (checked ? 'true' : 'false') : value
        });
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-primary" onClick={() => setView('createUser')}>
                    <i className="fas fa-plus"></i> Crear Usuario
                </button>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Cargo</th>
                        <th>Estado</th>
                        <th>Último Log</th>
                        <th>Documentos</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.nombre}</td>
                            <td>{user.apellido}</td>
                            <td>{user.email}</td>
                            <td>{user.cargoname}</td>
                            <td>{user.estado === 'true' ? 'Activo' : 'Inactivo'}</td>
                            <td>{user.log}</td>
                            <td>
                                <div className="progress">
                                    <div className="progress-bar" role="progressbar" style={{ width: `${user.progress}%` }} aria-valuenow={user.progress} aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </td>
                            <td>
                                <button className="btn btn-info btn-sm me-1" onClick={() => handleView(user)}>
                                    <i className="fas fa-eye"></i>
                                </button>
                                <button className="btn btn-warning btn-sm me-1" onClick={() => handleEdit(user)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(user)}>
                                    <i className="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {viewingUser && (
                <>
                    <div className="modal-overlay show"></div>
                    <div className="modal" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Visualizar Usuario</h5>
                                    <button type="button" className="close" onClick={() => setViewingUser(null)}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Nombre:</strong> {viewingUser.nombre}</p>
                                    <p><strong>Apellido:</strong> {viewingUser.apellido}</p>
                                    <p><strong>Email:</strong> {viewingUser.email}</p>
                                    <p><strong>Cargo:</strong> {viewingUser.cargoname}</p>
                                    <p><strong>Estado:</strong> {viewingUser.estado === 'true' ? 'Activo' : 'Inactivo'}</p>
                                    <p><strong>Último Log:</strong> {viewingUser.log}</p>
                                    <p><strong>Fecha de Registro:</strong> {viewingUser.reg_date}</p> {/* Mostrar REG_DATE */}
                                    <p><strong>Última Actualización:</strong> {viewingUser.up_date}</p> {/* Mostrar UP_DATE */}
                                    <p><strong>Documentos:</strong> {/* Aquí puedes agregar la lógica para mostrar los documentos */}</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setViewingUser(null)}>Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {editingUser && (
                <>
                    <div className="modal-overlay show"></div>
                    <div className="modal" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Editar Usuario</h5>
                                    <button type="button" className="close" onClick={() => setEditingUser(null)}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="form-group">
                                            <label>Nombre:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="NOMBRE"
                                                value={editedUser.NOMBRE}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Apellido:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="APELLIDO"
                                                value={editedUser.APELLIDO}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Email:</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="EMAIL"
                                                value={editedUser.EMAIL}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Cargo:</label>
                                            <select
                                                className="form-control"
                                                name="ID_CARGO"
                                                value={editedUser.ID_CARGO}
                                                onChange={handleInputChange}
                                            >
                                                <option value="1">Analista</option>
                                                <option value="2">Gerente</option>
                                                <option value="3">Jefe</option>
                                                <option value="4">Practicante</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Estado:</label>
                                            <select
                                                className="form-control"
                                                name="ESTADO"
                                                value={editedUser.ESTADO}
                                                onChange={handleInputChange}
                                            >
                                                <option value="true">Activo</option>
                                                <option value="false">Inactivo</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Contraseña:</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                name="PASSWORD"
                                                value={editedUser.PASSWORD}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setEditingUser(null)}>Cancelar</button>
                                    <button type="button" className="btn btn-primary" onClick={handleSaveEdit}>Guardar cambios</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {deleteUser && (
                <>
                    <div className="modal-overlay show"></div>
                    <div className="modal" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirmar Eliminación</h5>
                                    <button type="button" className="close" onClick={() => handleDeleteCancel()}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p>¿Estás seguro de que deseas eliminar a {deleteUser.nombre} {deleteUser.apellido}?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleDeleteCancel}>Cancelar</button>
                                    <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default UserTable;
