"use client";
import React, { useState, useEffect } from 'react';
import './ReembolsoAdmin.css';
import PropTypes from 'prop-types';
import { ModalReembolsoAdmin } from '../Modales/ModalReembolsoAdmin/ModalReembolsoAdmin';

export const ReembolsoAdmin = () => {
	const [clientes, setClientes] = useState([]);
	const [modalVerDocumentoAbierto, setModalVerDocumentoAbierto] = useState(false);
	const [documentoClienteSeleccionado, setDocumentoClienteSeleccionado] = useState(null);
	const [nombreClienteSeleccionado, setNombreClienteSeleccionado] = useState("");

	useEffect(() => {
		consultarClientes();
	}, []);

	const consultarClientes = async () => {
		try {
			const response = await fetch(`http://localhost:3030/usuario_revision/`);
			if (!response.ok) {
				throw new Error("Error al consultar los clientes");
			}
			const data = await response.json();
			setClientes(data);
		} catch (error) {
			console.error("Error de conexión:", error);
			alert("No se pudo conectar al servidor");
		}
	};

	const clientesFiltrados = clientes.filter(
		(cliente) => cliente.rol === "cliente"
	);

	const abrirModal = (cliente) => {
		setDocumentoClienteSeleccionado(cliente);
		setNombreClienteSeleccionado(`${cliente.nombre} ${cliente.apellido}`);
		setModalVerDocumentoAbierto(true);
	};

	return (
		<div className="revisionarchivos">
			<h2>Listado Clientes</h2>

			<table className="tabla-clientes">
				<thead>
					<tr>
						<th>Id</th>
						<th>Nombre</th>
						<th>Apellido</th>
						<th>Correo</th>
						<th>Cédula</th>
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

					{clientesFiltrados.length > 0 ? (
						clientesFiltrados.map((cliente) => (
							<tr key={cliente.id_usuario}>
								<td>{cliente.id_usuario}</td>
								<td>{cliente.nombre}</td>
								<td>{cliente.apellido}</td>
								<td>{cliente.correo}</td>
								<td>{cliente.cedula}</td>
								<td>
									<button
										className="btn-ver-documento"
										onClick={() => abrirModal(cliente)}
									>
										Ver Documento
									</button>
								</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={6} style={{ textAlign: "center" }}>
								No hay clientes registrados
							</td>
						</tr>
					)}
				</tbody>
			</table>

			<ModalReembolsoAdmin
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

ReembolsoAdmin.propTypes = {};