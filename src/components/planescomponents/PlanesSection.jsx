import { Box, Grid, Typography } from '@mui/material';
import PlanesSalud from '../../components/CotizarComponents/PlanesSalud';
import PlanesVida from '../../components/CotizarComponents/PlanesVida';
import PlanCard from './PlanCard';

const Planes = () => {
  return (
    <Box sx={{ textAlign: 'center', px: 3, py: 6, bgcolor: '#F4F1F8' }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom color="#25004D">
        Nuestros Planes
      </Typography>
      <Typography variant="subtitle1" mb={4} color="#444">
        Elige el plan que mejor se adapte a tus necesidades
      </Typography>

      {/* Planes de Salud */}
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mt: 6, color: '#25004D' }}>
        Planes de Salud
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {PlanesSalud.map((plan, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <PlanCard plan={plan} />
          </Grid>
        ))}
      </Grid>

      {/* Planes de Vida */}
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mt: 8, color: '#FFCC00' }}>
        Planes de Vida
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {PlanesVida.map((plan, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <PlanCard plan={plan} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Planes;
