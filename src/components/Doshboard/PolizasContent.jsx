import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  IconButton,
  Stack
} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTheme } from '@mui/material/styles';
import { ModalPoliza } from '../ModalPoliza';
import { ModalEditarPoliza } from '../ModalEditarPoliza/ModalEditarPoliza'; // Importa el modal

export const PolizasContent = () => {
  const [polizas, setPolizas] = useState([]);
  const [abrirModal, setAbrirModal] = useState(false);
  const [abrirModalEditar, setAbrirModalEditar] = useState(false);
  const [polizaSeleccionada, setPolizaSeleccionada] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    obtenerPolizas();
  }, []);

  const obtenerPolizas = async () => {
    try {
      const response = await fetch("http://localhost:3030/seguro/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPolizas(data);
      } else {
        console.error(data.mensaje || "Error al obtener las pólizas");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    }
  };

  const handleAgregarClick = () => {
    setAbrirModal(true);
  };

  const handleCerrarModal = () => {
    setAbrirModal(false);
  };

  const handleEditar = (poliza) => {
    setPolizaSeleccionada(poliza);
    setAbrirModalEditar(true);
  };

  const handleCerrarModalEditar = () => {
    setAbrirModalEditar(false);
    setPolizaSeleccionada(null);
  };

  const handleEliminar = async (id) => {
    const confirmacion = true; // Reemplazar por modal de confirmación si deseas
    if (confirmacion) {
      try {
        const response = await fetch(`http://localhost:3030/seguro/eliminar/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          obtenerPolizas();
        } else {
          const data = await response.json();
          console.error(data.error || 'Error al eliminar la póliza');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleVerInformacion = (poliza) => {
    // Por ahora solo muestra por consola
    console.log("Información de la póliza:", poliza);
  };

  return (
    <Box p={isMobile ? 1 : 3}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold" textAlign={isMobile ? 'center' : 'left'}>
          Gestión de Pólizas
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<PersonAddAltIcon />}
          onClick={handleAgregarClick}
          fullWidth={isMobile}
        >
          Añadir póliza
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Número de Póliza</strong></TableCell>
              <TableCell><strong>Nombre del Seguro</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {polizas.map(p => (
              <TableRow key={p.id_seguro}>
                <TableCell><strong>{p.id_seguro}</strong></TableCell>
                <TableCell><strong>{`00${p.id_seguro}`}</strong></TableCell>
                <TableCell><strong>{p.nombre}</strong></TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => handleVerInformacion(p)} color="info">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditar(p)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEliminar(p.id_seguro)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ModalPoliza
        open={abrirModal}
        onClose={handleCerrarModal}
        onGuardar={obtenerPolizas}
      />

      <ModalEditarPoliza
        open={abrirModalEditar}
        onClose={handleCerrarModalEditar}
        poliza={polizaSeleccionada}
        onGuardar={obtenerPolizas}
      />
    </Box>
  );
};