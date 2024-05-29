import React, { useState, useEffect } from "react";
import WInfo from "./WInfo";
import IntroInfo from "./IntroInfo";
import PersonalInfo from "./PersonalInfo";
import SubvInfo from "./SubvInfo";
import ConfInfo from "./ConfInfo";
import DisInfo from "./DisInfo";
import NoAntInfo from "./NoAntInfo";
import SubvDocInfo from "./SubvDocInfo";
import '../../css/Form.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

function Form() {
  const [page, setPage] = useState(0);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    username: "",
    nationality: "",
    other: "",
    nombre: "",
    apellido: "",
    dni: "",
    domicilio: "",
    distrito: "",
    fecha: "",
    fotoDni: "",
    bbvaCuenta: "",
    otroCci: "",
    posicion: "",
    agree: false, // Añadir el estado para el checkbox en ConfInfo
    agreeDis: false, // Añadir el estado para el checkbox en DisInfo
    agreeNoAnt: false, // Añadir el estado para el checkbox en NoAntInfo
    agreeSubv: false // Añadir el estado para el checkbox en SubvDocInfo
  });

  useEffect(() => {
    const checkFormCompletion = () => {
      switch (page) {
        case 0:
          return true;
        case 1:
          return true;
        case 2:
          return (
            formData.nombre !== "" &&
            formData.apellido !== "" &&
            formData.dni !== "" &&
            formData.domicilio !== "" &&
            formData.distrito !== "" &&
            formData.fotoDni !== ""
          );
        case 3:
          return (
            (formData.bbvaCuenta !== "" && formData.bbvaCuenta.length > 0) ||
            (formData.otroCci !== "" && formData.otroCci.length > 0)
          );
        case 4:
          return formData.agree;
        case 5:
          return formData.agreeDis;
        case 6:
          return formData.agreeNoAnt;
        case 7:
          return formData.agreeSubv;
        default:
          return false;
      }
    };
    setIsFormComplete(checkFormCompletion());
  }, [formData, page]);

  const FormTitles = [
    "Bienvenida",
    "Introducción",
    "Información Personal",
    "Pago de Subvenciones",
    "Acuerdo de Confidencialidad SGSI",
    "Proceso Disciplinario SGSI",
    "Declaración Jurada de No Tener Antecedentes Penales ni Judiciales SGSI",
    "Pago de Subvenciones RRHH"
  ];

  const handleNextPage = () => {
    if (page === FormTitles.length - 1) {
      alert("FORM SUBMITTED");
      console.log(formData);
    } else {
      setPage(page + 1);
    }
  };

  const PageDisplay = () => {
    switch (page) {
      case 0:
        return <WInfo formData={formData} setFormData={setFormData} />;
      case 1:
        return <IntroInfo formData={formData} setFormData={setFormData} />;
      case 2:
        return <PersonalInfo formData={formData} setFormData={setFormData} />;
      case 3:
        return <SubvInfo formData={formData} setFormData={setFormData} />;
      case 4:
        return <ConfInfo formData={formData} setFormData={setFormData} />;
      case 5:
        return <DisInfo formData={formData} setFormData={setFormData} />;
      case 6:
        return <NoAntInfo formData={formData} setFormData={setFormData} />;
      case 7:
        return <SubvDocInfo formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  const progressBarWidth = () => {
    switch (page) {
      case 0:
        return "12.5%";
      case 1:
        return "25%";
      case 2:
        return "37.5%";
      case 3:
        return "50%";
      case 4:
        return "62.5%";
      case 5:
        return "75%";
      case 6:
        return "87.5%";
      case 7:
        return "100%";
      default:
        return "0%";
    }
  };

  return (
    <div className="form">
      <div className="progressbar">
        <div
          style={{
            width: progressBarWidth(),
            height: "100%",
            backgroundColor: "blue",
            transition: "width 0.5s ease-in-out"
          }}
        ></div>
      </div>
      <div className="container-lg">
        <div className="header">
          <h1>{FormTitles[page]}</h1>
        </div>
        <div className="body">
          <TransitionGroup component={null}>
            <CSSTransition key={page} timeout={300} classNames="fade">
              <div>{PageDisplay()}</div>
            </CSSTransition>
          </TransitionGroup>
        </div>
        <div className="footer">
          <button
            className='btn btn-secondary btn-md me-2'
            disabled={page === 0}
            onClick={() => {
              setPage(page - 1);
            }}
          >
            Anterior
          </button>
          
          <button
            className='btn btn-primary btn-md'
            onClick={handleNextPage}
            disabled={!isFormComplete}
          >
            {page === FormTitles.length - 1 ? "Finalizar" : "Siguiente"}
          </button>
          <br/><br/><br/><br/>
        </div>
      </div>
    </div>
  );
}

export default Form;
