import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { evaluadorService } from '../services/evaluadorService';

const EvaluadorDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('porAsignar');
  const [registros, setRegistros] = useState({
    porAsignar: [],
    enProceso: [],
    porEvaluar: []
  });
  const [analistas, setAnalistas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [registrosData, analistasData] = await Promise.all([
        evaluadorService.obtenerRegistrosPorEstado(),
        evaluadorService.obtenerAnalistas()
      ]);
      setRegistros(registrosData);
      setAnalistas(analistasData);
    } catch (err) {
      setError('Error al cargar datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const asignarAnalista = async (registroId, tipoRegistro, analistaId) => {
    try {
      await evaluadorService.asignarAnalista(registroId, tipoRegistro, analistaId);
      await cargarDatos(); // Recargar datos
    } catch (err) {
      setError('Error al asignar analista: ' + err.message);
    }
  };

  const aprobarRegistro = async (registroId, tipoRegistro) => {
    try {
      await evaluadorService.aprobarRegistro(registroId, tipoRegistro);
      await cargarDatos(); // Recargar datos
    } catch (err) {
      setError('Error al aprobar registro: ' + err.message);
    }
  };

  const rechazarRegistro = async (registroId, tipoRegistro, motivo) => {
    try {
      await evaluadorService.rechazarRegistro(registroId, tipoRegistro, motivo);
      await cargarDatos(); // Recargar datos
    } catch (err) {
      setError('Error al rechazar registro: ' + err.message);
    }
  };

  const renderRegistroCard = (registro, tipo) => (
    <div key={`${tipo}-${registro.id}`} className="registro-card">
      <div className="registro-header">
        <h4>{tipo === 'agua' ? '💧 Registro Agua' : '🥘 Registro ABA'}</h4>
        <span className="registro-id">#{registro.id}</span>
      </div>
      
      <div className="registro-info">
        <p><strong>Oficio:</strong> {registro.numOficio}</p>
        <p><strong>Solicitante:</strong> {registro.nombreSolicitante || registro.enviadaPor}</p>
        <p><strong>Fecha:</strong> {new Date(registro.fechaRecibo || registro.fechaRecepcion).toLocaleDateString()}</p>
        {registro.analista && (
          <p><strong>Analista:</strong> {registro.analista}</p>
        )}
      </div>

      <div className="registro-actions">
        {activeTab === 'porAsignar' && (
          <div className="asignar-section">
            <select 
              onChange={(e) => asignarAnalista(registro.id, tipo, e.target.value)}
              defaultValue=""
            >
              <option value="">Seleccionar Analista</option>
              {analistas.map(analista => (
                <option key={analista.usuarioId} value={analista.usuarioId}>
                  {analista.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {activeTab === 'porEvaluar' && (
          <div className="evaluar-section">
            <button 
              className="btn btn-success"
              onClick={() => aprobarRegistro(registro.id, tipo)}
            >
              ✅ Aprobar
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => {
                const motivo = prompt('Motivo del rechazo:');
                if (motivo) rechazarRegistro(registro.id, tipo, motivo);
              }}
            >
              ❌ Rechazar
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando dashboard del evaluador...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Dashboard Evaluador</h1>
        <p>Bienvenido, {user.nombre}</p>
        <button className="btn btn-danger" onClick={logout}>
          Cerrar Sesión
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="evaluador-tabs">
        <button 
          className={`tab-btn ${activeTab === 'porAsignar' ? 'active' : ''}`}
          onClick={() => setActiveTab('porAsignar')}
        >
          📋 Por Asignar ({registros.porAsignar.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'enProceso' ? 'active' : ''}`}
          onClick={() => setActiveTab('enProceso')}
        >
          ⏳ En Proceso ({registros.enProceso.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'porEvaluar' ? 'active' : ''}`}
          onClick={() => setActiveTab('porEvaluar')}
        >
          ✅ Por Evaluar ({registros.porEvaluar.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'porAsignar' && (
          <div className="seccion-registros">
            <h3>Registros Por Asignar</h3>
            <p>Asigna estos registros a un analista para su procesamiento</p>
            <div className="registros-grid">
              {registros.porAsignar.map(registro => 
                renderRegistroCard(registro, registro.tipo)
              )}
              {registros.porAsignar.length === 0 && (
                <p className="no-registros">No hay registros por asignar</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'enProceso' && (
          <div className="seccion-registros">
            <h3>Registros En Proceso</h3>
            <p>Registros asignados a analistas que están siendo procesados</p>
            <div className="registros-grid">
              {registros.enProceso.map(registro => 
                renderRegistroCard(registro, registro.tipo)
              )}
              {registros.enProceso.length === 0 && (
                <p className="no-registros">No hay registros en proceso</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'porEvaluar' && (
          <div className="seccion-registros">
            <h3>Registros Por Evaluar</h3>
            <p>Registros completados por analistas que requieren tu aprobación</p>
            <div className="registros-grid">
              {registros.porEvaluar.map(registro => 
                renderRegistroCard(registro, registro.tipo)
              )}
              {registros.porEvaluar.length === 0 && (
                <p className="no-registros">No hay registros por evaluar</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluadorDashboard;
