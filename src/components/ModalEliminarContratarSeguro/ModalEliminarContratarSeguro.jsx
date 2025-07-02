"use client";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  useMediaQuery,
  useTheme,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Chip,
  Alert,
  Stack,
} from "@mui/material";

export const ModalEliminarContratarSeguro = ({ open, onClose, onEliminar }) => {
  const [segurosContratados, setSegurosContratados] = useState([]);
  const [segurosSeleccionados, setSegurosSeleccionados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (open) {
      cargarSegurosContratados();
      setSegurosSeleccionados([]);
    }
  }, [open]);

  const cargarSegurosContratados = async () => {
    setLoading(true);
    try {
      // Cargar seguros contratados
      const responseSeguros = await fetch("https://r4jdf9tl-3030.use.devtunnels.ms/usuario_seguro/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (responseSeguros.ok) {
        const dataSeguros = await responseSeguros.json();
        
        // Cargar usuarios para obtener nombres
        const responseUsuarios = await fetch("https://r4jdf9tl-3030.use.devtunnels.ms/usuario/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        // Cargar seguros para obtener nombres de planes
        const responsePlanes = await fetch("https://r4jdf9tl-3030.use.devtunnels.ms/seguro/");

        let usuariosData = [];
        let planesData = [];

        if (responseUsuarios.ok) {
          usuariosData = await responseUsuarios.json();
        }

        if (responsePlanes.ok) {
          planesData = await responsePlanes.json();
        }

        // Combinar datos
        const segurosConDatos = dataSeguros.map(seguro => {
          const usuario = usuariosData.find(u => u.id_usuario === seguro.id_usuario_per);
          const plan = planesData.find(p => p.id_seguro === seguro.id_seguro_per);
          
          return {
            ...seguro,
            nombreUsuario: usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario no encontrado',
            correoUsuario: usuario ? usuario.correo : '',
            nombrePlan: plan ? plan.nombre : 'Plan no encontrado',
            tipoPlan: plan ? (plan.tipo === 0 ? 'Vida' : 'Salud') : '',
            precioPlan: plan ? plan.precio : 0,
          };
        });

        setSegurosContratados(segurosConDatos);
      } else {
        console.error("Error al cargar seguros contratados:", responseSeguros.status);
        alert("Error al cargar los seguros contratados");
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("Error al cargar los datos necesarios");
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarTodos = (event) => {
    if (event.target.checked) {
      setSegurosSeleccionados(segurosContratados.map(s => s.id_usuario_seguro));
    } else {
      setSegurosSeleccionados([]);
    }
  };

  const handleSeleccionarSeguro = (id) => {
    setSegurosSeleccionados(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const getEstadoColor = (estado) => {
    return estado === 1 ? { color: "#4caf50", bg: "#e8f5e9" } : { color: "#f44336", bg: "#ffebee" };
  };

  const getPagoColor = (pago) => {
    return pago === 1 ? { color: "#2196f3", bg: "#e3f2fd" } : { color: "#ff9800", bg: "#fff3e0" };
  };

  const handleEliminar = async () => {
    if (segurosSeleccionados.length === 0) {
      alert("Debe seleccionar al menos un seguro para eliminar");
      return;
    }

    const confirmacion = window.confirm(
      `¿Está seguro de eliminar ${segurosSeleccionados.length} seguro(s) contratado(s)? Esta acción no se puede deshacer.`
    );

    if (!confirmacion) return;

    setEliminando(true);
    let eliminados = 0;
    let errores = 0;

    try {
      for (const id of segurosSeleccionados) {
        try {
          const response = await fetch(`https://r4jdf9tl-3030.use.devtunnels.ms/usuario_seguro/eliminar/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });

          if (response.ok) {
            eliminados++;
          } else {
            errores++;
            console.error(`Error al eliminar seguro ${id}:`, response.status);
          }
        } catch (error) {
          errores++;
          console.error(`Error al eliminar seguro ${id}:`, error);
        }
      }

      if (eliminados > 0) {
        alert(`Se eliminaron ${eliminados} seguro(s) correctamente${errores > 0 ? `. ${errores} eliminaciones fallaron.` : '.'}`);
        setSegurosSeleccionados([]);
        cargarSegurosContratados();
        if (typeof onEliminar === "function") onEliminar();
      } else {
        alert("No se pudo eliminar ningún seguro");
      }
    } catch (error) {
      console.error("Error general al eliminar seguros:", error);
      alert("Error al eliminar los seguros");
    } finally {
      setEliminando(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 2,
          m: fullScreen ? 0 : 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #d32f2f 0%, #f44336 100%)",
          color: "white",
          py: 3,
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(211, 47, 47, 0.2)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ letterSpacing: "0.5px" }}>
          🗑️ Eliminar Seguros Contratados
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 4, backgroundColor: "#fafafa" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#d32f2f" }} />
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            {segurosContratados.length === 0 ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                No hay seguros contratados para eliminar
              </Alert>
            ) : (
              <>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" color="text.primary">
                    Seguros contratados ({segurosContratados.length})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {segurosSeleccionados.length} seleccionado(s)
                  </Typography>
                </Stack>

                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={segurosSeleccionados.length === segurosContratados.length}
                            indeterminate={segurosSeleccionados.length > 0 && segurosSeleccionados.length < segurosContratados.length}
                            onChange={handleSeleccionarTodos}
                            sx={{ color: "#d32f2f" }}
                          />
                        </TableCell>
                        <TableCell><strong>Usuario</strong></TableCell>
                        <TableCell><strong>Plan</strong></TableCell>
                        <TableCell><strong>Precio</strong></TableCell>
                        <TableCell><strong>F. Contrato</strong></TableCell>
                        <TableCell><strong>F. Fin</strong></TableCell>
                        <TableCell><strong>Estado</strong></TableCell>
                        <TableCell><strong>Pago</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {segurosContratados.map((seguro) => {
                        const estadoColors = getEstadoColor(seguro.estado);
                        const pagoColors = getPagoColor(seguro.estado_pago);
                        const isSelected = segurosSeleccionados.includes(seguro.id_usuario_seguro);

                        return (
                          <TableRow 
                            key={seguro.id_usuario_seguro}
                            sx={{ 
                              backgroundColor: isSelected ? "#ffebee" : "inherit",
                              "&:hover": { backgroundColor: "#f5f5f5" }
                            }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isSelected}
                                onChange={() => handleSeleccionarSeguro(seguro.id_usuario_seguro)}
                                sx={{ color: "#d32f2f" }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {seguro.nombreUsuario}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {seguro.correoUsuario}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {seguro.nombrePlan}
                                </Typography>
                                <Chip 
                                  label={seguro.tipoPlan} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ fontSize: "0.7rem", height: 20 }}
                                />
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="bold" color="primary">
                                ${seguro.precioPlan}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {new Date(seguro.fecha_contrato).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {new Date(seguro.fecha_fin).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={seguro.estado === 1 ? "Activo" : "Inactivo"}
                                size="small"
                                sx={{
                                  backgroundColor: estadoColors.bg,
                                  color: estadoColors.color,
                                  fontWeight: "bold",
                                  fontSize: "0.7rem",
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={seguro.estado_pago === 1 ? "Pagado" : "Pendiente"}
                                size="small"
                                sx={{
                                  backgroundColor: pagoColors.bg,
                                  color: pagoColors.color,
                                  fontWeight: "bold",
                                  fontSize: "0.7rem",
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                {segurosSeleccionados.length > 0 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <strong>Atención:</strong> Se eliminarán permanentemente {segurosSeleccionados.length} seguro(s) contratado(s). Esta acción no se puede deshacer.
                  </Alert>
                )}
              </>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 4,
          pt: 2,
          justifyContent: "space-between",
          backgroundColor: "#fafafa",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#757575",
            color: "#757575",
            "&:hover": {
              borderColor: "#616161",
              backgroundColor: "rgba(117, 117, 117, 0.04)",
            },
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "none",
            minWidth: fullScreen ? "120px" : "140px",
          }}
        >
          Cancelar
        </Button>

        <Button
          onClick={handleEliminar}
          variant="contained"
          disabled={eliminando || segurosSeleccionados.length === 0}
          sx={{
            background: "linear-gradient(135deg, #d32f2f 0%, #f44336 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #c62828 0%, #e53935 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(211, 47, 47, 0.25)",
            },
            "&:disabled": {
              background: "#ccc",
            },
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "none",
            minWidth: fullScreen ? "120px" : "140px",
          }}
        >
          {eliminando ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            `Eliminar (${segurosSeleccionados.length})`
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalEliminarContratarSeguro.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onEliminar: PropTypes.func,
};