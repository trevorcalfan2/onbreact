import React, { useState, useEffect } from 'react';

function SubvInfo({ formData, setFormData }) {
    const [bbvaSelected, setBbvaSelected] = useState(!!formData.bbvaCuenta);
    const [otrosSelected, setOtrosSelected] = useState(!!formData.otroCci);

    useEffect(() => {
        setBbvaSelected(!!formData.bbvaCuenta);
        setOtrosSelected(!!formData.otroCci);
    }, [formData.bbvaCuenta, formData.otroCci]);

    const handleBbvaChange = (e) => {
        setBbvaSelected(e.target.checked);
        if (e.target.checked) {
            setFormData(prevFormData => ({
                ...prevFormData,
                bbvaCuenta: prevFormData.bbvaCuenta || "",
                otroCci: ""
            }));
            setOtrosSelected(false);
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                bbvaCuenta: ""
            }));
        }
    };

    const handleOtrosChange = (e) => {
        setOtrosSelected(e.target.checked);
        if (e.target.checked) {
            setFormData(prevFormData => ({
                ...prevFormData,
                otroCci: prevFormData.otroCci || "",
                bbvaCuenta: ""
            }));
            setBbvaSelected(false);
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                otroCci: ""
            }));
        }
    };

    const handleBbvaInputChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Solo permitir dígitos
        setFormData(prevFormData => ({
            ...prevFormData,
            bbvaCuenta: value
        }));
    };

    const handleOtrosInputChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Solo permitir dígitos
        setFormData(prevFormData => ({
            ...prevFormData,
            otroCci: value
        }));
    };

    return (
        <div>
            <h3 className="mb-4">A continuación se muestra un formulario donde ingresarás tus datos personales de pago:</h3>
            <p>Se recomienda revisar antes de proceder con el siguiente paso.</p>
            <br />

            <div className="row">
                <div className="col-md-6">
                    <input type="checkbox" id="bbvaCheckbox" name="bbvaCheckbox" checked={bbvaSelected} onChange={handleBbvaChange} />
                    <label htmlFor="bbvaCheckbox">BBVA Banco Continental</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="cuentaInput" 
                        placeholder="Cuenta: 0011-" 
                        value={formData.bbvaCuenta} 
                        readOnly={!bbvaSelected} 
                        onChange={handleBbvaInputChange} 
                    />
                </div>
                <div className="col-md-6">
                    <input type="checkbox" id="otrosCheckbox" name="otrosCheckbox" checked={otrosSelected} onChange={handleOtrosChange} />
                    <label htmlFor="otrosCheckbox">Otro (*)</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="cciInput" 
                        placeholder="CCI:" 
                        value={formData.otroCci} 
                        readOnly={!otrosSelected} 
                        onChange={handleOtrosInputChange} 
                    />
                </div>
            </div>
            <br />
        </div>
    );
}

export default SubvInfo;
