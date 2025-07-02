import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Grid,
  Box,
  Button,
  useMediaQuery,
  Divider,
  CircularProgress,
  Alert
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const ModalVerUsuario = ({ open, onClose, usuario }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  
  const [polizasData, setPolizasData] = useState([]);
  const [segurosData, setSegurosData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener datos de pólizas del usuario
  const fetchPolizasUsuario = async (idUsuario) => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener todas las relaciones usuario-seguro
      const responseUsuarioSeguro = await fetch('http://localhost:3030/usuario_seguro/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!responseUsuarioSeguro.ok) {
        throw new Error('Error al obtener datos de usuario_seguro');
      }
      
      const allUsuarioSeguro = await responseUsuarioSeguro.json();
      
      // Filtrar las pólizas del usuario actual
      const polizasUsuario = allUsuarioSeguro.filter(
        poliza => poliza.id_usuario_per === idUsuario
      );
      
      // Obtener información de todos los seguros
      const responseSeguros = await fetch('http://localhost:3030/seguro/');
      
      if (!responseSeguros.ok) {
        throw new Error('Error al obtener datos de seguros');
      }
      
      const allSeguros = await responseSeguros.json();
      
      setPolizasData(polizasUsuario);
      setSegurosData(allSeguros);
      
    } catch (err) {
      console.error('Error al cargar datos de pólizas:', err);
      setError('Error al cargar información de pólizas');
    } finally {
      setLoading(false);
    }
  };

  // Obtener nombre del seguro por ID
  const getNombreSeguro = (idSeguro) => {
    const seguro = segurosData.find(s => s.id_seguro === idSeguro);
    return seguro ? seguro.nombre : 'Seguro no encontrado';
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES');
  };

  // Obtener estado del pago en texto
  const getEstadoPago = (estado) => {
    return estado === 1 ? 'Pagado' : 'Pendiente';
  };

  // Obtener estado de la póliza en texto
  const getEstadoPoliza = (estado) => {
    return estado === 1 ? 'Activa' : 'Inactiva';
  };

  useEffect(() => {
    if (open && usuario && usuario.id_usuario) {
      fetchPolizasUsuario(usuario.id_usuario);
    }
  }, [open, usuario]);

  if (!usuario) return null;

  const fieldStyles = {
    backgroundColor: "#ede5f2",
    "& .MuiOutlinedInput-input": {
      cursor: "default",
      color: "#28044c",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#8249a0",
    },
  };

  const renderTextField = (label, value) => (
    <>
      <Typography
        variant="body2"
        color="textSecondary"
        gutterBottom
        sx={{ color: "#28044c", fontWeight: 600 }}
      >
        {label}
      </Typography>
      <TextField
        fullWidth
        value={value || ""}
        variant="outlined"
        size="small"
        InputProps={{
          readOnly: true,
          sx: fieldStyles,
        }}
      />
    </>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isSmallScreen}
      PaperProps={{
        sx: {
          borderRadius: isSmallScreen ? 0 : 2,
          m: isSmallScreen ? 0 : 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #28044c 0%, #4a1b6b 100%)",
          color: "white",
          py: 3,
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(40, 4, 76, 0.2)",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ letterSpacing: "0.5px" }}
        >
          👤 Información del Usuario
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 4, backgroundColor: "#f5f0f9" }}>
        <Box sx={{ mt: 2 }}>
          {/* Información Personal */}
          <Typography
            variant="h6"
            sx={{ 
              color: "#28044c", 
              fontWeight: 700, 
              mb: 3,
              borderBottom: "2px solid #8249a0",
              pb: 1
            }}
          >
            📋 Información Personal
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              {renderTextField("Nombre", usuario.nombre)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {renderTextField("Apellido", usuario.apellido)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {renderTextField("Correo", usuario.correo)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {renderTextField("Teléfono", usuario.telefono)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {renderTextField("Cédula", usuario.cedula)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {renderTextField("Username", usuario.username)}
            </Grid>
            <Grid item xs={12} sm={6}>
              {renderTextField("Rol", usuario.rol)}
            </Grid>
          </Grid>

          {/* Divider decorativo */}
          <Divider sx={{ my: 4, borderColor: "#8249a0" }} />

          {/* Información de Pólizas de Seguro */}
          <Typography
            variant="h6"
            sx={{ 
              color: "#28044c", 
              fontWeight: 700, 
              mb: 3,
              borderBottom: "2px solid #8249a0",
              pb: 1
            }}
          >
            🛡️ Pólizas de Seguro Contratadas
          </Typography>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress sx={{ color: "#28044c" }} />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && polizasData.length === 0 && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Este usuario no tiene pólizas de seguro contratadas.
            </Alert>
          )}

          {!loading && !error && polizasData.length > 0 && (
            <Grid container spacing={4}>
              {polizasData.map((poliza, index) => (
                <Grid item xs={12} key={poliza.id_usuario_seguro}>
                  <Box
                    sx={{
                      border: "2px solid #8249a0",
                      borderRadius: 2,
                      p: 3,
                      backgroundColor: "#ffffff",
                      mb: 2
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ 
                        color: "#28044c", 
                        fontWeight: 700, 
                        mb: 2,
                        textAlign: "center"
                      }}
                    >
                      📄 Póliza #{index + 1}
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        {renderTextField("Plan de Seguro", getNombreSeguro(poliza.id_seguro_per))}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        {renderTextField("Estado de la Póliza", getEstadoPoliza(poliza.estado))}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        {renderTextField("Fecha de Contrato", formatearFecha(poliza.fecha_contrato))}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        {renderTextField("Fecha Fin del Contrato", formatearFecha(poliza.fecha_fin))}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        {renderTextField("Estado de Pago", getEstadoPago(poliza.estado_pago))}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 4,
          pt: 2,
          justifyContent: "center",
          backgroundColor: "#f5f0f9",
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #28044c 0%, #4a1b6b 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #1f0336 0%, #3d1558 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(40, 4, 76, 0.25)",
            },
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "none",
            transition: "all 0.3s ease",
            minWidth: isSmallScreen ? "120px" : "140px",
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalVerUsuario.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  usuario: PropTypes.object
};