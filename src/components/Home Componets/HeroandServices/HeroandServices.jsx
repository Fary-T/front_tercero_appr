"use client";
import React from "react";
import "./HeroandServices.css";
import {
  Box,
  Button,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const HeroandServices = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const headingFontSize = isXs ? "1.8rem" : "3.5rem";
  const paragraphFontSize = isXs ? "0.85rem" : "1.35rem";
  const imageMaxHeight = isXs ? 180 : 400;

  const irAPlanes = () => {
    navigate("/Planes");
  };

  return (
    <>
      {/* Sección principal */}
      <Box
        sx={{
          bgcolor: "#25004D",
          color: "white",
          py: { xs: 3, md: 4 },
          px: { xs: 2, md: 8 },
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ maxWidth: 1200, width: "100%" }}>
          {/* Layout para Desktop */}
          {/* Layout para Desktop */}
          <Grid
            container
            spacing={0} // eliminamos espacio adicional entre columnas
            alignItems="center"
            justifyContent="space-between"
            sx={{
              display: { xs: "none", md: "flex" },
            }}
          >
            <Grid item md={6} sx={{ textAlign: "left", pr: 4 }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  mb: 3,
                  fontSize: headingFontSize,
                  textAlign: "left",
                }}
              >
                Empieza a proteger tu futuro hoy
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  maxWidth: "700px",
                  fontSize: paragraphFontSize,
                  lineHeight: 1.5,
                  textAlign: "left",
                }}
              >
                Asegura tu bienestar y el de tu familia con nuestros seguros
                confiables. Comienza hoy mismo a construir un futuro más seguro
                y sin preocupaciones.
              </Typography>
              <Box sx={{ textAlign: "left" }}>
                <Button
                  variant="contained"
                  onClick={irAPlanes}
                  sx={{
                    bgcolor: "#FFD700",
                    color: "#25004D",
                    fontWeight: "bold",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  Ver planes
                </Button>
              </Box>
            </Grid>
            <Grid item md={6} sx={{ pl: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Box
                  component="img"
                  src="/miss.png"
                  alt="Ilustración de seguridad"
                  sx={{
                    maxWidth: "100%",
                    height: "auto",
                    maxHeight: imageMaxHeight,
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Layout para Mobile */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Texto - lado izquierdo */}
            <Box sx={{ flex: 1, pr: 1 }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  fontSize: headingFontSize,
                  textAlign: "left",
                }}
              >
                Empieza a proteger tu futuro hoy
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  fontSize: paragraphFontSize,
                  lineHeight: 1.4,
                  textAlign: "left",
                }}
              >
                Asegura tu bienestar y el de tu familia con nuestros seguros
                confiables. Comienza hoy mismo a construir un futuro más seguro.
              </Typography>
              <Box sx={{ textAlign: "left" }}>
                <Button
                  variant="contained"
                  onClick={irAPlanes}
                  sx={{
                    bgcolor: "#FFD700",
                    color: "#25004D",
                    fontWeight: "bold",
                    px: 3,
                    py: 1.2,
                    fontSize: "1rem",
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  Ver planes
                </Button>
              </Box>
            </Box>

            {/* Imagen - lado derecho */}
            <Box
              sx={{
                flex: "0 0 auto",
                width: "140px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                component="img"
                src="/miss.png"
                alt="Ilustración de seguridad"
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: imageMaxHeight,
                  objectFit: "contain",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Sección de servicios */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          px: { xs: 2, md: 8 },
          maxWidth: 1200,
          mx: "auto",
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: "bold",
            color: "#25004D",
            mb: 6,
            textAlign: { xs: "center", md: "left" },
            fontSize: { xs: "1.8rem", md: "2.5rem" },
          }}
        >
          Nuestros Servicios
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={6} sm={6} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                p: 2,
                minHeight: "220px",
              }}
            >
              <Box
                component="img"
                src="hearth.png"
                alt="Icono de Seguro de Vida"
                sx={{ height: 140, width: 140, mb: 2 }}
              />
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: "bold",
                  color: "#25004D",
                  mb: 1,
                }}
              >
                Seguro de vida
              </Typography>
              <Typography sx={{ maxWidth: "250px", color: "#25004D" }}>
                Tranquilidad para ti, protección para los que amas.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={6} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                p: 2,
                minHeight: "220px",
              }}
            >
              <Box
                component="img"
                src="/cruise.png"
                alt="Icono de Seguro de Salud"
                sx={{ height: 140, width: 140, mb: 2 }}
              />
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: "bold",
                  color: "#25004D",
                  mb: 1,
                }}
              >
                Seguro de salud
              </Typography>
              <Typography sx={{ maxWidth: "250px", color: "#25004D" }}>
                Cuida tu bienestar con acceso rápido y seguro a atención médica
                de calidad.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
