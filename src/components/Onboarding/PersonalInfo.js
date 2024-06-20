import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Index.css';
import '../../css/PersonalInfo.css';

function PersonalInfo({ formData, setFormData }) {
  const [dateTime, setDateTime] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
      const day = ('0' + (currentDate.getDate())).slice(-2);
      const formattedDate = `${year}-${month}-${day}`;
      const formattedTime = currentDate.toLocaleTimeString("en", { hour12: false });
      const formattedDateTime = `${formattedDate} ${formattedTime}`;
      setDateTime(formattedDateTime);
      setFormData(prevFormData => ({ ...prevFormData, fecha: formattedDateTime }));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [setFormData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevFormData => ({ ...prevFormData, fotoDni: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      alert("Solo se permiten archivos JPG o PNG");
    }
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
        setFormData(prevFormData => ({ ...prevFormData, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      alert("Solo se permiten archivos JPG o PNG");
    }
  };

  const handleDniChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
      setFormData(prevFormData => ({ ...prevFormData, dni: value }));
    }
  };

  return (
    <div className="container custom-card-bg p-4 mb-4" style={{ backgroundColor: "#00499a", borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <div className="row">
        <div className="col-md-6 text-center mb-4">
          <h2 className="mb-4 text-light">Foto de Perfil</h2>
          <input
            type="file"
            className="btn btn-primary mb-3"
            onChange={handleProfilePhotoChange}
            accept=".jpg,.jpeg,.png"
          />
          {profilePhoto && (
            <img src={profilePhoto} alt="Foto de Perfil" className="img-thumbnail mb-3" style={{ maxHeight: '200px', maxWidth: '100%' }} />
          )}
        </div>
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label htmlFor="nombre" className="text-light">Nombres</label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              placeholder="Ingresar nombres"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="apellido" className="text-light">Apellidos</label>
            <input
              type="text"
              className="form-control"
              id="apellido"
              placeholder="Ingresar apellidos"
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="dni" className="text-light">DNI</label>
            <input
              type="text"
              className="form-control"
              id="dni"
              placeholder="No. DNI"
              value={formData.dni}
              onChange={handleDniChange}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="domicilio" className="text-light">Domicilio</label>
            <input
              type="text"
              className="form-control"
              id="domicilio"
              placeholder="Direccion completa"
              value={formData.domicilio}
              onChange={(e) => setFormData({ ...formData, domicilio: e.target.value })}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="distrito" className="text-light">Distrito</label>
            <select
              id="distrito"
              className="form-control"
              value={formData.distrito}
              onChange={(e) => setFormData({ ...formData, distrito: e.target.value })}
            >
              <option>Seleccionar...</option>
              <option>Ancón</option>
              <option>Ate</option>
              <option>Barranco</option>
              <option>Breña</option>
              <option>Carabayllo</option>
              <option>Cercado de Lima</option>
              <option>Chaclacayo</option>
              <option>Chorrillos</option>
              <option>Cieneguilla</option>
              <option>Comas</option>
              <option>El Agustino</option>
              <option>Independencia</option>
              <option>Jesús María</option>
              <option>La Molina</option>
              <option>La Victoria</option>
              <option>Lince</option>
              <option>Lurigancho-Chosica</option>
              <option>Lurín</option>
              <option>Magdalena del Mar</option>
              <option>Miraflores</option>
              <option>Pachacámac</option>
              <option>Pucusana</option>
              <option>Pueblo Libre</option>
              <option>Puente Piedra</option>
              <option>Punta Hermosa</option>
              <option>Punta Negra</option>
              <option>Rímac</option>
              <option>San Bartolo</option>
              <option>San Borja</option>
              <option>San Isidro</option>
              <option>San Juan de Lurigancho</option>
              <option>San Juan de Miraflores</option>
              <option>San Luis</option>
              <option>San Martín de Porres</option>
              <option>San Miguel</option>
              <option>Santa Anita</option>
              <option>Santa María del Mar</option>
              <option>Santa Rosa</option>
              <option>Santiago de Surco</option>
              <option>Surquillo</option>
              <option>Villa El Salvador</option>
              <option>Villa María del Triunfo</option>
              <option>Los Olivos</option>
            </select>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="fecha" className="text-light">Fecha</label>
            <input
              type="text"
              className="form-control"
              id="fecha"
              value={dateTime}
              readOnly
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="fotoDni" className="text-light">Subir Foto DNI</label>
            <input
              type="file"
              className="form-control-file"
              id="fotoDni"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png"
            />
            {formData.fotoDni && (
              <img src={formData.fotoDni} alt="Foto DNI" className="img-thumbnail mt-3" style={{ maxHeight: '150px', maxWidth: '100%' }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;
