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
  Button
} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Modal } from '../Modal';
import { ModalEliminarUsuario } from '../ModalEliminarUsuario/ModalEliminarUsuario';
import { ModalEditarUsuario } from '../ModalEditarUsuario/ModalEditarUsuario';

export const ClientesContent = () => {
  const [clientes, setClientes] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null); // Puedes usarlo para saber qué cliente eliminar
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);

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
    <Box>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Gestión de Clientes
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#25004D",
                "&:hover": {
                  backgroundColor: "#25004D", // Color más oscuro para el hover
                },
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
            >
              Eliminar cliente
            </Button>
          </Box>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Correo</strong></TableCell>
              <TableCell><strong>Teléfono</strong></TableCell>
              <TableCell><strong>Acción</strong></TableCell>
              <TableCell><strong>Edicion</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody key={0}>
            {clientes.map(p => (
              <TableRow key={p.id_usuario}>
                <TableCell key={`${p.id_usuario}_1`}><strong>{p.id_usuario}</strong></TableCell>
                <TableCell key={`${p.id_usuario}_2`}><strong>{p.nombre}</strong></TableCell>
                <TableCell key={`${p.id_usuario}_3`}><strong>{p.correo}</strong></TableCell>
                <TableCell key={`${p.id_usuario}_4`}><strong>{p.telefono}</strong></TableCell>
                <TableCell key={`${p.id_seguro}_5`}><Button variant="outlined">Ver</Button></TableCell>
                <TableCell key={`${p.id_seguro}_6`}><Button variant="outlined" onClick={() => { setUsuarioEditar(p); setModalEditarAbierto(true); }}> Editar </Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onGuardar={consultarClientes} // solo refresca tabla
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