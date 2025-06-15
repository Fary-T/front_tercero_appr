"use client";
import React, { useState, useEffect } from "react";
import "./ModalRevisionArchivosAdmin.css";
import PropTypes from "prop-types";

export const ModalRevisionArchivosAdmin = ({ isOpen, onClose, cliente,setCliente }) => {
  const requisitos = [
    "Formulario de solicitud",
    "Cédula de identidad",
    "Papeleta de votación",
    "Planilla de Servicios Básicos",
    "Certificado médico",
  ];

  // Cargar requisitos desde la API al abrir el modal
  const descargarArchivo = async (nombreArchivo) => {
    try {
      const response = await fetch(
        "http://localhost:3030/documentos/descargar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombre: nombreArchivo }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al descargar el archivo");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", nombreArchivo);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      alert("No se pudo descargar el archivo. Inténtalo de nuevo más tarde.");
    }
  };
  //Funcion para eliminar archivos
  const eliminarArchivo = async (idUsuario, nombreArchivo) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este archivo?"))
      return;

    try {
      const response = await fetch(
        "http://localhost:3030/documentos/eliminar",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_usuario: idUsuario,
            nombre: nombreArchivo,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el archivo");
      }

      // Actualizar el estado local SOLO si la eliminación fue exitosa
      setCliente((prev) => ({
        ...prev,
        archivos: prev.archivos.filter((archivo) => archivo !== nombreArchivo),
      }));

      alert("Archivo eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar el archivo.");
    }
  };
  // Función para verificar si el cliente ya ha subido el archivo
  const archivoSubido = (requisito) => {
    return cliente.archivos && cliente.archivos.includes(requisito);
  };
  if (!isOpen || !cliente) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>
          Requisitos de {cliente.nombre} {cliente.apellido}
        </h3>

        {/* Archivos subidos */}
        <div className="archivos-subidos">
          <strong>Archivos subidos:</strong>
          {cliente.archivos && cliente.archivos.length > 0 ? (
            <ul>
              {cliente.archivos.map((archivo, index) => (
                <li key={archivo} className="archivo-item">
                  <span>{archivo}</span>
                  <div className="acciones">
                    <button onClick={() => descargarArchivo(archivo)}>
                      Descargar
                    </button>
                    {/* Botòn Eliminar*/}
                    <button
                      onClick={() =>
                        eliminarArchivo(cliente.id_usuario, archivo)
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No ha subido ningún archivo.</p>
          )}
        </div>

        {/* Listado de requisitos */}
        <div className="listado-requisitos">
          <strong>Requisitos:</strong>
          <ul>
            {requisitos.map((requisito, index) => (
              <li key={index}>
                <span>
                  {archivoSubido(requisito) ? "✅" : "❌"}
                  {requisito}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Botón cerrar */}
        <button className="btn-cerrar" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

ModalRevisionArchivosAdmin.propTypes = {};
