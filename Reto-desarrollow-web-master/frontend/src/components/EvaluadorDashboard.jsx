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
    porEvaluar: [],
    rechazados: [],
    aprobados: [] // ✅ Agregar sección de aprobados
  });
  const [analistas, setAnalistas] = useState([]);
  const [selecciones, setSelecciones] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUsuarios, setShowUsuarios] = useState(false);
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
      
      // ✅ Asegurarse de que registrosData tenga todas las propiedades necesarias
      setRegistros({
        porAsignar: registrosData.porAsignar || [],
        enProceso: registrosData.enProceso || [],
        porEvaluar: registrosData.porEvaluar || [],
        rechazados: registrosData.rechazados || [],
        aprobados: registrosData.aprobados || []
      });
      
      setAnalistas(analistasData);
    } catch (err) {
      setError('Error al cargar datos: ' + err.message);
      // ✅ En caso de error, mantener estructura vacía
      setRegistros({
        porAsignar: [],
        enProceso: [],
        porEvaluar: [],
        rechazados: [],
        aprobados: []
      });
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

  const verDetalleRegistro = async (registro) => {
    try {
      const endpoint = registro.tipo === 'agua' 
        ? `https://localhost:7051/api/RegistroAgua/${registro.id}`
        : `https://localhost:7051/api/RegistroAba/${registro.id}`;
      
      const res = await fetch(endpoint);
      const data = await res.json();
      
      setRegistroSeleccionado({ ...data, tipoRegistro: registro.tipo });
    } catch (err) {
      setError("Error al cargar el detalle del registro: " + err.message);
    }
  };

  const descargarPdf = async (registroId, tipoRegistro) => {
    try {
      const response = await fetch(`https://localhost:7051/api/Pdf/registro/${registroId}/${tipoRegistro}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (!response.ok) {
        throw new Error('Error al generar el PDF');
      }

      // Crear blob del PDF
      const blob = await response.blob();
      
      // Crear URL temporal para el blob
      const url = window.URL.createObjectURL(blob);
      
      // Abrir en nueva ventana para visualizar
      window.open(url, '_blank');
      
      // Limpiar URL después de un tiempo
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      
    } catch (err) {
      setError("Error al generar PDF: " + err.message);
    }
  };

  const renderRegistroCard = (registro, tipo) => {
    const esRechazado = registro.estado === 'Rechazado';
    
    return (
      <div key={`${tipo}-${registro.id}`} className={`registro-card ${esRechazado ? 'registro-rechazado' : ''}`}>
        <div className="registro-header">
          <h4>{tipo === 'agua' ? '💧 Registro Agua' : '🥘 Registro ABA'}</h4>
          <span className="registro-id">#{registro.id}</span>
        </div>
        <div className="registro-info">
          <p><strong>Oficio:</strong> {registro.numOficio}</p>
          <p><strong>Solicitante:</strong> {registro.nombreSolicitante || registro.enviadaPor}</p>
          <p><strong>Fecha:</strong> {new Date(registro.fechaRecibo || registro.fechaRecepcion).toLocaleDateString()}</p>
          {registro.analista && <p><strong>Analista:</strong> {registro.analista}</p>}
          
          {/* Mostrar motivo de rechazo si está rechazado */}
          {esRechazado && registro.observaciones && (
            <div className="motivo-rechazo-card">
              <p><strong>🔴 Motivo rechazo:</strong> {registro.observaciones}</p>
            </div>
          )}
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
          
          {(activeTab === 'porEvaluar' || activeTab === 'rechazados' || activeTab === 'aprobados') && (
            <div className="evaluar-section">
              <button 
                className="btn btn-info" 
                onClick={() => verDetalleRegistro(registro)}
              >
                👁️ Ver
              </button>
              
              {/* Botón Ver PDF solo para registros aprobados */}
              {activeTab === 'aprobados' && (
                <button 
                  className="btn btn-success" 
                  onClick={() => descargarPdf(registro.id, registro.tipo)}
                >
                  📄 Ver PDF
                </button>
              )}
              
              {/* Solo mostrar botones de aprobar/rechazar si no está ya rechazado o aprobado */}
              {activeTab === 'porEvaluar' && (
                <>
                  <button className="btn btn-success" onClick={() => aprobarRegistro(registro.id, registro.tipo)}>
                    ✅ Aprobar
                  </button>
                  <button className="btn btn-danger" onClick={() => {
                    const motivo = prompt('Motivo del rechazo:');
                    if (motivo) rechazarRegistro(registro.id, registro.tipo, motivo);
                  }}>
                    ❌ Rechazar
                  </button>
                </>
              )}
            </div>
          )}
          
          {activeTab === 'enProceso' && (
            <div className="proceso-info">
              <span className="badge badge-info">En análisis por {registro.analista}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDetalleRegistro = (r) => {
    const esRegistroAgua = r.tipoRegistro === 'agua';
    
    return (
      <div className="detalle-registro">
        <h2>👁️ Detalle del Registro #{r.id} - {esRegistroAgua ? 'AGUA' : 'ABA'}</h2>
        <button className="btn btn-secondary" onClick={() => setRegistroSeleccionado(null)}>
          ← Volver
        </button>

        <div className="detalle-section">
          <h3>📋 Datos Generales</h3>
          <p><strong>Oficio:</strong> {r.numOficio}</p>
          <p><strong>Solicitante:</strong> {esRegistroAgua ? r.enviadaPor : r.nombreSolicitante}</p>
          
          {esRegistroAgua ? (
            <>
              <p><strong>Región Salud:</strong> {r.regionSalud}</p>
              <p><strong>Departamento/Área:</strong> {r.dptoArea}</p>
              <p><strong>Tomada por:</strong> {r.tomadaPor}</p>
              <p><strong>Muestra:</strong> {r.muestra}</p>
              <p><strong>Dirección:</strong> {r.direccion}</p>
              <p><strong>Condición Muestra:</strong> {r.condicionMuestra}</p>
              <p><strong>Fecha Toma:</strong> {r.fechaToma ? new Date(r.fechaToma).toLocaleDateString() : '-'}</p>
              <p><strong>Fecha Recepción:</strong> {r.fechaRecepción ? new Date(r.fechaRecepcion).toLocaleDateString() : '-'}</p>
            </>
          ) : (
            <>
              <p><strong>Tipo Muestra:</strong> {r.tipoMuestra}</p>
              <p><strong>Condición Recepción:</strong> {r.condicionRecepcion}</p>
              <p><strong>Número Lote:</strong> {r.numLote}</p>
              <p><strong>Fecha Recibo:</strong> {r.fechaRecibo ? new Date(r.fechaRecibo).toLocaleDateString() : '-'}</p>
              <p><strong>Fecha Entrega:</strong> {r.fechaEntrega ? new Date(r.fechaEntrega).toLocaleDateString() : '-'}</p>
            </>
          )}
          
          <p><strong>Número Muestra:</strong> {r.numMuestra}</p>
          <p><strong>Motivo Solicitud:</strong> {r.motivoSolicitud}</p>
        </div>

        <div className="detalle-section">
          <h3>👅 Características Organolépticas</h3>
          <p><strong>Color:</strong> {r.color || '-'}</p>
          <p><strong>Olor:</strong> {r.olor || '-'}</p>
          <p><strong>Sabor:</strong> {r.sabor || '-'}</p>
          <p><strong>Aspecto:</strong> {r.aspecto || '-'}</p>
          <p><strong>Textura:</strong> {r.textura || '-'}</p>
          <p><strong>Peso Neto:</strong> {r.pesoNeto || '-'}</p>
          <p><strong>Fecha Vencimiento:</strong> {r.fechaVencimiento ? new Date(r.fechaVencimiento).toLocaleDateString() : '-'}</p>
        </div>

        <div className="detalle-section">
          <h3>⚗️ Análisis Fisicoquímico</h3>
          <p><strong>Acidez:</strong> {r.acidez || '-'}</p>
          <p><strong>Cloro Residual:</strong> {r.cloroResidual || '-'}</p>
          <p><strong>Cenizas:</strong> {r.cenizas || '-'}</p>
          <p><strong>Cloruro:</strong> {r.cloruro || '-'}</p>
          <p><strong>Densidad:</strong> {r.densidad || '-'}</p>
          <p><strong>pH:</strong> {r.ph || '-'}</p>
          <p><strong>Sólidos Totales:</strong> {r.solidosTotales || '-'}</p>
          <p><strong>Materia Grasa (Cualitativa):</strong> {r.materiaGrasaCualit || '-'}</p>
          <p><strong>Materia Grasa (Cuantitativa):</strong> {r.materiaGrasaCuantit || '-'}</p>
          <p><strong>Índice Refracción:</strong> {r.indiceRefaccion || '-'}</p>
          <p><strong>Índice Acidez:</strong> {r.indiceAcidez || '-'}</p>
          <p><strong>Índice Rancidez:</strong> {r.indiceRancidez || '-'}</p>
          <p><strong>Cumarina:</strong> {r.cumarina || '-'}</p>
          <p><strong>Dureza:</strong> {r.dureza || '-'}</p>
          <p><strong>Extracto Seco:</strong> {r.extractoSeco || '-'}</p>
          <p><strong>Fécula:</strong> {r.fecula || '-'}</p>
          <p><strong>Grado Alcohólico:</strong> {r.gradoAlcoholico || '-'}</p>
          <p><strong>Humedad:</strong> {r.humedad || '-'}</p>
          <p><strong>Prueba Eber:</strong> {r.pruebaEber || '-'}</p>
          <p><strong>Tiempo Cocción:</strong> {r.tiempoCoccion || '-'}</p>
          <p><strong>Otras Determinaciones:</strong> {r.otrasDeterminaciones || '-'}</p>
          <p><strong>Referencia:</strong> {r.referencia || '-'}</p>
          
           {esRegistroAgua && (
            <>
              <p><strong>Temperatura Ambiente:</strong> {r.temperaturaAmbiente || '-'}</p>
              <p><strong>Fecha Reporte:</strong> {r.fechaReporte ? new Date(r.fechaReporte).toLocaleDateString() : '-'}</p>
            </>
          )}
        </div>

        <div className="detalle-section">
          <h3>🦠 Análisis Microbiológico</h3>
          <p><strong>Microorganismos Aerobios:</strong> {r.resMicroorganismosAerobios || '-'}</p>
          <p><strong>Coliformes Totales:</strong> {r.resColiformesTotales || '-'}</p>
          <p><strong>Recuento Coliformes:</strong> {r.resRecuentoColiformes || '-'}</p>
          <p><strong>Pseudomonas Spp:</strong> {r.resPseudomonasSpp || '-'}</p>
          <p><strong>E. Coli:</strong> {r.resEColi || '-'}</p>
          <p><strong>Salmonella Spp:</strong> {r.resSalmonellaSpp || '-'}</p>
          <p><strong>Estafilococos Aureus:</strong> {r.resEstafilococosAureus || '-'}</p>
          <p><strong>Hongos:</strong> {r.resHongos || '-'}</p>
          <p><strong>Levaduras:</strong> {r.resLevaduras || '-'}</p>
          <p><strong>Esterilidad Comercial:</strong> {r.resEsterilidadComercial || '-'}</p>
          <p><strong>Listeria Monocytogenes:</strong> {r.resListeriaMonocytogenes || '-'}</p>
        </div>
        
        <div className="detalle-section">
          <h3>📌 Otros</h3>
          <p><strong>Metodología Referencia:</strong> {r.metodologiaReferencia || '-'}</p>
          <p><strong>Equipos:</strong> {r.equipos || '-'}</p>
          <p><strong>Observaciones:</strong> {r.observaciones || '-'}</p>
          <p><strong>Apto Consumo:</strong> {r.aptoConsumo !== null && r.aptoConsumo !== undefined ? (r.aptoConsumo ? "✅ Sí" : "❌ No") : '-'}</p>
          <p><strong>Estado:</strong> {r.estado || '-'}</p>
        </div>
      </div>
    );
  };

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
              <button 
                className={`tab-btn ${activeTab === 'porAsignar' ? 'active' : ''}`} 
                onClick={() => setActiveTab('porAsignar')}
              >
                📋 Por Asignar ({registros.porAsignar?.length || 0})
              </button>
              <button 
                className={`tab-btn ${activeTab === 'enProceso' ? 'active' : ''}`} 
                onClick={() => setActiveTab('enProceso')}
              >
                ⏳ En Proceso ({registros.enProceso?.length || 0})
              </button>
              <button 
                className={`tab-btn ${activeTab === 'porEvaluar' ? 'active' : ''}`} 
                onClick={() => setActiveTab('porEvaluar')}
              >
                ✅ Por Evaluar ({registros.porEvaluar?.length || 0})
              </button>
              <button 
                className={`tab-btn ${activeTab === 'rechazados' ? 'active' : ''} tab-rechazados`} 
                onClick={() => setActiveTab('rechazados')}
              >
                ❌ Rechazados ({registros.rechazados?.length || 0})
              </button>
              <button 
                className={`tab-btn ${activeTab === 'aprobados' ? 'active' : ''} tab-aprobados`} 
                onClick={() => setActiveTab('aprobados')}
              >
                ✅ Aprobados ({registros.aprobados?.length || 0})
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'porAsignar' && (
                <div className="seccion-registros">
                  <h3>Registros Por Asignar</h3>
                  <div className="registros-grid">
                    {(registros.porAsignar || []).map(r => renderRegistroCard(r, r.tipo))}
                    {(!registros.porAsignar || registros.porAsignar.length === 0) && <p>No hay registros por asignar</p>}
                  </div>
                </div>
              )}
              
              {activeTab === 'enProceso' && (
                <div className="seccion-registros">
                  <h3>Registros En Proceso</h3>
                  <div className="registros-grid">
                    {(registros.enProceso || []).map(r => renderRegistroCard(r, r.tipo))}
                    {(!registros.enProceso || registros.enProceso.length === 0) && <p>No hay registros en proceso</p>}
                  </div>
                </div>
              )}
              
              {activeTab === 'porEvaluar' && (
                <div className="seccion-registros">
                  <h3>Registros Por Evaluar</h3>
                  <div className="registros-grid">
                    {(registros.porEvaluar || []).map(r => renderRegistroCard(r, r.tipo))}
                    {(!registros.porEvaluar || registros.porEvaluar.length === 0) && <p>No hay registros por evaluar</p>}
                  </div>
                </div>
              )}
              
              {activeTab === 'rechazados' && (
                <div className="seccion-registros">
                  <h3 className="titulo-rechazados">🔴 Registros Rechazados</h3>
                  <p className="info-rechazados">
                    Estos registros han sido devueltos al analista para correcciones.
                  </p>
                  <div className="registros-grid">
                    {(registros.rechazados || []).map(r => renderRegistroCard(r, r.tipo))}
                    {(!registros.rechazados || registros.rechazados.length === 0) && (
                      <p>No hay registros rechazados</p>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'aprobados' && (
                <div className="seccion-registros">
                  <h3 className="titulo-aprobados">✅ Registros Aprobados</h3>
                  <p className="info-aprobados">
                    Estos registros han sido aprobados y completados exitosamente.
                  </p>
                  <div className="registros-grid">
                    {(registros.aprobados || []).map(r => renderRegistroCard(r, r.tipo))}
                    {(!registros.aprobados || registros.aprobados.length === 0) && (
                      <p>No hay registros aprobados</p>
                    )}
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