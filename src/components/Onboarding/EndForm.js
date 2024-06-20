import React from 'react';
import Cookies from 'universal-cookie';

function EndForm({ setView }) {
    const cookies = new Cookies();
    const nombre = cookies.get('nombre');
    const apellido = cookies.get('apellido');

    return (
        <div className="container d-flex justify-content-center">
            <div className="custom-card text-center" style={{ width: '50rem' }}>
                <div className="custom-card-body">
                    <h2 className="custom-card-title">¡Gracias por completar el proceso de carga de documentos, {nombre} {apellido}!</h2>
                    <p className="custom-card-text">
                        Hemos recibido todos los documentos necesarios para tu incorporación a ANGKOR PERU. A continuación, revisaremos la información y te informaremos si necesitamos algo más de tu parte.
                    </p>
                    <button className="btn btn-primary" onClick={() => setView('func')}>Ir a Inducción</button>
                </div>
            </div>
        </div>
    );
}

export default EndForm;
