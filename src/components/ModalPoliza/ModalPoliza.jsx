import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
} from '@mui/material';
import './ModalPoliza.css';

export const ModalPoliza = ({ open, onClose, onGuardar }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    nombre: '',
    precio: '',
    tiempo_pago: '',
    descripcion: '',
    tipo: null
  });

  const [requisitos, setRequisitos] = useState([]);
  const [requisitosCompletados, setRequisitosCompletados] = useState({});
  const [errors, setErrors] = useState({});

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const requisitosVida = [
    "Cédula de identidad",
    "Papeleta de votación",
    "Recibo de luz",
    "Subida de historial clínico",
    "Subida de historial de ingresos",
    "Pago inicial"
  ];

  const requisitosSalud = [
    "Cédula de identidad",
    "Pago de luz",
    "Papeleta de votación",
    "Tipo de sangre",
    "Historial clínico",
    "Certificado de ingresos",
    "Pago inicial"
  ];

  // Planes predefinidos con descripciones VARCHAR(50)
  const planesSalud = {
    'basico': {
      nombre: 'Plan Básico Salud',
      precio: 20,
      descripcion: 'Consultas médicas y descuentos farmacia'
    },
    'familiar': {
      nombre: 'Plan Familiar Salud',
      precio: 45,
      descripcion: 'Cobertura familiar y urgencias 24/7'
    },
    'premium': {
      nombre: 'Plan Premium Salud',
      precio: 70,
      descripcion: 'Hospitalización y chequeos anuales'
    }
  };

  const planesVida = {
    'esencial': {
      nombre: 'Plan Vida Esencial',
      precio: 15,
      descripcion: 'Cobertura por fallecimiento'
    },
    'plus': {
      nombre: 'Plan Vida Plus',
      precio: 30,
      descripcion: 'Cobertura extendida y accidentes'
    },
    'integral': {
      nombre: 'Plan Vida Integral',
      precio: 50,
      descripcion: 'Ahorro a largo plazo y cobertura global'
    }
  };

  const [planSeleccionado, setPlanSeleccionado] = useState('');

  useEffect(() => {
    if (!open) {
      setFormData({
        usuario: '',
        nombre: '',
        precio: '',
        tiempo_pago: '',
        descripcion: '',
        tipo: null
      });
      setErrors({});
      setRequisitos([]);
      setRequisitosCompletados({});
      setPlanSeleccionado('');
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'tipo') {
      const tipoNumerico = parseInt(value);
      const nuevosRequisitos = tipoNumerico === 0 ? requisitosVida : requisitosSalud;
      
      setFormData(prev => ({
        ...prev,
        tipo: tipoNumerico,
        nombre: '',
        precio: '',
        descripcion: ''
      }));
      setPlanSeleccionado('');
      setRequisitos(nuevosRequisitos);
      
      // Inicializar todos los requisitos como no completados
      const requisitosIniciales = {};
      nuevosRequisitos.forEach(req => {
        requisitosIniciales[req] = false;
      });
      setRequisitosCompletados(requisitosIniciales);
      
    } else if (name === 'plan') {
      const planes = formData.tipo === 0 ? planesVida : planesSalud;
      const plan = planes[value];
      
      if (plan) {
        setFormData(prev => ({
          ...prev,
          nombre: plan.nombre,
          precio: plan.precio,
          descripcion: plan.descripcion
        }));
        setPlanSeleccionado(value);
      }
    } else if (name === 'tiempo_pago') {
      // Validar que esté entre 1 y 12
      const tiempo = parseInt(value);
      if (value === '' || (tiempo >= 1 && tiempo <= 12)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRequisitoChange = (requisito, completado) => {
    setRequisitosCompletados(prev => ({
      ...prev,
      [requisito]: completado
    }));
  };

  const todosRequisitosCompletados = () => {
    return Object.values(requisitosCompletados).every(completado => completado);
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.usuario.trim()) newErrors.usuario = "Campo requerido";
    if (formData.tipo === null) newErrors.tipo = "Selecciona un tipo de póliza";
    if (!planSeleccionado) newErrors.plan = "Selecciona un plan";
    if (!formData.tiempo_pago) {
      newErrors.tiempo_pago = "Campo requerido";
    } else {
      const tiempo = parseInt(formData.tiempo_pago);
      if (tiempo < 1 || tiempo > 12) {
        newErrors.tiempo_pago = "Debe estar entre 1 y 12 meses";
      }
    }
    
    // Validar que todos los requisitos estén completados
    if (requisitos.length > 0 && !todosRequisitosCompletados()) {
      newErrors.requisitos = "Debe completar todos los requisitos antes de continuar";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGuardar = async () => {
    if (!validate()) return;

    const { usuario, nombre, precio, tiempo_pago, descripcion, tipo } = formData;

    try {
      const response = await fetch("http://localhost:3030/seguro/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario,
          nombre,
          precio: parseFloat(precio),
          tiempo_pago: parseInt(tiempo_pago),
          descripcion,
          tipo,
          requisitos_completados: requisitosCompletados
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Póliza agregada exitosamente");
        handleClose();
        onGuardar?.();
      } else {
        alert(data.error || "Error al agregar la póliza");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("No se pudo conectar al servidor");
    }
  };

  const handleClose = () => {
    setFormData({
      usuario: '',
      nombre: '',
      precio: '',
      tiempo_pago: '',
      descripcion: '',
      tipo: null
    });
    setErrors({});
    setRequisitos([]);
    setRequisitosCompletados({});
    setPlanSeleccionado('');
    onClose();
  };

  const getPlanesDisponibles = () => {
    if (formData.tipo === 0) return planesVida;
    if (formData.tipo === 1) return planesSalud;
    return {};
  };

  const camposHabilitados = todosRequisitosCompletados();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          📋 Registrar Nueva Póliza
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 4, backgroundColor: "#f5f0f9" }}>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Usuario */}
            <Grid item xs={12}>
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
                sx={{ color: "#28044c", fontWeight: 600 }}
              >
                Usuario
              </Typography>
              <TextField
                fullWidth
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                variant="outlined"
                size="small"
                placeholder="Ingrese el nombre del usuario"
                error={!!errors.usuario}
                helperText={errors.usuario}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#ede5f2",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#8249a0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#28044c",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#28044c",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#28044c",
                  },
                }}
              />
            </Grid>

            {/* Tipo de Póliza */}
            <Grid item xs={12}>
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
                sx={{ color: "#28044c", fontWeight: 600 }}
              >
                Tipo de Póliza
              </Typography>
              <ToggleButtonGroup
                value={formData.tipo}
                exclusive
                onChange={(event, newTipo) => {
                  if (newTipo !== null) {
                    handleChange({ target: { name: 'tipo', value: newTipo } });
                  }
                }}
                fullWidth
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  "& .MuiToggleButton-root": {
                    backgroundColor: "#ede5f2",
                    color: "#28044c",
                    border: "1px solid #8249a0",
                    "&:hover": {
                      backgroundColor: "#dccce5",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "#28044c",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#1f0336",
                      },
                    },
                  },
                }}
              >
                <ToggleButton value={0} sx={{ flex: 1 }}>
                  💛 Vida
                </ToggleButton>
                <ToggleButton value={1} sx={{ flex: 1 }}>
                  ✚ Salud
                </ToggleButton>
              </ToggleButtonGroup>
              {errors.tipo && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.tipo}
                </Typography>
              )}
            </Grid>

            {/* Mostrar requisitos dinámicos */}
            {requisitos.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: "#28044c", fontWeight: 600 }}>
                  Requisitos necesarios:
                </Typography>
                {!camposHabilitados && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Debe completar todos los requisitos para habilitar la selección del plan
                  </Alert>
                )}
                <FormGroup>
                  {requisitos.map((req, index) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox 
                          checked={requisitosCompletados[req] || false}
                          onChange={(e) => handleRequisitoChange(req, e.target.checked)}
                          sx={{ color: "#28044c" }}
                        />
                      }
                      label={req}
                      sx={{ color: "#28044c" }}
                    />
                  ))}
                </FormGroup>
                {errors.requisitos && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                    {errors.requisitos}
                  </Typography>
                )}
              </Grid>
            )}

            {/* Selector de Plan */}
            {formData.tipo !== null && (
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  gutterBottom
                  sx={{ color: "#28044c", fontWeight: 600 }}
                >
                  Seleccionar Plan
                </Typography>
                <TextField
                  fullWidth
                  select
                  name="plan"
                  value={planSeleccionado}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  disabled={!camposHabilitados}
                  error={!!errors.plan}
                  helperText={errors.plan}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: camposHabilitados ? "#ede5f2" : "#f5f5f5",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8249a0",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: camposHabilitados ? "#28044c" : "#8249a0",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#28044c",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: camposHabilitados ? "#28044c" : "#999",
                    },
                  }}
                >
                  {Object.entries(getPlanesDisponibles()).map(([key, plan]) => (
                    <MenuItem key={key} value={key}>
                      {plan.nombre} - ${plan.precio}/mes
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            {/* Información del Plan Seleccionado */}
            {planSeleccionado && (
              <>
                {/* Nombre del Seguro */}
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                    sx={{ color: "#28044c", fontWeight: 600 }}
                  >
                    Nombre del Seguro
                  </Typography>
                  <TextField
                    fullWidth
                    name="nombre"
                    value={formData.nombre}
                    variant="outlined"
                    size="small"
                    disabled
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#e8e8e8",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#cccccc",
                        },
                      },
                      "& .MuiInputBase-input.Mui-disabled": {
                        color: "#666666",
                        WebkitTextFillColor: "#666666",
                      },
                    }}
                  />
                </Grid>

                {/* Precio y Tiempo de Pago */}
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                    sx={{ color: "#28044c", fontWeight: 600 }}
                  >
                    Precio (USD/mes)
                  </Typography>
                  <TextField
                    fullWidth
                    name="precio"
                    value={`${formData.precio}`}
                    variant="outlined"
                    size="small"
                    disabled
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#e8e8e8",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#cccccc",
                        },
                      },
                      "& .MuiInputBase-input.Mui-disabled": {
                        color: "#666666",
                        WebkitTextFillColor: "#666666",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                    sx={{ color: "#28044c", fontWeight: 600 }}
                  >
                    Tiempo de Pago (1-12 meses)
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    name="tiempo_pago"
                    value={formData.tiempo_pago}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                    inputProps={{ min: 1, max: 12 }}
                    error={!!errors.tiempo_pago}
                    helperText={errors.tiempo_pago}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#ede5f2",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#8249a0",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#28044c",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#28044c",
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: "#28044c",
                      },
                    }}
                  />
                </Grid>

                {/* Descripción */}
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                    sx={{ color: "#28044c", fontWeight: 600 }}
                  >
                    Descripción del Plan
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    name="descripcion"
                    value={formData.descripcion}
                    variant="outlined"
                    size="small"
                    disabled
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#e8e8e8",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#cccccc",
                        },
                      },
                      "& .MuiInputBase-input.Mui-disabled": {
                        color: "#666666",
                        WebkitTextFillColor: "#666666",
                      },
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 4,
          pt: 2,
          justifyContent: "space-between",
          backgroundColor: "#f5f0f9",
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: "#28044c",
            color: "#28044c",
            "&:hover": {
              borderColor: "#1f0336",
              backgroundColor: "rgba(40, 4, 76, 0.04)",
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
          onClick={handleGuardar}
          variant="contained"
          disabled={requisitos.length > 0 && !todosRequisitosCompletados()}
          sx={{
            background: requisitos.length > 0 && !todosRequisitosCompletados() 
              ? "linear-gradient(135deg, #999 0%, #666 100%)"
              : "linear-gradient(135deg, #28044c 0%, #4a1b6b 100%)",
            "&:hover": requisitos.length > 0 && !todosRequisitosCompletados() ? {} : {
              background: "linear-gradient(135deg, #1f0336 0%, #3d1558 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(40, 4, 76, 0.25)",
            },
            "&.Mui-disabled": {
              background: "linear-gradient(135deg, #999 0%, #666 100%)",
              color: "#ffffff",
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
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalPoliza.propTypes = {};