"use client";
import React, { useEffect, useState } from "react";
import "./RevisionArchivos.css";
import PropTypes from "prop-types";
import { ModalRevisionArchivosAdmin } from "../../Modales/ModalRevisionArchivosAdmin";

export const RevisionArchivos = ({}) => {
  const [clientes, setClientes] = useState([]);
  const [modalVerDocumentoAbierto, setModalVerDocumentoAbierto] = useState(false);
  const [documentoClienteSeleccionado, setDocumentoClienteSeleccionado] = useState(null);
  const [nombreClienteSeleccionado, setNombreClienteSeleccionado] = useState("");
  const [estadosSeguros, setEstadosSeguros] = useState([]);

  // Datos quemados simulando /usuario
  const mockUsuarios = [
    {
      id_usuario: 9,
      nombre: "asasasasasl",
      apellido: "sasasssasas",
      correo: "sas@gmail.com",
      cedula: "1234567899",
      rol: "cliente"
    },
  ];

  // Datos quemados simulando /usuario_seguro
  const mockUsuarioSeguro = [
    {
      id_usuario_seguro: 19,
      id_usuario_per: 9,
      id_seguro_per: 1,
      fecha_contrato: "2025-06-05",
      fecha_fin: "2027-06-05",
      estado: 0,
      estado_pago: 1
    },
  ];

  useEffect(() => {
    consultarClientes();
    cargarEstadosSeguros();
  }, []);

  const consultarClientes = async () => {
    try {
      const data = mockUsuarios;
      if (data) {
        setClientes(data);
      } else {
        alert("Error al obtener los clientes");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar al servidor");
    }
  };

  const cargarEstadosSeguros = async () => {
    try {
      const data = mockUsuarioSeguro;

      if (data) {
        const estadosProcesados = data.map((seguro) => ({
          id_usuario: seguro.id_usuario_per,
          estado: seguro.estado,
        }));
        setEstadosSeguros(estadosProcesados); // ✅ Esto es un array
      } else {
        alert("Error al obtener los estados de seguro");
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
      estado: estado?.estado ?? 0,
    };
  });

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
              <td colSpan={6} style={{ textAlign: "center" }}>
                Cargando datos...
              </td>
            </tr>
          )}

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
                      const seguroData = mockUsuarioSeguro.find(
                        (u) => u.id_usuario_per === cliente.id_usuario
                      );

                      const clienteConDatosCompletos = {
                        ...cliente,

                        id_usuario_seguro: seguroData?.id_usuario_seguro || null,
                        id_seguro_per: seguroData?.id_seguro_per || null,
                        fecha_contrato: seguroData?.fecha_contrato || null,
                        fecha_fin: seguroData?.fecha_fin || null,
                        estado_pago: seguroData?.estado_pago || null,
                      };

                      setDocumentoClienteSeleccionado(clienteConDatosCompletos);
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

      {/* Modal */}
      <ModalRevisionArchivosAdmin
        isOpen={modalVerDocumentoAbierto}
        onClose={() => setModalVerDocumentoAbierto(false)}
        cliente={documentoClienteSeleccionado}
        setCliente={setDocumentoClienteSeleccionado}
        setEstadosSeguros={setEstadosSeguros} // ✅ Pasamos el setter al modal
      />
    </div>
  );
};

RevisionArchivos.propTypes = {};