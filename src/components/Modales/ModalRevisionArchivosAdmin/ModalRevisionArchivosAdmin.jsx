"use client";
import React, { useEffect, useState } from "react";
import "./ModalRevisionArchivosAdmin.css";

export const ModalRevisionArchivosAdmin = ({
  isOpen,
  onClose,
  cliente,
  setCliente,
  setEstadosSeguros,
}) => {
  const [archivos, setArchivos] = useState([]);
  const [cargandoArchivos, setCargandoArchivos] = useState(true);

  const requisitos = [
    "Formulario de solicitud",
    "Cédula de identidad",
    "Papeleta de votación",
    "Planilla de Servicios Básicos",
    "Certificado médico",
    "Contrato",
  ];

  // Cargar archivos al abrir el modal
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

      // Filtrar por id_usuario en S3 (ajusta según tu estructura)
      const archivosDelCliente = data.filter((archivo) =>
        archivo.Key.includes(`cliente-${cliente.id_usuario}`)
      );

      setArchivos(archivosDelCliente);
    } catch (error) {
      console.error("Error al listar archivos:", error);
      alert("No se pudieron cargar los archivos");
    } finally {
      setCargandoArchivos(false);
    }
  };

  // Función para descargar un archivo
  const descargarArchivo = async (key) => {
    try {
      const nombreArchivo = key.split("/").pop();
      const url = `http://localhost:3030/documentos/descargar?key=${encodeURIComponent(
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

  // Función para eliminar un archivo
  const eliminarArchivo = async (key) => {
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
          body: JSON.stringify({ key }),
        }
      );

      if (!response.ok) throw new Error("No se pudo eliminar el archivo");

      // Actualizar lista localmente
      setArchivos((prevList) =>
        prevList.filter((archivo) => archivo.Key !== key)
      );

      alert("Archivo eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar archivo:", error);
      alert("No se pudo eliminar el archivo. Inténtalo de nuevo.");
    }
  };

  // Verifica si el archivo cumple con el requisito
  const archivoCumpleRequisito = (requisito) => {
    return archivos.some((archivo) => archivo.Key.includes(requisito));
  };

  // Aceptar usuario_seguro
  const aceptarUsuario = async () => {
    if (!cliente.id_usuario_seguro) {
      alert("No se encontró un ID de seguro válido.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3030/usuario_seguro/modificar/${cliente.id_usuario_seguro}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estado: 1, // Activo
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al guardar el estado");
      }

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      // Actualizar cliente localmente
      setCliente((prev) => ({
        ...prev,
        estado: 1,
      }));

      // Si usas setEstadosSeguros
      if (setEstadosSeguros && typeof setEstadosSeguros === "function") {
        setEstadosSeguros((prevList) => {
          if (!Array.isArray(prevList)) return [];
          return prevList.map((seguro) =>
            seguro.id_usuario === cliente.id_usuario
              ? { ...seguro, estado: 1 }
              : seguro
          );
        });
      }

      alert("Usuario aceptado correctamente.");
    } catch (error) {
      console.error("Error al aceptar usuario:", error);
      alert("No se pudo aceptar el usuario. Inténtalo de nuevo.");
    }
  };

  // Rechazar usuario_seguro
  const negarUsuario = async () => {
    if (!cliente.id_usuario_seguro) {
      alert("No se encontró un ID de seguro válido.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3030/usuario_seguro/modificar/${cliente.id_usuario_seguro}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estado: 0, // Inactivo
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al guardar el estado");
      }

      const data = await response.json();
      console.log("Usuario negado:", data);

      // Actualizar cliente localmente
      setCliente((prev) => ({
        ...prev,
        estado: 0,
      }));

      // Actualizar estadosSeguros si está disponible
      if (setEstadosSeguros && typeof setEstadosSeguros === "function") {
        setEstadosSeguros((prevList) => {
          if (!Array.isArray(prevList)) return [];
          return prevList.map((seguro) =>
            seguro.id_usuario === cliente.id_usuario
              ? { ...seguro, estado: 0 }
              : seguro
          );
        });
      }

      alert("Usuario negado correctamente.");
    } catch (error) {
      console.error("Error al negar usuario:", error);
      alert("No se pudo negar el usuario. Inténtalo de nuevo.");
    }
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
          {cargandoArchivos ? (
            <p>Cargando archivos...</p>
          ) : archivos.length > 0 ? (
            <ul>
              {archivos.map((archivo, index) => (
                <li key={index} className="archivo-item">
                  <span>{archivo.Key}</span>
                  <div className="acciones">
                    <button onClick={() => descargarArchivo(archivo.Key)}>
                      Descargar
                    </button>
                    <button onClick={() => eliminarArchivo(archivo.Key)}>
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
            {requisitos.map((req, index) => (
              <li key={index}>
                <span>
                  {archivoCumpleRequisito(req) ? "✅" : "❌"} {req}
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
