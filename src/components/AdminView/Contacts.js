import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import config from '../../config';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [editingContact, setEditingContact] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [newContact, setNewContact] = useState({ nombre: '', telf: '', correo: '', cargo: '', desc: '' });
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deleteContactId, setDeleteContactId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteMultipleModal, setShowDeleteMultipleModal] = useState(false);
    const [cargos, setCargos] = useState([]);

    useEffect(() => {
        fetchContacts();
        fetchCargos();
    }, []);

    useEffect(() => {
        setFilteredContacts(contacts.filter(contact =>
            (contact.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (contact.telf || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (contact.correo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (contact.cargo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (contact.desc || '').toLowerCase().includes(searchTerm.toLowerCase())
        ));
    }, [searchTerm, contacts]);

    const fetchContacts = () => {
        axios.get(`${config.API_URL}/contactos`)
            .then(response => {
                setContacts(response.data);
            })
            .catch(error => {
                console.error('Error fetching contacts:', error);
            });
    };

    const fetchCargos = () => {
        axios.get(`${config.API_URL}/cargos`)
            .then(response => {
                setCargos(response.data);
            })
            .catch(error => {
                console.error('Error fetching cargos:', error);
            });
    };

    const handleCreate = () => {
        if (!newContact.nombre || !newContact.telf || !newContact.correo || !newContact.cargo || !newContact.desc) {
            alert('Todos los campos son requeridos');
            return;
        }

        const newContactData = {
            NOMBRE: newContact.nombre,
            TELF: newContact.telf,
            CORREO: newContact.correo,
            CARGO: newContact.cargo,
            DESC: newContact.desc
        };

        axios.post(`${config.API_URL}/contactos`, newContactData)
            .then(response => {
                fetchContacts();
                setNewContact({ nombre: '', telf: '', correo: '', cargo: '', desc: '' });
                setShowModal(false);
            })
            .catch(error => {
                console.error('Error creating contact:', error);
            });
    };

    const handleEdit = (contact) => {
        setEditingContact(contact);
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        if (!editingContact.nombre || !editingContact.telf || !editingContact.correo || !editingContact.cargo || !editingContact.desc) {
            alert('Todos los campos son requeridos');
            return;
        }

        const updatedContactData = {
            ID: editingContact.id,
            NOMBRE: editingContact.nombre,
            TELF: editingContact.telf,
            CORREO: editingContact.correo,
            CARGO: editingContact.cargo,
            DESC: editingContact.desc
        };

        axios.put(`${config.API_URL}/contactos/${editingContact.id}`, updatedContactData)
            .then(response => {
                fetchContacts();
                setEditingContact(null);
                setShowEditModal(false);
            })
            .catch(error => {
                console.error('Error updating contact:', error);
                alert('Error updating contact');
            });
    };

    const handleDelete = (contactId) => {
        setDeleteContactId(contactId);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        axios.delete(`${config.API_URL}/contactos/${deleteContactId}`)
            .then(response => {
                fetchContacts();
                setShowDeleteModal(false);
            })
            .catch(error => {
                console.error('Error deleting contact:', error);
            });
    };

    const handleDeleteSelected = () => {
        setShowDeleteMultipleModal(true);
    };

    const confirmDeleteMultiple = () => {
        const deletePromises = selectedRows.map(id =>
            axios.delete(`${config.API_URL}/contactos/${id}`)
        );

        Promise.all(deletePromises)
            .then(() => {
                fetchContacts();
                setSelectedRows([]);
                setShowDeleteMultipleModal(false);
            })
            .catch(error => {
                console.error('Error deleting contacts:', error);
            });
    };

    const handleRowSelect = (contactId) => {
        setSelectedRows(prevSelectedRows =>
            prevSelectedRows.includes(contactId)
                ? prevSelectedRows.filter(id => id !== contactId)
                : [...prevSelectedRows, contactId]
        );
    };

    const handleExportCSV = () => {
        const data = (selectedRows.length > 0 ? selectedRows : contacts.map(contact => contact.id)).map(id => {
            const contact = contacts.find(contact => contact.id === id);
            return {
                ID: contact.id,
                Nombre: contact.nombre,
                Telf: contact.telf,
                Correo: contact.correo,
                Cargo: contact.cargo,
                Desc: contact.desc
            };
        });
        return data;
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        const data = (selectedRows.length > 0 ? selectedRows : contacts.map(contact => contact.id)).map(id => {
            const contact = contacts.find(contact => contact.id === id);
            return [
                contact.id,
                contact.nombre,
                contact.telf,
                contact.correo,
                contact.cargo,
                contact.desc
            ];
        });

        autoTable(doc, {
            head: [['ID', 'Nombre', 'Telf', 'Correo', 'Cargo', 'Desc']],
            body: data
        });

        doc.save('contacts.pdf');
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const paginatedContacts = filteredContacts.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const totalPages = Math.ceil(filteredContacts.length / rowsPerPage);

    return (
        <div className="container">
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <i className="fas fa-plus"></i> Crear Contacto
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
                        onClick={handleDeleteSelected}
                        disabled={selectedRows.length === 0}
                    >
                        <i className="fas fa-trash"></i>
                    </button>
                    <CSVLink
                        data={handleExportCSV()}
                        className="btn btn-success me-2"
                        filename="contacts.csv"
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
                                        setSelectedRows(filteredContacts.map(contact => contact.id));
                                    } else {
                                        setSelectedRows([]);
                                    }
                                }}
                                checked={selectedRows.length === filteredContacts.length}
                            />
                        </th>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Telf</th>
                        <th>Correo</th>
                        <th>Cargo</th>
                        <th  className='d-none'>Desc</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedContacts.map(contact => (
                        <tr key={contact.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedRows.includes(contact.id)}
                                    onChange={() => handleRowSelect(contact.id)}
                                />
                            </td>
                            <td>{contact.id}</td>
                            <td>{contact.nombre}</td>
                            <td>{contact.telf}</td>
                            <td>{contact.correo}</td>
                            <td>{contact.cargo}</td>
                            <td className='d-none'>{contact.desc}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-1" onClick={() => handleEdit(contact)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                    className="btn btn-danger btn-sm" 
                                    onClick={() => handleDelete(contact.id)}
                                    disabled={selectedRows.includes(contact.id)}
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

            {/* Modal for Creating a Contact */}
            {showModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Crear Contacto</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3">
                                            <label className="form-label">Nombre</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newContact.nombre}
                                                onChange={(e) => setNewContact({ ...newContact, nombre: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Teléfono</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newContact.telf}
                                                onChange={(e) => setNewContact({ ...newContact, telf: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Correo</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={newContact.correo}
                                                onChange={(e) => setNewContact({ ...newContact, correo: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Cargo</label>
                                            <select
                                                className="form-select"
                                                value={newContact.cargo}
                                                onChange={(e) => setNewContact({ ...newContact, cargo: e.target.value })}
                                                required
                                            >
                                                <option value="">Seleccione un cargo</option>
                                                {cargos.map(cargo => (
                                                    <option key={cargo.iD_CARGO} value={cargo.nombrE_CARGO}>
                                                        {cargo.nombrE_CARGO}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Descripción</label>
                                            <textarea
                                                className="form-control"
                                                value={newContact.desc}
                                                onChange={(e) => setNewContact({ ...newContact, desc: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
                                    <button type="button" className="btn btn-primary" onClick={handleCreate}>Crear</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Modal for Editing a Contact */}
            {showEditModal && editingContact && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Editar Contacto</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3">
                                            <label className="form-label">Nombre</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editingContact.nombre}
                                                onChange={(e) => setEditingContact({ ...editingContact, nombre: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Teléfono</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editingContact.telf}
                                                onChange={(e) => setEditingContact({ ...editingContact, telf: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Correo</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={editingContact.correo}
                                                onChange={(e) => setEditingContact({ ...editingContact, correo: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Cargo</label>
                                            <select
                                                className="form-select"
                                                value={editingContact.cargo}
                                                onChange={(e) => setEditingContact({ ...editingContact, cargo: e.target.value })}
                                                required
                                            >
                                                <option value="">Seleccione un cargo</option>
                                                {cargos.map(cargo => (
                                                    <option key={cargo.iD_CARGO} value={cargo.nombrE_CARGO}>
                                                        {cargo.nombrE_CARGO}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Descripción</label>
                                            <textarea
                                                className="form-control"
                                                value={editingContact.desc}
                                                onChange={(e) => setEditingContact({ ...editingContact, desc: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cerrar</button>
                                    <button type="button" className="btn btn-primary" onClick={handleSaveEdit}>Guardar cambios</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Modal for Confirming Delete */}
            {showDeleteModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirmar Eliminación</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p>¿Estás seguro de que deseas eliminar este contacto?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                                    <button type="button" className="btn btn-danger" onClick={confirmDelete}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Modal for Confirming Multiple Delete */}
            {showDeleteMultipleModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirmar Eliminación</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowDeleteMultipleModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p>¿Estás seguro de que deseas eliminar los contactos seleccionados?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteMultipleModal(false)}>Cancelar</button>
                                    <button type="button" className="btn btn-danger" onClick={confirmDeleteMultiple}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Contacts;
