import React, { useRef, useState } from 'react';
import './Formulario.css';

const Formulario = ({ plan = "Plan Básico Salud" }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    cedula: '',
    username: '',
    password: '',
    activo: 1,
    tipo: 2,
    rol: 'cliente'
  });

  const res = useRef();
  const [correoError, setCorreoError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === 'nombre' || name === 'apellido') && !/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/.test(value)) return;
    if ((name === 'telefono' || name === 'cedula') && !/^\d*$/.test(value)) return;

    if (name === 'correo') {
      const regexCorreo = /^[^\s@]+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com)$/i;
      if (!regexCorreo.test(value)) {
        setCorreoError('Correo inválido. Usa gmail, hotmail, outlook o yahoo.');
      } else {
        setCorreoError('');
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.cedula.length !== 10) return alert('La cédula debe tener exactamente 10 dígitos.');
    if (formData.telefono.length !== 10) return alert('El teléfono debe tener exactamente 10 dígitos.');

    try {
      const response = await fetch('https://r4jdf9tl-3030.use.devtunnels.ms/usuario/agregar', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      await fetch(`https://r4jdf9tl-3030.use.devtunnels.ms/usuario_seguro/mensaje/${formData.correo}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: formData.cedula }),
      });

      if (!response.ok) throw new Error('Error al registrar el usuario');

      alert('¡Usuario registrado exitosamente!');
      setFormData({
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        cedula: '',
        username: '',
        password: '',
        activo: 1,
        tipo: 2,
        rol: 'cliente'
      });
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Hubo un error al registrar.');
    }
  };

  return (
    <form ref={res} className="formulario" onSubmit={handleSubmit}>
      <h2 className="formulario__titulo">Activa tu {plan} de forma rápida y segura</h2>
      <p className="formulario__subtitulo">Completa este formulario y da el primer paso hacia tu tranquilidad.</p>

      <input type="text" name="nombre" placeholder="Nombre *" value={formData.nombre} onChange={handleChange} required />
      <input type="text" name="apellido" placeholder="Apellido *" value={formData.apellido} onChange={handleChange} required />
      <input type="email" name="correo" placeholder="Correo electrónico *" value={formData.correo} onChange={handleChange} required />
      {correoError && <span className="formulario__error">{correoError}</span>}

      <input type="text" name="telefono" placeholder="Teléfono *" value={formData.telefono} onChange={handleChange} maxLength="10" required />
      {formData.telefono.length > 0 && formData.telefono.length !== 10 && (
        <span className="formulario__error">El teléfono debe tener exactamente 10 dígitos</span>
      )}

      <input type="text" name="cedula" placeholder="Cédula *" value={formData.cedula} onChange={handleChange} maxLength="10" required />
      {formData.cedula.length > 0 && formData.cedula.length !== 10 && (
        <span className="formulario__error">La cédula debe tener exactamente 10 dígitos</span>
      )}

      <input type="text" name="username" placeholder="Username *" value={formData.username} onChange={handleChange} required />

      <button type="submit" className="formulario__boton">REGISTRARME</button>
    </form>
  );
};

export default Formulario;
