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
    
    // Solo campos necesarios para el backend
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
      // Obtener ID del usuario con múltiples fallbacks
      let userId = user?.UsuarioId || user?.usu_id || user?.usuarioId;
      
      // Si no se encuentra en el objeto user, intentar localStorage
      if (!userId) {
        try {
          const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
          userId = savedUser.UsuarioId || savedUser.usu_id || savedUser.usuarioId;
        } catch (error) {
          console.error('Error parsing localStorage user:', error);
        }
      }
      
      // Como último recurso, usar ID 6 que corresponde a Pedro Registro
      if (!userId) {
        console.warn('No se pudo obtener ID del usuario, usando ID por defecto 6 (Pedro Registro)');
        userId = 6;
      }

      const registroData = {
        numOficio: formData.numOficio,
        fechaRecibo: formData.fechaRecibo || null,
        nombreSolicitante: formData.nombreSolicitante,
        motivoSolicitud: formData.motivoSolicitud,
        tipoMuestra: formData.tipoMuestra,
        condicionRecepcion: formData.condicionRecepcion,
        numMuestra: formData.numMuestra,
        numLote: formData.numLote,
        fechaEntrega: formData.fechaEntrega || null,
        color: formData.color,
        olor: formData.olor,
        sabor: formData.sabor,
        aspecto: formData.aspecto,
        textura: formData.textura,
        pesoNeto: formData.pesoNeto ? parseFloat(formData.pesoNeto) : null,
        fechaVencimiento: formData.fechaVencimiento || null,
        observaciones: formData.observaciones,
        aptoConsumo: formData.aptoConsumo,
        estado: 'Por Asignar',
        usuIdRegistro: userId
      };

      console.log('Intentando guardar registro ABA...');
      await registroService.guardarRegistroAba(registroData);
      console.log('Registro ABA guardado exitosamente');
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

        {/* Observaciones y Estado Final */}
        <div className="form-section">
          <h3>Observaciones</h3>
          <div className="form-grid">
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
