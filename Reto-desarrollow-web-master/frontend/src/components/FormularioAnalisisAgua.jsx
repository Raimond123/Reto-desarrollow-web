import React, { useState, useEffect } from 'react';
import { analistaService } from '../services/analistaService';
import '../styles/FormularioAnalisisAgua.css';  // estilos personalizados

const FormularioAnalisisAgua = ({ registro, onVolver, onFinalizar }) => {
  const [formData, setFormData] = useState({
    // Físico-químico (solo los que el analista llena)
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

  const [registroCompleto, setRegistroCompleto] = useState(registro); // aquí guardamos el registro con organolépticos completos
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  // 🔹 Al montar, traer el registro completo
  useEffect(() => {
    const fetchRegistro = async () => {
      try {
        const res = await fetch(`http://localhost:7051/api/RegistroAgua/${registro.id}`);
        const data = await res.json();
        setRegistroCompleto(data);  // ahora tenemos Color, Olor, etc
      } catch (error) {
        console.error("Error al cargar registro por id:", error);
      }
    };
    fetchRegistro();
  }, [registro]);

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
      // Usar registroCompleto con organolépticos
      const analisisData = { 
        Id: registroCompleto.id,
        RegionSalud: registroCompleto.regionSalud,
        DptoArea: registroCompleto.dptoArea,
        TomadaPor: registroCompleto.tomadaPor,
        NumOficio: registroCompleto.numOficio,
        NumMuestra: registroCompleto.numMuestra,
        EnviadaPor: registroCompleto.enviadaPor,
        Muestra: registroCompleto.muestra,
        Direccion: registroCompleto.direccion,
        CondicionMuestra: registroCompleto.condicionMuestra,
        MotivoSolicitud: registroCompleto.motivoSolicitud,
        FechaToma: registroCompleto.fechaToma,
        FechaRecepcion: registroCompleto.fechaRecepcion,

        // 👇 Organolépticos del backend (solo lectura)
        Color: registroCompleto.color,
        Olor: registroCompleto.olor,
        Sabor: registroCompleto.sabor,
        Aspecto: registroCompleto.aspecto,
        Textura: registroCompleto.textura,
        PesoNeto: registroCompleto.pesoNeto,
        FechaVencimiento: registroCompleto.fechaVencimiento,
        
        // Fisicoquímicos
        Acidez: formData.acidez ? parseFloat(formData.acidez) : null,
        CloroResidual: formData.cloroResidual ? parseFloat(formData.cloroResidual) : null,
        Cenizas: formData.cenizas ? parseFloat(formData.cenizas) : null,
        Cumarina: formData.cumarina || null,
        Cloruro: formData.cloruro ? parseFloat(formData.cloruro) : null,
        Densidad: formData.densidad ? parseFloat(formData.densidad) : null,
        Dureza: formData.dureza || null,
        ExtractoSeco: formData.extractoSeco || null,
        Fecula: formData.fecula || null,
        GradoAlcoholico: formData.gradoAlcoholico ? parseFloat(formData.gradoAlcoholico) : null,
        Humedad: formData.humedad ? parseFloat(formData.humedad) : null,
        IndiceRefaccion: formData.indiceRefaccion ? parseFloat(formData.indiceRefaccion) : null,
        IndiceAcidez: formData.indiceAcidez ? parseFloat(formData.indiceAcidez) : null,
        IndiceRancidez: formData.indiceRancidez ? parseFloat(formData.indiceRancidez) : null,
        MateriaGrasaCualit: formData.materiaGrasaCualit || null,
        MateriaGrasaCuantit: formData.materiaGrasaCuantit ? parseFloat(formData.materiaGrasaCuantit) : null,
        PH: formData.ph ? parseFloat(formData.ph) : null,
        PruebaEber: formData.pruebaEber || null,
        SolidosTotales: formData.solidosTotales ? parseFloat(formData.solidosTotales) : null,
        TiempoCoccion: formData.tiempoCoccion || null,
        OtrasDeterminaciones: formData.otrasDeterminaciones || null,
        Referencia: formData.referencia || null,
        TemperaturaAmbiente: formData.temperaturaAmbiente ? parseFloat(formData.temperaturaAmbiente) : null,
        FechaReporte: formData.fechaReporte || null,
        
        // Microbiológicos
        ResMicroorganismosAerobios: formData.resMicroorganismosAerobios || null,
        ResRecuentoColiformes: formData.resRecuentoColiformes || null,
        ResColiformesTotales: formData.resColiformesTotales || null,
        ResPseudomonasSpp: formData.resPseudomonasSpp || null,
        ResEColi: formData.resEColi || null,
        ResSalmonellaSpp: formData.resSalmonellaSpp || null,
        ResEstafilococosAureus: formData.resEstafilococosAureus || null,
        ResHongos: formData.resHongos || null,
        ResLevaduras: formData.resLevaduras || null,
        ResEsterilidadComercial: formData.resEsterilidadComercial || null,
        ResListeriaMonocytogenes: formData.resListeriaMonocytogenes || null,
        MetodologiaReferencia: formData.metodologiaReferencia || null,
        Equipos: formData.equipos || null,
        
        Observaciones: formData.observaciones || null,
        AptoConsumo: formData.aptoConsumo,
        Estado: 'Por Evaluar',
        
        UsuIdRegistro: registroCompleto.usuIdRegistro,
        UsuIdAnalista: registroCompleto.usuIdAnalista,
        UsuIdEvaluador: registroCompleto.usuIdEvaluador
      };
      
      console.log('Enviando datos al backend:', analisisData);
      await analistaService.guardarAnalisisAgua(registro.id, analisisData);
      setMensaje('✅ Análisis guardado exitosamente');
      setTimeout(() => onFinalizar(), 1500);
    } catch (err) {
      console.error('Error completo:', err);
      setMensaje(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Render inputs reutilizable
  const renderInput = (label, type, name, step = null, referencia = null) => (
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
      {referencia && (
        <small className="text-muted">Referencia: {referencia}</small>
      )}
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

        {/* 👅 Características Organolépticas (solo lectura) */}
        <div className="form-section">
          <h3 className="subtitulo">Características Organolépticas (Registro base)</h3>
          <div className="form-grid">
            <p><strong>Color:</strong> {registroCompleto.color}</p>
            <p><strong>Olor:</strong> {registroCompleto.olor}</p>
            <p><strong>Sabor:</strong> {registroCompleto.sabor}</p>
            <p><strong>Aspecto:</strong> {registroCompleto.aspecto}</p>
            <p><strong>Textura:</strong> {registroCompleto.textura}</p>
            <p><strong>Peso Neto:</strong> {registroCompleto.pesoNeto}</p>
          </div>
        </div>
        
        {/* ⚗️ Fisicoquímicos */}
        <div className="form-section">
          <h3 className="subtitulo">Parámetros Fisicoquímicos</h3>
          <div className="form-grid">
            {renderInput("pH", "number", "ph", "0.01", "Aceptable: 6.5 - 8.5")}
            {renderInput("Cloro Residual", "number", "cloroResidual", "0.01", "Aceptable: 0.2 - 1.5 mg/L")}
            {renderInput("Acidez", "number", "acidez", "0.01", "Máx. ~20 mg/L como CaCO₃")}
            {renderInput("Cloruro", "number", "cloruro", "0.01", "Máx. 250 mg/L")}
            {renderInput("Sólidos Totales", "number", "solidosTotales", "0.01", "Máx. 1000 mg/L (ideal ≤ 500 mg/L)")}
            {renderInput("Dureza", "text", "dureza", null, "Máx. 500 mg/L (recomendado <200)")}
            {renderInput("Temperatura Ambiente", "number", "temperaturaAmbiente", "0.01", "Ideal: 15 - 25 °C")}
            {/* Otros */}
            {renderInput("Cenizas", "number", "cenizas", "0.01")}
            {renderInput("Cumarina", "text", "cumarina")}
            {renderInput("Densidad", "number", "densidad", "0.001")}
            {renderInput("Extracto Seco", "text", "extractoSeco")}
            {renderInput("Fécula", "text", "fecula")}
            {renderInput("Grado Alcohólico", "number", "gradoAlcoholico", "0.01")}
            {renderInput("Humedad", "number", "humedad", "0.01")}
            {renderInput("Índice Refacción", "number", "indiceRefaccion", "0.001")}
            {renderInput("Índice Acidez", "number", "indiceAcidez", "0.01")}
            {renderInput("Índice Rancidez", "number", "indiceRancidez", "0.01")}
            {renderInput("Materia Grasa Cualitativa", "text", "materiaGrasaCualit")}
            {renderInput("Materia Grasa Cuantitativa", "number", "materiaGrasaCuantit", "0.01")}
            {renderInput("Prueba de Eber", "text", "pruebaEber")}
            {renderInput("Tiempo de Cocción", "text", "tiempoCoccion")}
            {renderTextarea("Otras Determinaciones", "otrasDeterminaciones")}
            {renderInput("Referencia", "text", "referencia")}
            {renderInput("Fecha Reporte", "date", "fechaReporte")}
          </div>
        </div>

        {/* 🦠 Microbiológicos */}
        <div className="form-section">
          <h3 className="subtitulo">Parámetros Microbiológicos</h3>
          <div className="form-grid">
            {renderInput("Microorganismos Aerobios", "text", "resMicroorganismosAerobios", null, "≤ 100 UFC/mL")}
            {renderInput("Recuento Coliformes", "text", "resRecuentoColiformes", null, "Aceptable: 0 UFC/100 mL")}
            {renderInput("Coliformes Totales", "text", "resColiformesTotales", null, "Aceptable: 0 UFC/100 mL")}
            {renderInput("E. Coli", "text", "resEColi", null, "Aceptable: 0 UFC/100 mL")}
            {renderInput("Pseudomonas SPP", "text", "resPseudomonasSpp", null, "Aceptable: 0 UFC/100 mL")}
            {renderInput("Salmonella SPP", "text", "resSalmonellaSpp", null, "Ausente en 100 mL")}
            {renderInput("Estafilococos Aureus", "text", "resEstafilococosAureus", null, "Ausente en 100 mL")}
            {renderInput("Hongos", "text", "resHongos", null, "Ausencia esperada")}
            {renderInput("Levaduras", "text", "resLevaduras", null, "Ausencia esperada")}
            {renderInput("Esterilidad Comercial", "text", "resEsterilidadComercial", null, "Debe cumplirse (sin crecimiento)")}
            {renderInput("Listeria Monocytogenes", "text", "resListeriaMonocytogenes", null, "Ausente en 100 mL")}
            {renderInput("Metodología Referencia", "text", "metodologiaReferencia")}
            {renderInput("Equipos", "text", "equipos")}
            {renderTextarea("Observaciones", "observaciones")}

            <div className="form-check-lg">
              <input type="checkbox" name="aptoConsumo" checked={formData.aptoConsumo} onChange={handleChange}/>
              <label>Apto para Consumo</label>
            </div>
          </div>
        </div>

        {/* Botón */}
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