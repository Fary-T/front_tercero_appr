import React from 'react';
import {Box,Typography,TextField,Checkbox,FormControlLabel,Button} from '@mui/material';
import Header from '../planescomponents/Header';

const Formulario = () => {
  return (
     <>
      <Header />
    <Box
      sx={{
        width: 400,
        bgcolor: '#fff',
        boxShadow: 24,
        borderRadius: 2,
        p: 4,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Cotiza tu Seguro de Vida en línea
      </Typography>
      <Typography variant="body2" mb={2}>
        Completa este formulario para obtener un presupuesto personalizado y descubre cómo proteger tu futuro.
      </Typography>
      <TextField fullWidth label="Nombre" margin="normal" required />
      <TextField fullWidth label="Apellido" margin="normal" required />
      <TextField fullWidth label="Correo electrónico" margin="normal" required />
      <TextField fullWidth label="Celular" margin="normal" required />
      <FormControlLabel
        control={<Checkbox required />}
        label={
          <Typography variant="caption">
            He leído y acepto la Cláusula de Protección de Datos
          </Typography>
        }
      />
      <Button fullWidth variant="contained" sx={{ mt: 2, backgroundColor: '#25004D' }}>
        Cotiza ahora
      </Button>
    </Box>
     </>
  );
};

export default Formulario;
