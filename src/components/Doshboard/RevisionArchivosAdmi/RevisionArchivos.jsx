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
  const [estadosSeguros, setEstadosSeguros] = useState([]);
  useEffect(() => {
    consultarClientes();
    cargarEstadosSeguros();
  }, []);
  const consultarClientes = async () => {
    try {
      const response = await fetch("http://localhost:3030/usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        setClientes(data);
      } else {
        alert(data.mensaje || "Error al obtener los clientes");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar al servidor");
    }
  };
  const cargarEstadosSeguros = async () => {
    try {
      const response = await fetch("http://localhost:3030/usuario_seguro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        const estadosProcesados = data.map((seguro) => ({
          id_usuario: seguro.id_usuario_per,
          estado: seguro.estado,
        }));
        setEstadosSeguros(estadosProcesados);
      } else {
        alert(data.mensaje || "Error al obtener los estados de seguro");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar al servidor");
    }
  };
  const clientesFiltrados = clientes.filter(
    (cliente) => cliente.rol === "cliente"
  );
  const clientesConEstado = clientesFiltrados.map((cliente) => {
    const estado = estadosSeguros.find(
      (seguro) => seguro.id_usuario === cliente.id_usuario
    );
    return {
      ...cliente,
      estado: estado?.estado ?? 0, // Por defecto inactivo si no hay estado
    };
  });

  return (
    <div className="revisionarchivos">
      <h2>Listado Clientes</h2>
      {/*Lista de clientes*/}
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
              <td colSpan={6} style={{ textAlign: "center" }}>
                Cargando datos...
              </td>
            </tr>
          )}
          {/*Mosrar clientesFiltrados*/}
          {clientesConEstado.length > 0 ? (
            clientesConEstado.map((cliente) => (
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
                      setNombreClienteSeleccionado(
                        `${cliente.nombre} ${cliente.apellido}`
                      );
                      setModalVerDocumentoAbierto(true);
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
      {/*Modal para ver documentos*/}
      <ModalRevisionArchivosAdmin
      isOpen={modalVerDocumentoAbierto}
        onClose={() => setModalVerDocumentoAbierto(false)}
        cliente={documentoClienteSeleccionado}
        setCliente={setDocumentoClienteSeleccionado}/>
        
    </div>
  );
};

RevisionArchivos.propTypes = {};
