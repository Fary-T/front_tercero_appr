'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import './SubirArchivoCliente.css';

export const SubirArchivoCliente = ({ idUsuario, guardarPolizaBase, handleClose }) => {
  const [archivo, setArchivo] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '', mostrar: false });
  const [progreso, setProgreso] = useState(0);

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto, mostrar: true });
  };

  const cerrarMensaje = () => {
    setMensaje({ ...mensaje, mostrar: false });
  };

  const handleArchivoChange = (e) => {
    const archivoSeleccionado = e.target.files[0];
    if (archivoSeleccionado && archivoSeleccionado.type !== 'application/pdf') {
      mostrarMensaje('error', 'Solo se permiten archivos PDF');
      return;
    }
    setArchivo(archivoSeleccionado);
    setProgreso(0);
  };

  const guardarPDF = async () => {
    if (!archivo) {
      mostrarMensaje('warning', 'Selecciona un archivo PDF');
      return;
    }

    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("idUsuario", idUsuario);

    setCargando(true);
    setProgreso(0);

    try {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const porcentaje = (e.loaded / e.total) * 100;
          setProgreso(porcentaje);
        }
      });

      const promesa = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error('Error en la subida'));
          }
        };
        xhr.onerror = () => reject(new Error('Error de conexión'));
      });

      xhr.open('POST', 'http://localhost:3030/login');
      xhr.send(formData);

      const data = await promesa;
      
      mostrarMensaje('success', 'Archivo subido con éxito');
      setArchivo(null);
      setProgreso(0);
      
      // Limpiar input file
      const inputFile = document.querySelector('input[type="file"]');
      if (inputFile) inputFile.value = '';
      
      // Llamar función del componente padre si existe
      if (guardarPolizaBase) {
        guardarPolizaBase();
      }
      
      // Cerrar modal si existe
      if (handleClose) {
        handleClose();
      }

    } catch (err) {
      console.error("Error al subir archivo:", err);
      mostrarMensaje('error', 'No se pudo subir el archivo');
    } finally {
      setCargando(false);
    }
  };

  const descargarArchivo = async (nombre) => {
    try {
      setCargando(true);
      const res = await fetch(`http://localhost:3030/login/descarga/${encodeURIComponent(nombre)}`);
      
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.open(data.url, "_blank");
          mostrarMensaje('success', 'Descarga iniciada');
        } else {
          mostrarMensaje('error', 'No se encontró la URL de descarga');
        }
      } else {
        mostrarMensaje('error', 'Error al descargar el archivo');
      }
    } catch (err) {
      console.error("Error al descargar archivo:", err);
      mostrarMensaje('error', 'Error de conexión al descargar');
    } finally {
      setCargando(false);
    }
  };

  const eliminarArchivo = async (nombre) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el archivo "${nombre}"?`)) {
      return;
    }

    try {
      setCargando(true);
      const res = await fetch(`http://localhost:3030/login/eliminar/${encodeURIComponent(nombre)}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        mostrarMensaje('success', 'Archivo eliminado');
        setDocumentos(documentos.filter(doc => doc.nombre !== nombre));
      } else {
        mostrarMensaje('error', data.error || 'No se pudo eliminar el archivo');
      }
    } catch (err) {
      console.error("Error al eliminar archivo:", err);
      mostrarMensaje('error', 'Error en la conexión con el servidor');
    } finally {
      setCargando(false);
    }
  };

  return (
    <Box className='base' sx={{ p: 3 }}>
      {/* Sección de subida de archivos */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Subir Archivo PDF
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 2 }}
              disabled={cargando}
            >
              Seleccionar Archivo PDF
              <input
                type="file"
                accept="application/pdf"
                onChange={handleArchivoChange}
                hidden
              />
            </Button>
            
            {archivo && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InsertDriveFileIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {archivo.name} ({(archivo.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
              </Box>
            )}
          </Box>

          {progreso > 0 && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress variant="determinate" value={progreso} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Subiendo... {Math.round(progreso)}%
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            onClick={guardarPDF}
            disabled={!archivo || cargando}
            startIcon={cargando ? <CircularProgress size={16} /> : <CheckCircleIcon />}
          >
            {cargando ? 'Subiendo...' : 'Guardar Archivo'}
          </Button>
        </CardContent>
      </Card>

      {/* Sección de lista de documentos */}
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Documentos Subidos
          </Typography>
          
          {documentos.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay documentos subidos
            </Typography>
          ) : (
            <List>
              {documentos.map((documento, index) => (
                <ListItem key={index} divider>
                  <ListItemIcon>
                    <InsertDriveFileIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={documento.nombre}
                    secondary={documento.fechaSubida ? new Date(documento.fechaSubida).toLocaleDateString() : ''}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => descargarArchivo(documento.nombre)}
                      disabled={cargando}
                      sx={{ mr: 1 }}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => eliminarArchivo(documento.nombre)}
                      disabled={cargando}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Snackbar para mensajes */}
      <Snackbar
        open={mensaje.mostrar}
        autoHideDuration={6000}
        onClose={cerrarMensaje}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={cerrarMensaje} severity={mensaje.tipo} sx={{ width: '100%' }}>
          {mensaje.texto}
        </Alert>
      </Snackbar>
    </Box>
  );
};

SubirArchivoCliente.propTypes = {};