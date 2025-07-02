"use client";
import React, { useEffect, useState } from "react";
import "./RevisionArchivos.css";
import PropTypes from "prop-types";
import { ModalRevisionArchivosAdmin } from "../../Modales/ModalRevisionArchivosAdmin";


export const RevisionArchivos = ({}) => {
  const [clientes, setClientes] = useState([]);
  const [modalVerDocumentoAbierto, setModalVerDocumentoAbierto] =
    useState(false);
  const [documentoClienteSeleccionado, setDocumentoClienteSeleccionado] =
    useState(null);
  const [nombreClienteSeleccionado, setNombreClienteSeleccionado] =
    useState("");

  useEffect(() => {
    consultarClientes();
  }, []);

  const consultarClientes = async () => {
    try {
      const response = await fetch(`http://localhost:3030/usuario_revision/`);
      console.log("Respuesta de la API:", response);
      if (!response.ok) {
        throw new Error("Error al consultar los clientes");
      }
      const data = await response.json();
      setClientes(data);
      
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error al obtener los clientes");
      alert("No se pudo conectar al servidor");
    }
  };
  const clientesFiltrados = clientes.filter(
    (cliente) => cliente.rol === "cliente"
  );

  return (
    <div className="revisionarchivos">
      <h2>Listado Clientes</h2>

      {/* Tabla de clientes */}
      <table className="tabla-clientes">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Cédula</th>
            <th>Estado</th>
            <th>Archivos</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center" }}>
                Cargando datos...
              </td>
            </tr>
          )}

          {clientesFiltrados.length > 0 ? (
            clientesFiltrados.map((cliente) => (
              <tr
                key={cliente.id_usuario}
                className={
                  cliente.estado === 1 ? "cliente-activo" : "cliente-inactivo"
                }
              >
                <td data-label="ID">{cliente.id_usuario}</td>
                <td data-label="Nombre">{cliente.nombre}</td>
                <td data-label="Apellido">{cliente.apellido}</td>
                <td data-label="Correo">{cliente.correo}</td>
                <td data-label="Cedula">{cliente.cedula}</td>
                <td data-label="Estado">
                  {cliente.estado === 1 ? "Activo" : "Inactivo"}
                </td>
                <td>
                  <button
                    className="btn-ver-documento"
                    onClick={() => {
                      setDocumentoClienteSeleccionado(cliente);
                      setModalVerDocumentoAbierto(true);
                      setNombreClienteSeleccionado(
                        `${cliente.nombre} ${cliente.apellido}`
                      );
                    }}
                  >
                    Ver Documento
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ textAlign: "center" }}>
                No hay clientes registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      <ModalRevisionArchivosAdmin
        isOpen={modalVerDocumentoAbierto}
        onClose={() => setModalVerDocumentoAbierto(false)}
        cliente={documentoClienteSeleccionado}
        setCliente={(clienteActualizado) => {
          setDocumentoClienteSeleccionado(clienteActualizado);
          setClientes((prevClientes) =>
            prevClientes.map((c) =>
              c.id_usuario === clienteActualizado.id_usuario
                ? clienteActualizado
                : c
            )
          );
        }}
      />
    </div>
  );
};

RevisionArchivos.propTypes = {};
