import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { UserContext, UserProvider, useUser } from "../../../context/UserContext";
import { ModalContratarSeguro } from '../../Modales/ModalContratarSeguro/ModalContratarSeguro';
import './ContratarSeguro.css';
import { useContext } from 'react';

export const ContratarSeguro = () => {
  const {usuario, setUsuario} = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planes, setPlanes] = useState([]);
  //const { usuario } = useUser();

  
  useEffect(() => {
    const fetchData = async () => {
      try {
      const response = await fetch('http://localhost:3030/planes/seguros');
      const data = await response.json();
        setPlanes(data);

      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    
    fetchData();
  }, []);

  const handleOpen = (plan) => {
    setSelectedPlan(plan);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPlan(null);
  };


    return (
      <div className="contratarseguro" style={{ textAlign: "center" }}>
      <div className="instrucciones-container">
      <h3 className="instrucciones-text">
      Para poder contratar el seguro descargue el formulario, llénelo y súbalo en el seguro que desea contratar:
      </h3>
    <div className="main-download-container">
      <a href="/Formulario/Formulario.pdf" download className="main-download-button">
        Descargar Formulario
      </a>
    </div>
  </div>

  {/* Planes Salud */}
  <h1 className="section-title salud-title">PLANES SALUD</h1>
  <Grid container spacing={2} justifyContent="center">
    {planes.filter(plan => plan.nombre.includes("Salud")).map((plan, index) => (
      <Grid item xs={12} md={6} key={index}>
        <div className="plan-item">
          <h3 className="plan-title">{plan.nombre}</h3>
          <p className="price-text">Precio: ${plan.precio}</p>
          <p>{plan.descripcion}</p>
            <div className="detail-title">Beneficios</div>
            <ul>
              <li>{plan.detalle}</li>
            </ul>

          <div className="button-group">
            <button className="plan-button" onClick={() => handleOpen(plan)}>
              Subir Formulario
            </button>
          </div>
        </div>
      </Grid>
    ))}
  </Grid>

  {/* Planes Vida */}
  <h2 className="section-title vida-title">PLANES VIDA</h2>
  <Grid container spacing={2} justifyContent="center">
    {planes.filter(plan => plan.nombre.includes("Vida")).map((plan, index) => (
      <Grid item xs={12} md={6} key={index}>
        <div className="plan-item">
          <h3 className="plan-title">{plan.nombre}</h3>
          <p className="price-text">Precio: ${plan.precio}</p>
          <p>{plan.descripcion}</p>

            <div className="detail-title">Beneficios</div>
            <ul>
              <li>{plan.detalle}</li>
            </ul>

          <div className="button-group">
            <button className="plan-button" onClick={() => handleOpen(plan)}>
              Subir Formulario
            </button>
          </div>
        </div>
      </Grid>
    ))}
  </Grid>

  <ModalContratarSeguro open={open} onClose={handleClose} plan={selectedPlan} userData={usuario} />
</div>

  );
};