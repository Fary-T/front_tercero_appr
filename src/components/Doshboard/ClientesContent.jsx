import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  IconButton,
  useMediaQuery
} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import { Modal } from '../Modal';
import { ModalEliminarUsuario } from '../ModalEliminarUsuario/ModalEliminarUsuario';
import { ModalEditarUsuario } from '../ModalEditarUsuario/ModalEditarUsuario';

export const ClientesContent = () => {
  const [clientes, setClientes] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    consultarClientes();
  }, []);

  const consultarClientes = async () => {
    try {
      const response = await fetch("http://localhost:3030/usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      const data = await response.json();

      if (response.ok) {
        setClientes(data);
      } else {
        console.error(data.mensaje || "Error al obtener los clientes");
      }
    } catch (error) {
      console.error("Error de conexión con el servidor:", error);
    }
  };

  return (
    <Box p={2}>
      <Stack
        direction={isSmallScreen ? 'column' : 'row'}
        justifyContent="space-between"
        alignItems={isSmallScreen ? 'flex-start' : 'center'}
        spacing={2}
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold">
          Gestión de Clientes
        </Typography>

        <Box
          component="button"
          style={{
            backgroundColor: '#25004D',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: isSmallScreen ? '100%' : 'auto'
          }}
          onClick={() => setModalAbierto(true)}
        >
          <PersonAddAltIcon />
          Añadir cliente
        </Box>
      </Stack>

      <TableContainer component={Paper}>
        <Table size={isSmallScreen ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Correo</strong></TableCell>
              <TableCell><strong>Teléfono</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((p) => (
              <TableRow key={p.id_usuario}>
                <TableCell><strong>{p.id_usuario}</strong></TableCell>
                <TableCell><strong>{p.nombre}</strong></TableCell>
                <TableCell><strong>{p.correo}</strong></TableCell>
                <TableCell><strong>{p.telefono}</strong></TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton color="info" onClick={() => console.log('Ver usuario', p)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={() => {
                      setUsuarioEditar(p);
                      setModalEditarAbierto(true);
                    }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => {
                      setUsuarioSeleccionado(p);
                      setModalEliminarAbierto(true);
                    }}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onGuardar={consultarClientes}
      />
      <ModalEliminarUsuario
        open={modalEliminarAbierto}
        onClose={() => setModalEliminarAbierto(false)}
        usuario={usuarioSeleccionado}
        onEliminar={consultarClientes}
      />
      <ModalEditarUsuario
        open={modalEditarAbierto}
        onClose={() => setModalEditarAbierto(false)}
        usuario={usuarioEditar}
        onGuardar={consultarClientes}
      />
    </Box>
  );
};