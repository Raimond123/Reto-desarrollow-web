import React, { useState } from 'react';
import { analistaService } from '../services/analistaService';
import '../styles/FormularioAnalisisAgua.css';  // 👈 Archivo CSS con estilos mejorados

const FormularioAnalisisAgua = ({ registro, onVolver, onFinalizar }) => {
  const [formData, setFormData] = useState({
    // Físico-químico   
    acidez: '', cloroResidual: '', cenizas: '', cumarina: '', cloruro: '',
    densidad: '', dureza: '', extractoSeco: '', fecula: '',
    gradoAlcoholico: '', humedad: '', indiceRefaccion: '', indiceAcidez: '',
    indiceRancidez: '', materiaGrasaCualit: '', materiaGrasaCuantit: '',
    ph: '', pruebaEber: '', solidosTotales: '', tiempoCoccion: '',
    otrasDeterminaciones: '', referencia: '', temperaturaAmbiente: '',
    fechaReporte: '',
    // Microbiológicos
    resMicroorganismosAerobios: '', resRecuentoColiformes: '', resColiformesTotales: '',
    resPseudomonasSpp: '', resEColi: '', resSalmonellaSpp: '',
    resEstafilococosAureus: '', resHongos: '', resLevaduras: '',
    resEsterilidadComercial: '', resListeriaMonocytogenes: '',
    metodologiaReferencia: '', equipos: '',
    observaciones: '', aptoConsumo: false
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      const analisisData = { id: registro.id, ...formData, estado: 'Por Evaluar' };
      await analistaService.guardarAnalisisAgua(registro.id, analisisData);
      setMensaje('✅ Análisis guardado exitosamente');
      setTimeout(() => onFinalizar(), 1500);
    } catch (err) {
      setMensaje(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, type, name, step = null) => (
    <div className="form-group-lg">
      <label>{label}</label>
      <input
        className="form-control-lg"
        type={type}
        step={step || undefined}
        name={name}
        value={formData[name]}
        onChange={handleChange}
      />
    </div>
  );

  const renderTextarea = (label, name) => (
    <div className="form-group-lg">
      <label>{label}</label>
      <textarea
        className="form-control-lg"
        name={name}
        value={formData[name]}
        onChange={handleChange}
      />
    </div>
  );

  return (
    <div className="formulario-container">
      <div className="formulario-header">
        <button className="btn btn-secondary btn-lg" onClick={onVolver}>
          ← Volver al Dashboard
        </button>
        <h2 className="titulo-grande">🔬 Analizar Registro Agua #{registro.id}</h2>
      </div>

      {mensaje && <div className="alert">{mensaje}</div>}

      <form onSubmit={handleSubmit} className="registro-form">
        
        {/* Fisicoquímicos */}
        <div className="form-section">
          <h3 className="subtitulo">Parámetros Fisicoquímicos</h3>
          <div className="form-grid">
            {renderInput("Acidez", "number", "acidez", "0.01")}
            {renderInput("Cloro Residual", "number", "cloroResidual", "0.01")}
            {renderInput("Cenizas", "number", "cenizas", "0.01")}
            {renderInput("Cumarina", "text", "cumarina")}
            {renderInput("Cloruro", "number", "cloruro", "0.01")}
            {renderInput("Densidad", "number", "densidad", "0.001")}
            {renderInput("Dureza", "text", "dureza")}
            {renderInput("Extracto Seco", "text", "extractoSeco")}
            {renderInput("Fécula", "text", "fecula")}
            {renderInput("Grado Alcohólico", "number", "gradoAlcoholico", "0.01")}
            {renderInput("Humedad", "number", "humedad", "0.01")}
            {renderInput("Índice Refacción", "number", "indiceRefaccion", "0.001")}
            {renderInput("Índice Acidez", "number", "indiceAcidez", "0.01")}
            {renderInput("Índice Rancidez", "number", "indiceRancidez", "0.01")}
            {renderInput("Materia Grasa Cualitativa", "text", "materiaGrasaCualit")}
            {renderInput("Materia Grasa Cuantitativa", "number", "materiaGrasaCuantit", "0.01")}
            {renderInput("pH", "number", "ph", "0.01")}
            {renderInput("Prueba de Eber", "text", "pruebaEber")}
            {renderInput("Sólidos Totales", "number", "solidosTotales", "0.01")}
            {renderInput("Tiempo de Cocción", "text", "tiempoCoccion")}
            {renderTextarea("Otras Determinaciones", "otrasDeterminaciones")}
            {renderInput("Referencia", "text", "referencia")}
            {renderInput("Temperatura Ambiente", "number", "temperaturaAmbiente", "0.01")}
            {renderInput("Fecha Reporte", "date", "fechaReporte")}
          </div>
        </div>

        {/* Microbiológicos */}
        <div className="form-section">
          <h3 className="subtitulo">Parámetros Microbiológicos</h3>
          <div className="form-grid">
            {renderInput("Microorganismos Aerobios", "text", "resMicroorganismosAerobios")}
            {renderInput("Recuento Coliformes", "text", "resRecuentoColiformes")}
            {renderInput("Coliformes Totales", "text", "resColiformesTotales")}
            {renderInput("Pseudomonas SPP", "text", "resPseudomonasSpp")}
            {renderInput("E.Coli", "text", "resEColi")}
            {renderInput("Salmonella SPP", "text", "resSalmonellaSpp")}
            {renderInput("Estafilococos Aureus", "text", "resEstafilococosAureus")}
            {renderInput("Hongos", "text", "resHongos")}
            {renderInput("Levaduras", "text", "resLevaduras")}
            {renderInput("Esterilidad Comercial", "text", "resEsterilidadComercial")}
            {renderInput("Listeria Monocytogenes", "text", "resListeriaMonocytogenes")}
            {renderInput("Metodología Referencia", "text", "metodologiaReferencia")}
            {renderInput("Equipos", "text", "equipos")}
            {renderTextarea("Observaciones", "observaciones")}
            <div className="form-check-lg">
              <input type="checkbox" name="aptoConsumo" checked={formData.aptoConsumo} onChange={handleChange}/>
              <label>Apto para Consumo</label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Análisis'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioAnalisisAgua;