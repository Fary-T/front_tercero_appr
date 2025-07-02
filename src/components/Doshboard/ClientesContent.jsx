import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Stack, useMediaQuery, Grid, Chip, Tabs,
  Tab, Card, CardContent, FormControl, Select, MenuItem, InputLabel
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import GroupIcon from "@mui/icons-material/Group";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";

// Componentes modales
import { ModalEditarUsuario } from "../ModalEditarUsuario/ModalEditarUsuario";
import { ModalEliminarUsuarioAgente } from "../ModalEliminarUsuarioAgente/ModalEliminarUsuarioAgente";
import { ModalContratarSeguro } from "../ModalContratarSeguro/ModalContratarSeguro";
import { ModalVerUsuario } from "../ModalVerUsuario";
import { Modal } from "../Modal/Modal";
import { ModalEliminarSegurosUsuario } from "../ModalEliminarSegurosUsuario/ModalEliminarSegurosUsuario"; // ← Aquí está el cambio importante

export const ClientesContent = () => {
  const [clientes, setClientes] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [usuarioVer, setUsuarioVer] = useState(null);
  const [modalContratarAbierto, setModalContratarAbierto] = useState(false);
  const [usuarioContratar, setUsuarioContratar] = useState(null);
  const [modalEliminarSegurosAbierto, setModalEliminarSegurosAbierto] = useState(false);
  const [usuarioEliminarSeguros, setUsuarioEliminarSeguros] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [filtroRol, setFiltroRol] = useState("todos");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    consultarClientes();
  }, []);

  const consultarClientes = async () => {
    try {
      const response = await fetch("https://r4jdf9tl-3030.use.devtunnels.ms/usuario", {
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
      console.error("Error de conexión:", error);
      alert("No se pudo conectar al servidor");
    }
  };

  const usuariosFiltrados = () => {
    return filtroRol === "todos"
      ? clientes
      : clientes.filter(cliente => cliente.rol?.toLowerCase() === filtroRol.toLowerCase());
  };

  const rolesUnicos = () => {
    const roles = [...new Set(clientes.map(cliente => cliente.rol?.toLowerCase()).filter(Boolean))];
    return roles.sort();
  };

  const getRolColor = (rol) => {
    const colors = {
      admin: { color: "#d32f2f", bg: "#ffebee" },
      gerente: { color: "#f57c00", bg: "#fff3e0" },
      empleado: { color: "#388e3c", bg: "#e8f5e8" },
      usuario: { color: "#1976d2", bg: "#e3f2fd" },
      cliente: { color: "#7b1fa2", bg: "#f3e5f5" }
    };
    return colors[rol?.toLowerCase()] || { color: "#757575", bg: "#f5f5f5" };
  };

  const getRolIcon = (rol) => {
    switch (rol?.toLowerCase()) {
      case "admin": return <AdminPanelSettingsIcon sx={{ fontSize: 16 }} />;
      case "gerente": return <SupervisorAccountIcon sx={{ fontSize: 16 }} />;
      default: return <GroupIcon sx={{ fontSize: 16 }} />;
    }
  };

  const usuariosPorRol = () => {
    const grupos = {};
    usuariosFiltrados().forEach((cliente) => {
      const rol = cliente.rol || "Sin rol";
      if (!grupos[rol]) grupos[rol] = [];
      grupos[rol].push(cliente);
    });
    return grupos;
  };

  const VistaUsuarios = () => {
    const usuariosFilt = usuariosFiltrados();

    return (
      <>
        <Stack direction={isSmallScreen ? "column" : "row"} justifyContent="space-between" alignItems="center" spacing={2} mb={2}>
          <Typography variant="h5" fontWeight="bold">Gestión de Usuarios</Typography>
          <Stack direction={isSmallScreen ? "column" : "row"} spacing={2}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel><FilterListIcon sx={{ fontSize: 16, mr: 1 }} /> Filtrar rol</InputLabel>
              <Select
                value={filtroRol}
                label="Filtrar por rol"
                onChange={(e) => setFiltroRol(e.target.value)}
              >
                <MenuItem value="todos">Todos los usuarios</MenuItem>
                {rolesUnicos().map((rol) => (
                  <MenuItem key={rol} value={rol}>
                    {rol.charAt(0).toUpperCase() + rol.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#25004D" }}
              startIcon={<PersonAddAltIcon />}
              onClick={() => setModalAbierto(true)}
            >
              Añadir usuario
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
                <TableCell><strong>Rol</strong></TableCell>
                <TableCell><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuariosFilt.map((usuario) => {
                const rolColors = getRolColor(usuario.rol);
                return (
                  <TableRow key={usuario.id_usuario}>
                    <TableCell>{usuario.id_usuario}</TableCell>
                    <TableCell>{usuario.nombre}</TableCell>
                    <TableCell>{usuario.correo}</TableCell>
                    <TableCell>{usuario.telefono}</TableCell>
                    <TableCell>
                      <Chip
                        label={usuario.rol || "Sin rol"}
                        icon={getRolIcon(usuario.rol)}
                        sx={{
                          backgroundColor: rolColors.bg,
                          color: rolColors.color,
                          fontWeight: "bold",
                          fontSize: "0.75rem"
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Button size="small" onClick={() => { setUsuarioVer(usuario); setModalVerAbierto(true); }}>Ver</Button>
                        <Button size="small" onClick={() => { setUsuarioEditar(usuario); setModalEditarAbierto(true); }}>Editar</Button>
                        <Button size="small" color="error" onClick={() => { setUsuarioSeleccionado(usuario); setModalEliminarAbierto(true); }}>Eliminar</Button>
                        <Button size="small" color="primary" onClick={() => { setUsuarioContratar(usuario); setModalContratarAbierto(true); }}>Contratar</Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => {
                            setUsuarioEliminarSeguros(usuario);
                            setModalEliminarSegurosAbierto(true);
                          }}
                        >
                          Seguros
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  const VistaRoles = () => {
    const grupos = usuariosPorRol();

    return (
      <Grid container spacing={3}>
        {Object.entries(grupos).map(([rol, usuarios]) => {
          const rolColors = getRolColor(rol);
          return (
            <Grid item xs={12} md={6} lg={4} key={rol}>
              <Card sx={{ border: `2px solid ${rolColors.color}`, borderRadius: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    {getRolIcon(rol)}
                    <Typography variant="h6" fontWeight="bold" sx={{ ml: 1, color: rolColors.color, textTransform: "capitalize" }}>{rol}</Typography>
                    <Chip label={usuarios.length} sx={{ ml: "auto", backgroundColor: rolColors.color, color: "white" }} size="small" />
                  </Box>
                  <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
                    {usuarios.map((usuario) => (
                      <Box key={usuario.id_usuario} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1, px: 2, mb: 1, backgroundColor: rolColors.bg, borderRadius: 1 }}>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">{usuario.nombre} {usuario.apellido}</Typography>
                          <Typography variant="caption" color="textSecondary">{usuario.correo}</Typography>
                        </Box>
                        <Stack direction="row" spacing={0.5}>
                          <Button size="small" onClick={() => { setUsuarioVer(usuario); setModalVerAbierto(true); }}>Ver</Button>
                          <Button size="small" onClick={() => { setUsuarioEditar(usuario); setModalEditarAbierto(true); }}>Editar</Button>
                          <Button size="small" color="error" onClick={() => { setUsuarioEliminarSeguros(usuario); setModalEliminarSegurosAbierto(true); }}>Seguros</Button>
                        </Stack>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <Box p={2}>
      <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} sx={{ mb: 3 }}>
        <Tab label="Usuarios" icon={<GroupIcon />} iconPosition="start" />
        <Tab label="Roles" icon={<AdminPanelSettingsIcon />} iconPosition="start" />
      </Tabs>

      {tabValue === 0 && <VistaUsuarios />}
      {tabValue === 1 && <VistaRoles />}

      {/* Modales */}
      <Modal open={modalAbierto} onClose={() => setModalAbierto(false)} onGuardar={consultarClientes} />
      <ModalEliminarUsuarioAgente open={modalEliminarAbierto} onClose={() => setModalEliminarAbierto(false)} usuario={usuarioSeleccionado} onEliminar={consultarClientes} />
      <ModalEditarUsuario open={modalEditarAbierto} onClose={() => setModalEditarAbierto(false)} usuario={usuarioEditar} onGuardar={consultarClientes} />
      <ModalVerUsuario open={modalVerAbierto} onClose={() => setModalVerAbierto(false)} usuario={usuarioVer} />
      <ModalContratarSeguro open={modalContratarAbierto} onClose={() => setModalContratarAbierto(false)} usuario={usuarioContratar} onContratar={consultarClientes} />
      <ModalEliminarSegurosUsuario
        open={modalEliminarSegurosAbierto}
        onClose={() => setModalEliminarSegurosAbierto(false)}
        usuario={usuarioEliminarSeguros}
        onEliminar={consultarClientes}
      />
    </Box>
  );
};
