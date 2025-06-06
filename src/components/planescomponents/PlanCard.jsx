import React from 'react';
import { Typography, Paper, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FavoriteIcon from '@mui/icons-material/Favorite';

const PlanCard = ({ plan }) => {
  const { title, precio, puntos, tipo } = plan;
  const navigate = useNavigate();

  const handleInfo = () => {
    const ruta = tipo === 'salud' ? '/CotizarS' : '/CotizarV';
    navigate(ruta, { state: { plan } });
  };

  const estilos = {
    salud: {
      fondo: '#EFE4FA',
      boton: '#25004D',
      botonHover: '#1A0033',
    },
    vida: {
      fondo: '#FFF8E1',
      boton: '#FFCC00',
      botonHover: '#e6b800',
    },
  };

  const icon = tipo === 'salud'
    ? <LocalHospitalIcon fontSize="large" sx={{ color: '#25004D' }} />
    : <FavoriteIcon fontSize="large" sx={{ color: '#FFCC00' }} />;

  return (
    <Paper elevation={6} sx={{ p: 3, bgcolor: estilos[tipo].fondo, borderRadius: 3 }}>
      <Box display="flex" justifyContent="center" mb={2}>
        {icon}
      </Box>

      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {title}
      </Typography>

      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        {precio}
      </Typography>

      {puntos.map((punto, i) => (
        <Typography key={i} variant="body2" sx={{ textAlign: 'left' }}>
          • {punto}
        </Typography>
      ))}

      <Button
        onClick={handleInfo}
        sx={{
          mt: 2,
          backgroundColor: estilos[tipo].boton,
          color: tipo === 'vida' ? '#000' : '#fff',
          ':hover': {
            backgroundColor: estilos[tipo].botonHover,
          },
        }}
        fullWidth
        variant="contained"
      >
        Más información
      </Button>
    </Paper>
  );
};

export default PlanCard;
