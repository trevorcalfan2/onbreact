import React from 'react';

function IntroInfo({ formData, setFormData, activeTasks }) {
  return (
    <div>
      <h3 className="mb-4">A continuación te mostramos los formularios parte del proceso de onboarding:</h3>

      {/* Lista de Cards */}
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {/* Card 1: Acuerdo de Confidencialidad */}
        {activeTasks.includes(1) && (
          <div className="col">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Acuerdo de Confidencialidad</h5>
                <p className="card-text">Establece términos para proteger información confidencial; compromiso de mantener la confidencialidad de datos privilegiados.</p>
              </div>
            </div>
            <br/>
          </div>
         
        )}
        
        {/* Card 2: Proceso Disciplinario SGSI */}
        {activeTasks.includes(2) && (
          <div className="col">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Proceso Disciplinario SGSI</h5>
                <p className="card-text">Describe pautas disciplinarias para seguridad de la información; procedimientos ante violaciones de seguridad y conducta inapropiada.</p>
              </div>
            </div>
            <br/>
          </div>
        )}
        
        {/* Card 3: Declaración Jurada de No Tener Antecedentes */}
        {activeTasks.includes(3) && (
          <div className="col">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Declaración Jurada de No Tener Antecedentes</h5>
                <p className="card-text">Declaración oficial de no tener antecedentes judiciales; parte de proceso de verificación de antecedentes para empleados.</p>
              </div>
            </div>
            <br/>
          </div>
        )}
        
        {/* Card 4: Pago de Subvenciones RRHH */}
        {activeTasks.includes(4) && (
          <div className="col">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Pago de Subvenciones RRHH</h5>
                <p className="card-text">Solicita y procesa pagos de subvenciones de RRHH; incluye bonificaciones, compensaciones adicionales y reembolsos de gastos.</p>
              </div>
            </div>
            <br/>
          </div>
        )}
      </div>
    </div>
  );
}

export default IntroInfo;
