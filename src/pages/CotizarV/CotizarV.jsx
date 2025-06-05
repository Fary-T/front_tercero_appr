import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography,Grid,Paper } from '@mui/material';
import Header from '../../components/planescomponents/Header';
import Formulario from '../../components/CotizarComponents/Formulario';
import PlanesVida from '../../components/CotizarComponents/PlanesVida';


const CotizarV = () => {
 const { state } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!state || !state.title) {
    return (
      <>
        <Header />
         <Box mt={4} />
        <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>Plan no encontrado.</Typography>
      </>
    );
  }

  const plan = PlanesVida.find(p => p.title === state.title);

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
       <Box sx={{ backgroundColor: '#F4F1F8', py: 6, px: { xs: 2, md: 8 }, minHeight: '100vh' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 4, bgcolor: '#fff', borderRadius: 3 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom color="#25004D">{plan.title}</Typography>
              <Typography variant="h6" color="primary" gutterBottom>{plan.precio}</Typography>

              <Typography variant="h5" mt={3} color="#25004D">Cobertura</Typography>
              <ul>{plan.cobertura.map((item, idx) => <li key={idx}>{item}</li>)}</ul>

              <Typography variant="h5" mt={3} color="#25004D">Beneficios</Typography>
              <ul>{plan.beneficios.map((item, idx) => <li key={idx}>{item}</li>)}</ul>

              <Typography variant="h5" mt={3} color="#25004D">Ventajas</Typography>
              <ul>{plan.ventajas.map((item, idx) => <li key={idx}>{item}</li>)}</ul>

              <Typography variant="subtitle1" mt={3}><strong>Público Ideal:</strong> {plan.publico}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, bgcolor: '#fff', borderRadius: 3 }}>
              <Formulario plan={plan.title} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default CotizarV;
