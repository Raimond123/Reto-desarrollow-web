import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analistaService } from '../services/analistaService';
import FormularioAnalisisAgua from './FormularioAnalisisAgua';

const AnalistaDashboard = () => {
  const { user, logout } = useAuth();
  const [registrosAsignados, setRegistrosAsignados] = useState([]);
  const [registroEnAnalisis, setRegistroEnAnalisis] = useState(null); // ✅ nuevo estado
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarRegistrosAsignados();
  }, []);

  const cargarRegistrosAsignados = async () => {
    setLoading(true);
    try {
      const analistaId = user?.usuarioId || user?.usu_id || user?.id || user?.userId;
      if (!analistaId) throw new Error('No se pudo obtener el ID del usuario analista');

      const registros = await analistaService.obtenerRegistrosAsignados(analistaId);
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
      await cargarRegistrosAsignados();
    } catch (err) {
      setError('Error al completar registro: ' + err.message);
    }
  };

  // Renderizamos cada tarjeta
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
          className="btn btn-primary"
          onClick={() => setRegistroEnAnalisis(registro)} // ✅ mostramos el formulario de análisis
        >
          🔬 Analizar
        </button>
        <button 
          className="btn btn-success"
          onClick={() => completarRegistro(registro.id, registro.tipo)}
        >
          ✅ Marcar como Completado
        </button>
      </div>
    </div>
  );

  if (loading) return <div className="loading">Cargando registros asignados...</div>;

  // ✅ si hay registro en análisis, mostramos el formulario en vez de la lista
  if (registroEnAnalisis) {
    return (
      <FormularioAnalisisAgua 
        registro={registroEnAnalisis}
        onVolver={() => setRegistroEnAnalisis(null)}
        onFinalizar={() => {
          setRegistroEnAnalisis(null);
          cargarRegistrosAsignados();
        }}
      />
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

      <div className="seccion-registros">
        <h3>Registros Asignados ({registrosAsignados.length})</h3>
        <p>Registros que te han sido asignados para análisis</p>
        
        <div className="registros-grid">
          {registrosAsignados.map(registro => renderRegistroCard(registro))}
          {registrosAsignados.length === 0 && <p>No tienes registros asignados</p>}
        </div>
      </div>
    </div>
  );
};

export default AnalistaDashboard;