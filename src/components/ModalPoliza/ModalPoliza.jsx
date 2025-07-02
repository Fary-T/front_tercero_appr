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
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import './ModalPoliza.css';

export const ModalPoliza = ({ open, onClose, onGuardar }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    tiempo_pago: '',
    descripcion: '',
    tipo: 0
  });

  const [errors, setErrors] = useState({});
  const [planSeleccionado, setPlanSeleccionado] = useState('esencial');
  const [esNuevoPlan, setEsNuevoPlan] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const planesSalud = {
    'basico': { nombre: 'Plan Básico Salud', precio: 20, descripcion: 'Consultas médicas y descuentos farmacia' },
    'familiar': { nombre: 'Plan Familiar Salud', precio: 45, descripcion: 'Cobertura familiar y urgencias 24/7' },
    'premium': { nombre: 'Plan Premium Salud', precio: 70, descripcion: 'Hospitalización y chequeos anuales' }
  };

  const planesVida = {
    'esencial': { nombre: 'Plan Vida Esencial', precio: 15, descripcion: 'Cobertura por fallecimiento' },
    'plus': { nombre: 'Plan Vida Plus', precio: 30, descripcion: 'Cobertura extendida y accidentes' },
    'integral': { nombre: 'Plan Vida Integral', precio: 50, descripcion: 'Ahorro a largo plazo y cobertura global' }
  };

  const actualizarCamposPorPlan = (tipoPlan, planKey) => {
    const planes = tipoPlan === 0 ? planesVida : planesSalud;
    const plan = planes[planKey];
    
    if (plan) {
      setFormData(prev => ({
        ...prev,
        nombre: plan.nombre,
        precio: plan.precio,
        descripcion: plan.descripcion,
        tipo: tipoPlan
      }));
    }
  };

  const limpiarFormulario = () => {
    setFormData({ nombre: '', precio: '', tiempo_pago: '', descripcion: '', tipo: 0 });
    setPlanSeleccionado('esencial');
    setEsNuevoPlan(false);
    setErrors({});
  };

  useEffect(() => {
    if (open) {
      limpiarFormulario();
      setTimeout(() => actualizarCamposPorPlan(0, 'esencial'), 100);
    } else {
      limpiarFormulario();
    }
  }, [open]);

  const handleTipoChange = (event, nuevoTipo) => {
    if (nuevoTipo !== null) {
      const primerPlan = nuevoTipo === 0 ? 'esencial' : 'basico';
      setPlanSeleccionado(primerPlan);
      
      if (!esNuevoPlan) {
        actualizarCamposPorPlan(nuevoTipo, primerPlan);
      } else {
        setFormData(prev => ({ ...prev, tipo: nuevoTipo, nombre: '', precio: '', descripcion: '' }));
      }
    }
  };

  const handlePlanChange = (event) => {
    const nuevoPlan = event.target.value;
    setPlanSeleccionado(nuevoPlan);
    
    if (nuevoPlan === 'nuevo') {
      setEsNuevoPlan(true);
      setFormData(prev => ({ ...prev, nombre: '', precio: '', descripcion: '' }));
    } else {
      setEsNuevoPlan(false);
      actualizarCamposPorPlan(formData.tipo, nuevoPlan);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'tiempo_pago') {
      const tiempo = parseInt(value);
      if (value === '' || (tiempo >= 1 && tiempo <= 12)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (esNuevoPlan && ['nombre', 'precio', 'descripcion'].includes(name)) {
      if (name === 'precio') {
        const precio = parseFloat(value);
        if (value === '' || (precio >= 0 && precio <= 9999)) {
          setFormData(prev => ({ ...prev, [name]: value }));
        }
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.tiempo_pago) {
      newErrors.tiempo_pago = "Campo requerido";
    } else {
      const tiempo = parseInt(formData.tiempo_pago);
      if (tiempo < 1 || tiempo > 12) {
        newErrors.tiempo_pago = "Debe estar entre 1 y 12 meses";
      }
    }

    if (esNuevoPlan) {
      if (!formData.nombre.trim()) newErrors.nombre = "Nombre requerido";
      if (!formData.precio) {
        newErrors.precio = "Precio requerido";
      } else if (parseFloat(formData.precio) <= 0) {
        newErrors.precio = "El precio debe ser mayor a 0";
      }
      if (!formData.descripcion.trim()) newErrors.descripcion = "Descripción requerida";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGuardar = async () => {
    if (!validate()) return;

    const { nombre, precio, tiempo_pago, descripcion, tipo } = formData;

    try {
      const response = await fetch("http://localhost:3030/seguro/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          precio: parseFloat(precio),
          tiempo_pago: parseInt(tiempo_pago),
          descripcion,
          tipo
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
    limpiarFormulario();
    onClose();
  };

  const getPlanesDisponibles = () => {
    const planes = formData.tipo === 0 ? planesVida : planesSalud;
    return { ...planes, 'nuevo': { nombre: '➕ Crear Nueva Póliza', precio: 0, descripcion: '' } };
  };

  const renderCampo = (label, name, value, placeholder = "", multiline = false) => {
    const esEditable = esNuevoPlan && ['nombre', 'precio', 'descripcion'].includes(name);
    
    if (esEditable) {
      return (
        <TextField
          fullWidth
          multiline={multiline}
          rows={multiline ? 3 : 1}
          type={name === 'precio' ? 'number' : 'text'}
          name={name}
          value={value}
          onChange={handleChange}
          variant="outlined"
          size="small"
          placeholder={placeholder}
          error={!!errors[name]}
          helperText={errors[name]}
          inputProps={name === 'precio' ? { min: 0, max: 9999, step: 0.01 } : {}}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#fff",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#28044c" },
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1f0336" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#28044c" }
            },
            "& .MuiInputBase-input": { color: "#28044c" }
          }}
        />
      );
    }

    return (
      <Box sx={{ p: 2, backgroundColor: "#f0f0f0", borderRadius: 1, border: "1px solid #ccc", minHeight: multiline ? "80px" : "auto" }}>
        <Typography variant="body1" sx={{ color: "#28044c", fontWeight: name === 'precio' ? "bold" : "normal" }}>
          {name === 'precio' ? `$${value}` : value}
        </Typography>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen={fullScreen} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: fullScreen ? 0 : 2, m: fullScreen ? 0 : 2 } }}>
      
      <DialogTitle sx={{ background: "linear-gradient(135deg, #28044c 0%, #4a1b6b 100%)", color: "white", py: 3, textAlign: "center", boxShadow: "0 4px 20px rgba(40, 4, 76, 0.2)" }}>
        <Typography variant="h5" fontWeight="bold" sx={{ letterSpacing: "0.5px" }}>
          📋 {esNuevoPlan ? 'Crear Nueva Póliza' : 'Registrar Póliza'}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 4, backgroundColor: "#f5f0f9" }}>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ color: "#28044c", fontWeight: 600 }}>
                Tipo de Póliza *
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <ToggleButtonGroup value={formData.tipo} exclusive onChange={handleTipoChange}
                  sx={{ "& .MuiToggleButton-root": { border: "2px solid #28044c", color: "#28044c", fontWeight: "bold", px: 4, py: 1.5, "&.Mui-selected": { backgroundColor: "#28044c", color: "white", "&:hover": { backgroundColor: "#1f0336" } }, "&:hover": { backgroundColor: "rgba(40, 4, 76, 0.1)" } } }}>
                  <ToggleButton value={0}>💛 Vida</ToggleButton>
                  <ToggleButton value={1}>✚ Salud</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ color: "#28044c", fontWeight: 600 }}>
                Seleccionar Plan *
              </Typography>
              <TextField select fullWidth value={planSeleccionado} onChange={handlePlanChange} variant="outlined" size="small"
                sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#28044c" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1f0336" }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#28044c" } }, "& .MuiInputBase-input": { color: "#28044c", fontWeight: "600" } }}>
                {Object.entries(getPlanesDisponibles()).map(([key, plan]) => (
                  <MenuItem key={key} value={key}>
                    {key === 'nuevo' ? plan.nombre : `${plan.nombre} - $${plan.precio}/mes`}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ color: "#28044c", fontWeight: 600 }}>
                Nombre del Seguro {esNuevoPlan ? '*' : '(Automático)'}
              </Typography>
              {renderCampo("Nombre", "nombre", formData.nombre, "Ingrese el nombre del seguro")}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ color: "#28044c", fontWeight: 600 }}>
                Precio (USD/mes) {esNuevoPlan ? '*' : '- Automático'}
              </Typography>
              {renderCampo("Precio", "precio", formData.precio, "0.00")}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ color: "#28044c", fontWeight: 600 }}>
                Tiempo de Pago (1-12 meses) *
              </Typography>
              <TextField fullWidth type="number" name="tiempo_pago" value={formData.tiempo_pago} onChange={handleChange} variant="outlined" size="small"
                inputProps={{ min: 1, max: 12 }} placeholder="Ingrese los meses" error={!!errors.tiempo_pago} helperText={errors.tiempo_pago || "Este campo debe ser completado"}
                sx={{ "& .MuiOutlinedInput-root": { backgroundColor: formData.tiempo_pago ? "#ede5f2" : "#fff", border: formData.tiempo_pago ? "1px solid #8249a0" : "2px solid #ff9800", "& .MuiOutlinedInput-notchedOutline": { borderColor: formData.tiempo_pago ? "#8249a0" : "#ff9800" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#28044c" }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#28044c" } }, "& .MuiInputBase-input": { color: "#28044c" } }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ color: "#28044c", fontWeight: 600 }}>
                Descripción del Plan {esNuevoPlan ? '*' : '(Automática)'}
              </Typography>
              {renderCampo("Descripción", "descripcion", formData.descripcion, "Ingrese la descripción del plan", true)}
            </Grid>

          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 2, justifyContent: "space-between", backgroundColor: "#f5f0f9" }}>
        <Button onClick={handleClose} variant="outlined"
          sx={{ borderColor: "#28044c", color: "#28044c", "&:hover": { borderColor: "#1f0336", backgroundColor: "rgba(40, 4, 76, 0.04)" }, borderRadius: 3, px: 4, py: 1.5, fontSize: "1rem", fontWeight: "bold", textTransform: "none", transition: "all 0.3s ease", minWidth: fullScreen ? "120px" : "140px" }}>
          Cancelar
        </Button>

        <Button onClick={handleGuardar} variant="contained"
          sx={{ background: "linear-gradient(135deg, #28044c 0%, #4a1b6b 100%)", "&:hover": { background: "linear-gradient(135deg, #1f0336 0%, #3d1558 100%)", transform: "translateY(-2px)", boxShadow: "0 8px 25px rgba(40, 4, 76, 0.25)" }, borderRadius: 3, px: 4, py: 1.5, fontSize: "1rem", fontWeight: "bold", textTransform: "none", transition: "all 0.3s ease", minWidth: fullScreen ? "120px" : "140px" }}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalPoliza.propTypes = {};