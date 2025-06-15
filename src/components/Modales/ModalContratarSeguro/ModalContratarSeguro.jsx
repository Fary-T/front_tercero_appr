"use client";
import { Box, Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import './ModalContratarSeguro.css';

export const ModalContratarSeguro = ({ open, onClose, plan, userData }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [idRequisito, setIdRequisito] = useState('');

  useEffect(() => {
    if (!open) {
      setFile(null);
      setFileName('');
      setUploadError(null);
      setUploadSuccess(false);
      setIdRequisito('');
    }
  }, [open]);

  if (!plan) return null;

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setUploadError(null);
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async() => {
  }
    
  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Contratar Plan</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="plan-info-modal">
          <h3 className="selected-plan">Estás contratando: {plan.title}</h3>
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