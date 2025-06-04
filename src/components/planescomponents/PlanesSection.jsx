import React from 'react';
import { Grid, Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Planes = () => {
  const navigate = useNavigate();

  const irACotizar = () => {
    navigate('/Cotizar'); // Navegación sin recargar
  };
  return (
    <Box sx={{ textAlign: 'center', px: 2, py: 5 }}>
      <br />
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Nuestros Planes
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {[{
          title: 'Plan de Salud',
          puntos: ['Atención médica rápida', 'Cobertura familiar', 'Descuentos en farmacias']
        }, {
          title: 'Plan de Vida',
          puntos: ['Protección financiera', 'Apoyo a tus seres queridos', 'Planes flexibles']
        }].map((plan, idx) => (
          <Grid item xs={12} md={6} key={idx}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>{plan.title}</Typography>
              {plan.puntos.map((punto, i) => (
                <Typography key={i} variant="body1">✔ {punto}</Typography>
              ))}
              <Button
                onClick={() => {
                  if (plan.title === 'Plan de Salud') {
                    navigate('/CotizarS');
                  } else if (plan.title === 'Plan de Vida') {
                    navigate('/CotizarV');
                  }
                }}
                sx={{ mt: 2, backgroundColor: '#25004D' }}
                variant="contained"
              >
                Más información
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Planes;