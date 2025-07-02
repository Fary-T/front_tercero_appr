"use client";
import { Box, Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import './ModalContratarSeguro.css';

export const ModalContratarSeguro = ({ open, onClose, plan, userData }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (!open) {
      setFile(null);
      setFileName('');
    }
  }, [open]);

  if (!plan) return null;

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

 const handleSubmit = async () => {
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("id_usuario_per", userData.id_usuario);
    formData.append("cedula", userData.cedula);
    formData.append("nombre_documento", `formulario-${plan.nombre}`); 
    formData.append("id_seguro_per", plan.id_seguro);
    console.log(userData);
    console.log(formData);
    const response = await fetch("http://35.172.129.60:3030/documentos/formulario", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Documento enviado correctamente");
      onClose();
    } else {
      const data = await response.json();
      console.error("Error al enviar:", data);
      alert("Error al enviar el documento");
    }
  } catch (error) {
    console.error("Error de conexión:", error);
    alert("Error de conexión al enviar el documento");
  }
};
   
  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Contratar Plan</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="plan-info-modal">
          <h3 className="selected-plan">Estás contratando: {plan.nombre}</h3>
        </div>

        <div className="file-upload-section">
          <p className="upload-instruction">Por favor, sube el documento requerido:</p>
          
          <div className="file-input-container" onClick={() => document.getElementById('file-input').click()}>
            <div className="upload-icon">📁</div>
            <p className="upload-text">
              {fileName ? 'Cambiar documento' : 'Seleccionar documento'}
            </p>
            <input 
              id="file-input"
              type="file" 
              className="hidden-input"
              onChange={handleFileChange} 
            />
          </div>

          {fileName && (
            <div className="file-info">
              <span className="file-icon">📄</span>
              <span className="file-name">Documento seleccionado: {fileName}</span>
            </div>
          )}
        </div>

        <div className="buttons-container">
          <button className="cancel-button" onClick={onClose}>
            Cancelar
          </button>
          <button 
            className={`submit-button ${!file ? 'disabled' : ''}`}
            onClick={handleSubmit}
            disabled={!file}
          >
            Enviar Documento
          </button>
        </div>
      </Box>
    </Modal>
  );
};

ModalContratarSeguro.propTypes = {};