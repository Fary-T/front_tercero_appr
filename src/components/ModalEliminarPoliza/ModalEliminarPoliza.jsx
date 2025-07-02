import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const ModalEliminarPoliza = ({ open, onClose, poliza, onEliminar }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleEliminar = async () => {
    try {
      const response = await fetch(`http://35.172.129.60:3030/seguro/eliminar/${poliza.id_seguro}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        alert('Póliza eliminada correctamente.');
        onEliminar?.(); // Refresca la lista
        onClose();       // Cierra el modal
      } else {
        alert(data.mensaje || 'Error al eliminar la póliza');
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar al servidor");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isSmallScreen}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={{ position: 'relative', pr: 5 }}>
        Confirmar Eliminación
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography textAlign="center" variant="body1">
          ¿Estás seguro de que deseas eliminar la póliza{' '}
          <strong>{poliza?.nombre}</strong>?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Box display="flex" flexDirection={isSmallScreen ? 'column' : 'row'} gap={2}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            fullWidth={isSmallScreen}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleEliminar}
            variant="contained"
            color="error"
            fullWidth={isSmallScreen}
          >
            Aceptar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

ModalEliminarPoliza.propTypes = {};