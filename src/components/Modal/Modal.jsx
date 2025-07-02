import React, { useState } from "react";
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
  Paper,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Fade,
  IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import GroupIcon from "@mui/icons-material/Group";
import CloseIcon from "@mui/icons-material/Close";

export const Modal = ({ open, onClose, onGuardar }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    username: "",
    password: "",
    apellido: "",
    tipo: null,
    activo: "1",
    cedula: "",
    rol: "",
  });

  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const steps = ["Información Personal", "Credenciales", "Configuración"];

  const tiposUsuario = [
    {
      value: 0,
      label: "Administrador",
      rol: "admin",
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 32 }} />,
      description: "Acceso completo al sistema",
      color: "#6A1B9A",
      bgColor: "#F3E5F5",
    },
    {
      value: 1,
      label: "Agente",
      rol: "agente",
      icon: <SupportAgentIcon sx={{ fontSize: 32 }} />,
      description: "Gestión de clientes y seguros",
      color: "#4527A0",
      bgColor: "#EDE7F6",
    },
    {
      value: 2,
      label: "Cliente",
      rol: "cliente",
      icon: <GroupIcon sx={{ fontSize: 32 }} />,
      description: "Usuario final del sistema",
      color: "#7B1FA2",
      bgColor: "#F3E5F5",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleTipoChange = (tipo) => {
    const tipoSeleccionado = tiposUsuario.find(t => t.value === tipo);
    setFormData({
      ...formData,
      tipo: tipo,
      rol: tipoSeleccionado.rol,
    });
  };

  const validarPaso = (paso) => {
    const newErrors = {};

    if (paso === 0) {
      if (!formData.nombre.trim()) {
        newErrors.nombre = "El nombre es requerido";
      } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formData.nombre)) {
        newErrors.nombre = "El nombre solo debe contener letras";
      }

      if (!formData.apellido.trim()) {
        newErrors.apellido = "El apellido es requerido";
      } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formData.apellido)) {
        newErrors.apellido = "El apellido solo debe contener letras";
      }

      if (!formData.cedula.trim()) {
        newErrors.cedula = "La cédula es requerida";
      } else if (!/^\d{10}$/.test(formData.cedula)) {
        newErrors.cedula = "La cédula debe contener exactamente 10 números";
      }

      if (!formData.telefono.trim()) {
        newErrors.telefono = "El teléfono es requerido";
      } else if (!/^\d{10}$/.test(formData.telefono)) {
        newErrors.telefono = "El teléfono debe contener exactamente 10 números";
      }
    }

    if (paso === 1) {
      if (!formData.correo.trim()) {
        newErrors.correo = "El correo es requerido";
      } else if (!/^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo|icloud|live|protonmail|zoho|gmx|aol|mail)\.(com|es|net|org|co|info|me|us)$/i.test(formData.correo)) {
        newErrors.correo = "Correo inválido";
      }

      if (!formData.username.trim()) {
        newErrors.username = "El nombre de usuario es requerido";
      } else if (formData.username.length < 3) {
        newErrors.username = "El username debe tener al menos 3 caracteres";
      }

      if (!formData.password.trim()) {
        newErrors.password = "La contraseña es requerida";
      } else if (formData.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      }
    }

    if (paso === 2) {
      if (formData.tipo === null) {
        newErrors.tipo = "Debe seleccionar un tipo de usuario";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validarPaso(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleGuardar = async () => {
    if (!validarPaso(2)) return;

    setLoading(true);
    try {
      const response = await fetch("https://r4jdf9tl-3030.use.devtunnels.ms/usuario/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const tipoNombre = tiposUsuario.find(t => t.value === formData.tipo)?.label || "Usuario";
        alert(`${tipoNombre} agregado correctamente`);
        handleClose();
        if (typeof onGuardar === "function") onGuardar();
      } else {
        alert(data.error || "Error al agregar usuario");
      }
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      alert("No se pudo guardar el usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: "",
      correo: "",
      telefono: "",
      username: "",
      password: "",
      apellido: "",
      tipo: null,
      activo: "1",
      cedula: "",
      rol: "",
    });
    setActiveStep(0);
    setErrors({});
    onClose();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in={true} timeout={500}>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: "#6A1B9A", fontWeight: 600, mb: 2 }}>
                📋 Información Personal
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <PersonIcon sx={{ color: "#6A1B9A", mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: "#6A1B9A", fontWeight: 600 }}>
                      Nombre
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Ingrese el nombre"
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#FAFAFA",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#E1BEE7",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#6A1B9A",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#6A1B9A",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <PersonIcon sx={{ color: "#6A1B9A", mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: "#6A1B9A", fontWeight: 600 }}>
                      Apellido
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Ingrese el apellido"
                    error={!!errors.apellido}
                    helperText={errors.apellido}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#FAFAFA",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#E1BEE7",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#6A1B9A",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#6A1B9A",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <BadgeIcon sx={{ color: "#6A1B9A", mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: "#6A1B9A", fontWeight: 600 }}>
                      Cédula
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="1234567890"
                    error={!!errors.cedula}
                    helperText={errors.cedula}
                    inputProps={{ maxLength: 10 }}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#FAFAFA",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#E1BEE7",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#6A1B9A",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#6A1B9A",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <PhoneIcon sx={{ color: "#6A1B9A", mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: "#6A1B9A", fontWeight: 600 }}>
                      Teléfono
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="0987654321"
                    error={!!errors.telefono}
                    helperText={errors.telefono}
                    inputProps={{ maxLength: 10 }}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#FAFAFA",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#E1BEE7",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#6A1B9A",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#6A1B9A",
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );

      case 1:
        return (
          <Fade in={true} timeout={500}>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: "#6A1B9A", fontWeight: 600, mb: 2 }}>
                🔐 Credenciales de Acceso
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <EmailIcon sx={{ color: "#6A1B9A", mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: "#6A1B9A", fontWeight: 600 }}>
                      Correo Electrónico
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    name="correo"
                    type="email"
                    value={formData.correo}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="ejemplo@gmail.com"
                    error={!!errors.correo}
                    helperText={errors.correo}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#FAFAFA",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#E1BEE7",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#6A1B9A",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#6A1B9A",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <AccountCircleIcon sx={{ color: "#6A1B9A", mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: "#6A1B9A", fontWeight: 600 }}>
                      Nombre de Usuario
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="usuario123"
                    error={!!errors.username}
                    helperText={errors.username}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#FAFAFA",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#E1BEE7",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#6A1B9A",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#6A1B9A",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LockIcon sx={{ color: "#6A1B9A", mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: "#6A1B9A", fontWeight: 600 }}>
                      Contraseña
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Mínimo 6 caracteres"
                    error={!!errors.password}
                    helperText={errors.password}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#FAFAFA",
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#E1BEE7",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#6A1B9A",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#6A1B9A",
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );

      case 2:
        return (
          <Fade in={true} timeout={500}>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: "#6A1B9A", fontWeight: 600, mb: 2 }}>
                ⚙️ Configuración del Usuario
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ color: "#6A1B9A", fontWeight: 600, mb: 2 }}>
                  Selecciona el tipo de usuario:
                </Typography>
                {errors.tipo && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.tipo}
                  </Alert>
                )}
                <Grid container spacing={2}>
                  {tiposUsuario.map((tipo) => (
                    <Grid item xs={12} sm={4} key={tipo.value}>
                      <Card
                        sx={{
                          cursor: "pointer",
                          border: formData.tipo === tipo.value ? `3px solid ${tipo.color}` : "2px solid #E0E0E0",
                          backgroundColor: formData.tipo === tipo.value ? tipo.bgColor : "#FAFAFA",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: `0 8px 25px ${tipo.color}20`,
                            border: `2px solid ${tipo.color}`,
                          },
                          borderRadius: 3,
                        }}
                        onClick={() => handleTipoChange(tipo.value)}
                      >
                        <CardContent sx={{ textAlign: "center", py: 2 }}>
                          <Box sx={{ color: tipo.color, mb: 1 }}>
                            {tipo.icon}
                          </Box>
                          <Typography variant="h6" sx={{ color: tipo.color, fontWeight: 700, mb: 1 }}>
                            {tipo.label}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.85rem" }}>
                            {tipo.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="body1" sx={{ color: "#6A1B9A", fontWeight: 600, mb: 2 }}>
                  Estado del Usuario:
                </Typography>
                <Paper sx={{ p: 2, backgroundColor: "#F3E5F5", borderRadius: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.activo === "1"}
                        onChange={(e) => setFormData({ ...formData, activo: e.target.checked ? "1" : "0" })}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#6A1B9A",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                            backgroundColor: "#6A1B9A",
                          },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {formData.activo === "1" ? "Usuario Activo" : "Usuario Inactivo"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {formData.activo === "1" 
                            ? "El usuario podrá acceder al sistema" 
                            : "El usuario no podrá acceder al sistema"
                          }
                        </Typography>
                      </Box>
                    }
                  />
                </Paper>
              </Box>

              {formData.rol && (
                <Box sx={{ mt: 2 }}>
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2">
                      <strong>Rol asignado:</strong> {formData.rol.charAt(0).toUpperCase() + formData.rol.slice(1)}
                    </Typography>
                  </Alert>
                </Box>
              )}
            </Box>
          </Fade>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 3,
          m: fullScreen ? 0 : 2,
          background: "linear-gradient(135deg, #FAFAFA 0%, #F3E5F5 100%)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #24004c 100%)",
          color: "white",
          py: 2,
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PersonIcon sx={{ fontSize: 32, mr: 2 }} />
            <Typography variant="h5" fontWeight="bold">
              Registro de Usuario
            </Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3, mt: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-label.Mui-active": {
                      color: "#6A1B9A",
                      fontWeight: 600,
                    },
                    "& .MuiStepLabel-label.Mui-completed": {
                      color: "#6A1B9A",
                      fontWeight: 600,
                    },
                    "& .MuiStepIcon-root.Mui-active": {
                      color: "#6A1B9A",
                    },
                    "& .MuiStepIcon-root.Mui-completed": {
                      color: "#6A1B9A",
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: "white",
            boxShadow: "0 4px 20px rgba(106, 27, 154, 0.1)",
            minHeight: 300,
          }}
        >
          {renderStepContent(activeStep)}
        </Paper>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #FAFAFA 0%, #F3E5F5 100%)",
        }}
      >
        <Button
          onClick={activeStep === 0 ? handleClose : handleBack}
          variant="outlined"
          sx={{
            borderColor: "#6A1B9A",
            color: "#6A1B9A",
            "&:hover": {
              borderColor: "#4A148C",
              backgroundColor: "rgba(106, 27, 154, 0.04)",
            },
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "none",
            minWidth: 120,
          }}
        >
          {activeStep === 0 ? "Cancelar" : "Atrás"}
        </Button>

        <Button
          onClick={activeStep === steps.length - 1 ? handleGuardar : handleNext}
          variant="contained"
          disabled={loading}
          sx={{
            background: "linear-gradient(135deg, #6A1B9A 0%, #4A148C 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #4A148C 0%, #6A1B9A 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(106, 27, 154, 0.25)",
            },
            "&:disabled": {
              background: "#CCCCCC",
            },
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "none",
            transition: "all 0.3s ease",
            minWidth: 120,
          }}
        >
          {loading ? "Guardando..." : activeStep === steps.length - 1 ? "Crear Usuario" : "Siguiente"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

Modal.propTypes = {};