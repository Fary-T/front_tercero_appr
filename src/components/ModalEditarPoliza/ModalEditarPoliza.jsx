import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Alert,
} from '@mui/material';

export const ModalEditarPoliza = ({ open, onClose, poliza, onGuardar }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    tiempo_pago: '',
    descripcion: ''
  });

  const [errors, setErrors] = useState({});
  const [planOriginal, setPlanOriginal] = useState(null);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Planes predefinidos para referencia
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

  // Combinar todos los planes disponibles
  const todosLosPlanes = {
    ...planesVida,
    ...planesSalud,
    'personalizado': {
      nombre: 'Plan Personalizado',
      precio: '',
      descripcion: 'Configure su propio plan'
    }
  };

  useEffect(() => {
    if (poliza) {
      setFormData({
        nombre: poliza.nombre || '',
        precio: poliza.precio || '',
        tiempo_pago: poliza.tiempo_pago || '',
        descripcion: poliza.descripcion || ''
      });

      // Determinar el plan original y fijarlo
      const planEncontrado = Object.entries(todosLosPlanes).find(([key, plan]) => 
        plan.nombre === poliza.nombre && key !== 'personalizado'
      );
      
      if (planEncontrado) {
        setPlanOriginal({
          key: planEncontrado[0],
          ...planEncontrado[1]
        });
      } else {
        setPlanOriginal({
          key: 'personalizado',
          nombre: 'Plan Personalizado',
          descripcion: 'Plan creado de forma personalizada'
        });
      }
    }
  }, [poliza]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'tiempo_pago') {
      // Validar que esté entre 1 y 12 meses
      const tiempo = parseInt(value);
      if (value === '' || (tiempo >= 1 && tiempo <= 12)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'precio') {
      // Validar que sea un número positivo
      const precio = parseFloat(value);
      if (value === '' || (precio > 0 && precio <= 10000)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'nombre') {
      // Validar longitud del nombre
      if (value.length <= 100) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'descripcion') {
      // Validar longitud de la descripción
      if (value.length <= 500) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.precio) {
      newErrors.precio = "El precio es requerido";
    } else {
      const precio = parseFloat(formData.precio);
      if (precio <= 0) {
        newErrors.precio = "El precio debe ser mayor a 0";
      } else if (precio > 10000) {
        newErrors.precio = "El precio no puede ser mayor a $10,000";
      }
    }
    
    if (!formData.tiempo_pago) {
      newErrors.tiempo_pago = "El tiempo de pago es requerido";
    } else {
      const tiempo = parseInt(formData.tiempo_pago);
      if (tiempo < 1 || tiempo > 12) {
        newErrors.tiempo_pago = "Debe estar entre 1 y 12 meses";
      }
    }
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    } else if (formData.descripcion.length < 10) {
      newErrors.descripcion = "La descripción debe tener al menos 10 caracteres";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGuardar = async () => {
    if (!validate()) return;

    const { nombre, precio, tiempo_pago, descripcion } = formData;

    try {
      const response = await fetch(`http://35.172.129.60:3030/seguro/editar/${poliza.id_seguro}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          precio: parseFloat(precio),
          tiempo_pago: parseInt(tiempo_pago),
          descripcion: descripcion.trim(),
          tipo: poliza.tipo // Mantener el tipo original
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Póliza actualizada correctamente");
        onGuardar?.();
        onClose();
      } else {
        alert(data.error || "Error al actualizar la póliza");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al servidor");
    }
  };

  const esPlanPersonalizado = planOriginal?.key === 'personalizado';

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
          ✏️ Editar Póliza
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 4, backgroundColor: "#f5f0f9" }}>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Información del Plan Base (Solo lectura) */}
            {planOriginal && (
              <Grid item xs={12}>
                <Alert 
                  severity="info"
                  sx={{
                    backgroundColor: "#e3f2fd",
                    color: "#0d47a1",
                    "& .MuiAlert-icon": {
                      color: "#1976d2"
                    }
                  }}
                >
                  <Typography variant="body2" fontWeight="600">
                    Plan: {formData.nombre}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                    {planOriginal.descripcion}
                    {planOriginal.precio && ` - Precio base: $${planOriginal.precio}/mes`}
                  </Typography>
                </Alert>
              </Grid>
            )}

            {/* Precio */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
                sx={{ color: "#28044c", fontWeight: 600 }}
              >
                Precio (USD/mes) *
              </Typography>
              <TextField
                fullWidth
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                variant="outlined"
                size="small"
                placeholder="0.00"
                inputProps={{ 
                  min: 0.01, 
                  max: 10000, 
                  step: 0.01 
                }}
                error={!!errors.precio}
                helperText={errors.precio}
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

            {/* Tiempo de Pago */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
                sx={{ color: "#28044c", fontWeight: 600 }}
              >
                Tiempo de Pago (meses) *
              </Typography>
              <TextField
                fullWidth
                type="number"
                name="tiempo_pago"
                value={formData.tiempo_pago}
                onChange={handleChange}
                variant="outlined"
                size="small"
                placeholder="1-12"
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
                Descripción *
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                variant="outlined"
                size="small"
                placeholder="Describa las características y beneficios del seguro"
                error={!!errors.descripcion}
                helperText={errors.descripcion}
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
          onClick={onClose}
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
            minWidth: fullScreen ? "120px" : "140px",
          }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalEditarPoliza.propTypes = {};