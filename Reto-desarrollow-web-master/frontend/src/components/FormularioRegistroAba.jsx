import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { registroService } from '../services/registroService';

const FormularioRegistroAba = ({ onVolver }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    // Información básica
    numOficio: '',
    fechaRecibo: '',
    nombreSolicitante: '',
    motivoSolicitud: '',
    tipoMuestra: '',
    condicionRecepcion: '',
    numMuestra: '',
    numLote: '',
    fechaEntrega: '',
    
    // Características organolépticas
    color: '',
    olor: '',
    sabor: '',
    aspecto: '',
    textura: '',
    pesoNeto: '',
    fechaVencimiento: '',
    
    // Parámetros físico-químicos
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
    observaciones: '',
    aptoConsumo: false,
    estado: 'Por Asignar'
  });

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
    setError('');
    setSuccess('');

    try {
      const registroData = {
        ...formData,
        usuIdRegistro: user.usuarioId || 1
      };

      await registroService.guardarRegistroAba(registroData);
      setSuccess('Registro ABA guardado exitosamente y enviado al evaluador');
      
      // Limpiar formulario después de 2 segundos
      setTimeout(() => {
        setFormData({
          numOficio: '',
          fechaRecibo: '',
          nombreSolicitante: '',
          motivoSolicitud: '',
          tipoMuestra: '',
          condicionRecepcion: '',
          numMuestra: '',
          numLote: '',
          fechaEntrega: '',
          color: '',
          olor: '',
          sabor: '',
          aspecto: '',
          textura: '',
          pesoNeto: '',
          fechaVencimiento: '',
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
          observaciones: '',
          aptoConsumo: false,
          estado: 'Por Asignar'
        });
        setSuccess('');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulario-container">
      <div className="formulario-header">
        <button className="btn btn-secondary" onClick={onVolver}>
          ← Volver a Selección
        </button>
        <h2>🍽️ Formulario de Registro ABA</h2>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit} className="registro-form">
        {/* Información General */}
        <div className="form-section">
          <h3>Información General</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="numOficio">Número de Oficio:</label>
              <input
                type="text"
                id="numOficio"
                name="numOficio"
                value={formData.numOficio}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fechaRecibo">Fecha de Recibo:</label>
              <input
                type="date"
                id="fechaRecibo"
                name="fechaRecibo"
                value={formData.fechaRecibo}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="nombreSolicitante">Nombre del Solicitante:</label>
              <input
                type="text"
                id="nombreSolicitante"
                name="nombreSolicitante"
                value={formData.nombreSolicitante}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="motivoSolicitud">Motivo de Solicitud:</label>
              <textarea
                id="motivoSolicitud"
                name="motivoSolicitud"
                value={formData.motivoSolicitud}
                onChange={handleChange}
                className="form-control"
                rows="2"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tipoMuestra">Tipo de Muestra:</label>
              <input
                type="text"
                id="tipoMuestra"
                name="tipoMuestra"
                value={formData.tipoMuestra}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="condicionRecepcion">Condición de Recepción:</label>
              <input
                type="text"
                id="condicionRecepcion"
                name="condicionRecepcion"
                value={formData.condicionRecepcion}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="numMuestra">Número de Muestra:</label>
              <input
                type="text"
                id="numMuestra"
                name="numMuestra"
                value={formData.numMuestra}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="numLote">Número de Lote:</label>
              <input
                type="text"
                id="numLote"
                name="numLote"
                value={formData.numLote}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fechaEntrega">Fecha de Entrega:</label>
              <input
                type="date"
                id="fechaEntrega"
                name="fechaEntrega"
                value={formData.fechaEntrega}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fechaVencimiento">Fecha de Vencimiento:</label>
              <input
                type="date"
                id="fechaVencimiento"
                name="fechaVencimiento"
                value={formData.fechaVencimiento}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>

        {/* Características Organolépticas */}
        <div className="form-section">
          <h3>Características Organolépticas</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="color">Color:</label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="olor">Olor:</label>
              <input
                type="text"
                id="olor"
                name="olor"
                value={formData.olor}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="sabor">Sabor:</label>
              <input
                type="text"
                id="sabor"
                name="sabor"
                value={formData.sabor}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="aspecto">Aspecto:</label>
              <input
                type="text"
                id="aspecto"
                name="aspecto"
                value={formData.aspecto}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="textura">Textura:</label>
              <input
                type="text"
                id="textura"
                name="textura"
                value={formData.textura}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="pesoNeto">Peso Neto:</label>
              <input
                type="number"
                step="0.01"
                id="pesoNeto"
                name="pesoNeto"
                value={formData.pesoNeto}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>

        {/* Parámetros Físico-Químicos */}
        <div className="form-section">
          <h3>Parámetros Físico-Químicos</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="acidez">Acidez:</label>
              <input
                type="number"
                step="0.01"
                id="acidez"
                name="acidez"
                value={formData.acidez}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="ph">pH:</label>
              <input
                type="number"
                step="0.01"
                id="ph"
                name="ph"
                value={formData.ph}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="humedad">Humedad:</label>
              <input
                type="number"
                step="0.01"
                id="humedad"
                name="humedad"
                value={formData.humedad}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cenizas">Cenizas:</label>
              <input
                type="number"
                step="0.01"
                id="cenizas"
                name="cenizas"
                value={formData.cenizas}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="densidad">Densidad:</label>
              <input
                type="number"
                step="0.001"
                id="densidad"
                name="densidad"
                value={formData.densidad}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gradoAlcoholico">Grado Alcohólico:</label>
              <input
                type="number"
                step="0.01"
                id="gradoAlcoholico"
                name="gradoAlcoholico"
                value={formData.gradoAlcoholico}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="solidosTotales">Sólidos Totales:</label>
              <input
                type="number"
                step="0.01"
                id="solidosTotales"
                name="solidosTotales"
                value={formData.solidosTotales}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="materiaGrasaCuantit">Materia Grasa (Cuantitativo):</label>
              <input
                type="number"
                step="0.01"
                id="materiaGrasaCuantit"
                name="materiaGrasaCuantit"
                value={formData.materiaGrasaCuantit}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>

        {/* Otros Parámetros */}
        <div className="form-section">
          <h3>Otros Parámetros</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="materiaGrasaCualit">Materia Grasa (Cualitativo):</label>
              <input
                type="text"
                id="materiaGrasaCualit"
                name="materiaGrasaCualit"
                value={formData.materiaGrasaCualit}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dureza">Dureza:</label>
              <input
                type="text"
                id="dureza"
                name="dureza"
                value={formData.dureza}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="extractoSeco">Extracto Seco:</label>
              <input
                type="text"
                id="extractoSeco"
                name="extractoSeco"
                value={formData.extractoSeco}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fecula">Fécula:</label>
              <input
                type="text"
                id="fecula"
                name="fecula"
                value={formData.fecula}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cumarina">Cumarina:</label>
              <input
                type="text"
                id="cumarina"
                name="cumarina"
                value={formData.cumarina}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="pruebaEber">Prueba Eber:</label>
              <input
                type="text"
                id="pruebaEber"
                name="pruebaEber"
                value={formData.pruebaEber}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tiempoCoccion">Tiempo de Cocción:</label>
              <input
                type="text"
                id="tiempoCoccion"
                name="tiempoCoccion"
                value={formData.tiempoCoccion}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="otrasDeterminaciones">Otras Determinaciones:</label>
              <textarea
                id="otrasDeterminaciones"
                name="otrasDeterminaciones"
                value={formData.otrasDeterminaciones}
                onChange={handleChange}
                className="form-control"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="referencia">Referencia:</label>
              <textarea
                id="referencia"
                name="referencia"
                value={formData.referencia}
                onChange={handleChange}
                className="form-control"
                rows="2"
              />
            </div>

            <div className="form-group">
              <label htmlFor="observaciones">Observaciones:</label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                className="form-control"
                rows="3"
              />
            </div>

            <div className="form-group checkbox-group">
              <label htmlFor="aptoConsumo">
                <input
                  type="checkbox"
                  id="aptoConsumo"
                  name="aptoConsumo"
                  checked={formData.aptoConsumo}
                  onChange={handleChange}
                />
                Apto para Consumo
              </label>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onVolver}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar y Enviar al Evaluador'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioRegistroAba;
