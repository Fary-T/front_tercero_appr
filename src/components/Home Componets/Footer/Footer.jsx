'use client';
import React from 'react';
import './Footer.css';
import { Box, Grid, Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#25004D',
        color: 'white',
        py: 4,
        px: { xs: 2, sm: 4, md: 8 },
        display: 'flex',
        justifyContent: 'center',
        minHeight: { md: '300px' }, // Asegura altura visible en pantallas medianas
        mt: 'auto', // Para que se "pegue" abajo si el layout lo permite
      }}
    >
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        spacing={4}
        sx={{
          maxWidth: 1200,
          flexDirection: { xs: 'row', sm: 'row', md: 'row' },
          flexWrap: 'nowrap',
        }}
      >
        {/* TEXTO */}
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            textAlign: 'left',
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 'bold',
              color: 'white',
              mb: 4,
              fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            Por qué elegirnos
          </Typography>

          {/* Ítem 1 */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              component="h3"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                position: 'relative',
                pl: 3,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '12px',
                  height: '12px',
                  bgcolor: '#FFD700',
                },
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
              }}
            >
              Profesionalismo
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 1, ml: { md: 3 } }}
            >
              Contamos con un equipo de expertos en seguros
            </Typography>
          </Box>

          {/* Ítem 2 */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h5"
              component="h3"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                position: 'relative',
                pl: 3,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '12px',
                  height: '12px',
                  bgcolor: '#FFD700',
                },
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
              }}
            >
              Atención personalizada
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 1, ml: { md: 3 } }}
            >
              Brindamos un servicio adaptado a tus necesidades
            </Typography>
          </Box>
        </Grid>

        {/* IMAGEN */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'flex-end', md: 'center' },
          }}
        >
          <Box
            component="img"
            src="/light.png"
            alt="Ilustración de un foco"
            sx={{
              width: { xs: '130px', sm: '200px', md: '300px' },
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
