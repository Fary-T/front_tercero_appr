import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert,
  Box,
  IconButton,
  CircularProgress
} from '@mui/material';
import dayjs from 'dayjs';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export const ModalPagoClientes = ({
  open,
  onClose,
  onPagoExitoso,
  id_usuario,
  pagosEsperados,
  pagosRealizados,
  id_usuario_seguro_per,
  cantidad
}) => {
  const [fechaPago, setFechaPago] = useState(dayjs().format('YYYY-MM-DD'));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const resetModal = () => {
    setFechaPago(dayjs().format('YYYY-MM-DD'));
    setError(null);
    setFile(null);
    setLoading(false);
  };

  useEffect(() => {
    if (open) resetModal();
    console.log('precio:', cantidad);
  }, [open]);

  const yaFuePagado = (fecha) => {
    return pagosRealizados.some((p) =>
      dayjs(p.fecha_pago).isSame(fecha, 'day')
    );
  };

  const estaEnMesActual = (fecha) => {
    const hoy = dayjs();
    const f = dayjs(fecha);
    return hoy.month() === f.month() && hoy.year() === f.year();
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleRegistrarPago = async () => {
    setError(null);

    // Validación de campos requeridos
    if (!file) {
      setError('Debe seleccionar un archivo de comprobante.');
      return;
    }

    const esperado = pagosEsperados.find((p) =>
      dayjs(p.fecha).isSame(fechaPago, 'day')
    );

    if (!esperado) {
      setError('La fecha seleccionada no corresponde a una fecha esperada de pago.');
      return;
    }

    if (!estaEnMesActual(fechaPago)) {
      setError('Solo se pueden registrar pagos dentro del mes actual.');
      return;
    }

    if (yaFuePagado(fechaPago)) {
      setError('El pago ya fue registrado para esta fecha.');
      return;
    }

    try {
      setLoading(true);

      // Preparar FormData
      const formData = new FormData();
      formData.append("archivo", file);
      formData.append("id_usuario", id_usuario);
      formData.append("fecha_pago", fechaPago);
      formData.append("id_usuario_seguro_per", id_usuario_seguro_per);
      formData.append("precio", cantidad);

      // Debug: Mostrar datos que se enviarán
      console.log('Datos enviados:');
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Enviar petición
      const response = await fetch('http://localhost:3030/documentos/comprobante', {
        method: 'POST',
        body: formData
      });

      // Manejar respuesta
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Error al registrar el pago');
      }

      if (result.estado !== "OK") {
        throw new Error(result.mensaje || 'Error al procesar el comprobante');
      }

      onPagoExitoso();
      onClose();
    } catch (err) {
      console.error('Error en handleRegistrarPago:', err);
      setError(err.message || 'Error al registrar el pago. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Registrar Pago</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Solo puede registrar pagos correspondientes al mes actual y no registrados aún.
        </Typography>

        <TextField
          label="Fecha de pago"
          type="date"
          fullWidth
          value={fechaPago}
          onChange={(e) => setFechaPago(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
          disabled={loading}
        />

        <Box sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          p: 2,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: '#f9f9f9',
          transition: 'background-color 0.3s',
          '&:hover': { bgcolor: '#f0f0f0' },
          mb: 2
        }}>
          <input
            type="file"
            accept="application/pdf, image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="upload-file"
            disabled={loading}
          />
          <label htmlFor="upload-file" style={{ cursor: 'pointer' }}>
            <IconButton component="span" color="primary" disabled={loading}>
              <CloudUploadIcon fontSize="large" />
            </IconButton>
            <Typography variant="body2" mt={1}>
              {file ? file.name : 'Selecciona o arrastra tu comprobante aquí'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Formatos aceptados: PDF, JPG, PNG
            </Typography>
          </label>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          color="secondary"
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleRegistrarPago}
          disabled={loading || !file}
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Registrando...' : 'Registrar Pago'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};