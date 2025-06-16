import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import './ModalSubirArchivoCliente.css';

export const ModalSubirArchivoCliente = ({
  abierto,
  onCerrar,
  onArchivoChange,
  onConfirmar,
  documento,
  nombreDocumento,
  idRequisitoPer,
  idSeguroPer
}) => {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [usuario, setUsuario] = useState({});

  useEffect(() => {
    if (!abierto) {
      setArchivoSeleccionado(null);
      setError('');
      setExito(false);
    }
    // Recuperar usuario del localStorage si es necesario
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, [abierto]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setArchivoSeleccionado(file);
      setError('');
      onArchivoChange(event);
    }
  };

  const eliminarArchivo = () => {
    setArchivoSeleccionado(null);
    setError('');
  };

  const handleCerrar = () => {
    setArchivoSeleccionado(null);
    setError('');
    setExito(false);
    onCerrar();
  };

  // SUBIDA REAL DE ARCHIVO
  const subirDocumento = async () => {
    if (!archivoSeleccionado) {
      setError('Por favor seleccione un archivo');
      return;
    }

    setCargando(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('archivo', archivoSeleccionado);
      formData.append('id', usuario.Id); // Ajusta el nombre de la propiedad según tu estructura
      formData.append('cedula', usuario.cedula);
      formData.append('nombre_documento', nombreDocumento);
      formData.append('id_requisito_per', idRequisitoPer);
      formData.append('id_seguro_per', idSeguroPer);

      const response = await fetch('http://localhost:3030/requisitos', {
        method: 'POST',
        body: formData,
      });

      const resultado = await response.json();

      if (resultado.estado === 'OK') {
        setExito(true);
        setTimeout(() => {
          onConfirmar();
          handleCerrar();
        }, 1500);
      } else {
        throw new Error('Error al procesar el documento');
      }
    } catch (error) {
      console.error('Error al subir documento:', error);
      setError(`Error al subir el documento: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Dialog open={abierto} onClose={handleCerrar} maxWidth="sm" fullWidth>
      <DialogTitle>Subir documento: {nombreDocumento}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            disabled={cargando}
          >
            Seleccionar archivo
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept="application/pdf,image/*"
            />
          </Button>
          {archivoSeleccionado && (
            <List>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" onClick={eliminarArchivo}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={archivoSeleccionado.name} />
              </ListItem>
            </List>
          )}
          {cargando && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}
          {exito && <Alert severity="success">¡Documento subido correctamente!</Alert>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCerrar} disabled={cargando}>Cancelar</Button>
        <Button
          onClick={subirDocumento}
          variant="contained"
          color="primary"
          disabled={cargando || !archivoSeleccionado}
        >
          Subir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalSubirArchivoCliente.propTypes = {};