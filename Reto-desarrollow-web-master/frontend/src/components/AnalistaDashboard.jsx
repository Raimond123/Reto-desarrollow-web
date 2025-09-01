import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analistaService } from '../services/analistaService';

const AnalistaDashboard = () => {
  const { user, logout } = useAuth();
  const [registrosAsignados, setRegistrosAsignados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarRegistrosAsignados();
  }, []);

  const cargarRegistrosAsignados = async () => {
    setLoading(true);
    try {
      const registros = await analistaService.obtenerRegistrosAsignados(user.usuarioId);
      setRegistrosAsignados(registros);
    } catch (err) {
      setError('Error al cargar registros: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const completarRegistro = async (registroId, tipoRegistro) => {
    try {
      await analistaService.completarRegistro(registroId, tipoRegistro);
      await cargarRegistrosAsignados(); // Recargar datos
    } catch (err) {
      setError('Error al completar registro: ' + err.message);
    }
  };

  const renderRegistroCard = (registro) => (
    <div key={`${registro.tipo}-${registro.id}`} className="registro-card">
      <div className="registro-header">
        <h4>{registro.tipo === 'agua' ? '💧 Análisis Agua' : '🥘 Análisis ABA'}</h4>
        <span className="registro-id">#{registro.id}</span>
      </div>
      
      <div className="registro-info">
        <p><strong>Oficio:</strong> {registro.numOficio}</p>
        <p><strong>Solicitante:</strong> {registro.nombreSolicitante || registro.enviadaPor}</p>
        <p><strong>Fecha:</strong> {new Date(registro.fechaRecibo || registro.fechaRecepcion).toLocaleDateString()}</p>
        <p><strong>Tipo Muestra:</strong> {registro.tipoMuestra || registro.muestra}</p>
        <p><strong>Estado:</strong> <span className="estado-badge">{registro.estado}</span></p>
      </div>

      <div className="registro-actions">
        <button 
          className="btn btn-success"
          onClick={() => completarRegistro(registro.id, registro.tipo)}
        >
          ✅ Marcar como Completado
        </button>
        <button 
          className="btn btn-info"
          onClick={() => {
            // TODO: Implementar vista detallada del registro
            alert('Vista detallada - Por implementar');
          }}
        >
          👁️ Ver Detalles
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando registros asignados...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Dashboard Analista</h1>
        <p>Bienvenido, {user.nombre}</p>
        <button className="btn btn-danger" onClick={logout}>
          Cerrar Sesión
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="analista-content">
        <div className="seccion-registros">
          <h3>Registros Asignados ({registrosAsignados.length})</h3>
          <p>Registros que te han sido asignados para análisis</p>
          
          <div className="registros-grid">
            {registrosAsignados.map(registro => renderRegistroCard(registro))}
            {registrosAsignados.length === 0 && (
              <p className="no-registros">No tienes registros asignados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalistaDashboard;
