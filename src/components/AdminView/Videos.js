import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import config from '../../config';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function Videos() {
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [editingVideo, setEditingVideo] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [newVideo, setNewVideo] = useState({ titulo: '', descripcion: '', link: '' });
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deleteVideoId, setDeleteVideoId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteMultipleModal, setShowDeleteMultipleModal] = useState(false);

    useEffect(() => {
        fetchVideos();
    }, []);

    useEffect(() => {
        setFilteredVideos(videos.filter(video =>
            (video.titulo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (video.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (video.link || '').toLowerCase().includes(searchTerm.toLowerCase())
        ));
    }, [searchTerm, videos]);

    const fetchVideos = () => {
        axios.get(`${config.API_URL}/videos`)
            .then(response => {
                setVideos(response.data);
            })
            .catch(error => {
                console.error('Error fetching videos:', error);
            });
    };

    const handleCreate = () => {
        if (!newVideo.titulo || !newVideo.descripcion || !newVideo.link) {
            alert('Todos los campos son requeridos');
            return;
        }

        axios.post(`${config.API_URL}/videos`, newVideo)
            .then(response => {
                fetchVideos();
                setNewVideo({ titulo: '', descripcion: '', link: '' });
                setShowModal(false);
            })
            .catch(error => {
                console.error('Error creating video:', error);
            });
    };

    const handleEdit = (video) => {
        setEditingVideo(video);
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        if (!editingVideo.titulo || !editingVideo.descripcion || !editingVideo.link) {
            alert('Todos los campos son requeridos');
            return;
        }

        axios.put(`${config.API_URL}/videos/${editingVideo.id}`, editingVideo)
            .then(response => {
                fetchVideos();
                setEditingVideo(null);
                setShowEditModal(false);
            })
            .catch(error => {
                console.error('Error updating video:', error);
            });
    };

    const handleDelete = (videoId) => {
        setDeleteVideoId(videoId);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        axios.delete(`${config.API_URL}/videos/${deleteVideoId}`)
            .then(response => {
                fetchVideos();
                setShowDeleteModal(false);
            })
            .catch(error => {
                console.error('Error deleting video:', error);
            });
    };

    const handleDeleteSelected = () => {
        setShowDeleteMultipleModal(true);
    };

    const confirmDeleteMultiple = () => {
        const deletePromises = selectedRows.map(id =>
            axios.delete(`${config.API_URL}/videos/${id}`)
        );

        Promise.all(deletePromises)
            .then(() => {
                fetchVideos();
                setSelectedRows([]);
                setShowDeleteMultipleModal(false);
            })
            .catch(error => {
                console.error('Error deleting videos:', error);
            });
    };

    const handleRowSelect = (videoId) => {
        setSelectedRows(prevSelectedRows =>
            prevSelectedRows.includes(videoId)
                ? prevSelectedRows.filter(id => id !== videoId)
                : [...prevSelectedRows, videoId]
        );
    };

    const handleExportCSV = () => {
        const data = selectedRows.map(id => {
            const video = videos.find(video => video.id === id);
            return {
                ID: video.id,
                Titulo: video.titulo,
                Descripcion: video.descripcion,
                Link: video.link
            };
        });

        return data.length > 0 ? data : videos.map(video => ({
            ID: video.id,
            Titulo: video.titulo,
            Descripcion: video.descripcion,
            Link: video.link
        }));
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        const data = selectedRows.map(id => {
            const video = videos.find(video => video.id === id);
            return [video.id, video.titulo, video.descripcion, video.link];
        });

        const allData = data.length > 0 ? data : videos.map(video => [video.id, video.titulo, video.descripcion, video.link]);

        autoTable(doc, {
            head: [['ID', 'Titulo', 'Descripcion', 'Link']],
            body: allData
        });

        doc.save('videos.pdf');
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const paginatedVideos = filteredVideos.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const totalPages = Math.ceil(filteredVideos.length / rowsPerPage);

    return (
        <div className="container">
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <i className="fas fa-plus"></i> Añadir Video
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
                        filename="videos.csv"
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
                                        setSelectedRows(filteredVideos.map(video => video.id));
                                    } else {
                                        setSelectedRows([]);
                                    }
                                }}
                                checked={selectedRows.length === filteredVideos.length}
                            />
                        </th>
                        <th>ID</th>
                        <th>Titulo</th>
                        <th  className='d-none'>Descripcion</th>
                        <th>Link</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedVideos.map(video => (
                        <tr key={video.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedRows.includes(video.id)}
                                    onChange={() => handleRowSelect(video.id)}
                                />
                            </td>
                            <td>{video.id}</td>
                            <td>{video.titulo}</td>
                            <td  className='d-none'>{video.descripcion}</td>
                            <td>{video.link}</td>
                            <td>
                                <button 
                                    className="btn btn-warning btn-sm me-1" 
                                    onClick={() => handleEdit(video)}
                                    disabled={selectedRows.includes(video.id)}
                                >
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                    className="btn btn-danger btn-sm me-1" 
                                    onClick={() => handleDelete(video.id)}
                                    disabled={selectedRows.includes(video.id)}
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                                <button 
                                    className="btn btn-info btn-sm"
                                    onClick={() => window.open(video.link, '_blank')}
                                >
                                    <i className="fas fa-external-link-alt"></i>
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

            {/* Modal for Creating a Video */}
            {showModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Añadir Video</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3">
                                            <label className="form-label">Titulo</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newVideo.titulo}
                                                onChange={(e) => setNewVideo({ ...newVideo, titulo: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Descripcion</label>
                                            <textarea
                                                className="form-control"
                                                value={newVideo.descripcion}
                                                onChange={(e) => setNewVideo({ ...newVideo, descripcion: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Link</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newVideo.link}
                                                onChange={(e) => setNewVideo({ ...newVideo, link: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
                                    <button type="button" className="btn btn-primary" onClick={handleCreate}>Añadir</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Modal for Editing a Video */}
            {showEditModal && editingVideo && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Editar Video</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3">
                                            <label className="form-label">Titulo</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editingVideo.titulo}
                                                onChange={(e) => setEditingVideo({ ...editingVideo, titulo: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Descripcion</label>
                                            <textarea
                                                className="form-control"
                                                value={editingVideo.descripcion}
                                                onChange={(e) => setEditingVideo({ ...editingVideo, descripcion: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Link</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editingVideo.link}
                                                onChange={(e) => setEditingVideo({ ...editingVideo, link: e.target.value })}
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
                                    <p>¿Estás seguro de que deseas eliminar este video?</p>
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
                                    <p>¿Estás seguro de que deseas eliminar los videos seleccionados?</p>
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

export default Videos;
