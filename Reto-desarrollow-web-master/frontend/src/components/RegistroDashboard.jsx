import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FormularioRegistroAgua from './FormularioRegistroAgua';
import FormularioRegistroAba from './FormularioRegistroAba';

const RegistroDashboard = () => {
  const { user, logout } = useAuth();
  const [formularioSeleccionado, setFormularioSeleccionado] = useState(null);

  const handleLogout = () => {
    logout();
  };

  const seleccionarFormulario = (tipo) => {
    setFormularioSeleccionado(tipo);
  };

  const volverASeleccion = () => {
    setFormularioSeleccionado(null);
  };

  const renderSeleccionFormularios = () => (
    <div className="formularios-selection">
      <div className="selection-header">
        <div className="selection-title">
          <h2>📋 Seleccionar Tipo de Registro</h2>
          <p>Elige el tipo de análisis que necesitas registrar en el sistema</p>
        </div>
        <div className="selection-stats">
          <div className="stat-item">
            <span className="stat-number">2</span>
            <span className="stat-label">Tipos Disponibles</span>
          </div>
        </div>
      </div>
      
      <div className="formularios-grid">
        <div className="formulario-card agua-card" onClick={() => seleccionarFormulario('agua')}>
          <div className="card-header">
            <div className="card-icon agua-icon">💧</div>
            <div className="card-badge">Análisis Hídrico</div>
          </div>
          <div className="card-content">
            <h3>Registro de Agua</h3>
            <p>Análisis completo de muestras hídricas para consumo y uso industrial</p>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">🦠</span>
                <span>Análisis microbiológico</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚗️</span>
                <span>Parámetros físico-químicos</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✅</span>
                <span>Control de calidad</span>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary card-btn">Iniciar Registro</button>
          </div>
        </div>

        <div className="formulario-card aba-card" onClick={() => seleccionarFormulario('aba')}>
          <div className="card-header">
            <div className="card-icon aba-icon">🍽️</div>
            <div className="card-badge">Análisis Alimentario</div>
          </div>
          <div className="card-content">
            <h3>Registro ABA</h3>
            <p>Análisis integral de alimentos, bebidas y productos afines</p>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">🥗</span>
                <span>Análisis nutricional</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔍</span>
                <span>Control de calidad</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👃</span>
                <span>Parámetros organolépticos</span>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary card-btn">Iniciar Registro</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFormulario = () => {
    switch (formularioSeleccionado) {
      case 'agua':
        return <FormularioRegistroAgua onVolver={volverASeleccion} />;
      case 'aba':
        return <FormularioRegistroAba onVolver={volverASeleccion} />;
      default:
        return renderSeleccionFormularios();
    }
  };

  return (
    <div className="container">
      <div className="app-header">
        <div className="header-brand">
          <div className="brand-icon">🧪</div>
          <div className="brand-text">
            <h1>DIGEMAPS</h1>
            <p>Panel de Registro - Sistema de Gestión de Análisis</p>
          </div>
        </div>
        <div className="user-info">
          <span>Bienvenido, {user?.nombre}</span>
          <span>({user?.rol})</span>
          <button 
            className="btn btn-logout"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {renderFormulario()}
      </div>
    </div>
  );
};

export default RegistroDashboard;
