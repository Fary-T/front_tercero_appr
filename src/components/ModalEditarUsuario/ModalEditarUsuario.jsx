import React, { useState, useEffect } from "react";
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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Box,
  Divider,
  IconButton,
  Chip,
  Alert,
  InputAdornment,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import {
  Close,
  Person,
  Email,
  Phone,
  Badge,
  AccountCircle,
  Settings,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

export const ModalEditarUsuario = ({ open, onClose, usuario, onGuardar }) => {
  const [formData, setFormData] = useState({
    id_usuario: "",
    nombre: "",
    correo: "",
    telefono: "",
    username: "",
    password: "",
    apellido: "",
    tipo: "",
    activo: "",
    cedula: "",
    rol: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (usuario && open) {
      setFormData({ ...usuario });
      setErrors({});
    }
  }, [usuario, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateField = (name, value) => {
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const soloNumeros10 = /^\d{10}$/;
    const correoValido =
      /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo|icloud|live|protonmail|zoho|gmx|aol|mail)\.(com|es|net|org|co|info|me|us)$/i;

    switch (name) {
      case 'correo':
        return !correoValido.test(value) ? 'Correo inválido. Solo dominios permitidos como gmail.com, hotmail.com, etc.' : null;
      case 'nombre':
        return !soloLetras.test(value) ? 'El nombre solo debe contener letras' : null;
      case 'apellido':
        return !soloLetras.test(value) ? 'El apellido solo debe contener letras' : null;
      case 'cedula':
        return !soloNumeros10.test(value) ? 'La cédula debe contener exactamente 10 números' : null;
      case 'telefono':
        return !soloNumeros10.test(value) ? 'El teléfono debe contener exactamente 10 números' : null;
      case 'rol':
        return !value.trim() ? 'El rol es requerido' : null;
      default:
        return null;
    }
  };

  const validarCampos = () => {
    const newErrors = {};
    
    // Solo validar campos que no son credenciales
    const fieldsToValidate = ['nombre', 'apellido', 'cedula', 'telefono', 'correo', 'rol'];
    
    fieldsToValidate.forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (![0, 1, 2].includes(Number(formData.tipo))) {
      newErrors.tipo = 'Selecciona un tipo válido';
    }

    if (!["1", "0"].includes(String(formData.activo))) {
      newErrors.activo = 'El estado debe ser activo o inactivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGuardar = async () => {
    if (!validarCampos()) return;

    if (!formData.id_usuario) {
      alert("Error: No se puede editar el usuario sin un ID válido");
      return;
    }

    setIsLoading(true);
    try {
      // Crear una copia del formData sin las credenciales para enviar
      const { username, password, ...dataToSend } = formData;
      
      const response = await fetch(
        `http://35.172.129.60:3030/usuario/editar2/${formData.id_usuario}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Usuario editado correctamente");
        onClose();
        if (typeof onGuardar === "function") onGuardar();
      } else {
        alert(data.error || "Error al editar usuario");
      }
    } catch (error) {
      console.error("Error al editar usuario:", error);
      alert("No se pudo editar el usuario");
    } finally {
      setIsLoading(false);
    }
  };

  const getTipoLabel = (tipo) => {
    switch (Number(tipo)) {
      case 0: return { label: 'Administrador', color: '#28044c' };
      case 1: return { label: 'Agente', color: '#28044c' };
      case 2: return { label: 'Cliente', color: '#28044c' };
      default: return { label: 'Sin definir', color: '#9e9e9e' };
    }
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
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Person sx={{ fontSize: 28 }} />
          <Typography variant="h5" fontWeight="600" letterSpacing="0.5px">
            Editar Usuario
          </Typography>
        </Box>
        
        <Box display="flex" alignItems="center" gap={1.5}>
          <Chip
            label={getTipoLabel(formData.tipo).label}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.75rem',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}
          />
          <Chip
            icon={formData.activo === "1" ? <CheckCircle sx={{ fontSize: 16 }} /> : <Cancel sx={{ fontSize: 16 }} />}
            label={formData.activo === "1" ? "Activo" : "Inactivo"}
            sx={{
              backgroundColor: formData.activo === "1" ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.75rem'
            }}
          />
          <IconButton
            onClick={onClose}
            sx={{ 
              color: 'white', 
              ml: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
            size="small"
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, backgroundColor: "#fafafa" }}>
        <Box sx={{ p: 4 }}>
          {/* Información Personal */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Person sx={{ color: '#28044c', fontSize: 24 }} />
              <Typography variant="h6" fontWeight="700" color="#28044c">
                Información Personal
              </Typography>
            </Box>
            <Divider sx={{ mb: 3, borderColor: '#e0e0e0' }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  error={!!errors.nombre}
                  helperText={errors.nombre}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge sx={{ color: '#28044c', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  error={!!errors.apellido}
                  helperText={errors.apellido}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge sx={{ color: '#28044c', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Cédula"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  error={!!errors.cedula}
                  helperText={errors.cedula}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle sx={{ color: '#28044c', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  error={!!errors.telefono}
                  helperText={errors.telefono}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: '#28044c', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyle}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Correo Electrónico"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  error={!!errors.correo}
                  helperText={errors.correo}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#28044c', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyle}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Configuración del Usuario */}
          <Box>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Settings sx={{ color: '#28044c', fontSize: 24 }} />
              <Typography variant="h6" fontWeight="700" color="#28044c">
                Configuración del Usuario
              </Typography>
            </Box>
            <Divider sx={{ mb: 3, borderColor: '#e0e0e0' }} />
            
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel sx={{ fontWeight: '700', color: '#28044c', mb: 2, fontSize: '1rem' }}>
                    Estado del Usuario
                  </FormLabel>
                  <RadioGroup
                    value={formData.activo}
                    onChange={(e) => setFormData({ ...formData, activo: e.target.value })}
                    row
                    sx={{ gap: 2 }}
                  >
                    <FormControlLabel
                      value="1"
                      control={<Radio sx={{ color: '#4caf50', '&.Mui-checked': { color: '#4caf50' } }} />}
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <CheckCircle sx={{ color: '#4caf50', fontSize: 18 }} />
                          <Typography variant="body1" fontWeight="600">Activo</Typography>
                        </Box>
                      }
                      sx={{
                        backgroundColor: formData.activo === "1" ? 'rgba(76, 175, 80, 0.08)' : 'transparent',
                        borderRadius: 2,
                        px: 2,
                        py: 1.5,
                        mr: 2,
                        border: formData.activo === "1" ? '2px solid #4caf50' : '2px solid #e0e0e0',
                        transition: 'all 0.2s ease'
                      }}
                    />
                    <FormControlLabel
                      value="0"
                      control={<Radio sx={{ color: '#f44336', '&.Mui-checked': { color: '#f44336' } }} />}
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Cancel sx={{ color: '#f44336', fontSize: 18 }} />
                          <Typography variant="body1" fontWeight="600">Inactivo</Typography>
                        </Box>
                      }
                      sx={{
                        backgroundColor: formData.activo === "0" ? 'rgba(244, 67, 54, 0.08)' : 'transparent',
                        borderRadius: 2,
                        px: 2,
                        py: 1.5,
                        border: formData.activo === "0" ? '2px solid #f44336' : '2px solid #e0e0e0',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormLabel sx={{ fontWeight: '700', color: '#28044c', mb: 2, fontSize: '1rem', display: 'block' }}>
                  Rol Asignado
                </FormLabel>
                <TextField
                  value={formData.rol}
                  fullWidth
                  disabled
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Settings sx={{ color: '#28044c', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f5f5f5",
                      borderRadius: 2,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e0e0e0",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: "#666",
                      WebkitTextFillColor: "#666",
                      fontWeight: 600,
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl>
                  <FormLabel sx={{ fontWeight: '700', color: '#28044c', mb: 2, fontSize: '1rem' }}>
                    Tipo de Usuario
                  </FormLabel>
                  {Number(formData.tipo) === 2 ? (
                    <Alert 
                      severity="info" 
                      sx={{ 
                        borderRadius: 2,
                        backgroundColor: 'rgba(33, 150, 243, 0.08)',
                        color: '#1976d2',
                        border: '1px solid rgba(33, 150, 243, 0.3)',
                        '& .MuiAlert-icon': {
                          color: '#1976d2'
                        }
                      }}
                    >
                      <Typography variant="body2" fontWeight="600">
                        Los usuarios tipo <strong>Cliente</strong> no pueden cambiar su tipo desde este formulario.
                      </Typography>
                    </Alert>
                  ) : (
                    <ToggleButtonGroup
                      value={Number(formData.tipo)}
                      exclusive
                      onChange={(event, newTipo) => {
                        if (newTipo !== null && newTipo !== 2) {
                          const rolMap = { 0: "admin", 1: "agente" };
                          setFormData({
                            ...formData,
                            tipo: newTipo,
                            rol: rolMap[newTipo],
                          });
                        }
                      }}
                      sx={{
                        width: '100%',
                        gap: 2,
                        "& .MuiToggleButton-root": {
                          flex: 1,
                          backgroundColor: "#ffffff",
                          color: "#28044c",
                          border: "2px solid #e0e0e0",
                          borderRadius: 2,
                          py: 2.5,
                          px: 3,
                          fontWeight: '700',
                          textTransform: 'none',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease',
                          "&:hover": {
                            backgroundColor: "rgba(40, 4, 76, 0.04)",
                            borderColor: "#28044c",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 12px rgba(40, 4, 76, 0.15)",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "#28044c",
                            color: "white",
                            borderColor: "#28044c",
                            "&:hover": {
                              backgroundColor: "rgba(40, 4, 76, 0.9)",
                            },
                          },
                        },
                      }}
                    >
                      <ToggleButton value={0}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Settings sx={{ fontSize: 22 }} />
                          <Typography variant="body1" fontWeight="700">
                            Administrador
                          </Typography>
                        </Box>
                      </ToggleButton>
                      <ToggleButton value={1}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Person sx={{ fontSize: 22 }} />
                          <Typography variant="body1" fontWeight="700">
                            Agente
                          </Typography>
                        </Box>
                      </ToggleButton>
                    </ToggleButtonGroup>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Box>
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
          onClick={handleGuardar}
          variant="contained"
          size="large"
          disabled={isLoading}
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
          {isLoading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
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
    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: "#f44336",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666",
    fontWeight: 600,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#28044c",
  },
  "& .MuiInputLabel-root.Mui-error": {
    color: "#f44336",
  },
  "& .MuiFormHelperText-root": {
    fontSize: "0.75rem",
    marginTop: 1,
    fontWeight: 500,
  },
};