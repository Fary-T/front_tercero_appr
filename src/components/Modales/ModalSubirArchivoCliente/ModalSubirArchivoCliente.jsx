'use client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Alert,
	CircularProgress,
	Box,
	Typography
} from '@mui/material';

export const ModalSubirArchivoCliente = ({
	open,
	onClose,
	requisito,
	idUsuarioSeguro,
	userData,
	onUploadSuccess
}) => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleFileChange = (event) => {
		const file = event.target.files?.[0];
		if (file) {
			if (!file.type.match(/(pdf|image\/.*)/)) {
				setError('Solo se permiten archivos PDF o imágenes');
				return;
			}
			if (file.size > 5 * 1024 * 1024) {
				setError('El archivo no debe exceder los 5MB');
				return;
			}
			setSelectedFile(file);
			setError('');
			setSuccess('');
		}
	};

	const handleSubmit = async () => {
		if (!selectedFile) {
			setError('Por favor selecciona un archivo válido');
			return;
		}
		console.log("ID del usuario seguro:", idUsuarioSeguro);
		console.log("ID del requisito:", requisito?.id);
		if (!requisito?.id || !idUsuarioSeguro) {
			setError('Información del requisito o seguro incompleta');
			return;
		}

		setLoading(true);
		setError('');

		try {
			const formData = new FormData();
			formData.append('archivo', selectedFile);
			formData.append('id_usuario_seguro_per', idUsuarioSeguro);
			formData.append("cedula", userData.cedula);
			formData.append('nombre_documento', requisito.nombre);
			formData.append('id_requisito_per', requisito.id);

			const response = await fetch('http://localhost:3030/documentos/', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Error en el servidor');
			}

			const data = await response.json();
			setSuccess('Documento subido exitosamente');

			if (onUploadSuccess) {
				onUploadSuccess(requisito.id, data.nombreArchivo);
			}

			setTimeout(() => {
				setSelectedFile(null);
				setSuccess('');
				onClose(true);
			}, 1500);
		} catch (err) {
			console.error('Error al subir archivo:', err);
			setError(err.message || 'Error al subir el documento');
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		if (!loading) {
			setSelectedFile(null);
			setError('');
			setSuccess('');
			onClose(false);
		}
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>Subir documento: {requisito?.nombre}</DialogTitle>
			<DialogContent dividers>
				<Box mb={2}>
					<Typography variant="subtitle2">Detalles del requisito:</Typography>
					<Typography variant="body2" color="text.secondary">
						{requisito?.detalle || 'No hay descripción disponible'}
					</Typography>
				</Box>

				<Box mb={3}>
					<Button
						variant="outlined"
						component="label"
						disabled={loading || success}
						fullWidth
					>
						Seleccionar Archivo
						<input
							type="file"
							accept="application/pdf, image/*"
							onChange={handleFileChange}
							hidden
						/>
					</Button>

					{selectedFile && (
						<Box mt={1} p={1} bgcolor="action.hover" borderRadius={1}>
							<Typography variant="body2">
								<strong>Archivo:</strong> {selectedFile.name}<br />
								<strong>Tipo:</strong> {selectedFile.type}<br />
								<strong>Tamaño:</strong> {(selectedFile.size / 1024).toFixed(2)} KB
							</Typography>
						</Box>
					)}
				</Box>

				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				{success && (
					<Alert severity="success" sx={{ mb: 2 }}>
						{success}
					</Alert>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} disabled={loading}>
					Cancelar
				</Button>
				<Button
					variant="contained"
					color="primary"
					onClick={handleSubmit}
					disabled={loading || !selectedFile || success}
					startIcon={loading && <CircularProgress size={20} color="inherit" />}
				>
					{loading ? 'Subiendo...' : 'Subir Documento'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

ModalSubirArchivoCliente.propTypes = {};