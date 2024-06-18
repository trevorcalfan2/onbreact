import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import config from '../../config';
import '../../css/Index.css';
import CryptoJS from 'crypto-js';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function UserTable({ setView }) {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [viewingUser, setViewingUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);
    const [userDocuments, setUserDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documentToDelete, setDocumentToDelete] = useState(null); // Estado para el documento a eliminar
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const [editedUser, setEditedUser] = useState({
        USER_ID: '',
        NOMBRE: '',
        APELLIDO: '',
        EMAIL: '',
        ID_CARGO: '',
        ESTADO: '',
        ONB_ESTADO: '', // Añadir ONB_ESTADO al estado del usuario editado
        PASSWORD: '',
        ORIGINAL_PASSWORD: '',
        REG_DATE: '',
        UP_DATE: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        setFilteredUsers(users.filter(user =>
            user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    }, [searchTerm, users]);

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
                        onb_estado: user.onB_ESTADO, // Añadir ONB_ESTADO al usuario
                        fechaicontrato: user.fechaicontrato,
                        password: user.password,
                        log: user.llog,
                        reg_date: user.reG_DATE,
                        up_date: user.uP_DATE,
                        progress: 75
                    };
                });
                setUsers(usuarios);
            })
            .catch(error => {
                console.error('Error al obtener los usuarios:', error);
            });
    };

    const fetchUserDocuments = (userId) => {
        axios.get(`${config.API_URL}/FileManagement/documents/${userId}`)
            .then(response => {
                setUserDocuments(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los documentos del usuario:', error);
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
            ONB_ESTADO: user.onb_estado, // Nuevo campo
            PASSWORD: '',
            ORIGINAL_PASSWORD: user.password,
            REG_DATE: user.reg_date,
            UP_DATE: user.up_date
        });
    };

    const handleView = (user) => {
        setViewingUser(user);
        fetchUserDocuments(user.id);
    };

    const handleDeleteClick = (user) => {
        setDeleteUser(user);
    };

    const handleDeleteConfirm = () => {
        if (Array.isArray(deleteUser)) {
            // Eliminar múltiples usuarios
            const deletePromises = deleteUser.map(id =>
                axios.delete(`${config.API_URL}/usuarios/${id}`)
            );

            Promise.all(deletePromises)
                .then(() => {
                    setUsers(users.filter(user => !deleteUser.includes(user.id)));
                    setDeleteUser(null);
                    setSelectedRows([]);
                })
                .catch(error => {
                    console.error('Error al eliminar los usuarios:', error);
                });
        } else {
            // Eliminar un solo usuario
            axios.delete(`${config.API_URL}/usuarios/${deleteUser.id}`)
                .then(() => {
                    setUsers(users.filter(user => user.id !== deleteUser.id));
                    setDeleteUser(null);
                })
                .catch(error => {
                    console.error('Error al eliminar el usuario:', error);
                });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteUser(null);
    };

    const handleDocumentDelete = (userId, documentName) => {
        setDocumentToDelete({ userId, documentName });
    };

    const handleConfirmDocumentDelete = () => {
        axios.delete(`${config.API_URL}/FileManagement/delete/${documentToDelete.userId}/${documentToDelete.documentName}`)
            .then(response => {
                fetchUserDocuments(documentToDelete.userId);
                setDocumentToDelete(null);
            })
            .catch(error => {
                console.error('Error al eliminar el documento:', error);
            });
    };

    const handleCancelDocumentDelete = () => {
        setDocumentToDelete(null);
    };

    const handleSaveEdit = () => {
        let updatedUser = {
            ...editedUser,
            ID_CARGO: parseInt(editedUser.ID_CARGO),
            UP_DATE: new Date().toISOString(),
            PASSWORD: editedUser.PASSWORD ? CryptoJS.MD5(editedUser.PASSWORD).toString() : editedUser.ORIGINAL_PASSWORD,
            LLOG: users.find(user => user.id === editingUser).log,
            REG_DATE: editedUser.REG_DATE
        };

        axios.put(`${config.API_URL}/usuarios/${editingUser}`, updatedUser)
            .then(response => {
                fetchUsers();
                setEditingUser(null);
                setEditedUser({ USER_ID: '', NOMBRE: '', APELLIDO: '', EMAIL: '', ID_CARGO: '', ESTADO: '', ONB_ESTADO: '', PASSWORD: '', ORIGINAL_PASSWORD: '', REG_DATE: '', UP_DATE: '' });
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

    const handleDocumentView = (userId, documentName) => {
        setSelectedDocument({ userId, documentName });
    };

    const handleCloseDocumentView = () => {
        setSelectedDocument(null);
    };

    const handleRowSelect = (userId) => {
        setSelectedRows(prevSelectedRows =>
            prevSelectedRows.includes(userId)
                ? prevSelectedRows.filter(id => id !== userId)
                : [...prevSelectedRows, userId]
        );
    };

    const handleExportCSV = () => {
        const data = (selectedRows.length > 0 ? selectedRows : users.map(user => user.id)).map(id => {
            const user = users.find(user => user.id === id);
            return {
                ID: user.id,
                Nombre: user.nombre,
                Apellido: user.apellido,
                Email: user.email,
                Cargo: user.cargoname,
                Estado: user.estado === 'true' ? 'Activo' : 'Inactivo',
                Onboarding: user.onb_estado === 'true' ? 'En  Proceso' : 'Completado',
                FechaRegistro: user.reg_date,
                UltimaActualizacion: user.up_date
            };
        });
        return data;
    };
    
    const handleExportPDF = () => {
        const doc = new jsPDF();
        const data = (selectedRows.length > 0 ? selectedRows : users.map(user => user.id)).map(id => {
            const user = users.find(user => user.id === id);
            return [
                user.id,
                user.nombre,
                user.apellido,
                user.email,
                user.cargoname,
                user.estado === 'true' ? 'Activo' : 'Inactivo',
                user.onb_estado === 'true' ? 'En  Proceso' : 'Completado',
                user.reg_date,
                user.up_date
            ];
        });
    
        autoTable(doc, {
            head: [['ID', 'Nombre', 'Apellido', 'Email', 'Cargo', 'Estado', 'Onboarding', 'Fecha Registro', 'Última Actualización']],
            body: data
        });
    
        doc.save('usuarios.pdf');
    };
    

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

    return (
        <div className="container">
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-primary" onClick={() => setView('createUser')}>
                    <i className="fas fa-plus"></i> Crear Usuario
                </button>
                <div className="d-flex align-items-center">
                    <input
                        type="text"
                        className="form-control me-2 mb-0"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select className="form-select me-2" value={rowsPerPage} onChange={handleRowsPerPageChange}>
                        <option value={10}>10 filas</option>
                        <option value={30}>30 filas</option>
                        <option value={50}>50 filas</option>
                    </select>
                    <button 
                        className="btn btn-danger me-2" 
                        onClick={() => setDeleteUser(selectedRows)}
                        disabled={selectedRows.length === 0}
                    >
                        <i className="fas fa-trash"></i>
                    </button>
                    <CSVLink
                        data={handleExportCSV()}
                        className="btn btn-success me-2"
                        filename="usuarios.csv"
                    >
                        <i className="fas fa-file-csv"></i>
                    </CSVLink>
                    <button className="btn btn-warning" onClick={handleExportPDF}>
                        <i className="fas fa-file-pdf"></i>
                    </button>
                </div>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedRows(filteredUsers.map(user => user.id));
                                    } else {
                                        setSelectedRows([]);
                                    }
                                }}
                                checked={selectedRows.length === filteredUsers.length}
                            />
                        </th>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Cargo</th>
                        <th>Estado</th>
                        <th>Onboarding</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.map(user => (
                        <tr key={user.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedRows.includes(user.id)}
                                    onChange={() => handleRowSelect(user.id)}
                                />
                            </td>
                            <td>{user.id}</td>
                            <td>{user.nombre}</td>
                            <td>{user.apellido}</td>
                            <td>{user.email}</td>
                            <td>{user.cargoname}</td>
                            <td>{user.estado === 'true' ? 'Activo' : 'Inactivo'}</td>
                            <td>{user.onb_estado === 'true' ? 'En  Proceso' : 'Completado'}</td> {/* Mostrar estado de ONB_ESTADO */}
                            <td>
                                <button className="btn btn-info btn-sm me-1" onClick={() => handleView(user)}>
                                    <i className="fas fa-eye"></i>
                                </button>
                                <button className="btn btn-warning btn-sm me-1" onClick={() => handleEdit(user)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                    className="btn btn-danger btn-sm" 
                                    onClick={() => handleDeleteClick(user)}
                                    disabled={selectedRows.includes(user.id)}
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-flex justify-content-between">
                <button
                    className="btn btn-secondary"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button
                    className="btn btn-secondary"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Siguiente
                </button>
            </div>

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
                                    <p><strong>Fecha Inicio de Contrato:</strong> {viewingUser.fechaicontrato}</p>
                                    <p><strong>Estado:</strong> {viewingUser.estado === 'true' ? 'Activo' : 'Inactivo'}</p>
                                    <p><strong>Onboarding:</strong> {viewingUser.onb_estado === 'true' ? 'En  Proceso' : 'Completado'}</p> {/* Mostrar estado de ONB_ESTADO */}
                                    <p><strong>Último Log:</strong> {viewingUser.log}</p>
                                    <p><strong>Fecha de Registro:</strong> {viewingUser.reg_date}</p>
                                    <p><strong>Última Actualización:</strong> {viewingUser.up_date}</p>
                                    <p><strong>Documentos:</strong></p>
                                    <ul>
                                        {userDocuments.map((doc, index) => (
                                            <li key={index}>
                                                {doc}
                                                <button className="btn btn-link" onClick={() => handleDocumentView(viewingUser.id, doc)}>Ver</button>
                                                <button className="btn btn-link text-danger" onClick={() => handleDocumentDelete(viewingUser.id, doc)}>Eliminar</button>
                                            </li>
                                        ))}
                                    </ul>
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
                                            <label>Estado Onboarding:</label>
                                            <select
                                                className="form-control"
                                                name="ONB_ESTADO"
                                                value={editedUser.ONB_ESTADO}
                                                onChange={handleInputChange}
                                            >
                                                <option value="true">En  Proceso</option>
                                                <option value="false">Completado</option>
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

            {documentToDelete && (
                <>
                    <div className="modal-overlay show"></div>
                    <div className="modal" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirmar Eliminación de Documento</h5>
                                    <button type="button" className="close" onClick={handleCancelDocumentDelete}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p>¿Estás seguro de que deseas eliminar el documento {documentToDelete.documentName}?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCancelDocumentDelete}>Cancelar</button>
                                    <button type="button" className="btn btn-danger" onClick={handleConfirmDocumentDelete}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {selectedDocument && (
                <>
                    <div className="modal-overlay show"></div>
                    <div className="modal" style={{ display: 'block' }}>
                        <div className="modal-dialog modal-xl">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Vista previa del documento</h5>
                                    <button type="button" className="close" onClick={handleCloseDocumentView}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js`}>
                                        <Viewer
                                            fileUrl={`${config.API_URL}/FileManagement/download/${selectedDocument.userId}/${selectedDocument.documentName}`}
                                            plugins={[defaultLayoutPluginInstance]}
                                        />
                                    </Worker>
                                </div>
                                <div className="modal-footer">
                                    <a
                                        href={`${config.API_URL}/FileManagement/download/${selectedDocument.userId}/${selectedDocument.documentName}`}
                                        download
                                        className="btn btn-primary"
                                    >
                                        Descargar
                                    </a>
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseDocumentView}>Cerrar</button>
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
