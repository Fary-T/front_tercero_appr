import React, { useRef, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import emailjs from "emailjs-com";

const Formulario = ({ plan = "Plan Básico Salud" }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    cedula: '',
    username: '',
    password: '',
    activo: 1,
    tipo: 2,
    rol: 'cliente'
  });
  const res = useRef();
  const [correoError, setCorreoError] = useState('');
  const [correoExiste, setCorreoExiste] = useState(false);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Validar letras
    if ((name === 'nombre' || name === 'apellido') && !/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/.test(value)) {
      return;
    }

    // Validar números
    if ((name === 'telefono' || name === 'cedula') && !/^\d*$/.test(value)) {
      return;
    }

    // Validar formato y existencia de correo
    if (name === 'correo') {
      const regexCorreo = /^[^\s@]+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com)$/i;

      if (!regexCorreo.test(value)) {
        setCorreoError('Correo inválido. Usa gmail, hotmail, outlook o yahoo.');
        setCorreoExiste(false);
      } else {
        setCorreoError('');
    }
  }

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Iniciamos envio');
  console.log(formData);
  setFormData({ ...formData, password: formData.cedula });
  if (formData.cedula.length !== 10) {
    alert('La cédula debe tener exactamente 10 dígitos.');
    return;
  }

  if (formData.telefono.length !== 10) {
    alert('El teléfono debe tener exactamente 10 dígitos.');
    return;
  }

  try {
    console.log('dentro del try');
    const response = await fetch('http://localhost:3030/usuario/agregar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    console.log("antes del envio correo: ",res.current);
    //const emplay = {cedula:formData.cedula, correo:formData.correo, username:formData.username, nombre:formData.nombre};
    emailjs.sendForm("service_cquby3k", "template_32dzbrp", res.current , "5Uzo8zQ0Bqi8lpb_w").then(
      (result)=>{console.log ("correo enviado exitosamente")},
      (error)=>{console.log("existio un error")}
    )

    if (!response.ok) {
      throw new Error('Error al registrar el usuario');
    }

    const data = await response.json();
    alert('¡Usuario registrado exitosamente!');
    console.log(data);

    // Limpiar
    setFormData({
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      cedula: '',
      username: '',
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    alert('Hubo un error al registrar.');
    console.log(formData);
  }
};

return (
  <Box
  ref={res}  
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
      error={!!correoError}
      helperText={correoError}
    />

    <TextField
      placeholder="Teléfono *"
      name="telefono"
      value={formData.telefono}
      onChange={handleChange}
      fullWidth
      required
      size="small"
      inputProps={{ maxLength: 10 }}
      error={formData.telefono.length > 0 && formData.telefono.length !== 10}
      helperText={
        formData.telefono.length > 0 && formData.telefono.length !== 10
          ? 'El teléfono debe tener exactamente 10 dígitos'
          : ''
      }
    />

    <TextField
      placeholder="Cédula *"
      name="cedula"
      value={formData.cedula}
      onChange={handleChange}
      fullWidth
      required
      size="small"
      inputProps={{ maxLength: 10 }}
      error={formData.cedula.length > 0 && formData.cedula.length !== 10}
      helperText={
        formData.cedula.length > 0 && formData.cedula.length !== 10
          ? 'La cédula debe tener exactamente 10 dígitos'
          : ''
      }
    />

    <TextField
      placeholder="Username *"
      name="username"
      value={formData.username}
      onChange={handleChange}
      fullWidth
      required
      size="small"
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
