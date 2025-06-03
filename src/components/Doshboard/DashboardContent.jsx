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
  Chip,
  Container
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
    icon: <TrendingUp sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />,
    bgColor: '#f3e5f5'
  },
  { 
    label: 'Pólizas de salud', 
    value: 2, 
    color: '#4CAF50',
    icon: <Security sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />,
    bgColor: '#e8f5e8'
  },
  { 
    label: 'Pólizas de vida', 
    value: 3, 
    color: '#2196F3',
    icon: <People sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />,
    bgColor: '#e3f2fd'
  },
  { 
    label: 'Monto Total', 
    value: '$ 1.500.000', 
    color: '#FF9800',
    icon: <AttachMoney sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />,
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
  const isXs = useMediaQuery(theme.breakpoints.only('xs')); // 0-599px
  const isSm = useMediaQuery(theme.breakpoints.only('sm')); // 600-959px
  const isMd = useMediaQuery(theme.breakpoints.only('md')); // 960-1279px
  const isLg = useMediaQuery(theme.breakpoints.only('lg')); // 1280-1919px
  const isXl = useMediaQuery(theme.breakpoints.up('xl')); // 1920px+

  // Configuración responsiva específica
  const getResponsiveConfig = () => {
    if (isXs) {
      return {
        titleVariant: "h6",
        cardHeight: 100,
        padding: 1,
        spacing: 1.5,
        minSectionHeight: 220,
        containerMaxWidth: false
      };
    }
    if (isSm) {
      return {
        titleVariant: "h5",
        cardHeight: 120,
        padding: 1.5,
        spacing: 2,
        minSectionHeight: 280,
        containerMaxWidth: 'sm'
      };
    }
    if (isMd) {
      return {
        titleVariant: "h4",
        cardHeight: 140,
        padding: 2,
        spacing: 2,
        minSectionHeight: 320,
        containerMaxWidth: 'md'
      };
    }
    if (isLg) {
      return {
        titleVariant: "h4",
        cardHeight: 150,
        padding: 2.5,
        spacing: 2.5,
        minSectionHeight: 350,
        containerMaxWidth: 'lg'
      };
    }
    return {
      titleVariant: "h4",
      cardHeight: 160,
      padding: 3,
      spacing: 3,
      minSectionHeight: 380,
      containerMaxWidth: 'xl'
    };
  };

  const config = getResponsiveConfig();

  return (
    <Container 
      maxWidth={config.containerMaxWidth}
      disableGutters={isXs}
      sx={{ 
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        px: { xs: 1, sm: 2, md: 2, lg: 3 },
        py: { xs: 1, sm: 2 }
      }}
    >
      {/* Título */}
      <Typography 
        variant={config.titleVariant}
        fontWeight="bold" 
        sx={{ 
          color: "#25004D",
          textAlign: { xs: 'center', sm: 'left' },
          mb: { xs: 1.5, sm: 2, md: 3 },
          fontSize: { 
            xs: '1.1rem', 
            sm: '1.3rem', 
            md: '1.5rem', 
            lg: '1.75rem',
            xl: '2rem'
          }
        }}
      >
        Dashboard - Seguros de Vida y Salud
      </Typography>

      {/* Métricas - Grid responsivo */}
      <Grid container spacing={config.spacing} sx={{ mb: config.spacing }}>
        {metricas.map(({ label, value, color, icon, bgColor }) => (
          <Grid item xs={6} sm={6} md={3} key={label}>
            <Paper 
              elevation={2} 
              sx={{ 
                height: config.cardHeight,
                p: { xs: 1, sm: 1.5, md: 2 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: bgColor,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: { xs: 1, sm: 2 },
                '&:hover': {
                  transform: { xs: 'none', sm: 'translateY(-2px)', md: 'translateY(-4px)' },
                  boxShadow: { xs: 2, sm: 4, md: 6 }
                }
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                mb: { xs: 0.5, sm: 1 }
              }}>
                <Box sx={{ color: color }}>
                  {icon}
                </Box>
                <Typography 
                  variant={isXs ? "h6" : isSm ? "h5" : "h4"}
                  fontWeight="bold"
                  sx={{ 
                    color: color,
                    fontSize: { 
                      xs: '1rem', 
                      sm: '1.25rem', 
                      md: '1.5rem',
                      lg: '1.75rem'
                    }
                  }}
                >
                  {value}
                </Typography>
              </Box>
              <Typography 
                variant="caption"
                fontWeight="medium"
                color="text.secondary"
                sx={{ 
                  fontSize: { 
                    xs: '0.65rem', 
                    sm: '0.75rem', 
                    md: '0.85rem',
                    lg: '0.9rem'
                  },
                  lineHeight: 1.2
                }}
              >
                {label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Secciones principales - Diseño flexible */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        gap: config.spacing,
        flex: '1 1 auto',
        minHeight: 0
      }}>
        {/* Actividad Reciente */}
        <Paper 
          elevation={2} 
          sx={{ 
            flex: { xs: 'none', lg: 1 },
            minHeight: config.minSectionHeight,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: { xs: 1, sm: 2 }
          }}
        >
          <Box sx={{ p: config.padding, flex: 1 }}>
            <Typography 
              variant={isXs ? "subtitle1" : "h6"}
              fontWeight="bold" 
              sx={{ 
                color: "#25004D",
                mb: { xs: 1, sm: 1.5, md: 2 },
                fontSize: { 
                  xs: '0.95rem', 
                  sm: '1.1rem', 
                  md: '1.25rem'
                }
              }}
            >
              Actividad Reciente
            </Typography>
            
            <Stack spacing={{ xs: 1, sm: 1.5, md: 2 }}>
              {actividadReciente.map((actividad, index) => (
                <Box key={index}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: { xs: 0.5, sm: 1 }
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        fontWeight="600" 
                        sx={{
                          fontSize: { 
                            xs: '0.8rem', 
                            sm: '0.9rem', 
                            md: '1rem'
                          }
                        }}
                      >
                        {actividad.titulo}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          fontSize: { 
                            xs: '0.7rem', 
                            sm: '0.8rem', 
                            md: '0.85rem'
                          }
                        }}
                      >
                        {actividad.fecha}
                      </Typography>
                    </Box>
                    <Chip 
                      label={actividad.estado}
                      size={isXs ? "small" : "medium"}
                      sx={{ 
                        backgroundColor: '#e8f5e8',
                        color: '#4CAF50',
                        fontWeight: '600',
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                        alignSelf: { xs: 'flex-start', sm: 'center' }
                      }}
                    />
                  </Box>
                  {index < actividadReciente.length - 1 && (
                    <Divider sx={{ mt: { xs: 1, sm: 1.5 } }} />
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        </Paper>

        {/* Beneficiarios */}
        <Paper 
          elevation={2} 
          sx={{ 
            flex: { xs: 'none', lg: 1 },
            minHeight: config.minSectionHeight,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: { xs: 1, sm: 2 }
          }}
        >
          <Box sx={{ p: config.padding, flex: 1 }}>
            <Typography 
              variant={isXs ? "subtitle1" : "h6"}
              fontWeight="bold" 
              sx={{ 
                color: "#25004D",
                mb: { xs: 1, sm: 1.5, md: 2 },
                fontSize: { 
                  xs: '0.95rem', 
                  sm: '1.1rem', 
                  md: '1.25rem'
                }
              }}
            >
              Beneficiarios
            </Typography>
            
            <Stack spacing={{ xs: 1, sm: 1.5 }}>
              {beneficiarios.map(({ user, tipo, monto, estado }, i) => (
                <Box key={i}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      py: { xs: 0.5, sm: 1 },
                      gap: { xs: 0.5, sm: 1 }
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        fontWeight="600" 
                        sx={{
                          fontSize: { 
                            xs: '0.8rem', 
                            sm: '0.9rem', 
                            md: '1rem'
                          }
                        }}
                      >
                        {user}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          fontSize: { 
                            xs: '0.7rem', 
                            sm: '0.8rem', 
                            md: '0.85rem'
                          }
                        }}
                      >
                        {tipo}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'row', sm: 'column' },
                      alignItems: { xs: 'center', sm: 'flex-end' },
                      gap: { xs: 1, sm: 0.5 }
                    }}>
                      <Typography 
                        fontWeight="bold"
                        sx={{ 
                          color: "#FF9800",
                          fontSize: { 
                            xs: '0.8rem', 
                            sm: '0.9rem', 
                            md: '1rem'
                          }
                        }}
                      >
                        {monto}
                      </Typography>
                      <Chip 
                        label={estado}
                        size="small"
                        sx={{ 
                          backgroundColor: estado === 'Activo' ? '#e8f5e8' : '#fff3e0',
                          color: estado === 'Activo' ? '#4CAF50' : '#FF9800',
                          fontSize: { xs: '0.6rem', sm: '0.7rem' },
                          height: { xs: 20, sm: 24 }
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
      </Box>
    </Container>
  );
};