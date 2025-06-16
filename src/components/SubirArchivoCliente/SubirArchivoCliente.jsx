'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography
} from '@mui/material';
import { ModalSubirArchivoCliente } from '../Modales/ModalSubirArchivoCliente/ModalSubirArchivoCliente';

// Elimina documentosIniciales, ya no lo necesitas

export const SubirArchivoCliente = () => {
  const [documentos, setDocumentos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [documentoActual, setDocumentoActual] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [nombre_documento, setNombreDocumento] = useState('');
  const [idRequisitoPer, setIdRequisitoPer] = useState('');
  const [idSeguroPer, setIdSeguroPer] = useState('');

  // Cargar documentos desde la API al montar el componente
  useEffect(() => {
    fetch('http://localhost:3030/requisitos/documentos')
      .then(res => res.json())
      .then(data => setDocumentos(data))
      .catch(err => {
        console.error('Error al cargar documentos:', err);
        setDocumentos([]);
      });
  }, []);

  const manejarClickDocumento = (doc) => {
    setDocumentoActual(doc);
    setArchivo(null);
    setModalAbierto(true);
    setNombreDocumento(doc.nombre);
    setIdRequisitoPer(doc.id_requisito_per);
    setIdSeguroPer(doc.id_usuario_seguro);
  };

  const cerrarModal = () => setModalAbierto(false);

  const handleArchivoChange = (event) => {
    setArchivo(event.target.files[0]);
  };

  const handleConfirmarSubida = () => {
    if (archivo) {
      // Aquí puedes implementar la subida real del archivo a tu backend si lo deseas
      const actualizados = documentos.map((doc) =>
        doc.id === documentoActual.id ? { ...doc, estado: 'subido' } : doc
      );
      setDocumentos(actualizados);
      cerrarModal();
    } else {
      alert('Por favor seleccione un archivo');
    }
  };

  const obtenerColorBoton = (estado) => {
    return estado === 'subido' ? 'success' : 'error';
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Documentos requeridos
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Documento</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documentos.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <Button
                    variant="outlined"
                    color={obtenerColorBoton(doc.estado)}
                    onClick={() => manejarClickDocumento(doc)}
                    fullWidth
                  >
                    {doc.nombre}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ModalSubirArchivoCliente
        abierto={modalAbierto}
        documento={documentoActual}
        onCerrar={cerrarModal}
        onArchivoChange={handleArchivoChange}
        onConfirmar={handleConfirmarSubida}
        nombreDocumento={nombre_documento}
        idRequisitoPer={idRequisitoPer}
        idSeguroPer={idSeguroPer}
      />
    </Box>
  );
};

SubirArchivoCliente.propTypes = {};