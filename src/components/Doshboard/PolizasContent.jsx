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
  Stack,
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
} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PolicyIcon from '@mui/icons-material/Policy';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useTheme } from '@mui/material/styles';

import { ModalPoliza } from '../ModalPoliza';
import { ModalEditarPoliza } from '../ModalEditarPoliza/ModalEditarPoliza';
import { ModalEliminarPoliza } from '../ModalEliminarPoliza';

export const PolizasContent = () => {
  const [polizas, setPolizas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [abrirModal, setAbrirModal] = useState(false);
  const [abrirModalEditar, setAbrirModalEditar] = useState(false);
  const [polizaSeleccionada, setPolizaSeleccionada] = useState(null);
  const [abrirModalEliminar, setAbrirModalEliminar] = useState(false);
  const [polizaAEliminar, setPolizaAEliminar] = useState(null);
  // Estados para el modal de ver póliza
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [polizaVer, setPolizaVer] = useState(null);
  // Estado para controlar la pestaña activa
  const [tabValue, setTabValue] = useState(0);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    obtenerPolizas();
    obtenerUsuarios();
  }, []);

  const obtenerPolizas = async () => {
    try {
      const response = await fetch("http://localhost:3030/seguro/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
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

  const obtenerUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3030/usuario/", {
        method: "POST", // Según tu backend, usa POST
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        setUsuarios(data);
      } else {
        console.error(data.mensaje || "Error al obtener los usuarios");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    }
  };

  const handleAgregarClick = () => setAbrirModal(true);
  const handleCerrarModal = () => setAbrirModal(false);

  const handleEditar = (poliza) => {
    setPolizaSeleccionada(poliza);
    setAbrirModalEditar(true);
  };
  const handleCerrarModalEditar = () => {
    setAbrirModalEditar(false);
    setPolizaSeleccionada(null);
  };

  const abrirModalConfirmacion = (poliza) => {
    setPolizaAEliminar(poliza);
    setAbrirModalEliminar(true);
  };
  const cerrarModalEliminar = () => {
    setPolizaAEliminar(null);
    setAbrirModalEliminar(false);
  };

  const confirmarEliminacion = async () => {
    if (polizaAEliminar) {
      try {
        const response = await fetch(`http://localhost:3030/seguro/eliminar/${polizaAEliminar.id_seguro}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await obtenerPolizas();
          cerrarModalEliminar();
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
    setPolizaVer(poliza);
    setModalVerAbierto(true);
  };

  // Función para obtener el color del nombre del seguro (plan)
  const getPlanColor = (nombre) => {
    const nombreNormalizado = String(nombre || '').toLowerCase();
    
    if (nombreNormalizado.includes("vida")) {
      return { color: "#d32f2f", bg: "#ffebee" };
    } else if (nombreNormalizado.includes("auto")) {
      return { color: "#f57c00", bg: "#fff3e0" };
    } else if (nombreNormalizado.includes("hogar") || nombreNormalizado.includes("casa")) {
      return { color: "#388e3c", bg: "#e8f5e8" };
    } else if (nombreNormalizado.includes("salud") || nombreNormalizado.includes("medico")) {
      return { color: "#1976d2", bg: "#e3f2fd" };
    } else if (nombreNormalizado.includes("empresarial") || nombreNormalizado.includes("negocio")) {
      return { color: "#7b1fa2", bg: "#f3e5f5" };
    } else {
      return { color: "#757575", bg: "#f5f5f5" };
    }
  };

  // Función para obtener el icono según el nombre del seguro
  const getPlanIcon = (nombre) => {
    const nombreNormalizado = String(nombre || '').toLowerCase();
    
    if (nombreNormalizado.includes("vida")) {
      return <PolicyIcon sx={{ fontSize: 16 }} />;
    } else if (nombreNormalizado.includes("empresarial") || nombreNormalizado.includes("negocio")) {
      return <BusinessIcon sx={{ fontSize: 16 }} />;
    } else {
      return <AssignmentIcon sx={{ fontSize: 16 }} />;
    }
  };

  // Función para agrupar pólizas por nombre del seguro
  const polizasPorPlan = () => {
    const grupos = {};
    polizas.forEach((poliza) => {
      const planNombre = (poliza.nombre && String(poliza.nombre).trim()) || "Sin Plan";
      if (!grupos[planNombre]) {
        grupos[planNombre] = [];
      }
      grupos[planNombre].push(poliza);
    });
    return grupos;
  };

  // Función para formatear el valor como moneda
  const formatearPrecio = (valor) => {
    if (!valor) return 'N/A';
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(valor);
  };

  // Función para obtener el nombre del usuario por ID
  const obtenerNombreUsuario = (idUsuario) => {
    const usuario = usuarios.find(u => u.id_usuario === idUsuario);
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario no encontrado';
  };

  // Componente del Modal Ver Póliza integrado con colores púrpura
  const ModalVerPoliza = () => {
    if (!polizaVer) return null;

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
            📋 Información de la Póliza
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 4, backgroundColor: "#f5f0f9" }}>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={4}>
              {/* ID Seguro */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  gutterBottom
                  sx={{ color: "#28044c", fontWeight: 600 }}
                >
                  ID del Seguro
                </Typography>
                <TextField
                  fullWidth
                  value={polizaVer.id_seguro || ""}
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

              {/* Número de Póliza */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  gutterBottom
                  sx={{ color: "#28044c", fontWeight: 600 }}
                >
                  Número de Póliza
                </Typography>
                <TextField
                  fullWidth
                  value={`00${polizaVer.id_seguro}` || ""}
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

              {/* Plan del Seguro (Nombre) */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  gutterBottom
                  sx={{ color: "#28044c", fontWeight: 600 }}
                >
                  Plan del Seguro
                </Typography>
                <TextField
                  fullWidth
                  value={polizaVer.nombre || ""}
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

              {/* Descripción */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  gutterBottom
                  sx={{ color: "#28044c", fontWeight: 600 }}
                >
                  Descripción
                </Typography>
                <TextField
                  fullWidth
                  value={polizaVer.descripcion || ""}
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

              {/* Precio Predefinido - CORREGIDO */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  gutterBottom
                  sx={{ color: "#28044c", fontWeight: 600 }}
                >
                  Precio Predefinido
                </Typography>
                <TextField
                  fullWidth
                  value={formatearPrecio(polizaVer.precio)}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    readOnly: true,
                    sx: {
                      backgroundColor: "#ede5f2",
                      "& .MuiOutlinedInput-input": {
                        cursor: "default",
                        color: "#28044c",
                        fontWeight: 'bold',
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8249a0",
                      },
                    },
                  }}
                />
              </Grid>

              {/* Tiempo de Pago - CORREGIDO */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  gutterBottom
                  sx={{ color: "#28044c", fontWeight: 600 }}
                >
                  Tiempo de Pago
                </Typography>
                <TextField
                  fullWidth
                  value={polizaVer.tiempo_pago ? `${polizaVer.tiempo_pago} meses` : "No especificado"}
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

              {/* Tipo de Seguro */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  gutterBottom
                  sx={{ color: "#28044c", fontWeight: 600 }}
                >
                  Tipo de Seguro
                </Typography>
                <TextField
                  fullWidth
                  value={polizaVer.tipo === 0 ? "Vida" : polizaVer.tipo === 1 ? "Salud" : "No especificado"}
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

  // Componente para la vista de pólizas (tabla original mejorada)
  const VistaPolizas = () => (
    <>
      <Stack
        direction={isSmallScreen ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isSmallScreen ? "flex-start" : "center"}
        spacing={2}
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold">
          Gestión de Pólizas
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
          onClick={handleAgregarClick}
        >
          Añadir póliza
        </Button>
      </Stack>

      {polizas.length > 0 ? (
        <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
          <Table size={isSmallScreen ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Número de Póliza</strong></TableCell>
                <TableCell><strong>Plan del Seguro</strong></TableCell>
                <TableCell><strong>Precio Predefinido</strong></TableCell>
                <TableCell><strong>Tiempo de Pago</strong></TableCell>
                <TableCell><strong>Tipo</strong></TableCell>
                <TableCell><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {polizas.map(p => {
                const planColors = getPlanColor(p.nombre);
                return (
                  <TableRow key={p.id_seguro}>
                    <TableCell><strong>{p.id_seguro}</strong></TableCell>
                    <TableCell><strong>{`00${p.id_seguro}`}</strong></TableCell>
                    <TableCell>
                      <Chip
                        label={p.nombre || "Sin Plan"}
                        icon={getPlanIcon(p.nombre)}
                        sx={{
                          backgroundColor: planColors.bg,
                          color: planColors.color,
                          fontWeight: "bold",
                          fontSize: "0.75rem",
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: '#2e7d32' }}>
                        {formatearPrecio(p.precio)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {p.tiempo_pago ? `${p.tiempo_pago} meses` : 'No especificado'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.tipo === 0 ? "Vida" : p.tipo === 1 ? "Salud" : "N/A"}
                        sx={{
                          backgroundColor: p.tipo === 0 ? "#e3f2fd" : p.tipo === 1 ? "#f3e5f5" : "#f5f5f5",
                          color: p.tipo === 0 ? "#1976d2" : p.tipo === 1 ? "#7b1fa2" : "#757575",
                          fontWeight: "bold",
                          fontSize: "0.7rem",
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size={isSmallScreen ? "small" : "medium"}
                          onClick={() => handleVerInformacion(p)}
                        >
                          Ver
                        </Button>
                        <Button
                          variant="outlined"
                          size={isSmallScreen ? "small" : "medium"}
                          onClick={() => handleEditar(p)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size={isSmallScreen ? "small" : "medium"}
                          onClick={() => abrirModalConfirmacion(p)}
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
      ) : (
        <Typography variant="body1" align="center" mt={4}>
          No hay pólizas registradas.
        </Typography>
      )}
    </>
  );

  // Componente para la vista de planes
  const VistaPlanes = () => {
    const grupos = polizasPorPlan();

    return (
      <>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Gestión por Planes de Seguro
        </Typography>

        <Grid container spacing={3}>
          {Object.entries(grupos).map(([planNombre, polizasDelPlan]) => {
            const planColors = getPlanColor(planNombre);
            return (
              <Grid item xs={12} md={6} lg={4} key={planNombre}>
                <Card
                  sx={{
                    height: "100%",
                    border: `2px solid ${planColors.color}`,
                    borderRadius: 2,
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 8px 25px ${planColors.color}25`,
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      {getPlanIcon(planNombre)}
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          ml: 1,
                          color: planColors.color,
                          textTransform: "capitalize",
                        }}
                      >
                        {planNombre}
                      </Typography>
                      <Chip
                        label={polizasDelPlan.length}
                        sx={{
                          ml: "auto",
                          backgroundColor: planColors.color,
                          color: "white",
                          fontWeight: "bold",
                        }}
                        size="small"
                      />
                    </Box>

                    <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
                      {polizasDelPlan.map((poliza) => (
                        <Box
                          key={poliza.id_seguro}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            py: 1,
                            px: 2,
                            mb: 1,
                            backgroundColor: planColors.bg,
                            borderRadius: 1,
                            border: `1px solid ${planColors.color}20`,
                            "&:hover": {
                              backgroundColor: `${planColors.color}10`,
                            },
                          }}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              Póliza 00{poliza.id_seguro}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Precio: {formatearPrecio(poliza.precio)} | 
                              Tiempo: {poliza.tiempo_pago ? `${poliza.tiempo_pago} meses` : 'N/A'}
                            </Typography>
                            {poliza.descripcion && (
                              <Typography variant="caption" display="block" color="textSecondary">
                                {poliza.descripcion}
                              </Typography>
                            )}
                          </Box>
                          <Stack direction="row" spacing={0.5}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleVerInformacion(poliza)}
                              sx={{
                                minWidth: "auto",
                                px: 1,
                                fontSize: "0.7rem",
                                borderColor: planColors.color,
                                color: planColors.color,
                                "&:hover": {
                                  backgroundColor: planColors.bg,
                                  borderColor: planColors.color,
                                },
                              }}
                            >
                              Ver
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleEditar(poliza)}
                              sx={{
                                minWidth: "auto",
                                px: 1,
                                fontSize: "0.7rem",
                                borderColor: planColors.color,
                                color: planColors.color,
                                "&:hover": {
                                  backgroundColor: planColors.bg,
                                  borderColor: planColors.color,
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
          <Tab label="Pólizas" icon={<PolicyIcon />} iconPosition="start" />
          <Tab
            label="Planes"
            icon={<BusinessIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Contenido según la pestaña seleccionada */}
      {tabValue === 0 && <VistaPolizas />}
      {tabValue === 1 && <VistaPlanes />}

      {/* Modales existentes */}
      <ModalPoliza
        open={abrirModal}
        onClose={handleCerrarModal}
        onGuardar={obtenerPolizas}
        usuarios={usuarios}
      />

      <ModalEditarPoliza
        open={abrirModalEditar}
        onClose={handleCerrarModalEditar}
        poliza={polizaSeleccionada}
        onGuardar={obtenerPolizas}
        usuarios={usuarios}
      />

      <ModalEliminarPoliza
        open={abrirModalEliminar}
        onClose={cerrarModalEliminar}
        poliza={polizaAEliminar}
        onEliminar={confirmarEliminacion}
      />

      {/* Modal de Ver Póliza integrado */}
      <ModalVerPoliza />
    </Box>
  );
};