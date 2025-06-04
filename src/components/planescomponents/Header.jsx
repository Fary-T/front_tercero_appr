import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const irAHome = () => {
   if (location.pathname === '/CotizarS' || location.pathname === '/CotizarV') {
      navigate('/Planes');
    } else {
      navigate('/');
    }
  };
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#25004D' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="Logo" style={{ height: 60, marginRight: 10 }} />
          <Typography variant="h6" fontWeight="bold">IntegriSeg</Typography>
        </Box>

        <Box>
            <Button onClick={irAHome}sx={{ color: '#fff' }}>Volver al Inicio</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
