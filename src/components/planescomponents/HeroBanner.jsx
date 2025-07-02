import Slider from 'react-slick';
import { Box, Typography} from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  '/hero1.jpg',
  '/hero2.jpg',
  '/hero3.jpg',
];
const Hero = () => {  
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
  };

  return (
   <Box sx={{ position: 'relative', height: '90vh', overflow: 'hidden' }}>
      <Slider {...settings}>
        {images.map((img, index) => (
          <Box
            key={index}
            sx={{
              height: '90vh',
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
      </Slider>

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          bgcolor: 'rgba(0, 0, 0, 0.4)', // sombreado para que el texto se vea
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center',
          px: 2,
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Protege tu vida y tu salud, asegura tu tranquilidad
        </Typography>
      </Box>
    </Box>
  );
};

export default Hero;