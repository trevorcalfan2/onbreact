import React, { forwardRef } from 'react';

const DisInfo = forwardRef(({ formData, setFormData }, ref) => {
  const getCurrentDate = () => {
    const currentDate = new Date();
    const day = ('0' + currentDate.getDate()).slice(-2);
    const year = currentDate.getFullYear();
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const month = months[currentDate.getMonth()];
    return `${day} de ${month} de ${year}`;
  };

  const currentDate = getCurrentDate();

  const textStyle = {
    fontFamily: 'Arial, sans-serif',
    textAlign: 'justify',
    marginBottom: '10px'
  };

  const containerStyle = {
    width: '228mm',
    minHeight: '297mm',
    padding: '15mm', // Reduced padding
    margin: '0 auto',
    backgroundColor: '#fff',
    boxSizing: 'border-box' // Ensures padding is included in the width/height
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #000',
    paddingBottom: '10px',
    marginBottom: '20px'
  };

  const logoStyle = {
    width: '60px',
    height: 'auto'
  };

  const handleCheckboxChange = (e) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      agreeDis: e.target.checked
    }));
  };

  return (
    <div ref={ref}>
      <br />
      <div className="scroll-container">
        <div className="form-content" style={containerStyle}>
          <div style={headerStyle}>
            <img src="logo.jpg" alt="Logo" style={logoStyle} />
            <h2 style={{ textAlign: 'center', textDecoration: 'underline', flex: 1, marginLeft: '20px' }}>PROCESO DISCIPLINARIO</h2>
            <div style={{ textAlign: 'right' }}>
              <p>AKG-RH-F-07</p>
              <p>Versión: 01</p>
            </div>
          </div>
          <p style={textStyle}>
            La Gerencia General valorará, en caso de que haya evidencias claras de que se ha procedido a vulnerar la política de seguridad de la entidad y/o las normas de seguridad aceptadas por parte del trabajador, el abrir una falta leve, grave o muy grave al mismo, en función de lo indicado en el Contrato y/o Acuerdos de Confidencialidad, al que están acogidos la totalidad de los trabajadores de la entidad.
          </p>
          <p style={textStyle}>
            La valoración de la Gerencia General contemplará los siguientes factores:
          </p>
          <ul style={{ paddingLeft: '20px', ...textStyle }}>
            <li style={textStyle}>La naturaleza de la infracción.</li>
            <li style={textStyle}>La gravedad de la misma.</li>
            <li style={textStyle}>El impacto de la falta en el negocio.</li>
            <li style={textStyle}>La repetición o no de los hechos probados.</li>
            <li style={textStyle}>La destreza o conocimiento del trabajador.</li>
            <li style={textStyle}>Otros factores legales.</li>
          </ul>
          <p style={textStyle}>
            En caso de que la Gerencia General determine que se ha cometido una infracción contra la política de seguridad de la entidad:
          </p>
          <ul style={{ paddingLeft: '20px', ...textStyle }}>
            <li style={textStyle}>Solicitará al Gerente de Infraestructura TIC, si procede, la interrupción temporal de los privilegios de acceso del trabajador en cuestión.</li>
            <li style={textStyle}>Pondrá en conocimiento de la Gerente de Administración y Finanzas, (responsable del área de RRHH), estos hechos y valorarán juntos el derivar o no, a los Servicios Legales de la entidad, todos los hechos, en función de los contratos y la legalidad vigente.</li>
            <li style={textStyle}>En caso de que el estudio final estime procedente un cese laboral del trabajador, la Gerencia General transmitirá la orden a la Gerencia de Administración y Finanzas que comunicará al trabajador y solicitará la devolución inmediata de todos los activos; así mismo, coordinará con el Gerente de Infraestructura TIC para que se cancelen todos sus privilegios de acceso a la empresa y a sus sistemas de información.</li>
          </ul>
          <div style={{ marginTop: '20px', textAlign: 'left' }}>
            {formData.fotoDni && (
              <img src={formData.fotoDni} alt="Foto DNI" style={{ maxHeight: '150px', maxWidth: '350px', display: 'block', marginBottom: '10px' }} />
            )}
            <p style={textStyle}>__________________________________________</p>
            <p style={textStyle}>Nombre: <strong>{formData.nombre} {formData.apellido}</strong></p>
            <p style={textStyle}>DNI: <strong>{formData.dni}</strong></p>
            <p style={textStyle}>Surco, <strong>{currentDate}</strong></p>
          </div>
        </div>
      </div>
      <br />
      <div className="form-check mt-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="agreeCheckbox"
          checked={formData.agreeDis || false}
          onChange={handleCheckboxChange}
        />
        <label className="form-check-label" htmlFor="agreeCheckbox">
          Estoy de acuerdo con lo mencionado en este documento
        </label>
      </div>
      <br />
    </div>
  );
});

export default DisInfo;
