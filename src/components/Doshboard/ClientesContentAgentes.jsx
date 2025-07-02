import React, { useEffect, useState } from "react";
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
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import GroupIcon from "@mui/icons-material/Group";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { useTheme } from "@mui/material/styles";
import { ModalAgente } from "../ModalAgente/ModalAgente";
import { ModalEliminarUsuarioAgente } from "../ModalEliminarUsuarioAgente/ModalEliminarUsuarioAgente";
import { ModalEditarUsuarioAgente } from "../ModalEditarUsuarioAgente/ModalEditarUsuarioAgente";
import { ModalVerUsuario } from "../ModalVerUsuario";

export const ClientesContentAgentes = () => {
  const [clientes, setClientes] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  
  // Estados para el modal de ver usuario
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [usuarioVer, setUsuarioVer] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    consultarClientes();
  }, []);

  const consultarClientes = async () => {
    try {
      const response = await fetch("http://localhost:3030/usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  // Función para obtener el color del rol
  const getRolColor = (rol) => {
    switch (rol?.toLowerCase()) {
      case "admin":
        return { color: "#d32f2f", bg: "#ffebee" };
      case "gerente":
        return { color: "#f57c00", bg: "#fff3e0" };
      case "empleado":
        return { color: "#388e3c", bg: "#e8f5e8" };
      case "usuario":
        return { color: "#1976d2", bg: "#e3f2fd" };
      case "cliente":
        return { color: "#7b1fa2", bg: "#f3e5f5" };
      default:
        return { color: "#757575", bg: "#f5f5f5" };
    }
  };

  // Función para obtener el icono del rol
  const getRolIcon = (rol) => {
    switch (rol?.toLowerCase()) {
      case "admin":
        return <AdminPanelSettingsIcon sx={{ fontSize: 16 }} />;
      case "gerente":
        return <SupervisorAccountIcon sx={{ fontSize: 16 }} />;
      default:
        return <GroupIcon sx={{ fontSize: 16 }} />;
    }
  };

  return (
    <Box p={2}>
      <Stack
        direction={isSmallScreen ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isSmallScreen ? "flex-start" : "center"}
        spacing={2}
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold">
          Gestión de Clientes
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#25004D",
            "&:hover": {
              backgroundColor: "#25004D",
            },
            width: isSmallScreen ? "100%" : "auto",
          }}
          startIcon={<PersonAddAltIcon />}
          onClick={() => setModalAbierto(true)}
        >
          Añadir cliente
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table size={isSmallScreen ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Nombre</strong>
              </TableCell>
              <TableCell>
                <strong>Correo</strong>
              </TableCell>
              <TableCell>
                <strong>Teléfono</strong>
              </TableCell>
              <TableCell>
                <strong>Rol</strong>
              </TableCell>
              <TableCell>
                <strong>Acciones</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((p) => {
              const rolColors = getRolColor(p.rol);
              if (p.rol === "cliente") {
                return (
                  <TableRow key={p.id_usuario}>
                    <TableCell>
                      <strong>{p.id_usuario}</strong>
                    </TableCell>
                    <TableCell>
                      <strong>{p.nombre}</strong>
                    </TableCell>
                    <TableCell>
                      <strong>{p.correo}</strong>
                    </TableCell>
                    <TableCell>
                      <strong>{p.telefono}</strong>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.rol || "Sin rol"}
                        icon={getRolIcon(p.rol)}
                        sx={{
                          backgroundColor: rolColors.bg,
                          color: rolColors.color,
                          fontWeight: "bold",
                          fontSize: "0.75rem",
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size={isSmallScreen ? "small" : "medium"}
                          onClick={() => {
                            setUsuarioVer(p);
                            setModalVerAbierto(true);
                          }}
                        >
                          Ver
                        </Button>
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
                        <Button
                          variant="outlined"
                          color="error"
                          size={isSmallScreen ? "small" : "medium"}
                          onClick={() => {
                            setUsuarioSeleccionado(p);
                            setModalEliminarAbierto(true);
                          }}
                        >
                          Eliminar
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              }
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modales existentes */}
      <ModalAgente
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onGuardar={consultarClientes}
      />
      <ModalEliminarUsuarioAgente
        open={modalEliminarAbierto}
        onClose={() => setModalEliminarAbierto(false)}
        usuario={usuarioSeleccionado}
        onEliminar={consultarClientes}
      />
      <ModalEditarUsuarioAgente
        open={modalEditarAbierto}
        onClose={() => setModalEditarAbierto(false)}
        usuario={usuarioEditar}
        onGuardar={consultarClientes}
      />

      {/* Modal de Ver Usuario integrado */}
      <ModalVerUsuario
        open={modalVerAbierto}
        onClose={() => setModalVerAbierto(false)}
        usuario={usuarioVer}
      />
    </Box>
  );
};