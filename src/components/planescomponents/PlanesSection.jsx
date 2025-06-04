import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import PlanCard from './PlanCard';

const Planes = () => {
  const planesSalud = [
    {
      tipo: 'salud',
      title: 'Plan Básico Salud',
      precio: '$20/mes',
      puntos: ['Consultas médicas generales', 'Descuentos en farmacia', 'Red de clínicas locales']
    },
    {
      tipo: 'salud',
      title: 'Plan Familiar Salud',
      precio: '$45/mes',
      puntos: ['Cobertura familiar completa', 'Atención pediátrica', 'Urgencias 24/7']
    },
    {
      tipo: 'salud',
      title: 'Plan Premium Salud',
      precio: '$70/mes',
      puntos: ['Hospitalización incluida', 'Chequeos anuales gratis', 'Atención internacional']
    },
  ];

  const planesVida = [
    {
      tipo: 'vida',
      title: 'Plan Vida Esencial',
      precio: '$15/mes',
      puntos: ['Cobertura por fallecimiento', 'Asistencia inmediata', 'Sin exámenes médicos']
    },
    {
      tipo: 'vida',
      title: 'Plan Vida Plus',
      precio: '$30/mes',
      puntos: ['Cobertura extendida', 'Indemnización por accidentes', 'Apoyo psicológico']
    },
    {
      tipo: 'vida',
      title: 'Plan Vida Integral',
      precio: '$50/mes',
      puntos: ['Ahorro a largo plazo', 'Beneficios por invalidez', 'Cobertura global']
    },
  ];

  return (
    <Box sx={{ textAlign: 'center', px: 3, py: 6, bgcolor: '#F4F1F8' }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom color="#25004D">
        Nuestros Planes
      </Typography>
      <Typography variant="subtitle1" mb={4} color="#444">
        Elige el plan que mejor se adapte a tus necesidades
      </Typography>

      {/* Planes de Salud */}
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mt: 6, color: '#25004D' }}>
        Planes de Salud
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {planesSalud.map((plan, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <PlanCard {...plan} />
          </Grid>
        ))}
      </Grid>

      {/* Planes de Vida */}
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mt: 8, color: '#FFCC00' }}>
        Planes de Vida
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {planesVida.map((plan, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <PlanCard {...plan} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Planes;
