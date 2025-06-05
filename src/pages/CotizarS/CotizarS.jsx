import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import Header from '../../components/planescomponents/Header';
import Formulario from '../../components/CotizarComponents/Formulario';
import PlanesSalud from '../../components/CotizarComponents/PlanesSalud';


const CotizarS = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { state } = useLocation();
  console.log("Título recibido:", state.title);
  console.log("Títulos disponibles:");
  PlanesSalud.forEach(p => console.log(p.title));

  if (!state || !state.title) {
    return (
      <>
        <Header />
        <Box mt={4} />
        <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>Plan no encontrado.</Typography>
      </>
    );
  }
<p></p>
  const plan = PlanesSalud.find(p =>
    p.title.trim().toLowerCase() === state.title.trim().toLowerCase()
  );

  if (!plan) {
    return (
      <>
        <Header />
        <Box mt={4} />
        <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>Plan no encontrado.</Typography>
      </>
    );
  }

  return (
    <>
      <Header />
       <Box mt={4} />
      <Box sx={{ px: 4, py: 6 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>{plan.title}</Typography>
        <Typography variant="h6" color="primary" gutterBottom>{plan.precio}</Typography>

        <Typography variant="h5" mt={3}>Cobertura</Typography>
        <ul>{plan.cobertura.map((item, idx) => <li key={idx}>{item}</li>)}</ul>

        <Typography variant="h5" mt={3}>Beneficios</Typography>
        <ul>{plan.beneficios.map((item, idx) => <li key={idx}>{item}</li>)}</ul>

        <Typography variant="h5" mt={3}>Ventajas</Typography>
        <ul>{plan.ventajas.map((item, idx) => <li key={idx}>{item}</li>)}</ul>

        <Typography variant="h6" mt={3}>Público Ideal: {plan.publico}</Typography>

        <Box mt={5}>
          <Formulario plan={plan.title} />
        </Box>
      </Box>
    </>
  );
};

export default CotizarS;
