import React from 'react';
import Cookies from 'universal-cookie';

function ConfDeclaration({ formData, setFormData, innerRef }) {
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

    const cookies = new Cookies();
    const idCargo = cookies.get('iD_CARGO');

    const getCargoName = (id) => {
        switch (id.toString()) {
            case '1':
                return 'Analista';
            case '2':
                return 'Gerente';
            case '3':
                return 'Jefe';
            case '4':
                return 'Practicante';
            default:
                return 'Desconocido';
        }
    };

    const cargo = getCargoName(idCargo);

    const textStyle = {
        fontFamily: 'Arial, sans-serif',
        textAlign: 'justify',
        marginBottom: '10px'
    };

    const containerStyle = {
        width: '228mm',
        minHeight: '297mm',
        padding: '15mm', // Reduced padding
      //  border: '1px solid #000',
        margin: '0 auto',
        backgroundColor: '#fff',
        boxSizing: 'border-box' // Ensures padding is included in the width/height
    };

    const handleCheckboxChange = (e) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            agree: e.target.checked
        }));
    };

    return (
        <div ref={innerRef}>
            <div className="form-content" style={containerStyle}>
                <h2 style={{ textAlign: 'center', textDecoration: 'underline' }}>DECLARACIÓN JURADA</h2>
                <p style={textStyle}>
                    Por el presente documento, yo <strong>{formData.nombre} {formData.apellido}</strong> identificado con DNI N° <strong>{formData.dni}</strong> con la posición de <strong>{cargo}</strong> en ANGKOR GROUP S.A.C. con RUC 20506002975, declaro bajo juramento que tengo conocimiento de la confidencialidad con la que debe ser tratada la Información a la cual tendré acceso en la ejecución de mis funciones, comprometiéndome a mantener y guardar estricta reserva, absoluta confidencialidad y a no divulgar:
                </p>
                <ul style={{ paddingLeft: '20px', ...textStyle }}>
                    <li style={textStyle}>Toda documentación administrativa que maneje de los clientes, la cual comprende las comunicaciones internas o externas suscritas por los mismos y la remitida a éstos, memorándums internos, Políticas, Directivas, datos, procedimientos, sueldos y salarios.</li>
                    <li style={textStyle}>La documentación administrativa referida a proyectos, análisis, informes, extractos, compilaciones, estudios y demás documentos emitidos por ANGKOR GROUP S.A.C. o terceros que reflejen información respecto a hechos o actividades que realicen los clientes en su condición de sociedad anónima o vinculadas al registro de información contable, información de remuneraciones o información del personal.</li>
                    <li style={textStyle}>La información contenida en el registro contable, libro de planillas o los procesos o procedimientos internos para la obtención de información contenida en los mismos, así como la información a la que se accede a efectos de realizar pruebas de los sistemas.</li>
                    <li style={textStyle}>La información a la que tenga acceso en la realización de pruebas internas para el funcionamiento e implantación de los programas informáticos.</li>
                    <li style={textStyle}>Contratos de compraventa o servicios a los cuales tenga acceso.</li>
                    <li style={textStyle}>Todos los datos personales de los clientes a los que pueda acceder y conocer con motivo de la ejecución de los servicios prestados.</li>
                    <li style={textStyle}>Toda otra información de cualquier índole de los clientes, que pueda acceder y conocer en mi condición de prestador del servicio.</li>
                </ul>
                <p style={textStyle}>
                    El incumplimiento del compromiso asumido por el presente documento, faculta a ANGKOR GROUP S.A.C. a iniciar las acciones legales correspondientes.
                </p>
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
            <br />
            <div className="form-check mt-3">
                <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="agreeCheckbox" 
                    checked={formData.agree || false} 
                    onChange={handleCheckboxChange} 
                />
                <label className="form-check-label" htmlFor="agreeCheckbox">
                    Estoy de acuerdo con lo mencionado en este documento
                </label>
            </div>
            <br />
        </div>
    );
}

export default ConfDeclaration;
