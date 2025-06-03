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
  Button,
  Stack,
  useMediaQuery
} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
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
        alert(data.mensaje || "Error al obtener los clientes");
      }
    } catch (error) {
      console.error("Error de conexión con el servidor:", error);
      alert("No se pudo conectar al servidor");
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

        <Stack direction={isSmallScreen ? 'column' : 'row'} spacing={1} width={isSmallScreen ? '100%' : 'auto'}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#25004D",
              "&:hover": {
                backgroundColor: "#25004D",
              },
              width: isSmallScreen ? '100%' : 'auto'
            }}
            startIcon={<PersonAddAltIcon />}
            onClick={() => setModalAbierto(true)}
          >
            Añadir cliente
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={() => setModalEliminarAbierto(true)}
            sx={{ width: isSmallScreen ? '100%' : 'auto' }}
          >
            Eliminar cliente
          </Button>
        </Stack>
      </Stack>

      <TableContainer component={Paper}>
        <Table size={isSmallScreen ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Correo</strong></TableCell>
              <TableCell><strong>Teléfono</strong></TableCell>
              <TableCell><strong>Acción</strong></TableCell>
              <TableCell><strong>Edición</strong></TableCell>
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
                  <Button
                    variant="outlined"
                    size={isSmallScreen ? "small" : "medium"}
                  >
                    Ver
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size={isSmallScreen ? "small" : "medium"}
                    onClick={() => {
                      setUsuarioEditar(p);
                      setModalEditarAbierto(true);
                    }}
                  >
                    Editar
                  </Button>
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
