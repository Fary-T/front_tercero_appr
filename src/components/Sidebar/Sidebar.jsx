import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import BarChartIcon from "@mui/icons-material/BarChart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const drawerWidth = 240;

export const Sidebar = ({
  seccionActiva,
  setSeccionActiva,
  isMobile,
  mobileOpen,
  handleDrawerToggle,
}) => {
  const secciones = [
    { texto: "Dashboard", icono: <DashboardIcon /> },
    { texto: "Polizas", icono: <AssignmentIcon /> },
    { texto: "Usuarios", icono: <PeopleIcon /> },
    { texto: "Reportes", icono: <BarChartIcon /> },
    { texto: "Cerrar Sesión", icono: <ExitToAppIcon /> },
  ];

  const contenidoDrawer = (
    <Box
      sx={{
        height: "100%",
        backgroundColor: "#25004D",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Toolbar sx={{ justifyContent: "center", py: 2 }}>
        <Typography variant="h6" noWrap>
          Seguros de Vida <br /> y Salud
        </Typography>
      </Toolbar>

      <List>
        {secciones.map(({ texto, icono }) => (
          <ListItem
            key={texto}
            disablePadding
            onClick={() => setSeccionActiva(texto)}
          >
            <ListItemButton
              selected={seccionActiva === texto}
              sx={{
                color: "white",
                backgroundColor: seccionActiva === texto ? "#3E0A75" : "inherit",
                "&:hover": {
                  backgroundColor: "#3E0A75",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>{icono}</ListItemIcon>
              <ListItemText primary={texto} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return isMobile ? (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      {contenidoDrawer}
    </Drawer>
  ) : (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      {contenidoDrawer}
    </Drawer>
  );
};