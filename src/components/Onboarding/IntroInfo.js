import React from 'react';
import '../../css/Index.css';
import '../../css/IntroInfo.css';



function IntroInfo({ formData, setFormData, activeTasks }) {
  const cardData = [
    {
      title: "Acuerdo de Confidencialidad",
      text: "Establece términos para proteger información confidencial; compromiso de mantener la confidencialidad de datos privilegiados.",
      taskId: 1,
    },
    {
      title: "Proceso Disciplinario SGSI",
      text: "Describe pautas disciplinarias para seguridad de la información; procedimientos ante violaciones de seguridad y conducta inapropiada.",
      taskId: 2,
    },
    {
      title: "Declaración Jurada de No Tener Antecedentes",
      text: "Declaración oficial de no tener antecedentes judiciales; parte de proceso de verificación de antecedentes para empleados.",
      taskId: 3,
    },
    {
      title: "Pago de Subvenciones RRHH",
      text: "Solicita y procesa pagos de subvenciones de RRHH; incluye bonificaciones, compensaciones adicionales y reembolsos de gastos.",
      taskId: 4,
    },
  ];

  return (
    <div>
      <h2 className="mb-4">A continuación te mostramos los formularios parte del proceso de onboarding:</h2>

      {/* Lista de Cards */}
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {cardData.map(card => activeTasks.includes(card.taskId) && (
          <div className="col" key={card.taskId}>
            <div className="custom-card">
              <div className="custom-card-body">
                <h5 className="custom-card-title">{card.title}</h5>
                <p className="custom-card-text">{card.text}</p>
              </div>
            </div>
            <br/>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IntroInfo;
