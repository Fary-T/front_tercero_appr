import React from "react";
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
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const ModalVerUsuarioCliente = ({ open, onClose, usuario }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
      maxWidth="md"
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
          </Grid>
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

ModalVerUsuarioCliente.propTypes = {};