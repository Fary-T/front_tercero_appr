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
  TextField,
  CircularProgress
} from '@mui/material';
import { ModalSubirArchivoCliente } from '../Modales/ModalSubirArchivoCliente/ModalSubirArchivoCliente';
import { UserContext, useUser } from '../../context/UserContext';

export const SubirArchivoCliente = () => {
  const [requisitos, setRequisitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [requisitoActual, setRequisitoActual] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [idSeguro, setIdSeguro] = useState('');
  let id_usuario_seguro_per = 0;
  const {usuario, setUsuario} = useContext(UserContext);

  const cargarRequisitos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3030/requisitos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_seguro: idSeguro }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener los requisitos');
      }

      const data = await response.json();
      setRequisitos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idSeguro) {
      cargarRequisitos();
    }
  }, [idSeguro]);

  const manejarClickArchivos = (requisito) => {
    setRequisitoActual(requisito);
    setModalAbierto(true);
  };

  const cerrarModal = () => setModalAbierto(false);

  const handleArchivoChange = (event) => {
    setArchivo(event.target.files[0]);
  };

  const handleConfirmarSubida = () => {
    if (archivo) {
      const requisitosActualizados = requisitos.map(req => 
        req.id_seguro_requisito === requisitoActual.id_seguro_requisito 
          ? { ...req, estado: 1 }
          : req
      );
      setRequisitos(requisitosActualizados);
      cerrarModal();
    }
  };

  const obtenerColorEstado = (estado) => {
    return estado === 1 ? 'success' : 'error';
  };

  const obtenerTextoEstado = (estado) => {
    return estado === 1 ? 'Completado' : 'Pendiente';
  };

  if (loading && !idSeguro) {
    return (
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          Gestión de Requisitos de Seguro
        </Typography>
        <TextField
          fullWidth
          label="ID del Seguro"
          variant="outlined"
          value={idSeguro}
          onChange={(e) => setIdSeguro(e.target.value)}
          placeholder="Ingrese el ID del seguro"
          sx={{ mb: 3 }}
        />
        <Typography>Ingrese un ID de seguro para cargar los requisitos</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box p={3} display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5" gutterBottom>
          Cargando requisitos...
        </Typography>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography variant="h5" gutterBottom color="error">
          Error: {error}
        </Typography>
        <Button variant="contained" onClick={cargarRequisitos}>
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
      
      <TextField
        fullWidth
        label="ID del Seguro"
        variant="outlined"
        value={idSeguro}
        onChange={(e) => setIdSeguro(e.target.value)}
        placeholder="Ingrese el ID del seguro"
        sx={{ mb: 3 }}
      />

      {requisitos.length > 0 ? (
        <>
          <Typography variant="h6" gutterBottom>
            Seguro: {requisitos[0].nombre} - {requisitos[0].descripcion}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Precio: ${requisitos[0].precio} - Tiempo de pago: {requisitos[0].tiempo_pago}
          </Typography>

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
                    key={requisito.id_seguro_requisito}
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
                        color={obtenerColorEstado(requisito.estado || 0)} 
                        size="small"
                      >
                        {obtenerTextoEstado(requisito.estado || 0)}
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
        </>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No se encontraron requisitos para este seguro.
        </Typography>
      )}

      {/* Modal separado */}
      <ModalSubirArchivoCliente
        open={modalAbierto}
        onClose={cerrarModal}
        requisito={requisitoActual}
        onFileChange={handleArchivoChange}
        onConfirm={handleConfirmarSubida}
        userData={usuario}
      />
    </Box>
  );
};

SubirArchivoCliente.propTypes = {};