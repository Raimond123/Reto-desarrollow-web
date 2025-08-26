import React from 'react';
import { useAuth } from '../context/AuthContext';

const RegistroDashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
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

      <div className="card">
        <h2>Funcionalidades de Registro</h2>
        <p>Aquí se implementarán las funcionalidades específicas para el rol de Registro:</p>
        <ul>
          <li>Registro de documentos</li>
          <li>Control de archivos</li>
          <li>Gestión de expedientes</li>
          <li>Seguimiento de procesos</li>
        </ul>
      </div>
    </div>
  );
};

export default RegistroDashboard;
