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
import axios from 'axios';
import config from '../../config';
import Cookies from 'universal-cookie';

function Form() {
  const cookies = new Cookies();
  const [page, setPage] = useState(0);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [activeTasks, setActiveTasks] = useState([]);
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
    agree: false,
    agreeDis: false,
    agreeNoAnt: false,
    agreeSubv: false
  });

  useEffect(() => {
    const fetchActiveTasks = async () => {
      const cargoId = cookies.get('iD_CARGO');
      if (cargoId) {
        try {
          const response = await axios.get(`${config.API_URL}/packs/cargo/${cargoId}`);
          const taskIds = response.data.map(task => task.iD_TAREA);
          setActiveTasks(taskIds);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      }
    };
    fetchActiveTasks();
  }, [cookies]);

  useEffect(() => {
    const checkFormCompletion = () => {
     
      switch (activeFormTitles[page]) {
        case "Bienvenida":
        case "Introducción":
          return true;
        case "Información Personal":
          return (
            formData.nombre !== "" &&
            formData.apellido !== "" &&
            formData.dni !== "" &&
            formData.domicilio !== "" &&
            formData.distrito !== "" &&
            formData.fotoDni !== ""
          );
        case "Acuerdo de Confidencialidad SGSI":
          return formData.agree;
        case "Proceso Disciplinario SGSI":
          return formData.agreeDis;
        case "Declaración Jurada de No Tener Antecedentes Penales ni Judiciales SGSI":
          return formData.agreeNoAnt;
        case "Pago de Subvenciones":
          return formData.bbvaCuenta !== "" || formData.otroCci !== "";
        case "Pago de Subvenciones RRHH":
          return formData.agreeSubv;
        default:
          return false;
      }
    };
    const isComplete = checkFormCompletion();
    setIsFormComplete(isComplete);
    console.log("isFormComplete:", isComplete);
  }, [formData, page, activeTasks]);

  const FormTitles = [
    "Bienvenida",
    "Introducción",
    "Información Personal",
    "Acuerdo de Confidencialidad SGSI",
    "Proceso Disciplinario SGSI",
    "Declaración Jurada de No Tener Antecedentes Penales ni Judiciales SGSI",
    "Pago de Subvenciones",
    "Pago de Subvenciones RRHH"
  ];

  const getActiveFormTitles = () => {
    let titles = ["Bienvenida", "Introducción", "Información Personal"];
    if (activeTasks.includes(1)) titles.push("Acuerdo de Confidencialidad SGSI");
    if (activeTasks.includes(2)) titles.push("Proceso Disciplinario SGSI");
    if (activeTasks.includes(3)) titles.push("Declaración Jurada de No Tener Antecedentes Penales ni Judiciales SGSI");
    if (activeTasks.includes(4)) {
      titles.push("Pago de Subvenciones");
      titles.push("Pago de Subvenciones RRHH");
    }
    return titles;
  };

  const activeFormTitles = getActiveFormTitles();

  const handleNextPage = async () => {
    if (page === activeFormTitles.length - 1) {
      alert("FORM SUBMITTED");
      console.log(formData);
  
      // Update the ONB_ESTADO to false
      const userId = cookies.get('useR_ID');
      try {
        await axios.patch(`${config.API_URL}/usuarios/UpdateOnbEstado/${userId}`, { onB_ESTADO: false }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        // Update the cookie to reflect the change
        cookies.set('onB_ESTADO', false, { path: '/' });
        
        // Reload the form to reflect the completion status
        window.location.reload();
      } catch (error) {
        console.error('Error updating user status:', error);
      }
    } else {
      setPage(page + 1);
    }
  };
  

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const PageDisplay = () => {
    switch (activeFormTitles[page]) {
      case "Bienvenida":
        return <WInfo formData={formData} setFormData={setFormData} />;
      case "Introducción":
        return <IntroInfo formData={formData} setFormData={setFormData} activeTasks={activeTasks} />;
      case "Información Personal":
        return <PersonalInfo formData={formData} setFormData={setFormData} />;
      case "Acuerdo de Confidencialidad SGSI":
        return <ConfInfo formData={formData} setFormData={setFormData} />;
      case "Proceso Disciplinario SGSI":
        return <DisInfo formData={formData} setFormData={setFormData} />;
      case "Declaración Jurada de No Tener Antecedentes Penales ni Judiciales SGSI":
        return <NoAntInfo formData={formData} setFormData={setFormData} />;
      case "Pago de Subvenciones":
        return <SubvInfo formData={formData} setFormData={setFormData} />;
      case "Pago de Subvenciones RRHH":
        return <SubvDocInfo formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  const progressBarWidth = () => {
    const progressStep = 100 / activeFormTitles.length;
    return `${progressStep * page}%`;
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
          <h1>{activeFormTitles[page]}</h1>
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
            className="btn btn-secondary btn-md me-2"
            disabled={page === 0}
            onClick={handlePreviousPage}
          >
            Anterior
          </button>

          <button
            className="btn btn-primary btn-md"
            onClick={handleNextPage}
            disabled={!isFormComplete}
          >
            {page === activeFormTitles.length - 1 ? "Finalizar" : "Siguiente"}
          </button>
          <br /><br /><br /><br />
        </div>
      </div>
    </div>
  );
}

export default Form;
