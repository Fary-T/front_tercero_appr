"use client";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
const drawerWidth = 240;

const menuItems = [
  { text: 'Información Cliente', icon: <PeopleIcon /> },
  { text: 'Contratar Seguro', icon: <AddShoppingCartIcon/>},
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