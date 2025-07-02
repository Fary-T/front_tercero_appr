import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Fade,
  Divider,
  useMediaQuery,
  useTheme
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import SecurityIcon from '@mui/icons-material/Security';
import SaveIcon from '@mui/icons-material/Save';

export const ModalEditarUsuarioCliente = ({ open, onClose, usuario, onGuardar }) => {
  const [formData, setFormData] = useState({
    id_usuario: usuario?.id_usuario || '',
    nombre: usuario?.nombre || '',
    apellido: usuario?.apellido || '',
    cedula: usuario?.cedula || '',
    correo: usuario?.correo || '',
    telefono: usuario?.telefono || '',
    username: usuario?.username || '',
  });
  const [errors, setErrors] = useState({});
  
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setFormData(usuario || {});
    setErrors({});
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre?.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    if (!formData.apellido?.trim()) {
      newErrors.apellido = "El apellido es requerido";
    }
    if (!formData.cedula?.trim()) {
      newErrors.cedula = "La cédula es requerida";
    }
    if (formData.correo && !/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = "Formato de correo inválido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGuardar = async () => {
    if (validateForm()) {
      try {
        if (!formData.id_usuario) {
          alert("Error: No se puede editar el usuario sin un ID válido");
          return;
        }

        const response = await fetch(`https://r4jdf9tl-3030.use.devtunnels.ms/usuario/editar/${formData.id_usuario}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
          alert("Usuario editado correctamente");
          onClose();
          if (typeof onGuardar === 'function') onGuardar();
        } else {
          alert(data.error || "Error al editar usuario");
        }
      } catch (error) {
        console.error("Error al editar usuario:", error);
        alert("No se pudo editar el usuario");
      }
    }
  };

  const getInitials = (nombre, apellido) => {
    const inicial1 = nombre ? nombre.charAt(0).toUpperCase() : "";
    const inicial2 = apellido ? apellido.charAt(0).toUpperCase() : "";
    return inicial1 + inicial2;
  };

  const fieldGroups = [
    {
      title: "Información Personal",
      icon: <PersonIcon sx={{ color: "#6b46c1" }} />,
      color: "#4a1b6b",
      bgColor: "#f3e8ff",
      fields: [
        { key: "nombre", label: "Nombre", required: true },
        { key: "apellido", label: "Apellido", required: true },
        { key: "cedula", label: "Cédula", required: true },
      ]
    },
    {
      title: "Información de Contacto",
      icon: <ContactPhoneIcon sx={{ color: "#9333ea" }} />,
      color: "#4a1b6b",
      bgColor: "#f3e8ff",
      fields: [
        { key: "correo", label: "Correo Electrónico", type: "email" },
        { key: "telefono", label: "Teléfono" },
      ]
    },
    {
      title: "Información de Cuenta",
      icon: <SecurityIcon sx={{ color: "#4a1b6b" }} />,
      color: "#4a1b6b",
      bgColor: "#f3e8ff",
      fields: [
        { key: "username", label: "Nombre de usuario" },
      ]
    }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
          maxHeight: "90vh"
        }
      }}
      TransitionComponent={Fade}
      transitionDuration={400}
    >
      {/* Header con gradiente */}
      <Box sx={{
        background: "linear-gradient(135deg, rgb(60, 30, 129) 0%, rgb(60, 10, 107) 100%)",
        color: "white",
        p: 3,
        position: "relative"
      }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            color: "white",
            backdropFilter: "blur(10px)",
            '&:hover': {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              transform: "scale(1.05)"
            },
            transition: "all 0.2s ease"
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              fontSize: "1.5rem",
              fontWeight: "bold",
              border: "3px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            {getInitials(formData.nombre, formData.apellido)}
          </Avatar>
          
          <Box>
            <Typography variant="h5" fontWeight="700" sx={{ mb: 0.5 }}>
              Editar Información
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Actualiza los datos del cliente
            </Typography>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ p: 0, backgroundColor: "#fafafa" }}>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid container spacing={3}>
            {fieldGroups.map((group, groupIndex) => (
              <Grid item xs={12} key={groupIndex}>
                <Card
                  elevation={0}
                  sx={{
                    backgroundColor: group.bgColor,
                    borderRadius: 3,
                    border: `1px solid ${group.color}20`,
                    transition: "all 0.3s ease",
                    '&:hover': {
                      transform: "translateY(-1px)",
                      boxShadow: `0 6px 20px ${group.color}15`
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 3
                    }}>
                      <Box sx={{
                        p: 1,
                        borderRadius: 2,
                        backgroundColor: "white",
                        boxShadow: `0 4px 12px ${group.color}20`
                      }}>
                        {group.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        fontWeight="700"
                        sx={{ color: group.color }}
                      >
                        {group.title}
                      </Typography>
                    </Box>

                    <Grid container spacing={2}>
                      {group.fields.map((field) => (
                        <Grid
                          item
                          xs={12}
                          sm={group.fields.length === 1 ? 12 : 6}
                          key={field.key}
                        >
                          <TextField
                            label={field.label}
                            name={field.key}
                            type={field.type || "text"}
                            fullWidth
                            required={field.required}
                            value={formData[field.key] || ""}
                            onChange={handleChange}
                            error={!!errors[field.key]}
                            helperText={errors[field.key]}
                            variant="outlined"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: "white",
                                borderRadius: 2,
                                fontWeight: "500",
                                transition: "all 0.2s ease-in-out",
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: group.color,
                                  borderWidth: 2
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: group.color,
                                  borderWidth: 2
                                },
                                '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                                  borderColor: "#ef4444",
                                }
                              },
                              '& .MuiInputLabel-root': {
                                fontWeight: "600",
                                '&.Mui-focused': { 
                                  color: group.color 
                                },
                                '&.Mui-error': {
                                  color: "#ef4444"
                                }
                              },
                              '& .MuiFormHelperText-root': {
                                fontWeight: "500"
                              }
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>

                {groupIndex < fieldGroups.length - 1 && (
                  <Divider sx={{ my: 2, borderColor: "divider" }} />
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        backgroundColor: "white",
        borderTop: "1px solid",
        borderColor: "divider",
        gap: 2
      }}>
        <Button
          onClick={onClose}
          variant="outlined"
          size="large"
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1,
            borderColor: "#6b46c1",
            color: "#6b46c1",
            fontWeight: "600",
            textTransform: "none",
            '&:hover': {
              borderColor: "#4a1b6b",
              backgroundColor: "#f3e8ff",
              transform: "translateY(-1px)"
            },
            transition: "all 0.2s ease"
          }}
        >
          Cancelar
        </Button>
        
        <Button
          onClick={handleGuardar}
          variant="contained"
          size="large"
          startIcon={<SaveIcon />}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1,
            background: "linear-gradient(135deg, rgb(55, 14, 150) 0%, rgb(57, 6, 105) 100%)",
            boxShadow: "0 6px 20px rgba(107, 70, 193, 0.3)",
            fontWeight: "600",
            fontSize: "1rem",
            textTransform: "none",
            '&:hover': {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(107, 70, 193, 0.4)",
            },
            transition: "all 0.2s ease"
          }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};
