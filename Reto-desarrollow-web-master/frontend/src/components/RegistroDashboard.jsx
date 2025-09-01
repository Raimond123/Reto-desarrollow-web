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
        <h2>Seleccionar Tipo de Registro</h2>
        <p>Elige el formulario que necesitas completar:</p>
      </div>
      
      <div className="formularios-grid">
        <div className="formulario-card" onClick={() => seleccionarFormulario('agua')}>
          <div className="card-icon">💧</div>
          <h3>Registro de Agua</h3>
          <p>Análisis y registro de muestras de agua</p>
          <ul>
            <li>Análisis microbiológico</li>
            <li>Parámetros físico-químicos</li>
            <li>Control de calidad</li>
          </ul>
          <button className="btn btn-primary">Seleccionar</button>
        </div>

        <div className="formulario-card" onClick={() => seleccionarFormulario('aba')}>
          <div className="card-icon">🍽️</div>
          <h3>Registro ABA</h3>
          <p>Análisis de alimentos, bebidas y afines</p>
          <ul>
            <li>Análisis nutricional</li>
            <li>Control de calidad</li>
            <li>Parámetros organolépticos</li>
          </ul>
          <button className="btn btn-primary">Seleccionar</button>
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
        <div>
          <h1>Panel de Registro</h1>
          <p>Sistema de Registro y Documentación</p>
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
