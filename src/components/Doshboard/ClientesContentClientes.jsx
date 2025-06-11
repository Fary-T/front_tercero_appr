import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  useMediaQuery,
  Skeleton,
  Alert,
  Avatar,
  Divider,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useUser } from "../../context/UserContext";

export const ClientesContentClientes = () => {
  const { usuario } = useUser();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    consultarClientes();
  }, []);

  const consultarClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("http://localhost:3030/usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        setClientes(data);
      } else {
        setError(data.mensaje || "Error al obtener los clientes");
      }
    } catch (error) {
      console.error("Error de conexión con el servidor:", error);
      setError("No se pudo conectar al servidor. Verifique su conexión.");
    } finally {
      setLoading(false);
    }
  };

  const clienteActual = clientes.find(
    (p) => p.id_usuario === usuario?.id_usuario && p.rol === "cliente"
  );

  const getInitials = (nombre, apellido) => {
    const inicial1 = nombre ? nombre.charAt(0).toUpperCase() : "";
    const inicial2 = apellido ? apellido.charAt(0).toUpperCase() : "";
    return inicial1 + inicial2;
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    // Formato básico para números de teléfono
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const fieldGroups = [
    {
      title: "Información Personal",
      icon: "👤",
      fields: [
        { key: "nombre", label: "Nombre", required: true },
        { key: "apellido", label: "Apellido", required: true },
        { key: "cedula", label: "Cédula", required: true },
      ]
    },
    {
      title: "Información de Contacto",
      icon: "📞",
      fields: [
        { key: "correo", label: "Correo Electrónico", type: "email" },
        { key: "telefono", label: "Teléfono", formatter: formatPhoneNumber },
      ]
    },
    {
      title: "Información de Cuenta",
      icon: "🔐",
      fields: [
        { key: "username", label: "Nombre de usuario" },
      ]
    }
  ];

  if (loading) {
    return (
      <Box p={isSmallScreen ? 2 : 4}>
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          sx={{ mb: 4, color: "#4a1b6b" }}
        >
          👤 Información del Cliente
        </Typography>
        
        <Paper
          elevation={4}
          sx={{
            p: 4,
            backgroundColor: "#f3e9ff",
            borderRadius: 4,
            border: "1px solid #e0d2f2",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Skeleton variant="circular" width={60} height={60} sx={{ mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="40%" height={24} />
            </Box>
          </Box>
          
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={isSmallScreen ? 2 : 4}>
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          sx={{ mb: 4, color: "#4a1b6b" }}
        >
          👤 Información del Cliente
        </Typography>
        
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-message': {
              fontSize: '1rem'
            }
          }}
        >
          {error}
        </Alert>
        
        <Box textAlign="center">
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            No se pudo cargar la información del cliente
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!clienteActual) {
    return (
      <Box p={isSmallScreen ? 2 : 4}>
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          sx={{ mb: 4, color: "#4a1b6b" }}
        >
          👤 Información del Cliente
        </Typography>
        
        <Alert 
          severity="info" 
          sx={{ 
            borderRadius: 2,
            backgroundColor: "#e3f2fd",
            '& .MuiAlert-message': {
              fontSize: '1rem'
            }
          }}
        >
          No se encontró información del cliente para este usuario.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={isSmallScreen ? 2 : 4}>
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        sx={{ 
          mb: 4, 
          color: "#4a1b6b",
          fontSize: isSmallScreen ? "1.5rem" : "2rem"
        }}
      >
        👤 Información del Cliente
      </Typography>

      <Paper
        elevation={6}
        sx={{
          backgroundColor: "#f3e9ff",
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid #e0d2f2",
          boxShadow: "0 8px 32px rgba(138, 43, 226, 0.12)",
        }}
      >
        {/* Header del cliente */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #6b46c1 0%, #9333ea 100%)",
            p: 3,
            color: "white",
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              fontSize: "2rem",
              fontWeight: "bold",
              mx: "auto",
              mb: 2,
              border: "3px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            {getInitials(clienteActual.nombre, clienteActual.apellido)}
          </Avatar>
          
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            {`${clienteActual.nombre || ""} ${clienteActual.apellido || ""}`.trim() || "Cliente"}
          </Typography>
          
          <Chip
            label="Cliente Activo"
            size="small"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              fontWeight: "medium",
            }}
          />
        </Box>

        {/* Contenido de la información */}
        <Box sx={{ p: 4 }}>
          {fieldGroups.map((group, groupIndex) => (
            <Box key={groupIndex} sx={{ mb: groupIndex < fieldGroups.length - 1 ? 4 : 0 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: "#4a1b6b",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>{group.icon}</span>
                {group.title}
              </Typography>
              
              <Grid container spacing={3}>
                {group.fields.map((field) => {
                  const value = clienteActual[field.key] || "";
                  const displayValue = field.formatter ? field.formatter(value) : value;
                  
                  return (
                    <Grid item xs={12} sm={6} md={group.fields.length === 1 ? 12 : 6} key={field.key}>
                      <TextField
                        label={field.label}
                        value={displayValue}
                        fullWidth
                        variant="outlined"
                        type={field.type || "text"}
                        slotProps={{ 
                          input: { 
                            readOnly: true,
                            sx: {
                              backgroundColor: "#ffffff",
                              '&:hover': {
                                backgroundColor: "#fafafa",
                              }
                            }
                          },
                          inputLabel: {
                            sx: {
                              '&.Mui-focused': {
                                color: "#6b46c1",
                              }
                            }
                          }
                        }}
                        sx={{
                          borderRadius: 2,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            transition: "all 0.2s ease-in-out",
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: "#9333ea",
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: "#6b46c1",
                              borderWidth: 2,
                            },
                          },
                        }}
                      />
                    </Grid>
                  );
                })}
              </Grid>
              
              {groupIndex < fieldGroups.length - 1 && (
                <Divider sx={{ mt: 3, borderColor: "#e0d2f2" }} />
              )}
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};