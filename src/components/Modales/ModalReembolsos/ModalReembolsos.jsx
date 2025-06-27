"use client";
import React, { useState, useEffect } from 'react';
import './ModalReembolsos.css';
import PropTypes from 'prop-types';

export const ModalReembolsos = ({
  open,
  onClose,
  onReembolsoExitoso,
  id_usuario_per,
  id_usuario_seguro_per
}) => {
  const [archivos, setArchivos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Validación de props al abrir
  useEffect(() => {
    if (open && (!id_usuario_per || !id_usuario_seguro_per)) {
      console.warn("Faltan props requeridos:", {
        id_usuario_per,
        id_usuario_seguro_per
      });
      setError("Faltan datos del usuario o del seguro.");
    }
  }, [open, id_usuario_per, id_usuario_seguro_per]);

  const handleAgregarArchivo = (e) => {
    const nuevosArchivos = Array.from(e.target.files);
    setArchivos((prev) => [...prev, ...nuevosArchivos]);
  };

  const handleEliminarArchivo = (index) => {
    const nuevosArchivos = archivos.filter((_, i) => i !== index);
    setArchivos(nuevosArchivos);
  };

  const handleSubmit = async () => {
    // Validaciones
    if (!id_usuario_per || !id_usuario_seguro_per) {
      setError("Faltan datos del usuario o del seguro.");
      return;
    }

    if (archivos.length === 0) {
      setError("Debe adjuntar al menos un archivo.");
      return;
    }

    setError(null);
    setLoading(true);

    const formData = new FormData();
    archivos.forEach((archivo) => {
      formData.append('archivos', archivo); // como usas multer.any(), está bien así
    });
    formData.append('id_usuario_per', id_usuario_per);
    formData.append('id_usuario_seguro_per', id_usuario_seguro_per);

    try {
      const response = await fetch('http://localhost:3030/documentos/reembolsos', {
        method: 'POST',
        body: formData
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.error || 'Error al enviar los archivos');
      }

      onReembolsoExitoso(); // Recargar datos en el componente padre
      handleClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setArchivos([]);
    setError(null);
    setLoading(false);
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
            <button onClick={handleClose} className="btn-cancel" disabled={loading}>
              Cancelar
            </button>
            <button onClick={handleSubmit} className="btn-submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
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
  id_usuario_per: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  id_usuario_seguro_per: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
