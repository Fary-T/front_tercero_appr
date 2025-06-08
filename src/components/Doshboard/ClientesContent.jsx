import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Stack, useMediaQuery, Grid, Chip, Tabs,
  Tab, Card, CardContent, FormControl, Select, MenuItem, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress,
  Checkbox, Alert
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import GroupIcon from "@mui/icons-material/Group";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import { ModalEditarUsuario } from "../ModalEditarUsuario/ModalEditarUsuario";
import { ModalAgente } from "../ModalAgente/ModalAgente";
import { ModalEliminarUsuarioAgente } from "../ModalEliminarUsuarioAgente/ModalEliminarUsuarioAgente";
import { ModalContratarSeguro } from "../ModalContratarSeguro/ModalContratarSeguro";
import { ModalVerUsuario } from "../ModalVerUsuario";

// Modal para eliminar seguros específicos de un usuario
const ModalEliminarSegurosUsuario = ({ open, onClose, usuario, onEliminar }) => {
  const [seguros, setSeguros] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (open && usuario) {
      cargarSegurosUsuario();
      setSeleccionados([]);
    }
  }, [open, usuario]);

  const cargarSegurosUsuario = async () => {
    if (!usuario) return;
    
    setLoading(true);
    try {
      const [resSeguros, resPlanes] = await Promise.all([
        fetch("http://localhost:3030/usuario_seguro/", {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        }),
        fetch("http://localhost:3030/seguro/")
      ]);

      if (resSeguros.ok && resPlanes.ok) {
        const [dataSeguros, planes] = await Promise.all([
          resSeguros.json(),
          resPlanes.json()
        ]);

        // Filtrar solo los seguros del usuario específico
        const segurosUsuario = dataSeguros.filter(seguro => seguro.id_usuario_per === usuario.id_usuario);

        const segurosConDatos = segurosUsuario.map(seguro => {
          const plan = planes.find(p => p.id_seguro === seguro.id_seguro_per);
          return {
            ...seguro,
            nombrePlan: plan?.nombre || 'Plan no encontrado',
            tipoPlan: plan ? (plan.tipo === 0 ? 'Vida' : 'Salud') : '',
            precioPlan: plan?.precio || 0,
          };
        });
        setSeguros(segurosConDatos);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al cargar los seguros del usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarTodos = (event) => {
    setSeleccionados(event.target.checked ? seguros.map(s => s.id_usuario_seguro) : []);
  };

  const handleSeleccionar = (id) => {
    setSeleccionados(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleEliminar = async () => {
    if (seleccionados.length === 0) return;
    
    if (!window.confirm(`¿Eliminar ${seleccionados.length} seguro(s) de ${usuario.nombre} ${usuario.apellido}? Esta acción no se puede deshacer.`)) return;

    setEliminando(true);
    let eliminados = 0;

    try {
      for (const id of seleccionados) {
        const response = await fetch(`http://localhost:3030/usuario_seguro/eliminar/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        });
        if (response.ok) eliminados++;
      }

      if (eliminados > 0) {
        alert(`Se eliminaron ${eliminados} seguro(s) de ${usuario.nombre} ${usuario.apellido} correctamente`);
        setSeleccionados([]);
        cargarSegurosUsuario();
        if (onEliminar) onEliminar();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar seguros");
    } finally {
      setEliminando(false);
    }
  };

  const getChipColors = (estado, tipo) => {
    if (tipo === 'estado') {
      return estado === 1 ? { color: "#4caf50", bg: "#e8f5e9" } : { color: "#f44336", bg: "#ffebee" };
    }
    return estado === 1 ? { color: "#2196f3", bg: "#e3f2fd" } : { color: "#ff9800", bg: "#fff3e0" };
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ background: "linear-gradient(135deg, #d32f2f 0%, #f44336 100%)", color: "white", py: 3, textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold">
          🗑️ Eliminar Seguros de {usuario?.nombre} {usuario?.apellido}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3, backgroundColor: "#fafafa" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#d32f2f" }} />
          </Box>
        ) : seguros.length === 0 ? (
          <Alert severity="info">
            Este usuario no tiene seguros contratados para eliminar
          </Alert>
        ) : (
          <>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Seguros de {usuario?.nombre} ({seguros.length})</Typography>
              <Typography variant="body2" color="text.secondary">{seleccionados.length} seleccionado(s)</Typography>
            </Stack>

            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={seleccionados.length === seguros.length}
                        indeterminate={seleccionados.length > 0 && seleccionados.length < seguros.length}
                        onChange={handleSeleccionarTodos}
                        sx={{ color: "#d32f2f" }}
                      />
                    </TableCell>
                    <TableCell><strong>Plan</strong></TableCell>
                    <TableCell><strong>Precio</strong></TableCell>
                    <TableCell><strong>F. Contrato</strong></TableCell>
                    <TableCell><strong>Estado</strong></TableCell>
                    <TableCell><strong>Pago</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {seguros.map((seguro) => {
                    const estadoColors = getChipColors(seguro.estado, 'estado');
                    const pagoColors = getChipColors(seguro.estado_pago, 'pago');
                    const isSelected = seleccionados.includes(seguro.id_usuario_seguro);

                    return (
                      <TableRow 
                        key={seguro.id_usuario_seguro}
                        sx={{ backgroundColor: isSelected ? "#ffebee" : "inherit", "&:hover": { backgroundColor: "#f5f5f5" } }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleSeleccionar(seguro.id_usuario_seguro)}
                            sx={{ color: "#d32f2f" }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">{seguro.nombrePlan}</Typography>
                            <Chip label={seguro.tipoPlan} size="small" variant="outlined" sx={{ fontSize: "0.7rem", height: 20 }} />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" color="primary">${seguro.precioPlan}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{new Date(seguro.fecha_contrato).toLocaleDateString()}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={seguro.estado === 1 ? "Activo" : "Inactivo"}
                            size="small"
                            sx={{ backgroundColor: estadoColors.bg, color: estadoColors.color, fontWeight: "bold", fontSize: "0.7rem" }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={seguro.estado_pago === 1 ? "Pagado" : "Pendiente"}
                            size="small"
                            sx={{ backgroundColor: pagoColors.bg, color: pagoColors.color, fontWeight: "bold", fontSize: "0.7rem" }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {seleccionados.length > 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <strong>Atención:</strong> Se eliminarán permanentemente {seleccionados.length} seguro(s) de {usuario?.nombre} {usuario?.apellido}. Esta acción no se puede deshacer.
              </Alert>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: "space-between", backgroundColor: "#fafafa" }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderColor: "#757575", color: "#757575", borderRadius: 3, px: 3 }}>
          Cancelar
        </Button>
        <Button
          onClick={handleEliminar}
          variant="contained"
          disabled={eliminando || seleccionados.length === 0}
          sx={{
            background: "linear-gradient(135deg, #d32f2f 0%, #f44336 100%)",
            "&:hover": { background: "linear-gradient(135deg, #c62828 0%, #e53935 100%)" },
            "&:disabled": { background: "#ccc" },
            borderRadius: 3, px: 3
          }}
        >
          {eliminando ? <CircularProgress size={20} color="inherit" /> : `Eliminar (${seleccionados.length})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

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
      console.error("Error de conexión:", error);
      alert("No se pudo conectar al servidor");
    }
  };

  const usuariosFiltrados = () => {
    return filtroRol === "todos" ? clientes : clientes.filter(cliente => cliente.rol?.toLowerCase() === filtroRol.toLowerCase());
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
        <Stack direction={isSmallScreen ? "column" : "row"} justifyContent="space-between" alignItems={isSmallScreen ? "flex-start" : "center"} spacing={2} mb={2}>
          <Typography variant="h5" fontWeight="bold">Gestión de Usuarios</Typography>
          <Stack direction={isSmallScreen ? "column" : "row"} spacing={2}>
            <FormControl size="small" sx={{ minWidth: 200, width: isSmallScreen ? "100%" : "auto" }}>
              <InputLabel><FilterListIcon sx={{ fontSize: 16, mr: 0.5 }} />Filtrar rol</InputLabel>
              <Select
                value={filtroRol}
                label="Filtrar por rol"
                onChange={(e) => setFiltroRol(e.target.value)}
                sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: "#25004D" } }}
              >
                <MenuItem value="todos">Todos los usuarios</MenuItem>
                {rolesUnicos().map((rol) => (
                  <MenuItem key={rol} value={rol}>{rol.charAt(0).toUpperCase() + rol.slice(1)}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" sx={{ backgroundColor: "#25004D", width: isSmallScreen ? "100%" : "auto" }} startIcon={<PersonAddAltIcon />} onClick={() => setModalAbierto(true)}>
              Añadir usuario
            </Button>
          </Stack>
        </Stack>

        <Box mb={2}>
          <Typography variant="body2" color="textSecondary">
            Mostrando {usuariosFilt.length} de {clientes.length} usuarios
            {filtroRol !== "todos" && (
              <Chip label={filtroRol.charAt(0).toUpperCase() + filtroRol.slice(1)} size="small" onDelete={() => setFiltroRol("todos")} sx={{ ml: 1, backgroundColor: "#25004D", color: "white" }} />
            )}
          </Typography>
        </Box>

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
              {usuariosFilt.map((p) => {
                const rolColors = getRolColor(p.rol);
                return (
                  <TableRow key={p.id_usuario}>
                    <TableCell><strong>{p.id_usuario}</strong></TableCell>
                    <TableCell><strong>{p.nombre}</strong></TableCell>
                    <TableCell><strong>{p.correo}</strong></TableCell>
                    <TableCell><strong>{p.telefono}</strong></TableCell>
                    <TableCell>
                      <Chip
                        label={p.rol || "Sin rol"}
                        icon={getRolIcon(p.rol)}
                        sx={{ backgroundColor: rolColors.bg, color: rolColors.color, fontWeight: "bold", fontSize: "0.75rem" }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Button variant="outlined" size={isSmallScreen ? "small" : "medium"} onClick={() => { setUsuarioVer(p); setModalVerAbierto(true); }}>Ver</Button>
                        <Button variant="outlined" size={isSmallScreen ? "small" : "medium"} onClick={() => { setUsuarioEditar(p); setModalEditarAbierto(true); }}>Editar</Button>
                        <Button variant="outlined" color="error" size={isSmallScreen ? "small" : "medium"} onClick={() => { setUsuarioSeleccionado(p); setModalEliminarAbierto(true); }}>Eliminar</Button>
                        <Button variant="outlined" color="primary" size={isSmallScreen ? "small" : "medium"} onClick={() => { setUsuarioContratar(p); setModalContratarAbierto(true); }}>Contratar</Button>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          size={isSmallScreen ? "small" : "medium"} 
                          startIcon={<DeleteIcon />}
                          onClick={() => { 
                            setUsuarioEliminarSeguros(p); 
                            setModalEliminarSegurosAbierto(true); 
                          }}
                          sx={{ minWidth: "auto" }}
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

        {usuariosFilt.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4, backgroundColor: "#f5f5f5", borderRadius: 2, mt: 2 }}>
            <Typography variant="h6" color="textSecondary">No se encontraron usuarios</Typography>
            <Button variant="outlined" onClick={() => setFiltroRol("todos")} sx={{ mt: 2 }}>Mostrar todos</Button>
          </Box>
        )}
      </>
    );
  };

  const VistaRoles = () => {
    const grupos = usuariosPorRol();

    return (
      <>
        <Stack direction={isSmallScreen ? "column" : "row"} justifyContent="space-between" alignItems={isSmallScreen ? "flex-start" : "center"} spacing={2} mb={3}>
          <Typography variant="h5" fontWeight="bold">Gestión de Roles</Typography>
          <FormControl size="small" sx={{ minWidth: 200, width: isSmallScreen ? "100%" : "auto" }}>
            <InputLabel><FilterListIcon sx={{ fontSize: 16, mr: 0.5 }} />Filtrar por rol</InputLabel>
            <Select value={filtroRol} label="Filtrar por rol" onChange={(e) => setFiltroRol(e.target.value)}>
              <MenuItem value="todos">Todos los roles</MenuItem>
              {rolesUnicos().map((rol) => (
                <MenuItem key={rol} value={rol}>{rol.charAt(0).toUpperCase() + rol.slice(1)}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Grid container spacing={3}>
          {Object.entries(grupos).map(([rol, usuarios]) => {
            const rolColors = getRolColor(rol);
            return (
              <Grid item xs={12} md={6} lg={4} key={rol}>
                <Card sx={{ height: "100%", border: `2px solid ${rolColors.color}`, borderRadius: 2 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      {getRolIcon(rol)}
                      <Typography variant="h6" fontWeight="bold" sx={{ ml: 1, color: rolColors.color, textTransform: "capitalize" }}>{rol}</Typography>
                      <Chip label={usuarios.length} sx={{ ml: "auto", backgroundColor: rolColors.color, color: "white", fontWeight: "bold" }} size="small" />
                    </Box>
                    <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
                      {usuarios.map((usuario) => (
                        <Box key={usuario.id_usuario} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1, px: 2, mb: 1, backgroundColor: rolColors.bg, borderRadius: 1 }}>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">{usuario.nombre} {usuario.apellido}</Typography>
                            <Typography variant="caption" color="textSecondary">{usuario.correo}</Typography>
                          </Box>
                          <Stack direction="row" spacing={0.5}>
                            <Button size="small" variant="outlined" onClick={() => { setUsuarioVer(usuario); setModalVerAbierto(true); }} sx={{ minWidth: "auto", px: 1, fontSize: "0.7rem" }}>Ver</Button>
                            <Button size="small" variant="outlined" onClick={() => { setUsuarioEditar(usuario); setModalEditarAbierto(true); }} sx={{ minWidth: "auto", px: 1, fontSize: "0.7rem" }}>Editar</Button>
                            <Button 
                              size="small" 
                              variant="outlined" 
                              color="error"
                              onClick={() => { 
                                setUsuarioEliminarSeguros(usuario); 
                                setModalEliminarSegurosAbierto(true); 
                              }} 
                              sx={{ minWidth: "auto", px: 1, fontSize: "0.7rem" }}
                            >
                              Seguros
                            </Button>
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
      </>
    );
  };

  return (
    <Box p={2}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={(event, newValue) => setTabValue(newValue)}>
          <Tab label="Usuarios" icon={<GroupIcon />} iconPosition="start" />
          <Tab label="Roles" icon={<AdminPanelSettingsIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {tabValue === 0 && <VistaUsuarios />}
      {tabValue === 1 && <VistaRoles />}

      {/* Modales */}
      <ModalAgente open={modalAbierto} onClose={() => setModalAbierto(false)} onGuardar={consultarClientes} />
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