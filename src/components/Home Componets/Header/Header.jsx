"use client";
import React, { useContext, useState } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import { Box, Toolbar, Typography, Button, AppBar, Modal, Avatar, TextField } from "@mui/material";
import { UserContext } from "../../../context/UserContext";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "#25004D",
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const { usuario, setUsuario } = useContext(UserContext);
  // Estados para manejo de errores
  const [errores, setErrores] = useState({
    correo: "",
    contrasenia: "",
    general: ""
  });

  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setCorreo("");
    setContrasenia("");
    setErrores({ correo: "", contrasenia: "", general: "" });
    setOpen(false);
  };

  // Función para limpiar errores cuando el usuario empiece a escribir
  const handleCorreoChange = (e) => {
    setCorreo(e.target.value);
    if (errores.correo) {
      setErrores(prev => ({ ...prev, correo: "" }));
    }
  };

  const handleContraseniaChange = (e) => {
    setContrasenia(e.target.value);
    if (errores.contrasenia) {
      setErrores(prev => ({ ...prev, contrasenia: "" }));
    }
  };

  const handleLogin = async () => {
    // Resetear errores
    setErrores({ correo: "", contrasenia: "", general: "" });

    let nuevosErrores = {};

    // Validar campos vacíos
    if (!correo.trim()) {
      nuevosErrores.correo = "El correo electrónico es obligatorio";
    }

    if (!contrasenia.trim()) {
      nuevosErrores.contrasenia = "La contraseña es obligatoria";
    }

    // Si hay errores de validación, mostrarlos y salir
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(prev => ({ ...prev, ...nuevosErrores }));
      return;
    }

    try {
      const response = await fetch("http://35.172.129.60:3030/home", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ correo, contrasenia })
      });

      const data = await response.json();

      if (response.ok) {
        setUsuario({
          ...usuario, 
          id_usuario: data.usuario.id_usuario, 
          correo: data.usuario.correo, 
          username: data.usuario.username,
          nombre: data.usuario.nombre, 
          tipo: data.usuario.tipo, 
          activo: data.usuario.activo, 
          cedula: data.usuario.cedula,
          rol: data.usuario.rol,
          telefono: data.usuario.telefono,
        })
        console.log("Login exitoso:", data);

        // Redireccionar según la respuesta del backend
        if (data.usuario.tipo === 0) {
          navigate('/doshboard', { replace: true });
        } else if (data.usuario.tipo === 1) {
          navigate('/doshboardAgentes', { replace: true });
        } else if (data.usuario.tipo === 2) {
          navigate('/doshboardClientes', { replace: true });
        } else {
          navigate('/home', { replace: true });
        }
        handleClose();
      } else {
        // Error de credenciales - marcar ambos campos como erróneos
        setErrores({
          correo: "Credenciales incorrectas",
          contrasenia: "Credenciales incorrectas",
          general: ""
        });
      }
    } catch (error) {
      console.error("Error en login:", error);
      setErrores({
        correo: "",
        contrasenia: "",
        general: "Error de conexión. Intente nuevamente."
      });
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "white", boxShadow: "none" }}
      >
        <Toolbar>
          <Box component="img" src="/logo.png" sx={{ height: 60, mr: 2 }}></Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              textAlign: "left",
              fontWeight: "bold",
              color: "#25004D",
            }}
          >
            IntegriSeg
          </Typography>
          <Button
            onClick={handleOpen}
            sx={{
              backgroundColor: "#F8CF49",
              "&:hover": {
                backgroundColor: "#FCC100",
              },
              color: "#25004D",
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: 2,
              px: 2,
            }}
          >
            Iniciar sesión
          </Button>
        </Toolbar>
      </AppBar>

      {/* Modal de login */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Avatar
            sx={{ bgcolor: "#FFD700", width: 56, height: 56, margin: "0 auto" }}
          >
            <FamilyRestroomIcon sx={{ color: "#2c0042", fontSize: 32 }} />
          </Avatar>
          <Typography
            variant="h6"
            component="h2"
            sx={{ color: "white", mt: 2 }}
          >
            Iniciar sesión
          </Typography>

          {/* Campo de correo */}
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Correo electrónico"
              variant="filled"
              fullWidth
              error={!!errores.correo}
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                '& .MuiFilledInput-root': {
                  '&.Mui-error': {
                    borderBottom: '2px solid #f44336',
                  }
                }
              }}
              value={correo}
              onChange={handleCorreoChange}
            />
            {errores.correo && (
              <Typography
                variant="caption"
                sx={{
                  color: '#f44336',
                  display: 'block',
                  mt: 0.5,
                  textAlign: 'left'
                }}
              >
                {errores.correo}
              </Typography>
            )}
          </Box>

          {/* Campo de contraseña */}
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Contraseña"
              type="password"
              variant="filled"
              fullWidth
              error={!!errores.contrasenia}
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                '& .MuiFilledInput-root': {
                  '&.Mui-error': {
                    borderBottom: '2px solid #f44336',
                  }
                }
              }}
              value={contrasenia}
              onChange={handleContraseniaChange}
            />
            {errores.contrasenia && (
              <Typography
                variant="caption"
                sx={{
                  color: '#f44336',
                  display: 'block',
                  mt: 0.5,
                  textAlign: 'left'
                }}
              >
                {errores.contrasenia}
              </Typography>
            )}
          </Box>

          {/* Error general */}
          {errores.general && (
            <Typography
              variant="caption"
              sx={{
                color: '#f44336',
                display: 'block',
                mt: 1,
                textAlign: 'center'
              }}
            >
              {errores.general}
            </Typography>
          )}

          <Button
            variant="contained"
            sx={{
              mt: 3,
              bgcolor: "#FFD700",
              color: "#2c0042",
              "&:hover": {
                bgcolor: "#e6c200",
              },
            }}
            fullWidth
            onClick={handleLogin}
          >
            Ingresar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};