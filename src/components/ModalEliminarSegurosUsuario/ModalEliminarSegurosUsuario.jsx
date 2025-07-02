import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, CircularProgress, Box, Checkbox, Stack,
  Alert, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Button, useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const ModalEliminarSegurosUsuario = ({ open, onClose, usuario, onEliminar }) => {
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
        fetch("https://r4jdf9tl-3030.use.devtunnels.ms/usuario_seguro/", {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        }),
        fetch("https://r4jdf9tl-3030.use.devtunnels.ms/seguro/")
      ]);

      if (resSeguros.ok && resPlanes.ok) {
        const [dataSeguros, planes] = await Promise.all([
          resSeguros.json(),
          resPlanes.json()
        ]);

        const segurosUsuario = dataSeguros.filter(
          seguro => seguro.id_usuario_per === usuario.id_usuario
        );

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

    const confirm = window.confirm(`¿Eliminar ${seleccionados.length} seguro(s) de ${usuario.nombre} ${usuario.apellido}? Esta acción no se puede deshacer.`);
    if (!confirm) return;

    setEliminando(true);
    let eliminados = 0;

    try {
      for (const id of seleccionados) {
        const response = await fetch(`https://r4jdf9tl-3030.use.devtunnels.ms/usuario_seguro/eliminar/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        });
        if (response.ok) eliminados++;
      }

      if (eliminados > 0) {
        alert(`Se eliminaron ${eliminados} seguro(s) correctamente`);
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
      <DialogTitle sx={{
        background: "linear-gradient(135deg, #d32f2f 0%, #f44336 100%)",
        color: "white", py: 3, textAlign: "center"
      }}>
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
          <Alert severity="info">Este usuario no tiene seguros contratados para eliminar</Alert>
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
                        sx={{
                          backgroundColor: isSelected ? "#ffebee" : "inherit",
                          "&:hover": { backgroundColor: "#f5f5f5" }
                        }}
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
                          <Typography variant="body2">
                            {new Date(seguro.fecha_contrato).toLocaleDateString()}
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
                              fontSize: "0.7rem"
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
                              fontSize: "0.7rem"
                            }}
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
                <strong>Atención:</strong> Se eliminarán permanentemente {seleccionados.length} seguro(s). Esta acción no se puede deshacer.
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

ModalEliminarSegurosUsuario.propTypes = {};

