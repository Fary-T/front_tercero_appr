'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import dayjs from 'dayjs'; // <-- Importación añadida

export const RevicionPagos = () => {
  const [datos, setDatos] = useState([]);
  const [filtrado, setFiltrado] = useState([]);
  const [seguros, setSeguros] = useState([]);
  const [seguroSeleccionado, setSeguroSeleccionado] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://35.172.129.60:3030/pagos');

      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }

      const data = await response.json();
      console.log('Datos recibidos:', data);

      setDatos(data);
      setFiltrado(data);

      const tipos = ['Todos', ...new Set(data.map(d => d.nombre_seguro || 'Desconocido'))];
      setSeguros(tipos);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleFiltro = (seguro) => {
    setSeguroSeleccionado(seguro);
    if (seguro === 'Todos') {
      setFiltrado(datos);
    } else {
      setFiltrado(datos.filter(d => d.nombre_seguro === seguro));
    }
  };

  const formatFecha = (fecha) => {
    return fecha ? dayjs(fecha).format('YYYY-MM-DD') : '---';
  };

  if (loading) return (
    <Box p={3} textAlign="center">
      <CircularProgress />
      <Typography mt={2}>Cargando información...</Typography>
    </Box>
  );

  if (error) return (
    <Box p={3}>
      <Alert severity="error">{error}</Alert>
    </Box>
  );

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Revisión de Pagos de Seguros
      </Typography>

      <FormControl sx={{ mb: 3, minWidth: 240 }}>
        <InputLabel id="filtro-label">Filtrar por tipo de seguro</InputLabel>
        <Select
          labelId="filtro-label"
          value={seguroSeleccionado}
          label="Filtrar por tipo de seguro"
          onChange={(e) => handleFiltro(e.target.value)}
        >
          {seguros.map((seguro, idx) => (
            <MenuItem key={idx} value={seguro}>
              {seguro}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Seguro</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Fecha Contrato</TableCell>
              <TableCell>Fecha Fin</TableCell>
              <TableCell>Fecha de Pago</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Comprobante</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtrado.map((fila, idx) => {
              const pagado = !!fila.fecha_pago;
              return (
                <TableRow
                  key={idx}
                  sx={{
                    backgroundColor: pagado ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)',
                    '&:hover': {
                      backgroundColor: pagado ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)'
                    }
                  }}
                >
                  <TableCell>{fila.nombre_usuario}</TableCell>
                  <TableCell>{fila.nombre_seguro}</TableCell>
                  <TableCell>${fila.precio}</TableCell>
                  <TableCell>{formatFecha(fila.fecha_contrato)}</TableCell>
                  <TableCell>{formatFecha(fila.fecha_fin)}</TableCell>
                  <TableCell>{formatFecha(fila.fecha_pago) || 'Pendiente'}</TableCell>
                  <TableCell>{fila.cantidad || '---'}</TableCell>
                  <TableCell>{fila.comprobante_pago || '---'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

RevicionPagos.propTypes = {};
