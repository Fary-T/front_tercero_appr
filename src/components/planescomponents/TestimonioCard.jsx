import React from 'react';
import { Box, Typography, Card, CardContent, Rating } from '@mui/material';

const TestimonioCard = ({ testimonio, nombre, estrellas }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: 2,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        maxWidth: 200,
        mx: 'auto',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontSize: '2rem', color: '#1976d2', mb: 1 }}>
          "
        </Typography>
        
        <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2, color: '#555', fontSize: '0.9rem' }}>
          {testimonio}
        </Typography>
        
        <Rating 
          value={estrellas} 
          readOnly 
          sx={{ mb: 1.5 }}
          size="small"
        />
        
        <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 1.5, mt: 1.5 }}>
          <Typography variant="subtitle2" fontWeight="bold" color="#25004D">
            {nombre}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Cliente Verificado
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};


export default TestimonioCard;
