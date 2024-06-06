import React, { useState, useEffect, useRef } from "react";
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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function Form() {
  const cookies = new Cookies();
  const formRefs = {
    "Acuerdo de Confidencialidad SGSI": useRef(null),
    "Proceso Disciplinario SGSI": useRef(null),
    "Declaración Jurada de No Tener Antecedentes Penales ni Judiciales SGSI": useRef(null),
    "Pago de Subvenciones RRHH": useRef(null)
  };
  const [page, setPage] = useState(0);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [activeTasks, setActiveTasks] = useState([]);
  const [formCompleted, setFormCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const [capturedImages, setCapturedImages] = useState({});
  const [alertVisible, setAlertVisible] = useState(false);

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

    const checkIfFormCompleted = () => {
      const formStatus = cookies.get('onB_ESTADO');
      if (formStatus === 'false') {
        setFormCompleted(true);
      }
    };
    checkIfFormCompleted();
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
  const captureAndUploadPDFs = async (final = false) => {
    const userId = cookies.get('useR_ID');
    let imagesToCapture = { ...capturedImages };

    if (final && formRefs[activeFormTitles[page]] && formRefs[activeFormTitles[page]].current) {
        // Asegurándonos de que el elemento formElement es válido
        const formElement = formRefs[activeFormTitles[page]].current.querySelector('div[style*="padding: 15mm"]');

        if (formElement) {
            const canvas = await html2canvas(formElement, {
                scale: 2,
                useCORS: true,
                logging: true,
                scrollY: -window.scrollY
            });

            const imgData = canvas.toDataURL('image/png');
            imagesToCapture = { ...imagesToCapture, [activeFormTitles[page]]: imgData };
        } else {
            console.error('No se pudo encontrar el elemento para capturar.');
        }
    }

    for (const [title, imgData] of Object.entries(imagesToCapture)) {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        const pdfBlob = pdf.output('blob');
        const formData = new FormData();
        formData.append('file', pdfBlob, `${userId}-${title}.pdf`);
        formData.append('userId', userId);
        formData.append('documentName', title);

        try {
            await axios.post(`${config.API_URL}/FileManagement/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (error) {
            console.error('Error uploading PDF:', error);
        }
    }
};

const handleNextPage = async () => {
    if (formRefs[activeFormTitles[page]] && formRefs[activeFormTitles[page]].current) {
        // Asegurándonos de que el elemento formElement es válido
        const formElement = formRefs[activeFormTitles[page]].current.querySelector('div[style*="padding: 15mm"]');

        if (formElement) {
            const canvas = await html2canvas(formElement, {
                scale: 2,
                useCORS: true,
                logging: true,
                scrollY: -window.scrollY
            });

            const imgData = canvas.toDataURL('image/png');
            setCapturedImages(prevImages => ({
                ...prevImages,
                [activeFormTitles[page]]: imgData
            }));
        } else {
            console.error('No se pudo encontrar el elemento para capturar.');
        }
    }

    if (page === activeFormTitles.length - 1) {
        setLoading(true);
        try {
            await captureAndUploadPDFs(true);

            const userId = cookies.get('useR_ID');
            await axios.patch(`${config.API_URL}/usuarios/UpdateOnbEstado/${userId}`, { onB_ESTADO: false }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            cookies.set('onB_ESTADO', 'false', { path: '/' });

            setAlertVisible(true);
            setTimeout(() => {
              setAlertVisible(false);
              window.location.reload();
            }, 3000);
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert("Ocurrió un error al enviar el formulario");
        } finally {
            setLoading(false);
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

  const PageDisplay = (title = activeFormTitles[page]) => {
    switch (title) {
      case "Bienvenida":
        return <WInfo formData={formData} setFormData={setFormData} />;
      case "Introducción":
        return <IntroInfo formData={formData} setFormData={setFormData} activeTasks={activeTasks} />;
      case "Información Personal":
        return <PersonalInfo formData={formData} setFormData={setFormData} />;
      case "Acuerdo de Confidencialidad SGSI":
        return <ConfInfo formData={formData} setFormData={setFormData} ref={formRefs[title]} />;
      case "Proceso Disciplinario SGSI":
        return <DisInfo formData={formData} setFormData={setFormData} ref={formRefs[title]} />;
      case "Declaración Jurada de No Tener Antecedentes Penales ni Judiciales SGSI":
        return <NoAntInfo formData={formData} setFormData={setFormData} ref={formRefs[title]} />;
        case "Pago de Subvenciones":
          return <SubvInfo formData={formData} setFormData={setFormData} ref={formRefs[title]} />;
      case "Pago de Subvenciones RRHH":
        return <SubvDocInfo formData={formData} setFormData={setFormData} ref={formRefs[title]} />;
      default:
        return null;
    }
  };

  const progressBarWidth = () => {
    const progressStep = 100 / activeFormTitles.length;
    return `${progressStep * page}%`;
  };

  if (formCompleted) {
    return (
      <div className="form">
        <div className="container-lg">
          <div className="header">
            <h1>Formularios Completados</h1>
          </div>
          <div className="body">
            <p>Ya has completado todos los formularios requeridos.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Cargando...</span>
          </div>
        </div>
      )}
      {alertVisible && (
        <div className="alert alert-success position-fixed bottom-0 end-0 m-3" role="alert">
          Formulario enviado exitosamente
        </div>
      )}
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
              <div ref={formRefs[activeFormTitles[page]]}>{PageDisplay()}</div>
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
