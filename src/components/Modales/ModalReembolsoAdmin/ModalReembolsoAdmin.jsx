"use client";
import React, { useState, useEffect } from "react";
import "./ModalReembolsoAdmin.css";
import PropTypes from "prop-types";

export const ModalReembolsoAdmin = ({
  isOpen,
  onClose,
  cliente,
  setCliente,
  setEstadosSeguros,
}) => {
  const [archivos, setArchivos] = useState([]);
  const [cargandoArchivos, setCargandoArchivos] = useState(true);

  useEffect(() => {
    if (isOpen && cliente?.id_usuario) {
      listarArchivosCliente();
    }
  }, [isOpen, cliente]);

  const listarArchivosCliente = async () => {
    try {
      setCargandoArchivos(true);
      const response = await fetch("http://localhost:3030/documentos/lista");
      if (!response.ok) throw new Error("Error al cargar los archivos");

      const data = await response.json();

      // Filtrar solo archivos de reembolso del cliente
      const archivosDelCliente = data.filter((archivo) => {
        if (!archivo.nombre) return false;
        const partesKey = archivo.nombre.split("/");
        const contieneReembolso = archivo.nombre.toLowerCase().includes("reembolso");

        return (
          partesKey[0] === cliente.id_usuario.toString() &&
          contieneReembolso
        );
      });

      setArchivos(archivosDelCliente);
    } catch (error) {
      console.error("Error al listar archivos:", error);
      alert("No se pudieron cargar los archivos. Revisa la consola.");
    } finally {
      setCargandoArchivos(false);
    }
  };

  const handleAceptarReembolso = () => {
    // Aquí puedes agregar la lógica para aceptar el reembolso
    alert("Reembolso aceptado correctamente");
    onClose();
  };

  if (!isOpen || !cliente) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Reembolsos de {cliente.nombre} {cliente.apellido}</h3>

        {/* Archivos subidos */}
        <div className="archivos-subidos">
          <strong>Comprobantes de reembolso:</strong>
          {cargandoArchivos ? (
            <p>Cargando archivos...</p>
          ) : archivos.length > 0 ? (
            <ul>
              {archivos.map((archivo, index) => (
                <li key={index} className="archivo-item">
                  <span>{archivo.nombre.split("/")[2]}</span>
                  <span>{archivo.nombre.split("/")[3]}</span>
                  <div className="acciones">
                    <button
                      onClick={async () => {
                        try {
                          const resp = await fetch(
                            `http://localhost:3030/documentos/descargar?key=${encodeURIComponent(archivo.nombre)}`
                          );
                          const data = await resp.json();
                          if (data.url) {
                            window.open(data.url, "_blank");
                          } else {
                            alert("No se pudo obtener la URL de previsualización.");
                          }
                        } catch (err) {
                          alert("Error al obtener la previsualización.");
                        }
                      }}
                    >
                      Ver
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No ha subido comprobantes de reembolso.</p>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-aceptar" onClick={handleAceptarReembolso}>
            Aceptar Reembolso
          </button>
          <button className="btn-eliminar" onClick={onClose}>
            Eliminar Reembolso
          </button>
        </div>

        <button className="btn-cerrar" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

ModalReembolsoAdmin.propTypes = {};