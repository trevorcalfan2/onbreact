import React, { useState, useEffect } from "react";

function PersonalInfo({ formData, setFormData }) {
  const [dateTime, setDateTime] = useState(""); // Almacenamos la fecha y la hora aquí

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
    }, 1000); // Actualiza cada segundo

    return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonta
  }, [setFormData]); // Asegúrate de incluir setFormData en las dependencias

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prevFormData => ({ ...prevFormData, fotoDni: reader.result }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleDniChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo permitir dígitos
    if (value.length <= 8) { // Limitar a 8 dígitos
      setFormData(prevFormData => ({ ...prevFormData, dni: value }));
    }
  };

  return (
    <div>
      <div className="form-row">
        <div className="form-group col-md-4">
          <label htmlFor="nombre">Nombres</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            placeholder="Ingresar nombres"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />
        </div>
        <br />
        <div className="form-group col-md-4">
          <label htmlFor="apellido">Apellidos</label>
          <input
            type="text"
            className="form-control"
            id="apellido"
            placeholder="Ingresar apellidos"
            value={formData.apellido}
            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
          />
        </div>
      </div>
      <br />
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="dni">DNI</label>
          <input
            type="text"
            className="form-control"
            id="dni"
            placeholder="No. DNI"
            value={formData.dni}
            onChange={handleDniChange}
          />
        </div>
      </div>
      <br />
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="domicilio">Domicilio</label>
          <input
            type="text"
            className="form-control"
            id="domicilio"
            placeholder="Direccion completa"
            value={formData.domicilio}
            onChange={(e) => setFormData({ ...formData, domicilio: e.target.value })}
          />
        </div>
      </div>
      <br />
      <div className="form-row">
        <div className="form-group col-md-3">
          <label htmlFor="distrito">Distrito</label>
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
      </div>
      <div className="form-row">
        <br />
        <div className="form-group col-md-2">
          <label htmlFor="fecha">Fecha</label>
          <input
            type="text"
            className="form-control"
            value={dateTime}
            readOnly
          />
        </div>
      </div>
      <br />
      <div className="form-row">
        <div className="form-group col-md-4">
          <label htmlFor="fotoDni">Subir Foto DNI</label>
          <input
            type="file"
            className="form-control-file"
            id="fotoDni"
            onChange={handleFileChange}
          />
          {formData.fotoDni && (
            <img src={formData.fotoDni} alt="Foto DNI" style={{ maxHeight: '150px', maxWidth: '350px', display: 'block', marginTop: '10px' }} />
          )}
        </div>
      </div>
      <br />
    </div>
  );
}

export default PersonalInfo;
