import React, { useState, useEffect, useRef } from 'react';
import WInfo from './WInfo';
import IntroInfo from './IntroInfo';
import PersonalInfo from './PersonalInfo';
import SubvInfo from './SubvInfo';
import ConfInfo from './ConfInfo';
import DisInfo from './DisInfo';
import NoAntInfo from './NoAntInfo';
import SubvDocInfo from './SubvDocInfo';
import '../../css/Form.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import axios from 'axios';
import config from '../../config';
import Cookies from 'universal-cookie';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function Form({ setView }) {
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
    agreeSubv: false,
    profilePhoto: ""
  });
  const [capturedImages, setCapturedImages] = useState({});

  // Variables para mover la imagen
  const [imagePosition, setImagePosition] = useState({ x: 8, y: 0 });
  const [imageScale, setImageScale] = useState(0.93);

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
      const formElement = formRefs[activeFormTitles[page]].current.querySelector('div[style*="padding: 15mm"]');

      if (formElement) {
        const canvas = await html2canvas(formElement, {
          scale: 1.5, // Aumentar la escala para mayor calidad
          useCORS: true,
          logging: true,
          scrollY: -window.scrollY
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0); // Guardar como JPEG con alta calidad
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

      // Ajustar el tamaño de la imagen en el PDF
      const imgWidth = pdfWidth * imageScale;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      pdf.addImage(imgData, 'JPEG', imagePosition.x, imagePosition.y, imgWidth, imgHeight);
      
      const pdfBlob = pdf.output('blob');
      const fileSize = pdfBlob.size / 1024 / 1024; // Convertir a MB

      if (fileSize > 5) {
        console.error(`PDF demasiado grande: ${fileSize.toFixed(2)} MB. Comprimiendo...`);
        const compressionRate = 5 / fileSize; // Calcular tasa de compresión necesaria
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const image = new Image();
        image.src = imgData;
        await new Promise((resolve) => {
          image.onload = () => {
            canvas.width = image.width * compressionRate;
            canvas.height = image.height * compressionRate;
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            const compressedImgData = canvas.toDataURL('image/jpeg', 0.7); // Comprimir imagen
            pdf.addImage(compressedImgData, 'JPEG', imagePosition.x, imagePosition.y, imgWidth, imgHeight);
            resolve();
          };
        });
      }

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

    if (final && formData.profilePhoto) {
      const profilePhotoBlob = await fetch(formData.profilePhoto).then(res => res.blob());
      const profilePhotoFormData = new FormData();
      profilePhotoFormData.append('file', profilePhotoBlob, `${userId}.jpg`);
      profilePhotoFormData.append('prefix', userId);

      try {
        await axios.post(`${config.API_URL}/ImageManagement/uploadImage`, profilePhotoFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } catch (error) {
        console.error('Error uploading profile photo:', error);
      }
    }
  };

  const handleNextPage = async () => {
    if (formRefs[activeFormTitles[page]] && formRefs[activeFormTitles[page]].current) {
      const formElement = formRefs[activeFormTitles[page]].current.querySelector('div[style*="padding: 15mm"]');

      if (formElement) {
        const canvas = await html2canvas(formElement, {
          scale: 1.5, // Aumentar la escala para mayor calidad
          useCORS: true,
          logging: true,
          scrollY: -window.scrollY
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0); // Guardar como JPEG con alta calidad
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

       setView('endform'); // Redirigir a EndForm después de finalizar
     
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

  const renderProgressSteps = () => {
    return activeFormTitles.map((title, index) => (
      <div
        key={index}
        className={`progress-step ${index === page ? 'active' : ''} ${index < page ? 'completed' : ''}`}
      >
        <div className="step">{index + 1}</div>
        {index === page && <p className="active-title">{title}</p>}
      </div>
    ));
  };
  const scrollToActiveStep = () => {
    const activeStep = document.querySelector('.progress-step.active');
    if (activeStep) {
        const progressBar = document.querySelector('.progressbar');
        const offsetLeft = activeStep.offsetLeft;
        const scrollLeft = offsetLeft - (window.innerWidth / 2 - activeStep.clientWidth / 2);
        progressBar.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
    }
};

useEffect(() => {
    scrollToActiveStep();
}, [page]);
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
    <div className="form" >
      {loading && (
        <div className="loading-overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Cargando...</span>
          </div>
        </div>
      )}

      <div className="progressbar">
        {renderProgressSteps()}
      </div>
      <div className="container-lg" >
        <div className="header">
          <h1 className="d-none">{activeFormTitles[page]}</h1>
        </div>
        <div className="body" >
          <TransitionGroup component={null}>
            <CSSTransition key={page} timeout={300} classNames="fade">
              <div ref={formRefs[activeFormTitles[page]]}>{PageDisplay()}</div>
            </CSSTransition>
          </TransitionGroup>
        </div>
        <div className="footer">
          <div className="button-container">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;
