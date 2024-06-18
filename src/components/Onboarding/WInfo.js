import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import docIcon from '../../images/docicon.png';  // Importa la imagen como una variable
import '../../css/Index.css';  // Asegúrate de importar tu archivo CSS

function WInfo({ formData, setFormData }) {
    return (
        <div className="container">
            <div className="card custom-card-bg text-white p-4">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <h2>¡Estamos encantados de darte la bienvenida a Angkor Perú!</h2>
                        <p>
                            Para asegurarnos de que tu incorporación sea lo más fluida posible, necesitamos que completes y subas algunos documentos esenciales antes de tu primer día. 
                            Estos documentos nos ayudarán a prepararte adecuadamente para tu integración y a cumplir con las regulaciones de la empresa.
                        </p>
                    </div>
                    <div className="col-md-6 text-center">
                        <img src={docIcon} alt="Document Icon" className="img-fluid" style={{ width: '70%' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WInfo;
