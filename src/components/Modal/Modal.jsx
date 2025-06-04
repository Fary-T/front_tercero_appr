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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Box,
} from "@mui/material";

export const Modal = ({ open, onClose, onGuardar }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    username: "",
    password: "",
    apellido: "",
    tipo: null,
    activo: "",
    cedula: "",
    rol: "",
  });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validarCampos = () => {
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const soloNumeros10 = /^\d{10}$/;
    const correoValido =
      /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo|icloud|live|protonmail|zoho|gmx|aol|mail)\.(com|es|net|org|co|info|me|us)$/i;

    if (!correoValido.test(formData.correo)) {
      alert("Correo inválido.");
      return false;
    }

    if (!formData.username.trim()) {
      alert("El nombre de usuario es requerido.");
      return false;
    }

    if (!formData.password.trim()) {
      alert("La contraseña es requerida.");
      return false;
    }

    if (!soloLetras.test(formData.nombre)) {
      alert("El nombre solo debe contener letras.");
      return false;
    }

    if (!soloLetras.test(formData.apellido)) {
      alert("El apellido solo debe contener letras.");
      return false;
    }

    // Corregir validación del tipo para incluir 0 (admin)
    if (formData.tipo === null || ![0, 1, 2].includes(Number(formData.tipo))) {
      alert("Selecciona un tipo (admin, agente o cliente).");
      return false;
    }

    if (!["1", "0"].includes(formData.activo)) {
      alert("El campo 'activo' debe ser 1 (activo) o 0 (inactivo).");
      return false;
    }

    if (!soloNumeros10.test(formData.cedula)) {
      alert("La cédula debe contener exactamente 10 números.");
      return false;
    }

    if (!soloNumeros10.test(formData.telefono)) {
      alert("El teléfono debe contener exactamente 10 números.");
      return false;
    }

    return true;
  };

  const handleGuardar = async () => {
    if (!validarCampos()) return;

    try {
      const response = await fetch("http://localhost:3030/usuario/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Corregir el mensaje para mostrar el tipo correcto
        const tipoNombre =
          formData.rol.charAt(0).toUpperCase() + formData.rol.slice(1);
        alert(`${tipoNombre} agregado correctamente`);
        onClose();
        setFormData({
          nombre: "",
          correo: "",
          telefono: "",
          username: "",
          password: "",
          apellido: "",
          tipo: null,
          activo: "",
          cedula: "",
          rol: "",
        });
        if (typeof onGuardar === "function") onGuardar();
      } else {
        alert(data.error || "Error al agregar usuario");
      }
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      alert("No se pudo guardar el usuario");
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
          👤 Agregar Usuario
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 4, backgroundColor: "#f5f0f9" }}>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
                sx={{ color: "#28044c", fontWeight: 600 }}
              >
                Nombre
              </Typography>
              <TextField
                fullWidth
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                variant="outlined"
                size="small"
                autoComplete="off"
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

            <Grid item xs={12} sm={6}>
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
                sx={{ color: "#28044c", fontWeight: 600 }}
              >
                Apellido
              </Typography>
              <TextField
                fullWidth
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                variant="outlined"
                size="small"
                autoComplete="off"
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

            <Grid item xs={12} sm={6}>
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
                sx={{ color: "#28044c", fontWeight: 600 }}
              >
                Correo
              </Typography>
              <TextField
                fullWidth
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                variant="outlined"
                size="small"
                autoComplete="off"
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

            <Grid item xs={12} sm={6}>
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
                sx={{ color: "#28044c", fontWeight: 600 }}
              >
                Teléfono
              </Typography>
              <TextField
                fullWidth
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                variant="outlined"
                size="small"
                autoComplete="off"
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

            <Grid item xs={12} sm={6}>
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
                sx={{ color: "#28044c", fontWeight: 600 }}
              >
                Cédula
              </Typography>
              <TextField
                fullWidth
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                variant="outlined"
                size="small"
                autoComplete="off"
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

            <Grid item xs={12} sm={6}>
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
                sx={{ color: "#28044c", fontWeight: 600 }}
              >
                Username
              </Typography>
              <TextField
                fullWidth
                name="username"
                value={formData.username}
                onChange={handleChange}
                variant="outlined"
                size="small"
                autoComplete="off"
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

            <Grid item xs={12} sm={6}>
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
                sx={{ color: "#28044c", fontWeight: 600 }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                size="small"
                autoComplete="new-password"
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

            <Grid item xs={12} sm={6}>
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
                sx={{ color: "#28044c", fontWeight: 600 }}
              >
                Estado (1 = Activo, 0 = Inactivo)
              </Typography>
              <TextField
                fullWidth
                name="activo"
                value={formData.activo}
                onChange={handleChange}
                variant="outlined"
                size="small"
                autoComplete="off"
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

            <Grid item xs={12}>
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
                sx={{ color: "#28044c", fontWeight: 600 }}
              >
                Tipo de Usuario
              </Typography>
              <ToggleButtonGroup
                value={formData.tipo}
                exclusive
                onChange={(event, newTipo) => {
                  if (newTipo !== null) {
                    const rolMap = { 0: "admin", 1: "agente", 2: "cliente" };
                    setFormData({
                      ...formData,
                      tipo: newTipo,
                      rol: rolMap[newTipo],
                    });
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
                  Admin
                </ToggleButton>
                <ToggleButton value={1} sx={{ flex: 1 }}>
                  Agente
                </ToggleButton>
                <ToggleButton value={2} sx={{ flex: 1 }}>
                  Cliente
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
                sx={{ color: "#28044c", fontWeight: 600 }}
              >
                Rol Asignado
              </Typography>
              <TextField
                fullWidth
                value={formData.rol}
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
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

Modal.propTypes = {};
