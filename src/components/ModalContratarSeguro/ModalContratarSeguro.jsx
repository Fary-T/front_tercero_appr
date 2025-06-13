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
  Chip,
  IconButton,
  Divider,
  FormLabel,
  InputAdornment,
} from "@mui/material";
import {
  Security,
  Person,
  Event,
  Payment,
  CheckCircle,
  Close,
  BusinessCenter,
  CalendarToday,
  AssignmentTurnedIn,
} from "@mui/icons-material";

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
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // Estilos para los inputs
  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#ffffff",
      borderRadius: 2,
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#e0e0e0",
        borderWidth: 2,
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#28044c",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#28044c",
        borderWidth: 2,
      },
    },
    "& .MuiInputLabel-root": {
      color: "#666",
      fontWeight: 600,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#28044c",
    },
  };

  const selectStyle = {
    ...textFieldStyle,
    "& .MuiSelect-select": {
      color: "#28044c",
      fontWeight: 500,
    },
    "& .MuiSelect-icon": {
      color: "#28044c",
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
          borderRadius: fullScreen ? 0 : 3,
          m: fullScreen ? 0 : 2,
          boxShadow: "0 10px 40px rgba(40, 4, 76, 0.12)",
          overflow: 'hidden',
          border: '1px solid #e0e0e0',
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#28044c",
          color: "white",
          py: 3,
          px: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Security sx={{ fontSize: 28 }} />
          <Typography variant="h5" fontWeight="600" letterSpacing="0.5px">
            Contratar Seguro
          </Typography>
        </Box>
        
        <IconButton
          onClick={onClose}
          sx={{ 
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
          size="small"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, backgroundColor: "#fafafa" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <CircularProgress
                size={48}
                sx={{
                  color: "#28044c",
                  "& .MuiCircularProgress-circle": {
                    strokeLinecap: "round",
                  },
                }}
              />
              <Typography sx={{ color: "#28044c", fontWeight: 600 }}>
                Cargando información...
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ p: 4 }}>
            {/* Información del Cliente */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Person sx={{ color: '#28044c', fontSize: 24 }} />
                <Typography variant="h6" fontWeight="700" color="#28044c">
                  Información del Cliente
                </Typography>
              </Box>
              <Divider sx={{ mb: 3, borderColor: '#e0e0e0' }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormLabel sx={{ fontWeight: '700', color: '#28044c', mb: 2, fontSize: '1rem', display: 'block' }}>
                    Seleccionar Usuario
                  </FormLabel>
                  <FormControl fullWidth>
                    <Select
                      name="id_usuario_per"
                      value={formData.id_usuario_per}
                      onChange={handleChange}
                      variant="outlined"
                      sx={selectStyle}
                      displayEmpty
                      startAdornment={
                        <InputAdornment position="start">
                          <Person sx={{ color: '#28044c', fontSize: 20 }} />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>Seleccione un usuario</em>
                      </MenuItem>
                      {usuarios.map((usuario) => (
                        <MenuItem key={usuario.id_usuario} value={usuario.id_usuario}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Person fontSize="small" />
                            {usuario.nombre} {usuario.apellido} - {usuario.correo}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormLabel sx={{ fontWeight: '700', color: '#28044c', mb: 2, fontSize: '1rem', display: 'block' }}>
                    Plan de Seguro
                  </FormLabel>
                  <FormControl fullWidth>
                    <Select
                      name="id_seguro_per"
                      value={formData.id_seguro_per}
                      onChange={handleChange}
                      variant="outlined"
                      sx={selectStyle}
                      displayEmpty
                      startAdornment={
                        <InputAdornment position="start">
                          <BusinessCenter sx={{ color: '#28044c', fontSize: 20 }} />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>Seleccione un plan</em>
                      </MenuItem>
                      {seguros.map((seguro) => (
                        <MenuItem key={seguro.id_seguro} value={seguro.id_seguro}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <BusinessCenter fontSize="small" />
                              {seguro.nombre}
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Chip
                                label={seguro.tipo === 0 ? 'Vida' : 'Salud'}
                                size="small"
                                sx={{
                                  backgroundColor: seguro.tipo === 0 ? '#e3f2fd' : '#f3e5f5',
                                  color: seguro.tipo === 0 ? '#1976d2' : '#7b1fa2',
                                  fontWeight: 600,
                                }}
                              />
                              <Typography sx={{ fontWeight: 700, color: "#28044c" }}>
                                ${seguro.precio}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Período de Cobertura */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Event sx={{ color: '#28044c', fontSize: 24 }} />
                <Typography variant="h6" fontWeight="700" color="#28044c">
                  Período de Cobertura
                </Typography>
              </Box>
              <Divider sx={{ mb: 3, borderColor: '#e0e0e0' }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormLabel sx={{ fontWeight: '700', color: '#28044c', mb: 2, fontSize: '1rem', display: 'block' }}>
                    Fecha de Inicio
                  </FormLabel>
                  <TextField
                    fullWidth
                    name="fecha_contrato"
                    type="date"
                    value={formData.fecha_contrato}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday sx={{ color: '#28044c', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={textFieldStyle}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormLabel sx={{ fontWeight: '700', color: '#28044c', mb: 2, fontSize: '1rem', display: 'block' }}>
                    Fecha de Finalización
                  </FormLabel>
                  <TextField
                    fullWidth
                    name="fecha_fin"
                    type="date"
                    value={formData.fecha_fin}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday sx={{ color: '#28044c', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={textFieldStyle}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Estado del Contrato */}
            <Box>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AssignmentTurnedIn sx={{ color: '#28044c', fontSize: 24 }} />
                <Typography variant="h6" fontWeight="700" color="#28044c">
                  Estado del Contrato
                </Typography>
              </Box>
              <Divider sx={{ mb: 3, borderColor: '#e0e0e0' }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormLabel sx={{ fontWeight: '700', color: '#28044c', mb: 2, fontSize: '1rem', display: 'block' }}>
                    Estado del Contrato
                  </FormLabel>
                  <FormControl fullWidth>
                    <Select
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      variant="outlined"
                      sx={selectStyle}
                      displayEmpty
                      startAdornment={
                        <InputAdornment position="start">
                          <CheckCircle sx={{ color: '#28044c', fontSize: 20 }} />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>Seleccione el estado</em>
                      </MenuItem>
                      <MenuItem value="1">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#4caf50" }} />
                          Activo
                        </Box>
                      </MenuItem>
                      <MenuItem value="0">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#f44336" }} />
                          Inactivo
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormLabel sx={{ fontWeight: '700', color: '#28044c', mb: 2, fontSize: '1rem', display: 'block' }}>
                    Estado de Pago
                  </FormLabel>
                  <FormControl fullWidth>
                    <Select
                      name="estado_pago"
                      value={formData.estado_pago}
                      onChange={handleChange}
                      variant="outlined"
                      sx={selectStyle}
                      displayEmpty
                      startAdornment={
                        <InputAdornment position="start">
                          <Payment sx={{ color: '#28044c', fontSize: 20 }} />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>Seleccione el estado</em>
                      </MenuItem>
                      <MenuItem value="1">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Payment sx={{ color: "#4caf50", fontSize: 16 }} />
                          Pagado
                        </Box>
                      </MenuItem>
                      <MenuItem value="0">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Payment sx={{ color: "#ff9800", fontSize: 16 }} />
                          Pendiente
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          backgroundColor: "#ffffff",
          borderTop: "1px solid #e0e0e0",
          gap: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          size="large"
          sx={{
            borderColor: "#28044c",
            color: "#28044c",
            borderWidth: 2,
            "&:hover": {
              borderColor: "#28044c",
              backgroundColor: "rgba(40, 4, 76, 0.04)",
              borderWidth: 2,
            },
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            textTransform: "none",
            fontWeight: '700',
            minWidth: "140px",
            transition: 'all 0.3s ease',
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleContratar}
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            backgroundColor: "#28044c",
            "&:hover": {
              backgroundColor: "rgba(40, 4, 76, 0.9)",
              transform: "translateY(-1px)",
              boxShadow: "0 6px 20px rgba(40, 4, 76, 0.3)",
            },
            "&:disabled": {
              backgroundColor: "#ccc",
            },
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "700",
            textTransform: "none",
            transition: "all 0.3s ease",
            minWidth: "140px",
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Security fontSize="small" />
              Contratar Seguro
            </Box>
          )}
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