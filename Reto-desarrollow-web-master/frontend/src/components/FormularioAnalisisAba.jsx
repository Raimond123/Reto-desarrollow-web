import React, { useState } from 'react';
import { analistaService } from '../services/analistaService';
import '../styles/FormularioAnalisisAgua.css';

const FormularioAnalisisAba = ({ registro, onVolver, onFinalizar }) => {
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
      const analisisData = { 
        Id: registro.id,
        NumOficio: registro.numOficio,
        NombreSolicitante: registro.nombreSolicitante,
        FechaRecibo: registro.fechaRecibo,
        TipoMuestra: registro.tipoMuestra,
        CondicionRecepcion: registro.condicionRecepcion,
        NumMuestra: registro.numMuestra,
        NumLote: registro.numLote,
        FechaEntrega: registro.fechaEntrega,
        Color: registro.color,
        Olor: registro.olor,
        Sabor: registro.sabor,
        Aspecto: registro.aspecto,
        Textura: registro.textura,
        PesoNeto: registro.pesoNeto,
        FechaVencimiento: registro.fechaVencimiento,
        
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
        
        UsuIdRegistro: registro.usuIdRegistro,
        UsuIdAnalista: registro.usuIdAnalista,
        UsuIdEvaluador: registro.usuIdEvaluador
      };
      
      console.log('Enviando datos ABA al backend:', analisisData);
      await analistaService.guardarAnalisisAba(registro.id, analisisData);
      setMensaje('✅ Análisis guardado exitosamente');
      setTimeout(() => onFinalizar(), 1500);
    } catch (err) {
      console.error('Error completo ABA:', err);
      setMensaje(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // renderInput modificado con referencia
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
        <h2 className="titulo-grande">🥘 Analizar Registro ABA #{registro.id}</h2>
      </div>

      {mensaje && <div className="alert">{mensaje}</div>}

      <form onSubmit={handleSubmit} className="registro-form">
        
        {/* Fisicoquímicos */}
        <div className="form-section">
          <h3 className="subtitulo">Parámetros Fisicoquímicos</h3>
          <div className="form-grid">
            {renderInput("pH", "number", "ph", "0.01", "Alimentos: 4.6 (punto crítico) - Bebidas: 3.0 - 4.2 aprox.")}
            {renderInput("Acidez", "number", "acidez", "0.01", "Depende del producto: vinos 6–8 g/L; jugos 0.1–0.3%")}
            {renderInput("Cloro Residual", "number", "cloroResidual", "0.01", "Solo en agua usada: 0.2 – 1.5 mg/L")}
            {renderInput("Cenizas", "number", "cenizas", "0.01", "Alimentos: 2–5% máx, depende del producto")}
            {renderInput("Cumarina", "text", "cumarina", null, "Permitido solo trazas (aditivo restringido)")}
            {renderInput("Cloruro", "number", "cloruro", "0.01", "En bebidas ≤ 250 mg/L")}
            {renderInput("Densidad", "number", "densidad", "0.001", "Vinos: 0.990 – 1.010 g/mL, depende alcohol")}
            {renderInput("Extracto Seco", "text", "extractoSeco", null, "Depende del producto: vino > 18 g/L")}
            {renderInput("Fécula", "text", "fecula", null, "Alimentos: presente en harinas, no en bebidas")}
            {renderInput("Grado Alcohólico", "number", "gradoAlcoholico", "0.01", "Vinos 8–15%, cervezas 3–8%, spirits 20–50%")}
            {renderInput("Humedad", "number", "humedad", "0.01", "Alimentos secos máx. 10–15%")}
            {renderInput("Índice de Refacción", "number", "indiceRefaccion", "0.001", "Jugos/frutas: 1.333 – 1.350")}
            {renderInput("Índice Acidez", "number", "indiceAcidez", "0.01", "Aceites: oleico máx. 0.6 – 2.0")}
            {renderInput("Índice Rancidez", "number", "indiceRancidez", "0.01", "Valor Peróxidos aceites < 20 meqO2/kg")}
            {renderInput("Materia Grasa Cualitativa", "text", "materiaGrasaCualit", null, "Solo aplicable en lácteos/aceites")}
            {renderInput("Materia Grasa Cuantitativa", "number", "materiaGrasaCuantit", "0.01", "Leches 3.0–3.5%, aceites 100%")}
            {renderInput("Prueba de Eber", "text", "pruebaEber", null, "Usada en vinos para aldehídos")}
            {renderInput("Sólidos Totales", "number", "solidosTotales", "0.01", "Jugos naturales 8–12°Brix")}
            {renderInput("Tiempo de Cocción", "text", "tiempoCoccion", null, "Depende del alimento")}
            {renderTextarea("Otras Determinaciones", "otrasDeterminaciones")}
            {renderInput("Referencia", "text", "referencia")}
            {renderInput("Temperatura Ambiente", "number", "temperaturaAmbiente", "0.01", "Ideal conservación: 15–25 °C")}
            {renderInput("Fecha Reporte", "date", "fechaReporte")}
          </div>
        </div>

        {/* Microbiológicos */}
        <div className="form-section">
          <h3 className="subtitulo">Parámetros Microbiológicos</h3>
          <div className="form-grid">
            {renderInput("Microorganismos Aerobios", "text", "resMicroorganismosAerobios", null, "≤ 10^5 UFC/g en la mayoría de alimentos")}
            {renderInput("Recuento Coliformes", "text", "resRecuentoColiformes", null, "≤ 10² UFC/g (según alimento)")}
            {renderInput("Coliformes Totales", "text", "resColiformesTotales", null, "Aceptable: 0 – 10² UFC/g dependiendo")}
            {renderInput("E. Coli", "text", "resEColi", null, "Ausente en 25 g / 100 mL")}
            {renderInput("Pseudomonas SPP", "text", "resPseudomonasSpp", null, "Ausente en 25 g")}
            {renderInput("Salmonella SPP", "text", "resSalmonellaSpp", null, "Ausente en 25 g")}
            {renderInput("Estafilococos Aureus", "text", "resEstafilococosAureus", null, "< 100 UFC/g en alimentos listos")}
            {renderInput("Hongos", "text", "resHongos", null, "≤ 10² – 10³ UFC/g (según norma)")}
            {renderInput("Levaduras", "text", "resLevaduras", null, "≤ 10² – 10³ UFC/g (según norma)")}
            {renderInput("Esterilidad Comercial", "text", "resEsterilidadComercial", null, "Conservas: deber cumplir (0 crecimiento)")}
            {renderInput("Listeria Monocytogenes", "text", "resListeriaMonocytogenes", null, "Ausente en 25 g")}
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

export default FormularioAnalisisAba;