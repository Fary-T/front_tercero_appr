// ... imports sin cambios
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const eliminarPolizaPorId = async (idPoliza) => {
  try {
    const response = await fetch(`http://localhost:3030/usuario_seguro/eliminar/${idPoliza}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || `Error al eliminar la póliza: ${response.status}`);
    }

    const resultado = await response.json();
    return { success: true, mensaje: resultado.mensaje, idPoliza };
  } catch (err) {
    return { success: false, error: err.message || 'Error desconocido', idPoliza };
  }
};

export const ModalEliminarContratarSeguro = ({
  open,
  onClose,
  usuario,
  onPolizaEliminada,
  idPolizaAEliminar,
  eliminarAutomaticamente = false
}) => {
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);
  const [polizasData, setPolizasData] = useState([]);
  const [segurosData, setSegurosData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPolizasUsuario = async (idUsuario) => {
    setLoading(true);
    try {
      const respUsuarioSeguro = await fetch('http://localhost:3030/usuario_seguro/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!respUsuarioSeguro.ok) throw new Error('Error al obtener usuario_seguro');

      const allUsuarioSeguro = await respUsuarioSeguro.json();
      const polizasUsuario = allUsuarioSeguro.filter(p => p.id_usuario_per === idUsuario);

      const respSeguros = await fetch('http://localhost:3030/seguro/');
      if (!respSeguros.ok) throw new Error('Error al obtener seguros');

      const allSeguros = await respSeguros.json();
      setPolizasData(polizasUsuario);
      setSegurosData(allSeguros);
    } catch (err) {
      setError(err.message || 'Error al cargar pólizas');
    } finally {
      setLoading(false);
    }
  };

  const eliminarPoliza = async (idPoliza) => {
    setEliminando(true);
    setError(null);
    setConfirmacion(null);

    const resultado = await eliminarPolizaPorId(idPoliza);

    if (resultado.success) {
      setConfirmacion('✅ Póliza eliminada exitosamente');
      setPolizasData(prev => prev.filter(p => p.id_usuario_seguro !== idPoliza));
      if (onPolizaEliminada) onPolizaEliminada(idPoliza);

      setTimeout(() => {
        setConfirmacion(null);
        if (onClose) onClose();
      }, 3000);
    } else {
      setError(`❌ ${resultado.error}`);
      setTimeout(() => setError(null), 5000);
    }

    setEliminando(false);
  };

  const getNombreSeguro = (idSeguro) => {
    const seguro = segurosData.find(s => s.id_seguro === idSeguro);
    return seguro ? seguro.nombre : 'Desconocido';
  };

  useEffect(() => {
    if (open && idPolizaAEliminar && eliminarAutomaticamente) {
      eliminarPoliza(idPolizaAEliminar);
    }
  }, [open, idPolizaAEliminar, eliminarAutomaticamente]);

  useEffect(() => {
    if (open && usuario && usuario.id_usuario && !eliminarAutomaticamente) {
      fetchPolizasUsuario(usuario.id_usuario);
    }
  }, [open, usuario, eliminarAutomaticamente]);

  if (!open || !usuario) return null;

  if (eliminarAutomaticamente || idPolizaAEliminar) {
    return (
      <div style={{
        position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
        background: '#fff', border: '1px solid #ddd', padding: '20px',
        borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '400px'
      }}>
        {eliminando && <p style={{ color: '#d32f2f' }}>⏳ Eliminando póliza...</p>}
        {confirmacion && <p style={{ color: '#4caf50' }}>{confirmacion}</p>}
        {error && <p style={{ color: '#f44336' }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: '#fff', borderRadius: '10px', padding: '30px',
        maxWidth: '800px', width: '90%', maxHeight: '80vh', overflowY: 'auto'
      }}>
        <div style={{
          textAlign: 'center', marginBottom: '20px',
          background: '#f44336', color: 'white', padding: '15px',
          borderRadius: '8px'
        }}>
          <h2>🗑️ Eliminar Pólizas de {usuario.nombre} {usuario.apellido}</h2>
        </div>

        {confirmacion && (
          <div style={{ backgroundColor: '#e8f5e9', border: '1px solid #4caf50', padding: '10px', borderRadius: '4px', color: '#2e7d32', marginBottom: '15px' }}>
            {confirmacion}
          </div>
        )}
        {error && (
          <div style={{ backgroundColor: '#ffebee', border: '1px solid #f44336', padding: '10px', borderRadius: '4px', color: '#c62828', marginBottom: '15px' }}>
            {error}
          </div>
        )}
        {loading ? (
          <div style={{ textAlign: 'center' }}>⏳ Cargando pólizas...</div>
        ) : polizasData.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#1976d2', marginTop: '10px' }}>
            Este usuario no tiene pólizas para eliminar.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {polizasData.map((poliza, i) => (
              <div
                key={poliza.id_usuario_seguro}
                style={{
                  border: '1px solid #ffcdd2', borderRadius: '8px',
                  padding: '20px', cursor: eliminando ? 'not-allowed' : 'pointer',
                  transition: '0.3s ease', backgroundColor: '#fff'
                }}
                onClick={() => !eliminando && eliminarPoliza(poliza.id_usuario_seguro)}
                onMouseEnter={e => {
                  if (!eliminando) {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }
                }}
                onMouseLeave={e => {
                  if (!eliminando) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <h4 style={{ color: '#d32f2f', textAlign: 'center', marginBottom: '10px' }}>📄 Póliza #{i + 1}</h4>
                <p><strong>ID:</strong> {poliza.id_usuario_seguro}</p>
                <p><strong>Seguro:</strong> {getNombreSeguro(poliza.id_seguro_per)}</p>
                <p><strong>Inicio:</strong> {new Date(poliza.fecha_contrato).toLocaleDateString()}</p>
                <p><strong>Fin:</strong> {new Date(poliza.fecha_fin).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button onClick={onClose} style={{
            background: '#d32f2f', color: 'white', padding: '10px 20px',
            border: 'none', borderRadius: '5px', cursor: 'pointer'
          }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

ModalEliminarContratarSeguro.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  usuario: PropTypes.object,
  onPolizaEliminada: PropTypes.func,
  idPolizaAEliminar: PropTypes.number,
  eliminarAutomaticamente: PropTypes.bool
};
