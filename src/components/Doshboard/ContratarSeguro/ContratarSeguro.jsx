import React, { useState } from 'react';
import './ContratarSeguro.css';
import { Grid } from '@mui/material';
import PlanesSalud from '../../CotizarComponents/PlanesSalud';
import PlanesVida from '../../CotizarComponents/PlanesVida';
import { ModalContratarSeguro } from '../../Modales/ModalContratarSeguro/ModalContratarSeguro';
import { useUser } from "../../../context/UserContext";

export const ContratarSeguro = () => {
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { usuario } = useUser();

  const handleOpen = (plan) => {
    setSelectedPlan(plan);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPlan(null);
  };

  const parseList = (data) => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') return data.split('\n');
    return [];
  };

  const renderPlan = (plan, idx) => {
    const coberturaList = parseList(plan.cobertura);
    const beneficiosList = parseList(plan.beneficios);
    const ventajasList = parseList(plan.ventajas);

    return (
      <Grid item xs={12} key={idx}>
        <div className="plan-item">
          <h3 className="plan-title">{plan.title}</h3>
          <p className="price-text">{plan.precio}</p>

          <div className="plan-details-container">
            <div className="plan-detail-card">
              <div className="plan-icon">🛡️</div>
              <div className="detail-title">Cobertura</div>
              <ul>
                {coberturaList.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>

            <div className="plan-detail-card">
              <div className="plan-icon">💎</div>
              <div className="detail-title">Beneficios</div>
              <ul>
                {beneficiosList.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>

            <div className="plan-detail-card">
              <div className="plan-icon">🚀</div>
              <div className="detail-title">Ventajas</div>
              <ul>
                {ventajasList.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>

          <div className="button-group">
            <button className="plan-button" onClick={() => handleOpen(plan)}>
              Subir Formulario
            </button>
          </div>
        </div>
      </Grid>
    );
  };

  return (
    <div className="contratarseguro">
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

      <h2 className="section-title salud-title">Planes de Salud</h2>
      <Grid container spacing={2}>
        {PlanesSalud.map(renderPlan)}
      </Grid>

      <h2 className="section-title vida-title">Planes de Vida</h2>
      <Grid container spacing={2}>
        {PlanesVida.map(renderPlan)}
      </Grid>

      <ModalContratarSeguro open={open} onClose={handleClose} plan={selectedPlan} userData={usuario}/>
    </div>
  );
};
