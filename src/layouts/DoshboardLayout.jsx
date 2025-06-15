"use client";
import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar/Sidebar";
import {DashboardContent} from "../components/Doshboard/DashboardContent";
import { PolizasContent } from "../components/Doshboard/PolizasContent";
import { ClientesContent } from "../components/Doshboard/ClientesContent";
import { RevisionArchivos } from "../components/Doshboard/RevisionArchivosAdmi";


export const DoshboardLayout = () => {
  const [seccionActiva, setSeccionActiva] = useState("Dashboard");
  const [dialogoCerrarSesion, setDialogoCerrarSesion] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCerrarSesionClick = () => setDialogoCerrarSesion(true);
  const handlePermanecerEnPagina = () => setDialogoCerrarSesion(false);
  const handleCancelarCerrarSesion = () => setDialogoCerrarSesion(false);
  const handleConfirmarCerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("isAuthenticated");
    setDialogoCerrarSesion(false);
    navigate("/home", { replace: true });
  };

  const handleSeccionChange = (seccion) => {
    if (seccion === "Cerrar Sesión") handleCerrarSesionClick();
    else setSeccionActiva(seccion);
    if (isMobile) setMobileOpen(false); // Cierra el drawer en móvil
  };

  const renderContenido = () => {
    switch (seccionActiva) {
      case "Dashboard":
        return <DashboardContent />;
      case "Polizas":
        return <PolizasContent />;
      case "Usuarios":
        return <ClientesContent />;
      case "Reportes":
        return <Typography variant="h6">Visualización de Reportes</Typography>;
      case "Revisión Archivos":
        return <RevisionArchivos/>;
      default:
        return <Typography variant="h6">Selecciona una opción</Typography>;
    }
  };

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      {/* AppBar solo en móviles */}
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

      {/* Sidebar */}
      <Sidebar
        seccionActiva={seccionActiva}
        setSeccionActiva={handleSeccionChange}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: "100%",
          mt: isMobile ? 8 : 0,
        }}
      >
        {renderContenido()}
      </Box>

      {/* Diálogo de cerrar sesión */}
      <Dialog
        open={dialogoCerrarSesion}
        onClose={handlePermanecerEnPagina}
      >
        <DialogTitle
          sx={{ backgroundColor: "#25004D", color: "white", textAlign: "center" }}
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