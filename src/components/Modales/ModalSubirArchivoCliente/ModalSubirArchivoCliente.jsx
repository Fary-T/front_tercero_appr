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
	Box
} from '@mui/material';

export const ModalSubirArchivoCliente = ({
	open,
	onClose,
	requisito,
	idUsuarioSeguroPer,
	userData,
	onUploadSuccess
}) => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setSelectedFile(file);
		setError('');
		setSuccess('');
	};

	const handleConfirm = async () => {
		if (!selectedFile) {
			setError('Por favor selecciona un archivo');
			return;
		}

		if (!userData?.id_usuario_seguro_per || !userData?.cedula || !requisito?.id) {
			setError('Faltan datos requeridos para subir el archivo');
			return;
		}

		setLoading(true);
		setError('');

		try {
			const formData = new FormData();
			formData.append('archivo', selectedFile);
			formData.append('id_usuario_seguro_per', userData.id_usuario_seguro_per);
			console.log('esto', userData);
			formData.append("cedula", userData.cedula);
			formData.append('nombre_documento', requisito.nombre);
			formData.append('id_requisito_per', requisito.id);
			
			console.log("Datos enviados:", formData);

			const response = await fetch('http://localhost:3030/documentos/', {
				method: 'POST',
				body: formData,
			});

			const data = await response.json();

			if (response.ok && data.estado === 'OK') {
				setSuccess('Archivo subido exitosamente');

				// Llamar callback de éxito si existe
				if (onUploadSuccess) {
					onUploadSuccess(requisito.id, selectedFile.name);
				}
				// Cerrar modal después de un breve delay
				setTimeout(() => {
					handleClose();
				}, 1500);
			} else {
				setError(data.error || 'Error al subir el archivo');
			}
		} catch (err) {
			console.error('Error al subir archivo:', err);
			setError('Error de conexión al subir el archivo');
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setSelectedFile(null);
		setError('');
		setSuccess('');
		setLoading(false);
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>Subir archivo para {requisito?.nombre}</DialogTitle>
			<DialogContent>
				<TextField
					fullWidth
					margin="dense"
					label="Detalle del requisito"
					value={requisito?.detalle || ''}
					disabled
					multiline
					rows={3}
				/>

				<Box sx={{ mt: 2 }}>
					<input
						type="file"
						accept="application/pdf,image/*"
						onChange={handleFileChange}
						style={{
							marginTop: '1rem',
							width: '100%',
							padding: '8px',
							border: '1px solid #ccc',
							borderRadius: '4px'
						}}
					/>
				</Box>

				{selectedFile && (
					<Box sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
						<strong>Archivo seleccionado:</strong> {selectedFile.name}
						<br />
						<strong>Tamaño:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
					</Box>
				)}

				{error && (
					<Alert severity="error" sx={{ mt: 2 }}>
						{error}
					</Alert>
				)}

				{success && (
					<Alert severity="success" sx={{ mt: 2 }}>
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
					onClick={handleConfirm}
					disabled={loading || !selectedFile}
					startIcon={loading ? <CircularProgress size={20} /> : null}
				>
					{loading ? 'Subiendo...' : 'Subir'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

ModalSubirArchivoCliente.propTypes = {};