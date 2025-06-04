import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  useMediaQuery,
  useTheme
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

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (usuario && open) {
      setFormData({ ...usuario });
    }
  }, [usuario, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validarCampos = () => {
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const soloNumeros10 = /^\d{10}$/;
    const correoValido = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo|icloud|live|protonmail|zoho|gmx|aol|mail)\.(com|es|net|org|co|info|me|us)$/i;

    if (!correoValido.test(formData.correo)) {
      alert("Correo inválido. Solo se permiten dominios como gmail, hotmail, yahoo, etc., y terminaciones como .com, .es, .net...");
      return false;
    }

    if (!formData.username.trim()) {
      alert("El nombre de usuario es requerido.");
      return false;
    }

    if (!formData.password.trim()) {
      alert("La contraseña es requerida.");
      return false;
    }

    if (!soloLetras.test(formData.nombre)) {
      alert("El nombre solo debe contener letras.");
      return false;
    }

    if (!soloLetras.test(formData.apellido)) {
      alert("El apellido solo debe contener letras.");
      return false;
    }

    if (!formData.tipo.trim()) {
      alert("El campo 'tipo' es requerido.");
      return false;
    }

    if (!["1", "0"].includes(formData.activo)) {
      alert("El campo 'activo' debe ser 1 (activo) o 0 (inactivo).");
      return false;
    }

    if (!soloNumeros10.test(formData.cedula)) {
      alert("La cédula debe contener exactamente 10 números.");
      return false;
    }

    if (!soloNumeros10.test(formData.telefono)) {
      alert("El teléfono debe contener exactamente 10 números.");
      return false;
    }

    if (!formData.rol.trim()) {
      alert("El rol es requerido.");
      return false;
    }

    return true;
  };

  const handleGuardar = async () => {
    if (!validarCampos()) return;

    try {
      const response = await fetch("http://localhost:3030/usuario/editar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Usuario editado correctamente");
        onClose();
        if (typeof onGuardar === 'function') onGuardar();
      } else {
        alert(data.error || "Error al editar usuario");
      }
    } catch (error) {
      console.error("Error al editar usuario:", error);
      alert("No se pudo editar el usuario");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Usuario</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Correo" name="correo" value={formData.correo} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Cédula" name="cedula" value={formData.cedula} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Username" name="username" value={formData.username} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Rol" name="rol" value={formData.rol} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Tipo" name="tipo" value={formData.tipo} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Activo (1 o 0)" name="activo" value={formData.activo} onChange={handleChange} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleGuardar} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalEditarUsuario.propTypes = {};