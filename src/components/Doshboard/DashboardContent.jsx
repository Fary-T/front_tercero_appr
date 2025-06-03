"use client";
import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Divider,
  useTheme,
  useMediaQuery,
  Stack,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  People,
  Security,
  AttachMoney
} from '@mui/icons-material';

// Métricas principales
const metricas = [
  { 
    label: 'Activos', 
    value: 5, 
    color: '#25004D',
    icon: <TrendingUp sx={{ fontSize: { xs: 20, sm: 24 } }} />,
    bgColor: '#f3e5f5'
  },
  { 
    label: 'Pólizas de salud', 
    value: 2, 
    color: '#4CAF50',
    icon: <Security sx={{ fontSize: { xs: 20, sm: 24 } }} />,
    bgColor: '#e8f5e8'
  },
  { 
    label: 'Pólizas de vida', 
    value: 3, 
    color: '#2196F3',
    icon: <People sx={{ fontSize: { xs: 20, sm: 24 } }} />,
    bgColor: '#e3f2fd'
  },
  { 
    label: 'Monto Total', 
    value: '$ 1.500.000', 
    color: '#FF9800',
    icon: <AttachMoney sx={{ fontSize: { xs: 20, sm: 24 } }} />,
    bgColor: '#fff3e0'
  },
];

// Actividad reciente
const actividadReciente = [
  {
    titulo: 'Póliza de vida adquirida',
    fecha: 'Abril 10, 2025',
    tipo: 'vida',
    estado: 'Completado'
  },
  {
    titulo: 'Póliza de salud',
    fecha: 'Marzo 15, 2025',
    tipo: 'salud',
    estado: 'Completado'
  }
];

// Beneficiarios
const beneficiarios = [
  { user: 'Usuario 1', tipo: 'Póliza de vida', monto: '15,000$', estado: 'Activo' },
  { user: 'Usuario 2', tipo: 'Póliza de salud', monto: '25,000$', estado: 'Activo' },
  { user: 'Usuario 3', tipo: 'Póliza de salud', monto: '35,000$', estado: 'Pendiente' },
];

export const DashboardContent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        px: { xs: 1, sm: 2 },
        pb: 2
      }}
    >
      {/* Título */}
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        fontWeight="bold" 
        mb={3}
        sx={{ 
          color: "#25004D",
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        Dashboard - Seguros de Vida y Salud
      </Typography>

      {/* Métricas */}
      <Grid container spacing={2} mb={3}>
        {metricas.map(({ label, value, color, icon, bgColor }) => (
          <Grid item xs={6} sm={6} md={3} key={label}>
            <Paper 
              elevation={3} 
              sx={{ 
                height: { xs: 120, sm: 140 },
                p: { xs: 1.5, sm: 2 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: bgColor,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ color: color }}>
                  {icon}
                </Box>
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  fontWeight="bold"
                  sx={{ color: color }}
                >
                  {value}
                </Typography>
              </Box>
              <Typography 
                variant={isMobile ? "caption" : "body2"} 
                fontWeight="medium"
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.7rem', sm: '0.875rem' },
                  lineHeight: 1.2
                }}
              >
                {label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Actividad + Beneficiarios */}
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {/* Actividad Reciente */}
        <Grid item xs={12} lg={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              height: '100%',
              minHeight: { xs: 250, sm: 300 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                fontWeight="bold" 
                mb={2}
                sx={{ color: "#25004D" }}
              >
                Actividad Reciente
              </Typography>
              
              <Stack spacing={2}>
                {actividadReciente.map((actividad, index) => (
                  <Box key={index}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: 1
                    }}>
                      <Box>
                        <Typography 
                          fontWeight="bold" 
                          variant={isMobile ? "body2" : "body1"}
                        >
                          {actividad.titulo}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                          {actividad.fecha}
                        </Typography>
                      </Box>
                      <Chip 
                        label={actividad.estado}
                        size={isMobile ? "small" : "medium"}
                        sx={{ 
                          backgroundColor: '#e8f5e8',
                          color: '#4CAF50',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                    {index < actividadReciente.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
              </Stack>
            </Box>
          </Paper>
        </Grid>

        {/* Beneficiarios */}
        <Grid item xs={12} lg={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              height: '100%',
              minHeight: { xs: 250, sm: 300 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                fontWeight="bold" 
                mb={2}
                sx={{ color: "#25004D" }}
              >
                Beneficiarios
              </Typography>
              
              <Stack spacing={1.5}>
                {beneficiarios.map(({ user, tipo, monto, estado }, i) => (
                  <Box key={i}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        py: 1,
                        gap: { xs: 1, sm: 2 }
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          fontWeight="bold" 
                          variant={isMobile ? "body2" : "body1"}
                        >
                          {user}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                        >
                          {tipo}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'row', sm: 'column' },
                        alignItems: { xs: 'center', sm: 'flex-end' },
                        gap: { xs: 2, sm: 0.5 }
                      }}>
                        <Typography 
                          variant={isMobile ? "body2" : "body1"}
                          fontWeight="bold"
                          sx={{ color: "#FF9800" }}
                        >
                          {monto}
                        </Typography>
                        <Chip 
                          label={estado}
                          size="small"
                          sx={{ 
                            backgroundColor: estado === 'Activo' ? '#e8f5e8' : '#fff3e0',
                            color: estado === 'Activo' ? '#4CAF50' : '#FF9800',
                            fontSize: '0.7rem'
                          }}
                        />
                      </Box>
                    </Box>
                    {i < beneficiarios.length - 1 && <Divider />}
                  </Box>
                ))}
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
