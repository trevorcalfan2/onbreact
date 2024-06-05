import React, { forwardRef } from 'react';

const NoAntInfo = forwardRef(({ formData, setFormData }, ref) => {
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
        width: '211mm',
        minHeight: '297mm',
        padding: '15mm', // Reduced padding
        border: '1px solid #000',
        margin: '0 auto',
        backgroundColor: '#fff',
        boxSizing: 'border-box' // Ensures padding is included in the width/height
    };

    const handleCheckboxChange = (e) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            agreeNoAnt: e.target.checked
        }));
    };

    return (
        <div ref={ref}>
            <br/>
            <div style={containerStyle}>
                <h2 style={{ textAlign: 'center', textDecoration: 'underline' }}>DECLARACIÓN JURADA DE NO TENER ANTECEDENTES POLICIALES NI JUDICIALES</h2>
                <p style={textStyle}>
                    Por el presente documento 
                    Yo <strong>{formData.nombre} {formData.apellido}</strong> identificado (a) con D.N.I. Nº <strong>{formData.dni}</strong> con domicilio en <strong>{formData.domicilio}</strong> del distrito de <strong>{formData.distrito}</strong> Provincia de <strong>LIMA</strong> Departamento de <strong>LIMA</strong>.
                </p>
                <p style={textStyle}>
                    DECLARO BAJO JURAMENTO: NO REGISTRAR ANTECEDENTES POLICIALES NI JUDICIALES.
                </p>
                <p style={textStyle}>
                    En caso de resultar falsa la información que proporciono declare haber incurrido en el delito de falsa declaración en Procesos Administrativos – Artículo 411º del Código Penal y Delito contra la fe Pública – Titulo XIX del Código Penal acorde al artículo 32º de la Ley Nº 27444 Ley del Procedimiento Administrativos General. 
                </p>
                <p style={textStyle}>
                    En fe de lo cual firmo la presente a los <strong>{currentDate}</strong>
                </p>
                <div style={{ marginTop: '20px', textAlign: 'left' }}>
                    {formData.fotoDni && (
                        <img src={formData.fotoDni} alt="Foto DNI" style={{ maxHeight: '150px', maxWidth: '350px', display: 'block', marginBottom: '10px' }} />
                    )}
                    <p style={textStyle}>__________________________________________</p>
                    <p style={textStyle}>Firma</p>
                    <p style={textStyle}>DNI: <strong>{formData.dni}</strong></p>
                </div>
            </div>
            <br/>
            <div className="form-check mt-3">
                <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="agreeNoAntCheckbox" 
                    checked={formData.agreeNoAnt || false} 
                    onChange={handleCheckboxChange} 
                />
                <label className="form-check-label" htmlFor="agreeNoAntCheckbox">
                    Estoy de acuerdo con lo mencionado en este documento
                </label>
            </div>
            <br/>
        </div>
    );
});

export default NoAntInfo;
