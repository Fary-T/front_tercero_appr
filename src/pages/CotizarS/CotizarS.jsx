import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Modal,
  Grid,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Header from '../../components/planescomponents/Header';
import Formulario from '../../components/CotizarComponents/Formulario';

const CotizarS = () => {
  const { state } = useLocation();
  const plan = state?.plan;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!plan) {
    return (
      <>
        <Header />
        <Box mt={4} />
        <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
          Plan no encontrado.
        </Typography>
      </>
    );
  }

  const renderList = (items) => (
    <List dense sx={{ textAlign: 'left' }}>
      {items.map((item, idx) => (
        <ListItem key={idx} disablePadding>
          <ListItemIcon sx={{ color: '#25004D', minWidth: 32 }}>
            <CheckCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <Header />

      {/* Banner con imagen desde /public */}
      <Box
        sx={{
          width: '100%',
          height: 400,
          backgroundImage: `url("${plan.imagen}")`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center -100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center',
          mt: { xs: 8, md: 8.05 }, 
        }}
      >
        <Box sx={{ bgcolor: 'rgba(0,0,0,0.5)', px: 4, py: 2, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold">
            {plan.title}
          </Typography>
          <Typography variant="h6">{plan.precio}</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: '#F4F1F8',
          py: 6,
          px: { xs: 2, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: 950,
            p: { xs: 3, md: 5 },
            bgcolor: '#fff',
            borderRadius: 4,
            mb: 4,
          }}
        >
          <Grid container spacing={4} justifyContent="center">
            {/* Cobertura */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  backgroundColor: '#F9F6FC',
                  borderRadius: 2,
                  p: 2,
                  boxShadow: 1,
                  height: '100%',
                }}
              >
                <Typography
                  variant="h6"
                  color="#25004D"
                  gutterBottom
                  textAlign="center"
                >
                  🛡️ Cobertura
                </Typography>
                <Box display="flex" flexDirection="column" alignItems="center">
                  {renderList(plan.cobertura)}
                </Box>
              </Box>
            </Grid>

            {/* Beneficios */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  backgroundColor: '#F9F6FC',
                  borderRadius: 2,
                  p: 2,
                  boxShadow: 1,
                  height: '100%',
                }}
              >
                <Typography
                  variant="h6"
                  color="#25004D"
                  gutterBottom
                  textAlign="center"
                >
                  💎 Beneficios
                </Typography>
                <Box display="flex" flexDirection="column" alignItems="center">
                  {renderList(plan.beneficios)}
                </Box>
              </Box>
            </Grid>

            {/* Ventajas */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  backgroundColor: '#F9F6FC',
                  borderRadius: 2,
                  p: 2,
                  boxShadow: 1,
                  height: '100%',
                }}
              >
                <Typography
                  variant="h6"
                  color="#25004D"
                  gutterBottom
                  textAlign="center"
                >
                  🚀 Ventajas
                </Typography>
                <Box display="flex" flexDirection="column" alignItems="center">
                  {renderList(plan.ventajas)}
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {plan.publico && (
            <Typography variant="subtitle1" align="center">
              <strong>Público Ideal:</strong> {plan.publico}
            </Typography>
          )}

          <Box textAlign="center" mt={4}>
            <Button
              variant="contained"
              startIcon={<AssignmentIcon />}
              sx={{
                backgroundColor: '#25004D',
                px: 4,
                py: 1.5,
                ':hover': { backgroundColor: '#1a0033' },
              }}
              onClick={() => setOpen(true)}
            >
              Solicitar plan
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Modal del formulario */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="formulario-modal"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Formulario plan={plan.title} />
      </Modal>
    </>
  );
};

export default CotizarS;
