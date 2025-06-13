'use client';
import React from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './SubirArchivoCliente.css';

export const SubirArchivoCliente = ({ idUsuario }) => {
  const [archivo, setArchivo] = React.useState(null);
  const [subiendo, setSubiendo] = React.useState(false);
  const [error, setError] = React.useState('');
  const [mensaje, setMensaje] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
    setError('');
    setMensaje('');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async () => {
    if (!archivo) {
      setError('Por favor selecciona un archivo.');
      setOpenSnackbar(true);
      return;
    }

    setSubiendo(true);

    try {
      const formData = new FormData();
      formData.append('archivo', archivo);
      formData.append('id_usuario', idUsuario);
///AQUI YA NO SE
      const response = await fetch('/api/documentos/subir', {
        method: 'POST',
        body: JSON.stringify({
          archivo: formData,
          id: idUsuario
        })
      });

      if (!response.ok) throw new Error('Error al subir el archivo');
      
      setMensaje('Archivo subido correctamente.');
      setError('');
      setArchivo(null);
    } catch (err) {
      setError(err.message || 'Error al subir el archivo.');
      setMensaje('');
    } finally {
      setSubiendo(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box className="subirarchivocliente">
      <Card className="card">
        <CardContent>
          <Box className="header">
            <IconButton variant="contained" className="iconButton">
              <CloudUploadIcon fontSize="inherit" />
            </IconButton>
            <Typography variant="h5" className="title">
              Carga tu Solicitud de Seguro
            </Typography>
            <Typography className="description">
              Selecciona y sube tu documento de seguro de forma segura y elegante.
            </Typography>
          </Box>

          <div className={`uploadArea ${archivo ? 'hasFile' : ''}`}>
            <input
              type="file"
              onChange={handleFileChange}
              className="uploadInput"
              accept=".pdf"
            />
            
            {archivo ? (
              <div className="fileSelectedContent">
                <CheckCircleIcon className="fileIcon" />
                <div className="uploadText">
                  <Typography className="fileName">
                    {archivo.name}
                  </Typography>
                  <Typography className="fileSize">
                    {formatFileSize(archivo.size)}
                  </Typography>
                </div>
                <Button 
                  variant="outlined" 
                  className="changeFileButton"
                  size="small"
                >
                  Cambiar archivo
                </Button>
              </div>
            ) : (
              <div className="uploadContent">
                <CloudUploadIcon className="uploadIcon" />
                <div className="uploadText">
                  <Typography className="uploadMainText">
                    Arrastra tu archivo aquí
                  </Typography>
                  <Typography className="uploadSubText">
                    o haz clic para seleccionar
                  </Typography>
                  <Typography className="uploadFormats">
                    PDF, DOC, DOCX, JPG, PNG (máx. 10MB)
                  </Typography>
                </div>
              </div>
            )}
          </div>

          {subiendo && <LinearProgress className="progressBar" />}
          
          <Button
            onClick={handleSubmit}
            disabled={subiendo}
            fullWidth
            className="buttonSubmit"
          >
            {subiendo ? 'Subiendo...' : 'Enviar Archivo'}
          </Button>
        </CardContent>
      </Card>

      {/* Alerta centrada */}
      {openSnackbar && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: error ? '#f44336' : '#4caf50',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '8px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
          zIndex: 1000,
          fontWeight: 600,
          backdropFilter: 'blur(10px)'
        }}>
          {error || mensaje}
        </div>
      )}
    </Box>
  );
};

SubirArchivoCliente.propTypes = {};