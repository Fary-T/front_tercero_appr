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
  Tabs,
  Tab,
  Card,
  CardContent,
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import GroupIcon from "@mui/icons-material/Group";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { useTheme } from "@mui/material/styles";
import { Modal } from "../Modal";
import { ModalEliminarUsuario } from "../ModalEliminarUsuario/ModalEliminarUsuario";
import { ModalEditarUsuario } from "../ModalEditarUsuario/ModalEditarUsuario";

export const ClientesContent = () => {
  const [clientes, setClientes] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  // Estados para el modal de ver usuario
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [usuarioVer, setUsuarioVer] = useState(null);
  // Estado para controlar la pestaña activa
  const [tabValue, setTabValue] = useState(0);

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

  // Función para agrupar usuarios por rol
  const usuariosPorRol = () => {
    const grupos = {};
    clientes.forEach((cliente) => {
      const rol = cliente.rol || "Sin rol";
      if (!grupos[rol]) {
        grupos[rol] = [];
      }
      grupos[rol].push(cliente);
    });
    return grupos;
  };

  // Componente del Modal Ver Usuario integrado con colores púrpura
  const ModalVerUsuario = () => {
    if (!usuarioVer) return null;

    return (
      <Dialog
        open={modalVerAbierto}
        onClose={() => setModalVerAbierto(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isSmallScreen}
        PaperProps={{
          sx: {
            borderRadius: isSmallScreen ? 0 : 2,
            m: isSmallScreen ? 0 : 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #28044c 0%, #4a1b6b 100%)",
            color: "white",
            py: 3,
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(40, 4, 76, 0.2)",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ letterSpacing: "0.5px" }}
          >
            👤 Información del Usuario
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 4, backgroundColor: "#f5f0f9" }}>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={4}>
              {/* Nombre */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  gutterBottom
                  sx={{ color: "#28044c", fontWeight: 600 }}
                >
                  Nombre
                </Typography>
                <TextField
                  fullWidth
                  value={usuarioVer.nombre || ""}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    readOnly: true,
                    sx: {
                      backgroundColor: "#ede5f2",
                      "& .MuiOutlinedInput-input": {
                        cursor: "default",
                        color: "#28044c",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8249a0",
                      },
                    },
                  }}
                />
              </Grid>

              {/* Apellido */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  gutterBottom
                  sx={{ color: "#28044c", fontWeight: 600 }}
                >
                  Apellido
                </Typography>
                <TextField
                  fullWidth
                  value={usuarioVer.apellido || ""}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    readOnly: true,
                    sx: {
                      backgroundColor: "#ede5f2",
                      "& .MuiOutlinedInput-input": {
                        cursor: "default",
                        color: "#28044c",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8249a0",
                      },
                    },
                  }}
                />
              </Grid>

              {/* Correo */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  gutterBottom
                  sx={{ color: "#28044c", fontWeight: 600 }}
                >
                  Correo
                </Typography>
                <TextField
                  fullWidth
                  value={usuarioVer.correo || ""}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    readOnly: true,
                    sx: {
                      backgroundColor: "#ede5f2",
                      "& .MuiOutlinedInput-input": {
                        cursor: "default",
                        color: "#28044c",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8249a0",
                      },
                    },
                  }}
                />
              </Grid>

              {/* Teléfono */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  gutterBottom
                  sx={{ color: "#28044c", fontWeight: 600 }}
                >
                  Teléfono
                </Typography>
                <TextField
                  fullWidth
                  value={usuarioVer.telefono || ""}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    readOnly: true,
                    sx: {
                      backgroundColor: "#ede5f2",
                      "& .MuiOutlinedInput-input": {
                        cursor: "default",
                        color: "#28044c",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8249a0",
                      },
                    },
                  }}
                />
              </Grid>

              {/* Cédula */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  gutterBottom
                  sx={{ color: "#28044c", fontWeight: 600 }}
                >
                  Cédula
                </Typography>
                <TextField
                  fullWidth
                  value={usuarioVer.cedula || ""}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    readOnly: true,
                    sx: {
                      backgroundColor: "#ede5f2",
                      "& .MuiOutlinedInput-input": {
                        cursor: "default",
                        color: "#28044c",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8249a0",
                      },
                    },
                  }}
                />
              </Grid>

              {/* Username */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  gutterBottom
                  sx={{ color: "#28044c", fontWeight: 600 }}
                >
                  Username
                </Typography>
                <TextField
                  fullWidth
                  value={usuarioVer.username || ""}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    readOnly: true,
                    sx: {
                      backgroundColor: "#ede5f2",
                      "& .MuiOutlinedInput-input": {
                        cursor: "default",
                        color: "#28044c",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8249a0",
                      },
                    },
                  }}
                />
              </Grid>

              {/* Rol */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  gutterBottom
                  sx={{ color: "#28044c", fontWeight: 600 }}
                >
                  Rol
                </Typography>
                <TextField
                  fullWidth
                  value={usuarioVer.rol || ""}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    readOnly: true,
                    sx: {
                      backgroundColor: "#ede5f2",
                      "& .MuiOutlinedInput-input": {
                        cursor: "default",
                        color: "#28044c",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8249a0",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 4,
            pt: 2,
            justifyContent: "center",
            backgroundColor: "#f5f0f9",
          }}
        >
          <Button
            onClick={() => setModalVerAbierto(false)}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #28044c 0%, #4a1b6b 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #1f0336 0%, #3d1558 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(40, 4, 76, 0.25)",
              },
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none",
              transition: "all 0.3s ease",
              minWidth: isSmallScreen ? "120px" : "140px",
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Componente para la vista de clientes (tabla original)
  const VistaClientes = () => (
    <>
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
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  // Componente para la vista de roles
  const VistaRoles = () => {
    const grupos = usuariosPorRol();

    return (
      <>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Gestión de Roles
        </Typography>

        <Grid container spacing={3}>
          {Object.entries(grupos).map(([rol, usuarios]) => {
            const rolColors = getRolColor(rol);
            return (
              <Grid item xs={12} md={6} lg={4} key={rol}>
                <Card
                  sx={{
                    height: "100%",
                    border: `2px solid ${rolColors.color}`,
                    borderRadius: 2,
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 8px 25px ${rolColors.color}25`,
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      {getRolIcon(rol)}
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          ml: 1,
                          color: rolColors.color,
                          textTransform: "capitalize",
                        }}
                      >
                        {rol}
                      </Typography>
                      <Chip
                        label={usuarios.length}
                        sx={{
                          ml: "auto",
                          backgroundColor: rolColors.color,
                          color: "white",
                          fontWeight: "bold",
                        }}
                        size="small"
                      />
                    </Box>

                    <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
                      {usuarios.map((usuario, index) => (
                        <Box
                          key={usuario.id_usuario}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            py: 1,
                            px: 2,
                            mb: 1,
                            backgroundColor: rolColors.bg,
                            borderRadius: 1,
                            border: `1px solid ${rolColors.color}20`,
                            "&:hover": {
                              backgroundColor: `${rolColors.color}10`,
                            },
                          }}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {usuario.nombre} {usuario.apellido}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {usuario.correo}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={0.5}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setUsuarioVer(usuario);
                                setModalVerAbierto(true);
                              }}
                              sx={{
                                minWidth: "auto",
                                px: 1,
                                fontSize: "0.7rem",
                                borderColor: rolColors.color,
                                color: rolColors.color,
                                "&:hover": {
                                  backgroundColor: rolColors.bg,
                                  borderColor: rolColors.color,
                                },
                              }}
                            >
                              Ver
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setUsuarioEditar(usuario);
                                setModalEditarAbierto(true);
                              }}
                              sx={{
                                minWidth: "auto",
                                px: 1,
                                fontSize: "0.7rem",
                                borderColor: rolColors.color,
                                color: rolColors.color,
                                "&:hover": {
                                  backgroundColor: rolColors.bg,
                                  borderColor: rolColors.color,
                                },
                              }}
                            >
                              Editar
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
      {/* Pestañas para alternar entre vistas */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(event, newValue) => setTabValue(newValue)}
          sx={{
            "& .MuiTab-root": {
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "1rem",
            },
            "& .Mui-selected": {
              color: "#25004D !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#25004D",
            },
          }}
        >
          <Tab label="Clientes" icon={<GroupIcon />} iconPosition="start" />
          <Tab
            label="Roles"
            icon={<AdminPanelSettingsIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Contenido según la pestaña seleccionada */}
      {tabValue === 0 && <VistaClientes />}
      {tabValue === 1 && <VistaRoles />}

      {/* Modales existentes */}
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

      {/* Modal de Ver Usuario integrado */}
      <ModalVerUsuario />
    </Box>
  );
};
