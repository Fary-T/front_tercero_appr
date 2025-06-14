"use client";
import React from "react";
import "./ModalRevisionArchivosAdmin.css";
import PropTypes from "prop-types";

export const ModalRevisionArchivosAdmin = ({ isOpen, onClose, cliente }) => {
  if (!isOpen) return null;
  return (
    <div className="modalrevisionarchivosadmin" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation}></div>
      <h3>
        Requisitos de {cliente.nombre} {cliente.apellido}
      </h3>
      <ul>
        {cliente.archivos && cliente.archivos.length > 0 ? (
          cliente.archivos.map((archivo, index) => (
            <li key={index}>{archivo}</li>
          ))
        ) : (
          <p>No ha subido ningún archivo.</p>
        )}
      </ul>
      <button className="btn-cerrar" onClick={onClose}>
        Cerrar
      </button>
    </div>
  );
};

ModalRevisionArchivosAdmin.propTypes = {};
