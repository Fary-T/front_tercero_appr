import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import dayjs from 'dayjs';

export const ModalPagoClientes = ({
  open,
  onClose,
  onPagoExitoso,
  id_usuario,
  pagosEsperados,
  pagosRealizados
}) => {
  const [fechaPago, setFechaPago] = useState(dayjs().format('YYYY-MM-DD'));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetModal = () => {
    setFechaPago(dayjs().format('YYYY-MM-DD'));
    setError(null);
  };

  useEffect(() => {
    if (open) resetModal();
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

  const handleRegistrarPago = async () => {
    setError(null);

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

      const response = await fetch('http://localhost:3030/pagos/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario,
          fecha_pago: fechaPago,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar el pago.');
      }

      onPagoExitoso();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
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
        />

        {error && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button
          onClick={handleRegistrarPago}
          disabled={loading}
          variant="contained"
          color="primary"
        >
          {loading ? 'Registrando...' : 'Registrar Pago'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalPagoClientes.propTypes = {};