import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { evaluadorService } from '../services/evaluadorService';
import UsuariosCRUD from './UsuariosCRUD';
import '../styles/EvaluadorDashboard.css';

const EvaluadorDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('porAsignar');
  const [registros, setRegistros] = useState({
    porAsignar: [],
    enProceso: [],
    porEvaluar: []
  });
  const [analistas, setAnalistas] = useState([]);
  const [selecciones, setSelecciones] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUsuarios, setShowUsuarios] = useState(false);

  // 👁️ Estado para ver detalle
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);

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

  const asignarAnalista = async (registroId, tipoRegistro, analistaId, registroCompleto) => {
    try {
      await evaluadorService.asignarAnalista(registroId, tipoRegistro, analistaId, registroCompleto);
      await cargarDatos();
    } catch (err) {
      setError('Error al asignar analista: ' + err.message);
    }
  };

  const aprobarRegistro = async (registroId, tipoRegistro) => {
    try {
      await evaluadorService.aprobarRegistro(registroId, tipoRegistro);
      await cargarDatos();
    } catch (err) {
      setError('Error al aprobar registro: ' + err.message);
    }
  };

  const rechazarRegistro = async (registroId, tipoRegistro, motivo) => {
    try {
      await evaluadorService.rechazarRegistro(registroId, tipoRegistro, motivo);
      await cargarDatos();
    } catch (err) {
      setError('Error al rechazar registro: ' + err.message);
    }
  };

  // 🔹 NUEVO: traer registro completo
  const verDetalleRegistro = async (id) => {
    try {
      const res = await fetch(`http://localhost:7051/api/RegistroAgua/${id}`);
      const data = await res.json();
      setRegistroSeleccionado(data); // ahora contiene Color, Olor, etc.
    } catch (err) {
      setError("Error al cargar el detalle del registro: " + err.message);
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
        {registro.analista && <p><strong>Analista:</strong> {registro.analista}</p>}
      </div>
      <div className="registro-actions">
        {activeTab === 'porAsignar' && (
          <div className="asignar-section">
            <select 
              value={selecciones[registro.id] || ""}
              onChange={(e) => setSelecciones(prev => ({
                ...prev,
                [registro.id]: e.target.value
              }))}
            >
              <option value="">Seleccionar Analista</option>
              {analistas.map(analista => (
                <option key={analista.usuarioId} value={analista.usuarioId}>
                  {analista.nombre}
                </option>
              ))}
            </select>
            <button 
              className="btn btn-primary"
              disabled={!selecciones[registro.id]} 
              onClick={() => asignarAnalista(registro.id, registro.tipo, selecciones[registro.id], registro)}
            >
              Confirmar
            </button>
          </div>
        )}
        {activeTab === 'porEvaluar' && (
          <div className="evaluar-section">
            <button className="btn btn-info" onClick={() => verDetalleRegistro(registro.id)}>
              👁️ Ver
            </button>
            <button className="btn btn-success" onClick={() => aprobarRegistro(registro.id, tipo)}>
              ✅ Aprobar
            </button>
            <button className="btn btn-danger" onClick={() => {
              const motivo = prompt('Motivo del rechazo:');
              if (motivo) rechazarRegistro(registro.id, tipo, motivo);
            }}>
              ❌ Rechazar
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // 📝 Vista organizada por secciones
  const renderDetalleRegistro = (r) => (
    <div className="detalle-registro">
      <h2>👁️ Detalle del Registro #{r.id}</h2>
      <button className="btn btn-secondary" onClick={() => setRegistroSeleccionado(null)}>← Volver</button>

      <div className="detalle-section">
        <h3>📋 Datos Generales</h3>
        <p><strong>Oficio:</strong> {r.numOficio}</p>
        <p><strong>Solicitante:</strong> {r.nombreSolicitante || r.enviadaPor}</p>
        <p><strong>Fecha Toma:</strong> {r.fechaToma}</p>
        <p><strong>Fecha Recepción:</strong> {r.fechaRecepcion}</p>
        <p><strong>Analista:</strong> {r.analista || "-"}</p>
      </div>

      <div className="detalle-section">
        <h3>👅 Características Organolépticas</h3>
        <p><strong>Color:</strong> {r.color}</p>
        <p><strong>Olor:</strong> {r.olor}</p>
        <p><strong>Sabor:</strong> {r.sabor}</p>
        <p><strong>Aspecto:</strong> {r.aspecto}</p>
        <p><strong>Textura:</strong> {r.textura}</p>
        <p><strong>Peso Neto:</strong> {r.pesoNeto}</p>
      </div>

      <div className="detalle-section">
        <h3>⚗️ Análisis Fisicoquímico</h3>
        <p><strong>Acidez:</strong> {r.acidez}</p>
        <p><strong>Cloro Residual:</strong> {r.cloroResidual}</p>
        <p><strong>Cenizas:</strong> {r.cenizas}</p>
        <p><strong>Densidad:</strong> {r.densidad}</p>
        <p><strong>pH:</strong> {r.ph}</p>
        <p><strong>Sólidos Totales:</strong> {r.solidosTotales}</p>
        <p><strong>Materia Grasa (Cualitativa):</strong> {r.materiaGrasaCualit}</p>
        <p><strong>Materia Grasa (Cuantitativa):</strong> {r.materiaGrasaCuantit}</p>
        <p><strong>Índice Refacción:</strong> {r.indiceRefaccion}</p>
        <p><strong>Índice Acidez:</strong> {r.indiceAcidez}</p>
        <p><strong>Índice Rancidez:</strong> {r.indiceRancidez}</p>
        <p><strong>Temperatura Ambiente:</strong> {r.temperaturaAmbiente}</p>
      </div>

      <div className="detalle-section">
        <h3>🦠 Análisis Microbiológico</h3>
        <p><strong>Microorganismos Aerobios:</strong> {r.resMicroorganismosAerobios}</p>
        <p><strong>Coliformes Totales:</strong> {r.resColiformesTotales}</p>
        <p><strong>Recuento Coliformes:</strong> {r.resRecuentoColiformes}</p>
        <p><strong>Pseudomonas Spp:</strong> {r.resPseudomonasSpp}</p>
        <p><strong>E. Coli:</strong> {r.resEColi}</p>
        <p><strong>Salmonella Spp:</strong> {r.resSalmonellaSpp}</p>
        <p><strong>Estafilococos Aureus:</strong> {r.resEstafilococosAureus}</p>
        <p><strong>Hongos:</strong> {r.resHongos}</p>
        <p><strong>Levaduras:</strong> {r.resLevaduras}</p>
        <p><strong>Esterilidad Comercial:</strong> {r.resEsterilidadComercial}</p>
        <p><strong>Listeria Monocytogenes:</strong> {r.resListeriaMonocytogenes}</p>
      </div>

      <div className="detalle-section">
        <h3>📌 Otros</h3>
        <p><strong>Metodología Referencia:</strong> {r.metodologiaReferencia}</p>
        <p><strong>Equipos:</strong> {r.equipos}</p>
        <p><strong>Observaciones:</strong> {r.observaciones}</p>
        <p><strong>Apto Consumo:</strong> {r.aptoConsumo ? "✅ Sí" : "❌ No"}</p>
        <p><strong>Estado:</strong> {r.estado}</p>
      </div>
    </div>
  );

  if (loading) return <div className="loading">Cargando dashboard...</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Dashboard Evaluador</h1>
        <p>Bienvenido, {user.nombre}</p>
        <div className="header-actions">
          <button className={`btn ${showUsuarios ? 'btn-secondary' : 'btn-info'}`} onClick={() => setShowUsuarios(!showUsuarios)}>
            {showUsuarios ? '📊 Ver Dashboard' : '👥 Gestionar Usuarios'}
          </button>
          <button className="btn btn-danger" onClick={logout}>Cerrar Sesión</button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {registroSeleccionado ? (
        renderDetalleRegistro(registroSeleccionado)
      ) : (
        !showUsuarios ? (
          <>
            <div className="evaluador-tabs">
              <button className={`tab-btn ${activeTab === 'porAsignar' ? 'active' : ''}`} onClick={() => setActiveTab('porAsignar')}>
                📋 Por Asignar ({registros.porAsignar.length})
              </button>
              <button className={`tab-btn ${activeTab === 'enProceso' ? 'active' : ''}`} onClick={() => setActiveTab('enProceso')}>
                ⏳ En Proceso ({registros.enProceso.length})
              </button>
              <button className={`tab-btn ${activeTab === 'porEvaluar' ? 'active' : ''}`} onClick={() => setActiveTab('porEvaluar')}>
                ✅ Por Evaluar ({registros.porEvaluar.length})
              </button>
            </div>
            <div className="tab-content">
              {activeTab === 'porAsignar' && (
                <div className="seccion-registros">
                  <h3>Registros Por Asignar</h3>
                  <div className="registros-grid">
                    {registros.porAsignar.map(r => renderRegistroCard(r, r.tipo))}
                    {registros.porAsignar.length === 0 && <p>No hay registros</p>}
                  </div>
                </div>
              )}
              {activeTab === 'enProceso' && (
                <div className="seccion-registros">
                  <h3>Registros En Proceso</h3>
                  <div className="registros-grid">
                    {registros.enProceso.map(r => renderRegistroCard(r, r.tipo))}
                    {registros.enProceso.length === 0 && <p>No hay registros</p>}
                  </div>
                </div>
              )}
              {activeTab === 'porEvaluar' && (
                <div className="seccion-registros">
                  <h3>Registros Por Evaluar</h3>
                  <div className="registros-grid">
                    {registros.porEvaluar.map(r => renderRegistroCard(r, r.tipo))}
                    {registros.porEvaluar.length === 0 && <p>No hay registros</p>}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : <UsuariosCRUD />
      )}
    </div>
  );
};

export default EvaluadorDashboard;