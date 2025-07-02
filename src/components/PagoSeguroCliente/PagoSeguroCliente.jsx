'use client';
import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Typography,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { UserContext } from '../../context/UserContext';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

// Modales
import { ModalPagoClientes } from '../Modales/ModalPagoClientes/ModalPagoClientes';
import { ModalReembolsos } from '../Modales/ModalReembolsos/ModalReembolsos';

dayjs.extend(isBetween);

export const PagoSeguroCliente = () => {
  const { usuario } = useContext(UserContext);
  const [pagosRealizados, setPagosRealizados] = useState([]);
  const [pagosEsperados, setPagosEsperados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [idSeguro, setIdSeguro] = useState(null);
  const [precio, setPrecio] = useState(null);

  const [modalPagoAbierto, setModalPagoAbierto] = useState(false);
  const [modalReembolsoAbierto, setModalReembolsoAbierto] = useState(false);

  const abrirModalPago = () => setModalPagoAbierto(true);
  const cerrarModalPago = () => setModalPagoAbierto(false);

  const abrirModalReembolso = () => {
    if (!idSeguro || idSeguro === "undefined") {
      alert("El ID del seguro aún no se ha cargado. Intente nuevamente en unos segundos.");
      return;
    }
    console.log("Abriendo modal con ID seguro:", idSeguro);
    setModalReembolsoAbierto(true);
  };

  const cerrarModalReembolso = () => setModalReembolsoAbierto(false);

  const calcularPagosEsperados = (inicio, fin, tiempoPago, precio) => {
    const lista = [];
    let actual = dayjs(inicio);
    const fechaFin = dayjs(fin);
    const intervalo = parseInt(tiempoPago);

    while (actual.isBefore(fechaFin) || actual.isSame(fechaFin, 'day')) {
      lista.push({
        fecha: actual.format('YYYY-MM-DD'),
        cantidad: precio
      });
      actual = actual.add(intervalo, 'month');
    }

    return lista;
  };

  const cargarPagos = async () => {
    try {
      setLoading(true);
      if (!usuario?.id_usuario) throw new Error('Usuario no identificado');

      const response = await fetch(`https://r4jdf9tl-3030.use.devtunnels.ms/pagos/${usuario.id_usuario}`);
      if (!response.ok) throw new Error('Error al obtener los pagos');

      const data = await response.json();
      if (data.length === 0) throw new Error('No se encontraron pagos para el usuario');

      const { fecha_contrato, fecha_fin, tiempo_pago, precio, id_usuario_seguro } = data[0];
      console.log("ID del seguro cargado desde backend:", id_usuario_seguro); // <-- para depurar
      console.log("Precio cargado desde backend:", precio);

      const pagosConcretados = data.filter(p => p.fecha_pago);
      const esperados = calcularPagosEsperados(fecha_contrato, fecha_fin, tiempo_pago, precio);

      setPagosEsperados(esperados);
      setPagosRealizados(pagosConcretados);
      setIdSeguro(id_usuario_seguro);
      setPrecio(precio);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuario?.id_usuario) {
      cargarPagos();
    }
  }, [usuario]);

  const buscarPago = (fecha) =>
    pagosRealizados.find(p => dayjs(p.fecha_pago).isSame(fecha, 'day'));

  const esFechaActualOPasada = (fecha) => {
    const hoy = dayjs();
    return dayjs(fecha).isSame(hoy, 'day') || dayjs(fecha).isBefore(hoy, 'day');
  };

  const getColorFila = (fecha, pagado) => {
    if (pagado) return 'rgba(0, 255, 0, 0.1)';
    if (esFechaActualOPasada(fecha)) return 'rgba(0, 255, 0, 0.1)';
    return 'rgba(255, 0, 0, 0.1)';
  };

  if (loading) {
    return (
      <Box p={3} textAlign="center">
        <CircularProgress />
        <Typography>Cargando pagos...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Pagos del Seguro de Vida y Salud
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" color="primary" onClick={abrirModalPago}>
          Registrar Pago
        </Button>

        {idSeguro && (
          <Button variant="outlined" color="secondary" onClick={abrirModalReembolso}>
            Solicitar Reembolso
          </Button>
        )}
      </Box>

      <ModalPagoClientes
        open={modalPagoAbierto}
        onClose={cerrarModalPago}
        onPagoExitoso={cargarPagos}
        id_usuario={usuario.id_usuario}
        pagosEsperados={pagosEsperados}
        pagosRealizados={pagosRealizados}
        id_usuario_seguro_per={idSeguro}
        cantidad={precio}
      />

      <ModalReembolsos
        open={modalReembolsoAbierto}
        onClose={cerrarModalReembolso}
        onReembolsoExitoso={cargarPagos}
        id_usuario_per={usuario.id_usuario}
        id_usuario_seguro_per={idSeguro}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha Esperada</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Comprobante</TableCell>
              <TableCell>Cantidad</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagosEsperados.map((pago, index) => {
              const pagoRealizado = buscarPago(pago.fecha);
              const pagado = Boolean(pagoRealizado);
              const color = getColorFila(pago.fecha, pagado);

              return (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: color,
                    '&:hover': {
                      backgroundColor: pagado
                        ? 'rgba(0, 255, 0, 0.2)'
                        : 'rgba(255, 0, 0, 0.2)',
                    }
                  }}
                >
                  <TableCell>{pago.fecha}</TableCell>
                  <TableCell>{pagado ? 'Pagado' : 'Pendiente'}</TableCell>
                  <TableCell>{pagoRealizado?.comprobante_pago || '---'}</TableCell>
                  <TableCell>
                    {pagado
                      ? `$${pagoRealizado.cantidad}`
                      : `$${pago.cantidad}`}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

PagoSeguroCliente.propTypes = {};
