import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button
} from '@mui/material';

export const Modal = ({ open, onClose, onGuardar }) => {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    onGuardar(formData); // llama a la función del padre
    setFormData({ nombre: '', correo: '', telefono: '' }); // limpia
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Agregar Usuario</DialogTitle>
      <DialogContent>
        <TextField fullWidth margin="dense" label="Correo" name="correo" value={formData.correo} onChange={handleChange} />
        <TextField fullWidth margin="dense" label="Username" name="username" value={formData.username} onChange={handleChange} />
        <TextField fullWidth margin="dense" label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
        <TextField fullWidth margin="dense" label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
        <TextField fullWidth margin="dense" label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} />
        <TextField fullWidth margin="dense" label="Tipo" name="tipo" value={formData.tipo} onChange={handleChange} />
        <TextField fullWidth margin="dense" label="Activo" name="activo" value={formData.activo} onChange={handleChange} />
        <TextField fullWidth margin="dense" label="Cédula" name="cedula" value={formData.cedula} onChange={handleChange} />
        <TextField fullWidth margin="dense" label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} />
        <TextField fullWidth margin="dense" label="Rol" name="rol" value={formData.rol} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleGuardar} variant="contained" color="primary">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

Modal.propTypes = {};