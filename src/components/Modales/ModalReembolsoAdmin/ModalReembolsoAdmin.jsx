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
      const response = await fetch("http://35.172.129.60:3030/documentos/lista");
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

  const descargarArchivo = async (key) => {
    try {
      const nombreArchivo = key.split("/").pop();
      const url = `http://35.172.129.60:3030/documentos/descargar?key=${encodeURIComponent(
        key
      )}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("No se pudo descargar el archivo");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", nombreArchivo);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar:", error);
      alert("No se pudo descargar el archivo. Inténtalo de nuevo.");
    }
  };

  const eliminarArchivo = async (key) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este archivo?")) return;

    try {
      const response = await fetch("http://35.172.129.60:3030/documentos/eliminar", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      if (!response.ok) throw new Error("No se pudo eliminar el archivo");

      setArchivos((prevList) => prevList.filter((archivo) => archivo.Key !== key));
      alert("Archivo eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar archivo:", error);
      alert("No se pudo eliminar el archivo. Inténtalo de nuevo.");
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
                    <button onClick={() => descargarArchivo(archivo.Key)}>Descargar</button>
                    <button onClick={() => eliminarArchivo(archivo.Key)}>Eliminar</button>
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