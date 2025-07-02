import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {
  Alert, Avatar, Box, Button, Card, CardContent, Chip, Container, Divider, Fade, Grid,
  IconButton, Skeleton, TextField, Typography, useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { ModalEditarUsuarioCliente } from "../ModalEditarUsuario/ModalEditarUsuarioCliente";

export const ClientesContentClientes = () => {
  const { usuario } = useUser();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    consultarClientes();
  }, []);

  const consultarClientes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://35.172.129.60:3030/usuario", {
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
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const handleAbrirModal = () => {
    setModalOpen(true);
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
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
        { key: "telefono", label: "Teléfono", formatter: formatPhoneNumber },
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight="700"
            sx={{
              background: "linear-gradient(135deg, #6b46c1 0%, #9333ea 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2
            }}
          >
            Mi Perfil
          </Typography>
        </Box>

        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden"
          }}
        >
          {/* Header Loading */}
          <Box sx={{
            background: "linear-gradient(135deg,rgb(2, 17, 82) 0%,rgb(49, 4, 94) 100%)",
            p: 4,
            textAlign: "center"
          }}>
            <Skeleton
              variant="circular"
              width={100}
              height={100}
              sx={{ mx: "auto", mb: 2, bgcolor: "rgba(255,255,255,0.2)" }}
            />
            <Skeleton
              variant="text"
              width="60%"
              height={32}
              sx={{ mx: "auto", mb: 1, bgcolor: "rgba(255,255,255,0.2)" }}
            />
            <Skeleton
              variant="rectangular"
              width={100}
              height={24}
              sx={{ mx: "auto", borderRadius: 3, bgcolor: "rgba(255,255,255,0.2)" }}
            />
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4}>
              {[...Array(3)].map((_, groupIndex) => (
                <Grid item xs={12} key={groupIndex}>
                  <Box sx={{ mb: 3 }}>
                    <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
                    <Grid container spacing={3}>
                      {[...Array(groupIndex === 2 ? 1 : 2)].map((_, fieldIndex) => (
                        <Grid item xs={12} sm={6} key={fieldIndex}>
                          <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                  {groupIndex < 2 && <Divider sx={{ my: 3 }} />}
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight="700"
            sx={{
              background: "linear-gradient(135deg,rgb(0, 8, 46) 0%,rgb(51, 1, 102) 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2
            }}
          >
            Mi Perfil
          </Typography>
        </Box>

        <Alert
          severity="error"
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(239, 68, 68, 0.1)",
            '& .MuiAlert-message': { fontSize: '1rem' }
          }}
        >
          {error}
        </Alert>

        <Box textAlign="center" sx={{ mt: 3 }}>
          <Typography variant="body1" color="text.secondary">
            No se pudo cargar la información del cliente
          </Typography>
          <Button
            variant="outlined"
            onClick={consultarClientes}
            sx={{ mt: 2, borderRadius: 3 }}
          >
            Reintentar
          </Button>
        </Box>
      </Container>
    );
  }

  if (!clienteActual) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight="700"
            sx={{
              background: "linear-gradient(135deg,rgb(10, 21, 68) 0%,rgb(36, 8, 65) 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2
            }}
          >
            Mi Perfil
          </Typography>
        </Box>

        <Alert
          severity="info"
          sx={{
            borderRadius: 3,
            backgroundColor: "#f3e9ff",
            border: "1px solid rgb(58, 6, 107)",
            '& .MuiAlert-message': { fontSize: '1rem' }
          }}
        >
          No se encontró información del cliente para este usuario.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant={isSmallScreen ? "h5" : "h4"}
              fontWeight="700"
              sx={{
                background: "linear-gradient(135deg,rgb(24, 3, 71) 0%,rgb(64, 6, 119) 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2
              }}
            >
              Mi Perfil
            </Typography>
          </Box>

          {/* Main Card */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
              boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
            }}
          >
            {/* Profile Header */}
            <Box sx={{
              background: "linear-gradient(135deg,rgb(60, 30, 129) 0%,rgb(60, 10, 107) 100%)",
              p: 4,
              color: "white",
              textAlign: "center",
              position: "relative"
            }}>
              <IconButton
                onClick={handleAbrirModal}
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
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
                <EditIcon />
              </IconButton>

              <Avatar
                sx={{
                  width: { xs: 80, sm: 100 },
                  height: { xs: 80, sm: 100 },
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  fontSize: { xs: "1.8rem", sm: "2.2rem" },
                  fontWeight: "bold",
                  mx: "auto",
                  mb: 2,
                  border: "4px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
                }}
              >
                {getInitials(clienteActual.nombre, clienteActual.apellido)}
              </Avatar>

              <Typography variant="h5" fontWeight="700" sx={{ mb: 1 }}>
                {`${clienteActual.nombre || ""} ${clienteActual.apellido || ""}`.trim() || "Cliente"}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                <VerifiedUserIcon sx={{ fontSize: "1rem" }} />
                <Chip
                  label="Cliente Verificado"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontWeight: "600",
                    backdropFilter: "blur(10px)"
                  }}
                />
              </Box>
            </Box>

            {/* Content */}
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Grid container spacing={4}>
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
                          transform: "translateY(-2px)",
                          boxShadow: `0 8px 25px ${group.color}15`
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

                        <Grid container spacing={3}>
                          {group.fields.map((field) => {
                            const value = clienteActual[field.key] || "";
                            const displayValue = field.formatter ? field.formatter(value) : value;

                            return (
                              <Grid
                                item
                                xs={12}
                                sm={group.fields.length === 1 ? 12 : 6}
                                key={field.key}
                              >
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
                                        backgroundColor: "white",
                                        fontWeight: "500",
                                        '&:hover': {
                                          backgroundColor: "#fafafa"
                                        }
                                      }
                                    },
                                    inputLabel: {
                                      sx: {
                                        fontWeight: "600",
                                        '&.Mui-focused': { color: group.color }
                                      }
                                    }
                                  }}
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 2,
                                      transition: "all 0.2s ease-in-out",
                                      '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: group.color,
                                        borderWidth: 2
                                      },
                                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: group.color,
                                        borderWidth: 2
                                      },
                                    },
                                  }}
                                />
                              </Grid>
                            );
                          })}
                        </Grid>
                      </CardContent>
                    </Card>

                    {groupIndex < fieldGroups.length - 1 && (
                      <Divider sx={{ my: 4, borderColor: "divider" }} />
                    )}
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<EditIcon />}
              onClick={handleAbrirModal}
              sx={{
                borderRadius: 3,
                py: 1.5,
                px: 4,
                background: "linear-gradient(135deg,rgb(55, 14, 150) 0%,rgb(57, 6, 105) 100%)",
                boxShadow: "0 8px 25px rgba(107, 70, 193, 0.3)",
                fontWeight: "600",
                fontSize: "1rem",
                textTransform: "none",
                '&:hover': {
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 35px rgba(107, 70, 193, 0.4)",
                }
              }}
            >
              Editar Información
            </Button>
          </Box>
        </Box>
      </Fade>

      <ModalEditarUsuarioCliente
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        usuario={clienteActual}
        onGuardar={() => {
          consultarClientes();
          setModalOpen(false);
        }} />
    </Container>
  );
};