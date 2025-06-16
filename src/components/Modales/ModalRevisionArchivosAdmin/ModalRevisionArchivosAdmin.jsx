"use client";
import React from "react";
import "./ModalRevisionArchivosAdmin.css";

export const ModalRevisionArchivosAdmin = ({ 
  isOpen, 
  onClose, 
  cliente, 
  setCliente,
  setEstadosSeguros
}) => {
  const requisitos = [
    "Formulario de solicitud",
    "Cédula de identidad",
    "Papeleta de votación",
    "Planilla de Servicios Básicos",
    "Certificado médico",
  ];

  const aceptarUsuario = async () => {
    if (!cliente.id_usuario_seguro) {
      alert("No se encontró un ID de seguro válido.");
      return;
    }

    // Simular petición PUT
    try {
      // Aquí iría tu fetch real con la API

      // Actualizar en frontend
      setCliente((prev) => ({
        ...prev,
        estado: 1
      }));

      // Actualizar también en estadosSeguros
      setEstadosSeguros((prevList) => {
        // ✅ Asegúrate de que prevList sea un array
        if (!Array.isArray(prevList)) {
          console.error("prevList no es un array", prevList);
          return [{ id_usuario: cliente.id_usuario, estado: 1 }];
        }

        return prevList.map((seguro) =>
          seguro.id_usuario === cliente.id_usuario
            ? { ...seguro, estado: 1 }
            : seguro
        );
      });

      alert("Usuario aceptado correctamente.");
    } catch (error) {
      console.error("Error al aceptar usuario:", error);
      alert("No se pudo aceptar el usuario. Inténtalo de nuevo.");
    }
  };

  const negarUsuario = async () => {
    if (!cliente.id_usuario_seguro) {
      alert("No se encontró un ID de seguro válido.");
      return;
    }

    try {
      // Simular petición PUT
      setCliente((prev) => ({
        ...prev,
        estado: 0
      }));

      setEstadosSeguros((prevList) => {
        if (!Array.isArray(prevList)) {
          return [{ id_usuario: cliente.id_usuario, estado: 0 }];
        }

        return prevList.map((seguro) =>
          seguro.id_usuario === cliente.id_usuario
            ? { ...seguro, estado: 0 }
            : seguro
        );
      });

      alert("Usuario negado correctamente.");
    } catch (error) {
      console.error("Error al negar usuario:", error);
      alert("No se pudo negar el usuario. Inténtalo de nuevo.");
    }
  };

  // Función para verificar si subió el archivo
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
                <li key={index}>
                  <span>{archivo}</span>
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
            {requisitos.map((req, index) => (
              <li key={index}>
                <span>
                  {archivoSubido(req) ? "✅" : "❌"} {req}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Botones de acción */}
        <div className="modal-footer">
          <button className="btn-negar" onClick={negarUsuario}>
            Negar
          </button>
          <button className="btn-aceptar" onClick={aceptarUsuario}>
            Aceptar
          </button>
        </div>

        {/* Botón cerrar */}
        <button className="btn-cerrar" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};