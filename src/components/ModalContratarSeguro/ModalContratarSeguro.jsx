"use client";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  useMediaQuery,
  useTheme,
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
} from "@mui/material";

export const ModalContratarSeguro = ({ open, onClose, onContratar }) => {
  const [formData, setFormData] = useState({
    id_usuario_per: "",
    id_seguro_per: "",
    fecha_contrato: "",
    fecha_fin: "",
    estado: "",
    estado_pago: "",
  });

  const [usuarios, setUsuarios] = useState([]);
  const [seguros, setSeguros] = useState([]);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Cargar usuarios y seguros cuando se abre el modal
  useEffect(() => {
    if (open) {
      cargarDatos();
    }
  }, [open]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar usuarios (usando POST según tu backend)
      const responseUsuarios = await fetch("http://localhost:3030/usuario/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (responseUsuarios.ok) {
        const dataUsuarios = await responseUsuarios.json();
        setUsuarios(dataUsuarios);
      } else {
        console.error("Error al cargar usuarios:", responseUsuarios.status);
      }

      // Cargar seguros
      const responseSeguros = await fetch("http://localhost:3030/seguro/");
      if (responseSeguros.ok) {
        const dataSeguros = await responseSeguros.json();
        setSeguros(dataSeguros);
      } else {
        console.error("Error al cargar seguros:", responseSeguros.status);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("Error al cargar los datos necesarios");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validarCampos = () => {
    if (!formData.id_usuario_per) {
      alert("Debe seleccionar un usuario.");
      return false;
    }

    if (!formData.id_seguro_per) {
      alert("Debe seleccionar un seguro.");
      return false;
    }

    if (!formData.fecha_contrato) {
      alert("La fecha de contrato es requerida.");
      return false;
    }

    if (!formData.fecha_fin) {
      alert("La fecha de fin es requerida.");
      return false;
    }

    if (!formData.estado) {
      alert("El estado del contrato es requerido.");
      return false;
    }

    if (!formData.estado_pago) {
      alert("El estado de pago es requerido.");
      return false;
    }

    const fechaContrato = new Date(formData.fecha_contrato);
    const fechaFin = new Date(formData.fecha_fin);

    if (fechaFin <= fechaContrato) {
      alert("La fecha de fin debe ser posterior a la fecha de contrato.");
      return false;
    }

    return true;
  };

  const handleContratar = async () => {
    if (!validarCampos()) return;

    try {
      const response = await fetch("http://localhost:3030/usuario_seguro/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Seguro contratado correctamente");
        onClose();
        setFormData({
          id_usuario_per: "",
          id_seguro_per: "",
          fecha_contrato: "",
          fecha_fin: "",
          estado: "",
          estado_pago: "",
        });
        if (typeof onContratar === "function") onContratar();
      } else {
        alert(data.error || "Error al contratar seguro");
      }
    } catch (error) {
      console.error("Error al contratar seguro:", error);
      alert("No se pudo contratar el seguro");
    }
  };

  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#e5f2ed",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#49a082",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#044c28",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#044c28",
      },
    },
    "& .MuiInputBase-input": {
      color: "#044c28",
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="md"
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
          background: "linear-gradient(135deg, #044c28 0%, #1b6b4a 100%)",
          color: "white",
          py: 3,
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(4, 76, 40, 0.2)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ letterSpacing: "0.5px" }}>
          🛡️ Contratar Seguro
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 4, backgroundColor: "#f0f7f4" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#044c28" }} />
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ color: "#044c28", fontWeight: 600, mb: 1 }}>
                  Seleccionar Usuario
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    name="id_usuario_per"
                    value={formData.id_usuario_per}
                    onChange={handleChange}
                    variant="outlined"
                    sx={fieldStyle}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Seleccione un usuario</em>
                    </MenuItem>
                    {usuarios.map((usuario) => (
                      <MenuItem key={usuario.id_usuario} value={usuario.id_usuario}>
                        {usuario.nombre} {usuario.apellido} - {usuario.correo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ color: "#044c28", fontWeight: 600, mb: 1 }}>
                  Seleccionar Plan de Seguro
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    name="id_seguro_per"
                    value={formData.id_seguro_per}
                    onChange={handleChange}
                    variant="outlined"
                    sx={fieldStyle}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Seleccione un plan</em>
                    </MenuItem>
                    {seguros.map((seguro) => (
                      <MenuItem key={seguro.id_seguro} value={seguro.id_seguro}>
                        {seguro.nombre} - ${seguro.precio} ({seguro.tipo === 0 ? 'Vida' : 'Salud'})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ color: "#044c28", fontWeight: 600, mb: 1 }}>
                  Fecha de Contrato
                </Typography>
                <TextField
                  fullWidth
                  name="fecha_contrato"
                  type="date"
                  value={formData.fecha_contrato}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  sx={fieldStyle}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ color: "#044c28", fontWeight: 600, mb: 1 }}>
                  Fecha de Fin
                </Typography>
                <TextField
                  fullWidth
                  name="fecha_fin"
                  type="date"
                  value={formData.fecha_fin}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  sx={fieldStyle}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ color: "#044c28", fontWeight: 600, mb: 1 }}>
                  Estado del Contrato
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    variant="outlined"
                    sx={fieldStyle}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Seleccione el estado</em>
                    </MenuItem>
                    <MenuItem value="1">Activo</MenuItem>
                    <MenuItem value="0">Inactivo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ color: "#044c28", fontWeight: 600, mb: 1 }}>
                  Estado de Pago
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    name="estado_pago"
                    value={formData.estado_pago}
                    onChange={handleChange}
                    variant="outlined"
                    sx={fieldStyle}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Seleccione el estado</em>
                    </MenuItem>
                    <MenuItem value="1">Pagado</MenuItem>
                    <MenuItem value="0">Pendiente</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 4,
          pt: 2,
          justifyContent: "space-between",
          backgroundColor: "#f0f7f4",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#044c28",
            color: "#044c28",
            "&:hover": {
              borderColor: "#033420",
              backgroundColor: "rgba(4, 76, 40, 0.04)",
            },
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "none",
            transition: "all 0.3s ease",
            minWidth: fullScreen ? "120px" : "140px",
          }}
        >
          Cancelar
        </Button>

        <Button
          onClick={handleContratar}
          variant="contained"
          disabled={loading}
          sx={{
            background: "linear-gradient(135deg, #044c28 0%, #1b6b4a 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #033420 0%, #155838 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(4, 76, 40, 0.25)",
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
            transition: "all 0.3s ease",
            minWidth: fullScreen ? "120px" : "140px",
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Contratar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalContratarSeguro.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onContratar: PropTypes.func,
};