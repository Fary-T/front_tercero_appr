import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';

export const RolesContent = () => {
  const [roles, setRoles] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    obtenerRoles();
  }, []);

  const obtenerRoles = async () => {
    try {
      const response = await fetch("http://localhost:3030/usuario/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setRoles(data);
      } else {
        alert(data.mensaje || "Error al obtener los roles");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("No se pudo conectar al servidor");
    }
  };

  return (
    <Box p={isMobile ? 1 : 3}>
      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        justifyContent="space-between"
        alignItems={isMobile ? 'flex-start' : 'center'}
        gap={2}
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold" textAlign={isMobile ? 'center' : 'left'}>
          Gestión de roles
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Nombre completo</b></TableCell>
              <TableCell><b>Tipo de usuario</b></TableCell>
              <TableCell><b>Rol Asignado</b></TableCell>
              <TableCell><b>Editar rol</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((p) => (
              <TableRow key={p.id_usuario}>
                <TableCell>{p.id_usuario}</TableCell>
                <TableCell><strong>{p.nombre}</strong></TableCell>
                <TableCell><strong>{p.tipo}</strong></TableCell>
                <TableCell><strong>{p.rol}</strong></TableCell>
                <TableCell>
                  <IconButton color="primary" size={isMobile ? 'small' : 'medium'}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};