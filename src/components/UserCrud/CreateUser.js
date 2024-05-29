import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import 'bootstrap/dist/css/bootstrap.min.css';
import config from '../../config';
import '../../css/Index.css';

function CreateUser({ setView }) {
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        email: '',
        fechaiContrato: '',
        estado: 'Activo', // Default value
        password: '',
        idCargo: 1
    });

    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = e => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.nombre) newErrors.nombre = 'El nombre es requerido';
        if (!form.apellido) newErrors.apellido = 'El apellido es requerido';
        if (!form.email) newErrors.email = 'El email es requerido';
        if (!form.fechaiContrato) newErrors.fechaiContrato = 'La fecha de inicio de contrato es requerida';
        if (!form.estado) newErrors.estado = 'El estado es requerido';
        if (!form.password) newErrors.password = 'La contraseña es requerida';
        if (!form.idCargo) newErrors.idCargo = 'El cargo es requerido';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleShowModal = () => {
        if (validateForm()) {
            setShowModal(true);
        }
    };

    const handleCloseModal = () => setShowModal(false);

    const handleConfirmSubmit = async () => {
        handleCloseModal();
        const usuario = {
            NOMBRE: form.nombre,
            APELLIDO: form.apellido,
            EMAIL: form.email,
            FECHAICONTRATO: form.fechaiContrato,
            ESTADO: form.estado === 'Activo' ? 'true' : 'false', // Conversión del estado
            PASSWORD: CryptoJS.MD5(form.password).toString(), // Codificación en MD5
            ID_CARGO: form.idCargo,
            REG_DATE: new Date().toISOString(),
            UP_DATE: null,
            LLOG: null
        };

        try {
            const response = await fetch(`${config.API_URL}/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });
            if (response.ok) {
                console.log('Usuario creado con éxito');
                setView('user');
            } else {
                console.error('Error al crear el usuario');
            }
        } catch (error) {
            console.error('Error de conexión', error);
        }
    };

    const handleSubmit = e => {
        e.preventDefault();
        handleShowModal();
    };

    return (
        <div className="container">
            <h2>Crear Usuario</h2><br/>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        type="text"
                        className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                        id="nombre"
                        name="nombre"
                        placeholder="Ingresar nombre"
                        value={form.nombre}
                        onChange={handleChange}
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>
                <br/>
                <div className="form-group">
                    <label htmlFor="apellido">Apellido</label>
                    <input
                        type="text"
                        className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
                        id="apellido"
                        name="apellido"
                        placeholder="Ingresar apellido"
                        value={form.apellido}
                        onChange={handleChange}
                    />
                    {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
                </div><br/>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        placeholder="Ingresar email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div><br/>
                <div className="form-group">
                    <label htmlFor="fechaiContrato">Fecha de Inicio de Contrato</label>
                    <input
                        type="date"
                        className={`form-control ${errors.fechaiContrato ? 'is-invalid' : ''}`}
                        id="fechaiContrato"
                        name="fechaiContrato"
                        value={form.fechaiContrato}
                        onChange={handleChange}
                    />
                    {errors.fechaiContrato && <div className="invalid-feedback">{errors.fechaiContrato}</div>}
                </div><br/>
                <div className="form-group">
                    <label htmlFor="estado">Estado</label>
                    <select
                        className={`form-control ${errors.estado ? 'is-invalid' : ''}`}
                        id="estado"
                        name="estado"
                        value={form.estado}
                        onChange={handleChange}
                    >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                    {errors.estado && <div className="invalid-feedback">{errors.estado}</div>}
                </div><br/>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        placeholder="Ingresar contraseña"
                        value={form.password}
                        onChange={handleChange}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div><br/>
                <div className="form-group">
                    <label htmlFor="idCargo">Cargo</label>
                    <select
                        className={`form-control ${errors.idCargo ? 'is-invalid' : ''}`}
                        id="idCargo"
                        name="idCargo"
                        value={form.idCargo}
                        onChange={handleChange}
                    >
                        <option value={1}>Analista</option>
                        <option value={2}>Gerente</option>
                        <option value={3}>Jefe</option>
                        <option value={4}>Practicante</option>
                    </select>
                    {errors.idCargo && <div className="invalid-feedback">{errors.idCargo}</div>}
                </div>
                <div className="d-flex justify-content-between mt-3">
                    <button type="button" className="btn btn-secondary" onClick={() => setView('user')}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Crear Usuario</button>
                </div>
            </form>

            {/* Mostrar la superposición cuando el modal esté visible */}
            {showModal && <div className="modal-overlay show"></div>}

            {/* Modal */}
            {showModal && (
                <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmar Creación</h5>
                                <button type="button" className="close" onClick={handleCloseModal} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>¿Está seguro de que desea crear este usuario?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                                <button type="button" className="btn btn-primary" onClick={handleConfirmSubmit}>Confirmar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateUser;
