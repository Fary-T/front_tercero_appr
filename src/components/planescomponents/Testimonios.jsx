import { Grid, Box, Typography } from '@mui/material';
import TestimonioCard from './TestimonioCard';

const Testimonios = () => {
  const TestimonioData = [
    {
      id: 1,
      nombre: "Carlos Pérez",
      testimonio: "Excelente servicio y atención al cliente.",
      estrellas: 5
    },
    {
      id: 2,
      nombre: "Lucía Gómez",
      testimonio: "Muy satisfecha con mi seguro de vida.",
      estrellas: 4
    },
    {
      id: 3,
      nombre: "Pedro Martínez",
      testimonio: "Fácil de contratar y con buenos beneficios.",
      estrellas: 5
    },
    {
      id: 4,
      nombre: "Ana López",
      testimonio: "Atención personalizada y rápida respuesta.",
      estrellas: 5
    },
    {
      id: 5,
      nombre: "Miguel Torres",
      testimonio: "Precios competitivos y excelente cobertura.",
      estrellas: 4
    }
  ];

  return (
    <Box sx={{ textAlign: 'center', px: 3, py: 6, bgcolor: '#F4F1F8' }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom color="#25004D">
        Lo que dicen nuestros clientes
      </Typography>
      <Typography variant="subtitle1" mb={4} color="#444">
        Conoce las experiencias reales de quienes han confiado en nosotros
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {TestimonioData.map((testimonio) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={testimonio.id}>
            <TestimonioCard 
              testimonio={testimonio.testimonio}
              nombre={testimonio.nombre}
              estrellas={testimonio.estrellas}
            />
          </Grid>
        ))}
      </Grid>

      {/* Estadísticas */}
      <Box sx={{ mt: 6 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Typography variant="h4" fontWeight="bold" color="#1976d2">
              1000+
            </Typography>
            <Typography variant="body1" color="#666">
              Clientes Satisfechos
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h4" fontWeight="bold" color="#FFCC00">
              4.8★
            </Typography>
            <Typography variant="body1" color="#666">
              Calificación Promedio
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h4" fontWeight="bold" color="#4caf50">
              99%
            </Typography>
            <Typography variant="body1" color="#666">
              Recomendación
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Testimonios;