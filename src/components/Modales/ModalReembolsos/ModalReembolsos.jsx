"use client";
import React, { useState } from 'react';
import './ModalReembolsos.css';
import PropTypes from 'prop-types';

export const ModalReembolsos = ({ open, onClose, onReembolsoExitoso }) => {
  const [archivos, setArchivos] = useState([]);
  const [error, setError] = useState(null);

  const handleAgregarArchivo = (e) => {
    const nuevosArchivos = Array.from(e.target.files);
    setArchivos((prev) => [...prev, ...nuevosArchivos]);
  };

  const handleEliminarArchivo = (index) => {
    const nuevosArchivos = archivos.filter((_, i) => i !== index);
    setArchivos(nuevosArchivos);
  };

  const handleSubmit = () => {
    if (archivos.length === 0) {
      setError('Debe adjuntar al menos un archivo.');
      return;
    }

    onReembolsoExitoso({ archivos });
    handleClose();
  };

  const handleClose = () => {
    setArchivos([]);
    setError(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <h3 className="modal-title">Solicitar Reembolso</h3>
          <p className="modal-description">
            Adjunte documentos relacionados con su solicitud.
          </p>

          <div className="form-group">
            <label htmlFor="archivoInput" className="label-text">
              Archivos adjuntos
            </label>
            <div className="file-upload-area">
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                className="hidden"
                id="archivoInput"
                onChange={handleAgregarArchivo}
              />
              <label htmlFor="archivoInput" className="file-label">
                <span className="file-text">Agregar archivo</span>
                <span className="file-icon">+</span>
              </label>
            </div>

            {archivos.length > 0 && (
              <div className="file-list">
                {archivos.map((archivo, index) => (
                  <div key={index} className="file-item">
                    <span className="file-name">{archivo.name}</span>
                    <button
                      type="button"
                      onClick={() => handleEliminarArchivo(index)}
                      className="file-remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <div className="alert-error">{error}</div>}

          <div className="modal-actions">
            <button onClick={handleClose} className="btn-cancel">
              Cancelar
            </button>
            <button onClick={handleSubmit} className="btn-submit">
              Enviar Solicitud
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ModalReembolsos.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onReembolsoExitoso: PropTypes.func.isRequired,
};