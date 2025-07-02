'use client';
import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { ModalSubirArchivoCliente } from '../Modales/ModalSubirArchivoCliente/ModalSubirArchivoCliente';
import { UserContext } from '../../context/UserContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const SubirArchivoCliente = () => {
  const [requisitos, setRequisitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [requisitoActual, setRequisitoActual] = useState(null);
  const [seguroInfo, setSeguroInfo] = useState(null);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [mostrarAlertaCompletado, setMostrarAlertaCompletado] = useState(false);
  const { usuario } = useContext(UserContext);

  const todosCompletados = requisitos.length > 0 && requisitos.every(req => req.estado === 1);

  const cargarRequisitosUsuario = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!usuario?.id_usuario) {
        throw new Error('No se pudo identificar al usuario');
      }

      const response = await fetch(`http://35.172.129.60:3030/requisitos/${usuario.id_usuario}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener los requisitos: ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        setSeguroInfo(null);
        setRequisitos([]);
        throw new Error('No se encontraron requisitos para tu seguro');
      }

      const primerRegistro = data[0];
      if (!primerRegistro) {
        throw new Error('Datos de requisitos incompletos');
      }

      setSeguroInfo({
        id_seguro: primerRegistro.id_seguro,
        id_usuario_seguro: primerRegistro.id_usuario_seguro,
        nombre: primerRegistro.nombre_seguro || 'Sin nombre',
        precio: primerRegistro.precio || 0,
        tiempo_pago: primerRegistro.tiempo_pago || 'No especificado',
        descripcion: primerRegistro.descripcion || 'Sin descripción'
      });

      setRequisitos(data.map(item => ({
        id: item.id_requisito, 
        nombre: item.nombre_requisito || 'Sin nombre',
        detalle: item.detalle || 'Sin detalle',
        estado: item.estado || 0
      })));

    } catch (err) {
      console.error('Error al cargar requisitos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuario?.id_usuario) {
      cargarRequisitosUsuario();
    }
  }, [usuario]);

  const manejarClickArchivos = (requisito) => {
    if (!usuario?.cedula) {
      setError('Complete su información de cédula en su perfil');
      return;
    }
    setRequisitoActual(requisito);
    setModalAbierto(true);
  };

  const cerrarModal = (recargar = false) => {
    setModalAbierto(false);
    setRequisitoActual(null);
    if (recargar) {
      cargarRequisitosUsuario();
    }
  };

  const obtenerColorEstado = (estado) => {
    return estado === 1 ? 'success' : 'error';
  };

  const obtenerTextoEstado = (estado) => {
    return estado === 1 ? 'Completado' : 'Pendiente';
  };

  const handleUploadSuccess = (requisitoId, fileName) => {
    setRequisitos(prevRequisitos =>
      prevRequisitos.map(req =>
        req.id === requisitoId
          ? { ...req, estado: 1 }
          : req
      )
    );
    cerrarModal(false);
  };

  const handleEnviarRequisitos = () => {
    if (!aceptaTerminos) {
      setError('Debe aceptar los términos y condiciones para continuar');
      return;
    }
    setMostrarAlertaCompletado(true);
  };

  const cerrarAlertaCompletado = () => {
    setMostrarAlertaCompletado(false);
  };

  if (loading) {
    return (
      <Box p={3} display="flex" flexDirection="column" alignItems="center">
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Cargando requisitos...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={cargarRequisitosUsuario}>
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Gestión de Requisitos de Seguro
      </Typography>

      {seguroInfo && (
        <>
          <Typography variant="h6" gutterBottom>
            Seguro: {seguroInfo.nombre} - {seguroInfo.descripcion}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Precio: ${seguroInfo.precio} - Tiempo de pago: {seguroInfo.tiempo_pago}
          </Typography>
        </>
      )}

      {requisitos.length > 0 ? (
        <>
          <TableContainer component={Paper} elevation={3} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Requisito</TableCell>
                  <TableCell>Detalle</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requisitos.map((requisito) => (
                  <TableRow
                    key={requisito.id}
                    sx={{
                      backgroundColor: requisito.estado === 1 ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                      '&:hover': {
                        backgroundColor: requisito.estado === 1 ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)'
                      }
                    }}
                  >
                    <TableCell>{requisito.nombre}</TableCell>
                    <TableCell>{requisito.detalle}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color={obtenerColorEstado(requisito.estado)}
                        size="small"
                      >
                        {obtenerTextoEstado(requisito.estado)}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => manejarClickArchivos(requisito)}
                        disabled={requisito.estado === 1}
                      >
                        Subir Archivo
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {todosCompletados && (
            <Box sx={{ mt: 3, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={aceptaTerminos}
                    onChange={(e) => setAceptaTerminos(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography>
                    Acepto los términos y condiciones del seguro{' '}
                    <CheckCircleIcon color="success" sx={{ verticalAlign: 'middle', ml: 1 }} />
                  </Typography>
                }
              />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEnviarRequisitos}
                  disabled={!aceptaTerminos}
                >
                  Enviar Requisitos Completados
                </Button>
              </Box>
            </Box>
          )}
        </>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          No se encontraron requisitos para mostrar.
        </Alert>
      )}

      <ModalSubirArchivoCliente
        open={modalAbierto}
        onClose={() => cerrarModal(false)}
        requisito={requisitoActual}
        idUsuarioSeguro={seguroInfo?.id_usuario_seguro}
        nombreSeguro={seguroInfo?.nombre}
        userData={usuario}
        onUploadSuccess={handleUploadSuccess}
      />

      <Dialog open={mostrarAlertaCompletado} onClose={cerrarAlertaCompletado}>
        <DialogTitle>¡Requisitos Completados!</DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mb: 2 }}>
            Todos los requisitos para tu seguro han sido completados correctamente.
          </Alert>
          <Typography>
            Hemos recibido toda la documentación necesaria. Nuestro equipo revisará los archivos y te notificará sobre el siguiente paso.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarAlertaCompletado} color="primary" autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

SubirArchivoCliente.propTypes = {};