import React, { useState } from 'react';
import { analistaService } from '../services/analistaService';

const FormularioAnalisisAgua = ({ registro, onVolver, onFinalizar }) => {
  const [formData, setFormData] = useState({
    acidez: '',
    cloroResidual: '',
    cenizas: '',
    cumarina: '',
    cloruro: '',
    densidad: '',
    dureza: '',
    extractoSeco: '',
    fecula: '',
    gradoAlcoholico: '',
    humedad: '',
    indiceRefaccion: '',
    indiceAcidez: '',
    indiceRancidez: '',
    materiaGrasaCualit: '',
    materiaGrasaCuantit: '',
    ph: '',
    pruebaEber: '',
    solidosTotales: '',
    tiempoCoccion: '',
    otrasDeterminaciones: '',
    referencia: '',
    temperaturaAmbiente: '',
    fechaReporte: '',
    microoroAerobios: '',
    pseudomonasSPP: '',
    metodologiaReferencia: '',
    observaciones: '',
    aptoConsumo: false
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
      const analisisData = {
        id: registro.id,
        ...formData,
        estado: 'Por Evaluar'
      };

      await analistaService.guardarAnalisisAgua(registro.id, analisisData);
      setMensaje('✅ Análisis guardado exitosamente');
      setTimeout(() => {
        onFinalizar();
      }, 1500);
    } catch (err) {
      setMensaje(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-container">
      <div className="formulario-header">
        <button className="btn btn-secondary" onClick={onVolver}>
          ← Volver al Dashboard
        </button>
        <h2>🔬 Analizar Registro Agua #{registro.id}</h2>
      </div>

      {mensaje && <div className="alert">{mensaje}</div>}

      <form onSubmit={handleSubmit} className="registro-form">

        {/* Sección principal de análisis */}
        <div className="form-section">
          <h3>Parámetros de Análisis</h3>
          <div className="form-grid">

            <div className="form-group">
              <label>Acidez</label>
              <input type="number" step="0.01" name="acidez" value={formData.acidez} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Cloro Residual</label>
              <input type="number" step="0.01" name="cloroResidual" value={formData.cloroResidual} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Cenizas</label>
              <input type="number" step="0.01" name="cenizas" value={formData.cenizas} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Cumarina</label>
              <input type="text" name="cumarina" value={formData.cumarina} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Cloruro</label>
              <input type="number" step="0.01" name="cloruro" value={formData.cloruro} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Densidad</label>
              <input type="number" step="0.001" name="densidad" value={formData.densidad} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Dureza</label>
              <input type="text" name="dureza" value={formData.dureza} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Extracto Seco</label>
              <input type="text" name="extractoSeco" value={formData.extractoSeco} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Fécula</label>
              <input type="text" name="fecula" value={formData.fecula} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Grado Alcohólico</label>
              <input type="number" step="0.01" name="gradoAlcoholico" value={formData.gradoAlcoholico} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Humedad</label>
              <input type="number" step="0.01" name="humedad" value={formData.humedad} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Índice de Refacción</label>
              <input type="number" step="0.001" name="indiceRefaccion" value={formData.indiceRefaccion} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Índice de Acidez</label>
              <input type="number" step="0.01" name="indiceAcidez" value={formData.indiceAcidez} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Índice de Rancidez</label>
              <input type="number" step="0.01" name="indiceRancidez" value={formData.indiceRancidez} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Materia Grasa Cualitativa</label>
              <input type="text" name="materiaGrasaCualit" value={formData.materiaGrasaCualit} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Materia Grasa Cuantitativa</label>
              <input type="number" step="0.01" name="materiaGrasaCuantit" value={formData.materiaGrasaCuantit} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>pH</label>
              <input type="number" step="0.01" name="ph" value={formData.ph} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Prueba de Eber</label>
              <input type="text" name="pruebaEber" value={formData.pruebaEber} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Sólidos Totales</label>
              <input type="number" step="0.01" name="solidosTotales" value={formData.solidosTotales} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Tiempo Cocción</label>
              <input type="text" name="tiempoCoccion" value={formData.tiempoCoccion} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Otras Determinaciones</label>
              <textarea name="otrasDeterminaciones" value={formData.otrasDeterminaciones} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Referencia</label>
              <input type="text" name="referencia" value={formData.referencia} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Temperatura Ambiente</label>
              <input type="number" step="0.01" name="temperaturaAmbiente" value={formData.temperaturaAmbiente} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Fecha Reporte</label>
              <input type="date" name="fechaReporte" value={formData.fechaReporte} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Microoro Aerobios</label>
              <input type="text" name="microoroAerobios" value={formData.microoroAerobios} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Pseudomonas SPP</label>
              <input type="text" name="pseudomonasSPP" value={formData.pseudomonasSPP} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Metodología Referencia</label>
              <input type="text" name="metodologiaReferencia" value={formData.metodologiaReferencia} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Observaciones</label>
              <textarea name="observaciones" value={formData.observaciones} onChange={handleChange}/>
            </div>

            <div className="form-group">
              <label>Apto para Consumo</label>
              <input type="checkbox" name="aptoConsumo" checked={formData.aptoConsumo} onChange={handleChange}/>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Análisis'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioAnalisisAgua;