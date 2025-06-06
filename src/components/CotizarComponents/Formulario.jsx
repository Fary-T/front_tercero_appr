import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';

const Formulario = ({ plan = "Plan Básico Salud" }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    celular: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validar solo letras y espacios para nombre y apellido
    if ((name === 'nombre' || name === 'apellido') && !/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/.test(value)) {
      return;
    }

    // Validar solo números para celular
    if (name === 'celular' && !/^\d*$/.test(value)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);
    // Aquí se enviaría al backend
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: { xs: '90%', sm: 480 },
        bgcolor: '#fff',
        borderRadius: 3,
        p: 4,
        boxShadow: 5,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        color="#25004D"
        textAlign="center"
        sx={{ fontSize: '1.4rem' }}
      >
        Activa tu {plan} de forma rápida y segura
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        sx={{ mb: 1 }}
      >
        Completa este formulario y da el primer paso hacia tu tranquilidad.
      </Typography>

      <TextField
        placeholder="Nombre *"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        fullWidth
        required
        size="small"
      />

      <TextField
        placeholder="Apellido *"
        name="apellido"
        value={formData.apellido}
        onChange={handleChange}
        fullWidth
        required
        size="small"
      />

      <TextField
        placeholder="Correo electrónico *"
        name="correo"
        type="email"
        value={formData.correo}
        onChange={handleChange}
        fullWidth
        required
        size="small"
      />

      <TextField
        placeholder="Celular *"
        name="celular"
        value={formData.celular}
        onChange={handleChange}
        fullWidth
        required
        size="small"
        inputProps={{ maxLength: 10 }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          mt: 2,
          py: 1.2,
          fontWeight: 'bold',
          backgroundColor: '#25004D',
          borderRadius: 2,
          boxShadow: '0px 3px 5px rgba(0,0,0,0.2)',
          ':hover': {
            backgroundColor: '#1a0033',
          },
        }}
      >
        REGISTRARME
      </Button>
    </Box>
  );
};

export default Formulario;
