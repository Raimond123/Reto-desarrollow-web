import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { registroService } from '../services/registroService';

const FormularioRegistroAgua = ({ onVolver }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ✅ Estado con campos básicos y los organolépticos
  const [formData, setFormData] = useState({
    regionSalud: '',
    dptoArea: '',
    tomadaPor: '',
    numOficio: '',
    numMuestra: '',
    enviadaPor: '',
    muestra: '',
    direccion: '',
    condicionMuestra: '',
    motivoSolicitud: '',
    fechaToma: '',
    fechaRecepcion: '',
    cloroResidual: '',
    temperaturaAmbiente: '',
    fechaReporte: '',
    microoroAerobios: '',
    pseudomonasSPP: '',
    metodologiaReferencia: '',
    observaciones: '',
    tipoCopa: '',
    estado: 'Por Asignar',
    // Nuevos campos organolépticos
    color: '',
    olor: '',
    sabor: '',
    aspecto: '',
    textura: '',
    pesoNeto: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // ✅ capturar correctamente el id del usuario
      let userId = user?.id;
      if (!userId) {
        const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
        userId = savedUser.id || 6;
      }

      // Construimos el objeto a enviar al backend
     const registroData = {
      RegionSalud: formData.regionSalud,
      DptoArea: formData.dptoArea,
      TomadaPor: formData.tomadaPor,
      NumOficio: formData.numOficio,
      NumMuestra: formData.numMuestra,
      EnviadaPor: formData.enviadaPor,
      Muestra: formData.muestra,
      Direccion: formData.direccion,
      CondicionMuestra: formData.condicionMuestra,
      MotivoSolicitud: formData.motivoSolicitud,
      FechaToma: formData.fechaToma || null,
      FechaRecepcion: formData.fechaRecepcion || null,
      CloroResidual: formData.cloroResidual ? parseFloat(formData.cloroResidual) : null,
      TemperaturaAmbiente: formData.temperaturaAmbiente ? parseFloat(formData.temperaturaAmbiente) : null,
      FechaReporte: formData.fechaReporte || null,
      MicrooroAerobios: formData.microoroAerobios,
      PseudomonasSPP: formData.pseudomonasSPP,
      MetodologiaReferencia: formData.metodologiaReferencia,
      Observaciones: formData.observaciones,
      TipoCopa: formData.tipoCopa,
      Estado: 'Por Asignar',
      UsuIdRegistro: userId,

      // ✅ Organolépticos en PascalCase
      Color: formData.color,
      Olor: formData.olor,
      Sabor: formData.sabor,
      Aspecto: formData.aspecto,
      Textura: formData.textura,
      PesoNeto: formData.pesoNeto ? parseFloat(formData.pesoNeto) : null
    };

      await registroService.guardarRegistroAgua(registroData);
      setSuccess('Registro de agua guardado exitosamente y enviado al evaluador');
      
      // Reiniciamos formulario después de 2 segundos
      setTimeout(() => {
        setFormData({
          regionSalud: '',
          dptoArea: '',
          tomadaPor: '',
          numOficio: '',
          numMuestra: '',
          enviadaPor: '',
          muestra: '',
          direccion: '',
          condicionMuestra: '',
          motivoSolicitud: '',
          fechaToma: '',
          fechaRecepcion: '',
          cloroResidual: '',
          temperaturaAmbiente: '',
          fechaReporte: '',
          microoroAerobios: '',
          pseudomonasSPP: '',
          metodologiaReferencia: '',
          observaciones: '',
          tipoCopa: '',
          estado: 'Por Asignar',
          color: '',
          olor: '',
          sabor: '',
          aspecto: '',
          textura: '',
          pesoNeto: ''
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
        <div className="header-left">
          <button className="btn btn-back" onClick={onVolver}>
            ← Volver a Selección
          </button>
        </div>
        <div className="header-center">
          <div className="form-title-container">
            <div className="form-icon">💧</div>
            <div className="form-title-text">
              <h2>Formulario de Registro de Agua</h2>
              <p>Análisis Hídrico - DIGEMAPS</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="form-badge agua-badge">Análisis Hídrico</div>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit} className="registro-form">
        
        {/* Información General */}
        <div className="form-section agua-section">
          <div className="section-header">
            <div className="section-icon">📊</div>
            <h3>Información General</h3>
            <div className="section-line"></div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="regionSalud">Región de Salud:</label>
              <input
                type="text"
                id="regionSalud"
                name="regionSalud"
                value={formData.regionSalud}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dptoArea">Departamento/Área:</label>
              <input
                type="text"
                id="dptoArea"
                name="dptoArea"
                value={formData.dptoArea}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tomadaPor">Tomada Por:</label>
              <input
                type="text"
                id="tomadaPor"
                name="tomadaPor"
                value={formData.tomadaPor}
                onChange={handleChange}
                className="form-control"
              />
            </div>

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
              <label htmlFor="enviadaPor">Enviada Por:</label>
              <input
                type="text"
                id="enviadaPor"
                name="enviadaPor"
                value={formData.enviadaPor}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>

        {/* Información de la Muestra */}
        <div className="form-section agua-section">
          <div className="section-header">
            <div className="section-icon">🧪</div>
            <h3>Información de la Muestra</h3>
            <div className="section-line"></div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="muestra">Muestra:</label>
              <input
                type="text"
                id="muestra"
                name="muestra"
                value={formData.muestra}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="direccion">Dirección:</label>
              <textarea
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="form-control"
                rows="2"
              />
            </div>

            <div className="form-group">
              <label htmlFor="condicionMuestra">Condición de la Muestra:</label>
              <select
                id="condicionMuestra"
                name="condicionMuestra"
                value={formData.condicionMuestra}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">-- Seleccione una opción --</option>
                <option value="Buena">Buena</option>
                <option value="Turbia">Turbia</option>
                <option value="Con sedimentos">Con sedimentos</option>
                <option value="Mal olor">Mal olor</option>
                <option value="Color anormal">Color anormal</option>
              </select>
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
              <label htmlFor="fechaToma">Fecha de Toma:</label>
              <input
                type="date"
                id="fechaToma"
                name="fechaToma"
                value={formData.fechaToma}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fechaRecepcion">Fecha de Recepción:</label>
              <input
                type="date"
                id="fechaRecepcion"
                name="fechaRecepcion"
                value={formData.fechaRecepcion}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>

        {/* ✅ Características Organolépticas */}
        <div className="form-section agua-section">
          <div className="section-header">
            <div className="section-icon">👃</div>
            <h3>Características Organolépticas</h3>
            <div className="section-line"></div>
          </div>
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
              <label htmlFor="pesoNeto">Peso Neto (litros):</label>
              <input
                type="number"
                id="pesoNeto"
                name="pesoNeto"
                value={formData.pesoNeto}
                onChange={handleChange}
                className="form-control"
                min="0"
                step="0.01" 
                placeholder=""
              />
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-cancel"
            onClick={onVolver}
          >
            ❌ Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-submit agua-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Guardando...
              </>
            ) : (
              <>
                💾 Guardar y Enviar al Evaluador
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioRegistroAgua;