import React, { forwardRef } from 'react';

const SubvDocInfo = forwardRef(({ formData, setFormData }, ref) => {
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
            agreeSubv: e.target.checked
        }));
    };

    return (
        <div ref={ref}>
            <br />
            <div style={containerStyle}>
                <h2 style={{ textAlign: 'center', textDecoration: 'underline' }}>PAGO DE SUBVENCIONES</h2>
                <p style={textStyle}>
                    Señores
                    <br />
                    ANGKOR GROUP S.A.C.
                    <br />
                    <a href="#">Presente. -</a>
                </p>
                <p style={textStyle}>
                    Estimados señores:
                </p>
                <p style={textStyle}>
                    Yo <strong>{formData.nombre} {formData.apellido}</strong> con DNI <strong>{formData.dni}</strong> solicito a Uds. el abono de mis subvenciones a mi cuenta bancaria:
                </p>
                <div style={{ border: '1px solid #000', padding: '10px' }}>
                    <table style={{ width: '100%', tableLayout: 'fixed' }}>
                        <tbody>
                            <tr>
                                <td style={{ width: '5%' }}><input type="checkbox" checked={!!formData.bbvaCuenta} readOnly /></td>
                                <td style={{ width: '45%' }}>BBVA Banco Continental</td>
                                <td style={{ width: '10%' }}>Cuenta: 0011 -</td>
                                <td style={{ width: '40%' }}>{formData.bbvaCuenta}</td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" checked={!!formData.otroCci} readOnly /></td>
                                <td>Otro (*)</td>
                                <td>CCI:</td>
                                <td>{formData.otroCci}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p style={textStyle}>
                    Fecha: {currentDate}
                    <br />
                    Firma: <span style={{ display: 'inline-block', width: '200px', borderBottom: '1px solid #000' }}>
                        {formData.firma && (
                            <img src={formData.firma} alt="Firma" style={{ height: '50px' }} />
                        )}
                    </span>
                </p>
                <p style={textStyle}>
                    (*) Indicar nombre de la entidad financiera
                </p>
                <div style={{ marginTop: '20px', textAlign: 'left' }}>
                    {formData.fotoDni && (
                        <img src={formData.fotoDni} alt="Foto DNI" style={{ maxHeight: '150px', maxWidth: '350px', display: 'block', marginBottom: '10px' }} />
                    )}
                    <p style={textStyle}>__________________________________________</p>
                    <p style={textStyle}>Nombre: <strong>{formData.nombre} {formData.apellido}</strong></p>
                    <p style={textStyle}>DNI: <strong>{formData.dni}</strong></p>
                </div>
            </div>
            <br />
            <div className="form-check mt-3">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="agreeCheckbox"
                    checked={formData.agreeSubv || false}
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

export default SubvDocInfo;
