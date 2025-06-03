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
} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useTheme } from '@mui/material/styles';
import { Modal } from '../Modal';

export const PolizasContent = () => {
  const [polizas, setPolizas] = useState([]);
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
        alert(data.mensaje || "Error al obtener las pólizas");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("No se pudo conectar al servidor");
    }
  };

  const AñadirPoliza = async () => {
    try {
      const nuevaPoliza = {
        tiempo_pago: 12,
        nombre: '99984564',
        tipo: 1,
        precio: 35000,
        descripcion: 'Poliza de vida'
      };

      const response = await fetch("http://localhost:3030/seguro/agregar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaPoliza),
      });

      const data = await response.json();

      if (response.ok) {
        obtenerPolizas();
      } else {
        alert(data.mensaje || "Error al añadir la póliza");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("No se pudo conectar al servidor");
    }
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
          onClick={AñadirPoliza}
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
              <TableCell><strong>Cliente</strong></TableCell>
              <TableCell><strong>Número de Póliza</strong></TableCell>
              <TableCell><strong>Tipo de Póliza</strong></TableCell>
              <TableCell><strong>Información</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {polizas.map(p => (
              <TableRow key={p.id_seguro}>
                <TableCell>{p.id_seguro}</TableCell>
                <TableCell><strong>{p.nombre}</strong></TableCell>
                <TableCell><strong>{`00${p.id_seguro}`}</strong></TableCell>
                <TableCell><strong>{p.tipo}</strong></TableCell>
                <TableCell><Button variant="outlined">+</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal />
    </Box>
  );
};