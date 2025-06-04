import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography
} from '@mui/material';

export const ModalEditarPoliza = ({ open, onClose, poliza, onGuardar }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    tiempo_pago: '',
    descripcion: '',
    tipo: ''
  });

  const [requisitos, setRequisitos] = useState([]);
  const [errors, setErrors] = useState({});

  const cuestionarioSalud = [
    "¿Fuma actualmente?",
    "¿Tiene enfermedades crónicas?",
    "¿Ha sido hospitalizado en los últimos 5 años?",
    "¿Toma medicamentos de forma regular?"
  ];

  const requisitosVida = [
    "Cédula de identidad",
    "Papeleta de votación",
    "Recibo de luz",
    "Cuestionario de salud",
    "Subida de historial clínico",
    "Subida de historial de ingresos",
    "Pago inicial"
  ];

  const requisitosSalud = [
    "Cédula de identidad",
    "Pago de luz",
    "Papeleta de votación",
    "Tipo de sangre",
    "Historial clínico",
    "Cuestionario de salud",
    "Certificado de ingresos",
    "Pago inicial"
  ];

  useEffect(() => {
    if (poliza) {
      const tipoNumerico = parseInt(poliza.tipo);
      const requisitosPorTipo = tipoNumerico === 0 ? requisitosVida : requisitosSalud;
      setFormData({
        nombre: poliza.nombre || '',
        precio: poliza.precio || '',
        tiempo_pago: poliza.tiempo_pago || '',
        descripcion: poliza.descripcion || '',
        tipo: tipoNumerico
      });
      setRequisitos(requisitosPorTipo);
    }
  }, [poliza]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'tipo') {
      const tipoNumerico = parseInt(value);
      const nombre = tipoNumerico === 0 ? 'Seguro de Vida' : 'Seguro de Salud';

      setFormData(prev => ({
        ...prev,
        tipo: tipoNumerico,
        nombre
      }));

      setRequisitos(tipoNumerico === 0 ? requisitosVida : requisitosSalud);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.tipo && formData.tipo !== 0) newErrors.tipo = "Campo requerido";
    if (!formData.precio) newErrors.precio = "Campo requerido";
    if (!formData.tiempo_pago) newErrors.tiempo_pago = "Campo requerido";
    if (!formData.descripcion) newErrors.descripcion = "Campo requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGuardar = async () => {
    if (!validate()) return;

    const { nombre, precio, tiempo_pago, descripcion, tipo } = formData;

    try {
      const response = await fetch(`http://localhost:3030/seguro/editar/${poliza.id_seguro}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre,
          precio: parseFloat(precio),
          tiempo_pago: parseInt(tiempo_pago),
          descripcion,
          tipo
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Póliza actualizada correctamente");
        onGuardar?.();
        onClose();
      } else {
        alert(data.error || "Error al actualizar la póliza");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al servidor");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Póliza</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre del Seguro"
              name="nombre"
              value={formData.nombre}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Precio"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              error={!!errors.precio}
              helperText={errors.precio}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Tiempo de Pago (meses)"
              name="tiempo_pago"
              value={formData.tiempo_pago}
              onChange={handleChange}
              error={!!errors.tiempo_pago}
              helperText={errors.tiempo_pago}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              error={!!errors.descripcion}
              helperText={errors.descripcion}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Tipo de Póliza"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              error={!!errors.tipo}
              helperText={errors.tipo}
            >
              <MenuItem value={0}>Vida</MenuItem>
              <MenuItem value={1}>Salud</MenuItem>
            </TextField>
          </Grid>

          {/* Mostrar requisitos dinámicos */}
          {requisitos.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Requisitos necesarios:
              </Typography>
              <FormGroup>
                {requisitos.map((req, index) => (
                  <FormControlLabel
                    key={index}
                    control={<Checkbox defaultChecked={false} />}
                    label={req}
                  />
                ))}
              </FormGroup>
              {requisitos.includes("Cuestionario de salud") && (
                <>
                  <Typography variant="subtitle2" sx={{ mt: 2 }}>Cuestionario de salud</Typography>
                  <FormGroup>
                    {cuestionarioSalud.map((q, idx) => (
                      <FormControlLabel
                        key={idx}
                        control={<Checkbox />}
                        label={q}
                      />
                    ))}
                  </FormGroup>
                </>
              )}
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" color="primary" onClick={handleGuardar}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalEditarPoliza.propTypes = {};