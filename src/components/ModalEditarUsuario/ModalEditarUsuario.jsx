import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  FormHelperText
} from '@mui/material';

export const ModalEditarUsuario = ({ open, onClose, usuario, onGuardar }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    username: '',
    password: '',
    apellido: '',
    tipo: '',
    activo: '',
    cedula: '',
    rol: ''
  });

  const [errors, setErrors] = useState({}); // Estado para los mensajes de error

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (usuario) {
      setFormData(usuario);
      setErrors({}); // Limpiar errores al cargar usuario
    }
  }, [usuario]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' })); // Limpiar el error al cambiar el valor
  };

 const validarCampos = () => {
  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const soloNumeros10 = /^\d{10}$/;
  const newErrors = [];
  
  if (!formData.username.trim()) {
    newErrors.push("El nombre de usuario es requerido.");
  }

  if (!formData.password.trim()) {
    newErrors.push("La contraseña es requerida.");
  }

  if (!soloLetras.test(formData.nombre)) {
    newErrors.push("El nombre solo debe contener letras.");
  }

  if (!soloLetras.test(formData.apellido)) {
    newErrors.push("El apellido solo debe contener letras.");
  }


  if (!soloNumeros10.test(formData.cedula)) {
    newErrors.push("La cédula debe contener exactamente 10 números.");
  }

  if (!soloNumeros10.test(formData.telefono)) {
    newErrors.push("El teléfono debe contener exactamente 10 números.");
  }
  if (!formData.correo.includes('@') || !formData.correo.trim()) {
    newErrors.push("El correo debe contener un '@' y no puede estar vacío.");
  }

  return newErrors; // Devuelve un array de errores
};

const handleGuardar = async () => {
  const validationErrors = validarCampos();
  if (validationErrors.length > 0) {
    alert(validationErrors.join('\n')); // Muestra una alerta con todos los errores
    return; // No continuar si hay errores
  }

  try {
    const response = await fetch(`http://localhost:3030/usuario/editar/${usuario.id_usuario}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok) {
      alert('Usuario editado correctamente');
      onGuardar(); // actualizar lista
      onClose();   // cerrar modal
    } else {
      alert(data.mensaje || 'Error al editar usuario');
    }
  } catch (error) {
    console.error(error);
    alert('Error de conexión');
  }
};


  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <Typography variant="h6" mb={2}>Editar Usuario</Typography>

        <TextField
          label="Correo"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.username} // Indica si hay un error
        />
        {errors.username && <FormHelperText error>{errors.username}</FormHelperText>} {/* Mensaje de error */}

        <TextField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.password} // Indica si hay un error
        />
        {errors.password && <FormHelperText error>{errors.password}</FormHelperText>} {/* Mensaje de error */}

        <TextField
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.nombre} // Indica si hay un error
        />
        {errors.nombre && <FormHelperText error>{errors.nombre}</FormHelperText>} {/* Mensaje de error */}

        <TextField
          label="Apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.apellido} // Indica si hay un error
        />
        {errors.apellido && <FormHelperText error>{errors.apellido}</FormHelperText>} {/* Mensaje de error */}

        <TextField
          label="Tipo"
          name="tipo"
          value={formData.tipo}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.tipo} // Indica si hay un error
        />
        {errors.tipo && <FormHelperText error>{errors.tipo}</FormHelperText>} {/* Mensaje de error */}

        <TextField
          label="Activo"
          name="activo"
          value={formData.activo}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.activo} // Indica si hay un error
        />
        {errors.activo && <FormHelperText error>{errors.activo}</FormHelperText>} {/* Mensaje de error */}

        <TextField
          label="Cédula"
          name="cedula"
          value={formData.cedula}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.cedula} // Indica si hay un error
        />
        {errors.cedula && <FormHelperText error>{errors.cedula}</FormHelperText>} {/* Mensaje de error */}

        <TextField
          label="Teléfono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.telefono} // Indica si hay un error
        />
        {errors.telefono && <FormHelperText error>{errors.telefono}</FormHelperText>} {/* Mensaje de error */}

        <TextField
          label="Rol"
          name="rol"
          value={formData.rol}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleGuardar}>Guardar</Button>
        </Box>
      </Box>
    </Modal>
  );
};

ModalEditarUsuario.propTypes = {};
