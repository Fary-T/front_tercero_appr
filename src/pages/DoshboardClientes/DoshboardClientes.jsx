"use client";
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarCliente } from "../../components/Sidebar/SidebarCliente";
import { ClientesContentClientes } from "../../components/Doshboard/ClientesContentClientes";
import { SubirArchivoCliente } from "../../components/SubirArchivoCliente";
import { ContratarSeguro } from "../../components/Doshboard/ContratarSeguro";
import { PagoSeguroCliente } from "../../components/PagoSeguroCliente";

export const DoshboardClientes = () => {
  const [seccionActiva, setSeccionActiva] = useState("Dashboard");
  const [dialogoCerrarSesion, setDialogoCerrarSesion] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  // Prevenir navegación hacia atrás
  useEffect(() => {
    window.history.pushState(null, '', location.pathname);
    const handlePopState = () => {
      window.history.pushState(null, '', location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleCerrarSesionClick = () => setDialogoCerrarSesion(true);
  const handlePermanecerEnPagina = () => setDialogoCerrarSesion(false);

  const handleConfirmarCerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("isAuthenticated");
    setDialogoCerrarSesion(false);
    navigate("/home", { replace: true });
  };

  const handleSeccionChange = (seccion) => {
    if (seccion === "Cerrar Sesión") {
      handleCerrarSesionClick();
    } else {
      setSeccionActiva(seccion);
    }
    if (isMobile) setMobileOpen(false); // Cerrar Drawer en móvil
  };

  const renderContenido = () => {
    switch (seccionActiva) {
      case "Información Cliente":
        return <ClientesContentClientes />;
      case "Contratar Seguro":
        return <ContratarSeguro />;
      case "Subida de archivos":
        return <SubirArchivoCliente />;
      case "Pagos Seguro":
        return <PagoSeguroCliente />;
      default:
        return <Typography variant="h6">Selecciona una opción</Typography>;
    }
  };

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      {isMobile && (
        <AppBar position="fixed" sx={{ backgroundColor: "#25004D" }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Seguros de Vida y Salud
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <SidebarCliente
        seccionActiva={seccionActiva}
        setSeccionActiva={handleSeccionChange}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: "100%",
          mt: isMobile ? 8 : 0,
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'auto', // Permite scroll solo si es necesario
        }}
      >
        {renderContenido()}
      </Box>

      <Dialog open={dialogoCerrarSesion} onClose={handlePermanecerEnPagina}>
        <DialogTitle
          sx={{
            backgroundColor: "#25004D",
            color: "white",
            textAlign: "center",
          }}
        >
          Cerrar Sesión
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText sx={{ textAlign: "center", fontSize: "1.1rem" }}>
            ¿Estás seguro de que deseas cerrar sesión?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 1 }}>
          <Button onClick={handlePermanecerEnPagina}>Permanecer</Button>
          <Button onClick={handleConfirmarCerrarSesion} autoFocus>
            Sí, Cerrar Sesión
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};