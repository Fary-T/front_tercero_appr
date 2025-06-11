"use client";
import React from 'react';
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
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';

const drawerWidth = 240;

const menuItems = [
  { text: 'Información Cliente', icon: <PeopleIcon /> },
  { text: 'Notificaciones', icon: <NotificationsIcon/> },
  { text: 'Subida de archivos', icon: <UploadFileIcon/> },
  { text: 'Cerrar Sesión', icon: <LogoutIcon /> },
];

export const SidebarCliente = ({
  seccionActiva,
  setSeccionActiva,
  isMobile,
  mobileOpen,
  handleDrawerToggle,
}) => {
  const contenidoDrawer = (
    <Box
      sx={{
        height: '100%',
        backgroundColor: '#25004D',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
        <Typography variant="h6" align="center">
          Seguros de Vida <br /> y Salud
        </Typography>
      </Toolbar>

      <List>
        {menuItems.map(({ text, icon }) => (
          <ListItem key={text} disablePadding onClick={() => setSeccionActiva(text)}>
            <ListItemButton
              selected={seccionActiva === text}
              sx={{
                color: 'white',
                backgroundColor: seccionActiva === text ? '#3E0A75' : 'inherit',
                '&:hover': {
                  backgroundColor: '#3E0A75',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>{icon}</ListItemIcon>
              <ListItemText primary={text} />
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
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
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
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {contenidoDrawer}
    </Drawer>
  );
};