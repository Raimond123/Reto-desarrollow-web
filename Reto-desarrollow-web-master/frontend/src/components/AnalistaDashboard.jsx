import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analistaService } from '../services/analistaService';
import FormularioAnalisisAgua from './FormularioAnalisisAgua';
import FormularioAnalisisAba from './FormularioAnalisisAba';
import '../styles/AnalistaDashboard.css';

const AnalistaDashboard = () => {
  const { user, logout } = useAuth();
  const [registros, setRegistros] = useState([]);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [tipoFormulario, setTipoFormulario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [estadisticas, setEstadisticas] = useState({
    totalAsignados: 0,
    enProceso: 0,
    rechazados: 0,
    agua: 0,
    aba: 0
  });

  useEffect(() => {
    cargarRegistros();
  }, [user]);

  const cargarRegistros = async () => {
    if (!user?.id) return;
    console.log(user)
    
    setLoading(true);
    setError('');
    
    try {
      const registrosData = await analistaService.obtenerRegistrosAsignados(user.id);
      console.log('🎯 Registros en el componente:', registrosData);
      
      // Verificar si hay registros y su estructura
      if (registrosData && registrosData.length > 0) {
        console.log('🔍 Primer registro:', registrosData[0]);
        console.log('🔍 Estados encontrados:', registrosData.map(r => r.estado));
      }
      
      setRegistros(registrosData);
      
      // Calcular estadísticas
      const stats = await analistaService.obtenerEstadisticasAnalista(user.id);
      console.log('📊 Estadísticas:', stats);
      setEstadisticas(stats);
    } catch (err) {
      console.error('Error al cargar registros:', err);
      setError('Error al cargar los registros asignados');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalizar = (registro, tipo) => {
    setRegistroSeleccionado(registro);
    setTipoFormulario(tipo);
  };

  const handleVolverDashboard = () => {
    setRegistroSeleccionado(null);
    setTipoFormulario(null);
    cargarRegistros(); // Recargar registros al volver
  };

  const renderRegistroCard = (registro) => {
    const esRechazado = registro.estado === 'Rechazado';
    const tipo = registro.tipo || (registro.enviadaPor ? 'agua' : 'aba');
    
    return (
      <div key={`${tipo}-${registro.id}`} className={`registro-card ${esRechazado ? 'registro-rechazado' : ''}`}>
        <div className="registro-header">
          <div className="registro-title">
            <h4>
              {tipo === 'agua' ? '💧 Registro Agua' : '🥘 Registro ABA'}
            </h4>
            {esRechazado && <span className="badge-rechazado">⚠️ RECHAZADO</span>}
          </div>
          <span className="registro-id">#{registro.id}</span>
        </div>
        
        <div className="registro-info">
          <p><strong>Oficio:</strong> {registro.numOficio}</p>
          <p><strong>Solicitante:</strong> {registro.nombreSolicitante || registro.enviadaPor}</p>
          <p><strong>Fecha:</strong> {
            new Date(registro.fechaRecibo || registro.fechaRecepcion).toLocaleDateString()
          }</p>
          
          {esRechazado && registro.observaciones && (
            <div className="motivo-rechazo-preview">
              <p><strong>🔴 Motivo del rechazo:</strong></p>
              <p className="motivo-texto">
                {registro.observaciones.length > 100 
                  ? `${registro.observaciones.substring(0, 100)}...` 
                  : registro.observaciones}
              </p>
            </div>
          )}
        </div>
        
        <div className="registro-actions">
          <button 
            className={`btn ${esRechazado ? 'btn-warning' : 'btn-primary'} btn-analizar`}
            onClick={() => handleAnalizar(registro, tipo)}
          >
            {esRechazado ? '🔧 Corregir Análisis' : '🔬 Analizar'}
          </button>
        </div>
      </div>
    );
  };

  // Si hay un registro seleccionado, mostrar el formulario correspondiente
  if (registroSeleccionado && tipoFormulario) {
    if (tipoFormulario === 'agua') {
      return (
        <FormularioAnalisisAgua
          registro={registroSeleccionado}
          onVolver={handleVolverDashboard}
          onFinalizar={handleVolverDashboard}
        />
      );
    } else {
      return (
        <FormularioAnalisisAba
          registro={registroSeleccionado}
          onVolver={handleVolverDashboard}
          onFinalizar={handleVolverDashboard}
        />
      );
    }
  }

  // Dashboard principal
  return (
    <div className="container">
      {/* Header con gradiente como el original */}
      <div className="header">
        <h1>Dashboard Analista</h1>
        <p>Bienvenido, {user?.nombre || 'Analista'}</p>
        <button className="btn btn-danger" onClick={logout}>
          Cerrar Sesión
        </button>
      </div>

      {/* Panel de estadísticas */}
      <div className="estadisticas-panel">
        <div className="stat-card">
          <h3>{estadisticas.totalAsignados}</h3>
          <p>Total Asignados</p>
        </div>
        <div className="stat-card stat-proceso">
          <h3>{estadisticas.enProceso}</h3>
          <p>En Proceso</p>
        </div>
        <div className="stat-card stat-rechazado">
          <h3>{estadisticas.rechazados}</h3>
          <p>Rechazados</p>
        </div>
        <div className="stat-card stat-agua">
          <h3>{estadisticas.agua}</h3>
          <p>Análisis Agua</p>
        </div>
        <div className="stat-card stat-aba">
          <h3>{estadisticas.aba}</h3>
          <p>Análisis ABA</p>
        </div>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">
          <p>Cargando registros...</p>
        </div>
      ) : (
        <>
          {/* Registros Rechazados */}
          {registros.filter(r => r.estado === 'Rechazado').length > 0 && (
            <div className="registros-section">
              <h2 className="section-title rechazados-title">
                🔴 Registros Rechazados - Requieren Corrección
              </h2>
              <div className="registros-grid">
                {registros
                  .filter(r => r.estado === 'Rechazado')
                  .map(registro => renderRegistroCard(registro))}
              </div>
            </div>
          )}

          {/* Registros En Proceso */}
          {registros.filter(r => r.estado === 'En Proceso').length > 0 && (
            <div className="registros-section">
              <h2 className="section-title">
                📋 Registros En Proceso
              </h2>
              <div className="registros-grid">
                {registros
                  .filter(r => r.estado === 'En Proceso')
                  .map(registro => renderRegistroCard(registro))}
              </div>
            </div>
          )}

          {/* Mensaje si no hay registros */}
          {registros.length === 0 && (
            <div className="no-registros">
              <p>No tienes registros asignados en este momento.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnalistaDashboard;